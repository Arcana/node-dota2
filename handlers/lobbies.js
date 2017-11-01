var Dota2 = require("../index"),
    util = require("util");

Dota2._lobbyOptions = {
    game_name: "string",
    pass_key: "string",
    server_region: "number",
    game_mode: "number",
    game_version: "number",
    cm_pick: "number",
    allow_cheats: "boolean",
    fill_with_bots: "boolean",
    bot_difficulty_radiant: "number",
    bot_difficulty_dire: "number",
    bot_radiant: "number",
    bot_dire: "number",
    allow_spectating: "boolean",
    series_type: "number",
    radiant_series_wins: "number",
    dire_series_wins: "number",
    previous_match_override: "number",
    allchat: "boolean",
    dota_tv_delay: "number",
    leagueid: "number",
    custom_game_mode: "string",
    custom_map_name: "string",
    custom_difficulty: "number",
    custom_game_id: "number",
    pause_setting: "number",
};

/**
 * @typedef {Object} module:Dota2.Dota2Client#Lobby.Options
 * 
 * @property {string} game_name - Name of the lobby
 * 
 * @property {string} pass_key - Lobby password
 * 
 * @property {module:Dota2.ServerRegion} [server_region=module:Dota2.ServerRegion.UNSPECIFIED] - Server region where the lobby will be created
 * 
 * @property {DOTA_GameMode} [game_mode=DOTA_GameMode.DOTA_GAMEMODE_AP] - Game mode
 * 
 * @property {DOTAGameVersion} [game_version=DOTAGameVersion.GAME_VERSION_STABLE] - Version of the game
 * 
 * @property {DOTA_CM_PICK} [cm_pick=DOTA_CM_PICK.DOTA_CM_RANDOM] - Who gets first pick
 * 
 * @property {boolean} [allow_cheats=false] - Whether or not to allow cheats
 * 
 * @property {boolean} [fill_with_bots=false] - Whether or not to fill empty slots with bots
 * 
 * @property {BotDifficulty} [bot_difficulty_radiant=module:Dota2.BotDifficulty.PASSIVE] - The bot difficulty for radiant bots, if fill_with_bots is true.
 *
 * @property {BotDifficulty} [bot_difficulty_dire=module:Dota2.BotDifficulty.PASSIVE] - The bot difficulty for dire bots, if fill_with_bots is true.
 *
 * @property {number} [bot_radiant] - Presumably the ID of the custom AI to be applied to radiant bots.
 *
 * @property {number} [bot_dire] - Presumably the ID of the custom AI to be applied to dire bots.
 *
 * @property {boolean} [allow_spectating=true] - Whether or not to allow spectating
 * 
 * @property {SeriesType} [series_type=NONE] - Whether or not the game is part of a series (Bo3, Bo5).
 *
 * @property {number} [radiant_series_wins=0] - # of games won so far, e.g. for a Bo3 or Bo5.
 *
 * @property {number} [dire_series_wins=0] - # of games won so far, e.g. for a Bo3 or Bo5.
 *
 * @property {number} [previous_match_override] - In a series, the match ID of the previous game. If not supplied, the GC will try
 * to find it automatically based on the teams and the players.
 *
 * @property {boolean} [allchat=false] - Whether or not it's allowed to all-chat
 * 
 * @property {LobbyDotaTVDelay} [dota_tv_delay=LobbyDotaTV_120] - How much time the game should be delayed for DotaTV.
 *
 * @property {number} [leagueid] - The league this lobby is being created for. The bot should be a league admin for this to work.
 *
 * @property {string} [custom_game_mode] - Name of the custom game
 * 
 * @property {string} [custom_map_name] - Which map the custom game should be played on
 * 
 * @property {number} [custom_difficulty] - Difficulty of the custom game
 * 
 * @property {external:Long} [custom_game_id] - 64bit ID of the custom game mode
 * 
 * @property {LobbyDotaPauseSetting} [pause_setting=0] - Pause setting: 0 - unlimited, 1 - limited, 2 - disabled
 */

