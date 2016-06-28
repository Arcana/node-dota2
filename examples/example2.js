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
        steamFriends.setPersonaName("Dota 2 Bot");
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
                    Dota2.sendMessage(chatChannel, "Hello, guys! I'm Dota 2 Bot.");
                }, 1000);
            }

            if(leavingChannel == 1){
                setTimeout(function(){
                    Dota2.leaveChat(chatChannel);
                }, 10000);
            }

            // ----------------------------------

            // COMMUNITY

            var accId = 63470426;
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

            var CheckMatchID = 1944132605;
            var checkingMatch = 0;

            if(checkingMatch == 1){
                Dota2.requestMatchDetails(CheckMatchID, function(err, data){
                    util.log(JSON.stringify(data));
                });
            }

            // ----------------------------------

            // LOBBY

            var creatingLobby = 0;
            var leavingLobby = 0;

            if(creatingLobby == 1){ // sets only password, nothing more
                var lobbyPassword = "ap";
                var properties = {
                    "game_name": "MyLobby",
                    "server_region": 3,
                    "game_mode": 2,
                    "series_type": 2,
                    "game_version": 1,
                    "allow_cheats": false,
                    "fill_with_bots": false,
                    "allow_spectating": true,
                    "pass_key": lobbyPassword,
                    "radiant_series_wins": 0,
                    "dire_series_wins": 0,
                    "allchat": true
                }

                Dota2.createPracticeLobby(lobbyPassword, properties, function(err, data){
                    // util.log(JSON.stringify(data));
                });
            }

            if(leavingLobby == 1){
                setTimeout(function(){
                    Dota2.leavePracticeLobby(function(err, data){
                        // util.log(JSON.stringify(data));
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
            
        });

        Dota2.on("unready", function onUnready() {
            util.log("Node-dota2 unready.");
        });

        Dota2.on("chatMessage", function(channel, personaName, message) {
            util.log("[" + channel + "] " + personaName + ": " + message);
        });

        Dota2.on("unhandled", function(kMsg) {
            util.log("UNHANDLED MESSAGE #" + kMsg);
        });
    }
},
onSteamServers = function onSteamServers(servers) {
    util.log("Received servers.");
    fs.writeFile('servers', JSON.stringify(servers));
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
