var steam = require("steam");

const DOTA_APP_ID = 570;

var EventEmitter = require('events').EventEmitter,
    fs = require("fs"),
    path = require("path"),
    util = require("util"),
    bignumber = require("bignumber.js"),
    ProtoBuf = require('protobufjs'),
    Dota2 = exports;

var builder = ProtoBuf.newBuilder();
var folder = fs.readdirSync(__dirname+'/proto');
folder.forEach(function(f){
    ProtoBuf.loadProtoFile(__dirname+'/proto/'+f, builder);
});
Dota2.schema = builder.build();
Dota2.ServerRegion = {
    UNSPECIFIED: 0,
    USWEST: 1,
    USEAST: 2,
    EUROPE: 3,
    KOREA: 4,
    SINGAPORE: 5,
    AUSTRALIA: 7,
    STOCKHOLM: 8,
    AUSTRIA: 9,
    BRAZIL: 10,
    SOUTHAFRICA: 11,
    PERFECTWORLDTELECOM: 12,
    PERFECTWORLDUNICOM: 13
};

var Dota2Client = function Dota2Client(steamClient, debug, debugMore) {
  EventEmitter.call(this);

  this.debug = debug || false;
  this.debugMore = debugMore || false;

  var steamUser = new steam.SteamUser(steamClient);
  this._user = steamUser;
  this._client = steamClient;
  this._gc = new steam.SteamGameCoordinator(steamClient, DOTA_APP_ID);
  this._appid = DOTA_APP_ID;
  this.chatChannels = []; // Map channel names to channel data.
  this._gcReady = false;
  this._gcClientHelloIntervalId = null;
  this._gcConnectionStatus = Dota2.schema.GCConnectionStatus.GCConnectionStatus_NO_SESSION;
  // This should probably be reworked to use a CMsgProtoBufHeader object
  this._protoBufHeader = {
    "msg":    "",
    "proto":  {
      "client_steam_id": this._client.steamID,
      "source_app_id":  this._appid
    }
  };

  var self = this;
  this._gc.on("message", function fromGC(header, body, callback) {
    /* Routes messages from Game Coordinator to their handlers. */
    callback = callback || null;

    var kMsg = header.msg;
    if (self.debugMore) util.log("Dota2 fromGC: " + kMsg);  // TODO:  Turn type-protoMask into key name.

    if (kMsg in self._handlers) {
      if (callback) {
        self._handlers[kMsg].call(self, body, callback);
      }
      else {
        self._handlers[kMsg].call(self, body);
      }
    }
    else {
      self.emit("unhandled", kMsg);
    }
  });

  this._sendClientHello = function() {
    if(self._gcReady)
    {
      if(self._gcClientHelloIntervalId)
      {
        clearInterval(self._gcClientHelloIntervalId);
        self._gcClientHelloIntervalId = null;
      }
      return;
    }
    if(self._gcClientHelloCount > 10)
    {
      if(self.debug) util.log("ClientHello has taken longer than 30 seconds! Reporting timeout...");
      self._gcClientHelloCount = 0;
      self.emit("hellotimeout");
    }

    if (self.debug) util.log("Sending ClientHello");
    if (!self._gc) {
      util.log("Where the fuck is _gc?");
    }
    else {
      self._protoBufHeader.msg = Dota2.schema.EGCBaseClientMsg.k_EMsgGCClientHello;
      var payload = new Dota2.schema.CMsgClientHello({});
      payload.engine = 1;
      payload.secret_key= "";
      payload.client_session_need= 104;
      self._gc.send(
        self._protoBufHeader,
        payload.toBuffer()
      );
    }

    self._gcClientHelloCount++;
  };
};
util.inherits(Dota2Client, EventEmitter);

// Expose enums
Dota2Client.prototype.ServerRegion = Dota2.ServerRegion;
Dota2Client.prototype.ToAccountID = function(accid){
  return new bignumber(accid).minus('76561197960265728')-0;
};
Dota2Client.prototype.ToSteamID = function(accid){
  return new bignumber(accid).plus('76561197960265728')+"";
};

