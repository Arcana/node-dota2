# Changelog
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
