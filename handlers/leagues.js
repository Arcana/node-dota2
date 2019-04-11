var Dota2 = require("../index");

// Methods

/**
 * Sends a message to the Game Coordinator requesting the top league matches.
 * Listen for the {@link module:Dota2.Dota2Client#event:topLeagueMatchesData|topLeagueMatchesData} event for the Game Coordinator's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestTopLeagueMatches
 */
Dota2.Dota2Client.prototype.requestTopLeagueMatches = function() {
    /* Sends a message to the Game Coordinator request the info on all available official leagues */
    this.Logger.debug("Sending CMsgClientToGCTopLeagueMatchesRequest");
    
    var payload = new Dota2.schema.CMsgClientToGCTopLeagueMatchesRequest({});
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCTopLeagueMatchesRequest, payload);

};

// Events
/**
 * Emitted when the GC sends a `CMsgDOTALiveLeagueGameUpdate`.
 * @event module:Dota2.Dota2Client#liveLeagueGamesUpdate
 * @param {number} live_league_games - The number of live league games
 */
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestTopLeagueMatches|request for top league matches}.
 * @event module:Dota2.Dota2Client#topLeagueMatchesData
 * @param {Object[]} matches - List of top matches
 * @param {external:Long} matches[].match_id - Match ID
 * @param {number} matches[].start_time - Unix timestamp of the start of the match
 * @param {number} matches[].duration - Duration of the match in seconds
 * @param {DOTA_GameMode} matches[].game_mode - Game mode
 * @param {CMsgDOTAMatchMinimal.Player} matches[].players - List of all the players in the game, contains id, hero, K/D/A and items
 * @param {CMsgDOTAMatchMinimal.Tourney} matches[].tourney - Information on the league if this is a league match
 * @param {EMatchOutcome} matches[].match_outcome - Who won
 */
 
// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onLiveLeagueGameUpdate = function onLiveLeagueGameUpdate(message, callback) {
    callback = callback || null;
    var response = Dota2.schema.CMsgDOTALiveLeagueGameUpdate.decode(message);

    if (this.debugMore) this.Logger.debug("Live league games: " + response.live_league_games + ".");
    this.emit("liveLeagueGamesUpdate", response.live_league_games);
    if (callback) callback(null, response.live_league_games);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgDOTALiveLeagueGameUpdate] = onLiveLeagueGameUpdate;

var onTopLeagueMatchesResponse = function onTopLeagueMatchesResponse(message) {
    var response = Dota2.schema.CMsgGCToClientTopLeagueMatchesResponse.decode(message);

    if (response.matches.length > 0) {
        this.Logger.debug("Received information for " + response.matches.length + " league matches");
        this.emit("topLeagueMatchesData", response.matches);
    } else {
        this.Logger.error("Received a bad topLeagueMatches response", response);
    }

};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCToClientTopLeagueMatchesResponse] = onTopLeagueMatchesResponse;