// Methods
Dota2Client.prototype.launch = function() {
  /* Reports to Steam that we are running Dota 2. Initiates communication with GC with EMsgGCClientHello */
  if (this.debug) util.log("Launching Dota 2");
  this.AccountID = this.ToAccountID(this._client.steamID);
  this.Party = null;
  this.Lobby = null;
  this.PartyInvite = null;
  this._user.gamesPlayed([{"game_id": this._appid}]);

  // Keep knocking on the GCs door until it accepts us.
  // This is very bad practice and quite trackable.
  // The real client tends to send only one of these.
  // Really we should just send one when the connection status is GC online
  this._gcClientHelloCount = 0;
  this._gcClientHelloIntervalId = setInterval(this._sendClientHello, 6000);

  //Also immediately send clienthello
  setTimeout(this._sendClientHello, 1000);
};

Dota2Client.prototype.exit = function() {
  /* Reports to Steam we are not running any apps. */
  if (this.debug) util.log("Exiting Dota 2");

  /* stop knocking if exit comes before ready event */
  if (this._gcClientHelloIntervalId) {
      clearInterval(this._gcClientHelloIntervalId);
      this._gcClientHelloIntervalId = null;
  }
  this._gcReady = false;

  if(this._user.loggedOn) this._user.gamesPlayed([]);
};


// Handlers

var handlers = Dota2Client.prototype._handlers = {};

handlers[Dota2.schema.EGCBaseClientMsg.k_EMsgGCClientWelcome] = function clientWelcomeHandler(message) {
  /* Response to our k_EMsgGCClientHello, now we can execute other GC commands. */

  // Only execute if _gcClientHelloIntervalID, otherwise it's already been handled (and we don't want to emit multiple 'ready');
  if (this._gcClientHelloIntervalId) {
    clearInterval(this._gcClientHelloIntervalId);
    this._gcClientHelloIntervalId = null;
  }

  if (this.debug) util.log("Received client welcome.");

  // Parse any caches
  this._gcReady = true;
  //this._handleWelcomeCaches(message);
  this.emit("ready");
};

handlers[Dota2.schema.EGCBaseClientMsg.k_EMsgGCClientConnectionStatus] = function gcClientConnectionStatus(message) {
  /* Catch and handle changes in connection status, cuz reasons u know. */

  var status = Dota2.schema.CMsgConnectionStatus.decode(message).status;
  if(status) this._gcConnectionStatus = status;

  switch (status) {
    case Dota2.schema.GCConnectionStatus.GCConnectionStatus_HAVE_SESSION:
      if (this.debug) util.log("GC Connection Status regained.");

      // Only execute if _gcClientHelloIntervalID, otherwise it's already been handled (and we don't want to emit multiple 'ready');
      if (this._gcClientHelloIntervalId) {
        clearInterval(this._gcClientHelloIntervalId);
        this._gcClientHelloIntervalId = null;

        this._gcReady = true;
        this.emit("ready");
      }
      break;

    default:
      if (this.debug) util.log("GC Connection Status unreliable - " + status);

      // Only execute if !_gcClientHelloIntervalID, otherwise it's already been handled (and we don't want to emit multiple 'unready');
      if (!this._gcClientHelloIntervalId) {
        this._gcClientHelloIntervalId = setInterval(this._sendClientHello, 5000); // Continually try regain GC session

        this._gcReady = false;
        this.emit("unready");
      }
      break;
  }
};

Dota2.Dota2Client = Dota2Client;

require("./handlers/cache");
require("./handlers/inventory");
require("./handlers/chat");
require("./handlers/guild");
require("./handlers/community");
require("./handlers/helper");
require("./handlers/match");
require("./handlers/lobbies");
require("./handlers/parties");
require("./handlers/leagues");
require("./handlers/sourcetv");
