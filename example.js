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
            var playerInfo = 0;
            var playerInfo2 = 0;
            var playerInfo3 = 0;

            if(playerInfo == 1){ // not working - maybe disabled by Valve
                Dota2.requestProfile(accId, true);
                Dota2.on("profileData", function (accId, data) {
                    util.log(JSON.stringify(data));
                });
            }

            if(playerInfo2 == 1){
                Dota2.requestProfileCard(accId, function (accId, data) {
                    util.log(JSON.stringify(data));
                });
            }

            if(playerInfo3 == 1){
                Dota2.requestPassportData(accId, function (accId, data) {
                    util.log(JSON.stringify(data));
                });
            }

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
                var lobbyName = "Lobby Name";

                Dota2.createPracticeLobby(lobbyPassword, lobbyName, function(err, data){
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
    fs.writeFileSync('sentry', sentry.bytes)
    util.log("sentryfile saved");

    callback({ sha_file: crypto.createHash('sha1').update(sentry.bytes).digest() });
});

var logOnDetails = {
    "account_name": global.config.steam_user,
    "password": global.config.steam_pass,
};

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