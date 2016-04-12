var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    crypto = require("crypto"),
    dota2 = require("dota2"),
    steamClient = new steam.SteamClient(),
    steamUser = new steam.SteamUser(steamClient),
    steamFriends = new steam.SteamFriends(steamClient),
    Dota2 = new dota2.Dota2Client(steamClient, true);

// Load config
global.config = require("./config");

/* Steam logic */
var onSteamLogOn = function onSteamLogOn(logonResp) {
        if (logonResp.eresult == steam.EResult.OK) {
            steamFriends.setPersonaState(steam.EPersonaState.Busy); // to display your steamClient's status as "Online"
            steamFriends.setPersonaName("Not a Bot2"); // to change its nickname
            util.log("Logged on.");
            Dota2.launch();
            Dota2.on("ready", function() {
                console.log("Node-dota2 ready.");
				
				Dota2.requestMatchMinimalDetails(2289166740);
                Dota2.on("matchMinimalDetailsData", function (matchId, matchData) {
					console.log('Successfully received match minimal data');
					fs.writeFileSync('zz_matchMinimalData.txt', JSON.stringify(matchData, null, 2));
					console.log(JSON.stringify(matchData));
                });
                
            });
            Dota2.on("unready", function onUnready() {
                console.log("Node-dota2 unready.");
            });
            Dota2.on("chatMessage", function(channel, personaName, message) {
                // util.log([channel, personaName, message].join(", "));
            });
            Dota2.on("guildInvite", function(guildId, guildName, inviter) {
                // Dota2.setGuildAccountRole(guildId, 75028261, 3);
            });
            Dota2.on("unhandled", function(kMsg) {
                util.log("UNHANDLED MESSAGE " + kMsg);
            });
            // setTimeout(function(){ Dota2.exit(); }, 5000);
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
    fs.writeFileSync('sentry', hashedSentry);
    util.log("sentryfile saved");
    callback({
        sha_file: hashedSentry
    });
});


// Login, only passing authCode if it exists
var logOnDetails = {
    "account_name": global.config.steam_user,
    "password": global.config.steam_pass,
};
if (global.config.steam_guard_code) logOnDetails.auth_code = global.config.steam_guard_code;

try {
    var sentry = fs.readFileSync('sentry');
    if (sentry.length) logOnDetails.sha_sentryfile = sentry;
} catch (beef) {
    util.log("Cannae load the sentry. " + beef);
}

steamClient.connect();
steamClient.on('connected', function() {
    steamUser.logOn(logOnDetails);
});
steamClient.on('logOnResponse', onSteamLogOn);
steamClient.on('loggedOff', onSteamLogOff);
steamClient.on('error', onSteamError);
steamClient.on('servers', onSteamServers);
