var Dota2 = require("../index"),
    util = require("util");

Dota2.SeriesType = {
    NONE: 0,
    BEST_OF_THREE: 1,
    BEST_OF_FIVE: 2
};

Dota2._lobbyOptions = {
    game_name: "string",
    server_region: "number",
    game_mode: "number",
    game_version: "number",
    cm_pick: "number",
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

    if (this.debug) util.log("Sending match CMsgPracticeLobbyCreate request");
    var lobby_details = Dota2._parseOptions(options, Dota2._lobbyOptions);
    lobby_details.pass_key = password;
    var payload = {
        "lobby_details": lobby_details,
        "pass_key": password
    };

    if (tournament_game_id > 0) {
        payload["tournament_game"] = true;
        payload["tournament_game_id"] = tournament_game_id;
        payload["tournament_id"] = tournament_id;
    }

    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyCreate, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyCreate").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.configPracticeLobby = function(lobby_id, options, callback) {
    callback = callback || null;
    var _self = this;

    var payload = Dota2._parseOptions(options, Dota2._lobbyOptions);
    payload["lobby_id"] = lobby_id;

    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbySetDetails,
                    Dota2.schema.lookupType("CMsgPracticeLobbySetDetails").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyListResponse
Dota2.Dota2Client.prototype.requestPracticeLobbyList = function(callback) {
    callback = callback || null;
    var _self = this;

    if (this.debug) util.log("Sending CMsgPracticeLobbyList request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyList, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyList").encode(payload).finish(), 
                    onPracticeLobbyListResponse, callback);
};
// callback to onFriendPracticeLobbyListResponse
Dota2.Dota2Client.prototype.requestFriendPracticeLobbyList = function(callback) {
    callback = callback || null;
    var _self = this;

    if (this.debug) util.log("Sending CMsgFriendPracticeLobbyListRequest request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCFriendPracticeLobbyListRequest, 
                    Dota2.schema.lookupType("CMsgFriendPracticeLobbyListRequest").encode(payload).finish(), 
                    onFriendPracticeLobbyListResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.balancedShuffleLobby = function(callback) {
    callback = callback || null;
    var _self = this;
    
    if (this.debug) util.log("Sending CMsgBalancedShuffleLobby request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCBalancedShuffleLobby, 
                    Dota2.schema.lookupType("CMsgBalancedShuffleLobby").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
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

  this._gc.send(
  {
          "msg":    Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCFlipLobbyTeams,
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
Dota2.Dota2Client.prototype.flipLobbyTeams = function(callback) {
    callback = callback || null;
    var _self = this;

    if (this.debug) util.log("Sending flip teams request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCFlipLobbyTeams, 
                    Dota2.schema.lookupType("CMsgFlipLobbyTeams").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

Dota2.Dota2Client.prototype.inviteToLobby = function(steam_id) {
    steam_id = steam_id || null;
    if (steam_id == null) {
        if (this.debug) util.log("Steam ID required to create a lobby invite.");
        return null;
    }

    if (this.debug) util.log("Inviting " + steam_id + " to a lobby.");
    // todo: set client version here?
    var payload = {
        "steam_id": steam_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").k_EMsgGCInviteToLobby, 
                    Dota2.schema.lookupType("CMsgInviteToLobby").encode(payload).finish());
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.practiceLobbyKick = function(account_id, callback) {
    callback = callback || null;
    account_id = account_id || "";
    var _self = this;

    if (this.debug) util.log("Sending match CMsgPracticeLobbyKick request");
    
    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyKick, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyKick").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.practiceLobbyKickFromTeam = function(account_id, callback) {
    callback = callback || null;
    account_id = account_id || "";
    var _self = this;

    if (this.debug) util.log("Sending match CMsgPracticeLobbyKickFromTeam request");
    
    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyKickFromTeam, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyKickFromTeam").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyJoinResponse
Dota2.Dota2Client.prototype.joinPracticeLobby = function(id, password, callback) {
    callback = callback || null;
    password = password || "";
    var _self = this;

    if (this.debug) util.log("Sending match CMsgPracticeLobbyJoin request");
    
    var payload = {
        "lobby_id": id,
        "pass_key": password
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyJoin, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyJoin").encode(payload).finish(), 
                    onPracticeLobbyJoinResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.leavePracticeLobby = function(callback) {
    callback = callback || null;
    var _self = this;

    /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */
    if (this.debug) util.log("Sending match CMsgPracticeLobbyLeave request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyLeave, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyLeave").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.abandonCurrentGame = function(callback) {
    callback = callback || null;
    var _self = this;

    if (this.debug) util.log("Sending match CMsgAbandonCurrentGame request");

    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCAbandonCurrentGame,
                    Dota2.schema.lookupType("CMsgAbandonCurrentGame").encode(payload).finish(),
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.launchPracticeLobby = function(callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting lobby start. */
    if (this.debug) util.log("Sending match CMsgPracticeLobbyLaunch request");

    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyLaunch, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyLaunch").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.joinPracticeLobbyTeam = function(slot, team, callback) {
    callback = callback || null;
    slot = slot ||1;
    if (typeof team === 'undefined') team = Dota2.schema.lookupEnum("DOTA_GC_TEAM").DOTA_GC_TEAM_PLAYER_POOL;
    
    var _self = this;

    if (this.debug) util.log("Sending match CMsgPracticeLobbySetTeamSlot request");
    
    var payload = {
        "team": team,
        "slot": slot
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbySetTeamSlot, 
                    Dota2.schema.lookupType("CMsgPracticeLobbySetTeamSlot").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};
// callback to onPracticeLobbyJoinResponse
Dota2.Dota2Client.prototype.joinPracticeLobbyBroadcastChannel = function(channel, callback) {
    callback = callback || null;
    channel = channel || 1;
    var _self = this;

    if (this.debug) util.log("Sending match CMsgPracticeLobbyJoinBroadcastChannel request");

    var payload = {
        "channel": channel
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyJoinBroadcastChannel,
                    Dota2.schema.lookupType("CMsgPracticeLobbyJoinBroadcastChannel").encode(payload).finish(),
                    onPracticeLobbyJoinResponse, callback);
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.addBotToPracticeLobby = function(slot, team, bot_difficulty, callback) {
    callback = callback || null;
    slot = slot || 1;
    team = team || Dota2.schema.lookupEnum("DOTA_GC_TEAM").DOTA_GC_TEAM_GOOD_GUYS;
    bot_difficulty = bot_difficulty || Dota2.schema.lookupEnum("DOTABotDifficulty").BOT_DIFFICULTY_PASSIVE;
    var _self = this;

    if (this.debug) util.log("Sending match CMsgPracticeLobbySetTeamSlot request");
    
    var payload = {
        "team": team,
        "slot": slot,
        "bot_difficulty": bot_difficulty
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbySetTeamSlot, 
                    Dota2.schema.lookupType("CMsgPracticeLobbySetTeamSlot").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
}
// no callback
Dota2.Dota2Client.prototype.respondLobbyInvite = function(id, accept) {
    id = id || null;
    accept = accept || false;
    if (id == null) {
        if (this.debug) util.log("Lobby ID required to respond to an invite.");
        return null;
    }

    if (this.debug) util.log("Responding to lobby invite " + id + ", accept: " + accept);
    // todo: set client version here?
    var payload = {
        "lobby_id": id,
        "accept": accept
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").k_EMsgGCLobbyInviteResponse, 
                    Dota2.schema.lookupType("CMsgLobbyInviteResponse").encode(payload).finish());
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onPracticeLobbyJoinResponse = function onPracticeLobbyJoinResponse(message, callback) {
    callback = callback || null;
    var practiceLobbyJoinResponse = Dota2.schema.lookupType("CMsgPracticeLobbyJoinResponse").decode(message);

    if (this.debug) util.log("Received practice lobby join response " + practiceLobbyJoinResponse.result);
    this.emit("practiceLobbyJoinResponse", practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
    
    if (callback) {
        if (practiceLobbyJoinResponse.result === Dota2.schema.lookupEnum("DOTAJoinLobbyResult").DOTA_JOIN_RESULT_SUCCESS) {
            callback(null, practiceLobbyJoinResponse);
        } else {
            callback(practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
        }
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyJoinResponse] = onPracticeLobbyJoinResponse;

var onPracticeLobbyListResponse = function onPracticeLobbyListResponse(message, callback) {
    var practiceLobbyListResponse = Dota2.schema.lookupType("CMsgPracticeLobbyListResponse").decode(message);

    if (this.debug) util.log("Received practice lobby list response " + practiceLobbyListResponse);
    this.emit("practiceLobbyListData", null, practiceLobbyListResponse);
    if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyListResponse] = onPracticeLobbyListResponse;

var onPracticeLobbyResponse = function onPracticeLobbyResponse(message, callback) {
    var practiceLobbyResponse = Dota2.schema.lookupType("CMsgPracticeLobbyJoinResponse").decode(message);

    if (this.debug) util.log("Received create/flip/shuffle/kick/launch/leave response " + JSON.stringify(practiceLobbyResponse));
    this.emit("practiceLobbyResponse", practiceLobbyResponse.result, practiceLobbyResponse);
    
    if (callback) {
        if (practiceLobbyResponse.result === 1) {
            callback(null, practiceLobbyResponse); 
        } else {
            callback(practiceLobbyResponse.result, practiceLobbyResponse); 
        }
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCPracticeLobbyResponse] = onPracticeLobbyResponse;

var onFriendPracticeLobbyListResponse = function onFriendPracticeLobbyListResponse(message, callback) {
    var practiceLobbyListResponse = Dota2.schema.lookupType("CMsgFriendPracticeLobbyListResponse").decode(message);

    if (this.debug) util.log("Received friend practice lobby list response " + JSON.stringify(practiceLobbyListResponse));
    this.emit("friendPracticeLobbyListData", null, practiceLobbyListResponse);
    if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCFriendPracticeLobbyListResponse] = onFriendPracticeLobbyListResponse;

var onInviteCreated = function onInviteCreated(message) {
    var inviteCreated = Dota2.schema.lookupType("CMsgInvitationCreated").decode(message);
    var is_online = !inviteCreated.user_offline;

    if (this.debug && is_online) util.log("Created invitation to online user " + inviteCreated.steam_id);
    if (this.debug && !is_online) util.log("Created invitation to offline user " + inviteCreated.steam_id);
    this.emit("inviteCreated", inviteCreated.steam_id, inviteCreated.group_id, is_online);
}
handlers[Dota2.schema.lookupEnum("EGCBaseMsg").k_EMsgGCInvitationCreated] = onInviteCreated;

