var Dota2 = require("../index"),
    util = require("util"),
    Long = require('long');



// Methods
function decodeBonus(bonus) {
    let bitmask = bonus.readUInt16LE(6);
    let parsed = [];
    let bonusValues = [];
    for (let i=1; i<=5; i++) bonusValues.push(bonus.readUInt8(i));
    for (let i=0; i<16; i++) {
        if (bitmask % 2) parsed.push({'type': i, 'value': bonusValues.pop()});
        bitmask = bitmask >>> 1;
    }
    return parsed;
}


/**
 * Player with player cards
 * @typedef {Object} module:Dota2.Dota2Client#requestPlayerCardsByPlayer.FantasyPlayer
 * @property {number} account_id - Dota2 account ID of the player
 * @property {Object[]} cards - Player cards of this player in the bot's inventory
 * @property {number} cards[].id - ID of the card
 * @property {Object[]} cards[].bonuses - Array of bonuses that apply to this card
 * @property {module:Dota2.FantasyStats} cards[].bonuses[].type - The stat that gets a bonus
 * @property {number} cards[].bonuses[].value - Percentage bonus for the stat
 * @property {module:Dota2.schema.CMsgGCToClientPlayerStatsResponse} stats - Player stats
 */

/**
 * Requests the player stats for each of the players for which you have one or multiple player cards.
 * All requests are staggered in 200ms intervals and time out after 2s.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @async Returns a list of promises that resolve to {@link module:Dota2.Dota2Client#requestPlayerCardsByPlayer.FantasyPlayer} objects
 * @alias module:Dota2.Dota2Client#requestPlayerCardsByPlayer
 * @returns {FantasyPlayer[]}
 */
Dota2.Dota2Client.prototype.requestPlayerCardsByPlayer = function() {
    if(this.Inventory) {
        var playercards = this.Inventory.filter(item => item.def_index == 11985);
        var promises = [];
        // Sort cards per player
        var players = playercards.reduce((players, card)=>{
            var id_attr = card.attribute.filter(attr => attr.def_index == 424)[0];
            var account_id = Buffer.from(id_attr.value_bytes, 'base64').readUInt32LE();
            // Add player if we haven't seen him yet
            if (!players[account_id]) players[account_id] = {'account_id': account_id, 'cards': []};
            // Add this card
            var bonus = card.attribute.filter(attr => attr.def_index == 425)[0];
            players[account_id].cards.push({
                'id': card.id,
                'bonuses': bonus ?  decodeBonus(bonus.value_bytes) : undefined
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
//     this.Logger.debug("Requesting player card info");

//     var payload = {
//         "account_id": this.AccountID,
//         "player_card_item_ids": player_card_ids
//     };
    
//     this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCGetPlayerCardItemInfo, 
//                     Dota2.schema.lookupType("CMsgGCGetPlayerCardItemInfo").encode(payload).finish(), 
//                     onPlayerCardInfoResponse, callback);
// }

/**
 * Sends a message to the Game Coordinator requesting your fantasy line-up for a specific day of a given tournament. 
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:playerCardRoster|playerCardRoster} event for the Game Coordinator's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestPlayerCardRoster
 * @param {number} league_id - ID of the league
 * @param {number} timestamp - Date in timeframe of the league
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgClientToGCGetPlayerCardRosterResponse`
 */
Dota2.Dota2Client.prototype.requestPlayerCardRoster = function(league_id, timestamp, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
    this.Logger.debug("Requesting player card roster");

    var payload = {
        "league_id": league_id,
        "timestamp": timestamp
    };
    
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCGetPlayerCardRosterRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCGetPlayerCardRosterRequest").encode(payload).finish(), 
                    onGetPlayerCardRosterResponse, callback);
}

/**
 * Sends a message to the Game Coordinator requesting to draft a certain player card in a specific slot, for a given day in a tournament. 
 * Provide a callback or listen for the {@link module:Dota2.Dota2Client#event:playerCardDrafted|playerCardDrafted} event for the Game Coordinator's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#draftPlayerCard
 * @param {number} league_id - ID of the league for which you're drafting a player card
 * @param {number} timestamp - Timestamp of the day for which you want to draft a player card
 * @param {number} slot - Slot in the draft which you want to fill
 * @param {number} player_card_id - Item ID of the player card you want to draft
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgClientToGCSetPlayerCardRosterResponse`
 */
Dota2.Dota2Client.prototype.draftPlayerCard = function(league_id, timestamp, slot, player_card_id, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
    this.Logger.debug("Requesting player card roster");

    var payload = {
        "league_id": league_id,
        "timestamp": timestamp
    };
    
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCSetPlayerCardRosterRequest, 
                    Dota2.schema.lookupType("CMsgClientToGCSetPlayerCardRosterRequest").encode(payload).finish(), 
                    onSetPlayerCardRosterResponse, callback);
}

// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestPlayerCardRoster|request for a player's fantasy roster}
 * @event module:Dota2.Dota2Client#playerCardRoster
 * @param {CMsgClientToGCGetPlayerCardRosterResponse} playerCardRoster - The raw response data containing the fantasy draft and score if available.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#draftPlayerCard|draft of a player card}
 * @event module:Dota2.Dota2Client#playerCardDrafted
 * @param {number} playerCardRoster - The result of the operation. See `CMsgClientToGCSetPlayerCardRosterResponse.result`.
 */

// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

// // This proto message is not supported by Valve's backend as of yet
// var onPlayerCardInfoResponse = function onPlayerCardInfoResponse(message, callback) {
//     callback = callback || null;
//     var playerCardInfo = Dota2.schema.lookupType("CMsgGCGetPlayerCardItemInfoResponse").decode(message);
//     this.Logger.debug("Received info for player cards");
//     this.emit("playerCardInfo", playerCardInfo.player_card_infos);
//     if (callback) callback(null, playerCardInfo);
    
// };
// handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCCreatePlayerCardPackResponse] = onPlayerCardInfoResponse;

var onGetPlayerCardRosterResponse = function onGetPlayerCardRosterResponse(message, callback) {
    callback = callback || null;
    var playerCardRoster = Dota2.schema.lookupType("CMsgClientToGCGetPlayerCardRosterResponse").decode(message);
    if (playerCardRoster.result == 0) {
        this.Logger.debug("Received roster for player cards");
        this.emit("playerCardRoster", playerCardRoster);
        if (callback) callback(null, playerCardRoster);
    } else {
        this.Logger.error("Error receiving roster for player cards: " + playerCardRoster.result);
        if (callback) callback(playerCardRoster.result);
    }
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCGetPlayerCardRosterResponse] = onGetPlayerCardRosterResponse;

var onSetPlayerCardRosterResponse = function onSetPlayerCardRosterResponse(message, callback) {
    callback = callback || null;
    var playerCardRoster = Dota2.schema.lookupType("CMsgClientToGCSetPlayerCardRosterResponse").decode(message);
    this.Logger.debug("Received player card draft result: "+playerCardRoster.result);
    this.emit("playerCardDrafted", playerCardRoster.result);
    if (callback) callback(playerCardRoster.result, playerCardRoster);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCSetPlayerCardRosterResponse] = onSetPlayerCardRosterResponse;