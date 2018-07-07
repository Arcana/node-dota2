# Changelog 6.1.1
## General
 * Updated fantasy cards with this year's player card ID

# Changelog 6.1.0
## General
 * Removed some trailing util.log commands
 * Protobuf updates
 * Attempt to fix mocha not exiting
 * Added profile request fuction that allows fetching profile page

# Changelog 6.0.0
## General
Fixed some chat channel bugs

## API changes
### Methods
#### requestLeaguesInMonth
Proto message was removed so corresponding function also removed

#### destroyLobby
New function for lobby host that destroys the lobby

### Events
#### leaguesInMonthData
Removed because Valve removed proto message

# Changelog 5.2.0
## Dependency changes
Nothing new, just some updates

## API changes
### Methods
#### requestPlayerCardsByPlayer 
Now parses the bonuses

#### tipPlayer
Allows you to tip someone after a game

### Properties
* new Enum for Fantasy stats

### Events
#### gotItem
New event emitted when the bot received an item

#### gaveItem
New event emitted when the bot trades away an item

#### tipResponse
GC response after having tried tipping someone

#### tipped
Event fired when you get tipped

# Changelog 5.1.0
## Dependency changes
New dependencies on winstonjs and momentjs for logging purposes

## API changes
### Properties
#### Logger
Instance of winston.Logger. Default logging is identical to util.log. Users can
configure as they like.

### Events
#### chatLeft
New event emitted when the bot has left a chat channel

# Changelog 5.0.0
## General
* examples will no longer be pushed to npm

## Dependency changes
* Deleted the dependency on bignumber.js and replaced it by Long.js since protobufjs uses it.

## API changes
### Methods 
#### ToSteamID
Now returns a Long value instead of a string.

#### sendMessage
Order of the parameters has changed to `(message, channel_name, channel_type)`.

#### rollDice
Order of the parameters has changed to `(min, max, channel_name, channel_type)`.

#### ServerRegion
This enum used to be defined both on module level and as a member of Dota2Client.
We removed the member definition and only kept the module level one, 
in correspondence with all other enums.

#### setItemPositions
Changed the parameter type from an array of tuples to an array of objects

#### createPracticeLobby
Changed parameters to `(options, callback)` to reduce confusion. CreateTournamentLobby is now deprecated.

### Events

#### matchesData
Event parameters are now `(request_id, total_results, results_remaining, matches, series)`

#### practiceLobbyListData
Removed the null parameter

#### friendPracticeLobbyListData
Removed the null parameter

## Deprecation
There's a whole series of functions for which the GC hasn't responded in a long time.
Some of those were already deprecated since the last release, some of them have become deprecated since.
Those who were already deprecated for a long time have been deleted from the API.
Those who have become deprecated since the last release have been tagged deprecated.

Deprecated methods will no longer figure in the documentation (mainly because they're
now auto-magically generated based on the code comments and I really don't feel 
like adding copious amounts of documentation to a bunch of methods who no longer
can be used - shoot me). If they were one day to be re-enabled by Valve, these 
will ofcourse be documented again.

### Deleted methods
* requestProfile
* requestPassportData
* requestTeamProfile
* requestTeamMemberProfile
* requestTeamIDByName

### Deleted events
* profileData
* passportData
* teamProfile
* teamID

### Deprecated methods
* requestProTeamList
* requestGuildData
* inviteToGuild
* cancelInviteToGuild
* setGuildAccountRole

### Deprecated events
* guildOpenPartyData
* guildData
* guildInviteData
* proTeamListData
