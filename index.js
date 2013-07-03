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
    k_EMsgGCToGCLeaveAllChatChannels: 7220,
    k_EMsgGCGuildCreateRequest: 7222,
    k_EMsgGCGuildCreateResponse: 7223,
    k_EMsgGCGuildSetAccountRoleRequest: 7224,
    k_EMsgGCGuildSetAccountRoleResponse: 7225,
    k_EMsgGCRequestGuildData: 7226,
    k_EMsgGCGuildData: 7227,
    k_EMsgGCGuildInviteAccountRequest: 7228,
    k_EMsgGCGuildInviteAccountResponse: 7229,
    k_EMsgGCGuildCancelInviteRequest: 7230,
    k_EMsgGCGuildCancelInviteResponse: 7231,
    k_EMsgGCGuildUpdateDetailsRequest: 7232,
    k_EMsgGCGuildUpdateDetailsResponse: 7233,
    k_EMsgGCGuildInviteData: 7254
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
    /* Handles messages from Game Coordinator; sends emits as appropriate. */

    if (self.debug) util.log("Dota2 fromGC: " + [app, type-protoMask].join(", "));  // TODO:  Turn type-protoMask into key name.
    switch (type-protoMask) {

      /* Steam */
      case self.EGCBaseClientMsg.k_EMsgGCClientWelcome:
        /* Response to our k_EMsgGCClientHello, now we can execute other GC commands. */
        self._gcReady = true;
        self.emit("ready");
        break;


      /* Inventory */
      // TODO.

      /* Chat */
      case self.EDOTAGCMsg.k_EMsgGCJoinChatChannelResponse:
        /* Channel data after we sent k_EMsgGCJoinChatChannel */
        var channelData = dota_gcmessages.CMsgDOTAJoinChatChannelResponse.parse(message);
        self.chatChannels.push(channelData);
        break;

      case self.EDOTAGCMsg.k_EMsgGCChatMessage:
        /* Chat channel message from another user. */
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


      /* Guilds */
      case self.EDOTAGCMsg.k_EMsgGCGuildInviteAccountResponse:
        /* Response to inviting another player to a guild.
            enum EResult {
              SUCCESS = 0;
              ERROR_UNSPECIFIED = 1;
              ERROR_NO_PERMISSION = 2;
              ERROR_ACCOUNT_ALREADY_INVITED = 3;
              ERROR_ACCOUNT_ALREADY_IN_GUILD = 4;
              ERROR_ACCOUNT_TOO_MANY_INVITES = 5;
              ERROR_GUILD_TOO_MANY_INVITES = 6;
              ERROR_ACCOUNT_TOO_MANY_GUILDS = 7;
            } */
        var response = dota_gcmessages.CMsgDOTAGuildInviteAccountResponse.parse(message);
        if (self.debug) util.log("Guild invite account response: " + response.result);
        break;

      case self.EDOTAGCMsg.k_EMsgGCGuildCancelInviteResponse:
        /* Response to cancelling another player's invitation to a guild.
            enum EResult {
              SUCCESS = 0;
              ERROR_UNSPECIFIED = 1;
              ERROR_NO_PERMISSION = 2;
            } */
        var response = dota_gcmessages.CMsgDOTAGuildCancelInviteResponse.parse(message);
        if (self.debug) util.log("Guild cancel invite response: " + response.result);
        break;

      case self.EDOTAGCMsg.k_EMsgGCGuildInviteData:
        /* Received an invitation to a guild */
        var guildInviteData = dota_gcmessages.CMsgDOTAGuildInviteData.parse(message);

        // Break if it is just info, and not invitation.
        if (!guildInviteData.invitedToGuild) return;

        if (self.debug) util.log("Recevied invitation to guild: " + guildInviteData.guildName);
        self.emit("guildInvite", guildInviteData.guildId, guildInviteData.guildName, guildInviteData.inviter, guildInviteData);
        break;

      case self.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleResponse:
        /* Response to setting account role.
            enum EResult {
              SUCCESS = 0;
              ERROR_UNSPECIFIED = 1;
              ERROR_NO_PERMISSION = 2;
              ERROR_NO_OTHER_LEADER = 3;
              ERROR_ACCOUNT_TOO_MANY_GUILDS = 4;
              ERROR_GUILD_TOO_MANY_MEMBERS = 5;
            } */
        var setAccountRoleData = dota_gcmessages.CMsgDOTAGuildSetAccountRoleResponse.parse(message);
        if (self.debug) util.log("Guild setAccountRole response: " + setAccountRoleData.result);
    }
  });
}
util.inherits(Dota2, EventEmitter);


