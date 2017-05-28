'use strict';

var Dota2 = require("../index");

/**
 * Attempts to tip a player for his performance during a match. Listen for the `tipResponse` event for the GC's response.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#tipPlayer
 * @param {number} account_id - The Dota2 ID of the player you want to tip.
 * @param {external:Long} steam_id - The match ID for which you want to tip a player.
 * @param {number} steam_id - The event ID during which you want to tip a player.
 */
Dota2.Dota2Client.prototype.tipPlayer = function(account_id, match_id, event_id) {
    /* Requests a list of chat channels from the GC. */
    this.Logger.debug("Tipping someone");
    
    var payload = {
        "recipient_account_id": account_id,
        "match_id": match_id,
        "event_id": event_id
    };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCGiveTip, 
                    Dota2.schema.lookupType("CMsgClientToGCGiveTip").encode(payload).finish());
};

// Events
/**
 * Event that's emitted in response to a {@link module:Dota2.Dota2Client#tipPlayer|request for tipping a player}
 * @event module:Dota2.Dota2Client#tipResponse
 * @param {CMsgClientToGCGiveTipResponse.Result} tipResponse - Whether or not the tip was successful
 */
/**
 * Event that's emitted whenever the bot got tipped
 * @event module:Dota2.Dota2Client#tipped
 * @param {number} tipper_account_id - Dota 2 account ID of the person who tipped
 * @param {string} tipper_name - Name of the tipper
 * @param {number} recipient_account_id - Dota 2 account ID of the person who got tipped
 * @param {string} recipient_name - Name of the one who got tipped
 * @param {number} event_id - ID of the event during which the tip occurred
 */


var handlers = Dota2.Dota2Client.prototype._handlers;

var onTipResponse = function onPracticeLobbyListResponse(message, callback) {
    var tipResponse = Dota2.schema.lookupType("CMsgClientToGCGiveTipResponse").decode(message);

    this.Logger.debug("Received tip response " + tipResponse);
    this.emit("tipResponse", tipResponse.result);
    if (callback) callback(null, tipResponse);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgClientToGCGiveTipResponse] = onTipResponse;

var onTipNotification = function onPracticeLobbyListResponse(message) {
    var tipNotification = Dota2.schema.lookupType("CMsgGCToClientTipNotification").decode(message);

    this.Logger.debug("Received tip notification " + tipNotification);
    this.emit("tipped", 
                tipNotification.tipper_account_id,
                tipNotification.tipper_name,
                tipNotification.recipient_account_id,
                tipNotification.recipient_name,
                tipNotification.event_id);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCToClientTipNotification] = onTipNotification;
