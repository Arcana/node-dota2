var Dota2 = require("../index"),
    util = require("util");

Dota2._lobbyOptions = {
    game_name: "string",
    server_region: "number",
    game_mode: "number",
    game_version: "number",
    allow_cheats: "boolean",
    fill_with_bots: "boolean",
    allow_spectating: "boolean",
    pass_key: "string",
    series_type: "number",
    radiant_series_wins: "number",
    dire_series_wins: "number",
    allchat: "boolean",
    leagueid: "number",
    dota_tv_delay: "number",
    custom_game_mode: "string",
    custom_map_name: "string",
    custom_difficulty: "number",
    custom_game_id: "number",
  };

// Methods
Dota2.Dota2Client.prototype.createPracticeLobby = function(password, options, callback) {
  callback = callback || null;
  this.createTournamentLobby(password, -1, -1, options, callback);
}
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.createTournamentLobby = function(password, tournament_game_id, tournament_id, options, callback) {
  callback = callback || null;
  password = password || "";
  tournament_game_id = tournament_game_id || -1;
  tournament_id = tournament_id || -1;
  var _self = this;

  if (!this.isGCReady()) return null;

  if (this.debug) util.log("Sending match CMsgPracticeLobbyCreate request");

  var lobby_details = Dota2._parseOptions(options, Dota2._lobbyOptions);
  lobby_details.pass_key = password;
  var command = {
    "lobby_details": lobby_details,
    "pass_key": password
  };

  if (tournament_game_id > 0) {
    command["tournament_game"] = true;
    command["tournament_game_id"] = tournament_game_id;
    command["tournament_id"] = tournament_id;
  }
  var payload = new Dota2.schema.CMsgPracticeLobbyCreate(command);

  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyCreate;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.configPracticeLobby = function(lobby_id, options, callback){
  callback = callback || null;
  var _self = this;
  if (!this.isGCReady()) return null;

  var command = Dota2._parseOptions(options);
  command["lobby_id"] = lobby_id;

  var payload = new Dota2.schema.CMsgPracticeLobbySetDetails(command);
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbySetDetails;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyListResponse
Dota2.Dota2Client.prototype.requestPracticeLobbyList = function(callback){
  callback = callback || null;
  var _self = this;
  if (!this.isGCReady()) return null;

  if (this.debug) util.log("Sending CMsgPracticeLobbyList request");
  var payload = new Dota2.schema.CMsgPracticeLobbyList({
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyList;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyListResponse.call(_self, body, callback);
                }
  );
};
// callback to onFriendPracticeLobbyListResponse
Dota2.Dota2Client.prototype.requestFriendPracticeLobbyList = function(callback){
  callback = callback || null;
  var _self = this;
  if (!this.isGCReady()) return null;

  if (this.debug) util.log("Sending CMsgFriendPracticeLobbyListRequest request");
  var payload = new Dota2.schema.CMsgFriendPracticeLobbyListRequest({
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListRequest;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onFriendPracticeLobbyListResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.balancedShuffleLobby = function(callback){
  callback = callback || null;
  var _self = this;

  if (!this.isGCReady()) return null;
  var payload = new Dota2.schema.CMsgBalancedShuffleLobby({});
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCBalancedShuffleLobby;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};

//TODO: figure out the enum for team
/*
Dota2.Dota2Client.prototype.setLobbyTeamSlot = function(team, slot, callback){
  callback = callback || null;
  if (!this.isGCReady()) return null;

  if (this.debug) util.log("Sending flip teams request");
  var payload = Dota2.schema.CMsgFlipLobbyTeams.serialize({});

  this._gc.send({
          "msg":    Dota2.EDOTAGCMsg.k_EMsgGCFlipLobbyTeams,
          "proto":  {
            "client_steam_id": this._client.steamID,
            "source_app_id":  this._appid
          }
        },
        payload.toBuffer(),
        callback
  );
};*/
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.flipLobbyTeams = function(callback){
  callback = callback || null;
  var _self = this;
  if (!this.isGCReady()) return null;

  if (this.debug) util.log("Sending flip teams request");
  var payload = new Dota2.schema.CMsgFlipLobbyTeams({});
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCFlipLobbyTeams;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.practiceLobbyKick = function(account_id, callback){
  callback = callback || null;
  var _self = this;
  if (!this.isGCReady()) return null;

  account_id = account_id || "";

  if (this.debug) util.log("Sending match CMsgPracticeLobbyKick request");
  var payload = new Dota2.schema.CMsgPracticeLobbyKick({
    "account_id": account_id
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyKick;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyJoinResponse
Dota2.Dota2Client.prototype.joinPracticeLobby = function(id, password, callback){
  callback = callback || null;
  var _self = this;
  if (!this.isGCReady()) return null;

  password = password || "";

  if (this.debug) util.log("Sending match CMsgPracticeLobbyJoin request");
  var payload = new Dota2.schema.CMsgPracticeLobbyJoin({
    "lobby_id": id,
    "pass_key": password
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyJoin;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyJoinResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.leavePracticeLobby = function(callback) {
  callback = callback || null;
  var _self = this;

  /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */

  if (!this.isGCReady()) return null;

  if (this.debug) util.log("Sending match CMsgPracticeLobbyLeave request");
  var payload = new Dota2.schema.CMsgPracticeLobbyLeave({
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyLeave;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.launchPracticeLobby = function(callback) {
  callback = callback || null;
  var _self = this;
  /* Sends a message to the Game Coordinator requesting lobby start. */

  if (!this.isGCReady()) return null;

  if (this.debug) util.log("Sending match CMsgPracticeLobbyLaunch request");
  var payload = new Dota2.schema.CMsgPracticeLobbyLaunch({
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyLaunch;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onPracticeLobbyJoinResponse = function onPracticeLobbyJoinResponse(message, callback) {
  callback = callback || null;
  var practiceLobbyJoinResponse = Dota2.schema.CMsgPracticeLobbyJoinResponse.decode(message);

  if (this.debug) util.log("Received practice lobby join response " + practiceLobbyJoinResponse.result);
  this.emit("practiceLobbyJoinResponse", practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
  if (callback) callback(practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyJoinResponse] = onPracticeLobbyJoinResponse;

var onPracticeLobbyListResponse = function onPracticeLobbyListResponse(message, callback) {
  var practiceLobbyListResponse = Dota2.schema.CMsgPracticeLobbyListResponse.decode(message);

  if (this.debug) util.log("Received practice lobby list response " + practiceLobbyListResponse);
  this.emit("practiceLobbyListData", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyListResponse] = onPracticeLobbyListResponse;

var onPracticeLobbyResponse = function onPracticeLobbyResponse(message, callback){
  var practiceLobbyResponse = Dota2.schema.CMsgPracticeLobbyJoinResponse.decode(message);

  if(this.debug) util.log("Received create/flip/shuffle/kick/launch/leave response "+JSON.stringify(practiceLobbyResponse));
  this.emit("practiceLobbyResponse", practiceLobbyResponse.result, practiceLobbyResponse);
  if(callback) callback(practiceLobbyResponse.result, practiceLobbyResponse);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyResponse] = onPracticeLobbyResponse;

var onFriendPracticeLobbyListResponse = function onFriendPracticeLobbyListResponse(message, callback) {
  var practiceLobbyListResponse = Dota2.schema.CMsgFriendPracticeLobbyListResponse.decode(message);

  if (this.debug) util.log("Received friend practice lobby list response " + JSON.stringify(practiceLobbyListResponse));
  this.emit("friendPracticeLobbyListData", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListResponse] = onFriendPracticeLobbyListResponse;

