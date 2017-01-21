var Dota2 = require("../index"),
    util = require("util");

// Methods
Dota2.Dota2Client.prototype.respondPartyInvite = function(id, accept, ping_data) {
    id = id || null;
    accept = accept || false;
    if (id == null) {
        if (this.debug) util.log("Party ID required to respond to an invite.");
        return null;
    }

    if (this.debug) util.log("Responding to party invite " + id + ", accept: " + accept);
    // todo: set client version here?
    var payload = {
        "party_id": id,
        "accept": accept,
        "ping_data": ping_data
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").k_EMsgGCPartyInviteResponse, 
                    Dota2.schema.lookupType("CMsgPartyInviteResponse").encode(payload).finish());
};

Dota2.Dota2Client.prototype.leaveParty = function() {
    if (this.debug) util.log("Leaving party.");

    var payload = {};
    this.Party = null;
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").k_EMsgGCLeaveParty, 
                    Dota2.schema.lookupType("CMsgLeaveParty").encode(payload).finish());
};

Dota2.Dota2Client.prototype.setPartyLeader = function(steam_id) {
    steam_id = steam_id || null;
    if (this.Party == null) {
        if (this.debug) util.log("setPartyLeader called when not in a party!");
        return null;
    }
    if (steam_id == null) {
        if (this.debug) util.log("Steam ID required to set party leader.");
        return null;
    }

    if (this.debug) util.log("Setting party leader: " + steam_id);

    var payload = {
        "new_leader_steamid": steam_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCSetPartyLeader, 
                    Dota2.schema.lookupType("CMsgDOTASetGroupLeader").encode(payload).finish());
}

Dota2.Dota2Client.prototype.setPartyCoach = function(coach) {
    coach = coach || false;
    if (this.Party == null) {
        if (this.debug) util.log("setPartyCoach called when not in a party!");
        return null;
    }

    if (this.debug) util.log("Setting coach slot: " + coach);

    var payload = {
        "wants_coach": coach
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPartyMemberSetCoach, 
                    Dota2.schema.lookupType("CMsgDOTAPartyMemberSetCoach").encode(payload).finish());
};

Dota2.Dota2Client.prototype.inviteToParty = function(steam_id) {
    steam_id = steam_id || null;
    if (steam_id == null) {
        if (this.debug) util.log("Steam ID required to create a party invite.");
        return null;
    }

    if (this.debug) util.log("Inviting " + steam_id + " to a party.");
    // todo: set client version here?
    var payload = {
        "steam_id": steam_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").k_EMsgGCInviteToParty, 
                    Dota2.schema.lookupType("CMsgInviteToParty").encode(payload).finish());
};

Dota2.Dota2Client.prototype.kickFromParty = function(steam_id) {
    steam_id = steam_id || null;
    if (steam_id == null) {
        if (this.debug) util.log("Steam ID required to kick from the party.");
        return null;
    }

    if (this.debug) util.log("Kicking " + steam_id + " from the party.");
    // todo: set client version here?
    var payload = {
        "steam_id": steam_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").k_EMsgGCKickFromParty, 
                    Dota2.schema.lookupType("CMsgKickFromParty").encode(payload).finish());
};