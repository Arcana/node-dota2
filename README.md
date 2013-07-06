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
#### inviteToGuild(guildId, targetAccountId)
* `guildId` - ID of a guild.
* `targetAccountId` - Account ID (lower 32-bits of a 64-bit steam id) of user to invite to guild.

Attempts to invite a user to guild. Requires the GC to be ready (listen for the `ready` event before calling).

#### cancelInviteToGuild(guildId, targetAccountId)
* `guildId` - ID of a guild.
* `targetAccountId` - Account ID (lower 32-bits of a 64-bit steam id) of user whoms guild invite you wish to cancel.

Attempts to cancel a user's guild invitation; use this on your own account ID to reject guild invitations. Requires the GC to be ready (listen for the `ready` event before calling).

#### setGuildAccountRole(guildId, targetAccountId, targetRole)
* `guildId` - ID of a guild.
* `targetAccountId` - Account ID (lower 32-bits of a 64-bit steam id) of user whoms guild invite you wish to cancel.
* `targetRole` - Role in guild to have.
* * `0` - Kick member from guild.
* * `1` - Leader.
* * `2` - Officer.
* * `3` - Member.

Attempts to set a user's role within a guild; use this with your own account ID and the 'Member' role to accept guild invitations. Requires the GC to be ready (listen for the `ready` event before calling).


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

## Testing
There is no automated test suite for node-dota2 (I've no idea how I'd make one for the stuff this does :o), however there the `test` directory does contain a Steam bot with commented-out dota2 methods; you can use this bot to test the library.

### Setting up
* Copy `config_SAMPLE.js` to `config.js` and edit appropriately.
* Create a blank file named 'sentry' in the tests directory.
* Attempt to log-in, you'll receive Error 63 - which means you need to provide a Steam Guard code.
* Set the Steam Guard code in `config.js` and launch again.