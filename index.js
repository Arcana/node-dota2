/**
 * Dota 2 module
 * @module Dota2
 */


var steam = require("steam");

const DOTA_APP_ID = 570;

var EventEmitter = require('events').EventEmitter,
    fs = require("fs"),
    path = require("path"),
    util = require("util"),
    bignumber = require("bignumber.js"),
    Protobuf = require('protobufjs'),
    Dota2 = exports;

Protobuf.parse.defaults.keepCase = true;

var folder = fs.readdirSync(__dirname + '/proto');

/**
 * Protobuf schema. See {@link http://dcode.io/protobuf.js/Root.html|Protobufjs#Root}
 * @alias module:Dota2.schema
 */ 
Dota2.schema = Protobuf.loadSync(folder.map(filename => __dirname + '/proto/' + filename));

/**
 * The Dota 2 client that communicates with the GC
 * @class 
 * @alias module:Dota2.Dota2Client
 * @param {Object} steamClient - Node-steam client instanc
 * @param {Boolean} debug - Print debug information to console
 * @param {Boolean} debugMore - Print even more debug information to console
 * @extends {EventEmitter} EventEmitter
 * @fires sourceTVGamesData
 * @fires inventoryUpdate
 * @fires practiceLobbyUpdate
 * @fires lobbyInviteUpdate
 * @fires partyUpdate
 * @fires partyInviteUpdate
 * @fires joinableCustomGameModes
 */
Dota2.Dota2Client = function Dota2Client(steamClient, debug, debugMore) {
    EventEmitter.call(this);
    this.debug = debug || false;
    this.debugMore = debugMore || false;
    
    /** The current state of the bot's inventory. Contains cosmetics, player cards, ... 
    * @type {CSOEconItem[]} 
    */
    this.Inventory = [];
    /** The chat channels the bot has joined 
    * @type {CMsgDOTAJoinChatChannelResponse[]}
    */
    this.chatChannels = []; // Map channel names to channel data.
    /** The lobby the bot is currently in. Falsy if the bot isn't in a lobby. 
    * @type {CSODOTALobby}
    */
    this.Lobby = null;
    /** The currently active lobby invitation. Falsy if the bot has not been invited. 
    * @type {CSODOTALobbyInvite}
    */
    this.LobbyInvite = null;
    /** The party the bot is currently in. Falsy if the bot isn't in a party.
    * @type {CSODOTAParty}
    */
    this.Party = null;
    /** The currently active party invitation. Falsy if the bot has not been invited.
    * @type {CSODOTAPartyInvite}
    */
    this.PartyInvite = null;

    var steamUser = new steam.SteamUser(steamClient);
    this._user = steamUser;
    this._client = steamClient;
    this._gc = new steam.SteamGameCoordinator(steamClient, DOTA_APP_ID);
    this._appid = DOTA_APP_ID;
    
    this._gcReady = false;
    this._gcClientHelloIntervalId = null;
    this._gcConnectionStatus = Dota2.schema.lookupEnum("GCConnectionStatus").GCConnectionStatus_NO_SESSION;
    // node-steam wants this as a simple object, so we can't use CMsgProtoBufHeader
    this._protoBufHeader = {
        "msg": "",
        "proto": {
            "client_steam_id": this._client.steamID,
            "source_app_id": this._appid
        }
    };

    var self = this;
    this._gc.on("message", function fromGC(header, body, callback) {
        /* Routes messages from Game Coordinator to their handlers. */
        callback = callback || null;

        var kMsg = header.msg;
        if (self.debugMore) util.log("Dota2 fromGC: " + Dota2._getMessageName(kMsg));

        if (kMsg in self._handlers) {
            if (callback) {
                self._handlers[kMsg].call(self, body, callback);
            } else {
                self._handlers[kMsg].call(self, body);
            }
        } else {
            self.emit("unhandled", kMsg);
        }
    });

    this._sendClientHello = function() {
        if (self._gcReady) {
            if (self._gcClientHelloIntervalId) {
                clearInterval(self._gcClientHelloIntervalId);
                self._gcClientHelloIntervalId = null;
            }
            return;
        }
        if (self._gcClientHelloCount > 10) {
            if (self.debug) util.log("ClientHello has taken longer than 30 seconds! Reporting timeout...");
            self._gcClientHelloCount = 0;
            self.emit("hellotimeout");
        }

        if (self.debug) util.log("Sending ClientHello");
        if (!self._gc) {
            util.log("Where the fuck is _gc?");
        } else {
            self._protoBufHeader.msg = Dota2.schema.lookupEnum("EGCBaseClientMsg").k_EMsgGCClientHello;
            var payload = {
                engine : 1,
                secret_key : "",
                client_session_need : 104
            };
            self._gc.send(
                self._protoBufHeader,
                Dota2.schema.lookupType("CMsgClientHello").encode(payload).finish()
            );
        }

        self._gcClientHelloCount++;
    };
};
util.inherits(Dota2.Dota2Client, EventEmitter);

