node-dota2
========

[![NPM version](https://img.shields.io/npm/v/dota2.svg)](https://npmjs.org/package/dota2 "View this project on NPM")
[![Build Status](https://img.shields.io/travis/Arcana/node-dota2.svg)](https://travis-ci.org/Arcana/node-dota2 "View this project's build information")
[![Dependency Status](https://img.shields.io/david/Arcana/node-dota2.svg)](https://david-dm.org/Arcana/node-dota2 "Check this project's dependencies")

A node-steam plugin for Dota 2, consider it in alpha state.

Check out RJackson1's blog post (his only blog post), [Extending node-dota2](https://blog.rjackson.me/extending-node-dota2/), for a rough overview of adding new functionality to the library.
A fair warning, while the way you search for new functionality is still the same, quite a lot has changed (and been simplified) implementation wise.
It is now easier to implement new functionality than it was back when this blog was written.

## Upgrade guide

### `3.*.*` to `4.*.0`

A few backwards incompatible API changes were included with version 4.0.0.

* The following functions are no longer supported by Valve so they have been commented:
  * `requestPassportData`
  * `requestTeamProfile`
  * `requestTeamIDByName`
  * `requestTeamMemberProfile`
* The `teamData` event now throws an extra parameter `league_id`
* The `matchMakingStatsData` event's first two parameters changed as the old values no longer exist.
* The `matchMinimalDetailsData` event now returns the `last_match` bool as first argument.

## Installation and setup
* `npm install steam; npm install` in the repository root (install Steam first to work around a node-steam#222)
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

##Properties
###AccountID
The current steam ID of the SteamClient converted to Dota 2 Account ID format. Not available until `launch` is called.

###Inventory (hats, not in-match items)
The current player inventory (see CSOEconItem). Null if the bot hasn't received inventory information yet.

###Lobby
The current lobby object (see CSODOTALobby). Null if the bot is not in a lobby.

###Party
The current party object (see CSODOTAParty). Null if the bot is not in a party.

###PartyInvite
The current party invite object (see CSODOTAPartyInvite). Null if the bot does not have an active incoming party invite.

###LobbyInvite
The current lobby invite object (see CSODOTALobbyInvite). Null if the bot does not have an active incoming lobby invite.

## Methods
All methods require the SteamClient instance to be logged on.

### Steam
#### launch()

Reports to Steam that you're playing Dota 2, and then initiates communication with the Game Coordinator.

#### exit()

Tells Steam you were feeding.


###Utilities
#### ToAccountID(steamID)
* Takes an input steam ID in any format and converts it into an int Account ID.

#### ToSteamID(accountID)
* Takes an input Dota 2 acount ID in any format and converts it into a string steam ID.


### Inventory
#### setItemPositions(item_positions)
* `item_positions` - An array of tuples (itemid, position).

Attempts to move items within your inventory to the positions you set. Requires the GC to be ready (listen for the `ready` event before calling).

#### deleteItem(item_id)

Attempts to delete an item. Requires the GC to be ready (listen for the `ready` event before calling).


### Chat
**_In order to send a message, your account must 1. be non-Limited Steam Account 2. have at least 5 Trophy Level_**

#### joinChat(channel_name, [channel_type])
* `channel_name` - A string for the channel name.
* `[channel_type]` - The type of the channel being joined.  Defaults to `Dota2.schema.DOTAChatChannelType_t.DOTAChannelType_Custom`.

Joins a chat channel. If the chat channel with the given name doesn't exist, it 
is created. Listen for the `chatMessage` event for other people's chat messages.

Notable channels:
* `Guild_##########` - The chat channel of the guild with guild_id = ##########
* `Lobby_##########` - The chat channel of the lobby with lobby_id = ##########

#### leaveChat(channel_name, [channel_type])
* `channel_name` - A string for the channel name.
* `[channel_type]` - The type of the channel you want to leave. Use the `Dota2.schema.DOTAChatChannelType_t` enum. 

Leaves a chat channel. If you've joined different channels with the same name, specify the type to prevent unexpected behaviour.

#### sendMessage(channel, message, [channel_type])
* `channel` - A string for the channel name.
* `message` - The message you want to send.
* `[channel_type]` - The type of the channel you want to send a message to. Use the `Dota2.schema.DOTAChatChannelType_t` enum.

Sends a message to the specified chat channel. Won't send if you're not in the channel you try to send to.
If you've joined different channels with the same name, specify the type to prevent unexpected behaviour.

#### flipCoin(channel, [channel_type])
* `channel` - A string for the channel name.
* `[channel_type]` - The type of the channel you want to flip a coin in. Use the `Dota2.schema.DOTAChatChannelType_t` enum. 

Sends a coin flip to the specified chat channel. Won't send if you're not in the channel you try to send to.
If you've joined different channels with the same name, specify the type to prevent unexpected behaviour.

#### rollDice(channel, min, max, [channel_type])
* `channel` - A string for the channel name.
* `min` - Lower bound of the dice roll.
* `max` - Upper bound of the dice roll.
* `[channel_type]` - The type of the channel you want to roll a dice in. Use the `Dota2.schema.DOTAChatChannelType_t` enum. 

Sends a dice roll to the specified chat channel. Won't send if you're not in the channel you try to send to.
If you've joined different channels with the same name, specify the type to prevent unexpected behaviour.

#### requestChatChannels()

Requests a list of chat channels from the GC. Listen for the `chatChannelsData` event for the GC's response.


### Guild
#### requestGuildData()

Sends a request to the GC for new guild data, which returns `guildOpenPartyData` events - telling the client the status of current open parties for each guild, as well as exposing `guildIds` to the client.


#### inviteToGuild(guild_id, target_account_id, [callback])
* `guild_id` - ID of a guild.
* `target_account_id` - Account ID (lower 32-bits of a 64-bit steam id) of user to invite to guild.
* `[callback]` - optional callback, returns args: `err, response`.

Attempts to invite a user to guild. Requires the GC to be ready (listen for the `ready` event before calling).

#### cancelInviteToGuild(guild_id, target_account_id, [callback])
* `guild_id` - ID of a guild.
* `target_account_id` - Account ID (lower 32-bits of a 64-bit steam id) of user whoms guild invite you wish to cancel.
* `[callback]` - optional callback, returns args: `err, response`.

Attempts to cancel a user's guild invitation; use this on your own account ID to reject guild invitations. Requires the GC to be ready (listen for the `ready` event before calling).

#### setGuildAccountRole(guild_id, target_account_id, target_role, [callback])
* `guild_id` - ID of a guild.
* `target_account_id` - Account ID (lower 32-bits of a 64-bit steam id) of user whoms guild invite you wish to cancel.
* `target_role` - Role in guild to have.
  * `0` - Kick member from guild.
  * `1` - Leader.
  * `2` - Officer.
  * `3` - Member.
* `[callback]` - optional callback, returns args: `err, response`.

Attempts to set a user's role within a guild; use this with your own account ID and the 'Member' role to accept guild invitations. Requires the GC to be ready (listen for the `ready` event before calling).

### Team
#### requestMyTeams([callback])
* `[callback]` - optional callback, returns args: `err, response`.

Requests the authenticated user's team data. 

#### requestTeamProfile(team_id, [callback]) - DEPRECATED
* `team_id` - ID of a team
* `[callback]` - optional callback, returns args: `err, response`.

Requests the profile for a given team.

**Warning** protobuf no longer exists, function is now deprecated.

#### requestTeamMemberProfile(steam_id, [callback]) - DEPRECATED
* `steam_id` - Steam ID of the user whose team profile you want
* `[callback]` - optional callback, returns args: `err, response`.

Requests the profile of the team a given user belongs to.

**Warning** protobuf no longer exists, function is now deprecated.

#### requestTeamIDByName(team_name, [callback]) - DEPRECATED
* `team_name` - Name of a team
* `[callback]` - optional callback, returns args: `err, response`.

Requests the ID for a given team name.

**Warning** protobuf no longer exists, function is now deprecated.

#### requestProTeamList([callback]) - STATUS UNKNOWN
* `[callback]` - optional callback, returns args: `err, response`.

Requests the list of pro teams.

**Warning** this request no longer triggers a response from the GC. This might be temporary.

### Community
#### requestPlayerMatchHistory(account_id, [options], [callback])
* `account_id` - Account ID of the user whose match history you wish to retrieve.
* `[options]` - A mapping of options for the query he results:
  * `[start_at_match_id]` - Which match ID to start searching at (pagination)
  * `[matches_requested]` - How many matches to retrieve
  * `[hero_id]` - The ID of the hero the given account ID had played
  * `[request_id]` - I have no idea.
  * `[include_practice_matches]` - Do you want practice matches in the result sets?
  * `[include_custom_games]` - Do you want custom games in the result sets?
* `[callback]` - optional callback, returns args: `err, response`.

Requests the given player's match history. The responses are paginated, but you can use the `start_at_match_id` and `matches_requested` options to loop through them.

Provide a callback or listen for the `playerMatchHistoryData` for the GC's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestProfile(account_id, request_name, [callback]) - DEPRECATED
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose profile data you wish to view.
* `request_name` - Boolean, whether you want the GC to return the accounts current display name.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `account_id`'s profile data. Provide a callback or listen for `profileData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

**Warning** Valve's privacy policy has become stricter since reborn. This function is now reserved for internal use.

#### requestProfileCard (account_id, [callback])
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose profile card you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `account_id`'s profile card. Provide a callback or listen for `profileCardData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestPassportData(account_id, [callback]) - DEPRECATED
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose passport data you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `account_id`'s passport data. Provide a callback or listen for `passportData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).
This function is no longer supported by Valve, it's only left here for historical purposes. It will be removed in a future release.

#### requestHallOfFame([week], [callback])
* `[week]` - The week of which you wish to know the Hall of Fame members; will return latest week if omitted.  Weeks also randomly start at 2233 for some reason, valf please.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting the Hall of Fame data for `week`. Provide a callback or listen for the `hallOfFameData` event for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestPlayerInfo(account_ids)
* `account_ids` - Either a single or array of Account IDs (lower 32-bits of a 64-bit Steam ID) of desired user(s) player info.  

Sends a message to the Game Coordinator requesting one or multiple `account_ids` player information. This includes their display name, country code, team info and sponsor, fantasy role, official information lock status, and if the user is marked as a pro player. Listen for the `playerInfoData` event for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestTrophyList(account_id, [callback])
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose trophy data you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `account_id`'s trophy data. Provide a callback or listen for `trophyListData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling). Notably, this data contains the `profile_name` field, which is the user's name displayed on their profile page in dota.

#### requestPlayerStats(account_id, [callback])
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose player stats you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.
*
Sends a message to the Game Coordinator requesting `account_id`'s player stats. Provide a callback or listen for `playerStatsData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling). This data contains all stats shown on a player's profile page.


### Matches
#### requestMatches(criteria, [callback])
* `[criteria]` - The options available for searching matches:
  * `[hero_id]`
  * `[game_mode]` 
  * `[date_min]`
  * `[date_max]`
  * `[matches_requested]`
  * `[start_at_match_id]`
  * `[min_players]`
  * `[tournament_games_only]`
  * `[account_id]`
  * `[league_id]`
  * `[skill]`
  * `[team_id]` -
* `[callback]` - optional callback, returns args: `err, response`.

Requests matches from the GC matching the given criteria.  Provide a callback or listen for the `matchesData` event for teh Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestMatchDetails(match_id, [callback])
* `match_id` - The match's ID
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `match_id`'s match details. Provide a callback or listen for `matchDetailsData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

Note:  There is a server-side rate-limit of 100 requests per 24 hours on this method.

#### requestMatchMinimalDetails(match_ids, [callback])
 * `match_ids` - The match IDs that you want concise details of
 * `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting the match details for matches corresponding to `match_ids`. Provide a callback or listen for `matchMinimalDetailsData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestMatchmakingStats()

Sends a message to the Game Coordinator requesting some matchmaking stats. Listen for the `matchmakingStatsData` event for the Game Coordinator's response (cannot take a callback because of Steam's backend, or RJackson's incompetence; not sure which). Requires the GC to be ready (listen for the `ready` event before calling).

#### requestTopFriendMatches()

Sends a message to the Game Coordinator requesting the top matches of your friends. Listen for the `topFriendMatchesData` event for the Game Coordinator's response (cannot take a callback because of Steam's backend). Requires the GC to be ready (listen for the `ready` event before calling).


### Parties

### respondPartyInvite(id, accept, [ping_data])
* `id` - Number, party ID.
* `accept` - Accept or decline the invite.
* `[ping_data]` - Optional argument to be provided when accepting a party invite. For contents see `CMsgClientPingData`.

Responds to an incoming party invite. The `PartyInvite` property is cleared after the response has been sent.


### inviteToParty(id)
* `[id]` - The steam ID to invite.

Invites a player to a party. This will create a new party if you aren't in one.


### kickFromParty(id)
* `[id]` - The steam ID to kick.

Kicks a player from the party. This will create a new party if you aren't in one.


### setPartyCoach(coach)
* `[coach]` - Boolean, if the bot wants to be coach or not.

Set the bot's status as a coach.


### setPartyLeader(id)
* `[id]` - The steam ID of new party leader.

Set the new party leader.


### leaveParty()

Leaves the current party. See the `Party` property.


### Lobbies
### respondLobbyInvite(id, accept)
* `[id]` - Practice lobby ID
* `[accept]` - Boolean, whether or not you accept the invitation.

Sends a message to the Game Coordinator confirming a lobby invitation. The `LobbyInvite` property is cleared after the response is sent.

### joinPracticeLobby(id, [password], [callback])
* `[id]` - Practice lobby ID
* `[password]` - Practice lobby password
* `[callback]` - Optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting to join a lobby.  Provide a callback or listen for `practiceLobbyJoinResponse` for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### createPracticeLobby([password], [options], [callback])
* `[password]` - Password to restrict access to the lobby (optional).
* `[options]` - Options available for the lobby. All are optional, but send at least one.
  * `game_name`: String, lobby title.
  * `server_region`: Use the ServerRegion enum.
  * `game_mode`: Use the DOTA_GameMode enum.
  * `game_version`: Use the game version enum.
  * `cm_pick`: Use the DOTA_CM_PICK enum.
  * `allow_cheats`: Boolean, allow cheats.
  * `fill_with_bots`: Boolean, fill available slots with bots?
  * `allow_spectating`: Boolean, allow spectating?
  * `pass_key`: Password.
  * `series_type`: Use the series type enum.
  * `radiant_series_wins`: # of games won so far, e.g. for a Bo3 or Bo5.
  * `dire_series_wins`: # of games won so far, e.g. for a Bo3 or Bo5.
  * `allchat`: Enable all chat for VOIP
  * `league_id`: The league this lobby is being created for. Optional
  * `dota_tv_delay`: Number of seconds the game should be delayed for DotaTV.
  * `custom_game_mode`: TODO.
  * `custom_map_name`: TODO.
  * `custom_difficulty`: TODO.
  * `custom_game_id`: TODO.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting to create a lobby.  Listen for `practiceLobbyUpdate`  response for a snapshot-update of the newly created lobby. Requires the GC to be ready (listen for the `ready` event before calling).

#### createTournamentLobby([password], [tournament_game_id], [tournament_id], [options], [callback])
* `[password]` - See paramter description in [#createPracticeLobby]
* `[tournament_game_id]` - TODO
* `[tournament_id]` - TODO
* `[options]` - See paramter description in [#createPracticeLobby]
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting to create a tournament lobby. Listen for `practiceLobbyUpdate`  response for a snapshot-update of the newly created lobby. Requires the GC to be ready (listen for the `ready` event before calling).

#### joinPracticeLobbyTeam(slot, team, [callback])
* `slot` - The slot you want to fill (1-10)
* `team` - The team you want to be on. Use the `GOTA_GC_TEAM` enum
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting to join a particular team in the lobby. Provide a callback or listen for `practiceLobbyResponse` for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### addBotToPracticeLobby(slot, team, bot_difficulty, [callback])
* `slot` - The slot you want to fill (1-10)
* `team` - The team you want to be on. Use the `DOTA_GC_TEAM` enum
* `bot_difficulty` - The difficulty setting of the bot. Use the `DOTABotDifficulty`enum
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting to add a bot to the given team in the lobby. Provide a callback or listen for `practiceLobbyResponse` for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### joinPracticeLobbyBroadcastChannel(channel, [callback])
  * `channel` - The channel slot you want to fill (default: 1)
  * `[callback]` - optional callback, returns args: `err, response`.

 Sends a message to the Game Coordinator requesting to add a bot to the broadcast channel. Provide a callback or listen for `practiceLobbyResponse` for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### balancedShuffleLobby()

Shuffles the lobby teams.

#### flipLobbyTeams()

Flips the teams in a lobby.

#### configPracticeLobby(lobby_id, options, [callback])
* `lobby_id` - Lobby ID
* `options` - See paramter description in [#createPracticeLobby]
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting to configure some options of the active lobby. Requires the GC to be ready (listen for the `ready` event before calling).

#### launchPracticeLobby()

Sends a message to the GC requesting the currrent lobby be started (server found and game begins). You will receive updates in the `practiceLobbyUpdate` response.

#### inviteToLobby(steam_id)
* `steam_id` The Steam ID of the player you want to invite.

Asks to invite a player to your lobby. This creates a new default lobby when you are not already in one.

#### practiceLobbyKick(account_id, [callback])
* `account_id` The ID of the player you want to kick.

Asks to kick someone from your current practice lobby.

#### practiceLobbyKickFromTeam(account_id, [callback])
* `account_id` The ID of the player you want to kick from the team.

Asks to kick someone from his chosen team in your current practice lobby.

#### leavePracticeLobby()

Sends a message to the Game Coordinator requesting to leave the current lobby.  Requires the GC to be ready (listen for the `ready` event before calling).

#### requestPracticeLobbyList

TODO

#### requestFriendPractiseLobbyList

TODO

### Custom games
#### requestJoinableCustomGameModes([server_region])
* `[region]` - Enum for the server region, defaults to Dota2.ServerRegion.UNSPECIFIED

Sends a message to the Game Coordinator requesting a list of joinable custom games for a given region.

### Leagues
#### requestLeaguesInMonth([month], [year], [tier], [callback])
* `[month]` - Int for the month (MM) you want to query data for.  Defaults to current month. **IMPORTANT NOTE**:  Month is zero-aligned, not one-aligned; so Jan = 00, Feb = 01, etc.
* `[year]`  - Int for the year (YYYY) you want to query data for .  Defaults to current year.
* `[tier]`  - Search only for a specific tier of tournaments. Defaults to 0.
* `[callback]` - optional callback` returns args: `err` response`.

Sends a message to the Game Coordinator requesting data on leagues being played in the given month.  Provide a callback or listen for `leaguesInMonthData` for the Game Coordinator's response.  Requires the GC to be ready (listen for the `ready` event before calling).

#### requestLeagueInfo()

Requests info on all available official leagues from the GC. Listen for `leagueData` for the Game Coordinator's response.  Requires the GC to be ready (listen for the `ready` event before calling).

#### requestTopLeagueMatches()

Sends a message to the Game Coordinator requesting the top league matches. Listen for the `topLeagueMatchesData` event for the Game Coordinator's response (cannot take a callback because of Steam's backend). Requires the GC to be ready (listen for the `ready` event before calling).

### Fantasy
#### requestPlayerCardRoster(league_id, timestamp, [callback])
* `league_id` - ID of the league for which you're requesting your player card roster
* `timestamp` - timestamp of the day for which you want your player card roster
* `[callback]` - optional callback` returns args: `err` response`.
 
Sends a message to the Game Coordinator requesting your fantasy line-up for a specific day of a given tournament. Listen for the `playerCardRoster` event for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### draftPlayerCard(league_id, timestamp, slot, player_card_id, [callback])
* `league_id` - ID of the league for which you're drafting a player card
* `timestamp` - timestamp of the day for which you want to draft a player card
* `slot` - Slot in the draft which you want to fill
* `player_card_id` - Item ID of the player card you want to draft
* `[callback]` - optional callback` returns args: `err` response`.

Sends a message to the Game Coordinator requesting to draft a certain player card in a specific slot, for a given day in a tournament. Listen for the `playerCardDrafted` event for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).
### SourceTV

#### requestSourceTVGames([filterOption])

* `[filterOption]` - Object to override the default filters

Returns a list of current ongoing matches (from live games tab).

Default filterOptions:

```javascript
{
    search_key: '',
    league_id: 0,
    hero_id: 0,
    start_game: 0, // This is not the game offset, only values in [0, 10, 20, ... 90] are valid, and yield [1,2,3 ... 10] responses
    game_list_index: 0,
    lobby_ids: [], // This is for getting player specific matches (pro player) games on the live games list, but where the lobby_ids are derived from is unknown.
}
```

> __Important:__ The useful parameters are `league_id`, `hero_id`, and `start_game`.  The rest have unclear usage conditions.

## Events
### `ready`
Emitted when the GC is ready to receive messages.  Be careful not to declare anonymous functions as event handlers here, as you'll need to be able to invalidate event handlers on an `unready` event.

### `unready`
Emitted when the connection status to the GC changes, and renders the library unavailable to interact.  You should clear any event handlers set in the `ready` event here, otherwise you'll have multiple handlers for each message every time a new `ready` event is sent.

### `popup` (`type`, `popup`)
* `type` - The type of the popup. See `CMsgDOTAPopup.PopupID` 
* `popup` - The raw popup data

Generic popup, can be produced for a plethora of reasons.

### `chatMessage` (`channel`, `senderName`, `message`, `chatObject`)
* `channel` - Channel name.
* `senderName` - Persona name of user who sent message.
* `message` - Wot u think?
* `chatObject` - The raw chat object to do with as you wish.

Emitted for chat messages received from Dota 2 chat channels

### `chatJoin` (`channel`, `joiner_name`, `joiner_steam_id`, `otherJoined_object`)
* `channel` - Channel name.
* `joiner_name` - Persona name of user who joined.
* `joiner_steam_id` - Steam ID of the user who joined.
* `otherJoined_object` - The raw `CMsgDOTAOtherJoinedChatChannel` object for you to do with as you wish.

Emitted when another user joins a chat channel you are in.

### `chatLeave` (`channel`, `leaver_steam_id`, `otherLeft_object`)
* `channel` - Channel name.
* `leaver_steam_id` - Steam ID of the user who left.
* `otherLeft_object` - The raw `CMsgDOTAOtherLeftChatChannel` object for you to do with as you wish.

Emitted when another user leaves a chat channel you are in.

### `chatChannelsData` (`channels`)
* `channels` - An array of ChatChannel objects, each with the following properties:
  * `channel_name`
  * `num_members`
  * `channel_type`

The GC's response to a requestChatChannels call.

### `guildOpenPartyData` (`guild_id`, `openParties`)
* `guild_id` - ID of the guild.
* `openParties` - Array containing information about open guild parties.  Each object has the following properties:
  * `partyId` - Unique ID of the party.
  * `member_account_ids` - Array of account ids.
  * `time_created` - Something about Back to the Future.
  * `description` - A user-inputted string.  Do not trust.

Emitted for each guild the bot's account is a member of, containing information on open parties for each guild.  Also exposes guild_id's, which is handy.

### `guildData` (`guild_id`, `members`, `guildDataObject`)
* `guild_id` - ID of the guild.
* `members` - A list of members in the guild. Each object has the following properties:
  * `account_id` - Account ID of the member.
  * `time_joined` - Timestamp of when this user joined the guild.
  * `role` - Role of the member withing the guild
    * `1` - Leader
    * `2` - Officer
    * `3` - Member
* `guildDataObject` - The raw `CMsgDOTAGuildSDO` object.

Emitted when information on a particular guild is retrieved.

### `guildInviteData` (`guild_id`, `guildName`, `inviter`, `guildInviteDataObject`)
* `guild_id` - ID of the guild.
* `guildName` - Name of the guild.
* `inviter` - Account ID of user whom invited you.
* `guildInviteDataObject` - The raw guildInviteData object to do with as you wish.

You can respond with `cancelInviteToGuild` or `setGuildAccountRole`.

### `teamData` (`teams`, `league_id`)
* `teams` - Array containing the teams the user is in or which are featured on the user's profile. Each object has the following properties:
  * `on_team` - Whether or not the user is on this team
  * `profile_team` - Whether or not this is a team featured on the user's profile
  * `team` - Info about the team. This contains among others:
  * `name` - Name of the team
  * `members` - Account ID and time joined for all members
  * `wins` - All wins
  * `losses` - All losses
  * `gamesplayed` - Total amount of games played
  * `rank` - Team MMR
  * ...
* `league_id` - League ID (no clue as of its meaning, feel free to suggest)

Emitted when GC responds to the `requestMyTeams` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_client.proto#L776) for `team`'s object structure.

### `teamProfile` (`team_id`, `team_info`) - DEPRECATED
* `team_id` - ID of the team.
* `team_info` - Info about the team. This contains among others:
  * `name` - Name of the team
  * `members` - Account ID and time joined for all members
  * `wins` - All wins
  * `losses` - All losses
  * `gamesplayed` - Total amount of games played
  * `rank` - Team MMR
  * ...

Emitted when GC responds to the `requestTeamProfile` and `requestTeamMemberProfile` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_client.proto#L776) for `team_info`'s object structure.

### `teamID` (`team_id`) - DEPRECATED
* `team_id` - ID of the team. Null if none was found.

Emitted when GC responds to the `requestTeamIDByName` method.

### `proTeamListData` (`teams`)
* `teams` - List of team entries
  * `team_id` - ID of the team
  * `tag` - Tag of the team
  * `time_created` - Timestamp when the team was created
  * `logo` - Logo of the team
  * `country_code` - 2 letter country code
  * `member_count`- Number of team members in this team

Emitted when GC responds to the `requestProTeamList` method.

### `profileData` (`account_id`, `profileData`) - DEPRECATED
* `account_id` - Account ID whom the data is associated with.
* `profileData` - The raw profile data object.

Emitted when GC responds to the `requestProfile` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_common.proto#L1584) for `profileData`'s object structure.

### `profileCardData` (`account_id`, `profileCardData`)
* `account_id` - Account ID whom the data is associated with.
* `profileCardData` - The raw profileCard object.

Emitted when GC responds to the `requestProfileCard` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_common.proto#L1584) for `profileCardData`'s object structure.

### `playerInfoData` (`playerInfoResponse`)
* `playerInfoResponse` - The raw playerInfo object.
  * `leaderboards` - Empty array, details unknown.
  * `player_infos` - List of player information
    * `account_id` - The Account ID of the requested user.
    * `name` - The display name for the user.
    * `country_code` - The abbreviated country code for the user, i.e. `us`, `cn`, etc...
    * `fantasy_role` - The role of the player, either core or support, `1` and `2` respectively.
    * `team_id` - The numerical id of the user's team.
    * `team_name` - The name of the team the user is on, ex: `Cloud9`
    * `team_tag` - The abbreviated tag of a team prepended to a player's name, ex: `C9`
    * `sponsor` - The sponsor listed in the player's official info, ex: `HyperX`  
    * `is_locked` - Whether or not the user's official player info has been locked from editing, `true` or `false`.
    * `is_pro` - Whether the player is considered a pro player by Valve, `true` or `false`.

Emitted when GC responds to the `requestPlayerInfo` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_client_fantasy.proto#L159) for `playerInfoData`'s object structure.

### `trophyListData` (`trophyListResponse`)
* `trophyListResponse` - The raw trophyListResponse object.
  * `profile_name` - The name displayed on the user's dota profile page and profile card.
  * `trophies` - List of trophies owned by the user. The following values are all integers.
    *  `trophy_id` - Id of the trophy.
    *  `trophy_score` - The score this trophy has counted.  This is usually a level, but can represent other things, like number of challenges completed, or coins collected, etc...
    *  `last_updated` - The last time the trophy has been updated, in Unix time.

Emitted when GC responds to the `requestTrophyList` method.

### `playerMatchHistoryData` (`request_id`, `matchHistoryResponse`)

TODO

### `passportData` (`account_id`, `passportData`) - DEPRECATED
* `account_id` - Account ID whom the passport belongs to.
* `passportData` - The raw passport data object.

Emitted when GC responds to the `requestPassportData` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_client_fantasy.proto#L961) for `passportData`'s object structure.

### `playerStatsData` (`account_id`, `playerStats`)
* `account_id` - Account ID whom the stats belong to.
* `playerStats` - Statistics about the player. This entails:
  * `account_id`
  * `player_stats`
  * `match_count`
  * `mean_gpm`
  * `mean_xppm`
  * `mean_lasthits`
  * `rampages`
  * `triple_kills`
  * `first_blood_claimed`
  * `first_blood_given`
  * `couriers_killed`
  * `aegises_snatched`
  * `cheeses_eaten`
  * `creeps_stacked`
  * `fight_score`
  * `farm_score`
  * `support_score`
  * `push_score`
  * `versatility_score`

Emitted when the GC responds to the `requestPlayerStats` method.

### `hallOfFameData` (`week`, `featuredPlayers`, `featuredFarmer`, `hallOfFameResponse`)
* `week` - Week the data is associated with.
* `featuredPlayers` - Array of featured players for that week. `[{ account_id, heroId, averageScaledMetric, numGames }]`
* `featuredFarmer` - Featured farmer for that week. `{ account_id, heroId, goldPerMin, match_id }`
* `hallOfFameResponse` - Raw response object.

Emitted when the GC responds to the `requestHallOfFame` method.

### `matchesData`

TODO

### `matchDetailsData` (`match_id`, `matchDetailsData`)
* `match_id` - Match ID whom the data is associatd with.
* `matchDetailsData` - The raw match details data object.

Emitted when GC responds to the `requestmatchDetails` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_client.proto#L1571) for `matchDetailsData`'s object structure.

### `matchMinimalDetailsData` (`matchMinimalDetailsData`)
* `last_match` - Bool, usage unknown
* `matchMinimalDetailsData` - The raw match details data object.

Emitted when GC responds to the `requestMatchMinimalDetails` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/5acc8bb72bb7fb79ad08723a431fcbfe90669230/Resources/Protobufs/dota/dota_gcmessages_client.proto#L621-L650) for `matchMinimalDetailsData`'s object structure.

### `matchmakingStatsData` (`matchgroups_version`, `match_groups`, `matchmakingStatsResponse`)
* `matchgroups_version` - Version of the current list of match groups.
* `match_groups` - Array of CMsgMatchmakingMatchGroupInfo objects. Contains info on the number of people searching and ping penalty.
* `matchmakingStatsResponse` - Raw response object.

Emitted when te GC response to the `requestMatchmakingStats` method.  The array order dictates which matchmaking groups the figure belongs to. 
The groups are discoverable through [regions.txt](https://github.com/SteamDatabase/GameTracking/blob/master/dota/game/dota/pak01_dir/scripts/regions.txt) in Dota 2's game files.  We maintain an indicative list *without guarantees* in this README. 
This list is manually updated only when changes are detected by community members, so it can be out of date. 
Here are the groups at the time of this sentence being written (with unecessary data trimmed out):

```
    "USWest":                       {"matchgroup": "0"},
    "USEast":                       {"matchgroup": "1"},
    "Europe":                       {"matchgroup": "2"},
    "Singapore":                    {"matchgroup": "3"},
    "Shanghai":                     {"matchgroup": "4"},
    "Brazil":                       {"matchgroup": "5"},
    "Korea":                        {"matchgroup": "6"},
    "Stockholm":                    {"matchgroup": "7"},
    "Austria":                      {"matchgroup": "8"},
    "Australia":                    {"matchgroup": "9"},
    "SouthAfrica":                  {"matchgroup": "10"},
    "PerfectWorldTelecom":          {"matchgroup": "11"},
    "PerfectWorldUnicom":           {"matchgroup": "12"},
    "Dubai":                        {"matchgroup": "13"},
    "Chile":                        {"matchgroup": "14"},
    "Peru":                         {"matchgroup": "15"},
    "India":                        {"matchgroup": "16"},
    "PerfectWorldTelecomGuangdong": {"matchgroup": "17"},
    "PerfectWorldTelecomZhejiang":  {"matchgroup": "18"},
    "Japan":                        {"matchgroup": "19"},
    "PerfectWorldTelecomWuhan":     {"matchgroup": "20"}
```

### `topFriendMatchesData` (`matches`)
* `matches` - A list of matches. Each match contains:
  * `match_id` - Match ID
  * `start_time` - Unix time of the start of the match
  * `duration` - Duration of the match in seconds
  * `game_mode` - Game mode
  * `winning_team` - Team who won the match
  * `players` - List of all the players in the game, contains id, hero, K/D/A and items
  * `league` - Information on the league if this is a league match

Emitted when the GC responds to the `requestTopFriendMatches` method.

### `practiceLobbyUpdate` (`lobby`)
* `lobby` - The full lobby object (see `CSODOTALobby`).

Emitted when the GC sends a lobby snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when a lobby has been entered / created
successfully as well. Note that the `Lobby` property will be the old
value until after this event completes to allow comparison between the
two.

### `lobbyInviteCleared` ()

Emitted when the Lobby Invite is cleared, for example when
accepting/rejecting it or when the lobby is closed.

### `practiceLobbyJoinResponse`(`result`, `practiceLobbyJoinResponse`)
* `result` - The result object from `practiceLobbyJoinResponse`.
* `practiceLobbyJoinResponse` - The raw response object.

Emitted when the GC responds to `joinPracticeLobby` method.

### `practiceLobbyCleared` ()

Emitted when leaving a lobby (aka, the lobby is cleared). This can
happen when kicked, upon leaving a lobby, etc. There are other callbacks
to tell when the bot has been kicked.

### `practiceLobbyResponse` (`result`, `practiceLobbyResponse`)
* `result` - The result object from `practiceLobbyJoinResponse`.
* `practiceLobbyResponse` - The raw response object.

Emitted when an operation changing the state of a lobby was sent to the GC and
processed. This event only contains the acknowledgement by the GC. The actual 
update of the lobby state is communicated via `practiceLobbyUpdate` events.

### `friendPracticeLobbyListData` ()

TODO

### `joinableCustomGameModes` (`game_modes`)
* `game_modes` - List of custom game modes that are available in a given server region
  * `custom_game_id` - ID corresponding to a custom game mode
  * `lobby_count` - Number of lobbies available for the game mode
  * `player_count` - Number of players playing this game mode

Emitted when the GC responds to `requestJoinableCustomGameModes`. Never seems to return more then ten results.

### `inviteCreated` (`steam_id`, `group_id`, `is_online`)
* `steam_id` - The steam ID of the person the invite was sent to
* `group_id` - The group ID of the person the invite was sent to
* `is_online` - Whether or not the person the invite was sent to is online

Emitted when the GC has created the invitation. The invitation is only sent when
the invitee is online.

### `partyUpdate` (`party`)
* `party` - The full party object (see `CSODOTAParty`).


Emitted when the GC sends a party snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when a party has been entered / created
successfully as well. Note that the `Party` property will be the old
value until after this event completes to allow comparison between the
two.


### `partyCleared` ()


Emitted when leaving a party (aka, the party is cleared). This can
happen when kicked, upon leaving a party, etc. There are other callbacks
to tell when the bot has been kicked.


### `partyInviteUpdate` (`party`)
* `partyInvite` - The full party invite object (see CSODOTAPartyInvite).


Emitted when the GC sends a party invite snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when an incoming party invite has been sent.
Note that the `PartyInvite` property will be the old
value until after this event completes to allow comparison between the two.


### `partyInviteCleared` ()


Emitted when the Party Invite is cleared, for example when
accepting/rejecting it or when the party is closed.


### `liveLeagueGamesUpdate` (`null`, `liveLeaguesResponse`)
* `null` - nothing
* `liveLeaguesResponse` - Integer representing number of live league games.


### `leaguesInMonthData` (`month`, `year`, `leagues`)
* `month` - Int representing which month this data represents.
* `year` - Int representing which year this data represents.
* `leagues` - Array of CMsgLeague objects

Emitted when the GC responds to `requestLeaguesInMonth` method.

Notes:

* The `month` property is used to filter the data to the leagues which have matches scheduled in the given month, however the `schedule` object contains schedules for a league's entire duration - i.e. before or after `month`.
* `month` is also zero-aligned, so January = 0, Febuary = 1, March = 2, etc.
* Not every participating team seems to be hooked up to Dota 2's team system, so there will be a few `{ teamId: 0 }` objects for some schedule blocks.

The leagues object is visualized as follows:

```
leagues: [{         // An array of CMsgLeague objects
    leagueId,       // ID of the league associated
    schedule: [{    // An array of CMsgLeagueScheduleBlock objects
        blockId,    // ID represending this block
        startTime,  // Unix timestamp of a scheduled match (or group of matches)
        finals,     // Boolean represending if this match is a final.
        comment,    // Comment about this scheduled block - often the team names & position in bracket
        teams: [{   // An array of CMsgLeagueScheduleBlockTeamInfo objects
            teamId, // ID of the associated team
            name,   // The teams name
            tag,    // The teams tag
            logo    // The teams logo
        }]
    }]
}]
```

### `topLeagueMatchesData` (`matches`)
* `matches` - A list of matches. Each match contains:
  * `match_id` - Match ID
  * `start_time` - Unix time of the start of the match
  * `duration` - Duration of the match in seconds
  * `game_mode` - Game mode
  * `winning_team` - Team who won the match
  * `players` - List of all the players in the game, contains id, hero, K/D/A and items
  * `league` - Information on the league if this is a league match

Emitted when the GC responds to the `requestTopLeagueMatches` method.

### `leagueData` ()

TODO

### `sourceTVGamesData` (`sourceTVGamesResponse`)
* `sourceTVGamesResponse` - The raw response object

Emitted when the GC responds to the `requestSourceTVGames` method.  Multiple events are emitted when `requestSourceTVGames` is passed with `start_game` > 0 or with one or more `lobby_id`s.  


### `inventoryUpdate` (`inv`)
* `inv` - Player inventory

Emitted when the GC sends an inventory snapshot. The GC is incredibly
inefficient and will send the entire object even if it's a minor update.
You can use this to detect when a change was made to your inventory (e.g. drop)
Note that the `Inventory` property will be the old value until after this event 
completes to allow comparison between the two.

### `playerCardRoster` (`playerCardRoster`)
* `playerCardRoster` - Fantasy challenge line-up for a specific day
* `result` - Status code indicating whether or not the request was succesful (0 = SUCCESS)
  * `player_card_item_id` - Item ID of the player card. Can be used to cross-reference with `Inventory`
  * `score` - Score the card got for this specific day
  * `finalized` - Whether or not the matches for this day are over
  * `percentile` - Percentile of all players your score falls in

Emitted when the GC responds to the `requestPlayerCardRoster` method.

### `playerCardDrafted` (`result`)
* `result` - Status code indicating whether or not the card got drafted (0 = SUCCESS)

Emitted when the GC responds to the `draftPlayerCard` method.

## Enums
### ServerRegion
* `UNSPECIFIED: 0`
* `USWEST: 1`
* `USEAST: 2`
* `EUROPE: 3`
* `KOREA: 4`
* `SINGAPORE: 5`
* `DUBAI: 6`
* `AUSTRALIA: 7`
* `STOCKHOLM: 8`
* `AUSTRIA: 9`
* `BRAZIL: 10`
* `SOUTHAFRICA: 11`
* `PWTELECOMSHANGHAI: 12`
* `PWUNICOM: 13`
* `CHILE: 14`
* `PERU: 15`
* `INDIA: 16`
* `PWTELECOMGUANGZHOU: 17`
* `PWTELECOMZHEJIANG: 18`
* `JAPAN: 19`
* `PWTELECOMWUHAN: 20`

Use this to pass valid server region data to `createPracticeLobby`.

### GameMode
* `DOTA_GAMEMODE_NONE: 0` - None
* `DOTA_GAMEMODE_AP: 1` - All Pick
* `DOTA_GAMEMODE_CM: 2` - Captain's Mode
* `DOTA_GAMEMODE_RD: 3` - Random Draft
* `DOTA_GAMEMODE_SD: 4` - Single Draft
* `DOTA_GAMEMODE_AR: 5` - All Random
* `DOTA_GAMEMODE_INTRO: 6` - Unknown
* `DOTA_GAMEMODE_HW: 7` - Diretide
* `DOTA_GAMEMODE_REVERSE_CM: 8` - Reverse Captain's Mode
* `DOTA_GAMEMODE_XMAS: 9` - The Greeviling
* `DOTA_GAMEMODE_TUTORIAL: 10` - Tutorial
* `DOTA_GAMEMODE_MO: 11` - Mid Only
* `DOTA_GAMEMODE_LP: 12` - Least Played
* `DOTA_GAMEMODE_POOL1: 13` - Limited Heroes
* `DOTA_GAMEMODE_FH: 14` - Compendium
* `DOTA_GAMEMODE_CUSTOM: 15` - Unknown, probably ti4 techies reveal.
* `DOTA_GAMEMODE_CD: 16` - Captain's Draft
* `DOTA_GAMEMODE_BD: 17` - Balanced Draft
* `DOTA_GAMEMODE_ABILITY_DRAFT: 18` - Ability Draft
* `DOTA_GAMEMODE_EVENT: 19` - Unknown
* `DOTA_GAMEMODE_ARDM: 20` - All Random Death Match
* `DOTA_GAMEMODE_1V1MID: 21` - 1v1 Mid
* `DOTA_GAMEMODE_ALL_DRAFT: 22` - All Draft a.k.a. ranked all pick

Use this to pass valid game mode data to `createPracticeLobby`. This enum is built-in the protobuf schema and can be referenced by `Dota2.DOTA_GameMode`.



