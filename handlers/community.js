var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages.desc")),
    protoMask = 0x80000000;

// Methods

Dota2.Dota2Client.prototype.profileRequest = function(accountId, requestName) {
  /* Attempts to move inventory items to positions as noted itemPositions - which is interpreted as a [itemid, position] tuple. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending profile request");
  var payload = dota_gcmessages.CMsgDOTAProfileRequest.serialize({
    "accountId": accountId,
    "requestName": requestName
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCProfileRequest | protoMask), payload);
};

Dota2.Dota2Client.prototype.passportDataRequest = function(accountId) {
  /* Attempts to move inventory items to positions as noted itemPositions - which is interpreted as a [itemid, position] tuple. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending passport data request");
  var payload = dota_gcmessages.CMsgPassportDataRequest .serialize({"accountId": accountId});

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPassportDataRequest | protoMask), payload);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCProfileResponse] = function onPassportDataResponse(message) {
  var profileResponse = dota_gcmessages.CMsgDOTAProfileResponse  .parse(message);

  if (this.debug) util.log("Recevied profile data for: " + profileResponse.gameAccountClient.accountId);
  this.emit("profileData", profileResponse.gameAccountClient.accountId, profileResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPassportDataResponse] = function onPassportDataResponse(message) {
  var passportDataResponse = dota_gcmessages.CMsgPassportDataResponse .parse(message);

  if (this.debug) util.log("Recevied passport data for: " + passportDataResponse.accountId);
  this.emit("passportData", passportDataResponse.accountId, passportDataResponse);
};