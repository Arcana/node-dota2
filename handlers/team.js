var Dota2 = require("../index"),
    util = require("util");

/**
 * Sends a message to the Game Coordinator requesting the authenticated user's team data.
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:teamData|teamData} for the Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestMyTeams
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTATeamsInfo`
 */
Dota2.Dota2Client.prototype.requestMyTeams = function requestMyTeams(callback) {
    // Request the team data for the currently logged in user
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        this.Logger.error("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    this.Logger.debug("Requesting my own team data");
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCMyTeamInfoRequest,
                    Dota2.schema.lookupType("CMsgDOTAMyTeamInfoRequest").encode(payload).finish(), 
                    onTeamDataResponse, callback);
}

/**
 * Sends a message to the Game Coordinator requesting The list of pro teams.  
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:proTeamListData|proTeamListData} for the Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * 
 * This function hasn't been responded to by the GC for a long time.
 * @deprecated
 * @ignore
 * @alias module:Dota2.Dota2Client#requestProTeamList
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTAProTeamListResponse`
 */
Dota2.Dota2Client.prototype.requestProTeamList = function requestProTeamList(callback) {
    // Request the list of pro teams
    callback = callback || null;
    var _self = this;

    this.Logger.debug("Requesting list of pro teams");
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCProTeamListRequest, 
                    Dota2.schema.lookupType("CMsgDOTAProTeamListRequest").encode(payload).finish(), 
                    onProTeamListResponse, callback);
}

// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMyTeams|request for your teams}.
 * @event module:Dota2.Dota2Client#teamData
 * @param {CMsgDOTATeamInfo[]} teams - A list of `CMsgDOTATeamInfo` objects containing information about the teams you're in (name, members, stats, ...)
 * @param {number} league_id - No clue why this is here, nor what it signifies
 */
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestProTeamList|request for pro teams}.
 * @deprecated
 * @ignore
 * @event module:Dota2.Dota2Client#proTeamListData
 * @param {Object[]} teams - A list pro teams
 * @param {number} teams[].team_id - ID of the team
 * @param {string} teams[].tag - Tag of the team
 * @param {number} teams[].time_created - Unix timestamp of the moment the team was created
 * @param {external:Long} teams[].logo - Logo of the team
 * @param {string} teams[].country_code - Two-letter country code for the team
 * @param {number} teams[].member_count - Number of members in the team
 */

// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onTeamDataResponse = function onTeamDataResponse(message, callback) {
    var teamDataResponse = Dota2.schema.lookupType("CMsgDOTATeamsInfo").decode(message);
    
    this.Logger.debug("Received my teams response " + JSON.stringify(teamDataResponse));
    this.emit("teamData", teamDataResponse.teams, teamDataResponse.league_id);
    if (callback) callback(null, teamDataResponse);
    
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCToClientTeamsInfo] = onTeamDataResponse;

// No longer gets triggered
var onProTeamListResponse = function onProTeamListResponse(message, callback) {
    var teams = Dota2.schema.lookupType("CMsgDOTAProTeamListResponse").decode(message);
    
    if (teams.eresult === 1) {
        this.Logger.debug("Received pro team list");
        this.emit("proTeamListData", teams.teams);
        if (callback) callback(null, teams);
    } else {
        this.Logger.error("Bad pro team list response " + JSON.stringify(teams));
        this.emit("proTeamListData", null);
        if (callback) callback(teams.eresult, teams);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCProTeamListResponse] = onProTeamListResponse;