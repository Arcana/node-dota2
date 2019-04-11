var Dota2 = require("../index");

Dota2._playerHistoryOptions = {
    start_at_match_id: "number",
    matches_requested: "number",
    hero_id: "number",
    request_id: "number",
    include_practice_matches: "boolean",
    include_custom_games: "boolean"
};

// Methods
/**
 * Requests the given player's match history. The responses are paginated, 
 * but you can use the `start_at_match_id` and `matches_requested` options to loop through them.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:playerMatchHistoryData|playerMatchHistoryData} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestPlayerMatchHistory
 * @param {number} account_id - Dota 2 account ID of the player whose match history the bot should fetch
 * @param {Object} [options] - Filtering options
 * @param {number} [options.start_at_match_id] - Which match ID to start searching at (pagination)
 * @param {number} [options.matches_requested] - How many matches to retrieve
 * @param {number} [options.hero_id] - Show only matches where player played the given hero
 * @param {number} [options.request_id=account_id] - A unique identifier that identifies this request
 * @param {boolean} [options.include_practice_matches] - Whether or not to include practice matches in the results
 * @param {boolean} [options.include_custom_games] - Whether or not to include custom games in the results
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTAGetPlayerMatchHistoryResponse`
 */
Dota2.Dota2Client.prototype.requestPlayerMatchHistory = function(account_id, options, callback) {
    callback = callback || null;
    options = options || null;
    /* Sends a message to the Game Coordinator requesting `accountId`'s player match history.  Listen for `playerMatchHistoryData` event for Game Coordinator's response. */
    this.Logger.debug("Sending player match history request");
    
    var payload = new Dota2.schema.CMsgDOTAGetPlayerMatchHistory(Dota2._parseOptions(options, Dota2._playerHistoryOptions));
    payload.account_id = account_id;
    payload.matches_requested = payload.matches_requested || 1;
    payload.request_id = payload.request_id || account_id;
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgDOTAGetPlayerMatchHistory, 
                    payload, 
                    onPlayerMatchHistoryResponse, 
                    callback);
};

/**
 * Sends a message to the Game Coordinator requesting `account_id`'s profile card. 
 * This method is heavily rate limited. When abused, the GC just stops responding.
 * Even the regular client runs into this limit when you check too many profiles.
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:profileCardData|profileCardData} event for Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestProfileCard
 * @param {number} account_id - Dota 2 account ID of the player whose profile card the bot should fetch
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTAProfileCard`
 */
