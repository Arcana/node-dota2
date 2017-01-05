var Dota2 = require("../index"),
    util = require("util"),
    Long = require('long');

// Methods

// Returns a list of promises which resolve to a list of players, with player stats if the call to the GC was succesful.
// Maximum delay before promises resolve is ~20s. 
// A player object looks like this:
// {
//     'account_id' : uint32,
//     'cards' : [{'id' : uint32, 'bonuses' : uint64}],
//     'stats' : CMsgGCToClientPlayerStatsResponse (if GC responded before 2s timeout)
// }
// For magic numbers, see -> https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/dota/game/dota/pak01_dir/scripts/items/items_game.txt
Dota2.Dota2Client.prototype.requestPlayerCardsByPlayer = function() {
    if(this.Inventory) {
        var playercards = this.Inventory.filter(item => item.def_index == 11953);
        var promises = [];
        // Sort cards per player
        var players = playercards.reduce((players, card)=>{
            var id_attr = card.attribute.filter(attr => attr.def_index == 424)[0];
            var account_id = id_attr.value_bytes.readUInt32(id_attr.value_bytes.offset);
            // Add player if we haven't seen him yet
            if (!players[account_id]) players[account_id] = {'account_id': account_id, 'cards': []};
            // Add this card
            var bonus = card.attribute.filter(attr => attr.def_index == 425)[0];
            players[account_id].cards.push({
                'id': card.id,
                'bonuses': bonus ?  bonus.value_bytes.readUInt64(bonus.value_bytes.offset) : undefined
            });
            return players;
        },{});
        // Send a player stats request for each player account id
        Object.keys(players).forEach((player, i)=>{
            promises.push(
                new Promise((resolve, reject) => {
                    // Stagger the requests with 200ms intervals
                    setTimeout(() =>{
                        this.requestPlayerStats(players[player].account_id, (err, result) => {
                            if (err) return reject(err);
                            return resolve(
                                (() => {
                                    players[player].stats = result;
                                    return players[player];
                                })()
                            );
                        });
                        // Resolve if we haven't received a response after 2s
                        setTimeout(()=>resolve(players[player]), 2000);
                    }, i * 200);
                })
                
            );
        });
        
        return promises;
    } else {
        return null;
    }
}

// // This proto message is not supported by Valve's backend as of yet
// Dota2.Dota2Client.prototype.requestPlayerCardItemInfo = function(player_card_ids, callback) {
//     player_card_ids = player_card_ids.constructor == Array ? player_card_ids : [player_card_ids];
//     callback = callback || null;
//     var _self = this;
    
//     /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
//     if (this.debug) util.log("Requesting player card info");

//     var payload = {
//         "account_id": this.AccountID,
//         "player_card_item_ids": player_card_ids
//     };
    
//     this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCGetPlayerCardItemInfo, 
//                     Dota2.schema.lookupType("CMsgGCGetPlayerCardItemInfo").encode(payload).finish(), 
//                     onPlayerCardInfoResponse, callback);
// }

Dota2.Dota2Client.prototype.requestPlayerCardRoster = function(league_id, timestamp, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
    if (this.debug) util.log("Requesting player card roster");

    var payload = {
        "league_id": league_id,
        "timestamp": timestamp
    };
    
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCGetPlayerCardRosterRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCGetPlayerCardRosterRequest").encode(payload).finish(), 
                    onGetPlayerCardRosterResponse, callback);
}

Dota2.Dota2Client.prototype.draftPlayerCard = function(league_id, timestamp, slot, player_card_id, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
    if (this.debug) util.log("Requesting player card roster");

    var payload = {
        "league_id": league_id,
        "timestamp": timestamp
    };
    
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCSetPlayerCardRosterRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCSetPlayerCardRosterRequest").encode(payload).finish(), 
                    onSetPlayerCardRosterResponse, callback);
}


// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

// // This proto message is not supported by Valve's backend as of yet
// var onPlayerCardInfoResponse = function onPlayerCardInfoResponse(message, callback) {
//     callback = callback || null;
//     var playerCardInfo = Dota2.schema.lookupType("CMsgGCGetPlayerCardItemInfoResponse").decode(message);
//     if (this.debug) util.log("Received info for player cards");
//     this.emit("playerCardInfo", playerCardInfo.player_card_infos);
//     if (callback) callback(null, playerCardInfo);
    
// };
// handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCCreatePlayerCardPackResponse] = onPlayerCardInfoResponse;

var onGetPlayerCardRosterResponse = function onGetPlayerCardRosterResponse(message, callback) {
    callback = callback || null;
    var playerCardRoster = Dota2.schema.lookupType("CMsgClientToGCGetPlayerCardRosterResponse").decode(message);
    if (playerCardRoster.result == 0) {
        if (this.debug) util.log("Received roster for player cards");
        this.emit("playerCardRoster", playerCardRoster);
        if (callback) callback(null, playerCardRoster);
    } else {
        if (this.debug) util.log("Error receiving roster for player cards: " + playerCardRoster.result);
        if (callback) callback(playerCardRoster.result);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCGetPlayerCardRosterResponse] = onGetPlayerCardRosterResponse;

var onSetPlayerCardRosterResponse = function onSetPlayerCardRosterResponse(message, callback) {
    callback = callback || null;
    var playerCardRoster = Dota2.schema.lookupType("CMsgClientToGCSetPlayerCardRosterResponse").decode(message);
    if (this.debug) util.log("Received player card draft result: "+playerCardRoster.result);
    this.emit("playerCardDrafted", playerCardRoster.result);
    if (callback) callback(playerCardRoster.result);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgClientToGCSetPlayerCardRosterResponse] = onSetPlayerCardRosterResponse;