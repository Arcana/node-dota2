var Dota2 = require("../index"),
    util = require("util");

// Methods
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.createPracticeLobby = function(game_name, password, server_region, game_mode, callback) {
  callback = callback || null;
  password = password || "";
  game_name = game_name || "";
  server_region = server_region || Dota2.ServerRegion.UNSPECIFIED;
  game_mode = game_mode || Dota2.GameMode.DOTA_GAMEMODE_AP;
  var _self = this;

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending match CMsgPracticeLobbyCreate request");
  var payload = new Dota2.schema.CMsgPracticeLobbyCreate({
    "lobby_details": {
      // TODO:  Add ability to set some settings here.
      "game_name": game_name,
      "server_region": server_region,
      "game_mode": game_mode,
      "pass_key": password,
    }
  });
  this._protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCPracticeLobbyCreate;
  this._gc.send(this._protoBufHeader,
                payload.toBuffer(),
                function (header, body) {
                  onPracticeLobbyResponse.call(_self, body, callback);
                }
  );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.configPracticeLobby = function(id, options, callback){
  callback = callback || null;
  var _self = this;
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
Dota2.Dota2Client.prototype.practiceLobbyListRequest = function(callback){
  callback = callback || null;
  var _self = this;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  
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
Dota2.Dota2Client.prototype.friendPracticeLobbyListRequest = function(callback){
  callback = callback || null;
  var _self = this;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  
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

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
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
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

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
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

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
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

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
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

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

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

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

  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

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
  this.emit("practiceLobbyListResponse", null, practiceLobbyListResponse);
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
  this.emit("friendPracticeLobbyListResponse", null, practiceLobbyListResponse);
  if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListResponse] = onFriendPracticeLobbyListResponse;