Dota2.Dota2Client.prototype.requestProfileCard = function(account_id, callback) {
    callback = callback || null;
    
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile card.  Listen for `profileCardData` event for Game Coordinator's response. */
    this.Logger.debug("Sending profile card request");
    
    var payload = new Dota2.schema.CMsgClientToGCGetProfileCard({
        "account_id": account_id
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetProfileCard, 
                    payload, 
                    onProfileCardResponse, 
                    callback);
};

/**
 * Sends a message to the Game Coordinator requesting `account_id`'s profile page. 
 * This method is heavily rate limited. When abused, the GC just stops responding.
 * Even the regular client runs into this limit when you check too many profiles.
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:profileData|profileData} event for Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestProfile
 * @param {number} account_id - Dota 2 account ID of the player whose profile page the bot should fetch
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTAProfileResponse`
 */
Dota2.Dota2Client.prototype.requestProfile = function(account_id, callback) {
    callback = callback || null;
    
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile.  Listen for `profileData` event for Game Coordinator's response. */
    this.Logger.debug("Sending profile request");
    
    var payload = new Dota2.schema.CMsgProfileRequest({
        "account_id": account_id
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgProfileRequest, 
                    payload,
                    onProfileResponse, 
                    callback);
};


/**
 * Sends a message to the Game Coordinator requesting the Hall of Fame data for `week`. 
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:hallOfFameData|hallOfFameData} event for the Game Coordinator's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestHallOfFame
 * @param {number} week - The week of which you wish to know the Hall of Fame members; will return latest week if omitted. Weeks are counted from start of unix epoch with a lower bound of 2233 (2012-10-18)
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTAHallOfFameResponse`
 */
Dota2.Dota2Client.prototype.requestHallOfFame = function(week, callback) {
    week = week || null;
    callback = callback || null;

    /* Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. */
    this.Logger.debug("Sending hall of fame request.");
    
    var payload = new Dota2.schema.CMsgDOTAHallOfFameRequest({
        "week": week
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgGCHallOfFameRequest, 
                    payload, 
                    onHallOfFameResponse, 
                    callback);
};

/**
 * Sends a message to the Game Coordinator requesting one or multiple `account_ids` player information. 
 * This includes their display name, country code, team info and sponsor, fantasy role, official information lock status, and if the user is marked as a pro player. 
 * Listen for the {@link module:Dota2.Dota2Client#event:playerInfoData|playerInfoData} event for the Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestPlayerInfo
 * @param {number|number[]} account_ids - Either a single or array of Account IDs (lower 32-bits of a 64-bit Steam ID) of desired user(s) player info.
 */
Dota2.Dota2Client.prototype.requestPlayerInfo = function(account_ids) {
    account_ids = account_ids || [];
    account_ids = (Array.isArray(account_ids) ? account_ids : [account_ids]).map(id => ({'account_id': id}));
    
    if (account_ids.length == 0) {
        this.Logger.error("Account ids must be a single id or array of ids.");
        return null;
    }

    /* Sends a message to the Game Coordinator requesting the player info on all `account_ids`. Listen for `playerInfoData` event for Game Coordinator's response. */
    this.Logger.debug("Sending player info request.");

    var payload = new Dota2.schema.CMsgGCPlayerInfoRequest({
        player_infos: account_ids
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgGCPlayerInfoRequest, payload);
};

/**
 * Sends a message to the Game Coordinator requesting `account_id`'s trophy data. 
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:trophyListData|trophyListData} event for Game Coordinator's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestTrophyList
 * @param {number} account_id - Dota 2 account ID of the player whose trophy data the bot should fetch
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgClientToGCGetTrophyListResponse`
 */
Dota2.Dota2Client.prototype.requestTrophyList = function(account_id, callback) {
    account_id = account_id || null;

    /* Sends a message to the Game Coordinator requesting `accountId`'s trophy list. Listen for `trophyListData` event for Game Coordinator's response. */
    this.Logger.debug("Sending trophy list request.");

    var payload = new Dota2.schema.CMsgClientToGCGetTrophyList({
        "account_id": account_id
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetTrophyList,
                    payload,
                    onTrophyListResponse, 
                    callback);
};

/**
 * Sends a message to the Game Coordinator requesting `account_id`'s player stats. 
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:playerStatsData|playerStatsData} event for Game Coordinator's response. 
 * This data contains all stats shown on a player's profile page.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestPlayerStats
 * @param {number} account_id - Dota 2 account ID of the player whose player stats the bot should fetch
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgGCToClientPlayerStatsResponse`
 */
Dota2.Dota2Client.prototype.requestPlayerStats = function(account_id, callback) {
    callback = callback || null;
    account_id = account_id || null;

    /* Sends a message to the Game Coordinator requesting `accountId`'s stats. Listen for `playerStatsData` event for Game Coordinator's response. */
    this.Logger.debug("Sending player stats request.");

    var payload = new Dota2.schema.CMsgClientToGCPlayerStatsRequest({
        "account_id": account_id
    });
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCPlayerStatsRequest,
                    payload,
                    onPlayerStatsResponse, 
                    callback);
}

// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestPlayerMatchHistory|request for a player's match history}
 * @event module:Dota2.Dota2Client#playerMatchHistoryData
 * @param {number} requestId - Id of the request to which this event is the answer
 * @param {CMsgDOTAGetPlayerMatchHistoryResponse} matchHistoryResponse - The raw response data containing the user's match history.
 */
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestProfileCard|request for a player's profile card}
 * @event module:Dota2.Dota2Client#profileCardData
 * @param {number} account_id - Dota2 account ID of the player whose profile card was fetched.
 * @param {CMsgDOTAProfileCard} profileCardResponse - The raw response data containing the user's profile card.
 */
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestProfile|request for a player's profile page}
 * @event module:Dota2.Dota2Client#profileData
 * @param {CMsgProfileResponse} profileResponse - The raw response data containing the user's profile page.
 */
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestHallOfFame|request for a player's profile card}
 * @event module:Dota2.Dota2Client#hallOfFameData
 * @param {number} week - Weeks since unix epoch for which the hall of fame data was fetched
 * @param {Object[]} featured_players - This week's featured players
 * @param {number} featured_players[].account_id - Dota2 account id of the featured player
 * @param {number} featured_players[].hero_id - ID of the hero
 * @param {number} featured_players[].average_scaled_metric - Scaled metric of awesomeness
 * @param {number} featured_players[].num_games - The number of games played
 * @param {Object} featured_farmer - This week's featured farmer
 * @param {number} featured_farmer.account_id - Dota2 account id of the featured farmer
 * @param {number} featured_farmer.hero_id - ID of the hero
 * @param {number} featured_farmer.gold_per_min - GPM for the featured match
 * @param {number} featured_farmer.match_id - Match ID of the featured match
 * @param {CMsgDOTAHallOfFameResponse} hallOfFameResponse - The raw response data containing the requested week's hall of fame.
 */
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestPlayerInfo|request for a player's info}
 * @event module:Dota2.Dota2Client#playerInfoData
 * @param {Object} playerInfoData - A `CMsgGCPlayerInfo` object containing the player's info.
 * @param {Object[]} playerInfoData.player_infos - List of player information
 * @param {number} playerInfoData.player_infos[].account_id - Dota2 account ID of the player
 * @param {string} playerInfoData.player_infos[].name - The display name for the player
 * @param {string} playerInfoData.player_infos[].country_code - The abbreviated country code for the user if available (i.e. `us`, `cn`, etc...)
 * @param {number} playerInfoData.player_infos[].fantasy_role - The role of the player, either core or support, `1` and `2` respectively
 * @param {number} playerInfoData.player_infos[].team_id - The numerical id of the user's team
 * @param {string} playerInfoData.player_infos[].team_name - The name of the team the user is on, ex: `Cloud9`
 * @param {string} playerInfoData.player_infos[].team_tag - The abbreviated tag of a team prepended to a player's name, ex: `C9`
 * @param {string} playerInfoData.player_infos[].sponsor - The sponsor listed in the player's official info, ex: `HyperX`  
 * @param {boolean} playerInfoData.player_infos[].is_locked - Whether or not the user's official player info has been locked from editing, `true` or `false`
 * @param {boolean} playerInfoData.player_infos[].is_pro - Whether the player is considered a pro player by Valve, `true` or `false`
 * @param {number} playerInfoData.player_infos[].locked_until - Timestamp indicating end of lock period
 * @param {number} playerInfoData.player_infos[].timestamp - Unknown
 */
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestTrophyList|request for a player's trophy list}
 * @event module:Dota2.Dota2Client#trophyListData
 * @param {Object} trophyListResponse - A `CMsgClientToGCGetTrophyListResponse` object containing the player's trophy list.
 * @param {number} trophyListResponse.account_id - Dota2 account ID of the player
 * @param {Object[]} trophyListResponse.trophies - List of player trophies
 * @param {number} trophyListResponse.trophies[].trophy_id - Id of the trophy
 * @param {number} trophyListResponse.trophies[].trophy_score - The score this trophy has counted.  This is usually a level, but can represent other things, like number of challenges completed, or coins collected, etc...
 * @param {number} trophyListResponse.trophies[].last_updated - The last time the trophy has been updated, in Unix time
 * @param {string} trophyListResponse.profile_name - The name displayed on the user's dota profile page and profile card
 */
 
 /**
  * Player statistics
  * @typedef {Object} module:Dota2.schema.CMsgGCToClientPlayerStatsResponse
  * @property {number} account_id - Dota2 account ID of the player
  * @property {number[]} player_stats 
  * @property {number} match_count - Number of matches played
  * @property {number} mean_gpm - Mean GPM per match over the last 20 matches
  * @property {number} mean_xppm - Mean XPPM per match over the last 20 matches
  * @property {number} mean_lasthits - Mean last hits per match over the last 20 matches
  * @property {number} rampages - All time number of rampages
  * @property {number} triple_kills - All time number of triple kills
  * @property {number} first_blood_claimed - All time number of times the player claimed first blood
  * @property {number} first_blood_given - All time number of times the player fed first blood
  * @property {number} couriers_killed - All time number of couriers killed
  * @property {number} aegises_snatched - All time number of aegises snatched
  * @property {number} cheeses_eaten - All time amount of cheese eaten
  * @property {number} creeps_stacked - All time number of camps stacked
  * @property {number} fight_score - Fighting score over the last 20 matches
  * @property {number} farm_score - Farming score over the last 20 matches
  * @property {number} support_score - Support score over the last 20 matches
  * @property {number} push_score - Push score over the last 20 matches
  * @property {number} versatility_score - Hero versatility over the last 20 matches
  */
 
 /**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestPlayerStats|request for a player's stats}
 * @event module:Dota2.Dota2Client#playerStatsData
 * @param {number} account_id - Dota2 account ID of the player
 * @param {module:Dota2.schema.CMsgGCToClientPlayerStatsResponse} playerStatsResponse -The player's stats.
 */

// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onPlayerMatchHistoryResponse = function onPlayerMatchHistoryResponse(message, callback) {
    callback = callback || null;
    var matchHistoryResponse = Dota2.schema.CMsgDOTAGetPlayerMatchHistoryResponse.decode(message);

    if (typeof matchHistoryResponse.matches != "undefined") {
        this.Logger.debug("Received player match history data");
        this.emit("playerMatchHistoryData", matchHistoryResponse.requestId, matchHistoryResponse);
        if (callback) callback(null, matchHistoryResponse);
    } else {
        this.Logger.error("Received a bad GetPlayerMatchHistoryResponse");
        if (callback) callback(matchHistoryResponse.result, matchHistoryResponse);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgDOTAGetPlayerMatchHistoryResponse] = onPlayerMatchHistoryResponse;

var onProfileCardResponse = function onProfileCardResponse(message, callback) {
    callback = callback || null;
    var profileCardResponse = Dota2.schema.CMsgDOTAProfileCard.decode(message);

    this.Logger.debug("Received profile card data for: " + profileCardResponse.account_id);
    this.emit("profileCardData", profileCardResponse.account_id, profileCardResponse);
    if (callback) callback(null, profileCardResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetProfileCardResponse] = onProfileCardResponse;

var onProfileResponse = function onProfileResponse(message, callback) {
    callback = callback || null;
    var profileResponse = Dota2.schema.CMsgProfileResponse.decode(message);

    this.Logger.debug("Received profile page");
    this.emit("profileData", profileResponse);
    if (callback) callback(null, profileResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgProfileResponse] = onProfileResponse;

var onHallOfFameResponse = function onHallOfFameResponse(message, callback) {
    callback = callback || null;
    var hallOfFameResponse = Dota2.schema.CMsgDOTAHallOfFameResponse.decode(message);

    if (hallOfFameResponse.eresult === 1) {
        this.Logger.debug("Received hall of fame response for week: " + hallOfFameResponse.hall_of_fame.week);
        this.emit("hallOfFameData", hallOfFameResponse.hall_of_fame.week, hallOfFameResponse.hall_of_fame.featured_players, hallOfFameResponse.hall_of_fame.featured_farmer, hallOfFameResponse);
        if (callback) callback(null, hallOfFameResponse);
    } else {
        this.Logger.error("Received a bad hall of fame.");
        if (callback) callback(hallOfFameResponse.result, hallOfFameResponse);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCHallOfFameResponse] = onHallOfFameResponse;

var onPlayerInfoResponse = function onPlayerInfoResponse(message) {
    var playerInfoResponse = Dota2.schema.CMsgGCPlayerInfo.decode(message);

    this.Logger.debug("Received new player info data");
    this.emit("playerInfoData", playerInfoResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCPlayerInfo] = onPlayerInfoResponse;

var onTrophyListResponse = function onTrophyListResponse(message, callback) {
    var trophyListResponse = Dota2.schema.CMsgClientToGCGetTrophyListResponse.decode(message);

    this.Logger.debug("Received new trophy list data.");
    this.emit("trophyListData", trophyListResponse);
    if (callback) callback(null, trophyListResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetTrophyListResponse] = onTrophyListResponse;

var onPlayerStatsResponse = function onPlayerStatsResponse(message, callback) {
    var playerStatsResponse = Dota2.schema.CMsgGCToClientPlayerStatsResponse.decode(message);

    this.Logger.debug("Received new player stats data.");
    this.emit("playerStatsData", playerStatsResponse.account_id, playerStatsResponse);
    if (callback) callback(null, playerStatsResponse);
    
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCToClientPlayerStatsResponse] = onPlayerStatsResponse;