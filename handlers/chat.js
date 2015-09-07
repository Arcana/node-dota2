var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.joinChat = function(channel, type) {
  type = type || Dota2.DOTAChatChannelType_t.DOTAChannelType_Custom;

  /* Attempts to join a chat channel.  Expect k_EMsgGCJoinChatChannelResponse from GC */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Joining chat channel: " + channel);
  var payload = new Dota2.schema.CMsgDOTAJoinChatChannel({
    "channel_name": channel,
    "channel_type": type
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCJoinChatChannel;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

Dota2.Dota2Client.prototype.leaveChat = function(channel) {
  /* Attempts to leave a chat channel. GC does not send a response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Leaving chat channel: " + channel);
  var channelId = this.chatChannels.filter(function (item) {return (item.channel_name == channel); }).map(function (item) { return item.channel_id; })[0]
  if (channelId === undefined) {
    if (this.debug) util.log("Cannot leave a channel you have not joined.");
    return;
  }
  var payload = new Dota2.schema.CMsgDOTALeaveChatChannel({
    "channel_id": channelId
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCLeaveChatChannel;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
  this.chatChannels = this.chatChannels.filter(function (item) {if (item.channel_name == channel) return true; });
};

Dota2.Dota2Client.prototype.sendMessage = function(channel, message) {
  /* Attempts to send a message to a chat channel. GC does not send a response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending message to " + channel);
  var channelId = this.chatChannels.filter(function (item) {return (item.channel_name == channel);}).map(function (item) { return item.channel_id; })[0]
  if (channelId === undefined) {
    if (this.debug) util.log("Cannot send message to a channel you have not joined.");
    return;
  }
  var payload = new Dota2.schema.CMsgDOTAChatMessage({
    "channel_id": channelId,
    "text": message
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCChatMessage;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

Dota2.Dota2Client.prototype.requestChatChannels = function() {
  /* Attempts to send a message to a chat channel. GC does not send a response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Requesting channel list");
  var payload = new Dota2.schema.CMsgDOTARequestChatChannelList({
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCRequestChatChannelList;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer()
  );
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onJoinChatChannelResponse = function onJoinChatChannelResponse(message) {
  /* Channel data after we sent k_EMsgGCJoinChatChannel */
  var channelData = Dota2.schema.CMsgDOTAJoinChatChannelResponse.decode(message);
  util.log("Chat channel "+channelData.channel_name+ " has "+channelData.members.length+" person(s) online");
  this.chatChannels.push(channelData);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCJoinChatChannelResponse] = onJoinChatChannelResponse;

var onChatMessage = function onChatMessage(message) {
  /* Chat channel message from another user. */
  var chatData = Dota2.schema.CMsgDOTAChatMessage.decode(message);
  if(this.debug) util.log("Received chat message from "+chatData.persona_name+" in "+chatData.channel_id);
  this.emit("chatMessage",
    // channel_id is a uint64 which is a compound object. Using '===' or '==' doesn't work to check the equality necessitating the cast to String
    this.chatChannels.filter(function (item) {return (""+item.channel_id === ""+chatData.channel_id); }).map(function (item) { return item.channel_name; })[0],
    chatData.persona_name,
    chatData.text,
    chatData);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCChatMessage] = onChatMessage;

var onOtherJoinedChannel = function onOtherJoinedChannel(message) {
  /* Someone joined a chat channel you're in. */
  var otherJoined = Dota2.schema.CMsgDOTAOtherJoinedChatChannel.decode(message);
  if(this.debug) util.log(otherJoined.steam_id+" joined channel "+otherJoined.channel_id);
  this.emit("chatJoin", 
            otherJoined.channel_id,
            otherJoined.persona_name,
            otherJoined.steam_id,
            otherJoined);
  // Add member to cached chatChannels
  // channel_id is a uint64 which is a compound object. Using '===' or '==' doesn't work to check the equality necessitating the cast to String
  this.chatChannels.filter(function (item) {return (""+item.channel_id === ""+otherJoined.channel_id); })[0]
                    .members.push(new Dota2.schema.CMsgDOTAChatMember({
                                  steam_id: otherJoined.steam_id,
                                  persona_name: otherJoined.persona_name
                                }));
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCOtherJoinedChannel] = onOtherJoinedChannel;

var onOtherLeftChannel = function onOtherLeftChannel(message) {
  /* Someone left a chat channel you're in. */
  var otherLeft = Dota2.schema.CMsgDOTAOtherLeftChatChannel.decode(message);
  if(this.debug) util.log(otherLeft.steam_id+" left channel");
  this.emit("chatLeave", 
            otherLeft.channel_id,
            otherLeft.steam_id,
            otherLeft);
  // Delete member from cached chatChannel
  // channel_id is a uint64 which is a compound object. Using '===' or '==' doesn't work to check the equality necessitating the cast to String
  var chatChannel = this.chatChannels.filter(function (item) {return (""+item.channel_id === ""+otherLeft.channel_id); })[0];
  chatChannel.members = chatChannel.members.filter(function (item) {return (""+item.steam_id !== ""+otherLeft.steam_id); });
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCOtherLeftChannel] = onOtherLeftChannel;

var onRequestChatChannelListResponse = function onRequestChatChannelListResponse(message) {
  var channels = Dota2.schema.CMsgDOTARequestChatChannelListResponse.decode(message).channels;
  this.emit("chatChannelsReceived", channels)
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCRequestChatChannelListResponse] = onRequestChatChannelListResponse;