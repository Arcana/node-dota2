var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods
Dota2.Dota2Client.prototype.createPracticeLobby = function(game_name, password, server_region, game_mode, callback) {
  callback = callback || null;
  password = password || "";
  game_name = game_name || "";
  server_region = server_region || Dota2.ServerRegion.UNSPECIFIED;
  game_mode = game_mode || Dota2.GameMode.DOTA_GAMEMODE_AP;

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

Dota2.Dota2Client.prototype.configPracticeLobby = function(options, callback){
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  var command, option, possibleOptions, type, value;

  command = {};

  possibleOptions = {
    game_name: "string",
    server_region: "number",
    game_mode: "number",
    allow_cheats: "boolean",
    fill_with_bots: "boolean",
    allow_spectating: "boolean",
    pass_key: "string",
    series_type: "number",
    radiant_series_wins: "number",
    dire_series_wins: "number",
    allchat: "boolean"
  };

  for (option in options) {
    value = options[option];
    type = possibleOptions[option];
    if (type == null) {
      if (this.debug) {
        util.log("Lobby option " + option + " is not possible.");
      }
      continue;
    }
    if (typeof value !== type) {
      if (this.debug) {
        util.log("Lobby option " + option + " must be a " + type + ".");
      }
      continue;
    }
    command[option] = value;
  }

  var payload = dota_gcmessages_client.CMsgPracticeLobbySetDetails.serialize(command);

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbySetDetails | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.practiceLobbyListRequest = function(callback){
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  
  if (this.debug) util.log("Sending CMsgPracticeLobbyList request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyList.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyList | protoMask), payload, callback);
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

  if (this.debug) util.log("Received practice lobby join response " + practiceLobbyJoinResponse.result);
  this.emit("practiceLobbyJoinResponse", practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
  if (callback) callback(practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyListResponse] = function(message, callback) {
  var practiceLobbyListResponse = dota_gcmessages_client.CMsgPracticeLobbyListResponse.parse(message);

  if (this.debug) util.log("Received practice lobby list response " + practiceLobbyListResponse);
  this.emit("practiceLobbyListResponse", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};
