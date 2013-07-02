node-dota2
========

A node-steam plugin for Dota 2, consider it in alpha state.

## Usage

### Initializing
Parameters:
* `steamClient` - Pass a SteamClient instance to use to send & receive GC messages.
* `debug` - A boolean noting whether to print information about operations to console.

```js
var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    dota2 = require('dota2'),
    Dota2 = new dota2(steamClient, true);
```

### Methods
All methods require the SteamClient instance to be logged on.

#### launch()

Reports to Steam that you're playing Dota 2, and then initiates communication with the Game Coordinator.

#### exit()

Tells Steam you were feeding.

#### setItemPositions(itemPositions)
* `itemPositions` - An array of tuples (itemid, position).

Attempts to move items within your inventory to the positions you set. Requires the GC to be ready (listen for the `ready` event before calling).

#### deleteItem(itemid)

Attempts to delete an item. Requires the GC to be ready (listen for the `ready` event before calling).

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

### Events
#### `ready`
Emitted when the GC is ready to receive messages.


#### `chatMessage` (`channel`, `senderName`, `message`, `chatObject`)
* `channel` - Channel name.
* `senderName` - Persona name of user who sent message.
* `message` - Wot u think?
* `chatObject` - The raw chat object to do with as you wish.

Emitted for chat messages received from Dota 2 chat channels

## Testing
There is no automated test suite for node-dota2 (I've no idea how I'd make one for the stuff this does :o), however there the `test` directory does contain a Steam bot with commented-out dota2 methods; you can use this bot to test the library.

### Setting up
* Copy `config_SAMPLE.js` to `config.js` and edit appropriately.
* Create a blank file named 'sentry' in the tests directory.
* Attempt to log-in, you'll receive Error 65 - which means you need to provide a Steam Guard code.
* Set the Steam Guard code in `config.js` and launch again.