var Dota2 = require("../index"),
    util = require("util");

// Methods
// // This proto message is not supported by Valve's backend as of yet
// Dota2.Dota2Client.prototype.requestPlayerCardItemInfo = function(player_card_ids, callback) {
//     player_card_ids = player_card_ids.constructor == Array ? player_card_ids : [player_card_ids];
//     callback = callback || null;
//     var _self = this;
    
//     /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
//     if (this.debug) util.log("Requesting player card info");

//     var payload = new Dota2.schema.CMsgGCGetPlayerCardItemInfo({
//         "account_id": this.AccountID,
//         "player_card_item_ids": player_card_ids
//     });
    
//     this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgGCGetPlayerCardItemInfo, 
//                     payload, 
//                     onPlayerCardInfoResponse, callback);
// }

Dota2.Dota2Client.prototype.requestPlayerCardRoster = function(league_id, timestamp, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
    if (this.debug) util.log("Requesting player card roster");

    var payload = new Dota2.schema.CMsgClientToGCGetPlayerCardRosterRequest({
        "league_id": league_id,
        "timestamp": timestamp
    });
    
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetPlayerCardRosterRequest, 
                    payload, 
                    onGetPlayerCardRosterResponse, callback);
}

Dota2.Dota2Client.prototype.draftPlayerCard = function(league_id, timestamp, slot, player_card_id, callback) {
    callback = callback || null;
    var _self = this;
    
    /* Sends a message to the Game Coordinator requesting information on a list of player card ID's. Listen for `playerCardInfo` event for Game Coordinator's response. */
    if (this.debug) util.log("Requesting player card roster");

    var payload = new Dota2.schema.CMsgClientToGCSetPlayerCardRosterRequest({
        "league_id": league_id,
        "timestamp": timestamp
    });
    
    this.sendToGC(  Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCSetPlayerCardRosterRequest, 
                    payload, 
                    onSetPlayerCardRosterResponse, callback);
}


// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

// // This proto message is not supported by Valve's backend as of yet
// var onPlayerCardInfoResponse = function onPlayerCardInfoResponse(message, callback) {
//     callback = callback || null;
//     var playerCardInfo = Dota2.schema.CMsgGCGetPlayerCardItemInfoResponse.decode(message);
//     if (this.debug) util.log("Received info for player cards");
//     this.emit("playerCardInfo", playerCardInfo.player_card_infos);
//     if (callback) callback(null, playerCardInfo);
    
// };
// handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCCreatePlayerCardPackResponse] = onPlayerCardInfoResponse;

var onGetPlayerCardRosterResponse = function onGetPlayerCardRosterResponse(message, callback) {
    callback = callback || null;
    var playerCardRoster = Dota2.schema.CMsgClientToGCGetPlayerCardRosterResponse.decode(message);
    if (playerCardRoster.result == 0) {
        if (this.debug) util.log("Received roster for player cards");
        this.emit("playerCardRoster", playerCardRoster);
        if (callback) callback(null, playerCardRoster);
    } else {
        if (this.debug) util.log("Error receiving roster for player cards: " + playerCardRoster.result);
        if (callback) callback(playerCardRoster.result);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetPlayerCardRosterResponse] = onGetPlayerCardRosterResponse;

var onSetPlayerCardRosterResponse = function onSetPlayerCardRosterResponse(message, callback) {
    callback = callback || null;
    var playerCardRoster = Dota2.schema.CMsgClientToGCSetPlayerCardRosterResponse.decode(message);
    if (this.debug) util.log("Received player card draft result: "+playerCardRoster.result);
    this.emit("playerCardDrafted", playerCardRoster.result);
    if (callback) callback(playerCardRoster.result);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCSetPlayerCardRosterResponse] = onSetPlayerCardRosterResponse;