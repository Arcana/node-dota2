var Dota2 = require("../index");


// Methods

Dota2.Dota2Client.prototype.requestGuildData = function() {
    /* Asks the GC for info on the users current guilds. Expect k_EMsgGCGuildOpenPartyRefresh and k_EMsgGCGuildData from GC for guild ids. */
    this.Logger.debug("Requesting current user guild data. ");
    
    var payload = new Dota2.schema.CMsgDOTARequestGuildData({});
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgGCRequestGuildData, payload);
};

Dota2.Dota2Client.prototype.inviteToGuild = function(guild_id, target_account_id, callback) {
    callback = callback || null;

    /* Attempts to invite target_account_id to a guild.  Expect k_EMsgGCGuildInviteAccountResponse from GC. */
    this.Logger.debug("Inviting person to guild. " + [guild_id, target_account_id].join(", "));
    
    var payload = new Dota2.schema.CMsgDOTAGuildInviteAccountRequest({
        "guild_id": guild_id,
        "target_account_id": target_account_id
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildInviteAccountRequest, 
                    payload,
                    onGuildInviteResponse, 
                    callback);
};

Dota2.Dota2Client.prototype.cancelInviteToGuild = function(guild_id, target_account_id, callback) {
    callback = callback || null;
    var _self = this;

    /* Attempts to cancel target_account_id's invitation to a guild.  Expect k_EMsgGCGuildCancelInviteAccountResponse from GC. */
    this.Logger.debug("Cancelling invite to guild. " + [guild_id, target_account_id].join(", "));
    
    var payload = new Dota2.schema.CMsgDOTAGuildCancelInviteRequest({
        "guild_id": guild_id,
        "target_account_id": target_account_id
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildCancelInviteRequest, 
                    payload,
                    onGuildCancelInviteResponse, 
                    callback);
};

Dota2.Dota2Client.prototype.setGuildAccountRole = function(guild_id, target_account_id, target_role, callback) {
    callback = callback || null;
    /* Attempts to change an account's role in a guild. This can be accepting an invitation or promoting/demoting other guild members. Expect k_EMsgGCGuildSetAccountRoleResponse from GC.
       Roles:
       - 0: Kick member from guild.
       - 1: Leader
       - 2: Officer
       - 3: Member
    */
    this.Logger.debug("Setting guild account role. " + [guild_id, target_account_id, target_role].join(", "));
    
    var payload = new Dota2.schema.CMsgDOTAGuildSetAccountRoleRequest({
        "guild_id": guild_id,
        "target_account_id": target_account_id,
        "target_role": target_role
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleRequest, 
                    payload, 
                    onGuildSetAccountRoleResponse, 
                    callback);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onGuildOpenPartyRefresh = function onGuildOpenPartyRefresh(message) {
    /* Response from requestGuildData containing data on open parties, but most notably - it can tell the library what guilds the user is in. */
    var response = Dota2.schema.CMsgDOTAGuildOpenPartyRefresh.decode(message);
    this.Logger.debug("Got guild open party data");
    this.emit("guildOpenPartyData", response.guild_id, response.open_parties, response);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildOpenPartyRefresh] = onGuildOpenPartyRefresh;

var onGuildDataResponse = function onGuildDataResponse(message) {
    /* Second response from requestGuildData containing general info on the guild (id, members, invitation, ...) */
    var response = Dota2.schema.CMsgDOTAGuildSDO.decode(message);
    this.Logger.debug("Got guild data");
    this.emit("guildData", response.guild_id, response.members, response);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildData] = onGuildDataResponse;

var onGuildInviteResponse = function onGuildInviteResponse(message, callback) {
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
    this.Logger.debug("Guild invite account response: " + response.result);
    if (callback) callback(null, response);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildInviteAccountResponse] = onGuildInviteResponse;

var onGuildCancelInviteResponse = function onGuildCancelInviteResponse(message, callback) {
    callback = callback || null;
    /* Response to cancelling another player's invitation to a guild.
    enum EResult {
      SUCCESS = 0;
      ERROR_UNSPECIFIED = 1;
      ERROR_NO_PERMISSION = 2;
    } */
    var response = Dota2.schema.CMsgDOTAGuildCancelInviteResponse.decode(message);
    this.Logger.debug("Guild cancel invite response: " + response.result);
    if (callback) callback(null, response);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildCancelInviteResponse] = onGuildCancelInviteResponse;

var onGuildInviteData = function onGuildInviteData(message) {
    /* Received an invitation to a guild */
    var guildInviteData = Dota2.schema.CMsgDOTAGuildInviteData.decode(message);

    // Break if it is just info, and not invitation.
    if (!guildInviteData.invitedToGuild) return;

    this.Logger.debug("Received invitation to guild: " + guildInviteData.guild_name);
    this.emit("guildInviteData", guildInviteData.guild_id, guildInviteData.guild_name, guildInviteData.inviter, guildInviteData);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildInviteData] = onGuildInviteData;

var onGuildSetAccountRoleResponse = function onGuildSetAccountRoleResponse(message, callback) {
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
    this.Logger.debug("Guild setAccountRole response: " + setAccountRoleData.result);
    if (callback) callback(null, setAccountRoleData);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCGuildSetAccountRoleResponse] = onGuildSetAccountRoleResponse;