// Methods
/**
 * Sends a message to the Game Coordinator requesting to create a lobby. 
 * This will automatically make the bot join the first slot on radiant team. Listen for
 * {@link module:Dota2.Dota2Client#event:practiceLobbyUpdate|practiceLobbyUpdate} response for a
 * snapshot-update of the newly created lobby.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 *
 * @alias module:Dota2.Dota2Client#createPracticeLobby
 *
 * @param {module:Dota2.Dota2Client#Lobby.Options} options - Configuration options for the lobby
 * 
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.createPracticeLobby = function(options, callback) {
    callback = callback || null;
    var _self = this;

    var defaults = {
        game_name: "",
        server_region: Dota2.ServerRegion.UNSPECIFIED,
        game_mode: Dota2.schema.lookupEnum("DOTA_GameMode").values.DOTA_GAMEMODE_AP,
        game_version: Dota2.schema.lookupEnum("DOTAGameVersion").values.GAME_VERSION_STABLE,
        cm_pick: Dota2.schema.lookupEnum("DOTA_CM_PICK").values.DOTA_CM_RANDOM,
        allow_cheats: false,
        fill_with_bots: false,
        bot_difficulty_radiant: Dota2.BotDifficulty.PASSIVE,
        bot_difficulty_dire: Dota2.BotDifficulty.PASSIVE,
        allow_spectating: true,
        pass_key: "",
        series_type: Dota2.SeriesType.NONE,
        radiant_series_wins: 0,
        dire_series_wins: 0,
        allchat: false,
        dota_tv_delay: Dota2.schema.lookupEnum("LobbyDotaTVDelay").values.LobbyDotaTV_120,
        leagueid: 0,
        previous_match_override: 0,
        custom_game_mode: "",
        custom_map_name: "",
        custom_difficulty: 0,
        custom_game_id: 0
    };
    var finalOptions = Object.assign(defaults, options);

    this.Logger.debug("Sending match CMsgPracticeLobbyCreate request");
    var lobby_details = Dota2._parseOptions(finalOptions, Dota2._lobbyOptions);
    var payload = {
        "lobby_details": lobby_details,
        "pass_key": finalOptions.pass_key
    };

    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyCreate,
                    Dota2.schema.lookupType("CMsgPracticeLobbyCreate").encode(payload).finish(),
                    onPracticeLobbyResponse, callback);
}

/**
 * @deprecated since 5.0.0
 * @alias module:Dota2.Dota2Client#_createPracticeLobby
 */
Dota2.Dota2Client.prototype._createPracticeLobby = function(password, options, callback) {
    callback = callback || null;
    this.createTournamentLobby(password, -1, -1, options, callback);
}
/**
 * @deprecated since 5.0.0
 * @alias module:Dota2.Dota2Client#createTournamentLobby
 */
