var Schema = require('protobuf').Schema,
    EventEmitter = require('events').EventEmitter,
    fs = require("fs"),
    util = require("util"),
    Deferred = require("deferred"),
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/gcsdk_gcmessages.desc")),
    dota_gcmessages = new Schema(fs.readFileSync(__dirname + "/generated/dota_gcmessages.desc")),
    protoMask = 0x80000000;

module.exports = Dota2;

function Dota2(steamClient, debug) {
  EventEmitter.call(this);

  this.debug = debug || false;
  this._client = steamClient;
  this._appid = 570;
  this._gcReady = false;
  this.chatChannels = []; // Map channel names to channel data.

  // TODO: Autogenerate these from SteamRE resources, in to seperate file.
  // Warning:  These values can change with Dota 2 updates.
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
        k_EMsgGCLeaveChatChannel: 7272,
        k_EMsgGCOtherJoinedChannel: 7013,
        k_EMsgGCOtherLeftChannel: 7014,
        k_EMsgGCRequestDefaultChatChannel: 7058,
        k_EMsgGCRequestDefaultChatChannelResponse: 7059,
        k_EMsgGCRequestChatChannelList: 7060,
        k_EMsgGCRequestChatChannelListResponse: 7061,
        k_EMsgGCChatMessage: 7273,
        k_EMsgClientsRejoinChatChannels: 7217,
        k_EMsgGCToGCLeaveAllChatChannels: 7220
  },
  this.DOTAChatChannelType_t = {
        DOTAChannelType_Regional: 0,
        DOTAChannelType_Custom: 1,
        DOTAChannelType_Party: 2,
        DOTAChannelType_Lobby: 3,
        DOTAChannelType_Team: 4,
        DOTAChannelType_Guild: 5
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
        var channelData = dota_gcmessages.CMsgDOTAJoinChatChannelResponse.parse(message);
        self.chatChannels.push(channelData);
        break;

      case self.EDOTAGCMsg.k_EMsgGCChatMessage:
        var chatData = dota_gcmessages.CMsgDOTAChatMessage.parse(message);
        self.emit("chatMessage",
          self.chatChannels.map(function (item) {if (item.channelId === chatData.channelId) return item.channelName; })[0],
          chatData.personaName,
          chatData.text,
          chatData);
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
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Joining chat channel: " + channel);
  var payload = dota_gcmessages.CMsgDOTAJoinChatChannel.serialize({
    "channelName": channel,
    "channelType": this.DOTAChatChannelType_t.DOTAChannelType_Custom
  });

  this._client.toGC(this._appid, (this.EDOTAGCMsg.k_EMsgGCJoinChatChannel | protoMask), payload);
};

Dota2.prototype.leaveChat = function(channel) {
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Leaving chat channel: " + channel);
  var channelId = this.chatChannels.map(function (item) {if (item.channelName == channel) return item.channelId; })[0];
  if (channelId === undefined) {
    if (this.debug) util.log("Cannot leave a channel you have not joined.");
    return;
  }
  var payload = dota_gcmessages.CMsgDOTALeaveChatChannel.serialize({
     "channelId": channelId
  });

  this._client.toGC(this._appid, (this.EDOTAGCMsg.k_EMsgGCLeaveChatChannel | protoMask), payload);
};

Dota2.prototype.sendMessage = function(channel, message) {
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending message to " + channel);
  var channelId = this.chatChannels.map(function (item) {if (item.channelName == channel) return item.channelId; })[0];
  if (channelId === undefined) {
    if (this.debug) util.log("Cannot send message to a channel you have not joined.");
    return;
  }
  var payload = dota_gcmessages.CMsgDOTAChatMessage.serialize({
      "channelId": channelId,
      "text": message
    });

  this._client.toGC(this._appid, (this.EDOTAGCMsg.k_EMsgGCChatMessage | protoMask), payload);
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