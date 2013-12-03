var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;


// Methods

Dota2.Dota2Client.prototype.joinChat = function(channel, type) {
  type = type || Dota2.DOTAChatChannelType_t.DOTAChannelType_Custom;

  /* Attempts to join a chat channel.  Expect k_EMsgGCJoinChatChannelResponse from GC */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Joining chat channel: " + channel);
  var payload = dota_gcmessages_client.CMsgDOTAJoinChatChannel.serialize({
    "channelName": channel,
    "channelType": type
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCJoinChatChannel | protoMask), payload);
};

Dota2.Dota2Client.prototype.leaveChat = function(channel) {
  /* Attempts to leave a chat channel. GC does not send a response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Leaving chat channel: " + channel);
  var channelId = this.chatChannels.filter(function (item) {if (item.channelName == channel) return true; }).map(function (item) { return item.channelId; })[0]
  if (channelId === undefined) {
    if (this.debug) util.log("Cannot leave a channel you have not joined.");
    return;
  }
  var payload = dota_gcmessages_client.CMsgDOTALeaveChatChannel.serialize({
    "channelId": channelId
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCLeaveChatChannel | protoMask), payload);
};

Dota2.Dota2Client.prototype.sendMessage = function(channel, message) {
  /* Attempts to send a message to a chat channel. GC does not send a response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending message to " + channel);
  var channelId = this.chatChannels.filter(function (item) {if (item.channelName == channel) return true; }).map(function (item) { return item.channelId; })[0]
  if (channelId === undefined) {
    if (this.debug) util.log("Cannot send message to a channel you have not joined.");
    return;
  }
  var payload = dota_gcmessages_client.CMsgDOTAChatMessage.serialize({
    "channelId": channelId,
    "text": message
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCChatMessage | protoMask), payload);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCJoinChatChannelResponse] = function onJoinChatChannelResponse(message) {
  /* Channel data after we sent k_EMsgGCJoinChatChannel */
  var channelData = dota_gcmessages_client.CMsgDOTAJoinChatChannelResponse.parse(message);
  this.chatChannels.push(channelData);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCChatMessage] = function onChatMessage(message) {
  /* Chat channel message from another user. */
  var chatData = dota_gcmessages_client.CMsgDOTAChatMessage.parse(message);
  this.emit("chatMessage",
    this.chatChannels.filter(function (item) {if (item.channelId === chatData.channelId) return true; }).map(function (item) { return item.channelName; })[0],
    chatData.personaName,
    chatData.text,
    chatData);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCOtherJoinedChannel] = function onOtherJoinedChannel(message) {
  // TODO;
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCOtherLeftChannel] = function onOtherLeftChannel(message) {
  // TODO;
};