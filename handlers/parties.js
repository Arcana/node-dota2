var Dota2 = require("../index");

// Methods
/** 
 * Responds to a party invite.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#respondPartyInvite
 * @param {external:Long} id - The party's ID
 * @param {boolean} [accept=false] - Whether or not you accept the invite
 * @param {CMsgClientPingData} [ping_data=undefined] - Optional argument that can be provided when accepting an invite. Contains a.o. the ping to the different servers. 
 */
Dota2.Dota2Client.prototype.respondPartyInvite = function(id, accept, ping_data) {
    id = id || null;
    accept = accept || false;
    if (id == null) {
        this.Logger.error("Party ID required to respond to an invite.");
        return null;
    }

    this.Logger.debug("Responding to party invite " + id + ", accept: " + accept);
    
    var payload = new Dota2.schema.CMsgPartyInviteResponse({
        "party_id": id,
        "accept": accept,
        "ping_data": ping_data
    });
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCPartyInviteResponse, payload);
};

/**
 * Leaves the current party. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#leaveParty
 */
Dota2.Dota2Client.prototype.leaveParty = function() {
    this.Logger.debug("Leaving party.");

    var payload = new Dota2.schema.CMsgLeaveParty({});
    this.Party = null;
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCLeaveParty, payload);
};

/**
 * Tries to assign a party member as party leader. 
 * Only works if you are a party leader and the proposed user is a member of 
 * the current party.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#setPartyLeader
 * @param {external:Long} steam_id - The Steam ID of the new party leader
 */
Dota2.Dota2Client.prototype.setPartyLeader = function(steam_id) {
    steam_id = steam_id || null;
    if (this.Party == null) {
        this.Logger.error("setPartyLeader called when not in a party!");
        return null;
    }
    if (steam_id == null) {
        this.Logger.error("Steam ID required to set party leader.");
        return null;
    }

    this.Logger.debug("Setting party leader: " + steam_id);

    var payload = new Dota2.schema.CMsgDOTASetGroupLeader({
        "new_leader_steamid": steam_id
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCSetPartyLeader, payload);
}

/**
 * Announces whether or not you want to be coach of the current party. GC will take action accordingly.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#setPartyCoach
 * @param {boolean} coach - True if you want to be coach, false if you no longer want to be coach
 */
Dota2.Dota2Client.prototype.setPartyCoach = function(coach) {
    coach = coach || false;
    if (this.Party == null) {
        this.Logger.error("setPartyCoach called when not in a party!");
        return null;
    }

    this.Logger.debug("Setting coach slot: " + coach);

    var payload = new Dota2.schema.CMsgDOTAPartyMemberSetCoach({
        "wants_coach": coach
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgGCPartyMemberSetCoach, payload);
};

/**
 * Invite a player to your party.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#inviteToParty
 * @param {external:Long} steam_id - Steam ID of the player you want to invite
 */
Dota2.Dota2Client.prototype.inviteToParty = function(steam_id) {
    steam_id = steam_id || null;
    if (steam_id == null) {
        this.Logger.error("Steam ID required to create a party invite.");
        return null;
    }

    this.Logger.debug("Inviting " + steam_id + " to a party.");
    
    var payload = new Dota2.schema.CMsgInviteToParty({
        "steam_id": steam_id
    });
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCInviteToParty, payload);
};

/**
 * Kick a player from your party. Only works if you're party leader.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#kickFromParty
 * @param {external:Long} steam_id - Steam ID of the player you want to kick
 */
Dota2.Dota2Client.prototype.kickFromParty = function(steam_id) {
    steam_id = steam_id || null;
    if (steam_id == null) {
        this.Logger.error("Steam ID required to kick from the party.");
        return null;
    }

    this.Logger.debug("Kicking " + steam_id + " from the party.");
    
    var payload = new Dota2.schema.CMsgKickFromParty({
        "steam_id": steam_id
    });
    this.sendToGC(Dota2.schema.EGCBaseMsg.k_EMsgGCKickFromParty, payload);
};