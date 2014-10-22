var steam = require('steam');
var fs = require('fs');
var dota2 = require('../');
var bot = new steam.SteamClient();
var Dota2 = new dota2.Dota2Client(bot, true);
var util = require('util');
var bignumber = require('bignumber.js');

// if we've saved a server list, use it
if (fs.existsSync('servers')) {
	  steam.servers = JSON.parse(fs.readFileSync('servers'));
}

bot.on('debug', console.log);

//log on the steam network
global.config = require('../../config');
var logOnDetails = {
	'accountName': config.steam_user,
	'password': config.steam_pass
};

if (fs.existsSync('../../sentry/'+logOnDetails.accountName)) 
	logOnDetails.shaSentryfile = fs.readFileSync('../../sentry/' + logOnDetails.accountName);
else if(config.steam_guard_code !='')
	logOnDetails.authCode = config.steam_guard_code;
	
bot.logOn(logOnDetails);

bot.on('loggedOn', function() {
	util.log('Logged on as '+Dota2.ToAccountID(bot.steamID));
	bot.setPersonaState(steam.EPersonaState.Busy);
	//to display your bot's status as 'Online'
	//bot.setPersonaName('BOT<Deep Blue>');
	// to change its nickname
  //bot.joinChat('103582791434333751');
	// the group's SteamID as a string
	Dota2.launch();
        Dota2.on('ready', function() {
            console.log('Node-dota2 ready.');
            console.log('AccountID: '+ Dota2.AccountID);
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
            // Dota2.on('matchData', function (matchId, matchData) {
            //     console.log(JSON.stringify(matchData, null, 2));
            // });
            // Dota2.matchmakingStatsRequest();
            // Dota2.on('matchmakingStatsData', function(waitTimesByGroup, searchingPlayersByGroup, disabledGroups, matchmakingStatsResponse) {
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
            // Dota2.on('profileData', function (accountId, profileData) {
            //     console.log(JSON.stringify(profileData, null, 2));
            // });
            // Dota2.passportDataRequest(28956443);
            // Dota2.on('passportData', function (accountId, passportData) {
            //     console.log(passportData.leagueGuesses.stampedPlayers);
            // });
            // Dota2.hallOfFameRequest();
            // Dota2.on('hallOfFameData', function(week, featuredPlayers, featuredFarmer, hallOfFameResponse) {
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
             Dota2.joinChat('China');
             setTimeout(function(){
             	//while(true){
             setTimeout(function(){ Dota2.sendMessage('China', 'Hello China'); }, 2400);
           //}
         }, 5000); 
             setTimeout(function(){ Dota2.leaveChat('China'); }, 10000);

            /* GUILD */
            // Dota2.requestGuildData();
            // Dota2.on('guildOpenPartyData', function(guildId, openParties){
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
                // var guildChannelName = util.format('Guild_%s', guildId);
                // Dota2.joinChat(guildChannelName, dota2.DOTAChatChannelType_t.DOTAChannelType_Guild);

                // setTimeout(function(){ Dota2.sendMessage(guildChannelName, 'wowoeagnaeigniaeg'); }, 5000);
                // setTimeout(function(){ Dota2.leaveChat(guildChannelName); }, 10000);
            // });

            /* LOBBIES */
            // Dota2.createPracticeLobby('Techies cheese', 'boop', Dota2.ServerRegion.PERFECTWORLDTELECOM, Dota2.GameMode.DOTA_GAMEMODE_AR, function(err, body){
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
            // Dota2.on('leaguesInMonthResponse',  function(err, data) {
            //     console.log('Found ' + data.leagues.length + ' leagues full of schedule data :D');
            // });

            /* SOURCETV */
            // Dota2.findSourceTVGames({}, function(data) {    // May 2015
            //   console.log('Successfully received SourceTVGames: ' + data.games);
            // })


        });

        Dota2.on('unready', function onUnready(){
            console.log('Node-dota2 unready.');
        });

        Dota2.on('chatMessage', function(channel, personaName, message) {
             util.log([channel, personaName, message].join(', '));
        });

        Dota2.on('guildInvite', function(guildId, guildName, inviter) {
            // Dota2.setGuildAccountRole(guildId, 75028261, 3);
        });


        Dota2.on('unhandled', function(kMsg) {
            util.log('UNHANDLED MESSAGE ' + kMsg);
        });
        // setTimeout(function(){ Dota2.exit(); }, 5000);
	//console.log('users: %j',  bot.users); 
});

//save sentry file
bot.on('sentry', function(sentryHash){
	fs.writeFile('../sentry/'+logOnDetails.accountName, sentryHash, function(err){
		if(err){
		console.log(err);
		}
		else{
		console.log('Saved sentry file hash as "../sentry/'+logOnDetails.accountName+'"');
		}
	});
});

bot.on('servers', function(servers) {
	fs.writeFile('servers', JSON.stringify(servers));
});
