var Dota2 = require("../index"),
    util = require("util");
    
Dota2.Dota2Client.prototype.requestJoinableCustomGameModes = function requestJoinableCustomGameModes(server_region) {
    // Request list of joinable custom games for a certain region
    server_region = server_region || Dota2.ServerRegion.UNSPECIFIED;
    
    if (this.debug) util.log("Sending joinable custom game modes request");
    var payload = new Dota2.schema.CMsgJoinableCustomGameModesRequest({
        "server_region": server_region
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgGCJoinableCustomGameModesRequest, payload);
}

var handlers = Dota2.Dota2Client.prototype._handlers;

var onJoinableCustomGameModesResponse = function onJoinableCustomGameModesResponse(message) {
    var modes = Dota2.schema.CMsgJoinableCustomGameModesResponse.decode(message);
    
    if (this.debug) util.log("Received joinable custom game modes");
    this.emit("joinableCustomGameModes", modes.game_modes);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCJoinableCustomGameModesResponse] = onJoinableCustomGameModesResponse;