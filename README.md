node-dota2
========

[![NPM version](https://img.shields.io/npm/v/dota2.svg)](https://npmjs.org/package/dota2 "View this project on NPM")
[![Build Status](https://img.shields.io/travis/RJacksonm1/node-dota2.svg)](https://travis-ci.org/RJacksonm1/node-dota2 "View this project's build information")
[![Dependency Status](https://img.shields.io/david/RJacksonm1/node-dota2.svg)](https://david-dm.org/RJacksonm1/node-dota2 "Check this project's dependencies")
[![devDependency Status](https://img.shields.io/david/dev/RJacksonm1/node-dota2.svg)](https://david-dm.org/RJacksonm1/node-dota2#info=devDependencies "Check this project's dev dependencies")

A node-steam plugin for Dota 2, consider it in alpha state.

Check out my blog post (my only blog post), [Extending node-dota2](https://blog.rjackson.me/extending-node-dota2/), for a rough overview of adding new functionality to the library.

## Upgrade guide

### `1.*.*` to `2.0.0`

A few backwards incompatible API changes were included with version 2.0.0.

* The `chatJoin` and `chatLeave` events were changed to return the channel name instead of the id. All debug logs pertaining chat channels will now mention chat channel instead of IDs.

* The `waitTimesByGroup` argument in the `matchmakingStatsData` event has been removed.

## Initializing
Parameters:
* `steamClient` - Pass a SteamClient instance to use to send & receive GC messages.
* `debug` - A boolean noting whether to print information about operations to console.

```js
var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    dota2 = require('dota2'),
    Dota2 = new dota2.Dota2Client(steamClient, true);
```


##Properties
###AccountID
The current steam ID of the SteamClient converted to Dota 2 Account ID format. Not available until `launch` is called.

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
**_Limited Steam accounts cannot interact with chat!_**

#### joinChat(channel, [type])
* `channel` - A string for the channel name.
* `[type]` - The type of the channel being joined.  Defaults to `Dota2.schema.DOTAChatChannelType_t.DOTAChannelType_Custom`.

Joins a chat channel. If the chat channel with the given name doesn't exist, it 
is created. Listen for the `chatMessage` event for other people's chat messages.

Notable channels:
* `Guild_##########` - The chat channel of the guild with guild_id = ##########
* `Lobby_##########` - The chat channel of the lobby with lobby_id = ##########

#### leaveChat(channel)
* `channel` - A string for the channel name.

Leaves a chat channel.

#### sendMessage(channel, message)
* `channel` - A string for the channel name.
* `message` - The message you want to send.

Sends a message to the specified chat channel. Won't send if you're not in the channel you try to send to.

#### flipCoin(channel)
* `channel` - A string for the channel name.

Sends a coin flip to the specified chat channel. Won't send if you're not in the channel you try to send to.

#### rollDice(channel, min, max)
* `channel` - A string for the channel name.
* `min` - Lower bound of the dice roll.
* `max` - Upper bound of the dice roll.

Sends a dice roll to the specified chat channel. Won't send if you're not in the channel you try to send to.

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

#### requestTeamProfile(team_id, [callback])
* `team_id` - ID of a team
* `[callback]` - optional callback, returns args: `err, response`.

Requests the profile for a given team.

#### requestTeamMemberProfile(steam_id, [callback])
* `steam_id` - Steam ID of the user whose team profile you want
* `[callback]` - optional callback, returns args: `err, response`.

Requests the profile of the team a given user belongs to.

#### requestTeamIDByName(team_name, [callback])
* `team_name` - Name of a team
* `[callback]` - optional callback, returns args: `err, response`.

Requests the ID for a given team name.

#### requestProTeamList([callback])
* `[callback]` - optional callback, returns args: `err, response`.

Requests the list of pro teams

### Community
#### requestPlayerMatchHistory(account_id, [options], [callback])
* `account_id` - Account ID of the user whose match history you wish to retrieve.
* `[options]` - A mapping of options for the query he results:
  * `[start_at_match_id]` - Which match ID to start searching at (pagination)
  * `[matches_requested]` - How many matches to retrieve
  * `[hero_id]` - The ID of the hero the given account ID had played
  * `[request_id]` - I have no idea.
* `[callback]` - optional callback, returns args: `err, response`.

Requests the given player's match history. The responses are paginated, but you can use the `start_at_match_id` and `matches_requested` options to loop through them.

Provide a callback or listen for the `playerMatchHistoryData` for the GC's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestProfile(account_id, request_name, [callback])
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose profile data you wish to view.
* `request_name` - Boolean, whether you want the GC to return the accounts current display name.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `account_id`'s profile data. Provide a callback or listen for `profileData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

**This functionality is currently disabled by Valve**

#### requestProfileCard (account_id, [callback])
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose profile card you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `account_id`'s profile card. Provide a callback or listen for `profileCardData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### requestPassportData(account_id, [callback])
* `account_id` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose passport data you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `account_id`'s passport data. Provide a callback or listen for `passportData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

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

#### requestMatchmakingStats()

Sends a message to the Game Coordinator requesting some matchmaking stats. Listen for the `matchmakingStatsData` event for the Game Coordinator's response (cannot take a callback because of Steam's backend, or RJackson's incompetence; not sure which). Requires the GC to be ready (listen for the `ready` event before calling).


### Parties

### respondPartyInvite(id, accept)
* `[id]` - Number, party ID.
* `[accept]` - Accept or decline the invite.

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
  * `allchat`: Enable all chat?
  * `league_id`: The league this lobby is being created for. Optional
  * `dota_tv_delay`: TODO.
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
#### requestLeaguesInMonth([month], [year], [callback])
* `[month]` - Int for the month (MM) you want to query data for.  Defaults to current month. **IMPORTANT NOTE**:  Month is zero-aligned, not one-aligned; so Jan = 00, Feb = 01, etc.
* `[year]`  - Int for the year (YYYY) you want to query data for .  Defaults to current year.
* `[callback]` - optional callback` returns args: `err` response`.

Sends a message to the Game Coordinator requesting data on leagues being played in the given month.  Provide a callback or listen for `leaguesInMonthData` for the Game Coordinator's response.  Requires the GC to be ready (listen for the `ready` event before calling).

#### requestLeagueInfo()

Requests info on all available official leagues from the GC. Listen for `leagueData` for the Game Coordinator's response.  Requires the GC to be ready (listen for the `ready` event before calling).


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

### `teamData` (`teams`)
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

Emitted when GC responds to the `requestMyTeams` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_client.proto#L776) for `team`'s object structure.

### `teamProfile` (`team_id`, `team_info`)
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

### `teamID` (`team_id`)
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

### `profileData` (`account_id`, `profileData`)
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

### `passportData` (`account_id`, `passportData`)
* `account_id` - Account ID whom the passport belongs to.
* `passportData` - The raw passport data object.

Emitted when GC responds to the `requestPassportData` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages_client_fantasy.proto#L961) for `passportData`'s object structure.

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

### `matchmakingStatsData` (`searchingPlayersByGroup`, `disabledGroups`, `matchmakingStatsResponse`)
* `searchingPlayersByGroup` - Current players searching for matches per group.
* `disabledGroups` - Bitmask corresponding to groups in `searchingPlayersByGroup`. Groups marked as disabled will have a value of 0.
* `matchmakingStatsResponse` - Raw response object.

Emitted when te GC response to the `requestMatchmakingStats` method.  The array order dictates which matchmaking groups the figure belongs to. 
The groups are discoverable through `regions.txt` in Dota 2's game files.  We maintain an indicative list *without guarantees* in this README. 
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
    "Japan":                        {"matchgroup": "19"}
```

### `practiceLobbyUpdate` (`lobby`)
* `lobby` - The full lobby object (see CSODOTALobby).


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
* `party` - The full party object (see CSODOTAParty).


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


### `leaguesInMonthData` (`result`, `leaguesInMonthData`)
* `result` - The result object from `leaguesInMonthData`.
* `leaguesInMonthData` - The raw response object.

Emitted when the GC responds to `requestLeaguesInMonth` method.

Notes:

* The `month` property is used to filter the data to the leagues which have matches scheduled in the given month, however the `schedule` object contains schedules for a league's entire duration - i.e. before or after `month`.
* `month` is also zero-aligned, so January = 0, Febuary = 1, March = 2, etc.
* Not every participating team seems to be hooked up to Dota 2's team system, so there will be a few `{ teamId: 0 }` objects for some schedule blocks.

The response object is visualized as follows:

```
{
    eresult,            // EResult enum
    month,              // Int representing which month this data represents.
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
}
```

### `leagueData` ()

TODO

### `sourceTVGamesData` (`sourceTVGamesResponse`)
* `sourceTVGamesResponse` - The raw response object

Emitted when the GC responds to the `requestSourceTVGames` method.  Multiple events are emitted when `requestSourceTVGames` is passed with `start_game` > 0 or with one or more `lobby_id`s.  

## Enums
### ServerRegion
* `UNSPECIFIED: 0`
* `USWEST: 1`
* `USEAST: 2`
* `EUROPE: 3`
* `KOREA: 4`
* `SINGAPORE: 5`
* `AUSTRALIA: 7`
* `STOCKHOLM: 8`
* `AUSTRIA: 9`
* `BRAZIL: 10`
* `SOUTHAFRICA: 11`
* `PERFECTWORLDTELECOM: 12`
* `PERFECTWORLDUNICOM: 13`

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

Use this to pass valid game mode data to `createPracticeLobby`.

## Testing
There is no automated test suite for node-dota2 (I've no idea how I'd make one for the stuff this does :o), however there the `test` directory does contain a Steam bot with commented-out dota2 methods; you can use this bot to test the library.

### Setting up
* `npm install steam; npm install` in the repository root (install Steam first to work around a node-steam#222)
* Copy `config.js.example` to `config.js` and edit appropriately
* Run the test script: `node test.js`
* If you receive Error 63 you need to provide a Steam Guard code by setting the Steam Guard code in `config.js` and launching again.
* Make sure to use at least version 0.12 of node js


