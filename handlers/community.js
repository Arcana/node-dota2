var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods

Dota2.Dota2Client.prototype.profileRequest = function(accountId, requestName, callback) {
  callback = callback || null;
  /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending profile request");
  var payload = dota_gcmessages_client.CMsgDOTAProfileRequest.serialize({
    "accountId": accountId,
    "requestName": requestName
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCProfileRequest | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.passportDataRequest = function(accountId, callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending passport data request");
  var payload = dota_gcmessages_client.CMsgPassportDataRequest.serialize({"accountId": accountId});

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPassportDataRequest | protoMask), payload, callback);
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
  var payload = dota_gcmessages_client.CMsgDOTAHallOfFameRequest.serialize({
    "week": week,
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCHallOfFameRequest | protoMask), payload, callback);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCProfileResponse] = function onProfileResponse(message, callback) {
  callback = callback || null;
  var profileResponse = dota_gcmessages_client.CMsgDOTAProfileResponse.parse(message);

  if (profileResponse.result === 1) {
    if (this.debug) util.log("Received profile data for: " + profileResponse.gameAccountClient.accountId);
    this.emit("profileData", profileResponse.gameAccountClient.accountId, profileResponse);
    if (callback) callback(null, profileResponse);
  }
  else {
    if (this.debug) util.log("Received a bad profileResponse");
    if (callback) callback(profileResponse.result, profileResponse);
  }
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPassportDataResponse] = function onPassportDataResponse(message, callback) {
  callback = callback || null;
  var passportDataResponse = dota_gcmessages_client.CMsgPassportDataResponse.parse(message);

  if (this.debug) util.log("Received passport data for: " + passportDataResponse.accountId);
  this.emit("passportData", passportDataResponse.accountId, passportDataResponse);
  if (callback) callback(null, passportDataResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCHallOfFameResponse] = function onHallOfFameResponse(message, callback) {
  callback = callback || null;
  var hallOfFameResponse = dota_gcmessages_client.CMsgDOTAHallOfFameResponse.parse(message);

  if (hallOfFameResponse.eresult === 1) {
    if (this.debug) util.log("Received hall of fame response for week: " + hallOfFameResponse.hallOfFame.week);
    this.emit("hallOfFameData", hallOfFameResponse.hallOfFame.week, hallOfFameResponse.hallOfFame.featuredPlayers, hallOfFameResponse.hallOfFame.featuredFarmer, hallOfFameResponse);
    if (callback) callback(null, hallOfFameResponse);
  }
  else {
      if (this.debug) util.log("Received a bad hall of fame.");
      if (callback) callback(hallOfFameResponse.result, hallOfFameResponse);
  }
};
