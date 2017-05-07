var Dota2 = require("../index"),
    merge = require("merge"),
    util = require("util");


// Methods
/**
 * Requests a list of SourceTV games based on the given criteria. 
 * Listen for {@link module:Dota2.Dota2Client#event:sourceTVGamesData|sourceTVGamesData} for results
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestSourceTVGames
 * @param {CSourceTVGameSmall} filter_options - Filter options. Check the protobuf for a full list.
 * @param {number} filter_options.league_id - ID of a league
 * @param {number} filter_options.hero_id - ID of a hero that must be present in the game
 * @param {number} filter_options.start_game - Number of pages sent, only values in [0, 10, 20, ... 90] are valid, and yield [1,2,3 ... 10] responses
 */
Dota2.Dota2Client.prototype.requestSourceTVGames = function(filter_options) {
    // Unfortunately this does not seem to support callbacks
    filter_options = filter_options || null;
    var _self = this;
    this.Logger.debug("Sending SourceTV games request");

    var payload = merge({
        "search_key": '',     // I don't know what's supposed to go here, everything i've tried fails
        "league_id": 0,       // Presumably used for searching for live games in a tourney
        "hero_id": 0,         // Same as the old one, hero filter using id number
        "start_game": 0,      // Number of pages sent, only values in [0, 10, 20, ... 90] are valid, and yield [1,2,3 ... 10] responses
        "game_list_index": 0, // I think this may be some sort of version number
        "lobby_ids": [],      // Used for getting player specific games, still don't know where the lobbyids come from though
    }, filter_options);

    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCFindTopSourceTVGames, 
                    Dota2.schema.lookupType("CMsgClientToGCFindTopSourceTVGames").encode(payload).finish());
};

// Events
/**
 * sourceTVGamesData event
 * @event module:Dota2.Dota2Client#sourceTVGamesData
 * @param {CMsgGCToClientFindTopSourceTVGamesResponse} sourceTVGamesResponse - The raw response data or null if a bad response was received
 */
 
// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onSourceTVGamesResponse = function onSourceTVGamesResponse(message) {
    var sourceTVGamesResponse = Dota2.schema.lookupType("CMsgGCToClientFindTopSourceTVGamesResponse").decode(message);

    if (sourceTVGamesResponse.start_game !== null) {
        this.Logger.debug("Received SourceTV games data");
        this.emit("sourceTVGamesData", sourceTVGamesResponse);
    } else {
        this.Logger.error("Received a bad new SourceTV games response");
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
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCToClientFindTopSourceTVGamesResponse] = onSourceTVGamesResponse;

