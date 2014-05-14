var Dota2 = require("../index"),
    merge = require("merge")
fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods
Dota2.Dota2Client.prototype.getEventPoints = function(filterOptions, callback) {
    callback = callback || null;
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending find Get EventPoints games request");

    /* Using default params and merging with filterOptions, note: numGames is ignored from GC and > 6 causes no response at all */
    var payload = dota_gcmessages_client.CMsgDOTAGetEventPoints.serialize(merge({
        "eventId": 4,
        "accountId": 0
    }, filterOptions));

    this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgDOTAGetEventPoints | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.compendiumDataRequest = function(filterOptions, callback) {
    callback = callback || null;
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }
    if (this.debug) util.log("Sending find compendium data request request");

    /* Using default params and merging with filterOptions, note: numGames is ignored from GC and > 6 causes no response at all */
    var payload = dota_gcmessages_client.CMsgDOTACompendiumDataRequest.serialize(merge({
        "accountId": 0,
        "leagueid": 600
    }, filterOptions));

    this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCCompendiumDataRequest | protoMask), payload, callback);
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgDOTAGetEventPointsResponse] = function onGetEventPointsResponse(message, callback) {
    callback = callback || null;

    var response = dota_gcmessages_client.CMsgDOTAGetEventPointsResponse.parse(message);
    if (this.debug) util.log("Received a Get event points response");
    if (callback) callback(response);

};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCCompendiumDataResponse] = function onCompendiumResponse(message, callback) {
    callback = callback || null;

    var response = dota_gcmessages_client.CMsgDOTACompendiumDataResponse.parse(message);
    if (this.debug) util.log("Received a Get compendium response");
    if (callback) callback(response);

};