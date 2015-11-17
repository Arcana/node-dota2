var Dota2 = require("../index"),
    merge = require("merge"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.requestSourceTVGames = function(filter_options) {
    // Unfortunately this does not seem to support callbacks
    filter_options = filter_options || null;
    var _self = this;

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending SourceTV games request");

    var payload = new Dota2.schema.CMsgClientToGCFindTopSourceTVGames(merge({
        "search_key": '',     // I don't know what's supposed to go here, everything i've tried fails
        "league_id": 0,       // Presumably used for searching for live games in a tourney
        "hero_id": 0,         // Same as the old one, hero filter using id number
        "start_game": 0,      // Number of pages sent, only values in [0, 10, 20, ... 90] are valid, and yield [1,2,3 ... 10] responses
        "game_list_index": 0, // I think this may be some sort of version number
        "lobby_ids": [],      // Used for getting player specific games, still don't know where the lobbyids come from though
    }, filter_options));

    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCFindTopSourceTVGames;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onSourceTVGamesResponse = function onSourceTVGamesResponse(message) {
    var sourceTVGamesResponse = Dota2.schema.CMsgGCToClientFindTopSourceTVGamesResponse.decode(message);

    if (sourceTVGamesResponse.start_game !== null) {
        if (this.debug) util.log("Received SourceTV games data");
        this.emit("sourceTVGamesData", sourceTVGamesResponse);
    } else {
        if (this.debug) util.log("Received a bad new SourceTV games response");
        this.emit("sourceTVGamesData", null);
        /*

        A "bad" response will look like this.
        Any of these values should be ok to check for, except maybe game_list

        { search_key: null,
          league_id: null,
          hero_id: null,
          start_game: null,
          num_games: 0,
          game_list_index: null,
          game_list: [],
          specific_games: null }
        */
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCToClientFindTopSourceTVGamesResponse] = onSourceTVGamesResponse;