var Dota2 = require("../index"),
    util = require("util");
    
    
// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onPopUp = function onPopUp(message) {
    var popup = Dota2.schema.CMsgDOTAPopup.decode(message);
    if (this.debug) util.log("Received popup: "+popup.custom_text);
    this.emit("popup", popup.id, popup);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCPopup] = onPopUp;