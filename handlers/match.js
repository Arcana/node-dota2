var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods

Dota2.Dota2Client.prototype.matchDetailsRequest = function(matchId, callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match details request");
  var payload = dota_gcmessages_client.CMsgGCMatchDetailsRequest.serialize({
    "matchId": matchId
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCMatchDetailsRequest | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.matchmakingStatsRequest = function() {
  /* Sends a message to the Game Coordinator requesting `matchId`'s match deails.  Listen for `matchData` event for Game Coordinator's response. */
  // Is not Job ID based - can't do callbacks.

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending matchmaking stats request");
  var payload = dota_gcmessages_client.CMsgDOTAMatchmakingStatsRequest.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCMatchmakingStatsRequest | protoMask), payload);
};

Dota2.Dota2Client.prototype.matchRequest = function(criteria, callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting a list of matches based on the given criteria. Similar to the possible webapi query. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match request");
  var payload = dota_gcmessages_client.CMsgDOTARequestMatches.serialize(criteria);

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCRequestMatches | protoMask), payload, callback);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCMatchDetailsResponse] = function onMatchDetailsResponse(message, callback) {
  callback = callback || null;
  var matchDetailsResponse = dota_gcmessages_client.CMsgGCMatchDetailsResponse.parse(message);

  if (matchDetailsResponse.result === 1) {
    if (this.debug) util.log("Received match data for: " + matchDetailsResponse.match.matchId);
    this.emit("matchData", matchDetailsResponse.match.matchId, matchDetailsResponse);
    if (callback) callback(null, matchDetailsResponse);
  }
  else {
      if (this.debug) util.log("Received a bad matchDetailsResponse");
      if (callback) callback(matchDetailsResponse.result, matchDetailsResponse);
  }
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCRequestMatchesResponse] = function onMatchResponse(message, callback) {
  callback = callback || null;
  var matchResponse = dota_gcmessages_client.CMsgDOTARequestMatchesResponse.parse(message);

  if (matchResponse.totalResults > 1) {
    if (this.debug) util.log("Reveived listing for matches");
    this.emit("matches", matchResponse);
    if (callback) callback(null, matchResponse);
  } else {
      if (this.debug) util.log("Received a bad matchesResponse");
      if (callback) callback(1, matchResponse);
  }
};


handlers[Dota2.EDOTAGCMsg.k_EMsgGCMatchmakingStatsResponse] = function onMatchmakingStatsResponse(message) {
  // Is not Job ID based - can't do callbacks.
  var matchmakingStatsResponse = dota_gcmessages_client.CMsgDOTAMatchmakingStatsResponse.parse(message);

  if (this.debug) util.log("Received matchmaking stats");
  this.emit("matchmakingStatsData", matchmakingStatsResponse.waitTimesByGroup, matchmakingStatsResponse.searchingPlayersByGroup, matchmakingStatsResponse.disabledGroups, matchmakingStatsResponse);
};
