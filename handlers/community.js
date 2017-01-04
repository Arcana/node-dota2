 var Dota2 = require("../index"),
    util = require("util");

Dota2._playerHistoryOptions = {
    start_at_match_id: "number",
    matches_requested: "number",
    hero_id: "number",
    request_id: "number",
    include_practice_matches: "boolean",
    include_custom_games: "boolean"
};

// Methods
Dota2.Dota2Client.prototype.requestPlayerMatchHistory = function(account_id, options, callback) {
    callback = callback || null;
    options = options || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting `accountId`'s player match history.  Listen for `playerMatchHistoryData` event for Game Coordinator's response. */
    if (this.debug) util.log("Sending player match history request");
    
    var payload = Dota2._parseOptions(options, Dota2._playerHistoryOptions);
    payload.account_id = account_id;
    payload.matches_requested = payload.matches_requested || 1;
    payload.request_id = payload.request_id || account_id;
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgDOTAGetPlayerMatchHistory, 
                    Dota2.schema.lookupType("CMsgDOTAGetPlayerMatchHistory").encode(payload).finish(), 
                    onPlayerMatchHistoryResponse, callback);
};

// Dota2.Dota2Client.prototype.requestProfile = function(account_id, request_name, callback) {
//     callback = callback || null;
//     var _self = this;
    
//     /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
//     if (this.debug) util.log("Sending profile request");
    
//     var payload = {
//         "account_id": account_id,
//         "request_name": request_name,
//         "engine": 1
//     };
//     this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCProfileRequest, 
//                     Dota2.schema.lookupType("CMsgDOTAProfileRequest").encode(payload).finish(), 
//                     onProfileResponse, callback);
// };

Dota2.Dota2Client.prototype.requestProfileCard = function(account_id, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile card.  Listen for `profileCardData` event for Game Coordinator's response. */
    if (this.debug) util.log("Sending profile card request");
    
    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCGetProfileCard, 
                    Dota2.schema.lookupType("CMsgClientToGCGetProfileCard").encode(payload).finish(), 
                    onProfileCardResponse, callback);
};
/*
// DEPRECATED
Dota2.Dota2Client.prototype.requestPassportData = function(account_id, callback) {
    callback = callback || null;
    var _self = this;
    
    // Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. 
    if (this.debug) util.log("Sending passport data request");
    
    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPassportDataRequest,
                    Dota2.schema.lookupType("CMsgPassportDataRequest").encode(payload).finish(),
                    onPassportDataResponse, callback);
};
*/

Dota2.Dota2Client.prototype.requestHallOfFame = function(week, callback) {
    week = week || null;
    callback = callback || null;
    var _self = this;

    /* Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. */
    if (this.debug) util.log("Sending hall of fame request.");
    
    var payload = {
        "week": week
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCHallOfFameRequest, 
                    Dota2.schema.lookupType("CMsgDOTAHallOfFameRequest").encode(payload).finish(), 
                    onHallOfFameResponse, callback);
};

Dota2.Dota2Client.prototype.requestPlayerInfo = function(account_ids) {
    account_ids = account_ids || [];
    account_ids = (Array.isArray(account_ids) ? account_ids : [account_ids]).map(id => {return {'account_id': id};});
    console.log(account_ids);
    if (account_ids.length == 0) {
        if (this.debug) util.log("Account ids must be a single id or array of ids.");
        return null;
    }

    /* Sends a message to the Game Coordinator requesting the player info on all `account_ids`. Listen for `playerInfoData` event for Game Coordinator's response. */
    if (this.debug) util.log("Sending player info request.");

    var payload = {
        player_infos: account_ids
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPlayerInfoRequest, 
                    Dota2.schema.lookupType("CMsgGCPlayerInfoRequest").encode(payload).finish());
};

Dota2.Dota2Client.prototype.requestTrophyList = function(account_id, callback) {
    account_id = account_id || null;
    var _self = this;

    /* Sends a message to the Game Coordinator requesting `accountId`'s trophy list. Listen for `trophyListData` event for Game Coordinator's response. */
    if (this.debug) util.log("Sending trophy list request.");

    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCGetTrophyList,
                    Dota2.schema.lookupType("CMsgClientToGCGetTrophyList").encode(payload).finish(),
                    onTrophyListResponse, callback);
};

