var Dota2 = require("../index"),
    util = require("util");

/**
 * Requests a list of custom game modes for which there are currently lobbies available.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestJoinableCustomGameModes
 * @param {ServerRegion} [server_region=ServerRegion.UNSPECIFIED] - The server region for which you'd like to obtain the joinable custom game modes
 */
Dota2.Dota2Client.prototype.requestJoinableCustomGameModes = function requestJoinableCustomGameModes(server_region) {
    // Request list of joinable custom games for a certain region
    server_region = server_region || Dota2.ServerRegion.UNSPECIFIED;
    
    this.Logger.debug("Sending joinable custom game modes request");
    var payload = {
        "server_region": server_region
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCJoinableCustomGameModesRequest, 
                    Dota2.schema.lookupType("CMsgJoinableCustomGameModesRequest").encode(payload).finish());
}

// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestJoinableCustomGameModes|request for joinable custom game modes}.
 * @event module:Dota2.Dota2Client#joinableCustomGameModes
 * @param {CMsgJoinableCustomGameModesResponseEntry[]} joinableCustomGameModes - List of joinable custom game modes
 */ 

// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onJoinableCustomGameModesResponse = function onJoinableCustomGameModesResponse(message) {
    var modes = Dota2.schema.lookupType("CMsgJoinableCustomGameModesResponse").decode(message);
    
    this.Logger.debug("Received joinable custom game modes");
    this.emit("joinableCustomGameModes", modes.game_modes);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCJoinableCustomGameModesResponse] = onJoinableCustomGameModesResponse;