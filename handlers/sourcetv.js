var Dota2 = require("../index"),
    merge = require("merge"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.findSourceTVGames = function(filter_options, callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }
    
    if (this.debug) util.log("Sending find SourceTV games request");
    
    /* Using default params and merging with filter_options, note: numGames is ignored from GC and > 6 causes no response at all */
    var payload = new Dota2.schema.CMsgFindSourceTVGames(merge({
        "searchKey": '',
        "start": 0,
        "numGames": 6,
        "leagueid": 0,
        "heroid": 0,
        "teamGame": false,
        "customGameId": 0,
    },filter_options));
    this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCFindSourceTVGames;
    this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onSourceTVGamesResponse.call(_self, body, callback);
                }
    );
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onSourceTVGamesResponse = function onSourceTVGamesResponse(message, callback) {
    callback = callback || null;

    var sourceTVGamesResponse = Dota2.schema.CMsgSourceTVGamesResponse.decode(message);

    if (typeof sourceTVGamesResponse.games !== "undefined" && sourceTVGamesResponse.games.length > 0) {
        if (this.debug) util.log("Received SourceTV games data");
        if (callback) callback(sourceTVGamesResponse);
    }
    else {
        if (this.debug) util.log("Received a bad SourceTV games response");
        if (callback) callback(sourceTVGamesResponse.result, sourceTVGamesResponse);
    }
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCSourceTVGamesResponse] = onSourceTVGamesResponse;