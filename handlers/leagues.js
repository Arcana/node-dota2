var Dota2 = require("../index"),
    util = require("util");

// Methods
/**
 * Sends a message to the Game Coordinator requesting data on leagues being played in the given month.  
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:leaguesInMonthData|leaguesInMonthData} for the Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestLeaguesInMonth
 * @param {number} [month=(new Date()).getMonth()] - Month (MM) you want to query data for. **IMPORTANT NOTE**:  Month is zero-aligned, not one-aligned; so Jan = 00, Feb = 01, etc.
 * @param {number} [year=(new Date()).getFullYear()] - Year (YYYY) you want to query data for.
 * @param {number} [tier=0] - Search only for a specific tier of tournaments. 
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTALeaguesInMonthResponse`
 */
Dota2.Dota2Client.prototype.requestLeaguesInMonth = function(month, year, tier, callback) {
    var _self = this;
    var now = new Date();

    // Month & year default to current time values
    month = month === undefined ? now.getMonth() : month;
    year = year || now.getFullYear();
    tier = tier || 0;
    callback = callback || null;

    this.Logger.debug("Sending CMsgDOTALeaguesInMonthRequest");
    
    var payload = {
        'month': month,
        'year': year,
        'tier': tier
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCLeaguesInMonthRequest, 
                    Dota2.schema.lookupType("CMsgDOTALeaguesInMonthRequest").encode(payload).finish(), 
                    onLeaguesInMonthResponse, callback);
};

/**
 * Requests info on all available official leagues from the GC.
 * Listen for the {@link module:Dota2.Dota2Client#event:leagueData|leagueData} event for the Game Coordinator's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestLeagueInfo
 */
Dota2.Dota2Client.prototype.requestLeagueInfo = function() {
    /* Sends a message to the Game Coordinator request the info on all available official leagues */
    this.Logger.debug("Sending CMsgRequestLeagueInfo");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgRequestLeagueInfo, 
                    Dota2.schema.lookupType("CMsgRequestLeagueInfo").encode(payload).finish());

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
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCTopLeagueMatchesRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCTopLeagueMatchesRequest").encode(payload).finish());

};

// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestLeaguesInMonth|request for the leagues in a given month}.
 * The leagues that are returned are those which have one or more matches in the given month.
 * They can however also have other matches in a different month.
 * @event module:Dota2.Dota2Client#leaguesInMonthData
 * @param {number} month - Month this data represents.
 * @param {number} year - Year this data represents
 * @param {Object[]} leagues - List of leagues that have matches in the given month
 * @param {number} leagues[].league_id - ID of the league
 * @param {Object[]} leagues[].schedule - The scheduled games in this league. Might contain matches in other months.
 * @param {number} leagues[].schedule[].block_id - ID of the schedule block
 * @param {number} leagues[].schedule[].start_time - Unix timestamp of the start time of this scheduled match
 * @param {boolean} leagues[].schedule[].finals - Whether or not this is a finals game
 * @param {string} leagues[].schedule[].comment - Comment about this scheduled block; often the team names & position in bracket
 * @param {Object[]} leagues[].schedule[].teams - The teams duking it out in this match
 * @param {number} leagues[].schedule[].teams[].team_id - ID of the team. Not every participating team seems to be hooked up to Dota 2's team system, so 0 entries can happen
 * @param {string} leagues[].schedule[].teams[].name - Name of the team
 * @param {external:Long} leagues[].schedule[].teams[].logo - Logo of the team
 */
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

var onLeaguesInMonthResponse = function onLeaguesInMonthResponse(message, callback) {
    callback = callback || null;
    var response = Dota2.schema.lookupType("CMsgDOTALeaguesInMonthResponse").decode(message);

    if (response.eresult === 1) {
        this.Logger.debug("Received leagues in month response " + response.eresult);
        this.emit("leaguesInMonthData", response.month, response.year, response.leagues);
        if (callback) callback(null, response);
    } else {
        this.Logger.error("Received a bad leaguesInMonthResponse");
        if (callback) callback(response.eresult, response);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCLeaguesInMonthResponse] = onLeaguesInMonthResponse;

var onLiveLeagueGameUpdate = function onLiveLeagueGameUpdate(message, callback) {
    callback = callback || null;
    var response = Dota2.schema.lookupType("CMsgDOTALiveLeagueGameUpdate").decode(message);

    if (this.debugMore) util.log("Live league games: " + response.live_league_games + ".");
    this.emit("liveLeagueGamesUpdate", response.live_league_games);
    if (callback) callback(null, response.live_league_games);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgDOTALiveLeagueGameUpdate] = onLiveLeagueGameUpdate;

var onLeagueInfoResponse = function onLeagueInfoResponse(message) {
    var response = Dota2.schema.lookupType("CMsgResponseLeagueInfo").decode(message);

    if (response.leagues.length > 0) {
        this.Logger.debug("Received information for " + response.leagues.length + " leagues");
        this.emit("leagueData", response.leagues);
    } else {
        this.Logger.error("Received a bad leagueInfo response", response);
    }

};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgResponseLeagueInfo] = onLeagueInfoResponse;

var onTopLeagueMatchesResponse = function onTopLeagueMatchesResponse(message) {
    var response = Dota2.schema.lookupType("CMsgGCToClientTopLeagueMatchesResponse").decode(message);

    if (response.matches.length > 0) {
        this.Logger.debug("Received information for " + response.matches.length + " league matches");
        this.emit("topLeagueMatchesData", response.matches);
    } else {
        this.Logger.error("Received a bad topLeagueMatches response", response);
    }

};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCToClientTopLeagueMatchesResponse] = onTopLeagueMatchesResponse;