var Dota2 = require("../index"),
    util = require("util");

// Methods
Dota2.Dota2Client.prototype._getChannelByName = function(channel_name, channel_type) {
    // Returns the channel corresponding to the given channel_name
    if (this.chatChannels) {
        return this.chatChannels.filter(
            function(item) {
                if(channel_type >= 0)
                    return (item.channel_name === channel_name && item.channel_type === channel_type);
                else
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

Dota2.Dota2Client.prototype._leaveChatChannelById = function(channelId) {
    var payload = {
        "channel_id": channelId
    };
    this.chatChannels = this.chatChannels.filter(item => item.channel_id.notEquals(channelId));
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCLeaveChatChannel, 
                    Dota2.schema.lookupType("CMsgDOTALeaveChatChannel").encode(payload).finish());
    if (this.debug) {
        util.log("Leaving channel " + channelId);
    }
};

Dota2.Dota2Client.prototype.joinChat = function(channel_name, channel_type) {
    channel_type = channel_type || Dota2.schema.lookupEnum("DOTAChatChannelType_t").DOTAChannelType_Custom;

    /* Attempts to join a chat channel.  Expect k_EMsgGCJoinChatChannelResponse from GC */
    if (this.debug) util.log("Joining chat channel: " + channel_name);
    
    var payload = {
        "channel_name": channel_name,
        "channel_type": channel_type
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCJoinChatChannel, 
                    Dota2.schema.lookupType("CMsgDOTAJoinChatChannel").encode(payload).finish());
};

Dota2.Dota2Client.prototype.leaveChat = function(channel_name, channel_type) {
    /* Attempts to leave a chat channel. GC does not send a response. */
    if (this.debug) util.log("Leaving chat channel: " + channel_name);
    // Clear cache
    var cache = this._getChannelByName(channel_name, channel_type);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot leave a channel you have not joined.");
        return;
    }
    this._leaveChatChannelById(cache.channel_id)
};

Dota2.Dota2Client.prototype.sendMessage = function(channel_name, message, channel_type) {
    /* Attempts to send a message to a chat channel. GC does not send a response. */
    if (this.debug) util.log("Sending message to " + channel_name);
    // Check cache
    var cache = this._getChannelByName(channel_name, channel_type);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
    
    var payload = {
        "channel_id": cache.channel_id,
        "text": message
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCChatMessage, 
                    Dota2.schema.lookupType("CMsgDOTAChatMessage").encode(payload).finish());
};

Dota2.Dota2Client.prototype.shareLobby = function(channel_name, channel_type) {
    /* Attempts to send a message to a chat channel. GC does not send a response. */
    if (this.debug) util.log("Sharing lobby to " + channel_name);
    // Check cache
    var cache = this._getChannelByName(channel_name, channel_type);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
    if (this.Lobby === undefined) {
        if (this.debug) util.log("Cannot share a lobby when you're not in one.");
        return;
    }
    
    var payload = {
        "channel_id": cache.channel_id,
        "share_lobby_id": this.Lobby.lobby_id,
        "share_lobby_passkey": this.Lobby.pass_key
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCChatMessage, 
                    Dota2.schema.lookupType("CMsgDOTAChatMessage").encode(payload).finish());
};

Dota2.Dota2Client.prototype.flipCoin = function(channel_name, channel_type) {
    /* Attempts to send a coin flip to a chat channel. Expect a chatmessage in response. */
    if (this.debug) util.log("Sending coin flip to " + channel_name);
    // Check cache
    var cache = this._getChannelByName(channel_name, channel_type);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
    
    var payload = {
        "channel_id": cache.channel_id,
        "coin_flip": true
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCChatMessage, 
                    Dota2.schema.lookupType("CMsgDOTAChatMessage").encode(payload).finish());
};

Dota2.Dota2Client.prototype.rollDice = function(channel_name, min, max, channel_type) {
    /* Attempts to send a dice roll to a chat channel. Expect a chatmessage in response. */
    if (this.debug) util.log("Sending dice roll to " + channel_name);
    // Check cache
    var cache = this._getChannelByName(channel_name, channel_type);
    if (cache === undefined) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
    
    var payload = {
        "channel_id": cache.channel_id,
        "dice_roll": {
            "roll_min": min,
            "roll_max": max
        }
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCChatMessage, 
                    Dota2.schema.lookupType("CMsgDOTAChatMessage").encode(payload).finish());
};

Dota2.Dota2Client.prototype.requestChatChannels = function() {
    /* Requests a list of chat channels from the GC. */
    if (this.debug) util.log("Requesting channel list");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCRequestChatChannelList, 
                    Dota2.schema.lookupType("CMsgDOTAChatMessage").encode(payload).finish());
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onJoinChatChannelResponse = function onJoinChatChannelResponse(message) {
    /* Channel data after we sent k_EMsgGCJoinChatChannel */
    var channelData = Dota2.schema.lookupType("CMsgDOTAJoinChatChannelResponse").decode(message);
    if (this.debug) util.log("Chat channel " + channelData.channel_name + " has " + channelData.members.length + " person(s) online");
    this.chatChannels.push(channelData);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCJoinChatChannelResponse] = onJoinChatChannelResponse;

var onChatMessage = function onChatMessage(message) {
    /* Chat channel message from another user. */
    var chatData = Dota2.schema.lookupType("CMsgDOTAChatMessage").decode(message);
    var channel = this._getChannelById(chatData.channel_id);

    if (this.debug) util.log("Received chat message from " + chatData.persona_name + " in channel " + channel.channel_name);
    this.emit("chatMessage",
        channel.channel_name,
        chatData.persona_name,
        chatData.text,
        chatData);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCChatMessage] = onChatMessage;

var onOtherJoinedChannel = function onOtherJoinedChannel(message) {
    /* Someone joined a chat channel you're in. */
    var otherJoined = Dota2.schema.lookupType("CMsgDOTAOtherJoinedChatChannel").decode(message);
    var channel = this._getChannelById(otherJoined.channel_id);
    if (this.debug) util.log(otherJoined.steam_id + " joined channel " + channel.channel_name);
    this.emit("chatJoin",
        channel.channel_name,
        otherJoined.persona_name,
        otherJoined.steam_id,
        otherJoined);
    // Add member to cached chatChannels
    channel.members.push(Dota2.schema.lookupType("CMsgDOTAChatMember").create({
        steam_id: otherJoined.steam_id,
        persona_name: otherJoined.persona_name
    }));
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCOtherJoinedChannel] = onOtherJoinedChannel;

var onUserLeftChannel = function onOtherLeftChannel(message) {
    /* Someone left a chat channel you're in. */
    var userWhoLeft = Dota2.schema.lookupType("CMsgDOTAOtherLeftChatChannel").decode(message);
    var channel = this._getChannelById(userWhoLeft.channel_id);
    // Check if it is me that left the channel
    if (userWhoLeft.steam_id.equals(this._client.steamID)) {
        if (channel) {
            this.emit("chatLeave", channel.channel_name, userWhoLeft.steam_id, userWhoLeft);
            // Delete channel from cache
            this.chatChannels = this.chatChannels.filter(item => item.channel_id.notEquals(channel.channel_id));
            if (this.debug)
                util.log("Left channel " + channel.channel_name);
        } else {
            this._leaveChatChannelById(userWhoLeft.channel_id);
            if (this.debug)
                util.log("I left unknown channel " + userWhoLeft.channel_id);
        }
    } else {
        if (channel) {
            this.emit("chatLeave", channel.channel_name, userWhoLeft.steam_id, userWhoLeft);
            // Delete member from cached chatChannel
            channel.members = channel.members.filter(item => item.steam_id.notEquals(userWhoLeft.steam_id));
            if (this.debug)
                util.log(userWhoLeft.steam_id + " left channel " + channel.channel_name);
        } else {
            this._leaveChatChannelById(userWhoLeft.channel_id);
            if (this.debug)
                util.log(userWhoLeft.steam_id + " left unknown channel " + userWhoLeft.channel_id);
        }
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCOtherLeftChannel] = onUserLeftChannel;

var onChatChannelsResponse = function onChatChannelsResponse(message) {
    var channels = Dota2.schema.lookupType("CMsgDOTARequestChatChannelListResponse").decode(message).channels;
    this.emit("chatChannelsData", channels)
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCRequestChatChannelListResponse] = onChatChannelsResponse;