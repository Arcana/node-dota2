var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.leaguesInMonthRequest = function(month, year, callback) {
  callback = callback || null;
  var _self = this;

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
  var payload = new Dota2.schema.CMsgDOTALeaguesInMonthRequest({
    month: month,
    year: year
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCLeaguesInMonthRequest;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onLeaguesInMonthResponse.call(_self, body, callback);
                }
  );
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onLeaguesInMonthResponse = function onLeaguesInMonthResponse(message, callback) {
  callback = callback || null;
  var response = Dota2.schema.CMsgDOTALeaguesInMonthResponse.decode(message);

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
handlers[Dota2.EDOTAGCMsg.k_EMsgGCLeaguesInMonthResponse] = onLeaguesInMonthResponse;

var onLiveLeagueGameUpdate = function onLiveLeagueGameUpdate(message, callback){
  var response = Dota2.schema.CMsgDOTALiveLeagueGameUpdate.decode(message);

  if(this.debugMore) util.log("Live league games: "+response.live_league_games+".");
  this.emit("liveLeagueGamesUpdate", response.live_league_games);
  if(callback) callback(null, response.live_league_games);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgDOTALiveLeagueGameUpdate] = onLiveLeagueGameUpdate;
