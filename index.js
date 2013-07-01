var Schema = require('protobuf').Schema,
    EventEmitter = require('events').EventEmitter,
    fs = require("fs"),
    util = require("util"),
    Deferred = require("deferred"),
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/gcsdk_gcmessages.desc")),
    protoMask = 0x80000000;

module.exports = Dota2;

function Dota2(steamClient, debug) {
  EventEmitter.call(this);

  this.debug = debug || false;
  this._client = steamClient;
  this._appid = 570;
  this._gcReady = false;

  // TODO: Autogenerate these from SteamRE resources, in to seperate file.
  this.EGCItemMsg = {
    k_EMsgGCSetItemPosition: 1001,
    k_EMsgGCDelete: 1004,
    k_EMsgGCSetItemPositions: 1077
  };
  this.EGCBaseClientMsg = {
    k_EMsgGCClientWelcome: 4004,
    k_EMsgGCServerWelcome: 4005,
    k_EMsgGCClientHello: 4006,
    k_EMsgGCServerHello: 4007,
    k_EMsgGCClientConnectionStatus: 4009,
    k_EMsgGCServerConnectionStatus: 4010
  };
  this.EDOTAGCMsg = {
        k_EMsgGCJoinChatChannel: 7009,
        k_EMsgGCJoinChatChannelResponse: 7010,
        k_EMsgGCLeaveChatChannel: 7011,
        k_EMsgGCOtherJoinedChannel: 7013,
        k_EMsgGCOtherLeftChannel: 7014,
        k_EMsgGCRequestDefaultChatChannel: 7058,
        k_EMsgGCRequestDefaultChatChannelResponse: 7059,
        k_EMsgGCRequestChatChannelList: 7060,
        k_EMsgGCRequestChatChannelListResponse: 7061,
        k_EMsgGCChatMessage: 7146,
        k_EMsgClientsRejoinChatChannels: 7217,
        k_EMsgGCToGCLeaveAllChatChannels: 7220
  };

  var self = this;
  this._client.on("fromGC", function fromGC(app, type, message) {
    if (self.debug) util.log("Dota2 fromGC: " + [app, type-protoMask].join(", "));
    switch (type-protoMask) {
      case self.EGCBaseClientMsg.k_EMsgGCClientWelcome:
        self._gcReady = true;
        self.emit("ready");
        break;

      case self.EDOTAGCMsg.k_EMsgGCJoinChatChannelResponse:
        // TODO;
        break;

      case self.EDOTAGCMsg.k_EMsgGCChatMessage:
        // TODO;
        break;

      case self.EDOTAGCMsg.k_EMsgGCOtherJoinedChannel:
        // TODO;
        break;

      case self.EDOTAGCMsg.k_EMsgGCOtherLeftChannel:
        // TODO;
        break;
    }
  });
}
util.inherits(Dota2, EventEmitter);

Dota2.prototype.launch = function() {
  if (this.debug) util.log("Launching Dota 2 sending ClientHello");
  this._client.gamesPlayed([this._appid]);
  var self = this;
  setTimeout( function(){
    // Delay to ensure Steam receives the "Hi I'm playing dota" message before this.
    self._client.toGC(self._appid, (self.EGCBaseClientMsg.k_EMsgGCClientHello | protoMask), gcsdk_gcmessages.CMsgClientHello.serialize({}));
}, 1000);
};

Dota2.prototype.exit = function() {
  if (this.debug) util.log("Exiting Dota 2");
  this._gcReady = false;
  this._client.gamesPlayed([]);
};

Dota2.prototype.setItemPositions = function(itemPositions) {
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Setting item positions.");
  var payloadItemPositions = itemPositions.map(function(item){ return {"itemId": item[0], "position": item[1]}; }),
    payload = base_gcmessages.CMsgSetItemPositions.serialize({"itemPositions": payloadItemPositions});

  this._client.toGC(this._appid, (this.EGCItemMsg.k_EMsgGCSetItemPositions | protoMask), payload);
};

Dota2.prototype.joinChat = function(channel) {
    // TODO; seems to be non-proto, pls snoop
};

Dota2.prototype.leaveChat = function(channel) {
    // TODO; seems to be non-proto, pls snoop
};

Dota2.prototype.deleteItem = function(itemid) {
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  var buffer = new Buffer(8);
  buffer.writeUInt64LE(itemid);
  this._client.toGC(this._appid, this.EGCItemMsg.k_EMsgGCDelete, buffer);
};