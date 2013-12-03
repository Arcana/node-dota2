var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods

// message CMsgPracticeLobbySetDetails {
//   optional uint64 lobby_id = 1;
//   optional string game_name = 2;
//   repeated .CLobbyTeamDetails team_details = 3;
//   optional uint32 server_region = 4;
//   optional uint32 game_mode = 5;
//   optional .DOTA_CM_PICK cm_pick = 6 [default = DOTA_CM_RANDOM];
//   optional .DOTABotDifficulty bot_difficulty = 9 [default = BOT_DIFFICULTY_MEDIUM];
//   optional bool allow_cheats = 10;
//   optional bool fill_with_bots = 11;
//   optional bool intro_mode = 12;
//   optional bool allow_spectating = 13;
//   optional .DOTAGameVersion game_version = 14 [default = GAME_VERSION_CURRENT];
//   optional string pass_key = 15;
//   optional uint32 leagueid = 16;
//   optional uint32 penalty_level_radiant = 17;
//   optional uint32 penalty_level_dire = 18;
//   optional uint32 load_game_id = 19;
//   optional uint32 series_type = 20;
//   optional uint32 radiant_series_wins = 21;
//   optional uint32 dire_series_wins = 22;
//   optional bool allchat = 23 [default = false];
//   optional .LobbyDotaTVDelay dota_tv_delay = 24 [default = LobbyDotaTV_120];
// }

// message CMsgPracticeLobbyCreate {
//   optional string search_key = 1;
//   optional bool tournament_game = 2;
//   optional uint32 tournament_game_id = 3;
//   optional uint32 tournament_id = 4;
//   optional string pass_key = 5;
//   optional uint32 client_version = 6;
//   optional .CMsgPracticeLobbySetDetails lobby_details = 7;
// }
  // optional uint32 server_region = 4;
  // optional uint32 game_mode = 5;

Dota2.Dota2Client.prototype.createPracticeLobby = function(game_name, password, server_region, game_mode, callback) {
  callback = callback || null;
  password = password || "";
  game_name = game_name || "";
  server_region = server_region || Dota2.ServerRegion.UNSPECIFIED;
  game_mode = game_mode || Dota2.GameMode.DOTA_GAMEMODE_AP;

  /* Sends a message to the Game Coordinator requesting the creation of a practice lobby.  Listen for `practiceLobbyJoinResponse` event for the Game Coordinator's response. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match CMsgPracticeLobbyCreate request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyCreate.serialize({
    "lobbyDetails": {
      // TODO:  Add ability to set some settings here.
      "gameName": game_name,
      "serverRegion": server_region,
      "gameMode": game_mode,
      "passKey": password,
    }
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyCreate | protoMask), payload, callback);
};


Dota2.Dota2Client.prototype.leavePracticeLobby = function(callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match CMsgPracticeLobbyCreate request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyLeave.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyLeave | protoMask), payload, callback);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyResponse] = function onPracticeLobbyJoinResponse(message, callback) {
  // TODO:  Always seems to return "DOTA_JOIN_RESULT_ALREADY_IN_GAME", not trustworthy. >:
  callback = callback || null;
  var practiceLobbyJoinResponse = dota_gcmessages_client.CMsgPracticeLobbyJoinResponse.parse(message);

  if (practiceLobbyJoinResponse.result === 1) {
    if (this.debug) util.log("Recevied practice lobby join response " + practiceLobbyJoinResponse.result);
    this.emit("practiceLobbyJoinResponse", practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
    if (callback) callback(null, practiceLobbyJoinResponse);
  }
  else if (this.debug) {
    util.log("Received a bad practiceLobbyJoinResponse");
    if (callback) callback(practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
  }
};

// handlers[Dota2.ESOMsg.k_ESOMsg_UpdateMultiple] = function onWeirdShit(message, callback) {
//   callback = callback || null;
//   var weird = gcsdk_gcmessages.CMsgSOMultipleObjects.parse(message);
//   console.log(JSON.stringify(weird));
// };