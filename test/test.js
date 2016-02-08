var steam = require("steam"),
	dota2 = require("../"),
	steamClient = new steam.SteamClient(),
	steamUser = new steam.SteamUser(steamClient),
	Dota2 = new dota2.Dota2Client(steamClient, true, true),
	should = require('should');
	
	// Test data
	var GABE_STEAM_ID = '76561197960287930',
	GABE_ACCOUNT_ID = '22202';
    
	// App states, will be used to delay certain tests until conditions are met.
	var connectedToSteam = false,
		loggedInToSteam = false,
		connectedToDota2 = false;
	
	// Delays for certain states
	var beConnectedToSteam = function(done) {
		if (connectedToSteam) {
			return done();
		}
		
		setTimeout(function() {
			beConnectedToSteam(done);
		}, 1000);
	}
	
	var beLoggedInToSteam = function(done) {
		if (loggedInToSteam) {
			return done();
		}
		
		setTimeout(function() {
			beLoggedInToSteam(done);
		}, 1000);
	};
	
	var beConnectedToDota2 = function(done) {
		if (connectedToDota2) {
			return done();
		}
		
		setTimeout(function() {
			beConnectedToDota2(done);
		}, 1000);
	};
	
	// Test functions
	var connectToSteam = function(done) {
		steamClient.connect();
		steamClient.on('connected', function() {
			connectedToSteam = true;
			done();
		});
	};
	
	var loginToSteam = function(done) {
		steamUser.logOn({
			"account_name": process.env.STEAM_USERNAME,
			"password": process.env.STEAM_PASSWORD,
		});
		
		steamClient.on('logOnResponse', function onSteamLogOn(logonResp) {
			if (logonResp.eresult == steam.EResult.OK) {
				loggedInToSteam = true;
				done();
			} else {
				console.log(logonResp);
			}
		});
	};
 
	var connectToDota2 = function(done) {
		Dota2.launch();
		Dota2.on("ready", function() {
			connectedToDota2 = true;
			done();
		});
	};
	
	var convertSteamIDToAccountID = function() {
		var calculated_account_id = Dota2.ToAccountID(GABE_STEAM_ID);
		should(calculated_account_id.toString()).equal(GABE_ACCOUNT_ID);
	};
	
	var convertAccountIDToSteamID = function() {
		var calculated_steam_id = Dota2.ToSteamID(GABE_ACCOUNT_ID);
		should(calculated_steam_id.toString()).equal(GABE_STEAM_ID);
	};
 
	// Tests
	describe('Steam', function() {
		this.timeout(10000); // 10s timeout because Steam is slooooooooow
		
		describe('#connect', function() {
			it('should connect to Steam', connectToSteam);
		});
		
		describe('#login', function() {
			before(beConnectedToSteam);
			it('should login to Steam', loginToSteam);
		});
	});
	
	describe('Dota2', function() {
		this.timeout(10000); // 10s timeout because Steam is slooooooooow
		
		// Check we're connected to Steam before running these tests
		before(beConnectedToSteam);
		before(beLoggedInToSteam);
		
		describe('Core', function() {
			describe('#launch', function() {
				it('should connect to Dota2 GC (recv \'ready\' event', connectToDota2);
			});
			
			describe('#exit', function() {
				// TODO: Not sure how we test this. Need to run it after all the other tests too.
				it('should disconnect from Dota2 GC');
			});
		});
		
		describe('Utilities', function() {
			describe('#ToAccountID', function() {
				it('should convert a 64-bit Steam ID into a 32-bit account ID', convertSteamIDToAccountID);
			});
			
			describe('#ToSteamID', function() {
				it('should convert a 32-bit account ID into a 64-bit Steam ID ', convertAccountIDToSteamID);
			});
		});
		
		describe('Inventory', function() {
			// TODO: No idea how we test these.
			describe('#setItemPositions', function() {
				it('should move the given items to the given positions');
			});
			
			describe('#deleteItem', function() {
				it('should delete the given item');
			});
		});
		
		describe('Chat', function() {
			describe('#joinChat', function() {
				it('should join a chat channel'); // TODO
			});
			
			describe('#leaveChat', function() {
				it('should leave a chat channel'); // TODO
			});
			
			describe('#sendMessage', function() {
				it('should a message to a chat channel'); // TODO
			});
			
			describe('#requestChatChannels', function() {
				it('should fetch a list of chat channels from the GC'); // TODO
			});
		});
		
		describe('Guild', function() {
			describe('#requestGuildData', function() {
				it('should return a list of guid IDs and a list of any open parties they have'); // TODO
			});
			
			describe('#inviteToGuild', function(){
				it('should invite an account to join a guild'); // TODO
			});
			
			describe('#cancelInviteToGuild', function(){
				it('should cancel a pending guild invitation'); // TODO
			});
			
			describe('#setGuildAccountRole', function(){
				it('should set a given account\'s role within a guild'); // TODO
			});
		});
		
		describe('Community', function() {
			describe('#requestPlayerMatchHistory', function(){
				it('should fetch a paginated and filtered list of a player\'s matches'); // TODO
			});
			
			describe('#requestProfile', function(){
				it('should fetch an account\'s profile'); // TODO
			});
			
			describe('#requestProfileCard', function(){
				it('should fetch an account\'s profile card'); // TODO
			});
			
			describe('#requestPassportData', function(){
				it('should fetch an account\'s passport (compendium) data'); // TODO
			});
			
			describe('#requestHallOfFame', function(){
				it('should fetch a given weeks hall of fame data'); // TODO
			});
		});
		
		describe('Matches', function() {
			describe('#requestMatches', function(){
				it('should fetch a list of matches matching the given search criteria'); // TODO
			});
			
			describe('#requestMatchDetails', function(){
				it('should fetch data on a given match id'); // TODO
			});
			
			describe('#requestMatchmakingStats', function(){
				it('should fetch some data on the current state of matchmaking'); // TODO
			});
		});
		
		describe('Parties', function() {
			describe('#respondPartyInvite', function(){
				it('should respond to an incoming party invite'); // TODO
			});
			
			describe('#inviteToParty', function(){
				it('should invite a given account ID to a party'); // TODO
			});
			
			describe('#kickFromParty', function(){
				it('should kick a given user from a party'); // TODO
			});
			
			describe('#setPartyCoach', function(){
				it('should set the node-dota2 instance to be this party\'s coach'); // TODO
			});
			
			describe('#leaveParty', function(){
				it('should leave the party'); // TODO
			});
		});
		
		describe('Lobbies', function() {
			describe('#joinPracticeLobby', function(){
				it('should join a lobby with the given id'); // TODO
			});
			
			describe('#createPracticeLobby', function(){
				it('should create a lobby'); // TODO
			});
			
			describe('#createTournamentLobby', function(){
				it('should create a tournament lobby'); // TODO
			});
			
			describe('#balancedShuffleLobby', function(){
				it('should shuffle the teams within the lobby'); // TODO
			});
			
			describe('#flipLobbyTeams', function(){
				it('should flip the teams within the lobby'); // TODO
			});
			
			describe('#configPracticeLobby', function(){
				it('should (re)configure the lobby'); // TODO
			});
			
			describe('#launchPracticeLobby', function(){
				it('should launch the lobby and begin a match'); // TODO
			});
			
			describe('#inviteToLobby', function(){
				it('should invite the given account to a lobby'); // TODO
			});
			
			describe('#practiceLobbyKick', function(){
				it('should kick a given account from a lobby'); // TODO
			});
			
			describe('#leavePracticeLobby', function(){
				it('should leave a lobby'); // TODO
			});
			
			describe('#requestPracticeLobbyList', function(){
				it('should do something'); // TODO
			});
			
			describe('#requestFriendPractiseLobbyList', function(){
				it('should do something'); // TODO
			});
		});
		
		describe('Leagues', function() {
			describe('#requestLeaguesInMonth', function(){
				it('should fetch data on leages being played in the given month'); // TODO
			});
			
			describe('#requestLeagueInfo', function(){
				it('should fetch data on all official leagues'); // TODO
			});
		});
		
		describe('SourceTV', function() {
			describe('#requestSourceTVGames', function(){
				it('should fetch a list of ongoing matches matching the search criteria'); // TODO
			});
		});
	});
