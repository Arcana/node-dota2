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
	
	var invertKMsgTypeID = function() {
		var msg_type_id = "k_EMsgClientToGCGetProfileCard";
		var calculated_msg_type_id = dota2._getMessageName(dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCGetProfileCard);
		should(calculated_msg_type_id).equal(msg_type_id);
	}
 
	// Tests
	describe('Steam', function() {
		this.timeout(20000); // 20s timeout because Steam is sooo slooooooooow
		
		describe('#connect', function() {
			it('should connect to Steam', connectToSteam);
		});
		
		describe('#login', function() {
			before(beConnectedToSteam);
			it('should login to Steam', loginToSteam);
		});
	});
	
	describe('Dota2', function() {
		this.timeout(20000); // 20s timeout because Steam is sooo slooooooooow
		
		// Check we're connected to Steam before running these tests
		before(beConnectedToSteam);
		before(beLoggedInToSteam);
		
		describe('Core', function () {
			describe('#launch', function () {
				it('should connect to Dota2 GC (recv \'ready\' event', connectToDota2);
			});
			
			describe('#exit', function () {
				// TODO: Not sure how we test this. Need to run it after all the other tests too.
				it('should disconnect from Dota2 GC');
			});
		});
		
		describe('Utilities', function () {
			describe('#ToTypeID', function () {
				it('should convert an enum to the corresponding message type ID ', invertKMsgTypeID);
			});
			
			describe('#ToAccountID', function () {
				it('should convert a 64-bit Steam ID into a 32-bit account ID', convertSteamIDToAccountID);
			});
			
			describe('#ToSteamID', function () {
				it('should convert a 32-bit account ID into a 64-bit Steam ID ', convertAccountIDToSteamID);
			});
		});
		
		describe('Inventory', function () {
			// TODO: No idea how we test these.
			describe('#setItemPositions', function () {
				it('should move the given items to the given positions');
			});
			
			describe('#deleteItem', function () {
				it('should delete the given item');
			});
		});
		
		describe('Chat', function () {
			describe('#joinChat', function () {
				it('should join a chat channel'); // TODO
			});
			
			describe('#leaveChat', function () {
				it('should leave a chat channel'); // TODO
			});
			
			describe('#sendMessage', function () {
				it('should a message to a chat channel'); // TODO
			});
			
			describe('#requestChatChannels', function () {
				it('should fetch a list of chat channels from the GC', function (done) {
					Dota2.on('chatChannelsData', function (channels) {
						should.exist(channels);
						should(channels.length).above(0);
						should.exist(channels[0].channel_name);
						channels[0].num_members.should.be.aboveOrEqual(0);
						should.exist(channels[0].channel_type);
						done();
					});
					Dota2.requestChatChannels();
				});
			});
		});
		
		// describe('Guild', function () {
		// 	describe('#requestGuildData', function () {
		// 		it('should return a list of guid IDs and a list of any open parties they have'); // TODO
		// 	});
			
		// 	describe('#inviteToGuild', function () {
		// 		it('should invite an account to join a guild'); // TODO
		// 	});
			
		// 	describe('#cancelInviteToGuild', function () {
		// 		it('should cancel a pending guild invitation'); // TODO
		// 	});
			
		// 	describe('#setGuildAccountRole', function () {
		// 		it('should set a given account\'s role within a guild'); // TODO
		// 	});
		// });
		
		describe('Community', function () {
			describe('#requestPlayerMatchHistory', function () {
				it('should fetch a paginated and filtered list of a player\'s matches', function (done) {
					Dota2.requestPlayerMatchHistory(parseInt(GABE_ACCOUNT_ID), null, function (err, data) {
						should.exist(data);
						should.exist(data.matches);
						data.matches.length.should.be.aboveOrEqual(0);
						done(err);
					});
				});
			});
			
			// describe('#requestProfile', function () {
			// 	it('should fetch an account\'s profile'); // TODO
			// });
			
			describe('#requestProfileCard', function (done){
				it('should fetch an account\'s profile card', function (done) {
					Dota2.requestProfileCard(parseInt(GABE_ACCOUNT_ID), function (err, data) {
	                    should.exist(data.account_id);
	                    done(err);
	                });	
				});
			});
			
			// describe('#requestPassportData', function () {
			// 	it('should fetch an account\'s passport (compendium) data'); // TODO
			// });
			
			describe('#requestHallOfFame', function () {
				it('should fetch a given weeks hall of fame data'); // TODO
			});
			
			describe('#requestPlayerStats', function () {
				it('should fetch a given player\'s stat data', function (done){
					Dota2.requestPlayerStats(parseInt(GABE_ACCOUNT_ID), function (err, data) {
						should.exist(data.account_id);
						data.account_id.should.equal(parseInt(GABE_ACCOUNT_ID));
						done(err);
					});
				});
			});
		});
		
		describe('Matches', function () {
			describe('#requestMatches', function () {
				it('should fetch a list of matches matching the given search criteria', function (done) {
					Dota2.requestMatches([], function(err, matchesData) {
						should.exist(matchesData);
						matchesData.total_results.should.be.aboveOrEqual(0);
						matchesData.results_remaining.should.be.aboveOrEqual(0);
						should.exist(matchesData.matches);
						done(err);
					});
				});
			});
			
			describe('#requestMatchMinimalDetails', function () {
				it ('should fetch a list of minimal match data corresponding to the given ids', done => {
					Dota2.requestMatchMinimalDetails([2466191302], function (err, data) {
						should.exist(data);
						should.exist(data.matches);
						should.exist(data.matches[0].match_id);
						data.matches[0].match_id.toString().should.be.eql('2466191302');
						should.exist(data.matches[0].match_outcome);
						should.exist(data.matches[0].players)
						data.matches[0].players.length.should.be.above(0);
						should.exist(data.matches[0].players[0].account_id);
						should.exist(data.matches[0].players[0].hero_id);
						should.exist(data.matches[0].players[0].kills);
						should.exist(data.matches[0].players[0].deaths);
						should.exist(data.matches[0].players[0].assists);
						should.exist(data.matches[0].players[0].items);
						should.exist(data.matches[0].players[0].player_slot);
						done(err);
					});
				});
			});
			
			describe('#requestMatchDetails', function () {
				it('should fetch data on a given match id', function(done){
					Dota2.requestMatchDetails(2038049617, function(err, details){
						should.exist(details.match.replay_salt);
						done(err);
					});
				});
			});
			
			describe('#requestMatchmakingStats', function () {
				it('should fetch some data on the current state of matchmaking', function(done){
					Dota2.on('matchmakingStatsData', function (version, match_groups, data) {
						should.exist(data.match_groups);
						should(match_groups.length).above(0);
						should.exist(match_groups[0].players_searching);
						should.exist(match_groups[0].status);
						done();
					});
					Dota2.requestMatchmakingStats();
				});
			});
		});
		
		describe('Parties', function () {
			describe('#respondPartyInvite', function () {
				it('should respond to an incoming party invite'); // TODO
			});
			
			describe('#inviteToParty', function () {
				it('should invite a given account ID to a party'); // TODO
			});
			
			describe('#kickFromParty', function () {
				it('should kick a given user from a party'); // TODO
			});
			
			describe('#setPartyCoach', function () {
				it('should set the node-dota2 instance to be this party\'s coach'); // TODO
			});
			
			describe('#leaveParty', function () {
				it('should leave the party'); // TODO
			});
		});
		
		describe('Lobbies', function () {
			describe('#joinPracticeLobby', function () {
				it('should join a lobby with the given id'); //TODO
			});
			
			describe('#createPracticeLobby', function () {
				it('should create a lobby', function (done) {
					Dota2.createPracticeLobby({
						"game_name": "node-dota2 test",
						"server_region": dota2.ServerRegion.EUROPE,
						"pass_key": "IShouldNotJoinThisBecauseItWillSoonBeGone"
					} , function (err, response) {
						done(err);
					});
				});
			});
			
			// describe('#createTournamentLobby', function () {
			// 	it('should create a tournament lobby'); // TODO
			// });
			
			describe('#balancedShuffleLobby', function () {
				it('should shuffle the teams within the lobby'); // TODO
			});
			
			describe('#flipLobbyTeams', function () {
				it('should flip the teams within the lobby'); // TODO
			});
			
			describe('#configPracticeLobby', function () {
				it('should (re)configure the lobby'); // TODO
			});
			
			describe('#launchPracticeLobby', function () {
				it('should launch the lobby and begin a match'); // TODO
			});
			
			describe('#inviteToLobby', function () {
				it('should invite the given account to a lobby'); // TODO
			});
			
			describe('#practiceLobbyKick', function () {
				it('should kick a given account from a lobby'); // TODO
			});
			
			describe('#leavePracticeLobby', function () {
				it('should leave a lobby', function (done) {
					Dota2.leavePracticeLobby(function (err, response) {
						done(err);
					});
				});
			});
			
			describe('#requestPracticeLobbyList', function () {
				it('should do something'); // TODO
			});
			
			describe('#requestFriendPractiseLobbyList', function () {
				it('should do something'); // TODO
			});
		});
		
		describe('Leagues', function () {
			
			describe('#requestLeagueInfo', function () {
				it('should fetch data on all official leagues', function (done) {
					Dota2.on('leagueData', function (leagues){
						should(leagues.length).above(0);
						should.exist(leagues[0].league_id);
						done();
					});
					Dota2.requestLeagueInfo();
				}); 
			});
			
			describe('#requestTopLeagueMatches', function () {
				it('should fetch data on all top league matches', function (done) {
					Dota2.on('topLeagueMatchesData', function (matches){
						should(matches.length).above(0);
						should.exist(matches[0].match_id);
						should.exist(matches[0].players);
						should(matches[0].players.length).above(0);
						should.exist(matches[0].tourney.league_id);
						done();
					});
					Dota2.requestTopLeagueMatches();
				}); 
			});
		});
		
		describe('SourceTV', function () {
			describe('#requestSourceTVGames', function () {
				it('should fetch a list of ongoing matches matching the search criteria', done => {
					Dota2.on('sourceTVGamesData', function (games) {
						should.exist(games);
						should(games.num_games).above(0);
						done();
					});
					Dota2.requestSourceTVGames();
				}); 
			});
		});
	
		describe('Teams', function () {
			describe('#requestMyTeams', function () {
				it('should fetch a list of teams of which I\'m a member', done => {
					Dota2.requestMyTeams(function (err, teamData) {
						should.exist(teamData.teams);
						done(err);
					});
				});
			});
			
			// describe('#requestProTeamList', function () {
			// 	it('should fetch a list of pro teams', function(done){
			// 		Dota2.requestProTeamList(function (err, teamData) {
			// 			should.exist(teamData.teams);
			// 			done(err);
			// 		});
			// 	});
			// });
		});
		
		
	});
