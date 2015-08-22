var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.matchDetailsRequest = function(matchId, callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match details request");
  var payload = new Dota2.schema.CMsgGCMatchDetailsRequest({
    "matchId": matchId
  });
  this.protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCMatchDetailsRequest;
  this._gc.send(this.protoBufHeader,
                payload.toBuffer(),
                callback
  );
};

Dota2.Dota2Client.prototype.matchmakingStatsRequest = function() {
  /* Sends a message to the Game Coordinator requesting `matchId`'s match deails.  Listen for `matchData` event for Game Coordinator's response. */
  // Is not Job ID based - can't do callbacks.

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending matchmaking stats request");
  var payload = new Dota2.schema.CMsgDOTAMatchmakingStatsRequest({
  });
  this.protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCMatchmakingStatsRequest;
  this._gc.send(this.protoBufHeader,
                payload.toBuffer()
  );

};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCMatchDetailsResponse] = function onMatchDetailsResponse(message, callback) {
  callback = callback || null;
  var matchDetailsResponse = Dota2.schema.CMsgGCMatchDetailsResponse.decode(message);

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



handlers[Dota2.EDOTAGCMsg.k_EMsgGCMatchmakingStatsResponse] = function onMatchmakingStatsResponse(message) {
  // Is not Job ID based - can't do callbacks.
  var matchmakingStatsResponse = Dota2.schema.CMsgDOTAMatchmakingStatsResponse.decode(message);

  if (this.debug) util.log("Received matchmaking stats");
  this.emit("matchmakingStatsData", matchmakingStatsResponse.waitTimesByGroup, matchmakingStatsResponse.searchingPlayersByGroup, matchmakingStatsResponse.disabledGroups, matchmakingStatsResponse);
};