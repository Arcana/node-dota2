var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    crypto = require("crypto"),
    dota2 = require("../"),
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
            steamFriends.setPersonaName("dhdeubot"); // to change its nickname
            util.log("Logged on.");
            Dota2.launch();
            Dota2.on("ready", function() {
                console.log("Node-dota2 ready.");
                /* Note:  Should not declare new event listeners nested inside of
                'ready', else you could end up with duplicated handlers if 'ready'
                is fired multiple times.  Exception is made within this test file
                for the same of keeping relevant samples together. */
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
                Dota2.matchDetailsRequest(246546269, function(err, body) {
                    if (err) throw err;
                    console.log(JSON.stringify(body));
                });
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
                Dota2.profileRequest(28956443, true, function(err, body) {
                    if (err) throw err;
                    console.log(JSON.stringify(body));
                });
                // Dota2.passportDataRequest(28956443, function(err, body) {
                //     console.log(JSON.stringify(body));
                // });
                // Dota2.hallOfFameRequest(null, function(err, body){
                //     console.log(JSON.stringify(body));
                // });
                /* CHAT */
                // Event based
                // Dota2.joinChat("rj");
                // setTimeout(function(){ Dota2.sendMessage("rj", "wowoeagnaeigniaeg"); }, 5000);
                // setTimeout(function(){ Dota2.leaveChat("rj"); }, 10000);
                /* GUILD */
                // Dota2.requestGuildData();
                // Dota2.on("guildOpenPartyData", function(guildId, openParties){
                // Event based
                // Dota2.inviteToGuild(guildId, 28956443);
                // Dota2.setGuildAccountRole(guildId, 28956443, 2);
                // Dota2.cancelInviteToGuild(guildId, 75028261);
                // Callback based
                // Dota2.inviteToGuild(guildId, 28956443, function(err, body){
                //     console.log(JSON.stringify(body));
                // });
                // Dota2.cancelInviteToGuild(guildId, 75028261, function(err, body){
                //     console.log(JSON.stringify(body));
                // });
                // Dota2.setGuildAccountRole(guildId, 28956443, 2, function(err, body){
                //     console.log(JSON.stringify(body));
                // });
                // Doing chat stuffs.
                // var guildChannelName = util.format("Guild_%s", guildId);
                // Dota2.joinChat(guildChannelName, dota2.DOTAChatChannelType_t.DOTAChannelType_Guild);
                // setTimeout(function(){ Dota2.sendMessage(guildChannelName, "wowoeagnaeigniaeg"); }, 5000);
                // setTimeout(function(){ Dota2.leaveChat(guildChannelName); }, 10000);
                // });
                /* LOBBIES */
                // Dota2.createPracticeLobby("Techies cheese", "boop", Dota2.ServerRegion.PERFECTWORLDTELECOM, Dota2.GameMode.DOTA_GAMEMODE_AR, function(err, body){
                //     console.log(JSON.stringify(body));
                // });
                // setTimeout(function(){
                //     Dota2.leavePracticeLobby(function(err, body){
                //         console.log(JSON.stringify(body));
                //     });
                // }, 60000);
                /* LEAGUES */
                // Dota2.leaguesInMonthRequest(10, 2013, function(err, data) { // November 2013
                //     console.log('Found ' + data.leagues.length + ' leagues full of schedule data :D');
                // });
                // Dota2.leaguesInMonthRequest(10, 2013); // November 2013
                // Dota2.on("leaguesInMonthResponse",  function(err, data) {
                //     console.log('Found ' + data.leagues.length + ' leagues full of schedule data :D');
                // });
                /* SOURCETV */
                // Dota2.findSourceTVGames({}, function(data) {    // May 2015
                //   console.log('Successfully received SourceTVGames: ' + data.games);
                // })
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
        fs.writeFileSync('sentry', sentry.bytes)
        util.log("sentryfile saved");
    callback({ sha_file: crypto.createHash('sha1').update(sentry.bytes).digest() });
});


// Login, only passing authCode if it exists
var logOnDetails = {
    "account_name": global.config.steam_user,
    "password": global.config.steam_pass,
};
if (global.config.steam_guard_code) logOnDetails.authCode = global.config.steam_guard_code;
var sentry = fs.readFileSync('sentry');
if (sentry.length) logOnDetails.shaSentryfile = sentry;

steamClient.connect();
steamClient.on('connected', function() {
  steamUser.logOn(logOnDetails);
});
steamClient.on('logOnResponse', onSteamLogOn);
steamClient.on('loggedOff', onSteamLogOff);
steamClient.on('error', onSteamError);
steamClient.on('servers', onSteamServers);
