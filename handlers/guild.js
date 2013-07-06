var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages.desc")),
    protoMask = 0x80000000;


// Methods

Dota2.Dota2Client.prototype.inviteToGuild = function(guildId, targetAccountId) {
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

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCGuildInviteAccountRequest | protoMask), payload);
};

Dota2.Dota2Client.prototype.cancelInviteToGuild = function(guildId, targetAccountId) {
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

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCGuildCancelInviteRequest | protoMask), payload);
};

Dota2.Dota2Client.prototype.setGuildAccountRole = function(guildId, targetAccountId, targetRole) {
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

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleRequest | protoMask), payload);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildInviteAccountResponse] = function onGuildInviteResponse(message) {
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
  if (this.debug) util.log("Guild invite account response: " + response.result);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildCancelInviteResponse] = function onGuildCancelInviteResponse(message) {
  /* Response to cancelling another player's invitation to a guild.
  enum EResult {
    SUCCESS = 0;
    ERROR_UNSPECIFIED = 1;
    ERROR_NO_PERMISSION = 2;
  } */
  var response = dota_gcmessages.CMsgDOTAGuildCancelInviteResponse.parse(message);
  if (this.debug) util.log("Guild cancel invite response: " + response.result);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildInviteData] = function onGuildInviteData(message) {
  /* Received an invitation to a guild */
  var guildInviteData = dota_gcmessages.CMsgDOTAGuildInviteData.parse(message);

  // Break if it is just info, and not invitation.
  if (!guildInviteData.invitedToGuild) return;

  if (this.debug) util.log("Recevied invitation to guild: " + guildInviteData.guildName);
  this.emit("guildInvite", guildInviteData.guildId, guildInviteData.guildName, guildInviteData.inviter, guildInviteData);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleResponse] = function onGuildSetAccountRoleResponse(message) {
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
  if (this.debug) util.log("Guild setAccountRole response: " + setAccountRoleData.result);
};