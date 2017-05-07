var Dota2 = require("../index"),
    util = require("util");
    
// Events
/**
 * Emitted when the server wants the client to create a pop-up
 * @event module:Dota2.Dota2Client#popup
 * @param {number} id - Type of the pop-up.
 * @param {CMsgDOTAPopup} popup - The raw pop-up object. Can contain further specifications like formattable text
 */


// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onPopUp = function onPopUp(message) {
    var popup = Dota2.schema.lookupType("CMsgDOTAPopup").decode(message);
    this.Logger.debug("Received popup: "+popup.custom_text);
    this.emit("popup", popup.id, popup);
};
handlers[Dota2.schema.lookupEnum("EDOTAGCMsg").values.k_EMsgGCPopup] = onPopUp;