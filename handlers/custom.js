var Dota2 = require("../index"),
    util = require("util");
    
Dota2.Dota2Client.prototype.requestJoinableCustomGameModes = function requestJoinableCustomGameModes(server_region) {
    // Request list of joinable custom games for a certain region
    server_region = server_region || Dota2.ServerRegion.UNSPECIFIED;
    
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending joinable custom game modes request");
    var payload = new Dota2.schema.CMsgJoinableCustomGameModesRequest({
        "server_region": server_region
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCJoinableCustomGameModesRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
}

var handlers = Dota2.Dota2Client.prototype._handlers;

var onJoinableCustomGameModesResponse = function onJoinableCustomGameModesResponse(message, callback) {
    var modes = Dota2.schema.CMsgJoinableCustomGameModesResponse.decode(message);
    
    if (this.debug) util.log("Received joinable custom game modes");
    this.emit("joinableCustomGameModes", modes.game_modes);
    if (callback) callback(null, modes);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCJoinableCustomGameModesResponse] = onJoinableCustomGameModesResponse;