/* Steam */
Dota2.prototype.launch = function() {
  /* Reports to Steam that we are running Dota 2. Initiates communication with GC with EMsgGCClientHello */
  if (this.debug) util.log("Launching Dota 2; sending ClientHello");
  this._client.gamesPlayed([this._appid]);
  var self = this;
  setTimeout( function(){
    // Delay to ensure Steam receives the "Hi I'm playing dota" message before this.
    self._client.toGC(self._appid, (self.EGCBaseClientMsg.k_EMsgGCClientHello | protoMask), gcsdk_gcmessages.CMsgClientHello.serialize({}));
  }, 1500);
};

Dota2.prototype.exit = function() {
  /* Reports to Steam we are not running any apps. */
  if (this.debug) util.log("Exiting Dota 2");
  this._gcReady = false;
  this._client.gamesPlayed([]);
};


/* Inventory */
Dota2.prototype.setItemPositions = function(itemPositions) {
  /* Attempts to move inventory items to positions as noted itemPositions - which is interpreted as a [itemid, position] tuple. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Setting item positions.");
  var payloadItemPositions = itemPositions.map(function(item){ return {"itemId": item[0], "position": item[1]}; }),
    payload = base_gcmessages.CMsgSetItemPositions.serialize({"itemPositions": payloadItemPositions});

  this._client.toGC(this._appid, (this.EGCItemMsg.k_EMsgGCSetItemPositions | protoMask), payload);
};

Dota2.prototype.deleteItem = function(itemid) {
  /* Attempts to delete item by itemid. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  var buffer = new Buffer(8);
  buffer.writeUInt64LE(itemid);
  this._client.toGC(this._appid, this.EGCItemMsg.k_EMsgGCDelete, buffer);
};


/* Chat */
Dota2.prototype.joinChat = function(channel) {
  /* Attempts to join a chat channel.  Expect k_EMsgGCJoinChatChannelResponse from GC */
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
  /* Attempts to leave a chat channel. GC does not send a response. */
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
  /* Attempts to send a message to a chat channel. GC does not send a response. */
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


/* Guild */
Dota2.prototype.inviteToGuild = function(guildId, targetAccountId) {
  /* Attempts to invite targetAccountId to a guild.  Expect k_EMsgGCGuildInviteAccountResponse from GC. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Inviting person to guild. " + [guildId, targetAccountId].join(", "));
  var payload = dota_gcmessages.CMsgDOTAGuildInviteAccountRequest.serialize({
    "guildId": guildId,
    "targetAccountId": targetAccountId
  });

  this._client.toGC(this._appid, (this.EDOTAGCMsg.k_EMsgGCGuildInviteAccountRequest | protoMask), payload);
};

Dota2.prototype.cancelInviteToGuild = function(guildId, targetAccountId) {
  /* Attempts to cancel targetAccountId's invitation to a guild.  Expect k_EMsgGCGuildCancelInviteAccountResponse from GC. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Cancelling invite to guild. " + [guildId, targetAccountId].join(", "));
  var payload = dota_gcmessages.CMsgDOTAGuildCancelInviteRequest.serialize({
    "guildId": guildId,
    "targetAccountId": targetAccountId
  });

  this._client.toGC(this._appid, (this.EDOTAGCMsg.k_EMsgGCGuildCancelInviteRequest | protoMask), payload);
};

Dota2.prototype.setGuildAccountRole = function(guildId, targetAccountId, targetRole) {
  /* Attempts to change an account's role in a guild. This can be accepting an invitation or promoting/demoting other guild members. Expect k_EMsgGCGuildSetAccountRoleResponse from GC.
     Roles:
     - 0: Kick member from guild.
     - 1: Leader
     - 2: Officer
     - 3: Member
  */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Setting guild account role. " + [guildId, targetAccountId, targetRole].join(", "));
  var payload = dota_gcmessages.CMsgDOTAGuildSetAccountRoleRequest.serialize({
    "guildId": guildId,
    "targetAccountId": targetAccountId,
    "targetRole": targetRole
  });

  this._client.toGC(this._appid, (this.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleRequest | protoMask), payload);
};