var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    dota_gcmessages_common = new Schema(fs.readFileSync(__dirname+"/../generated/dota_gcmessages_common.desc")),
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
      // TODO:  This should allow more details to be set.
      "gameName": game_name,
      "serverRegion": server_region,
      "gameMode": game_mode,
      "passKey": password
    }
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyCreate | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.configPracticeLobby = function(id, options, callback){
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  var command, option, possibleOptions, type, value;

  command = {lobby_id: id};

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
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  
  if (this.debug) util.log("Sending CMsgPracticeLobbyList request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyList.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyList | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.friendPracticeLobbyListRequest = function(callback){
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  
  if (this.debug) util.log("Sending CMsgFriendPracticeLobbyListRequest request");
  var payload = dota_gcmessages_client.CMsgFriendPracticeLobbyListRequest.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListRequest | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.balancedShuffleLobby = function(callback){
  callback = callback || null;

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  var payload = dota_gcmessages_client.CMsgBalancedShuffleLobby.serialize({});

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCBalancedShuffleLobby | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.flipLobbyTeams = function(callback){
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending flip teams request");
  var payload = dota_gcmessages_client.CMsgFlipLobbyTeams.serialize({});

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCFlipLobbyTeams | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.practiceLobbyKick = function(accountid, callback){
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  accountid = accountid || "";

  if (this.debug) util.log("Sending match CMsgPracticeLobbyJoin request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyKick.serialize({
    account_id: accountid
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyKick | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.joinPracticeLobby = function(id, password, callback){
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  password = password || "";

  if (this.debug) util.log("Sending match CMsgPracticeLobbyJoin request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyJoin.serialize({
    lobby_id: id,
    pass_key: password
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyJoin | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.startPracticeLobby = function(callback){
  callback = callback || null;

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match CMsgPracticeLobbyLeave request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyLeave.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyLeave | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.leavePracticeLobby = function(callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match CMsgPracticeLobbyLeave request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyLeave.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyLeave | protoMask), payload, callback);
};

Dota2.Dota2Client.prototype.launchPracticeLobby = function(callback) {
  callback = callback || null;

  /* Sends a message to the Game Coordinator requesting lobby start. */

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match CMsgPracticeLobbyLaunch request");
  var payload = dota_gcmessages_client.CMsgPracticeLobbyLaunch.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyLaunch | protoMask), payload, callback);
};


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyListResponse] = function(message, callback) {
  var practiceLobbyListResponse = dota_gcmessages_client.CMsgPracticeLobbyListResponse.parse(message);

  if (this.debug) util.log("Received practice lobby list response " + practiceLobbyListResponse);
  this.emit("practiceLobbyListResponse", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyResponse] = function(message, callback){
  var practiceLobbyResponse = dota_gcmessages_client.CMsgPracticeLobbyJoinResponse.parse(message);

  if(this.debug) util.log("Received create/leave response "+JSON.stringify(practiceLobbyResponse));
  this.emit("practiceLobbyResponse", practiceLobbyResponse.result, practiceLobbyResponse);
  if(callback) callback(practiceLobbyResponse.result, practiceLobbyResponse);
};

handlers[Dota2.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListResponse] = function(message, callback) {
  var practiceLobbyListResponse = dota_gcmessages_client.CMsgFriendPracticeLobbyListResponse.parse(message);

  if (this.debug) util.log("Received friend practice lobby list response " + JSON.stringify(practiceLobbyListResponse));
  this.emit("friendPracticeLobbyListResponse", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};
