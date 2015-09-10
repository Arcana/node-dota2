var EventEmitter = require('events').EventEmitter,
    fs = require("fs"),
    util = require("util"),
    bignumber = require("bignumber.js"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/gcsdk_gcmessages.desc")),
    dota_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/dota_gcmessages.desc")),
    protoMask = 0x80000000,
    Dota2 = exports;

var Dota2Client = function Dota2Client(steamClient, debug, debugMore) {
  EventEmitter.call(this);

  this.debug = debug || false;
  this.debugMore = debugMore || false;
  this._client = steamClient;
  this._appid = 570;
  this.chatChannels = []; // Map channel names to channel data.
  this._gcReady = false,
  this._gcClientHelloIntervalId = null;
  this._gcConnectionStatus = Dota2.GCConnectionStatus.GCConnectionStatus_NO_SESSION;

  var self = this;
  this._client.on("fromGC", function fromGC(app, type, message, callback) {
    /* Routes messages from Game Coordinator to their handlers. */
    callback = callback || null;

    var kMsg = type & ~protoMask;
    if (self.debugMore) util.log("Dota2 fromGC: " + [app, kMsg].join(", "));  // TODO:  Turn type-protoMask into key name.

    if (kMsg in self._handlers) {
      if (callback) {
        self._handlers[kMsg].call(self, message, callback);
      }
      else {
        self._handlers[kMsg].call(self, message);
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
    if (!self._client) {
      util.log("Where the fuck is _client?");
    }
    else {
      self._client.toGC(self._appid, (Dota2.EGCBaseClientMsg.k_EMsgGCClientHello | protoMask), gcsdk_gcmessages.CMsgClientHello.serialize({engine: Dota2.SourceEngine.Source2, secret_key: "", client_session_need: 104}));
    }

    self._gcClientHelloCount++;
  };
};
util.inherits(Dota2Client, EventEmitter);

require("./generated/messages");

// Expose enums
Dota2Client.prototype.ServerRegion = Dota2.ServerRegion;
Dota2Client.prototype.GameMode = Dota2.GameMode;
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
  this._client.gamesPlayed([this._appid]);

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
  
  if(this._client.loggedOn) this._client.gamesPlayed([]);
};


// Handlers

var handlers = Dota2Client.prototype._handlers = {};

handlers[Dota2.EGCBaseClientMsg.k_EMsgGCClientWelcome] = function clientWelcomeHandler(message) {
  /* Response to our k_EMsgGCClientHello, now we can execute other GC commands. */

  // Only execute if _gcClientHelloIntervalID, otherwise it's already been handled (and we don't want to emit multiple 'ready');
  if (this._gcClientHelloIntervalId) {
    clearInterval(this._gcClientHelloIntervalId);
    this._gcClientHelloIntervalId = null;
  }

  if (this.debug) util.log("Received client welcome.");

  // Parse any caches
  this._gcReady = true;
  this._handleWelcomeCaches(message);
  this.emit("ready");
};

handlers[Dota2.EGCBaseClientMsg.k_EMsgGCClientConnectionStatus] = function gcClientConnectionStatus(message) {
  /* Catch and handle changes in connection status, cuz reasons u know. */

  var status = gcsdk_gcmessages.CMsgConnectionStatus.parse(message).status;
  if(status) this._gcConnectionStatus = status;

  switch (status) {
    case Dota2.GCConnectionStatus.GCConnectionStatus_HAVE_SESSION:
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
require("./handlers/match");
require("./handlers/lobbies");
require("./handlers/parties");
require("./handlers/leagues");
require("./handlers/sourcetv");
