var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.requestLeaguesInMonth = function(month, year, tier, callback) {
    callback = callback || null;
    var _self = this;

    // Month & year default to current time values
    month = month === undefined ? (new Date()).getMonth() : month;
    year = year || (new Date()).getFullYear();
    tier = tier || 0;

    /* Sends a message to the Game Coordinator requesting the data on the given month's leagues.
       Listen for `leaguesInMonthResponse` event for the Game Coordinator's response. */
    if (this.debug) util.log("Sending CMsgDOTALeaguesInMonthRequest");
    
    var payload = {
        'month': month,
        'year': year,
        'tier': tier
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCLeaguesInMonthRequest, 
                    Dota2.schema.lookupType("CMsgDOTALeaguesInMonthRequest").encode(payload).finish(), 
                    onLeaguesInMonthResponse, callback);
};

Dota2.Dota2Client.prototype.requestLeagueInfo = function() {
    /* Sends a message to the Game Coordinator request the info on all available official leagues */
    if (this.debug) util.log("Sending CMsgRequestLeagueInfo");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgRequestLeagueInfo, 
                    Dota2.schema.lookupType("CMsgRequestLeagueInfo").encode(payload).finish());

};

Dota2.Dota2Client.prototype.requestTopLeagueMatches = function() {
    /* Sends a message to the Game Coordinator request the info on all available official leagues */
    if (this.debug) util.log("Sending CMsgClientToGCTopLeagueMatchesRequest");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCTopLeagueMatchesRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCTopLeagueMatchesRequest").encode(payload).finish());

};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onLeaguesInMonthResponse = function onLeaguesInMonthResponse(message, callback) {
    callback = callback || null;
    var response = Dota2.schema.lookupType("CMsgDOTALeaguesInMonthResponse").decode(message);

    if (response.eresult === 1) {
        if (this.debug) util.log("Received leagues in month response " + response.eresult);
        this.emit("leaguesInMonthData", response.month, response.year, response.leagues);
        if (callback) callback(null, response);
    } else {
        if (this.debug) util.log("Received a bad leaguesInMonthResponse");
        if (callback) callback(response.eresult, response);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCLeaguesInMonthResponse] = onLeaguesInMonthResponse;

var onLiveLeagueGameUpdate = function onLiveLeagueGameUpdate(message, callback) {
    callback = callback || null;
    var response = Dota2.schema.lookupType("CMsgDOTALiveLeagueGameUpdate").decode(message);

    if (this.debugMore) util.log("Live league games: " + response.live_league_games + ".");
    this.emit("liveLeagueGamesUpdate", response.live_league_games);
    if (callback) callback(null, response.live_league_games);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgDOTALiveLeagueGameUpdate] = onLiveLeagueGameUpdate;

var onLeagueInfoResponse = function onLeagueInfoResponse(message) {
    var response = Dota2.schema.lookupType("CMsgResponseLeagueInfo").decode(message);

    if (response.leagues.length > 0) {
        if (this.debug) util.log("Received information for " + response.leagues.length + " leagues");
        this.emit("leagueData", response.leagues);
    } else {
        if (this.debug) util.log("Received a bad leagueInfo response", response);
    }

};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgResponseLeagueInfo] = onLeagueInfoResponse;

var onTopLeagueMatchesResponse = function onTopLeagueMatchesResponse(message) {
    var response = Dota2.schema.lookupType("CMsgGCToClientTopLeagueMatchesResponse").decode(message);

    if (response.matches.length > 0) {
        if (this.debug) util.log("Received information for " + response.matches.length + " league matches");
        this.emit("topLeagueMatchesData", response.matches);
    } else {
        if (this.debug) util.log("Received a bad topLeagueMatches response", response);
    }

};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCToClientTopLeagueMatchesResponse] = onTopLeagueMatchesResponse;