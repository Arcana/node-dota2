var Dota2 = require("../index"),
    util = require("util"),
    protoMask = 0x80000000;


// Methods

Dota2.Dota2Client.prototype.requestGuildData = function() {
  /* Asks the GC for info on the users current guilds.  Expect k_EMsgGCGuildOpenPartyRefresh from GC for guild ids. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Requesting current user guild data. ");
  var payload = Dota2.schema.CMsgDOTARequestGuildData({
    // Doesn't take anything.
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCRequestGuildData | protoMask), payload.toBuffer());
};

Dota2.Dota2Client.prototype.inviteToGuild = function(guildId, targetAccountId, callback) {
  callback = callback || null;

  /* Attempts to invite targetAccountId to a guild.  Expect k_EMsgGCGuildInviteAccountResponse from GC. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Inviting person to guild. " + [guildId, targetAccountId].join(", "));
  var payload = Dota2.schema.CMsgDOTAGuildInviteAccountRequest({
    "guildId": guildId,
    "targetAccountId": targetAccountId
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCGuildInviteAccountRequest | protoMask), payload.toBuffer(), callback);
};

Dota2.Dota2Client.prototype.cancelInviteToGuild = function(guildId, targetAccountId, callback) {
  callback = callback || null;

  /* Attempts to cancel targetAccountId's invitation to a guild.  Expect k_EMsgGCGuildCancelInviteAccountResponse from GC. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Cancelling invite to guild. " + [guildId, targetAccountId].join(", "));
  var payload = Dota2.schema.CMsgDOTAGuildCancelInviteRequest({
    "guildId": guildId,
    "targetAccountId": targetAccountId
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCGuildCancelInviteRequest | protoMask), payload.toBuffer(), callback);
};

Dota2.Dota2Client.prototype.setGuildAccountRole = function(guildId, targetAccountId, targetRole, callback) {
  callback = callback || null;

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
  var payload = Dota2.schema.CMsgDOTAGuildSetAccountRoleRequest({
    "guildId": guildId,
    "targetAccountId": targetAccountId,
    "targetRole": targetRole
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleRequest | protoMask), payload.toBuffer(), callback);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildOpenPartyRefresh] = function onGuildOpenPartyRefresh(message) {
  /* Response from requestGuildData containing data on open parties, but most notably - it can tell the library what guilds the user is in. */
  var response = Dota2.schema.CMsgDOTAGuildOpenPartyRefresh.decode(message);
  if (this.debug) util.log("Got guild open party data");
  this.emit("guildOpenPartyData", response.guildId, response.openParties, response);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildInviteAccountResponse] = function onGuildInviteResponse(message, callback) {
  callback = callback || null;
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
  var response = Dota2.schema.CMsgDOTAGuildInviteAccountResponse.decode(message);
  if (this.debug) util.log("Guild invite account response: " + response.result);
  if (callback) callback(null, response);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildCancelInviteResponse] = function onGuildCancelInviteResponse(message, callback) {
  callback = callback || null;
  /* Response to cancelling another player's invitation to a guild.
  enum EResult {
    SUCCESS = 0;
    ERROR_UNSPECIFIED = 1;
    ERROR_NO_PERMISSION = 2;
  } */
  var response = Dota2.schema.CMsgDOTAGuildCancelInviteResponse.decode(message);
  if (this.debug) util.log("Guild cancel invite response: " + response.result);
  if (callback) callback(null, response);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildInviteData] = function onGuildInviteData(message) {
  /* Received an invitation to a guild */
  var guildInviteData = Dota2.schema.CMsgDOTAGuildInviteData.decode(message);

  // Break if it is just info, and not invitation.
  if (!guildInviteData.invitedToGuild) return;

  if (this.debug) util.log("Received invitation to guild: " + guildInviteData.guildName);
  this.emit("guildInvite", guildInviteData.guildId, guildInviteData.guildName, guildInviteData.inviter, guildInviteData);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleResponse] = function onGuildSetAccountRoleResponse(message, callback) {
  callback = callback || null;
  /* Response to setting account role.
      enum EResult {
        SUCCESS = 0;
        ERROR_UNSPECIFIED = 1;
        ERROR_NO_PERMISSION = 2;
        ERROR_NO_OTHER_LEADER = 3;
        ERROR_ACCOUNT_TOO_MANY_GUILDS = 4;
        ERROR_GUILD_TOO_MANY_MEMBERS = 5;
      } */
  var setAccountRoleData = Dota2.schema.CMsgDOTAGuildSetAccountRoleResponse.decode(message);
  if (this.debug) util.log("Guild setAccountRole response: " + setAccountRoleData.result);
  if (callback) callback(null, setAccountRoleData);
};