// Methods
/**
 * Converts a 64bit Steam ID to a Dota2 account ID
 * @alias module:Dota2.Dota2Client.ToAccountID
 * @param {String} steamID - String representation of a 64bit Steam ID
 * @returns {Number} Dota2 account ID corresponding with steamID
 */
Dota2.Dota2Client.prototype.ToAccountID = function(steamID) {
    return new bignumber(steamID).minus('76561197960265728') - 0;
};
/**
 * Converts a Dota2 account ID to a 64bit Steam ID
 * @alias module:Dota2.Dota2Client.ToSteamID
 * @param {String} accid - String representation of a Dota 2 account ID
 * @returns {String} 64bit Steam ID corresponding to the given Dota 2 account ID
 */
Dota2.Dota2Client.prototype.ToSteamID = function(accid) {
    return new bignumber(accid).plus('76561197960265728') + "";
};
/**
 * Reports to Steam that you're playing Dota 2, and then initiates communication with the Game Coordinator.
 * @alias module:Dota2.Dota2Client#launch
 */
Dota2.Dota2Client.prototype.launch = function() {
    /* Reports to Steam that we are running Dota 2. Initiates communication with GC with EMsgGCClientHello */
    if (this.debug) util.log("Launching Dota 2");
    this.AccountID = this.ToAccountID(this._client.steamID);
    this.Party = null;
    this.Lobby = null;
    this.PartyInvite = null;
    this.Inventory = null;
    this._user.gamesPlayed([{
        "game_id": this._appid
    }]);

    // Keep knocking on the GCs door until it accepts us.
    // This is very bad practice and quite trackable.
    // The real client tends to send only one of these.
    // Really we should just send one when the connection status is GC online
    this._gcClientHelloCount = 0;
    this._gcClientHelloIntervalId = setInterval(this._sendClientHello, 6000);

    //Also immediately send clienthello
    setTimeout(this._sendClientHello, 1000);
};
/**
 * Stop sending a heartbeat to the GC and report to steam you're no longer playing Dota 2
 * @alias module:Dota2.Dota2Client#exit
 */
Dota2.Dota2Client.prototype.exit = function() {
    /* Reports to Steam we are not running any apps. */
    if (this.debug) util.log("Exiting Dota 2");

    /* stop knocking if exit comes before ready event */
    if (this._gcClientHelloIntervalId) {
        clearInterval(this._gcClientHelloIntervalId);
        this._gcClientHelloIntervalId = null;
    }
    this._gcReady = false;

    if (this._client.loggedOn) this._user.gamesPlayed([]);
};

Dota2.Dota2Client.prototype.sendToGC = function(type, payload, handler, callback) {
    var self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        if (callback) callback(-1, null);                   // notify user that something went wrong
        return null;
    }
    this._protoBufHeader.msg = type;
    this._gc.send(this._protoBufHeader,                     // protobuf header, same for all messages
                  payload,                                  // payload of the message
                  Dota2._convertCallback.call(self, handler, callback) // let handler treat callback so events are triggered
    );
}


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers = {};

handlers[Dota2.schema.lookupEnum("EGCBaseClientMsg").k_EMsgGCClientWelcome] = function clientWelcomeHandler(message) {
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

handlers[Dota2.schema.lookupEnum("EGCBaseClientMsg").k_EMsgGCClientConnectionStatus] = function gcClientConnectionStatus(message) {
    /* Catch and handle changes in connection status, cuz reasons u know. */
    var status = Dota2.schema.lookupType("CMsgConnectionStatus").decode(message).status;
    if (status) this._gcConnectionStatus = status;

    switch (status) {
        case Dota2.schema.lookupEnum("GCConnectionStatus").GCConnectionStatus_HAVE_SESSION:
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
require("./handlers/team");
require("./handlers/custom");
require("./handlers/general");
require("./handlers/fantasy");