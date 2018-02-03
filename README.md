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
                * [.LobbyInvite](#module_Dota2.Dota2Client+LobbyInvite) : <code>CSODOTALobbyInvite</code>
                * [.Party](#module_Dota2.Dota2Client+Party) : <code>CSODOTAParty</code>
                * [.PartyInvite](#module_Dota2.Dota2Client+PartyInvite) : <code>CSODOTAPartyInvite</code>
                * [.launch()](#module_Dota2.Dota2Client+launch)
                * [.exit()](#module_Dota2.Dota2Client+exit)
                * ["ready"](#module_Dota2.Dota2Client+event_ready)
                * ["unhandled" (kMsg, kMsg_name)](#module_Dota2.Dota2Client+event_unhandled)
                * ["hellotimeout"](#module_Dota2.Dota2Client+event_hellotimeout)
            * _static_
                * [.ToAccountID(steamID)](#module_Dota2.Dota2Client.ToAccountID) ⇒ <code>number</code>
                * [.ToSteamID(accid)](#module_Dota2.Dota2Client.ToSteamID) ⇒ [<code>Long</code>](#external_Long)
        * [.schema](#module_Dota2.schema)
    * _inner_
        * [~Long](#external_Long)

<a name="module_Dota2.Dota2Client"></a>

### Dota2.Dota2Client ⇐ <code>EventEmitter</code>
**Kind**: static class of [<code>Dota2</code>](#module_Dota2)  
**Extends**: <code>EventEmitter</code>  
**Emits**: [<code>ready</code>](#module_Dota2.Dota2Client+event_ready), [<code>unhandled</code>](#module_Dota2.Dota2Client+event_unhandled), [<code>hellotimeout</code>](#module_Dota2.Dota2Client+event_hellotimeout), <code>module:Dota2.Dota2Client#event:popup</code>, <code>module:Dota2.Dota2Client#event:sourceTVGamesData</code>, <code>module:Dota2.Dota2Client#event:inventoryUpdate</code>, <code>module:Dota2.Dota2Client#event:practiceLobbyUpdate</code>, <code>module:Dota2.Dota2Client#event:practiceLobbyCleared</code>, <code>module:Dota2.Dota2Client#event:lobbyInviteUpdate</code>, <code>module:Dota2.Dota2Client#event:lobbyInviteCleared</code>, <code>module:Dota2.Dota2Client#event:practiceLobbyJoinResponse</code>, <code>module:Dota2.Dota2Client#event:practiceLobbyListData</code>, <code>module:Dota2.Dota2Client#event:practiceLobbyResponse</code>, <code>module:Dota2.Dota2Client#event:lobbyDestroyed</code>, <code>module:Dota2.Dota2Client#event:friendPracticeLobbyListData</code>, <code>module:Dota2.Dota2Client#event:inviteCreated</code>, <code>module:Dota2.Dota2Client#event:partyUpdate</code>, <code>module:Dota2.Dota2Client#event:partyCleared</code>, <code>module:Dota2.Dota2Client#event:partyInviteUpdate</code>, <code>module:Dota2.Dota2Client#event:partyInviteCleared</code>, <code>module:Dota2.Dota2Client#event:joinableCustomGameModes</code>, <code>module:Dota2.Dota2Client#event:chatChannelsData</code>, <code>module:Dota2.Dota2Client#event:chatJoin</code>, <code>module:Dota2.Dota2Client#event:chatJoined</code>, <code>module:Dota2.Dota2Client#event:chatLeave</code>, <code>module:Dota2.Dota2Client#event:chatMessage</code>, <code>module:Dota2.Dota2Client#event:profileCardData</code>, <code>module:Dota2.Dota2Client#event:playerMatchHistoryData</code>, <code>module:Dota2.Dota2Client#event:playerInfoData</code>, <code>module:Dota2.Dota2Client#event:playerStatsData</code>, <code>module:Dota2.Dota2Client#event:trophyListData</code>, <code>module:Dota2.Dota2Client#event:hallOfFameData</code>, <code>module:Dota2.Dota2Client#event:playerCardRoster</code>, <code>module:Dota2.Dota2Client#event:playerCardDrafted</code>, <code>module:Dota2.Dota2Client#event:liveLeagueGamesUpdate</code>, <code>module:Dota2.Dota2Client#event:leagueData</code>, <code>module:Dota2.Dota2Client#event:topLeagueMatchesData</code>, <code>module:Dota2.Dota2Client#event:teamData</code>, <code>module:Dota2.Dota2Client#event:matchesData</code>, <code>module:Dota2.Dota2Client#event:matchDetailsData</code>, <code>module:Dota2.Dota2Client#event:matchMinimalDetailsData</code>, <code>module:Dota2.Dota2Client#event:matchmakingStatsData</code>, <code>module:Dota2.Dota2Client#event:topFriendMatchesData</code>, <code>module:Dota2.Dota2Client#event:tipResponse</code>, <code>module:Dota2.Dota2Client#event:tipped</code>  

* [.Dota2Client](#module_Dota2.Dota2Client) ⇐ <code>EventEmitter</code>
    * [new Dota2.Dota2Client(steamClient, debug, debugMore)](#new_module_Dota2.Dota2Client_new)
    * _instance_
        * [.Logger](#module_Dota2.Dota2Client+Logger) : <code>winston.Logger</code>
        * [.Inventory](#module_Dota2.Dota2Client+Inventory) : <code>Array.&lt;CSOEconItem&gt;</code>
        * [.chatChannels](#module_Dota2.Dota2Client+chatChannels) : <code>Array.&lt;CMsgDOTAJoinChatChannelResponse&gt;</code>
        * [.Lobby](#module_Dota2.Dota2Client+Lobby) : <code>CSODOTALobby</code>
        * [.LobbyInvite](#module_Dota2.Dota2Client+LobbyInvite) : <code>CSODOTALobbyInvite</code>
        * [.Party](#module_Dota2.Dota2Client+Party) : <code>CSODOTAParty</code>
        * [.PartyInvite](#module_Dota2.Dota2Client+PartyInvite) : <code>CSODOTAPartyInvite</code>
        * [.launch()](#module_Dota2.Dota2Client+launch)
        * [.exit()](#module_Dota2.Dota2Client+exit)
        * ["ready"](#module_Dota2.Dota2Client+event_ready)
        * ["unhandled" (kMsg, kMsg_name)](#module_Dota2.Dota2Client+event_unhandled)
        * ["hellotimeout"](#module_Dota2.Dota2Client+event_hellotimeout)
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
<a name="external_Long"></a>

### Dota2~Long
A Long class for representing a 64 bit two's-complement integer value 
derived from the Closure Library for stand-alone use and extended with unsigned support.

**Kind**: inner external of [<code>Dota2</code>](#module_Dota2)  
**See**: [long](https://www.npmjs.com/package/long) npm package  
