var Dota2 = require("../index");

// Methods

/**
 * Requests info on all available official leagues from the GC.
 * Listen for the {@link module:Dota2.Dota2Client#event:leagueData|leagueData} event for the Game Coordinator's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestLeagueInfo
 */
Dota2.Dota2Client.prototype.requestLeagueInfo = function() {
    /* Sends a message to the Game Coordinator request the info on all available official leagues */
    this.Logger.debug("Sending CMsgRequestLeagueInfo");
    
    var payload = new Dota2.schema.CMsgRequestLeagueInfo({});
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgRequestLeagueInfo, payload);

};

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
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestLeagueInfo|request for league info}.
 * @event module:Dota2.Dota2Client#leagueData
 * @param {Object[]} leagues - List of all leagues
 * @param {number} leagues[].league_id - ID of the league
 * @param {number} leagues[].last_match_time - Unix timestamp of when the last match took place
 * @param {number} leagues[].prize_pool_usd - Price pool in US$
 * @param {boolean} leagues[].has_live_matches - Whether or not if there are currently live matches
 * @param {boolean} leagues[].is_compendium_public - Whether or not there is a public compendium
 * @param {number} leagues[].compendium_version - Verion nr of the compendium
 * @param {number} leagues[].compendium_content_version - Version nr of the compendium contents
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

var onLeagueInfoResponse = function onLeagueInfoResponse(message) {
    var response = Dota2.schema.CMsgResponseLeagueInfo.decode(message);

    if (response.leagues.length > 0) {
        this.Logger.debug("Received information for " + response.leagues.length + " leagues");
        this.emit("leagueData", response.leagues);
    } else {
        this.Logger.error("Received a bad leagueInfo response", response);
    }

};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgResponseLeagueInfo] = onLeagueInfoResponse;

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