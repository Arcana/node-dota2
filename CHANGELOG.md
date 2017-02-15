# Changelog

## API changes
### sendMessage
Order of the parameters has changed to `(message, channel_name, channel_type)`.

### rollDice
Order of the parameters has changed to `(min, max, channel_name, channel_type)`.

### ServerRegion
This enum used to be defined both on module level and as a member of Dota2Client.
We removed the member definition and only kept the module level one, 
in correspondence with all other enums.

### profileData
This event has been deprecated for a year now and there are no indications of this 
functionality ever coming back. The event has therefore been deleted.