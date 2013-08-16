node-dota2
========

A node-steam plugin for Dota 2, consider it in alpha state.

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

## Methods
All methods require the SteamClient instance to be logged on.

### Steam
#### launch()

Reports to Steam that you're playing Dota 2, and then initiates communication with the Game Coordinator.

#### exit()

Tells Steam you were feeding.


### Inventory
#### setItemPositions(itemPositions)
* `itemPositions` - An array of tuples (itemid, position).

Attempts to move items within your inventory to the positions you set. Requires the GC to be ready (listen for the `ready` event before calling).

#### deleteItem(itemid)

Attempts to delete an item. Requires the GC to be ready (listen for the `ready` event before calling).


### Chat
#### joinChat(channel)
* `channel` - A string for the channel name.

Joins a chat channel.  Listen for the `chatMessage` event for other people's chat messages.

#### leaveChat(channel)
* `channel` - A string for the channel name.

Leaves a chat channel.

#### sendMessage(channel, message)
* `channel` - A string for the channel name.
* `message` - The message you want to send.

Sends a message to the specified chat channel, won't send if you're not in the channel you try to send to.


### Guild
#### inviteToGuild(guildId, targetAccountId, [callback])
* `guildId` - ID of a guild.
* `targetAccountId` - Account ID (lower 32-bits of a 64-bit steam id) of user to invite to guild.
* `[callback]` - optional callback, returns args: `err, response`.

Attempts to invite a user to guild. Requires the GC to be ready (listen for the `ready` event before calling).

#### cancelInviteToGuild(guildId, targetAccountId, [callback])
* `guildId` - ID of a guild.
* `targetAccountId` - Account ID (lower 32-bits of a 64-bit steam id) of user whoms guild invite you wish to cancel.
* `[callback]` - optional callback, returns args: `err, response`.

Attempts to cancel a user's guild invitation; use this on your own account ID to reject guild invitations. Requires the GC to be ready (listen for the `ready` event before calling).

#### setGuildAccountRole(guildId, targetAccountId, targetRole, [callback])
* `guildId` - ID of a guild.
* `targetAccountId` - Account ID (lower 32-bits of a 64-bit steam id) of user whoms guild invite you wish to cancel.
* `targetRole` - Role in guild to have.
* * `0` - Kick member from guild.
* * `1` - Leader.
* * `2` - Officer.
* * `3` - Member.
* `[callback]` - optional callback, returns args: `err, response`.

Attempts to set a user's role within a guild; use this with your own account ID and the 'Member' role to accept guild invitations. Requires the GC to be ready (listen for the `ready` event before calling).


### Community
#### profileRequest(accountId, requestName, [callback])
* `accountId` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose passport data you wish to view.
* `requestName` - Boolean, whether you want the GC to return the accounts current display name.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `accountId`'s profile data. Provide a callback or listen for `profileData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### passportDataRequest(accountId, [callback])
* `accountId` - Account ID (lower 32-bits of a 64-bit Steam ID) of the user whose passport data you wish to view.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `accountId`'s passport data. Provide a callback or listen for `passportData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### hallOfFameRequest([week], [callback])
* `[week]` - The week of which you wish to know the Hall of Fame members; will return latest week if omitted.  Weeks also randomly start at 2233 for some reason, valf please.
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting the Hall of Fame data for `week`. Provide a callback or listen for the `hallOfFameData` event for the Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).


### Matches
#### matchDetailsRequest(matchId, [callback])
* `matchId` - The matches ID
* `[callback]` - optional callback, returns args: `err, response`.

Sends a message to the Game Coordinator requesting `matchId`'s match details. Provide a callback or listen for `matchData` event for Game Coordinator's response. Requires the GC to be ready (listen for the `ready` event before calling).

#### matchmakingStatsRequest()

Sends a message to the Game Coordinator requesting some matchmaking stats. Listen for the `matchmakingStatsData` event for the Game Coordinator's response (cannot take a callback because of Steam's backend, or RJackson's incompetence; not sure which). Rqeuired the GC to be ready (listen for the `ready` event before calling).

