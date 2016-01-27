var Dota2 = require("../index"),
    util = require("util");

// Methods
Dota2.Dota2Client.prototype.respondPartyInvite = function(id, accept) {
    id = id || null;
    accept = accept || false;
    if (id == null) {
        if (this.debug) util.log("Party ID required to respond to an invite.");
        return null;
    }

    if (this.debug) util.log("Responding to party invite " + id + ", accept: " + accept);
    // todo: set client version here?
    var payload = new Dota2.schema.CMsgPartyInviteResponse({
        "party_id": id,
        "accept": accept,
        "as_coach": false,
        "team_id": 0,
        "game_language_enum": 1,
        "game_language_name": "english"
    });
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCPartyInviteResponse, payload);
};

Dota2.Dota2Client.prototype.leaveParty = function() {
    if (this.debug) util.log("Leaving party.");

    var payload = new Dota2.schema.CMsgLeaveParty({});
    this.Party = null;
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCLeaveParty, payload);
};

Dota2.Dota2Client.prototype.setPartyCoach = function(coach) {
    coach = coach || false;
    if (this.Party == null) {
        if (this.debug) util.log("setPartyCoach called when not in a party!");
        return null;
    }

    if (this.debug) util.log("Setting coach slot: " + coach);

    var payload = new Dota2.schema.CMsgDOTAPartyMemberSetCoach({
        "wants_coach": coach
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgGCPartyMemberSetCoach, payload);
};

Dota2.Dota2Client.prototype.inviteToParty = function(steam_id) {
    steam_id = steam_id || null;
    if (steam_id == null) {
        if (this.debug) util.log("Steam ID required to create a party invite.");
        return null;
    }

    if (this.debug) util.log("Inviting " + steam_id + " to a party.");
    // todo: set client version here?
    var payload = new Dota2.schema.CMsgInviteToParty({
        "steam_id": steam_id
    });
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCInviteToParty, payload);
};

Dota2.Dota2Client.prototype.kickFromParty = function(steam_id) {
    steam_id = steam_id || null;
    if (steam_id == null) {
        if (this.debug) util.log("Steam ID required to kick from the party.");
        return null;
    }

    if (this.debug) util.log("Kicking " + steam_id + " from the party.");
    // todo: set client version here?
    var payload = new Dota2.schema.CMsgKickFromParty({
        "steam_id": steam_id
    });
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCKickFromParty, payload);
};