Dota2.Dota2Client.prototype.requestPlayerStats = function(account_id, callback) {
    callback = callback || null;
    account_id = account_id || null;

    /* Sends a message to the Game Coordinator requesting `accountId`'s stats. Listen for `playerStatsData` event for Game Coordinator's response. */
    if (this.debug) util.log("Sending player stats request.");

    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCPlayerStatsRequest,
                    Dota2.schema.lookupType("CMsgClientToGCPlayerStatsRequest").encode(payload).finish(),
                    onPlayerStatsResponse, callback);
}

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onPlayerMatchHistoryResponse = function onPlayerMatchHistoryResponse(message, callback) {
    callback = callback || null;
    var matchHistoryResponse = Dota2.schema.lookupType("CMsgDOTAGetPlayerMatchHistoryResponse").decode(message);

    if (typeof matchHistoryResponse.matches != "undefined") {
        if (this.debug) util.log("Received player match history data");
        this.emit("playerMatchHistoryData", matchHistoryResponse.requestId, matchHistoryResponse);
        if (callback) callback(null, matchHistoryResponse);
    } else {
        if (this.debug) util.log("Received a bad GetPlayerMatchHistoryResponse");
        if (callback) callback(matchHistoryResponse.result, matchHistoryResponse);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgDOTAGetPlayerMatchHistoryResponse] = onPlayerMatchHistoryResponse;

var onProfileResponse = function onProfileResponse(message, callback) {
    callback = callback || null;
    var profileResponse = Dota2.schema.lookupType("CMsgDOTAProfileResponse").decode(message);

    if (profileResponse.result === 1) {
        if (this.debug) util.log("Received profile data for: " + profileResponse.game_account_client.account_id);
        this.emit("profileData", profileResponse.game_account_client.account_id, profileResponse);
        if (callback) callback(null, profileResponse);
    } else {
        if (this.debug) util.log("Received a bad profileResponse");
        if (callback) callback(profileResponse.result, profileResponse);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCProfileResponse] = onProfileResponse;

var onProfileCardResponse = function onProfileCardResponse(message, callback) {
    callback = callback || null;
    var profileCardResponse = Dota2.schema.lookupType("CMsgDOTAProfileCard").decode(message);

    if (this.debug) util.log("Received profile card data for: " + profileCardResponse.account_id);
    this.emit("profileCardData", profileCardResponse.account_id, profileCardResponse);
    if (callback) callback(null, profileCardResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCGetProfileCardResponse] = onProfileCardResponse;
/*
// DEPRECATED
var onPassportDataResponse = function onPassportDataResponse(message, callback) {
    callback = callback || null;
    var passportDataResponse = Dota2.schema.lookupType("CMsgPassportDataResponse").decode(message);

    if (this.debug) util.log("Received passport data for: " + passportDataResponse.account_id);
    this.emit("passportData", passportDataResponse.account_id, passportDataResponse);
    if (callback) callback(null, passportDataResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPassportDataResponse] = onPassportDataResponse;
*/
var onHallOfFameResponse = function onHallOfFameResponse(message, callback) {
    callback = callback || null;
    var hallOfFameResponse = Dota2.schema.lookupType("CMsgDOTAHallOfFameResponse").decode(message);

    if (hallOfFameResponse.eresult === 1) {
        if (this.debug) util.log("Received hall of fame response for week: " + hallOfFameResponse.hall_of_fame.week);
        this.emit("hallOfFameData", hallOfFameResponse.hall_of_fame.week, hallOfFameResponse.hall_of_fame.featured_players, hallOfFameResponse.hall_of_fame.featured_farmer, hallOfFameResponse);
        if (callback) callback(null, hallOfFameResponse);
    } else {
        if (this.debug) util.log("Received a bad hall of fame.");
        if (callback) callback(hallOfFameResponse.result, hallOfFameResponse);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCHallOfFameResponse] = onHallOfFameResponse;

var onPlayerInfoResponse = function onPlayerInfoResponse(message) {
    var playerInfoResponse = Dota2.schema.lookupType("CMsgGCPlayerInfo").decode(message);

    if (this.debug) util.log("Received new player info data");
    this.emit("playerInfoData", playerInfoResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPlayerInfo] = onPlayerInfoResponse;

var onTrophyListResponse = function onTrophyListResponse(message, callback) {
    var trophyListResponse = Dota2.schema.lookupType("CMsgClientToGCGetTrophyListResponse").decode(message);

    if (this.debug) util.log("Received new trophy list data.");
    this.emit("trophyListData", trophyListResponse);
    if (callback) callback(null, trophyListResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCGetTrophyListResponse] = onTrophyListResponse;

var onPlayerStatsResponse = function onPlayerStatsResponse(message, callback) {
    var playerStatsResponse = Dota2.schema.lookupType("CMsgGCToClientPlayerStatsResponse").decode(message);

    if (this.debug) util.log("Received new player stats data.");
    this.emit("playerStatsData", playerStatsResponse.account_id, playerStatsResponse);
    if (callback) callback(null, playerStatsResponse);
    
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCToClientPlayerStatsResponse] = onPlayerStatsResponse;