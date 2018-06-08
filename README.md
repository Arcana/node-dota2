node-dota2
========

[![NPM version](https://img.shields.io/npm/v/dota2.svg)](https://npmjs.org/package/dota2 "View this project on NPM")
[![Build Status](https://img.shields.io/travis/Arcana/node-dota2.svg)](https://travis-ci.org/Arcana/node-dota2 "View this project's build information")
[![Dependency Status](https://img.shields.io/david/Arcana/node-dota2.svg)](https://david-dm.org/Arcana/node-dota2 "Check this project's dependencies")
[![Greenkeeper badge](https://badges.greenkeeper.io/Arcana/node-dota2.svg)](https://greenkeeper.io/)

A node-steam plugin for Dota 2, consider it in alpha state.

Check out @RJacksonm1's blog post (his only blog post), [Extending node-dota2](https://blog.rjackson.me/extending-node-dota2/), for a rough overview of adding new functionality to the library.
A fair warning, while the way you search for new functionality is still the same, quite a lot has changed (and been simplified) implementation wise.
It is now easier to implement new functionality than it was back when this blog was written.

## Installation and setup
* `npm install` in the repository root
* Copy `config.js.example` to `config.js` and edit appropriately
* Run the example script: `node example.js`
* If you receive Error 63 you need to provide a Steam Guard code by setting the Steam Guard code in `config.js` and launching again.
* Make sure to use at least version 4.4.5 of node js

## Initializing
Parameters:
* `steamClient` - Pass a SteamClient instance to use to send & receive GC messages.
* `debug` - A boolean noting whether to print information about operations to console.
* `debugMore` - A boolean noting whether to print extended debug information. Activating this will log messages for each proto message exchanged with the GC.

```js
var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    dota2 = require('dota2'),
    Dota2 = new dota2.Dota2Client(steamClient, true, false);
```

## Disclaimer
We do not in any way encourage people to use their own accounts when using this library.
This library tries to mimic the behavior of the Dota 2 client to allow people to programmatically interact with the Dota 2 GC,
however we make no efforts to hide this fact and it's pretty easy for Valve to detect clients using this library based on the generated traffic.
While Valve has not yet expressed a dislike regarding reverse engineering projects like this one,
it's not unimaginable that this might one day change and result in VAC bans.

## Examples
The `examples` directory contains two Dota2 bots as an example. One contains commented-out dota2 methods, the other has boolean activated methods.
Both examples show how to interact with the library.

## Testing
There is a partial automated test suite for node-dota2, which is located in the test directory.
You need to configure the `STEAM_USERNAME` and `STEAM_PASSWORD` environment variables to be able to run it.
You can launch the tests by running the file with mocha.

# API
The API doc can be consulted here or at [doclets.io](https://doclets.io/Arcana/node-dota2)
<a name="module_Dota2"></a>

## Dota2
Dota 2 module


* [Dota2](#module_Dota2)
    * _static_
        * [.Dota2Client](#module_Dota2.Dota2Client) ⇐ <code>EventEmitter</code>
            * [new Dota2.Dota2Client(steamClient, debug, debugMore)](#new_module_Dota2.Dota2Client_new)
            * _instance_
                * [.Logger](#module_Dota2.Dota2Client+Logger) : <code>winston.Logger</code>
                * [.Inventory](#module_Dota2.Dota2Client+Inventory) : <code>Array.&lt;CSOEconItem&gt;</code>
                * [.chatChannels](#module_Dota2.Dota2Client+chatChannels) : <code>Array.&lt;CMsgDOTAJoinChatChannelResponse&gt;</code>
                * [.Lobby](#module_Dota2.Dota2Client+Lobby) : <code>CSODOTALobby</code>
                    * [.Options](#module_Dota2.Dota2Client+Lobby.Options) : <code>Object</code>
                * [.LobbyInvite](#module_Dota2.Dota2Client+LobbyInvite) : <code>CSODOTALobbyInvite</code>
                * [.Party](#module_Dota2.Dota2Client+Party) : <code>CSODOTAParty</code>
                * [.PartyInvite](#module_Dota2.Dota2Client+PartyInvite) : <code>CSODOTAPartyInvite</code>
                * [.launch()](#module_Dota2.Dota2Client+launch)
                * [.exit()](#module_Dota2.Dota2Client+exit)
                * [.joinChat(channel_name, [channel_type])](#module_Dota2.Dota2Client+joinChat)
                * [.leaveChat(channel_name, [channel_type])](#module_Dota2.Dota2Client+leaveChat)
                * [.sendMessage(message, channel_name, [channel_type])](#module_Dota2.Dota2Client+sendMessage)
                * [.shareLobby(channel_name, [channel_type])](#module_Dota2.Dota2Client+shareLobby)
                * [.flipCoin(channel_name, [channel_type])](#module_Dota2.Dota2Client+flipCoin)
                * [.rollDice(min, max, channel_name, [channel_type])](#module_Dota2.Dota2Client+rollDice)
                * [.requestChatChannels()](#module_Dota2.Dota2Client+requestChatChannels)
                * [.requestPlayerMatchHistory(account_id, [options], [callback])](#module_Dota2.Dota2Client+requestPlayerMatchHistory)
                * [.requestProfileCard(account_id, [callback])](#module_Dota2.Dota2Client+requestProfileCard)
                * [.requestProfile(account_id, [callback])](#module_Dota2.Dota2Client+requestProfile)
                * [.requestHallOfFame(week, [callback])](#module_Dota2.Dota2Client+requestHallOfFame)
                * [.requestPlayerInfo(account_ids)](#module_Dota2.Dota2Client+requestPlayerInfo)
                * [.requestTrophyList(account_id, [callback])](#module_Dota2.Dota2Client+requestTrophyList)
                * [.requestPlayerStats(account_id, [callback])](#module_Dota2.Dota2Client+requestPlayerStats)
                * [.tipPlayer(account_id, steam_id, steam_id)](#module_Dota2.Dota2Client+tipPlayer)
                * [.requestJoinableCustomGameModes([server_region])](#module_Dota2.Dota2Client+requestJoinableCustomGameModes)
                * [.requestPlayerCardsByPlayer()](#module_Dota2.Dota2Client+requestPlayerCardsByPlayer) ⇒ <code>Array.&lt;FantasyPlayer&gt;</code>
                    * [.FantasyPlayer](#module_Dota2.Dota2Client+requestPlayerCardsByPlayer.FantasyPlayer) : <code>Object</code>
                * [.requestPlayerCardRoster(league_id, timestamp, [callback])](#module_Dota2.Dota2Client+requestPlayerCardRoster)
                * [.draftPlayerCard(league_id, timestamp, slot, player_card_id, [callback])](#module_Dota2.Dota2Client+draftPlayerCard)
                * [.setItemPositions(item_positions)](#module_Dota2.Dota2Client+setItemPositions)
                * [.deleteItem(item_id)](#module_Dota2.Dota2Client+deleteItem)
                * [.requestLeagueInfo()](#module_Dota2.Dota2Client+requestLeagueInfo)
                * [.requestTopLeagueMatches()](#module_Dota2.Dota2Client+requestTopLeagueMatches)
                * [.createPracticeLobby(options, [callback])](#module_Dota2.Dota2Client+createPracticeLobby)
                * ~~[._createPracticeLobby()](#module_Dota2.Dota2Client+_createPracticeLobby)~~
                * ~~[.createTournamentLobby()](#module_Dota2.Dota2Client+createTournamentLobby)~~
                * [.configPracticeLobby(lobby_id, options, [callback])](#module_Dota2.Dota2Client+configPracticeLobby)
                * [.requestPracticeLobbyList([callback])](#module_Dota2.Dota2Client+requestPracticeLobbyList)
                * [.requestFriendPracticeLobbyList([callback])](#module_Dota2.Dota2Client+requestFriendPracticeLobbyList)
                * [.balancedShuffleLobby([callback])](#module_Dota2.Dota2Client+balancedShuffleLobby)
                * [.flipLobbyTeams([callback])](#module_Dota2.Dota2Client+flipLobbyTeams)
                * [.inviteToLobby(steam_id)](#module_Dota2.Dota2Client+inviteToLobby)
                * [.practiceLobbyKick(account_id, [callback])](#module_Dota2.Dota2Client+practiceLobbyKick)
                * [.practiceLobbyKickFromTeam(account_id, [callback])](#module_Dota2.Dota2Client+practiceLobbyKickFromTeam)
                * [.joinPracticeLobby(id, password, [callback])](#module_Dota2.Dota2Client+joinPracticeLobby)
                * [.leavePracticeLobby([callback])](#module_Dota2.Dota2Client+leavePracticeLobby)
                * [.destroyLobby([callback])](#module_Dota2.Dota2Client+destroyLobby)
                * [.abandonCurrentGame([callback])](#module_Dota2.Dota2Client+abandonCurrentGame)
                * [.launchPracticeLobby([callback])](#module_Dota2.Dota2Client+launchPracticeLobby)
                * [.joinPracticeLobbyTeam(slot, team, [callback])](#module_Dota2.Dota2Client+joinPracticeLobbyTeam)
                * [.joinPracticeLobbyBroadcastChannel([channel], [callback])](#module_Dota2.Dota2Client+joinPracticeLobbyBroadcastChannel)
                * [.addBotToPracticeLobby(slot, team, bot_difficulty, [callback])](#module_Dota2.Dota2Client+addBotToPracticeLobby)
                * [.respondLobbyInvite(id, accept)](#module_Dota2.Dota2Client+respondLobbyInvite)
                * [.requestMatches([criteria], [callback])](#module_Dota2.Dota2Client+requestMatches)
                * [.requestMatchDetails(match_id, [callback])](#module_Dota2.Dota2Client+requestMatchDetails)
                * [.requestMatchMinimalDetails(match_id, [callback])](#module_Dota2.Dota2Client+requestMatchMinimalDetails)
                * [.requestMatchmakingStats()](#module_Dota2.Dota2Client+requestMatchmakingStats)
                * [.requestTopFriendMatches()](#module_Dota2.Dota2Client+requestTopFriendMatches)
                * [.respondPartyInvite(id, [accept], [ping_data])](#module_Dota2.Dota2Client+respondPartyInvite)
                * [.leaveParty()](#module_Dota2.Dota2Client+leaveParty)
                * [.setPartyLeader(steam_id)](#module_Dota2.Dota2Client+setPartyLeader)
                * [.setPartyCoach(coach)](#module_Dota2.Dota2Client+setPartyCoach)
                * [.inviteToParty(steam_id)](#module_Dota2.Dota2Client+inviteToParty)
                * [.kickFromParty(steam_id)](#module_Dota2.Dota2Client+kickFromParty)
                * [.requestSourceTVGames(filter_options)](#module_Dota2.Dota2Client+requestSourceTVGames)
                * [.requestMyTeams([callback])](#module_Dota2.Dota2Client+requestMyTeams)
                * ["ready"](#module_Dota2.Dota2Client+event_ready)
                * ["unhandled" (kMsg, kMsg_name)](#module_Dota2.Dota2Client+event_unhandled)
                * ["hellotimeout"](#module_Dota2.Dota2Client+event_hellotimeout)
                * ["inventoryUpdate" (inventory)](#module_Dota2.Dota2Client+event_inventoryUpdate)
                * ["gotItem" (item)](#module_Dota2.Dota2Client+event_gotItem)
                * ["gaveItem" (item)](#module_Dota2.Dota2Client+event_gaveItem)
                * ["practiceLobbyUpdate" (lobby)](#module_Dota2.Dota2Client+event_practiceLobbyUpdate)
                * ["practiceLobbyCleared"](#module_Dota2.Dota2Client+event_practiceLobbyCleared)
                * ["lobbyInviteUpdate" (lobbyInvite)](#module_Dota2.Dota2Client+event_lobbyInviteUpdate)
                * ["lobbyInviteCleared"](#module_Dota2.Dota2Client+event_lobbyInviteCleared)
                * ["partyUpdate" (party)](#module_Dota2.Dota2Client+event_partyUpdate)
                * ["partyCleared"](#module_Dota2.Dota2Client+event_partyCleared)
                * ["partyInviteUpdate" (partyInvite)](#module_Dota2.Dota2Client+event_partyInviteUpdate)
                * ["partyInviteCleared"](#module_Dota2.Dota2Client+event_partyInviteCleared)
                * ["chatJoined" (channelData)](#module_Dota2.Dota2Client+event_chatJoined)
                * ["chatJoin" (channel, joiner_name, joiner_steam_id, otherJoined_object)](#module_Dota2.Dota2Client+event_chatJoin)
                * ["chatLeave" (channel, leaver_steam_id, otherLeft_object)](#module_Dota2.Dota2Client+event_chatLeave)
                * ["chatLeft" (channel)](#module_Dota2.Dota2Client+event_chatLeft)
                * ["chatMessage" (channel, sender_name, message, chatData)](#module_Dota2.Dota2Client+event_chatMessage)
                * ["chatChannelsData" (channels)](#module_Dota2.Dota2Client+event_chatChannelsData)
                * ["playerMatchHistoryData" (requestId, matchHistoryResponse)](#module_Dota2.Dota2Client+event_playerMatchHistoryData)
                * ["profileCardData" (account_id, profileCardResponse)](#module_Dota2.Dota2Client+event_profileCardData)
                * ["profileData" (profileResponse)](#module_Dota2.Dota2Client+event_profileData)
                * ["hallOfFameData" (week, featured_players, featured_farmer, hallOfFameResponse)](#module_Dota2.Dota2Client+event_hallOfFameData)
                * ["playerInfoData" (playerInfoData)](#module_Dota2.Dota2Client+event_playerInfoData)
                * ["trophyListData" (trophyListResponse)](#module_Dota2.Dota2Client+event_trophyListData)
                * ["playerStatsData" (account_id, playerStatsResponse)](#module_Dota2.Dota2Client+event_playerStatsData)
                * ["tipResponse" (tipResponse)](#module_Dota2.Dota2Client+event_tipResponse)
                * ["tipped" (tipper_account_id, tipper_name, recipient_account_id, recipient_name, event_id)](#module_Dota2.Dota2Client+event_tipped)
                * ["joinableCustomGameModes" (joinableCustomGameModes)](#module_Dota2.Dota2Client+event_joinableCustomGameModes)
                * ["playerCardRoster" (playerCardRoster)](#module_Dota2.Dota2Client+event_playerCardRoster)
                * ["playerCardDrafted" (playerCardRoster)](#module_Dota2.Dota2Client+event_playerCardDrafted)
                * ["popup" (id, popup)](#module_Dota2.Dota2Client+event_popup)
                * ["liveLeagueGamesUpdate" (live_league_games)](#module_Dota2.Dota2Client+event_liveLeagueGamesUpdate)
                * ["leagueData" (leagues)](#module_Dota2.Dota2Client+event_leagueData)
                * ["topLeagueMatchesData" (matches)](#module_Dota2.Dota2Client+event_topLeagueMatchesData)
                * ["lobbyDestroyed" (result, response)](#module_Dota2.Dota2Client+event_lobbyDestroyed)
                * ["practiceLobbyJoinResponse" (result, response)](#module_Dota2.Dota2Client+event_practiceLobbyJoinResponse)
                * ["practiceLobbyListData" (practiceLobbyListResponse)](#module_Dota2.Dota2Client+event_practiceLobbyListData)
                * ["practiceLobbyResponse" (result, response)](#module_Dota2.Dota2Client+event_practiceLobbyResponse)
                * ["friendPracticeLobbyListData" (practiceLobbyListResponse)](#module_Dota2.Dota2Client+event_friendPracticeLobbyListData)
                * ["inviteCreated" (steam_id, group_id, is_online)](#module_Dota2.Dota2Client+event_inviteCreated)
                * ["matchesData" (requestId, total_results, results_remaining, matches, series, matchResponse)](#module_Dota2.Dota2Client+event_matchesData)
                * ["matchDetailsData" (match_id, matchDetailsResponse)](#module_Dota2.Dota2Client+event_matchDetailsData)
                * ["matchMinimalDetailsData" (last_match, matchMinimalDetailsResponse)](#module_Dota2.Dota2Client+event_matchMinimalDetailsData)
                * ["matchmakingStatsData" (matchgroups_version, match_groups, matchmakingStatsResponse)](#module_Dota2.Dota2Client+event_matchmakingStatsData)
                * ["topFriendMatchesData" (matches)](#module_Dota2.Dota2Client+event_topFriendMatchesData)
                * ["sourceTVGamesData" (sourceTVGamesResponse)](#module_Dota2.Dota2Client+event_sourceTVGamesData)
                * ["teamData" (teams, league_id)](#module_Dota2.Dota2Client+event_teamData)
            * _static_
                * [.ToAccountID(steamID)](#module_Dota2.Dota2Client.ToAccountID) ⇒ <code>number</code>
                * [.ToSteamID(accid)](#module_Dota2.Dota2Client.ToSteamID) ⇒ [<code>Long</code>](#external_Long)
        * [.schema](#module_Dota2.schema)
            * [.CMsgGCToClientPlayerStatsResponse](#module_Dota2.schema.CMsgGCToClientPlayerStatsResponse) : <code>Object</code>
        * [.FantasyStats](#module_Dota2.FantasyStats) : <code>enum</code>
        * [.EResult](#module_Dota2.EResult) : <code>enum</code>
        * [.ServerRegion](#module_Dota2.ServerRegion) : <code>enum</code>
        * [.SeriesType](#module_Dota2.SeriesType) : <code>enum</code>
        * [.BotDifficulty](#module_Dota2.BotDifficulty) : <code>enum</code>
    * _inner_
        * [~requestCallback](#module_Dota2..requestCallback) : <code>function</code>
        * [~Long](#external_Long)

<a name="module_Dota2.Dota2Client"></a>

### Dota2.Dota2Client ⇐ <code>EventEmitter</code>
**Kind**: static class of [<code>Dota2</code>](#module_Dota2)  
**Extends**: <code>EventEmitter</code>  
**Emits**: [<code>ready</code>](#module_Dota2.Dota2Client+event_ready), [<code>unhandled</code>](#module_Dota2.Dota2Client+event_unhandled), [<code>hellotimeout</code>](#module_Dota2.Dota2Client+event_hellotimeout), [<code>popup</code>](#module_Dota2.Dota2Client+event_popup), [<code>sourceTVGamesData</code>](#module_Dota2.Dota2Client+event_sourceTVGamesData), [<code>inventoryUpdate</code>](#module_Dota2.Dota2Client+event_inventoryUpdate), [<code>practiceLobbyUpdate</code>](#module_Dota2.Dota2Client+event_practiceLobbyUpdate), [<code>practiceLobbyCleared</code>](#module_Dota2.Dota2Client+event_practiceLobbyCleared), [<code>lobbyInviteUpdate</code>](#module_Dota2.Dota2Client+event_lobbyInviteUpdate), [<code>lobbyInviteCleared</code>](#module_Dota2.Dota2Client+event_lobbyInviteCleared), [<code>practiceLobbyJoinResponse</code>](#module_Dota2.Dota2Client+event_practiceLobbyJoinResponse), [<code>practiceLobbyListData</code>](#module_Dota2.Dota2Client+event_practiceLobbyListData), [<code>practiceLobbyResponse</code>](#module_Dota2.Dota2Client+event_practiceLobbyResponse), [<code>lobbyDestroyed</code>](#module_Dota2.Dota2Client+event_lobbyDestroyed), [<code>friendPracticeLobbyListData</code>](#module_Dota2.Dota2Client+event_friendPracticeLobbyListData), [<code>inviteCreated</code>](#module_Dota2.Dota2Client+event_inviteCreated), [<code>partyUpdate</code>](#module_Dota2.Dota2Client+event_partyUpdate), [<code>partyCleared</code>](#module_Dota2.Dota2Client+event_partyCleared), [<code>partyInviteUpdate</code>](#module_Dota2.Dota2Client+event_partyInviteUpdate), [<code>partyInviteCleared</code>](#module_Dota2.Dota2Client+event_partyInviteCleared), [<code>joinableCustomGameModes</code>](#module_Dota2.Dota2Client+event_joinableCustomGameModes), [<code>chatChannelsData</code>](#module_Dota2.Dota2Client+event_chatChannelsData), [<code>chatJoin</code>](#module_Dota2.Dota2Client+event_chatJoin), [<code>chatJoined</code>](#module_Dota2.Dota2Client+event_chatJoined), [<code>chatLeave</code>](#module_Dota2.Dota2Client+event_chatLeave), [<code>chatMessage</code>](#module_Dota2.Dota2Client+event_chatMessage), [<code>profileCardData</code>](#module_Dota2.Dota2Client+event_profileCardData), [<code>playerMatchHistoryData</code>](#module_Dota2.Dota2Client+event_playerMatchHistoryData), [<code>playerInfoData</code>](#module_Dota2.Dota2Client+event_playerInfoData), [<code>playerStatsData</code>](#module_Dota2.Dota2Client+event_playerStatsData), [<code>trophyListData</code>](#module_Dota2.Dota2Client+event_trophyListData), [<code>hallOfFameData</code>](#module_Dota2.Dota2Client+event_hallOfFameData), [<code>playerCardRoster</code>](#module_Dota2.Dota2Client+event_playerCardRoster), [<code>playerCardDrafted</code>](#module_Dota2.Dota2Client+event_playerCardDrafted), [<code>liveLeagueGamesUpdate</code>](#module_Dota2.Dota2Client+event_liveLeagueGamesUpdate), [<code>leagueData</code>](#module_Dota2.Dota2Client+event_leagueData), [<code>topLeagueMatchesData</code>](#module_Dota2.Dota2Client+event_topLeagueMatchesData), [<code>teamData</code>](#module_Dota2.Dota2Client+event_teamData), [<code>matchesData</code>](#module_Dota2.Dota2Client+event_matchesData), [<code>matchDetailsData</code>](#module_Dota2.Dota2Client+event_matchDetailsData), [<code>matchMinimalDetailsData</code>](#module_Dota2.Dota2Client+event_matchMinimalDetailsData), [<code>matchmakingStatsData</code>](#module_Dota2.Dota2Client+event_matchmakingStatsData), [<code>topFriendMatchesData</code>](#module_Dota2.Dota2Client+event_topFriendMatchesData), [<code>tipResponse</code>](#module_Dota2.Dota2Client+event_tipResponse), [<code>tipped</code>](#module_Dota2.Dota2Client+event_tipped)  

* [.Dota2Client](#module_Dota2.Dota2Client) ⇐ <code>EventEmitter</code>
    * [new Dota2.Dota2Client(steamClient, debug, debugMore)](#new_module_Dota2.Dota2Client_new)
    * _instance_
        * [.Logger](#module_Dota2.Dota2Client+Logger) : <code>winston.Logger</code>
        * [.Inventory](#module_Dota2.Dota2Client+Inventory) : <code>Array.&lt;CSOEconItem&gt;</code>
        * [.chatChannels](#module_Dota2.Dota2Client+chatChannels) : <code>Array.&lt;CMsgDOTAJoinChatChannelResponse&gt;</code>
        * [.Lobby](#module_Dota2.Dota2Client+Lobby) : <code>CSODOTALobby</code>
            * [.Options](#module_Dota2.Dota2Client+Lobby.Options) : <code>Object</code>
        * [.LobbyInvite](#module_Dota2.Dota2Client+LobbyInvite) : <code>CSODOTALobbyInvite</code>
        * [.Party](#module_Dota2.Dota2Client+Party) : <code>CSODOTAParty</code>
        * [.PartyInvite](#module_Dota2.Dota2Client+PartyInvite) : <code>CSODOTAPartyInvite</code>
        * [.launch()](#module_Dota2.Dota2Client+launch)
        * [.exit()](#module_Dota2.Dota2Client+exit)
        * [.joinChat(channel_name, [channel_type])](#module_Dota2.Dota2Client+joinChat)
        * [.leaveChat(channel_name, [channel_type])](#module_Dota2.Dota2Client+leaveChat)
        * [.sendMessage(message, channel_name, [channel_type])](#module_Dota2.Dota2Client+sendMessage)
        * [.shareLobby(channel_name, [channel_type])](#module_Dota2.Dota2Client+shareLobby)
        * [.flipCoin(channel_name, [channel_type])](#module_Dota2.Dota2Client+flipCoin)
        * [.rollDice(min, max, channel_name, [channel_type])](#module_Dota2.Dota2Client+rollDice)
        * [.requestChatChannels()](#module_Dota2.Dota2Client+requestChatChannels)
        * [.requestPlayerMatchHistory(account_id, [options], [callback])](#module_Dota2.Dota2Client+requestPlayerMatchHistory)
        * [.requestProfileCard(account_id, [callback])](#module_Dota2.Dota2Client+requestProfileCard)
        * [.requestProfile(account_id, [callback])](#module_Dota2.Dota2Client+requestProfile)
        * [.requestHallOfFame(week, [callback])](#module_Dota2.Dota2Client+requestHallOfFame)
        * [.requestPlayerInfo(account_ids)](#module_Dota2.Dota2Client+requestPlayerInfo)
        * [.requestTrophyList(account_id, [callback])](#module_Dota2.Dota2Client+requestTrophyList)
        * [.requestPlayerStats(account_id, [callback])](#module_Dota2.Dota2Client+requestPlayerStats)
        * [.tipPlayer(account_id, steam_id, steam_id)](#module_Dota2.Dota2Client+tipPlayer)
        * [.requestJoinableCustomGameModes([server_region])](#module_Dota2.Dota2Client+requestJoinableCustomGameModes)
        * [.requestPlayerCardsByPlayer()](#module_Dota2.Dota2Client+requestPlayerCardsByPlayer) ⇒ <code>Array.&lt;FantasyPlayer&gt;</code>
            * [.FantasyPlayer](#module_Dota2.Dota2Client+requestPlayerCardsByPlayer.FantasyPlayer) : <code>Object</code>
        * [.requestPlayerCardRoster(league_id, timestamp, [callback])](#module_Dota2.Dota2Client+requestPlayerCardRoster)
        * [.draftPlayerCard(league_id, timestamp, slot, player_card_id, [callback])](#module_Dota2.Dota2Client+draftPlayerCard)
        * [.setItemPositions(item_positions)](#module_Dota2.Dota2Client+setItemPositions)
        * [.deleteItem(item_id)](#module_Dota2.Dota2Client+deleteItem)
        * [.requestLeagueInfo()](#module_Dota2.Dota2Client+requestLeagueInfo)
        * [.requestTopLeagueMatches()](#module_Dota2.Dota2Client+requestTopLeagueMatches)
        * [.createPracticeLobby(options, [callback])](#module_Dota2.Dota2Client+createPracticeLobby)
        * ~~[._createPracticeLobby()](#module_Dota2.Dota2Client+_createPracticeLobby)~~
        * ~~[.createTournamentLobby()](#module_Dota2.Dota2Client+createTournamentLobby)~~
        * [.configPracticeLobby(lobby_id, options, [callback])](#module_Dota2.Dota2Client+configPracticeLobby)
        * [.requestPracticeLobbyList([callback])](#module_Dota2.Dota2Client+requestPracticeLobbyList)
        * [.requestFriendPracticeLobbyList([callback])](#module_Dota2.Dota2Client+requestFriendPracticeLobbyList)
        * [.balancedShuffleLobby([callback])](#module_Dota2.Dota2Client+balancedShuffleLobby)
        * [.flipLobbyTeams([callback])](#module_Dota2.Dota2Client+flipLobbyTeams)
        * [.inviteToLobby(steam_id)](#module_Dota2.Dota2Client+inviteToLobby)
        * [.practiceLobbyKick(account_id, [callback])](#module_Dota2.Dota2Client+practiceLobbyKick)
        * [.practiceLobbyKickFromTeam(account_id, [callback])](#module_Dota2.Dota2Client+practiceLobbyKickFromTeam)
        * [.joinPracticeLobby(id, password, [callback])](#module_Dota2.Dota2Client+joinPracticeLobby)
        * [.leavePracticeLobby([callback])](#module_Dota2.Dota2Client+leavePracticeLobby)
        * [.destroyLobby([callback])](#module_Dota2.Dota2Client+destroyLobby)
        * [.abandonCurrentGame([callback])](#module_Dota2.Dota2Client+abandonCurrentGame)
        * [.launchPracticeLobby([callback])](#module_Dota2.Dota2Client+launchPracticeLobby)
        * [.joinPracticeLobbyTeam(slot, team, [callback])](#module_Dota2.Dota2Client+joinPracticeLobbyTeam)
        * [.joinPracticeLobbyBroadcastChannel([channel], [callback])](#module_Dota2.Dota2Client+joinPracticeLobbyBroadcastChannel)
        * [.addBotToPracticeLobby(slot, team, bot_difficulty, [callback])](#module_Dota2.Dota2Client+addBotToPracticeLobby)
        * [.respondLobbyInvite(id, accept)](#module_Dota2.Dota2Client+respondLobbyInvite)
        * [.requestMatches([criteria], [callback])](#module_Dota2.Dota2Client+requestMatches)
        * [.requestMatchDetails(match_id, [callback])](#module_Dota2.Dota2Client+requestMatchDetails)
        * [.requestMatchMinimalDetails(match_id, [callback])](#module_Dota2.Dota2Client+requestMatchMinimalDetails)
        * [.requestMatchmakingStats()](#module_Dota2.Dota2Client+requestMatchmakingStats)
        * [.requestTopFriendMatches()](#module_Dota2.Dota2Client+requestTopFriendMatches)
        * [.respondPartyInvite(id, [accept], [ping_data])](#module_Dota2.Dota2Client+respondPartyInvite)
        * [.leaveParty()](#module_Dota2.Dota2Client+leaveParty)
        * [.setPartyLeader(steam_id)](#module_Dota2.Dota2Client+setPartyLeader)
        * [.setPartyCoach(coach)](#module_Dota2.Dota2Client+setPartyCoach)
        * [.inviteToParty(steam_id)](#module_Dota2.Dota2Client+inviteToParty)
        * [.kickFromParty(steam_id)](#module_Dota2.Dota2Client+kickFromParty)
        * [.requestSourceTVGames(filter_options)](#module_Dota2.Dota2Client+requestSourceTVGames)
        * [.requestMyTeams([callback])](#module_Dota2.Dota2Client+requestMyTeams)
        * ["ready"](#module_Dota2.Dota2Client+event_ready)
        * ["unhandled" (kMsg, kMsg_name)](#module_Dota2.Dota2Client+event_unhandled)
        * ["hellotimeout"](#module_Dota2.Dota2Client+event_hellotimeout)
        * ["inventoryUpdate" (inventory)](#module_Dota2.Dota2Client+event_inventoryUpdate)
        * ["gotItem" (item)](#module_Dota2.Dota2Client+event_gotItem)
        * ["gaveItem" (item)](#module_Dota2.Dota2Client+event_gaveItem)
        * ["practiceLobbyUpdate" (lobby)](#module_Dota2.Dota2Client+event_practiceLobbyUpdate)
        * ["practiceLobbyCleared"](#module_Dota2.Dota2Client+event_practiceLobbyCleared)
        * ["lobbyInviteUpdate" (lobbyInvite)](#module_Dota2.Dota2Client+event_lobbyInviteUpdate)
        * ["lobbyInviteCleared"](#module_Dota2.Dota2Client+event_lobbyInviteCleared)
        * ["partyUpdate" (party)](#module_Dota2.Dota2Client+event_partyUpdate)
        * ["partyCleared"](#module_Dota2.Dota2Client+event_partyCleared)
        * ["partyInviteUpdate" (partyInvite)](#module_Dota2.Dota2Client+event_partyInviteUpdate)
        * ["partyInviteCleared"](#module_Dota2.Dota2Client+event_partyInviteCleared)
        * ["chatJoined" (channelData)](#module_Dota2.Dota2Client+event_chatJoined)
        * ["chatJoin" (channel, joiner_name, joiner_steam_id, otherJoined_object)](#module_Dota2.Dota2Client+event_chatJoin)
        * ["chatLeave" (channel, leaver_steam_id, otherLeft_object)](#module_Dota2.Dota2Client+event_chatLeave)
        * ["chatLeft" (channel)](#module_Dota2.Dota2Client+event_chatLeft)
        * ["chatMessage" (channel, sender_name, message, chatData)](#module_Dota2.Dota2Client+event_chatMessage)
        * ["chatChannelsData" (channels)](#module_Dota2.Dota2Client+event_chatChannelsData)
        * ["playerMatchHistoryData" (requestId, matchHistoryResponse)](#module_Dota2.Dota2Client+event_playerMatchHistoryData)
        * ["profileCardData" (account_id, profileCardResponse)](#module_Dota2.Dota2Client+event_profileCardData)
        * ["profileData" (profileResponse)](#module_Dota2.Dota2Client+event_profileData)
        * ["hallOfFameData" (week, featured_players, featured_farmer, hallOfFameResponse)](#module_Dota2.Dota2Client+event_hallOfFameData)
        * ["playerInfoData" (playerInfoData)](#module_Dota2.Dota2Client+event_playerInfoData)
        * ["trophyListData" (trophyListResponse)](#module_Dota2.Dota2Client+event_trophyListData)
        * ["playerStatsData" (account_id, playerStatsResponse)](#module_Dota2.Dota2Client+event_playerStatsData)
        * ["tipResponse" (tipResponse)](#module_Dota2.Dota2Client+event_tipResponse)
        * ["tipped" (tipper_account_id, tipper_name, recipient_account_id, recipient_name, event_id)](#module_Dota2.Dota2Client+event_tipped)
        * ["joinableCustomGameModes" (joinableCustomGameModes)](#module_Dota2.Dota2Client+event_joinableCustomGameModes)
        * ["playerCardRoster" (playerCardRoster)](#module_Dota2.Dota2Client+event_playerCardRoster)
        * ["playerCardDrafted" (playerCardRoster)](#module_Dota2.Dota2Client+event_playerCardDrafted)
        * ["popup" (id, popup)](#module_Dota2.Dota2Client+event_popup)
        * ["liveLeagueGamesUpdate" (live_league_games)](#module_Dota2.Dota2Client+event_liveLeagueGamesUpdate)
        * ["leagueData" (leagues)](#module_Dota2.Dota2Client+event_leagueData)
        * ["topLeagueMatchesData" (matches)](#module_Dota2.Dota2Client+event_topLeagueMatchesData)
        * ["lobbyDestroyed" (result, response)](#module_Dota2.Dota2Client+event_lobbyDestroyed)
        * ["practiceLobbyJoinResponse" (result, response)](#module_Dota2.Dota2Client+event_practiceLobbyJoinResponse)
        * ["practiceLobbyListData" (practiceLobbyListResponse)](#module_Dota2.Dota2Client+event_practiceLobbyListData)
        * ["practiceLobbyResponse" (result, response)](#module_Dota2.Dota2Client+event_practiceLobbyResponse)
        * ["friendPracticeLobbyListData" (practiceLobbyListResponse)](#module_Dota2.Dota2Client+event_friendPracticeLobbyListData)
        * ["inviteCreated" (steam_id, group_id, is_online)](#module_Dota2.Dota2Client+event_inviteCreated)
        * ["matchesData" (requestId, total_results, results_remaining, matches, series, matchResponse)](#module_Dota2.Dota2Client+event_matchesData)
        * ["matchDetailsData" (match_id, matchDetailsResponse)](#module_Dota2.Dota2Client+event_matchDetailsData)
        * ["matchMinimalDetailsData" (last_match, matchMinimalDetailsResponse)](#module_Dota2.Dota2Client+event_matchMinimalDetailsData)
        * ["matchmakingStatsData" (matchgroups_version, match_groups, matchmakingStatsResponse)](#module_Dota2.Dota2Client+event_matchmakingStatsData)
        * ["topFriendMatchesData" (matches)](#module_Dota2.Dota2Client+event_topFriendMatchesData)
        * ["sourceTVGamesData" (sourceTVGamesResponse)](#module_Dota2.Dota2Client+event_sourceTVGamesData)
        * ["teamData" (teams, league_id)](#module_Dota2.Dota2Client+event_teamData)
    * _static_
        * [.ToAccountID(steamID)](#module_Dota2.Dota2Client.ToAccountID) ⇒ <code>number</code>
        * [.ToSteamID(accid)](#module_Dota2.Dota2Client.ToSteamID) ⇒ [<code>Long</code>](#external_Long)

<a name="new_module_Dota2.Dota2Client_new"></a>

#### new Dota2.Dota2Client(steamClient, debug, debugMore)
The Dota 2 client that communicates with the GC


| Param | Type | Description |
| --- | --- | --- |
| steamClient | <code>Object</code> | Node-steam client instance |
| debug | <code>boolean</code> | Print debug information to console |
| debugMore | <code>boolean</code> | Print even more debug information to console |

<a name="module_Dota2.Dota2Client+Logger"></a>

#### dota2Client.Logger : <code>winston.Logger</code>
The logger used to write debug messages. This is a WinstonJS logger, 
feel free to configure it as you like

**Kind**: instance property of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+Inventory"></a>

#### dota2Client.Inventory : <code>Array.&lt;CSOEconItem&gt;</code>
The current state of the bot's inventory. Contains cosmetics, player cards, ...

**Kind**: instance property of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+chatChannels"></a>

#### dota2Client.chatChannels : <code>Array.&lt;CMsgDOTAJoinChatChannelResponse&gt;</code>
The chat channels the bot has joined

**Kind**: instance property of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+Lobby"></a>

#### dota2Client.Lobby : <code>CSODOTALobby</code>
The lobby the bot is currently in. Falsy if the bot isn't in a lobby.

**Kind**: instance property of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+Lobby.Options"></a>

##### Lobby.Options : <code>Object</code>
**Kind**: static typedef of [<code>Lobby</code>](#module_Dota2.Dota2Client+Lobby)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| game_name | <code>string</code> |  | Name of the lobby |
| pass_key | <code>string</code> |  | Lobby password |
| [server_region] | [<code>ServerRegion</code>](#module_Dota2.ServerRegion) | <code>module:Dota2.ServerRegion.UNSPECIFIED</code> | Server region where the lobby will be created |
| [game_mode] | <code>DOTA_GameMode</code> | <code>DOTA_GameMode.DOTA_GAMEMODE_AP</code> | Game mode |
| [game_version] | <code>DOTAGameVersion</code> | <code>DOTAGameVersion.GAME_VERSION_STABLE</code> | Version of the game |
| [cm_pick] | <code>DOTA_CM_PICK</code> | <code>DOTA_CM_PICK.DOTA_CM_RANDOM</code> | Who gets first pick |
| [allow_cheats] | <code>boolean</code> | <code>false</code> | Whether or not to allow cheats |
| [fill_with_bots] | <code>boolean</code> | <code>false</code> | Whether or not to fill empty slots with bots |
| [bot_difficulty_radiant] | <code>BotDifficulty</code> | <code>module:Dota2.BotDifficulty.PASSIVE</code> | The bot difficulty for radiant bots, if fill_with_bots is true. |
| [bot_difficulty_dire] | <code>BotDifficulty</code> | <code>module:Dota2.BotDifficulty.PASSIVE</code> | The bot difficulty for dire bots, if fill_with_bots is true. |
| [bot_radiant] | <code>number</code> |  | Presumably the ID of the custom AI to be applied to radiant bots. |
| [bot_dire] | <code>number</code> |  | Presumably the ID of the custom AI to be applied to dire bots. |
| [allow_spectating] | <code>boolean</code> | <code>true</code> | Whether or not to allow spectating |
| [series_type] | <code>SeriesType</code> | <code>NONE</code> | Whether or not the game is part of a series (Bo3, Bo5). |
| [radiant_series_wins] | <code>number</code> | <code>0</code> | # of games won so far, e.g. for a Bo3 or Bo5. |
| [dire_series_wins] | <code>number</code> | <code>0</code> | # of games won so far, e.g. for a Bo3 or Bo5. |
| [previous_match_override] | <code>number</code> |  | In a series, the match ID of the previous game. If not supplied, the GC will try to find it automatically based on the teams and the players. |
| [allchat] | <code>boolean</code> | <code>false</code> | Whether or not it's allowed to all-chat |
| [dota_tv_delay] | <code>LobbyDotaTVDelay</code> | <code>LobbyDotaTV_120</code> | How much time the game should be delayed for DotaTV. |
| [leagueid] | <code>number</code> |  | The league this lobby is being created for. The bot should be a league admin for this to work. |
| [custom_game_mode] | <code>string</code> |  | Name of the custom game |
| [custom_map_name] | <code>string</code> |  | Which map the custom game should be played on |
| [custom_difficulty] | <code>number</code> |  | Difficulty of the custom game |
| [custom_game_id] | [<code>Long</code>](#external_Long) |  | 64bit ID of the custom game mode |
| [pause_setting] | <code>LobbyDotaPauseSetting</code> | <code>0</code> | Pause setting: 0 - unlimited, 1 - limited, 2 - disabled |

<a name="module_Dota2.Dota2Client+LobbyInvite"></a>

#### dota2Client.LobbyInvite : <code>CSODOTALobbyInvite</code>
The currently active lobby invitation. Falsy if the bot has not been invited.

**Kind**: instance property of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+Party"></a>

#### dota2Client.Party : <code>CSODOTAParty</code>
The party the bot is currently in. Falsy if the bot isn't in a party.

**Kind**: instance property of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+PartyInvite"></a>

#### dota2Client.PartyInvite : <code>CSODOTAPartyInvite</code>
The currently active party invitation. Falsy if the bot has not been invited.

**Kind**: instance property of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+launch"></a>

#### dota2Client.launch()
Reports to Steam that you're playing Dota 2, and then initiates communication with the Game Coordinator.

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+exit"></a>

#### dota2Client.exit()
Stop sending a heartbeat to the GC and report to steam you're no longer playing Dota 2

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+joinChat"></a>

#### dota2Client.joinChat(channel_name, [channel_type])
Joins a chat channel. If the chat channel with the given name doesn't exist, it 
is created. Listen for the `chatMessage` event for other people's chat messages.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| channel_name | <code>string</code> |  | Name of the chat channel |
| [channel_type] | <code>DOTAChatChannelType_t</code> | <code>DOTAChatChannelType_t.DOTAChatChannelType_Custom</code> | The type of the channel being joined |

<a name="module_Dota2.Dota2Client+leaveChat"></a>

#### dota2Client.leaveChat(channel_name, [channel_type])
Leaves a chat channel. If you've joined different channels with the same name,
specify the type to prevent unexpected behaviour.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channel_name | <code>string</code> | Name of the chat channel |
| [channel_type] | <code>DOTAChatChannelType_t</code> | The type of the channel being joined |

<a name="module_Dota2.Dota2Client+sendMessage"></a>

#### dota2Client.sendMessage(message, channel_name, [channel_type])
Sends a message to the specified chat channel. Won't send if you're not in the channel you try to send to.
If you've joined different channels with the same name, specify the type to prevent unexpected behaviour.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message you want to send |
| channel_name | <code>string</code> | Name of the chat channel |
| [channel_type] | <code>DOTAChatChannelType_t</code> | The type of the channel being joined |

<a name="module_Dota2.Dota2Client+shareLobby"></a>

#### dota2Client.shareLobby(channel_name, [channel_type])
Shares the lobby you're currently in with the chat so other people can join.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channel_name | <code>string</code> | Name of the chat channel |
| [channel_type] | <code>DOTAChatChannelType_t</code> | The type of the channel being joined |

<a name="module_Dota2.Dota2Client+flipCoin"></a>

#### dota2Client.flipCoin(channel_name, [channel_type])
Sends a coin flip to the specified chat channel. Won't send if you're not in the channel you try to send to.
If you've joined different channels with the same name, specify the type to prevent unexpected behaviour.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channel_name | <code>string</code> | Name of the chat channel |
| [channel_type] | <code>DOTAChatChannelType_t</code> | The type of the channel being joined |

<a name="module_Dota2.Dota2Client+rollDice"></a>

#### dota2Client.rollDice(min, max, channel_name, [channel_type])
Sends a dice roll to the specified chat channel. Won't send if you're not in the channel you try to send to.
If you've joined different channels with the same name, specify the type to prevent unexpected behaviour.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>number</code> | Lower bound of the dice roll |
| max | <code>number</code> | Upper bound of the dice roll |
| channel_name | <code>string</code> | Name of the chat channel |
| [channel_type] | <code>DOTAChatChannelType_t</code> | The type of the channel being joined |

<a name="module_Dota2.Dota2Client+requestChatChannels"></a>

#### dota2Client.requestChatChannels()
Requests a list of chat channels from the GC. Listen for the `chatChannelsData` event for the GC's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+requestPlayerMatchHistory"></a>

#### dota2Client.requestPlayerMatchHistory(account_id, [options], [callback])
Requests the given player's match history. The responses are paginated, 
but you can use the `start_at_match_id` and `matches_requested` options to loop through them.
Provide a callback or listen for the [playerMatchHistoryData](#module_Dota2.Dota2Client+event_playerMatchHistoryData) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| account_id | <code>number</code> |  | Dota 2 account ID of the player whose match history the bot should fetch |
| [options] | <code>Object</code> |  | Filtering options |
| [options.start_at_match_id] | <code>number</code> |  | Which match ID to start searching at (pagination) |
| [options.matches_requested] | <code>number</code> |  | How many matches to retrieve |
| [options.hero_id] | <code>number</code> |  | Show only matches where player played the given hero |
| [options.request_id] | <code>number</code> | <code>account_id</code> | A unique identifier that identifies this request |
| [options.include_practice_matches] | <code>boolean</code> |  | Whether or not to include practice matches in the results |
| [options.include_custom_games] | <code>boolean</code> |  | Whether or not to include custom games in the results |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) |  | Called with `err, CMsgDOTAGetPlayerMatchHistoryResponse` |

<a name="module_Dota2.Dota2Client+requestProfileCard"></a>

#### dota2Client.requestProfileCard(account_id, [callback])
Sends a message to the Game Coordinator requesting `account_id`'s profile card. 
This method is heavily rate limited. When abused, the GC just stops responding.
Even the regular client runs into this limit when you check too many profiles.
Provide a callback or listen for [profileCardData](#module_Dota2.Dota2Client+event_profileCardData) event for Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota 2 account ID of the player whose profile card the bot should fetch |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgDOTAProfileCard` |

<a name="module_Dota2.Dota2Client+requestProfile"></a>

#### dota2Client.requestProfile(account_id, [callback])
Sends a message to the Game Coordinator requesting `account_id`'s profile page. 
This method is heavily rate limited. When abused, the GC just stops responding.
Even the regular client runs into this limit when you check too many profiles.
Provide a callback or listen for [profileData](#module_Dota2.Dota2Client+event_profileData) event for Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota 2 account ID of the player whose profile page the bot should fetch |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgDOTAProfileResponse` |

<a name="module_Dota2.Dota2Client+requestHallOfFame"></a>

#### dota2Client.requestHallOfFame(week, [callback])
Sends a message to the Game Coordinator requesting the Hall of Fame data for `week`. 
Provide a callback or listen for the [hallOfFameData](#module_Dota2.Dota2Client+event_hallOfFameData) event for the Game Coordinator's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| week | <code>number</code> | The week of which you wish to know the Hall of Fame members; will return latest week if omitted. Weeks are counted from start of unix epoch with a lower bound of 2233 (2012-10-18) |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgDOTAHallOfFameResponse` |

<a name="module_Dota2.Dota2Client+requestPlayerInfo"></a>

#### dota2Client.requestPlayerInfo(account_ids)
Sends a message to the Game Coordinator requesting one or multiple `account_ids` player information. 
This includes their display name, country code, team info and sponsor, fantasy role, official information lock status, and if the user is marked as a pro player. 
Listen for the [playerInfoData](#module_Dota2.Dota2Client+event_playerInfoData) event for the Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_ids | <code>number</code> \| <code>Array.&lt;number&gt;</code> | Either a single or array of Account IDs (lower 32-bits of a 64-bit Steam ID) of desired user(s) player info. |

<a name="module_Dota2.Dota2Client+requestTrophyList"></a>

#### dota2Client.requestTrophyList(account_id, [callback])
Sends a message to the Game Coordinator requesting `account_id`'s trophy data. 
Provide a callback or listen for [trophyListData](#module_Dota2.Dota2Client+event_trophyListData) event for Game Coordinator's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota 2 account ID of the player whose trophy data the bot should fetch |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgClientToGCGetTrophyListResponse` |

<a name="module_Dota2.Dota2Client+requestPlayerStats"></a>

#### dota2Client.requestPlayerStats(account_id, [callback])
Sends a message to the Game Coordinator requesting `account_id`'s player stats. 
Provide a callback or listen for [playerStatsData](#module_Dota2.Dota2Client+event_playerStatsData) event for Game Coordinator's response. 
This data contains all stats shown on a player's profile page.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota 2 account ID of the player whose player stats the bot should fetch |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgGCToClientPlayerStatsResponse` |

<a name="module_Dota2.Dota2Client+tipPlayer"></a>

#### dota2Client.tipPlayer(account_id, steam_id, steam_id)
Attempts to tip a player for his performance during a match. Listen for the `tipResponse` event for the GC's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | The Dota2 ID of the player you want to tip. |
| steam_id | [<code>Long</code>](#external_Long) | The match ID for which you want to tip a player. |
| steam_id | <code>number</code> | The event ID during which you want to tip a player. |

<a name="module_Dota2.Dota2Client+requestJoinableCustomGameModes"></a>

#### dota2Client.requestJoinableCustomGameModes([server_region])
Requests a list of custom game modes for which there are currently lobbies available.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [server_region] | <code>ServerRegion</code> | <code>ServerRegion.UNSPECIFIED</code> | The server region for which you'd like to obtain the joinable custom game modes |

<a name="module_Dota2.Dota2Client+requestPlayerCardsByPlayer"></a>

#### dota2Client.requestPlayerCardsByPlayer() ⇒ <code>Array.&lt;FantasyPlayer&gt;</code>
Requests the player stats for each of the players for which you have one or multiple player cards.
All requests are staggered in 200ms intervals and time out after 2s.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+requestPlayerCardsByPlayer.FantasyPlayer"></a>

##### requestPlayerCardsByPlayer.FantasyPlayer : <code>Object</code>
Player with player cards

**Kind**: static typedef of [<code>requestPlayerCardsByPlayer</code>](#module_Dota2.Dota2Client+requestPlayerCardsByPlayer)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota2 account ID of the player |
| cards | <code>Array.&lt;Object&gt;</code> | Player cards of this player in the bot's inventory |
| cards[].id | <code>number</code> | ID of the card |
| cards[].bonuses | <code>Array.&lt;Object&gt;</code> | Array of bonuses that apply to this card |
| cards[].bonuses[].type | [<code>FantasyStats</code>](#module_Dota2.FantasyStats) | The stat that gets a bonus |
| cards[].bonuses[].value | <code>number</code> | Percentage bonus for the stat |
| stats | [<code>CMsgGCToClientPlayerStatsResponse</code>](#module_Dota2.schema.CMsgGCToClientPlayerStatsResponse) | Player stats |

<a name="module_Dota2.Dota2Client+requestPlayerCardRoster"></a>

#### dota2Client.requestPlayerCardRoster(league_id, timestamp, [callback])
Sends a message to the Game Coordinator requesting your fantasy line-up for a specific day of a given tournament. 
Provide a callback or listen for the [playerCardRoster](#module_Dota2.Dota2Client+event_playerCardRoster) event for the Game Coordinator's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| league_id | <code>number</code> | ID of the league |
| timestamp | <code>number</code> | Date in timeframe of the league |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgClientToGCGetPlayerCardRosterResponse` |

<a name="module_Dota2.Dota2Client+draftPlayerCard"></a>

#### dota2Client.draftPlayerCard(league_id, timestamp, slot, player_card_id, [callback])
Sends a message to the Game Coordinator requesting to draft a certain player card in a specific slot, for a given day in a tournament. 
Provide a callback or listen for the [playerCardDrafted](#module_Dota2.Dota2Client+event_playerCardDrafted) event for the Game Coordinator's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| league_id | <code>number</code> | ID of the league for which you're drafting a player card |
| timestamp | <code>number</code> | Timestamp of the day for which you want to draft a player card |
| slot | <code>number</code> | Slot in the draft which you want to fill |
| player_card_id | <code>number</code> | Item ID of the player card you want to draft |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgClientToGCSetPlayerCardRosterResponse` |

<a name="module_Dota2.Dota2Client+setItemPositions"></a>

#### dota2Client.setItemPositions(item_positions)
Attempts to change the position of one or more items in your inventory.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| item_positions | <code>Array.&lt;Object&gt;</code> | The new positions of the items |
| item_positions[].item_id | <code>number</code> | ID of the item |
| item_positions[].position | <code>number</code> | New position of the item |

<a name="module_Dota2.Dota2Client+deleteItem"></a>

#### dota2Client.deleteItem(item_id)
Attempts to delete an item in your inventory.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| item_id | <code>number</code> | ID of the item |

<a name="module_Dota2.Dota2Client+requestLeagueInfo"></a>

#### dota2Client.requestLeagueInfo()
Requests info on all available official leagues from the GC.
Listen for the [leagueData](#module_Dota2.Dota2Client+event_leagueData) event for the Game Coordinator's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+requestTopLeagueMatches"></a>

#### dota2Client.requestTopLeagueMatches()
Sends a message to the Game Coordinator requesting the top league matches.
Listen for the [topLeagueMatchesData](#module_Dota2.Dota2Client+event_topLeagueMatchesData) event for the Game Coordinator's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+createPracticeLobby"></a>

#### dota2Client.createPracticeLobby(options, [callback])
Sends a message to the Game Coordinator requesting to create a lobby. 
This will automatically make the bot join the first slot on radiant team. Listen for
[practiceLobbyUpdate](#module_Dota2.Dota2Client+event_practiceLobbyUpdate) response for a
snapshot-update of the newly created lobby.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#module_Dota2.Dota2Client+Lobby.Options) | Configuration options for the lobby |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+_createPracticeLobby"></a>

#### ~~dota2Client._createPracticeLobby()~~
***Deprecated***

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+createTournamentLobby"></a>

#### ~~dota2Client.createTournamentLobby()~~
***Deprecated***

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+configPracticeLobby"></a>

#### dota2Client.configPracticeLobby(lobby_id, options, [callback])
Sends a message to the Game Coordinator requesting to configure some options of the active lobby. 
Listen for [practiceLobbyUpdate](#module_Dota2.Dota2Client+event_practiceLobbyUpdate) response 
for a snapshot-update of the newly created lobby.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| lobby_id | [<code>Long</code>](#external_Long) | ID of the lobby |
| options | [<code>Options</code>](#module_Dota2.Dota2Client+Lobby.Options) | The new option values |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+requestPracticeLobbyList"></a>

#### dota2Client.requestPracticeLobbyList([callback])
Requests a lists of joinable practice lobbies.
Provide a callback or listen for the [practiceLobbyListData](#module_Dota2.Dota2Client+event_practiceLobbyListData) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyListResponse` |

<a name="module_Dota2.Dota2Client+requestFriendPracticeLobbyList"></a>

#### dota2Client.requestFriendPracticeLobbyList([callback])
Requests a lists of joinable practice lobbies which have one of your friends in them.
Provide a callback or listen for the [friendPracticeLobbyListData](#module_Dota2.Dota2Client+event_friendPracticeLobbyListData) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgFriendPracticeLobbyListResponse` |

<a name="module_Dota2.Dota2Client+balancedShuffleLobby"></a>

#### dota2Client.balancedShuffleLobby([callback])
Shuffles the lobby based on skill level. Requires you to be in a lobby and to be the host.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+flipLobbyTeams"></a>

#### dota2Client.flipLobbyTeams([callback])
Flips the radiant and dire team players. Requires you to be in a lobby and to be the host.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+inviteToLobby"></a>

#### dota2Client.inviteToLobby(steam_id)
Asks to invite a player to your lobby. This creates a new default lobby when you are not already in one.
Listen for the [inviteCreated](#module_Dota2.Dota2Client+event_inviteCreated) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| steam_id | [<code>Long</code>](#external_Long) | The Steam ID of the player you want to invite. |

<a name="module_Dota2.Dota2Client+practiceLobbyKick"></a>

#### dota2Client.practiceLobbyKick(account_id, [callback])
Asks to kick someone from your current practice lobby. Requires you to be in a lobby and to be the host.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | The Dota2 account ID of the player you want to kick. |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+practiceLobbyKickFromTeam"></a>

#### dota2Client.practiceLobbyKickFromTeam(account_id, [callback])
Asks to kick someone from his chosen team in your current practice lobby.
The player will be added to the player pool
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | The Dota2 account ID of the player you want to kick from his team. |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+joinPracticeLobby"></a>

#### dota2Client.joinPracticeLobby(id, password, [callback])
Sends a message to the Game Coordinator requesting to join a lobby.
Provide a callback or listen for the [practiceLobbyJoinResponse](#module_Dota2.Dota2Client+event_practiceLobbyJoinResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>externalLong</code> | The ID of the lobby |
| password | <code>number</code> | The password of the lobby |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+leavePracticeLobby"></a>

#### dota2Client.leavePracticeLobby([callback])
Sends a message to the Game Coordinator requesting to leave the current lobby.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+destroyLobby"></a>

#### dota2Client.destroyLobby([callback])
Destroy the current lobby. Requires you to be the host.
Provide a callback or listen for the [lobbyDestroyed](#module_Dota2.Dota2Client+event_lobbyDestroyed) event for the GC's response.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgDOTADestroyLobbyResponse` |

<a name="module_Dota2.Dota2Client+abandonCurrentGame"></a>

#### dota2Client.abandonCurrentGame([callback])
Abandons the current game.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+launchPracticeLobby"></a>

#### dota2Client.launchPracticeLobby([callback])
Start the practice lobby. The bot will continue to receive lobby updates, but won't join the actual game.
Requires you to be in a lobby and to be the host.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+joinPracticeLobbyTeam"></a>

#### dota2Client.joinPracticeLobbyTeam(slot, team, [callback])
Sends a message to the Game Coordinator requesting to join a particular team in the lobby.
Requires you to be in a lobby.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| slot | <code>number</code> | The slot you want to join |
| team | <code>number</code> | The team you want to join |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+joinPracticeLobbyBroadcastChannel"></a>

#### dota2Client.joinPracticeLobbyBroadcastChannel([channel], [callback])
Sends a message to the Game Coordinator requesting to add a bot to the broadcast channel.
Requires you to be in a lobby.
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [channel] | <code>number</code> | <code>1</code> | The channel slot you want to fill |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) |  | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+addBotToPracticeLobby"></a>

#### dota2Client.addBotToPracticeLobby(slot, team, bot_difficulty, [callback])
Sends a message to the Game Coordinator requesting to add a bot to the given team in the lobby.
Requires you to be in a lobby and to be the host
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| slot | <code>number</code> | The slot you want to add a bot to |
| team | <code>number</code> | The team you want to add a bot to |
| bot_difficulty | [<code>BotDifficulty</code>](#module_Dota2.BotDifficulty) | The difficulty setting of the bot. |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgPracticeLobbyJoinResponse` |

<a name="module_Dota2.Dota2Client+respondLobbyInvite"></a>

#### dota2Client.respondLobbyInvite(id, accept)
Sends a message to the Game Coordinator confirming/denying a lobby invitation
Provide a callback or listen for the [practiceLobbyResponse](#module_Dota2.Dota2Client+event_practiceLobbyResponse) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | [<code>Long</code>](#external_Long) | The ID of the lobby |
| accept | <code>boolean</code> | Whether or not you accept the invitation. |

<a name="module_Dota2.Dota2Client+requestMatches"></a>

#### dota2Client.requestMatches([criteria], [callback])
Requests a list of matches corresponding to the given criteria. The responses are paginated, 
but you can use the `start_at_match_id` and `matches_requested` options to loop through them.
Provide a callback or listen for the [matchesData](#module_Dota2.Dota2Client+event_matchesData) event for the GC's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [criteria] | <code>Object</code> |  | Filtering options |
| [criteria.hero_id] | <code>number</code> |  | Show only matches where someone played the given hero |
| [criteria.game_mode] | <code>number</code> |  | Game mode |
| [criteria.start_at_match_id] | <code>number</code> |  | Which match ID to start searching at (pagination) |
| [criteria.matches_requested] | <code>number</code> | <code>1</code> | How many matches to retrieve |
| [criteria.min_players] | <code>number</code> |  | Minimum number of players present during the match |
| [criteria.request_id] | <code>number</code> |  | A unique identifier that identifies this request |
| [criteria.tournament_games_only] | <code>boolean</code> |  | Whether or not to only include tournament games |
| [criteria.account_id] | <code>number</code> |  | Dota2 account ID of a player that needs to be present in all matches |
| [criteria.league_id] | <code>number</code> |  | Show only matches from the league with this ID |
| [criteria.skill] | <code>number</code> |  | Skill level of the matches. 0 = Any, 3 = Very high skill. |
| [criteria.team_id] | <code>number</code> |  | Team ID of the team that's played in the matches |
| [criteria.custom_game_id] | <code>number</code> |  | Show only custom games with the given ID |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) |  | Called with `err, CMsgDOTARequestMatchesResponse` |

<a name="module_Dota2.Dota2Client+requestMatchDetails"></a>

#### dota2Client.requestMatchDetails(match_id, [callback])
Sends a message to the Game Coordinator requesting the match details for the given match ID. 
This method is rate limited. When abused, the GC just stops responding.
Provide a callback or listen for [matchDetailsData](#module_Dota2.Dota2Client+event_matchDetailsData) event for Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| match_id | <code>number</code> | Match ID for which the bot should fetch the details |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgGCMatchDetailsResponse` |

<a name="module_Dota2.Dota2Client+requestMatchMinimalDetails"></a>

#### dota2Client.requestMatchMinimalDetails(match_id, [callback])
Sends a message to the Game Coordinator requesting the minimal match details for the given match ID. 
This method is rate limited. When abused, the GC just stops responding.
Provide a callback or listen for [matchMinimalDetailsData](#module_Dota2.Dota2Client+event_matchMinimalDetailsData) event for Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| match_id | <code>number</code> | Match ID for which the bot should fetch the minimal details |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgClientToGCMatchesMinimalResponse` |

<a name="module_Dota2.Dota2Client+requestMatchmakingStats"></a>

#### dota2Client.requestMatchmakingStats()
Sends a message to the Game Coordinator requesting the current match making stats. 
Listen for [matchmakingStatsData](#module_Dota2.Dota2Client+event_matchmakingStatsData) event for Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+requestTopFriendMatches"></a>

#### dota2Client.requestTopFriendMatches()
Sends a message to the Game Coordinator requesting the current top matches played by your friends. 
Listen for [topFriendMatchesData](#module_Dota2.Dota2Client+event_topFriendMatchesData) event for Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+respondPartyInvite"></a>

#### dota2Client.respondPartyInvite(id, [accept], [ping_data])
Responds to a party invite.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | [<code>Long</code>](#external_Long) |  | The party's ID |
| [accept] | <code>boolean</code> | <code>false</code> | Whether or not you accept the invite |
| [ping_data] | <code>CMsgClientPingData</code> |  | Optional argument that can be provided when accepting an invite. Contains a.o. the ping to the different servers. |

<a name="module_Dota2.Dota2Client+leaveParty"></a>

#### dota2Client.leaveParty()
Leaves the current party. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+setPartyLeader"></a>

#### dota2Client.setPartyLeader(steam_id)
Tries to assign a party member as party leader. 
Only works if you are a party leader and the proposed user is a member of 
the current party.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| steam_id | [<code>Long</code>](#external_Long) | The Steam ID of the new party leader |

<a name="module_Dota2.Dota2Client+setPartyCoach"></a>

#### dota2Client.setPartyCoach(coach)
Announces whether or not you want to be coach of the current party. GC will take action accordingly.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| coach | <code>boolean</code> | True if you want to be coach, false if you no longer want to be coach |

<a name="module_Dota2.Dota2Client+inviteToParty"></a>

#### dota2Client.inviteToParty(steam_id)
Invite a player to your party.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| steam_id | [<code>Long</code>](#external_Long) | Steam ID of the player you want to invite |

<a name="module_Dota2.Dota2Client+kickFromParty"></a>

#### dota2Client.kickFromParty(steam_id)
Kick a player from your party. Only works if you're party leader.
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| steam_id | [<code>Long</code>](#external_Long) | Steam ID of the player you want to kick |

<a name="module_Dota2.Dota2Client+requestSourceTVGames"></a>

#### dota2Client.requestSourceTVGames(filter_options)
Requests a list of SourceTV games based on the given criteria. 
Listen for [sourceTVGamesData](#module_Dota2.Dota2Client+event_sourceTVGamesData) for results
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| filter_options | <code>CSourceTVGameSmall</code> | Filter options. Check the protobuf for a full list. |
| filter_options.league_id | <code>number</code> | ID of a league |
| filter_options.hero_id | <code>number</code> | ID of a hero that must be present in the game |
| filter_options.start_game | <code>number</code> | Number of pages sent, only values in [0, 10, 20, ... 90] are valid, and yield [1,2,3 ... 10] responses |

<a name="module_Dota2.Dota2Client+requestMyTeams"></a>

#### dota2Client.requestMyTeams([callback])
Sends a message to the Game Coordinator requesting the authenticated user's team data.
Provide a callback or listen for [teamData](#module_Dota2.Dota2Client+event_teamData) for the Game Coordinator's response. 
Requires the GC to be [ready](#module_Dota2.Dota2Client+event_ready).

**Kind**: instance method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>requestCallback</code>](#module_Dota2..requestCallback) | Called with `err, CMsgDOTATeamsInfo` |

<a name="module_Dota2.Dota2Client+event_ready"></a>

#### "ready"
Emitted when the connection with the GC has been established 
and the client is ready to take requests.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+event_unhandled"></a>

#### "unhandled" (kMsg, kMsg_name)
Emitted when the GC sends a message that isn't yet treated by the library.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| kMsg | <code>number</code> | Proto message type ID |
| kMsg_name | <code>string</code> | Proto message type name |

<a name="module_Dota2.Dota2Client+event_hellotimeout"></a>

#### "hellotimeout"
Emitted when the connection with the GC takes longer than 30s

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+event_inventoryUpdate"></a>

#### "inventoryUpdate" (inventory)
Emitted when the GC sends an inventory snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when a change was made to your inventory (e.g. drop)
Note that the [Inventory](#module_Dota2.Dota2Client+Inventory) property will be the old value until after this event
completes to allow comparison between the two.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| inventory | <code>Array.&lt;CSOEconItem&gt;</code> | A list of `CSOEconItem` objects |

<a name="module_Dota2.Dota2Client+event_gotItem"></a>

#### "gotItem" (item)
Emitted when you receive an item through a trade. 
Note that the [Inventory](#module_Dota2.Dota2Client+Inventory) property will be the old value until after this event
completes to allow comparison between the two.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>CSOEconItem</code> | `CSOEconItem` object describing the received item |

<a name="module_Dota2.Dota2Client+event_gaveItem"></a>

#### "gaveItem" (item)
Emitted when you trade away an item. 
Note that the [Inventory](#module_Dota2.Dota2Client+Inventory) property will be the old value until after this event
completes to allow comparison between the two.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>CSOEconItem</code> | `CSOEconItem` object describing the traded item |

<a name="module_Dota2.Dota2Client+event_practiceLobbyUpdate"></a>

#### "practiceLobbyUpdate" (lobby)
Emitted when the GC sends a lobby snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when a lobby has been entered / created
successfully as well. Note that the [Lobby](#module_Dota2.Dota2Client+Lobby) property will be the old
value until after this event completes to allow comparison between the
two.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| lobby | <code>CSODOTALobby</code> | The new state of the lobby. |

<a name="module_Dota2.Dota2Client+event_practiceLobbyCleared"></a>

#### "practiceLobbyCleared"
Emitted when leaving a lobby (aka, the lobby is cleared). This can
happen when kicked, upon leaving a lobby, etc. There are other events
to tell when the bot has been kicked.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+event_lobbyInviteUpdate"></a>

#### "lobbyInviteUpdate" (lobbyInvite)
Emitted when the bot received an invite to a lobby

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| lobbyInvite | <code>CSODOTALobbyInvite</code> | The invitation to a lobby. |

<a name="module_Dota2.Dota2Client+event_lobbyInviteCleared"></a>

#### "lobbyInviteCleared"
Emitted when the Lobby Invite is cleared, for example when
accepting/rejecting it or when the lobby is closed.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+event_partyUpdate"></a>

#### "partyUpdate" (party)
Emitted when the GC sends a party snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when a party has been entered / created
successfully as well. Note that the [Party](#module_Dota2.Dota2Client+Party) property will be the old
value until after this event completes to allow comparison between the
two.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| party | <code>CSODOTAParty</code> | The new state of the party. |

<a name="module_Dota2.Dota2Client+event_partyCleared"></a>

#### "partyCleared"
Emitted when leaving a party (aka, the party is cleared). This can
happen when kicked, upon leaving a party, etc. There are other callbacks
to tell when the bot has been kicked.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+event_partyInviteUpdate"></a>

#### "partyInviteUpdate" (partyInvite)
Emitted when the GC sends a party invite snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when an incoming party invite has been sent.
Note that the [PartyInvite](#module_Dota2.Dota2Client+PartyInvite) property will be the old
value until after this event completes to allow comparison between the two.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| partyInvite | <code>CSODOTAPartyInvite</code> | The invitation to a party. |

<a name="module_Dota2.Dota2Client+event_partyInviteCleared"></a>

#### "partyInviteCleared"
Emitted when the Party Invite is cleared, for example when
accepting/rejecting it or when the party is closed

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
<a name="module_Dota2.Dota2Client+event_chatJoined"></a>

#### "chatJoined" (channelData)
Event that's emitted whenever the bot joins a chat channel

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channelData | <code>Object</code> | A `CMsgDOTAJoinChatChannelResponse` object containing information about the chat channel. |

<a name="module_Dota2.Dota2Client+event_chatJoin"></a>

#### "chatJoin" (channel, joiner_name, joiner_steam_id, otherJoined_object)
Event that's emitted whenever someone else joins a chat channel the bot is in

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>string</code> | Name of the chat channel someone joined |
| joiner_name | <code>string</code> | Persona name of the person that joined the channel |
| joiner_steam_id | [<code>Long</code>](#external_Long) | Steam ID of the person that joined the channel |
| otherJoined_object | <code>CMsgDOTAOtherJoinedChatChannel</code> | The raw message data. |

<a name="module_Dota2.Dota2Client+event_chatLeave"></a>

#### "chatLeave" (channel, leaver_steam_id, otherLeft_object)
Event that's emitted whenever someone else leaves a chat channel the bot is in

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>string</code> | Name of the chat channel someone left |
| leaver_steam_id | <code>string</code> | Persona name of the person that left the channel |
| otherLeft_object | <code>CMsgDOTAOtherLeftChatChannel</code> | The raw message data. |

<a name="module_Dota2.Dota2Client+event_chatLeft"></a>

#### "chatLeft" (channel)
Event that's emitted whenever the bot left a chat channel

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>string</code> | Name of the chat channel the bot left |

<a name="module_Dota2.Dota2Client+event_chatMessage"></a>

#### "chatMessage" (channel, sender_name, message, chatData)
Event that's emitted whenever someone sends a message in a channel the bot is in

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>string</code> | Name of the chat channel the message was sent to |
| sender_name | <code>string</code> | Persona name of the sender of the message |
| message | <code>string</code> | The message that was sent |
| chatData | <code>CMsgDOTAChatMessage</code> | The raw message data containing the message and its metadata. |

<a name="module_Dota2.Dota2Client+event_chatChannelsData"></a>

#### "chatChannelsData" (channels)
Event that's emitted after requesting a list of chat channels via [requestChatChannels](#module_Dota2.Dota2Client+requestChatChannels)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| channels | <code>Array.&lt;Object&gt;</code> | An array of ChatChannel objects |
| channels[].channel_name | <code>string</code> | Name of the chat channel |
| channels[].num_members | <code>number</code> | Number of members in the channel |
| channels[].channel_type | <code>DOTAChatChannelType_t</code> | The type of the channel |

<a name="module_Dota2.Dota2Client+event_playerMatchHistoryData"></a>

#### "playerMatchHistoryData" (requestId, matchHistoryResponse)
Emitted in response to a [request for a player's match history](#module_Dota2.Dota2Client+requestPlayerMatchHistory)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| requestId | <code>number</code> | Id of the request to which this event is the answer |
| matchHistoryResponse | <code>CMsgDOTAGetPlayerMatchHistoryResponse</code> | The raw response data containing the user's match history. |

<a name="module_Dota2.Dota2Client+event_profileCardData"></a>

#### "profileCardData" (account_id, profileCardResponse)
Emitted in response to a [request for a player's profile card](#module_Dota2.Dota2Client+requestProfileCard)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota2 account ID of the player whose profile card was fetched. |
| profileCardResponse | <code>CMsgDOTAProfileCard</code> | The raw response data containing the user's profile card. |

<a name="module_Dota2.Dota2Client+event_profileData"></a>

#### "profileData" (profileResponse)
Emitted in response to a [request for a player's profile page](#module_Dota2.Dota2Client+requestProfile)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| profileResponse | <code>CMsgProfileResponse</code> | The raw response data containing the user's profile page. |

<a name="module_Dota2.Dota2Client+event_hallOfFameData"></a>

#### "hallOfFameData" (week, featured_players, featured_farmer, hallOfFameResponse)
Emitted in response to a [request for a player's profile card](#module_Dota2.Dota2Client+requestHallOfFame)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| week | <code>number</code> | Weeks since unix epoch for which the hall of fame data was fetched |
| featured_players | <code>Array.&lt;Object&gt;</code> | This week's featured players |
| featured_players[].account_id | <code>number</code> | Dota2 account id of the featured player |
| featured_players[].hero_id | <code>number</code> | ID of the hero |
| featured_players[].average_scaled_metric | <code>number</code> | Scaled metric of awesomeness |
| featured_players[].num_games | <code>number</code> | The number of games played |
| featured_farmer | <code>Object</code> | This week's featured farmer |
| featured_farmer.account_id | <code>number</code> | Dota2 account id of the featured farmer |
| featured_farmer.hero_id | <code>number</code> | ID of the hero |
| featured_farmer.gold_per_min | <code>number</code> | GPM for the featured match |
| featured_farmer.match_id | <code>number</code> | Match ID of the featured match |
| hallOfFameResponse | <code>CMsgDOTAHallOfFameResponse</code> | The raw response data containing the requested week's hall of fame. |

<a name="module_Dota2.Dota2Client+event_playerInfoData"></a>

#### "playerInfoData" (playerInfoData)
Emitted in response to a [request for a player's info](#module_Dota2.Dota2Client+requestPlayerInfo)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| playerInfoData | <code>Object</code> | A `CMsgGCPlayerInfo` object containing the player's info. |
| playerInfoData.player_infos | <code>Array.&lt;Object&gt;</code> | List of player information |
| playerInfoData.player_infos[].account_id | <code>number</code> | Dota2 account ID of the player |
| playerInfoData.player_infos[].name | <code>string</code> | The display name for the player |
| playerInfoData.player_infos[].country_code | <code>string</code> | The abbreviated country code for the user if available (i.e. `us`, `cn`, etc...) |
| playerInfoData.player_infos[].fantasy_role | <code>number</code> | The role of the player, either core or support, `1` and `2` respectively |
| playerInfoData.player_infos[].team_id | <code>number</code> | The numerical id of the user's team |
| playerInfoData.player_infos[].team_name | <code>string</code> | The name of the team the user is on, ex: `Cloud9` |
| playerInfoData.player_infos[].team_tag | <code>string</code> | The abbreviated tag of a team prepended to a player's name, ex: `C9` |
| playerInfoData.player_infos[].sponsor | <code>string</code> | The sponsor listed in the player's official info, ex: `HyperX` |
| playerInfoData.player_infos[].is_locked | <code>boolean</code> | Whether or not the user's official player info has been locked from editing, `true` or `false` |
| playerInfoData.player_infos[].is_pro | <code>boolean</code> | Whether the player is considered a pro player by Valve, `true` or `false` |
| playerInfoData.player_infos[].locked_until | <code>number</code> | Timestamp indicating end of lock period |
| playerInfoData.player_infos[].timestamp | <code>number</code> | Unknown |

<a name="module_Dota2.Dota2Client+event_trophyListData"></a>

#### "trophyListData" (trophyListResponse)
Emitted in response to a [request for a player's trophy list](#module_Dota2.Dota2Client+requestTrophyList)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| trophyListResponse | <code>Object</code> | A `CMsgClientToGCGetTrophyListResponse` object containing the player's trophy list. |
| trophyListResponse.account_id | <code>number</code> | Dota2 account ID of the player |
| trophyListResponse.trophies | <code>Array.&lt;Object&gt;</code> | List of player trophies |
| trophyListResponse.trophies[].trophy_id | <code>number</code> | Id of the trophy |
| trophyListResponse.trophies[].trophy_score | <code>number</code> | The score this trophy has counted.  This is usually a level, but can represent other things, like number of challenges completed, or coins collected, etc... |
| trophyListResponse.trophies[].last_updated | <code>number</code> | The last time the trophy has been updated, in Unix time |
| trophyListResponse.profile_name | <code>string</code> | The name displayed on the user's dota profile page and profile card |

<a name="module_Dota2.Dota2Client+event_playerStatsData"></a>

#### "playerStatsData" (account_id, playerStatsResponse)
Emitted in response to a [request for a player's stats](#module_Dota2.Dota2Client+requestPlayerStats)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota2 account ID of the player |
| playerStatsResponse | [<code>CMsgGCToClientPlayerStatsResponse</code>](#module_Dota2.schema.CMsgGCToClientPlayerStatsResponse) | The player's stats. |

<a name="module_Dota2.Dota2Client+event_tipResponse"></a>

#### "tipResponse" (tipResponse)
Event that's emitted in response to a [request for tipping a player](#module_Dota2.Dota2Client+tipPlayer)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| tipResponse | <code>CMsgClientToGCGiveTipResponse.Result</code> | Whether or not the tip was successful |

<a name="module_Dota2.Dota2Client+event_tipped"></a>

#### "tipped" (tipper_account_id, tipper_name, recipient_account_id, recipient_name, event_id)
Event that's emitted whenever the bot got tipped

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| tipper_account_id | <code>number</code> | Dota 2 account ID of the person who tipped |
| tipper_name | <code>string</code> | Name of the tipper |
| recipient_account_id | <code>number</code> | Dota 2 account ID of the person who got tipped |
| recipient_name | <code>string</code> | Name of the one who got tipped |
| event_id | <code>number</code> | ID of the event during which the tip occurred |

<a name="module_Dota2.Dota2Client+event_joinableCustomGameModes"></a>

#### "joinableCustomGameModes" (joinableCustomGameModes)
Emitted in response to a [request for joinable custom game modes](#module_Dota2.Dota2Client+requestJoinableCustomGameModes).

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| joinableCustomGameModes | <code>Array.&lt;CMsgJoinableCustomGameModesResponseEntry&gt;</code> | List of joinable custom game modes |

<a name="module_Dota2.Dota2Client+event_playerCardRoster"></a>

#### "playerCardRoster" (playerCardRoster)
Emitted in response to a [request for a player's fantasy roster](#module_Dota2.Dota2Client+requestPlayerCardRoster)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| playerCardRoster | <code>CMsgClientToGCGetPlayerCardRosterResponse</code> | The raw response data containing the fantasy draft and score if available. |

<a name="module_Dota2.Dota2Client+event_playerCardDrafted"></a>

#### "playerCardDrafted" (playerCardRoster)
Emitted in response to a [draft of a player card](#module_Dota2.Dota2Client+draftPlayerCard)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| playerCardRoster | <code>number</code> | The result of the operation. See `CMsgClientToGCSetPlayerCardRosterResponse.result`. |

<a name="module_Dota2.Dota2Client+event_popup"></a>

#### "popup" (id, popup)
Emitted when the server wants the client to create a pop-up

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Type of the pop-up. |
| popup | <code>CMsgDOTAPopup</code> | The raw pop-up object. Can contain further specifications like formattable text |

<a name="module_Dota2.Dota2Client+event_liveLeagueGamesUpdate"></a>

#### "liveLeagueGamesUpdate" (live_league_games)
Emitted when the GC sends a `CMsgDOTALiveLeagueGameUpdate`.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| live_league_games | <code>number</code> | The number of live league games |

<a name="module_Dota2.Dota2Client+event_leagueData"></a>

#### "leagueData" (leagues)
Emitted in response to a [request for league info](#module_Dota2.Dota2Client+requestLeagueInfo).

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| leagues | <code>Array.&lt;Object&gt;</code> | List of all leagues |
| leagues[].league_id | <code>number</code> | ID of the league |
| leagues[].last_match_time | <code>number</code> | Unix timestamp of when the last match took place |
| leagues[].prize_pool_usd | <code>number</code> | Price pool in US$ |
| leagues[].has_live_matches | <code>boolean</code> | Whether or not if there are currently live matches |
| leagues[].is_compendium_public | <code>boolean</code> | Whether or not there is a public compendium |
| leagues[].compendium_version | <code>number</code> | Verion nr of the compendium |
| leagues[].compendium_content_version | <code>number</code> | Version nr of the compendium contents |

<a name="module_Dota2.Dota2Client+event_topLeagueMatchesData"></a>

#### "topLeagueMatchesData" (matches)
Emitted in response to a [request for top league matches](#module_Dota2.Dota2Client+requestTopLeagueMatches).

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| matches | <code>Array.&lt;Object&gt;</code> | List of top matches |
| matches[].match_id | [<code>Long</code>](#external_Long) | Match ID |
| matches[].start_time | <code>number</code> | Unix timestamp of the start of the match |
| matches[].duration | <code>number</code> | Duration of the match in seconds |
| matches[].game_mode | <code>DOTA_GameMode</code> | Game mode |
| matches[].players | <code>CMsgDOTAMatchMinimal.Player</code> | List of all the players in the game, contains id, hero, K/D/A and items |
| matches[].tourney | <code>CMsgDOTAMatchMinimal.Tourney</code> | Information on the league if this is a league match |
| matches[].match_outcome | <code>EMatchOutcome</code> | Who won |

<a name="module_Dota2.Dota2Client+event_lobbyDestroyed"></a>

#### "lobbyDestroyed" (result, response)
Event that's emitted when attempting to destroy the lobby

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>CMsgDOTADestroyLobbyResponse.Result</code> | Result code, 0 is SUCCESS, 1 is ERROR_UNKNOWN |
| response | <code>Object</code> | The raw response object |

<a name="module_Dota2.Dota2Client+event_practiceLobbyJoinResponse"></a>

#### "practiceLobbyJoinResponse" (result, response)
Event that's emitted whenever the bot joins a lobby

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>DOTAJoinLobbyResult</code> | Result code |
| response | <code>Object</code> | The raw response object |
| response.result | <code>DOTAJoinLobbyResult</code> | Result code |

<a name="module_Dota2.Dota2Client+event_practiceLobbyListData"></a>

#### "practiceLobbyListData" (practiceLobbyListResponse)
Event that's emitted in response to a [request for the list of lobbies](#module_Dota2.Dota2Client+requestPracticeLobbyList)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| practiceLobbyListResponse | <code>Object</code> | Raw response object |
| practiceLobbyListResponse.tournament_games | <code>boolean</code> | Whether or not there are tournament games included in the list |
| practiceLobbyListResponse.lobbies | <code>Array.&lt;CMsgPracticeLobbyListResponseEntry&gt;</code> | List of practice lobbies and their details |

<a name="module_Dota2.Dota2Client+event_practiceLobbyResponse"></a>

#### "practiceLobbyResponse" (result, response)
Emitted when an operation changing the state of a lobby was sent to the GC and
processed. This event only contains the acknowledgement by the GC. The actual
update of the lobby state is communicated via [module:Dota2.Dota2Client#practiceLobbyUpdate](module:Dota2.Dota2Client#practiceLobbyUpdate) events.

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>DOTAJoinLobbyResult</code> | Result code |
| response | <code>Object</code> | The raw response object |
| response.result | [<code>EResult</code>](#module_Dota2.EResult) | Result code |

<a name="module_Dota2.Dota2Client+event_friendPracticeLobbyListData"></a>

#### "friendPracticeLobbyListData" (practiceLobbyListResponse)
Event that's emitted in response to a [request for the list of your friends' lobbies](#module_Dota2.Dota2Client+requestPracticeLobbyList)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| practiceLobbyListResponse | <code>Object</code> | Raw response object |
| practiceLobbyListResponse.lobbies | <code>Array.&lt;CMsgPracticeLobbyListResponseEntry&gt;</code> | List of practice lobbies and their details |

<a name="module_Dota2.Dota2Client+event_inviteCreated"></a>

#### "inviteCreated" (steam_id, group_id, is_online)
Event that's emitted whenever the bot attempts to invite someone to a lobby

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| steam_id | [<code>Long</code>](#external_Long) | Steam ID of the person that was invited to the lobby |
| group_id | [<code>Long</code>](#external_Long) | Group ID of the invitation |
| is_online | <code>boolean</code> | Whether or not the invitee is online |

<a name="module_Dota2.Dota2Client+event_matchesData"></a>

#### "matchesData" (requestId, total_results, results_remaining, matches, series, matchResponse)
Emitted in response to a [request for matches](#module_Dota2.Dota2Client+requestMatches)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| requestId | <code>number</code> | Id of the request to which this event is the answer |
| total_results | <code>number</code> | Total number of results corresponding to the query (max 500) |
| results_remaining | <code>number</code> | Total number of results not in this response |
| matches | <code>Array.&lt;CMsgDOTAMatch&gt;</code> | List of match information objects |
| series | <code>Array.&lt;Object&gt;</code> | List of series |
| series[].matches | <code>Array.&lt;CMsgDOTAMatch&gt;</code> | List of match information objects for the matches in this series |
| series[].series_id | <code>number</code> | ID of the series |
| series[].series_type | <code>number</code> | Type of the series |
| matchResponse | <code>CMsgDOTARequestMatchesResponse</code> | A `CMsgDOTARequestMatchesResponse` object containing the raw response. |

<a name="module_Dota2.Dota2Client+event_matchDetailsData"></a>

#### "matchDetailsData" (match_id, matchDetailsResponse)
Emitted in response to a [request for a match's details](#module_Dota2.Dota2Client+requestMatchDetails)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| match_id | <code>number</code> | Match ID for which the details where asked |
| matchDetailsResponse | <code>CMsgGCMatchDetailsResponse</code> | A `CMsgGCMatchDetailsResponse` object containing the raw response. |

<a name="module_Dota2.Dota2Client+event_matchMinimalDetailsData"></a>

#### "matchMinimalDetailsData" (last_match, matchMinimalDetailsResponse)
Emitted in response to a [request for a/multiples match's minimal details](#module_Dota2.Dota2Client+requestMatchMinimalDetails)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| last_match | <code>boolean</code> | Whether or not the last of the requested matches is included in this response |
| matchMinimalDetailsResponse | <code>CMsgClientToGCMatchesMinimalResponse</code> | A `CMsgClientToGCMatchesMinimalResponse` object containing the raw response. |

<a name="module_Dota2.Dota2Client+event_matchmakingStatsData"></a>

#### "matchmakingStatsData" (matchgroups_version, match_groups, matchmakingStatsResponse)
Emitted in response to a [request for the match making stats](#module_Dota2.Dota2Client+requestMatchmakingStats)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| matchgroups_version | <code>number</code> | Version nr of the match groups (these evolve over time). For the current list check [regions.txt](https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/regions.txt) |
| match_groups | <code>Array.&lt;Object&gt;</code> | The different match groups and their stats |
| match_groups[].players_searching | <code>number</code> | The number of people searching for a match |
| match_groups[].auto_region_select_ping_penalty | <code>number</code> | Ping penalty for people searching this region |
| matchmakingStatsResponse | <code>CMsgDOTAMatchmakingStatsResponse</code> | A `CMsgDOTAMatchmakingStatsResponse` object containing the raw response. |

<a name="module_Dota2.Dota2Client+event_topFriendMatchesData"></a>

#### "topFriendMatchesData" (matches)
Emitted in response to a [request for the current top matches played by your friends](#module_Dota2.Dota2Client+requestTopFriendMatches)

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| matches | <code>Array.&lt;CMsgDOTAMatchMinimal&gt;</code> | A list of `CMsgDOTAMatchMinimal` objects containing the minimal match details of the matches your friends are currently playing. |

<a name="module_Dota2.Dota2Client+event_sourceTVGamesData"></a>

#### "sourceTVGamesData" (sourceTVGamesResponse)
sourceTVGamesData event

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| sourceTVGamesResponse | <code>CMsgGCToClientFindTopSourceTVGamesResponse</code> | The raw response data or null if a bad response was received |

<a name="module_Dota2.Dota2Client+event_teamData"></a>

#### "teamData" (teams, league_id)
Emitted in response to a [request for your teams](#module_Dota2.Dota2Client+requestMyTeams).

**Kind**: event emitted by [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  

| Param | Type | Description |
| --- | --- | --- |
| teams | <code>Array.&lt;CMsgDOTATeamInfo&gt;</code> | A list of `CMsgDOTATeamInfo` objects containing information about the teams you're in (name, members, stats, ...) |
| league_id | <code>number</code> | No clue why this is here, nor what it signifies |

<a name="module_Dota2.Dota2Client.ToAccountID"></a>

#### Dota2Client.ToAccountID(steamID) ⇒ <code>number</code>
Converts a 64bit Steam ID to a Dota2 account ID by deleting the 32 most significant bits

**Kind**: static method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
**Returns**: <code>number</code> - Dota2 account ID corresponding with steamID  

| Param | Type | Description |
| --- | --- | --- |
| steamID | <code>string</code> | String representation of a 64bit Steam ID |

<a name="module_Dota2.Dota2Client.ToSteamID"></a>

#### Dota2Client.ToSteamID(accid) ⇒ [<code>Long</code>](#external_Long)
Converts a Dota2 account ID to a 64bit Steam ID

**Kind**: static method of [<code>Dota2Client</code>](#module_Dota2.Dota2Client)  
**Returns**: [<code>Long</code>](#external_Long) - 64bit Steam ID corresponding to the given Dota 2 account ID  

| Param | Type | Description |
| --- | --- | --- |
| accid | <code>string</code> | String representation of a Dota 2 account ID |

<a name="module_Dota2.schema"></a>

### Dota2.schema
Protobuf schema. See [Protobufjs#Root](http://dcode.io/protobuf.js/Root.html). 
This object can be used to obtain special protobuf types.
Object types can be created by `Dota2.schema.lookupType("TypeName").encode(payload :Object).finish();`.
Enum types can be referenced by `Dota2.schema.lookupEnum("EnumName").values`, which returns an object array representing the enum.

**Kind**: static property of [<code>Dota2</code>](#module_Dota2)  
<a name="module_Dota2.schema.CMsgGCToClientPlayerStatsResponse"></a>

#### schema.CMsgGCToClientPlayerStatsResponse : <code>Object</code>
Player statistics

**Kind**: static typedef of [<code>schema</code>](#module_Dota2.schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| account_id | <code>number</code> | Dota2 account ID of the player |
| player_stats | <code>Array.&lt;number&gt;</code> |  |
| match_count | <code>number</code> | Number of matches played |
| mean_gpm | <code>number</code> | Mean GPM per match over the last 20 matches |
| mean_xppm | <code>number</code> | Mean XPPM per match over the last 20 matches |
| mean_lasthits | <code>number</code> | Mean last hits per match over the last 20 matches |
| rampages | <code>number</code> | All time number of rampages |
| triple_kills | <code>number</code> | All time number of triple kills |
| first_blood_claimed | <code>number</code> | All time number of times the player claimed first blood |
| first_blood_given | <code>number</code> | All time number of times the player fed first blood |
| couriers_killed | <code>number</code> | All time number of couriers killed |
| aegises_snatched | <code>number</code> | All time number of aegises snatched |
| cheeses_eaten | <code>number</code> | All time amount of cheese eaten |
| creeps_stacked | <code>number</code> | All time number of camps stacked |
| fight_score | <code>number</code> | Fighting score over the last 20 matches |
| farm_score | <code>number</code> | Farming score over the last 20 matches |
| support_score | <code>number</code> | Support score over the last 20 matches |
| push_score | <code>number</code> | Push score over the last 20 matches |
| versatility_score | <code>number</code> | Hero versatility over the last 20 matches |

<a name="module_Dota2.FantasyStats"></a>

### Dota2.FantasyStats : <code>enum</code>
Enum for the different fantasy stats

**Kind**: static enum of [<code>Dota2</code>](#module_Dota2)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| KILLS | <code>number</code> | <code>0</code> | 
| DEATHS | <code>number</code> | <code>1</code> | 
| CREEPS | <code>number</code> | <code>2</code> | 
| GPM | <code>number</code> | <code>3</code> | 
| TOWERS | <code>number</code> | <code>4</code> | 
| ROSHAN | <code>number</code> | <code>5</code> | 
| TEAMFIGHT | <code>number</code> | <code>6</code> | 
| OBSERVER | <code>number</code> | <code>7</code> | 
| STACKS | <code>number</code> | <code>8</code> | 
| RUNES | <code>number</code> | <code>9</code> | 
| FIRSTBLOOD | <code>number</code> | <code>10</code> | 
| STUNS | <code>number</code> | <code>11</code> | 

<a name="module_Dota2.EResult"></a>

### Dota2.EResult : <code>enum</code>
Enum for all possible `EResult` values

**Kind**: static enum of [<code>Dota2</code>](#module_Dota2)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| k_EResultOK | <code>number</code> | <code>1</code> | 
| k_EResultFail | <code>number</code> | <code>2</code> | 
| k_EResultNoConnection | <code>number</code> | <code>3</code> | 
| k_EResultInvalidPassword | <code>number</code> | <code>5</code> | 
| k_EResultLoggedInElsewhere | <code>number</code> | <code>6</code> | 
| k_EResultInvalidProtocolVer | <code>number</code> | <code>7</code> | 
| k_EResultInvalidParam | <code>number</code> | <code>8</code> | 
| k_EResultFileNotFound | <code>number</code> | <code>9</code> | 
| k_EResultBusy | <code>number</code> | <code>10</code> | 
| k_EResultInvalidState | <code>number</code> | <code>11</code> | 
| k_EResultInvalidName | <code>number</code> | <code>12</code> | 
| k_EResultInvalidEmail | <code>number</code> | <code>13</code> | 
| k_EResultDuplicateName | <code>number</code> | <code>14</code> | 
| k_EResultAccessDenied | <code>number</code> | <code>15</code> | 
| k_EResultTimeout | <code>number</code> | <code>16</code> | 
| k_EResultBanned | <code>number</code> | <code>17</code> | 
| k_EResultAccountNotFound | <code>number</code> | <code>18</code> | 
| k_EResultInvalidSteamID | <code>number</code> | <code>19</code> | 
| k_EResultServiceUnavailable | <code>number</code> | <code>20</code> | 
| k_EResultNotLoggedOn | <code>number</code> | <code>21</code> | 
| k_EResultPending | <code>number</code> | <code>22</code> | 
| k_EResultEncryptionFailure | <code>number</code> | <code>23</code> | 
| k_EResultInsufficientPrivilege | <code>number</code> | <code>24</code> | 
| k_EResultLimitExceeded | <code>number</code> | <code>25</code> | 
| k_EResultRevoked | <code>number</code> | <code>26</code> | 
| k_EResultExpired | <code>number</code> | <code>27</code> | 
| k_EResultAlreadyRedeemed | <code>number</code> | <code>28</code> | 
| k_EResultDuplicateRequest | <code>number</code> | <code>29</code> | 
| k_EResultAlreadyOwned | <code>number</code> | <code>30</code> | 
| k_EResultIPNotFound | <code>number</code> | <code>31</code> | 
| k_EResultPersistFailed | <code>number</code> | <code>32</code> | 
| k_EResultLockingFailed | <code>number</code> | <code>33</code> | 
| k_EResultLogonSessionReplaced | <code>number</code> | <code>34</code> | 
| k_EResultConnectFailed | <code>number</code> | <code>35</code> | 
| k_EResultHandshakeFailed | <code>number</code> | <code>36</code> | 
| k_EResultIOFailure | <code>number</code> | <code>37</code> | 
| k_EResultRemoteDisconnect | <code>number</code> | <code>38</code> | 
| k_EResultShoppingCartNotFound | <code>number</code> | <code>39</code> | 
| k_EResultBlocked | <code>number</code> | <code>40</code> | 
| k_EResultIgnored | <code>number</code> | <code>41</code> | 
| k_EResultNoMatch | <code>number</code> | <code>42</code> | 
| k_EResultAccountDisabled | <code>number</code> | <code>43</code> | 
| k_EResultServiceReadOnly | <code>number</code> | <code>44</code> | 
| k_EResultAccountNotFeatured | <code>number</code> | <code>45</code> | 
| k_EResultAdministratorOK | <code>number</code> | <code>46</code> | 
| k_EResultContentVersion | <code>number</code> | <code>47</code> | 
| k_EResultTryAnotherCM | <code>number</code> | <code>48</code> | 
| k_EResultPasswordRequiredToKickSession | <code>number</code> | <code>49</code> | 
| k_EResultAlreadyLoggedInElsewhere | <code>number</code> | <code>50</code> | 
| k_EResultSuspended | <code>number</code> | <code>51</code> | 
| k_EResultCancelled | <code>number</code> | <code>52</code> | 
| k_EResultDataCorruption | <code>number</code> | <code>53</code> | 
| k_EResultDiskFull | <code>number</code> | <code>54</code> | 
| k_EResultRemoteCallFailed | <code>number</code> | <code>55</code> | 

<a name="module_Dota2.ServerRegion"></a>

### Dota2.ServerRegion : <code>enum</code>
Enum for all server regions. This enum is kept up to date on a best effort base.
For the up-to-date values, check your game's regions.txt or [SteamDB's version](https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/regions.txt)

**Kind**: static enum of [<code>Dota2</code>](#module_Dota2)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| UNSPECIFIED | <code>number</code> | <code>0</code> | 
| USWEST | <code>number</code> | <code>1</code> | 
| USEAST | <code>number</code> | <code>2</code> | 
| EUROPE | <code>number</code> | <code>3</code> | 
| KOREA | <code>number</code> | <code>4</code> | 
| SINGAPORE | <code>number</code> | <code>5</code> | 
| DUBAI | <code>number</code> | <code>6</code> | 
| AUSTRALIA | <code>number</code> | <code>7</code> | 
| STOCKHOLM | <code>number</code> | <code>8</code> | 
| AUSTRIA | <code>number</code> | <code>9</code> | 
| BRAZIL | <code>number</code> | <code>10</code> | 
| SOUTHAFRICA | <code>number</code> | <code>11</code> | 
| PWTELECOMSHANGHAI | <code>number</code> | <code>12</code> | 
| PWUNICOM | <code>number</code> | <code>13</code> | 
| CHILE | <code>number</code> | <code>14</code> | 
| PERU | <code>number</code> | <code>15</code> | 
| INDIA | <code>number</code> | <code>16</code> | 
| PWTELECOMGUANGZHOU | <code>number</code> | <code>17</code> | 
| PWTELECOMZHEJIANG | <code>number</code> | <code>18</code> | 
| JAPAN | <code>number</code> | <code>19</code> | 
| PWTELECOMWUHAN | <code>number</code> | <code>20</code> | 

<a name="module_Dota2.SeriesType"></a>

### Dota2.SeriesType : <code>enum</code>
Enum for different types of series.

**Kind**: static enum of [<code>Dota2</code>](#module_Dota2)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| NONE | <code>number</code> | <code>0</code> | 
| BEST_OF_THREE | <code>number</code> | <code>1</code> | 
| BEST_OF_FIVE | <code>number</code> | <code>2</code> | 

<a name="module_Dota2.BotDifficulty"></a>

### Dota2.BotDifficulty : <code>enum</code>
Enum for different bot difficulty levels.

**Kind**: static enum of [<code>Dota2</code>](#module_Dota2)  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| PASSIVE | <code>number</code> | <code>0</code> | 
| EASY | <code>number</code> | <code>1</code> | 
| MEDIUM | <code>number</code> | <code>2</code> | 
| HARD | <code>number</code> | <code>3</code> | 
| UNFAIR | <code>number</code> | <code>4</code> | 

<a name="module_Dota2..requestCallback"></a>

### Dota2~requestCallback : <code>function</code>
**Kind**: inner typedef of [<code>Dota2</code>](#module_Dota2)  

| Param | Type | Description |
| --- | --- | --- |
| errorCode | <code>number</code> | Null if everything went well, else the error code |
| responseMessage | <code>Object</code> | The response message the GC sent |

<a name="external_Long"></a>

### Dota2~Long
A Long class for representing a 64 bit two's-complement integer value 
derived from the Closure Library for stand-alone use and extended with unsigned support.

**Kind**: inner external of [<code>Dota2</code>](#module_Dota2)  
**See**: [long](https://www.npmjs.com/package/long) npm package  