## Events
### `ready`
Emitted when the GC is ready to receive messages.


### `chatMessage` (`channel`, `senderName`, `message`, `chatObject`)
* `channel` - Channel name.
* `senderName` - Persona name of user who sent message.
* `message` - Wot u think?
* `chatObject` - The raw chat object to do with as you wish.

Emitted for chat messages received from Dota 2 chat channels

### `guildInvite` (`guildId`, `guildName`, `inviter`, `guildInviteDataObject`)
* `guildId` - ID of the guild.
* `guildName` - Name of the guild.
* `inviter` - Account ID of user whom invited you.
* `guildInviteDataObject` - The raw guildInviteData object to do with as you wish.

You can respond with `cancelInviteToGuild` or `setGuildAccountRole`.

### `profileData` (`accountId`, `profileData`)
* `accountId` - Account ID whom the data is associated with.
* `profileData` - The raw profile data object.

Emitted when GC responds to the `profileRequest` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages.proto#2261) for `profileData`'s object structure.

### `passportData` (`accountId`, `passportData`)
* `accountId` - Account ID whom the passport belongs to.
* `passportData` - The raw passport data object.

Emitted when GC responds to the `passportDataRequest` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages.proto#L2993) for `passportData`'s object structure.

### `matchData` (`matchId`, `matchData`)
* `matchId` - Match ID whom the data is associatd with.
* `matchData` - The raw match details data object.

Emitted when GC responds to the `matchDetailsRequest` method.

See the [protobuf schema](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/dota/dota_gcmessages.proto#L2250) for `matchData`'s object structure.

### `hallOfFameData` (`week`, `featuredPlayers`, `featuredFarmer`, `hallOfFameResponse`)
* `week` - Week the data is associated with.
* `featuredPlayers` - Array of featured players for that week. `[{ accountId, heroId, averageScaledMetric, numGames }]`
* `featuredFarmer` - Featured farmer for that week. `{ accountId, heroId, goldPerMin, matchId }`
* `hallOfFameResponse` - Raw response object.

Emitted when the GC responds to the `hallOfFameRequest` method.

### `matchmakingStatsData` (`waitTimesByGroup`, `searchingPlayersByGroup`, `disabledGroups`, `matchmakingStatsResponse`)
* `waitTimesByGroup` - Current average matchmaking waiting times, in seconds, per group.
* `searchingPlayersByGroup` - Current players searching for matches per group.
* `disabledGroups` - I don't know how the data is formatted here, I've only observed it to be zero.
* `matchmakingStatsResponse` - Raw response object.

Emitted when te GC response to the `matchmakingStatsRequest` method.  The array order dictates which matchmaking groups the figure belongs to, the groups are discoverable through `regions.txt` in Dota 2's game files.  Here are the groups at the time of this sentence being written (with unecessary data trimmed out):

```
    "USWest":               {"matchgroup": "0"},
    "USEast":               {"matchgroup": "1"},
    "Europe":               {"matchgroup": "2"},
    "Singapore":            {"matchgroup": "3"},
    "Shanghai":             {"matchgroup": "4"},
    "Brazil":               {"matchgroup": "5"},
    "Korea":                {"matchgroup": "6"},
    "Austria":              {"matchgroup": "8"},
    "Stockholm":            {"matchgroup": "7"},
    "Australia":            {"matchgroup": "9"},
    "SouthAfrica":          {"matchgroup": "10"},
    "PerfectWorldTelecom":  {"matchgroup": "11"},
    "PerfectWorldUnicom":   {"matchgroup": "12"}
```

## Testing
There is no automated test suite for node-dota2 (I've no idea how I'd make one for the stuff this does :o), however there the `test` directory does contain a Steam bot with commented-out dota2 methods; you can use this bot to test the library.

### Setting up
* Copy `config_SAMPLE.js` to `config.js` and edit appropriately.
* Create a blank file named 'sentry' in the tests directory.
* Attempt to log-in, you'll receive Error 63 - which means you need to provide a Steam Guard code.
* Set the Steam Guard code in `config.js` and launch again.