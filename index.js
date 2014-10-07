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

var Dota2Client = function Dota2Client(steamClient, debug) {
  EventEmitter.call(this);

  this.debug = debug || false;
  this._client = steamClient;
  this._appid = 570;
  this.chatChannels = []; // Map channel names to channel data.
  this._gcReady = false,
  this._gcClientHelloIntervalId = null;

  var self = this;
  this._client.on("fromGC", function fromGC(app, type, message, callback) {
    /* Routes messages from Game Coordinator to their handlers. */
    callback = callback || null;

    var kMsg = type & ~protoMask;
    if (self.debug) util.log("Dota2 fromGC: " + [app, kMsg].join(", "));  // TODO:  Turn type-protoMask into key name.

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
    if (self.debug) util.log("Sending ClientHello");
    if (!self._client) {
      util.log("Where the fuck is _client?");
    }
    else {
      self._client.toGC(self._appid, (Dota2.EGCBaseClientMsg.k_EMsgGCClientHello | protoMask), gcsdk_gcmessages.CMsgClientHello.serialize({}));
    }
  };
};
util.inherits(Dota2Client, EventEmitter);

require("./generated/messages");

// Expose enums
Dota2Client.prototype.ServerRegion = Dota2.ServerRegion;
Dota2Client.prototype.GameMode = Dota2.GameMode;
Dota2Client.prototype.ToAccountID = function(accid){
  return bignumber(accid).minus('76561197960265728')-0;
};
Dota2Client.prototype.ToSteamID = function(accid){
  return bignumber(accid).plus('76561197960265728')+"";
};

// Methods
Dota2Client.prototype.launch = function() {
  /* Reports to Steam that we are running Dota 2. Initiates communication with GC with EMsgGCClientHello */
  if (this.debug) util.log("Launching Dota 2");
  this.AccountID = this.ToAccountID(this._client.steamID);
  this._client.gamesPlayed([this._appid]);

  // Keep knocking on the GCs door until it accepts us.
  this._gcClientHelloIntervalId = setInterval(this._sendClientHello, 2500);
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

handlers[Dota2.EGCBaseClientMsg.k_EMsgGCClientWelcome] = function clientWelcomeHandler() {
  /* Response to our k_EMsgGCClientHello, now we can execute other GC commands. */

  // Only execute if _gcClientHelloIntervalID, otherwise it's already been handled (and we don't want to emit multiple 'ready');
  if (this._gcClientHelloIntervalId) {
    clearInterval(this._gcClientHelloIntervalId);
    this._gcClientHelloIntervalId = null;

    if (this.debug) util.log("Received client welcome.");
    this._gcReady = true;
    this.emit("ready");
  }
};

handlers[Dota2.EGCBaseClientMsg.k_EMsgGCClientConnectionStatus] = function gcClientConnectionStatus(message) {
  /* Catch and handle changes in connection status, cuz reasons u know. */

  var status = gcsdk_gcmessages.CMsgConnectionStatus.parse(message).status;

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
        this._gcClientHelloIntervalId = setInterval(this._sendClientHello, 2500); // Continually try regain GC session

        this._gcReady = false;
        this.emit("unready");
      }
      break;
  }
};

Dota2.Dota2Client = Dota2Client;

require("./handlers/inventory");
require("./handlers/chat");
require("./handlers/guild");
require("./handlers/community");
require("./handlers/match");
require("./handlers/lobbies");
require("./handlers/leagues");
require("./handlers/sourcetv");
