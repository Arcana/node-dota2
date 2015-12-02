var Dota2 = require("../index"),
    util = require("util");

// Methods
Dota2.Dota2Client.prototype._getChannelByName = function(channel_name) {
    // Returns the channel corresponding to the given channel_name
    if (this.chatChannels) {
        return this.chatChannels.filter(
            function(item) {
                return (item.channel_name === channel_name);
            }
        )[0];
    } else {
        return null;
    }
}

Dota2.Dota2Client.prototype._getChannelById = function(channel_id) {
    // Returns the channel corresponding to the given channel_id
    if (this.chatChannels) {
        return this.chatChannels.filter(
            // channel_id is a uint64 which is a compound object. Using '===' or '==' doesn't work to check the equality necessitating the cast to String
            function(item) {
                return ("" + item.channel_id === "" + channel_id);
            }
        )[0];
    } else {
        return null;
    }
}

Dota2.Dota2Client.prototype.joinChat = function(channel, type) {
    type = type || Dota2.schema.DOTAChatChannelType_t.DOTAChannelType_Custom;

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
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCJoinChatChannel;
    this._gc.send(
        this._protoBufHeader,
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
    var cache = this._getChannelByName(channel);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot leave a channel you have not joined.");
        return;
    }
    var payload = new Dota2.schema.CMsgDOTALeaveChatChannel({
        "channel_id": cache.channel_id
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCLeaveChatChannel;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
};

Dota2.Dota2Client.prototype.sendMessage = function(channel, message) {
    /* Attempts to send a message to a chat channel. GC does not send a response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending message to " + channel);
    var cache = this._getChannelByName(channel);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
    var payload = new Dota2.schema.CMsgDOTAChatMessage({
        "channel_id": cache.channel_id,
        "text": message
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCChatMessage;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
};

Dota2.Dota2Client.prototype.flipCoin = function(channel) {
    /* Attempts to send a coin flip to a chat channel. Expect a chatmessage in response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending coin flip to " + channel);
    var cache = this._getChannelByName(channel);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
    var payload = new Dota2.schema.CMsgDOTAChatMessage({
        "channel_id": cache.channel_id,
        "coin_flip": true
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCChatMessage;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
};

Dota2.Dota2Client.prototype.rollDice = function(channel, min, max) {
    /* Attempts to send a dice roll to a chat channel. Expect a chatmessage in response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending dice roll to " + channel);
    var cache = this._getChannelByName(channel);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
    var payload = new Dota2.schema.CMsgDOTAChatMessage({
        "channel_id": cache.channel_id,
        "dice_roll": {
            "roll_min": min,
            "roll_max": max
        }
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCChatMessage;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
};

Dota2.Dota2Client.prototype.requestChatChannels = function() {
    /* Requests a list of chat channels from the GC. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Requesting channel list");
    var payload = new Dota2.schema.CMsgDOTARequestChatChannelList({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCRequestChatChannelList;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onJoinChatChannelResponse = function onJoinChatChannelResponse(message) {
    /* Channel data after we sent k_EMsgGCJoinChatChannel */
    var channelData = Dota2.schema.CMsgDOTAJoinChatChannelResponse.decode(message);
    if (this.debug) util.log("Chat channel " + channelData.channel_name + " has " + channelData.members.length + " person(s) online");
    this.chatChannels.push(channelData);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCJoinChatChannelResponse] = onJoinChatChannelResponse;

var onChatMessage = function onChatMessage(message) {
    /* Chat channel message from another user. */
    var chatData = Dota2.schema.CMsgDOTAChatMessage.decode(message);
    var channel = this._getChannelById(chatData.channel_id);

    if (this.debug) util.log("Received chat message from " + chatData.persona_name + " in channel " + channel.channel_name);
    this.emit("chatMessage",
        channel.channel_name,
        chatData.persona_name,
        chatData.text,
        chatData);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCChatMessage] = onChatMessage;

var onOtherJoinedChannel = function onOtherJoinedChannel(message) {
    /* Someone joined a chat channel you're in. */
    var otherJoined = Dota2.schema.CMsgDOTAOtherJoinedChatChannel.decode(message);
    var channel = this._getChannelById(otherJoined.channel_id);
    if (this.debug) util.log(otherJoined.steam_id + " joined channel " + channel.channel_name);
    this.emit("chatJoin",
        channel.channel_name,
        otherJoined.persona_name,
        otherJoined.steam_id,
        otherJoined);
    // Add member to cached chatChannels
    channel.members.push(new Dota2.schema.CMsgDOTAChatMember({
        steam_id: otherJoined.steam_id,
        persona_name: otherJoined.persona_name
    }));
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCOtherJoinedChannel] = onOtherJoinedChannel;

var onOtherLeftChannel = function onOtherLeftChannel(message) {
    /* Someone left a chat channel you're in. */
    var otherLeft = Dota2.schema.CMsgDOTAOtherLeftChatChannel.decode(message);
    var channel = this._getChannelById(otherLeft.channel_id);
    // Check if it is me that left the channel
    if ("" + otherLeft.steam_id === "" + this._client.steamID) {
        if (this.debug) util.log("Left channel " + channel.channel_name);
        this.emit("chatLeave",
            channel.channel_name,
            otherLeft.steam_id,
            otherLeft);
        // Delete channel from cache
        this.chatChannels = this.chatChannels.filter(function(item) {
            if ("" + item.channel_id == "" + channel.channel_id) return false;
        });
    } else {
        if (this.debug) util.log(otherLeft.steam_id + " left channel " + channel.channel_name);
        this.emit("chatLeave",
            channel.channel_name,
            otherLeft.steam_id,
            otherLeft);
        // Delete member from cached chatChannel
        channel.members = channel.members.filter(function(item) {
            return ("" + item.steam_id !== "" + otherLeft.steam_id);
        });
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCOtherLeftChannel] = onOtherLeftChannel;

var onChatChannelsResponse = function onChatChannelsResponse(message) {
    var channels = Dota2.schema.CMsgDOTARequestChatChannelListResponse.decode(message).channels;
    this.emit("chatChannelsData", channels)
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCRequestChatChannelListResponse] = onChatChannelsResponse;