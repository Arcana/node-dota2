var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods

Dota2.Dota2Client.prototype.leaguesInMonthRequest = function(month, year, callback) {
  callback = callback || null;

  // Month & year default to current time values
  month = month === undefined ? (new Date()).getMonth() : month;
  year = year || (new Date()).getFullYear();

  /* Sends a message to the Game Coordinator requesting the data on the given month's leagues.
     Listen for `leaguesInMonthResponse` event for the Game Coordinator's response. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending CMsgDOTALeaguesInMonthRequest");
  var payload = dota_gcmessages_client.CMsgDOTALeaguesInMonthRequest.serialize({
    month: month,
    year: year
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCLeaguesInMonthRequest | protoMask), payload, callback);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCLeaguesInMonthResponse] = function onLeaguesInMonthResponse(message, callback) {
  callback = callback || null;
  var response = dota_gcmessages_client.CMsgDOTALeaguesInMonthResponse.parse(message);

  if (response.eresult === 1) {
    if (this.debug) util.log("Received leagues in month response " + response.eresult);
    this.emit("leaguesInMonthResponse", response.eresult, response);
    if (callback) callback(null, response);
  }
  else {
      if (this.debug) util.log("Received a bad leaguesInMonthResponse");
      if (callback) callback(response.eresult, response);
  }
};

handlers[Dota2.EDOTAGCMsg.k_EMsgDOTALiveLeagueGameUpdate] = function(message, callback){
  var response = dota_gcmessages_client.CMsgDOTALiveLeagueGameUpdate.parse(message);

  if(this.debug) util.log("Live league games: "+response.liveLeagueGames+".");
  this.emit("liveLeagueGamesUpdate", response.liveLeagueGames);
  if(callback) callback(null, response.liveLeagueGames);
};
