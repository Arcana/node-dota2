var Dota2 = require("../index"),
    util = require("util");

Dota2._matchOptions = {
        hero_id: "number",
        game_mode: "number",
        date_min: "number",
        date_max: "number",
        matches_requested: "number",
        start_at_match_id: "number",
        min_players: "number",
        request_id: "number",
        tournament_games_only: "boolean",
        account_id: "number",
        league_id: "number",
        skill: "number",
        team_id: "number"
};

// Methods
/**
 * Requests a list of matches corresponding to the given criteria. The responses are paginated, 
 * but you can use the `start_at_match_id` and `matches_requested` options to loop through them.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:matchesData|matchesData} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestMatches
 * @param {Object} [criteria] - Filtering options
 * @param {number} [criteria.hero_id] - Show only matches where someone played the given hero
 * @param {number} [criteria.game_mode] - Game mode
 * @param {number} [criteria.start_at_match_id] - Which match ID to start searching at (pagination)
 * @param {number} [criteria.matches_requested=1] - How many matches to retrieve
 * @param {number} [criteria.min_players] - Minimum number of players present during the match
 * @param {number} [criteria.request_id] - A unique identifier that identifies this request
 * @param {boolean} [criteria.tournament_games_only] - Whether or not to only include tournament games
 * @param {number} [criteria.account_id] - Dota2 account ID of a player that needs to be present in all matches
 * @param {number} [criteria.league_id] - Show only matches from the league with this ID
 * @param {number} [criteria.skill] - Skill level of the matches. 0 = Any, 3 = Very high skill.
 * @param {number} [criteria.team_id] - Team ID of the team that's played in the matches
 * @param {number} [criteria.custom_game_id] - Show only custom games with the given ID
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTARequestMatchesResponse`
 */
Dota2.Dota2Client.prototype.requestMatches = function(criteria, callback) {
    criteria = criteria || [];
    callback = callback || null;
    var _self = this;
    
    this.Logger.debug("Sending match request");

    var payload = Dota2._parseOptions(criteria, Dota2._matchOptions);
    payload.matches_requested = payload.matches_requested || 1;

    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCRequestMatches, 
                    Dota2.schema.lookupType("CMsgDOTARequestMatches").encode(payload).finish(), 
                    onMatchesResponse, callback);
}

/**
 * Sends a message to the Game Coordinator requesting the match details for the given match ID. 
 * This method is rate limited. When abused, the GC just stops responding.
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:matchDetailsData|matchDetailsData} event for Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestMatchDetails
 * @param {number} match_id - Match ID for which the bot should fetch the details
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgGCMatchDetailsResponse`
 */
