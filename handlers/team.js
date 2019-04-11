var Dota2 = require("../index");

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

    this.Logger.debug("Requesting my own team data");
    var payload = new Dota2.schema.CMsgDOTAMyTeamInfoRequest({});
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCMyTeamInfoRequest,
                    payload, 
                    onTeamDataResponse, 
                    callback);
}

// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMyTeams|request for your teams}.
 * @event module:Dota2.Dota2Client#teamData
 * @param {CMsgDOTATeamInfo[]} teams - A list of `CMsgDOTATeamInfo` objects containing information about the teams you're in (name, members, stats, ...)
 * @param {number} league_id - No clue why this is here, nor what it signifies
 */

// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onTeamDataResponse = function onTeamDataResponse(message, callback) {
    var teamDataResponse = Dota2.schema.CMsgDOTATeamsInfo.decode(message);
    
    this.Logger.debug("Received my teams response " + JSON.stringify(teamDataResponse));
    this.emit("teamData", teamDataResponse.teams, teamDataResponse.league_id);
    if (callback) callback(null, teamDataResponse);
    
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCToClientTeamsInfo] = onTeamDataResponse;