Dota2.Dota2Client.prototype.createTournamentLobby = function(password, tournament_game_id, tournament_id, options, callback) {
    callback = callback || null;
    password = password || "";
    tournament_game_id = tournament_game_id || -1;
    tournament_id = tournament_id || -1;
    var _self = this;

    this.Logger.debug("Sending match CMsgPracticeLobbyCreate request");
    var lobby_details = Dota2._parseOptions(options, Dota2._lobbyOptions);
    lobby_details.pass_key = password;
    lobby_details.leagueid = options.leagueid || tournament_id;
    var payload = {
        "lobby_details": lobby_details,
        "pass_key": password
    };

    if (tournament_id > 0) {
        payload["tournament_game"] = true;
        payload["tournament_game_id"] = tournament_game_id;
        payload["tournament_id"] = tournament_id;
    }

    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyCreate, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyCreate").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting to configure some options of the active lobby. 
 * Listen for {@link module:Dota2.Dota2Client#event:practiceLobbyUpdate|practiceLobbyUpdate} response 
 * for a snapshot-update of the newly created lobby.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#configPracticeLobby
 * @param {external:Long} lobby_id - ID of the lobby
 * @param {module:Dota2.Dota2Client#Lobby.Options} options - The new option values
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.configPracticeLobby = function(lobby_id, options, callback) {
    callback = callback || null;
    var _self = this;

    var payload = Dota2._parseOptions(options, Dota2._lobbyOptions);
    payload["lobby_id"] = lobby_id;

    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbySetDetails,
                    Dota2.schema.lookupType("CMsgPracticeLobbySetDetails").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Requests a lists of joinable practice lobbies.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyListData|practiceLobbyListData} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestPracticeLobbyList
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyListResponse`
 */
Dota2.Dota2Client.prototype.requestPracticeLobbyList = function(callback) {
    callback = callback || null;
    var _self = this;

    this.Logger.debug("Sending CMsgPracticeLobbyList request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyList, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyList").encode(payload).finish(), 
                    onPracticeLobbyListResponse, callback);
};

/**
 * Requests a lists of joinable practice lobbies which have one of your friends in them.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:friendPracticeLobbyListData|friendPracticeLobbyListData} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestFriendPracticeLobbyList
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgFriendPracticeLobbyListResponse`
 */
Dota2.Dota2Client.prototype.requestFriendPracticeLobbyList = function(callback) {
    callback = callback || null;
    var _self = this;

    this.Logger.debug("Sending CMsgFriendPracticeLobbyListRequest request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCFriendPracticeLobbyListRequest, 
                    Dota2.schema.lookupType("CMsgFriendPracticeLobbyListRequest").encode(payload).finish(), 
                    onFriendPracticeLobbyListResponse, callback);
};

/**
 * Shuffles the lobby based on skill level. Requires you to be in a lobby and to be the host.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#balancedShuffleLobby
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.balancedShuffleLobby = function(callback) {
    callback = callback || null;
    var _self = this;
    
    this.Logger.debug("Sending CMsgBalancedShuffleLobby request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCBalancedShuffleLobby, 
                    Dota2.schema.lookupType("CMsgBalancedShuffleLobby").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Flips the radiant and dire team players. Requires you to be in a lobby and to be the host.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#flipLobbyTeams
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.flipLobbyTeams = function(callback) {
    callback = callback || null;
    var _self = this;

    this.Logger.debug("Sending flip teams request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCFlipLobbyTeams, 
                    Dota2.schema.lookupType("CMsgFlipLobbyTeams").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Asks to invite a player to your lobby. This creates a new default lobby when you are not already in one.
 * Listen for the {@link module:Dota2.Dota2Client#event:inviteCreated|inviteCreated} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#inviteToLobby
 * @param {external:Long} steam_id - The Steam ID of the player you want to invite.
 */
Dota2.Dota2Client.prototype.inviteToLobby = function(steam_id) {
    steam_id = steam_id.toString() || null;
    if (steam_id == null) {
        this.Logger.error("Steam ID required to create a lobby invite.");
        return null;
    }

    this.Logger.debug("Inviting " + steam_id + " to a lobby.");
    // todo: set client version here?
    var payload = {
        "steam_id": steam_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").values.k_EMsgGCInviteToLobby, 
                    Dota2.schema.lookupType("CMsgInviteToLobby").encode(payload).finish());
};

/**
 * Asks to kick someone from your current practice lobby. Requires you to be in a lobby and to be the host.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#practiceLobbyKick
 * @param {number} account_id - The Dota2 account ID of the player you want to kick.
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.practiceLobbyKick = function(account_id, callback) {
    callback = callback || null;
    account_id = account_id || "";
    var _self = this;

    this.Logger.debug("Sending match CMsgPracticeLobbyKick request");
    
    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyKick, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyKick").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Asks to kick someone from his chosen team in your current practice lobby.
 * The player will be added to the player pool
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#practiceLobbyKickFromTeam
 * @param {number} account_id - The Dota2 account ID of the player you want to kick from his team.
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.practiceLobbyKickFromTeam = function(account_id, callback) {
    callback = callback || null;
    account_id = account_id || "";
    var _self = this;

    this.Logger.debug("Sending match CMsgPracticeLobbyKickFromTeam request");
    
    var payload = {
        "account_id": account_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyKickFromTeam, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyKickFromTeam").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting to join a lobby.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyJoinResponse|practiceLobbyJoinResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#joinPracticeLobby
 * @param {externalLong} id - The ID of the lobby
 * @param {number} password - The password of the lobby
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.joinPracticeLobby = function(id, password, callback) {
    callback = callback || null;
    password = password || "";
    var _self = this;

    this.Logger.debug("Sending match CMsgPracticeLobbyJoin request");
    
    var payload = {
        "lobby_id": id,
        "pass_key": password
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyJoin, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyJoin").encode(payload).finish(), 
                    onPracticeLobbyJoinResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting to leave the current lobby.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#leavePracticeLobby
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.leavePracticeLobby = function(callback) {
    callback = callback || null;
    var _self = this;

    /* Sends a message to the Game Coordinator requesting to leave the lobby.  Listen for `practiceLobby` event for Game Coordinator's response. */
    this.Logger.debug("Sending match CMsgPracticeLobbyLeave request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyLeave, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyLeave").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Destroy the current lobby. Requires you to be the host.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:lobbyDestroyed|lobbyDestroyed} event for the GC's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#destroyLobby
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgDOTADestroyLobbyResponse`
 **/
Dota2.Dota2Client.prototype.destroyLobby = function(callback) {
    callback = callback || null;

    /* Sends a message to the Game Coordinator requesting to destroy the lobby.  Listen for `lobbyDestroyed` event for Game Coordinator's response. */
    this.Logger.debug("Sending match CMsgPracticeLobbyLeave request");
    
    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgDestroyLobbyRequest,
                    Dota2.schema.lookupType("CMsgDOTADestroyLobbyRequest").encode(payload).finish(),
                    onDestroyLobbyResponse, callback);
}

/**
 * Abandons the current game.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#abandonCurrentGame
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.abandonCurrentGame = function(callback) {
    callback = callback || null;
    var _self = this;

    this.Logger.debug("Sending match CMsgAbandonCurrentGame request");

    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCAbandonCurrentGame,
                    Dota2.schema.lookupType("CMsgAbandonCurrentGame").encode(payload).finish(),
                    onPracticeLobbyResponse, callback);
};

/**
 * Start the practice lobby. The bot will continue to receive lobby updates, but won't join the actual game.
 * Requires you to be in a lobby and to be the host.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#launchPracticeLobby
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.launchPracticeLobby = function(callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting lobby start. */
    this.Logger.debug("Sending match CMsgPracticeLobbyLaunch request");

    var payload = {};
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyLaunch, 
                    Dota2.schema.lookupType("CMsgPracticeLobbyLaunch").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting to join a particular team in the lobby.
 * Requires you to be in a lobby.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#joinPracticeLobbyTeam
 * @param {number} slot - The slot you want to join
 * @param {number} team - The team you want to join
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.joinPracticeLobbyTeam = function(slot, team, callback) {
    callback = callback || null;
    slot = slot ||1;
    if (typeof team === 'undefined') team = Dota2.schema.lookupEnum("DOTA_GC_TEAM").values.DOTA_GC_TEAM_PLAYER_POOL;
    
    var _self = this;

    this.Logger.debug("Sending match CMsgPracticeLobbySetTeamSlot request");
    
    var payload = {
        "team": team,
        "slot": slot
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbySetTeamSlot, 
                    Dota2.schema.lookupType("CMsgPracticeLobbySetTeamSlot").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting to add a bot to the broadcast channel.
 * Requires you to be in a lobby.
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#joinPracticeLobbyBroadcastChannel
 * @param {number} [channel=1] -  The channel slot you want to fill
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.joinPracticeLobbyBroadcastChannel = function(channel, callback) {
    callback = callback || null;
    channel = channel || 1;
    var _self = this;

    this.Logger.debug("Sending match CMsgPracticeLobbyJoinBroadcastChannel request");

    var payload = {
        "channel": channel
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyJoinBroadcastChannel,
                    Dota2.schema.lookupType("CMsgPracticeLobbyJoinBroadcastChannel").encode(payload).finish(),
                    onPracticeLobbyJoinResponse, callback);
};

/**
 * Sends a message to the Game Coordinator requesting to add a bot to the given team in the lobby.
 * Requires you to be in a lobby and to be the host
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#addBotToPracticeLobby
 * @param {number} slot - The slot you want to add a bot to
 * @param {number} team - The team you want to add a bot to
 * @param {module:Dota2.BotDifficulty} bot_difficulty - The difficulty setting of the bot.
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgPracticeLobbyJoinResponse`
 */
Dota2.Dota2Client.prototype.addBotToPracticeLobby = function(slot, team, bot_difficulty, callback) {
    callback = callback || null;
    slot = slot || 1;
    team = team || Dota2.schema.lookupEnum("DOTA_GC_TEAM").values.DOTA_GC_TEAM_GOOD_GUYS;
    bot_difficulty = bot_difficulty || Dota2.schema.lookupEnum("DOTABotDifficulty").values.BOT_DIFFICULTY_PASSIVE;
    var _self = this;

    this.Logger.debug("Sending match CMsgPracticeLobbySetTeamSlot request");
    
    var payload = {
        "team": team,
        "slot": slot,
        "bot_difficulty": bot_difficulty
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbySetTeamSlot, 
                    Dota2.schema.lookupType("CMsgPracticeLobbySetTeamSlot").encode(payload).finish(), 
                    onPracticeLobbyResponse, callback);
}

/**
 * Sends a message to the Game Coordinator confirming/denying a lobby invitation
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:practiceLobbyResponse|practiceLobbyResponse} event for the GC's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#respondLobbyInvite
 * @param {external:Long} id - The ID of the lobby
 * @param {boolean} accept - Whether or not you accept the invitation.
 */
Dota2.Dota2Client.prototype.respondLobbyInvite = function(id, accept) {
    id = id || null;
    accept = accept || false;
    if (id == null) {
        this.Logger.error("Lobby ID required to respond to an invite.");
        return null;
    }

    this.Logger.debug("Responding to lobby invite " + id + ", accept: " + accept);
    // todo: set client version here?
    var payload = {
        "lobby_id": id,
        "accept": accept
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EGCBaseMsg").values.k_EMsgGCLobbyInviteResponse, 
                    Dota2.schema.lookupType("CMsgLobbyInviteResponse").encode(payload).finish());
};

// Events
/**
 * Event that's emitted when attempting to destroy the lobby
 * @event module:Dota2.Dota2Client#lobbyDestroyed
 * @param {CMsgDOTADestroyLobbyResponse.Result} result - Result code, 0 is SUCCESS, 1 is ERROR_UNKNOWN
 * @param {Object} response - The raw response object
 **/ 
/**
 * Event that's emitted whenever the bot joins a lobby
 * @event module:Dota2.Dota2Client#practiceLobbyJoinResponse
 * @param {DOTAJoinLobbyResult} result - Result code
 * @param {Object} response - The raw response object
 * @param {DOTAJoinLobbyResult} response.result - Result code
 */
/**
 * Event that's emitted in response to a {@link module:Dota2.Dota2Client#requestPracticeLobbyList|request for the list of lobbies}
 * @event module:Dota2.Dota2Client#practiceLobbyListData
 * @param {Object} practiceLobbyListResponse - Raw response object
 * @param {boolean} practiceLobbyListResponse.tournament_games - Whether or not there are tournament games included in the list
 * @param {CMsgPracticeLobbyListResponseEntry[]} practiceLobbyListResponse.lobbies - List of practice lobbies and their details
 */ 
 /**
 * Emitted when an operation changing the state of a lobby was sent to the GC and
 * processed. This event only contains the acknowledgement by the GC. The actual
 * update of the lobby state is communicated via {@link module:Dota2.Dota2Client#practiceLobbyUpdate} events.
 * @event module:Dota2.Dota2Client#practiceLobbyResponse
 * @param {DOTAJoinLobbyResult} result - Result code
 * @param {Object} response - The raw response object
 * @param {module:Dota2.EResult} response.result - Result code
 */
/**
 * Event that's emitted in response to a {@link module:Dota2.Dota2Client#requestPracticeLobbyList|request for the list of your friends' lobbies}
 * @event module:Dota2.Dota2Client#friendPracticeLobbyListData
 * @param {Object} practiceLobbyListResponse - Raw response object
 * @param {CMsgPracticeLobbyListResponseEntry[]} practiceLobbyListResponse.lobbies - List of practice lobbies and their details
 */ 
 /**
 * Event that's emitted whenever the bot attempts to invite someone to a lobby
 * @event module:Dota2.Dota2Client#inviteCreated
 * @param {external:Long} steam_id - Steam ID of the person that was invited to the lobby
 * @param {external:Long} group_id - Group ID of the invitation
 * @param {boolean} is_online - Whether or not the invitee is online
 */

// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

var onDestroyLobbyResponse = function onDestroyLobbyResponse(message, callback) {
    callback = callback || null;
    var lobbyDestroyed = Dota2.schema.lookupType("CMsgDOTADestroyLobbyResponse").decode(message);
    
    this.Logger.debug("Received destroy lobby response "+lobbyDestroyed.result);
    this.emit("lobbyDestroyed", lobbyDestroyed.result, lobbyDestroyed);
    
    if (callback) {
        if (lobbyDestroyed.result === Dota2.schema.lookupEnum("CMsgDOTADestroyLobbyResponse.Result").values.SUCCESS) {
            callback(null, lobbyDestroyed);
        } else {
            callback(lobbyDestroyed.result, lobbyDestroyed);
        }
    }
}
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgDestroyLobbyResponse ] = onDestroyLobbyResponse;

var onPracticeLobbyJoinResponse = function onPracticeLobbyJoinResponse(message, callback) {
    callback = callback || null;
    var practiceLobbyJoinResponse = Dota2.schema.lookupType("CMsgPracticeLobbyJoinResponse").decode(message);

    this.Logger.debug("Received practice lobby join response " + practiceLobbyJoinResponse.result);
    this.emit("practiceLobbyJoinResponse", practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
    
    if (callback) {
        if (practiceLobbyJoinResponse.result === Dota2.schema.lookupEnum("DOTAJoinLobbyResult").values.DOTA_JOIN_RESULT_SUCCESS) {
            callback(null, practiceLobbyJoinResponse);
        } else {
            callback(practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
        }
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyJoinResponse] = onPracticeLobbyJoinResponse;

var onPracticeLobbyListResponse = function onPracticeLobbyListResponse(message, callback) {
    var practiceLobbyListResponse = Dota2.schema.lookupType("CMsgPracticeLobbyListResponse").decode(message);

    this.Logger.debug("Received practice lobby list response " + practiceLobbyListResponse);
    this.emit("practiceLobbyListData", practiceLobbyListResponse);
    if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyListResponse] = onPracticeLobbyListResponse;

var onPracticeLobbyResponse = function onPracticeLobbyResponse(message, callback) {
    var practiceLobbyResponse = Dota2.schema.lookupType("CMsgGenericResult").decode(message);

    this.Logger.debug("Received create/flip/shuffle/kick/launch/leave response " + JSON.stringify(practiceLobbyResponse));
    this.emit("practiceLobbyResponse", practiceLobbyResponse.result, practiceLobbyResponse);
    
    if (callback) {
        if (practiceLobbyResponse.result === 1) {
            callback(null, practiceLobbyResponse); 
        } else {
            callback(practiceLobbyResponse.result, practiceLobbyResponse); 
        }
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPracticeLobbyResponse] = onPracticeLobbyResponse;

var onFriendPracticeLobbyListResponse = function onFriendPracticeLobbyListResponse(message, callback) {
    var practiceLobbyListResponse = Dota2.schema.lookupType("CMsgFriendPracticeLobbyListResponse").decode(message);

    this.Logger.debug("Received friend practice lobby list response " + JSON.stringify(practiceLobbyListResponse));
    this.emit("friendPracticeLobbyListData", practiceLobbyListResponse);
    if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCFriendPracticeLobbyListResponse] = onFriendPracticeLobbyListResponse;

var onInviteCreated = function onInviteCreated(message) {
    var inviteCreated = Dota2.schema.lookupType("CMsgInvitationCreated").decode(message);
    var is_online = !inviteCreated.user_offline;

    if (this.debug && is_online) util.log("Created invitation to online user " + inviteCreated.steam_id);
    if (this.debug && !is_online) util.log("Created invitation to offline user " + inviteCreated.steam_id);
    this.emit("inviteCreated", inviteCreated.steam_id, inviteCreated.group_id, is_online);
}
handlers[Dota2.schema.lookupEnum("EGCBaseMsg").values.k_EMsgGCInvitationCreated] = onInviteCreated;

