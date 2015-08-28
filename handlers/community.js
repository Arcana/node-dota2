var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.getPlayerMatchHistory = function(account_id, match_id, callback) {
  callback = callback || null;
  /* Sends a message to the Game Coordinator requesting `accountId`'s player match history.  Listen for `playerMatchHistoryData` event for Game Coordinator's response. */
  if (!this._gcReady) {
      if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
      return null;
  }

  if (this.debug) util.log("Sending player match history request");
  var payload = new Dota2.schema.CMsgDOTAGetPlayerMatchHistory({
      "account_id": account_id,
      "start_at_match_id": match_id,
      "matches_requested": 13,
      "hero_id": 0,
      "request_id": account_id
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgDOTAGetPlayerMatchHistory;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                callback
  );
};

Dota2.Dota2Client.prototype.profileRequest = function(account_id, request_name, callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending profile request");
  var payload = new Dota2.schema.CMsgDOTAProfileRequest({
    "account_id": account_id,
    "request_name": request_name
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCProfileRequest;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                callback
  );
};

Dota2.Dota2Client.prototype.passportDataRequest = function(account_id, callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending passport data request");
  var payload = new Dota2.schema.CMsgPassportDataRequest({"account_id": account_id});
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPassportDataRequest;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                callback
  );
};

Dota2.Dota2Client.prototype.hallOfFameRequest = function(week, callback) {
  week = week || null;
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending hall of fame request.");
  var payload = new Dota2.schema.CMsgDOTAHallOfFameRequest({
    "week": week
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCHallOfFameRequest;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                callback
  );
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgDOTAGetPlayerMatchHistoryResponse] = function onPlayerMatchHistoryResponse(message, callback) {
    callback = callback || null;
    var matchHistoryResponse = Dota2.schema.CMsgDOTAGetPlayerMatchHistoryResponse.decode(message);

    if (typeof matchHistoryResponse.matches != "undefined") {
        if (this.debug) util.log("Received player match history data");
        this.emit("playerMatchHistoryData", matchHistoryResponse.requestId, matchHistoryResponse);
        if (callback) callback(null, matchHistoryResponse);
    }
    else {
        if (this.debug) util.log("Received a bad GetPlayerMatchHistoryResponse");
        if (callback) callback(matchHistoryResponse.result, matchHistoryResponse);
    }
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCProfileResponse] = function onProfileResponse(message, callback) {
  callback = callback || null;
  var profileResponse = Dota2.schema.CMsgDOTAProfileResponse.decode(message);

  if (profileResponse.result === 1) {
    if (this.debug) util.log("Received profile data for: " + profileResponse.game_account_client.account_id);
    this.emit("profileData", profileResponse.game_account_client.account_id, profileResponse);
    if (callback) callback(null, profileResponse);
  }
  else {
    if (this.debug) util.log("Received a bad profileResponse");
    if (callback) callback(profileResponse.result, profileResponse);
  }
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPassportDataResponse] = function onPassportDataResponse(message, callback) {
  callback = callback || null;
  var passportDataResponse = Dota2.schema.CMsgPassportDataResponse.decode(message);

  if (this.debug) util.log("Received passport data for: " + passportDataResponse.account_id);
  this.emit("passportData", passportDataResponse.account_id, passportDataResponse);
  if (callback) callback(null, passportDataResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCHallOfFameResponse] = function onHallOfFameResponse(message, callback) {
  callback = callback || null;
  var hallOfFameResponse = Dota2.schema.CMsgDOTAHallOfFameResponse.decode(message);

  if (hallOfFameResponse.eresult === 1) {
    if (this.debug) util.log("Received hall of fame response for week: " + hallOfFameResponse.hall_of_fame.week);
    this.emit("hallOfFameData", hallOfFameResponse.hall_of_fame.week, hallOfFameResponse.hall_of_fame.featured_players, hallOfFameResponse.hall_of_fame.featured_farmer, hallOfFameResponse);
    if (callback) callback(null, hallOfFameResponse);
  }
  else {
      if (this.debug) util.log("Received a bad hall of fame.");
      if (callback) callback(hallOfFameResponse.result, hallOfFameResponse);
  }
};
