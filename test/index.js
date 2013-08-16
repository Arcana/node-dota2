var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    dota2 = require("../"),
    bot = new steam.SteamClient(),
    Dota2 = new dota2.Dota2Client(bot, true);

global.config = require("./config");

/* Steam logic */
var onSteamLogOn = function onSteamLogOn(){
        bot.setPersonaState(steam.EPersonaState.Busy); // to display your bot's status as "Online"
        bot.setPersonaName(config.steam_name); // to change its nickname
        util.log("Logged on.");

        Dota2.launch();
        Dota2.on("ready", function() {

            /* INVENTORY */
            // Dota2.setItemPositions([[ITEM ID, POSITION]]);
            // Dota2.deleteItem(ITEM ID);

            /* MATCHES */
                // Event based
            // Dota2.matchDetailsRequest(246546269);
            // Dota2.on("matchData", function (matchId, matchData) {
            //     console.log(JSON.stringify(matchData, null, 2));
            // });
            // Dota2.matchmakingStatsRequest();
            // Dota2.on("matchmakingStatsData", function(waitTimesByGroup, searchingPlayersByGroup, disabledGroups, matchmakingStatsResponse) {
            //     console.log(JSON.stringify(matchmakingStatsResponse, null, 2));
            // });

                // Callback based
            // Dota2.matchDetailsRequest(246546269, function(err, body){
            //     if (err) console.log(err);
            //     console.log(JSON.stringify(body));
            // });

            /* COMMUNITY */
                // Event based
            // Dota2.profileRequest(28956443, true);
            // Dota2.on("profileData", function (accountId, profileData) {
            //     console.log(JSON.stringify(profileData, null, 2));
            // });
            // Dota2.passportDataRequest(28956443);
            // Dota2.on("passportData", function (accountId, passportData) {
            //     console.log(passportData.leagueGuesses.stampedPlayers);
            // });
            // Dota2.hallOfFameRequest();
            // Dota2.on("hallOfFameData", function(week, featuredPlayers, featuredFarmer, hallOfFameResponse) {
            //     console.log(JSON.stringify(hallOfFameResponse, null, 2));
            // });

                // Callback based
            // Dota2.profileRequest(28956443, true, function(err, body){
            //     console.log(JSON.stringify(body));
            // });
            // Dota2.passportDataRequest(28956443, function(err, body){
            //     console.log(JSON.stringify(body));
            // });
            // Dota2.hallOfFameRequest(null, function(err, body){
            //     console.log(JSON.stringify(body));
            // });

            /* CHAT */
                // Event based
            // Dota2.joinChat("wobwobwob");
            // setTimeout(function(){ Dota2.sendMessage("wobwobwob", "wowoeagnaeigniaeg"); }, 5000);
            // setTimeout(function(){ Dota2.leaveChat("wobwobwob"); }, 10000);

            /* GUILD */
                // Event based
            // Dota2.inviteToGuild(5287, 28956443);
            // Dota2.setGuildAccountRole(5287, 28956443, 2);
            // Dota2.cancelInviteToGuild(5287, 75028261);

                // Callback based
            // Dota2.inviteToGuild(5287, 28956443, function(err, body){
            //     console.log(JSON.stringify(body));
            // });
            // Dota2.cancelInviteToGuild(5287, 75028261, function(err, body){
            //     console.log(JSON.stringify(body));
            // });
            // Dota2.setGuildAccountRole(5287, 28956443, 2, function(err, body){
            //     console.log(JSON.stringify(body));
            // });

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
    },
    onSteamSentry = function onSteamSentry(sentry) {
        util.log("Received sentry.");
        require('fs').writeFileSync('sentry', sentry);
    },
    onSteamServers = function onSteamServers(servers) {
        util.log("Received servers.");
        fs.writeFile('servers', JSON.stringify(servers));
    },
    onWebSessionID = function onWebSessionID(webSessionID) {
        util.log("Received web session id.");
        // steamTrade.sessionID = webSessionID;
        bot.webLogOn(function onWebLogonSetTradeCookies(cookies) {
            util.log("Received cookies.");
            for (var i = 0; i < cookies.length; i++) {
                // steamTrade.setCookie(cookies[i]);
            }
        });
    };

bot.logOn({
    "accountName": config.steam_user,
    "password": config.steam_pass,
    "authCode": config.steam_guard_code,
    "shaSentryfile": fs.readFileSync('sentry')
});
bot.on("loggedOn", onSteamLogOn)
    .on('sentry', onSteamSentry)
    .on('servers', onSteamServers)
    .on('webSessionID', onWebSessionID);