Dota2.Dota2Client.prototype.requestMatchDetails = function(match_id, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting `match_id`'s match details.  Listen for `matchData` event for Game Coordinator's response. */
    this.Logger.debug("Sending match details request");
    
    var payload = {
        "match_id": match_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCMatchDetailsRequest, 
                    Dota2.schema.lookupType("CMsgGCMatchDetailsRequest").encode(payload).finish(), 
                    onMatchDetailsResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting the minimal match details for the given match ID. 
 * This method is rate limited. When abused, the GC just stops responding.
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:matchMinimalDetailsData|matchMinimalDetailsData} event for Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestMatchMinimalDetails
 * @param {number} match_id - Match ID for which the bot should fetch the minimal details
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgClientToGCMatchesMinimalResponse`
 */
Dota2.Dota2Client.prototype.requestMatchMinimalDetails = function(match_ids, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting `match_id`'s match details.  Listen for `matchData` event for Game Coordinator's response. */
    this.Logger.debug("Sending match minimal details request");
    
    var payload = {
        "match_ids": match_ids
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCMatchesMinimalRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCMatchesMinimalRequest").encode(payload).finish(), 
                    onMatchMinimalDetailsResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting the current match making stats. 
 * Listen for {@link module:Dota2.Dota2Client#event:matchmakingStatsData|matchmakingStatsData} event for Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestMatchmakingStats
 */
Dota2.Dota2Client.prototype.requestMatchmakingStats = function() {
    /* Sends a message to the Game Coordinator requesting `match_id`'s match deails.  Listen for `matchData` event for Game Coordinator's response. */
    // Is not Job ID based - can't do callbacks.
    this.Logger.debug("Sending matchmaking stats request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCMatchmakingStatsRequest, 
                    Dota2.schema.lookupType("CMsgDOTAMatchmakingStatsRequest").encode(payload).finish());
};

/**
 * Sends a message to the Game Coordinator requesting the current top matches played by your friends. 
 * Listen for {@link module:Dota2.Dota2Client#event:topFriendMatchesData|topFriendMatchesData} event for Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestTopFriendMatches
 */
Dota2.Dota2Client.prototype.requestTopFriendMatches = function() {
    /* Sends a message to the Game Coordinator request the info on all available official leagues */
    this.Logger.debug("Sending CMsgClientToGCTopFriendMatchesRequest");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCTopFriendMatchesRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCTopFriendMatchesRequest").encode(payload).finish());

};

// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatches|request for matches}
 * @event module:Dota2.Dota2Client#matchesData
 * @param {number} requestId - Id of the request to which this event is the answer
 * @param {number} total_results - Total number of results corresponding to the query (max 500)
 * @param {number} results_remaining - Total number of results not in this response
 * @param {CMsgDOTAMatch[]} matches - List of match information objects
 * @param {Object[]} series - List of series
 * @param {CMsgDOTAMatch[]} series[].matches - List of match information objects for the matches in this series
 * @param {number} series[].series_id - ID of the series
 * @param {number} series[].series_type - Type of the series
 * @param {CMsgDOTARequestMatchesResponse} matchResponse - A `CMsgDOTARequestMatchesResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatchDetails|request for a match's details}
 * @event module:Dota2.Dota2Client#matchDetailsData
 * @param {number} match_id - Match ID for which the details where asked
 * @param {CMsgGCMatchDetailsResponse} matchDetailsResponse - A `CMsgGCMatchDetailsResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatchMinimalDetails|request for a/multiples match's minimal details}
 * @event module:Dota2.Dota2Client#matchMinimalDetailsData
 * @param {boolean} last_match - Whether or not the last of the requested matches is included in this response
 * @param {CMsgClientToGCMatchesMinimalResponse} matchMinimalDetailsResponse - A `CMsgClientToGCMatchesMinimalResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatchmakingStats|request for the match making stats}
 * @event module:Dota2.Dota2Client#matchmakingStatsData
 * @param {number} matchgroups_version - Version nr of the match groups (these evolve over time). For the current list check {@link https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/regions.txt|regions.txt}
 * @param {Object[]} match_groups - The different match groups and their stats
 * @param {number} match_groups[].players_searching - The number of people searching for a match
 * @param {number} match_groups[].auto_region_select_ping_penalty - Ping penalty for people searching this region
 * @param {CMsgDOTAMatchmakingStatsResponse} matchmakingStatsResponse - A `CMsgDOTAMatchmakingStatsResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestTopFriendMatches|request for the current top matches played by your friends}
 * @event module:Dota2.Dota2Client#topFriendMatchesData
 * @param {CMsgDOTAMatchMinimal[]} matches - A list of `CMsgDOTAMatchMinimal` objects containing the minimal match details of the matches your friends are currently playing.
 */


// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onMatchesResponse = function onMatchesResponse(message, callback) {
    callback = callback || null;
    var matchResponse = Dota2.schema.lookupType("CMsgDOTARequestMatchesResponse").decode(message);
    if (matchResponse.total_results > 1) {
        this.Logger.debug("Received listing for matches");
        this.emit("matchesData",
            matchResponse.request_id,
            matchResponse.total_results,
            matchResponse.results_remaining,
            matchResponse.matches,
            matchResponse.series,
            matchResponse);
        if (callback) callback(null, matchResponse);
    } else {
        this.Logger.error("Received a bad matchesResponse");
        if (callback) callback(matchResponse.result, matchResponse);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCRequestMatchesResponse] = onMatchesResponse;

var onMatchDetailsResponse = function onMatchDetailsResponse(message, callback) {
    callback = callback || null;
    var matchDetailsResponse = Dota2.schema.lookupType("CMsgGCMatchDetailsResponse").decode(message);

    if (matchDetailsResponse.result === 1) {
        this.Logger.debug("Received match data for: " + matchDetailsResponse.match.match_id);
        this.emit("matchDetailsData",
            matchDetailsResponse.match.match_id,
            matchDetailsResponse);
        if (callback) callback(null, matchDetailsResponse);
    } else {
        this.Logger.error("Received a bad matchDetailsResponse");
        if (callback) callback(matchDetailsResponse.result, matchDetailsResponse);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCMatchDetailsResponse] = onMatchDetailsResponse;

var onMatchMinimalDetailsResponse = function onMatchMinimalDetailsResponse(message, callback) {
    callback = callback || null;
    var matchMinimalDetailsResponse = Dota2.schema.lookupType("CMsgClientToGCMatchesMinimalResponse").decode(message);

    if (matchMinimalDetailsResponse.matches) {
        this.Logger.debug("Received match minimal data for: " + matchMinimalDetailsResponse.matches.match_id);
        this.emit("matchMinimalDetailsData",
            matchMinimalDetailsResponse.last_match,
            matchMinimalDetailsResponse);
        if (callback) callback(null, matchMinimalDetailsResponse);
    } else {
        this.Logger.error("Received a bad matchMinimalDetailsResponse");
		if (this.debug) console.log(JSON.stringify(matchMinimalDetailsResponse));
        if (callback) callback(matchMinimalDetailsResponse.result, matchMinimalDetailsResponse);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCMatchesMinimalResponse] = onMatchMinimalDetailsResponse;

var onMatchmakingStatsResponse = function onMatchmakingStatsResponse(message) {
    // Is not Job ID based - can't do callbacks.
    var matchmakingStatsResponse = Dota2.schema.lookupType("CMsgDOTAMatchmakingStatsResponse").decode(message);

    this.Logger.debug("Received matchmaking stats");
    this.emit("matchmakingStatsData",
        matchmakingStatsResponse.matchgroups_version,
        matchmakingStatsResponse.match_groups,
        matchmakingStatsResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCMatchmakingStatsResponse] = onMatchmakingStatsResponse;

var onTopFriendMatchesResponse = function onTopFriendMatchesResponse(message) {
    var response = Dota2.schema.lookupType("CMsgGCToClientTopFriendMatchesResponse").decode(message);

    if (response.matches.length > 0) {
        this.Logger.debug("Received information for " + response.matches.length + " friend matches");
        this.emit("topFriendMatchesData", response.matches);
    } else {
        this.Logger.error("Received a bad topFriendMatches response", response);
    }

};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCToClientTopFriendMatchesResponse] = onTopFriendMatchesResponse;
