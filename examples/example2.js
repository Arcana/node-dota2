var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    crypto = require("crypto"),
    dota2 = require("../"),
    steamClient = new steam.SteamClient(),
    steamUser = new steam.SteamUser(steamClient),
    steamFriends = new steam.SteamFriends(steamClient),
    Dota2 = new dota2.Dota2Client(steamClient, true);

global.config = require("./config");

var onSteamLogOn = function onSteamLogOn(logonResp) {
    if (logonResp.eresult == steam.EResult.OK) {
        steamFriends.setPersonaState(steam.EPersonaState.Busy);
        steamFriends.setPersonaName(global.config.steam_name);
        util.log("Logged on.");

        Dota2.launch();
        Dota2.on("ready", function() {
            util.log("Node-dota2 ready.");

            // CHAT

            var chatChannel = "dota2bot";
            var joiningChannel = 0;
            var leavingChannel = 0;

            if(joiningChannel == 1){
                Dota2.joinChat(chatChannel);
                setTimeout(function(){
                    Dota2.sendMessage("Hello, guys! I'm Dota 2 Bot.", chatChannel);
                }, 1000);
            }

            if(leavingChannel == 1){
                setTimeout(function(){
                    Dota2.leaveChat(chatChannel);
                }, 10000);
            }

            // ----------------------------------

            // COMMUNITY

            var accId = 103637655;
            // var playerInfo = 0;
            var playerInfo2 = 0;
            // var playerInfo3 = 0;

            // if(playerInfo == 1){ // not working - maybe disabled by Valve
            //     Dota2.requestProfile(accId, true);
            //     Dota2.on("profileData", function (accId, data) {
            //         util.log(JSON.stringify(data));
            //     });
            // }

            if(playerInfo2 == 1){
                Dota2.requestProfileCard(accId, function (accId, data) {
                    util.log(JSON.stringify(data));
                });
            }

            // if(playerInfo3 == 1){
            //     Dota2.requestPassportData(accId, function (accId, data) {
            //         util.log(JSON.stringify(data));
            //     });
            // }

            // ----------------------------------

            // MATCH

            // Request the details of a certain match
            var CheckMatchID = 1944132605;
            var checkingMatch = 0;

            if(checkingMatch == 1){
                Dota2.requestMatchDetails(CheckMatchID, function(err, data){
                    util.log(JSON.stringify(data));
                });
            }
            
            // Request the 50 most recent matches
            var checkingMatches = 0;
            if(checkingMatches == 1){
                Dota2.requestMatches({
                    "matches_requested": 25,
                    "tournament_games_only": false,
                    "skill": 1
                }, (result,response) => {
                    response.matches.map(match => console.log(""+match.match_id));
                    var lastID = response.matches[24].match_id - 1;
                    Dota2.requestMatches({
                        "matches_requested": 25,
                        "start_at_match_id": lastID,
                        "tournament_games_only": false,
                        "skill": 1
                    }, (result, response)=>{
                        response.matches.map(match => console.log(""+match.match_id));
                    });
                });
            }

            // ----------------------------------

            // LOBBY

            var creatingLobby = 0;
            var leavingLobby = 0;
            var destroyLobby = 0;
            var lobbyChannel = "";

            if(creatingLobby == 1){ // sets only password, nothing more
                var properties = {
                    "game_name": "MyLobby",
                    "server_region": dota2.ServerRegion.EUROPE,
                    "game_mode": dota2.schema.lookupEnum('DOTA_GameMode').values.DOTA_GAMEMODE_CM,
                    "series_type": dota2.SeriesType.BEST_OF_THREE,
                    "game_version": 1,
                    "allow_cheats": false,
                    "fill_with_bots": false,
                    "allow_spectating": true,
                    "pass_key": "ap",
                    "radiant_series_wins": 0,
                    "dire_series_wins": 0,
                    "allchat": true
                }

                Dota2.createPracticeLobby(properties, function(err, data){
                    if (err) {
                        util.log(err + ' - ' + JSON.stringify(data));
                    }
                });
                Dota2.on("practiceLobbyUpdate", function(lobby) {
                    Dota2.practiceLobbyKickFromTeam(Dota2.AccountID);
                    lobbyChannel = "Lobby_"+lobby.lobby_id;
                    Dota2.joinChat(lobbyChannel, dota2.schema.lookupEnum('DOTAChatChannelType_t').values.DOTAChannelType_Lobby);
                });
            }

            if(leavingLobby == 1){
                setTimeout(function(){
                    Dota2.leavePracticeLobby(function(err, data){
                        if (!err) {
                            Dota2.abandonCurrentGame();
                            if(lobbyChannel) Dota2.leaveChat(lobbyChannel);
                        } else {
                            util.log(err + ' - ' + JSON.stringify(data));
                        }
                    });
                }, 10000);
            }

            if(destroyLobby == 1){
                setTimeout(function(){
                    Dota2.destroyLobby(function(err, data){
                        if (err) {
                            util.log(err + ' - ' + JSON.stringify(data));
                        } else {
                            if(lobbyChannel) Dota2.leaveChat(lobbyChannel);
                        }
                    });
                }, 10000);
            }
            
            // ----------------------------------
            
            // TEAM
            
            var myTeamInfo = 0;
            
            if (myTeamInfo == 1) {
                Dota2.requestMyTeams(function(err, data){
                    util.log(JSON.stringify(data));
                });
            }
            
            // ----------------------------------
            
            // SOURCETV
            
            var sourceGames = 0;
            
            if (sourceGames == 1) {
                Dota2.requestSourceTVGames();
                Dota2.on('sourceTVGamesData', (gamesData) => {
                    util.log(gamesData);
                });
            }
            
            // ----------------------------------
            
            // FANTASY
            
            var fantasyCards = 0;
            
            if (fantasyCards == 1) {
                Dota2.on("inventoryUpdate", inventory => {
                    // Time-out so inventory property is updated
                    setTimeout(()=>{
                        Promise.all(Dota2.requestPlayerCardsByPlayer()).then(cards => {
                            fs.writeFileSync('cards.js',JSON.stringify(cards));
                        });
                    }, 10000);
                });
            }
        });

        Dota2.on("unready", function onUnready() {
            util.log("Node-dota2 unready.");
        });

        Dota2.on("chatMessage", function(channel, personaName, message) {
            util.log("[" + channel + "] " + personaName + ": " + message);
        });

        Dota2.on("unhandled", function(kMsg) {
            util.log("UNHANDLED MESSAGE " + dota2._getMessageName(kMsg));
        });
    }
},
onSteamServers = function onSteamServers(servers) {
    util.log("Received servers.");
    fs.writeFile('servers', JSON.stringify(servers), (err) => {
        if (err) {if (this.debug) util.log("Error writing ");}
        else {if (this.debug) util.log("");}
    });
},
onSteamLogOff = function onSteamLogOff(eresult) {
    util.log("Logged off from Steam.");
},
onSteamError = function onSteamError(error) {
    util.log("Connection closed by server.");
};

steamUser.on('updateMachineAuth', function(sentry, callback) {
    var hashedSentry = crypto.createHash('sha1').update(sentry.bytes).digest();
    fs.writeFileSync('sentry', hashedSentry)
    util.log("sentryfile saved");

    callback({ sha_file: hashedSentry});
});

var logOnDetails = {
    "account_name": global.config.steam_user,
    "password": global.config.steam_pass,
};
if (global.config.steam_guard_code) logOnDetails.auth_code = global.config.steam_guard_code;
if (global.config.two_factor_code) logOnDetails.two_factor_code = global.config.two_factor_code;

try {
    var sentry = fs.readFileSync('sentry');
    if (sentry.length) logOnDetails.sha_sentryfile = sentry;
}
catch (beef){
    util.log("Cannot load the sentry. " + beef);
}

steamClient.connect();

steamClient.on('connected', function() {
    steamUser.logOn(logOnDetails);
});

steamClient.on('logOnResponse', onSteamLogOn);
steamClient.on('loggedOff', onSteamLogOff);
steamClient.on('error', onSteamError);
steamClient.on('servers', onSteamServers);
