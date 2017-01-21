var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.setItemPositions = function(item_positions) {
    /* Attempts to move inventory items to positions as noted itemPositions - which is interpreted as a [itemid, position] tuple. */
    if (this.debug) util.log("Setting item positions.");
    
    var payloadItemPositions = item_positions.map(function(item) {
            return {
                "itemId": item[0],
                "position": item[1]
            };
        }),
        payload = {
            "itemPositions": payloadItemPositions
        };
    this.sendToGC(  Dota2.schema.lookupEnum("EDOTAGCMsg").k_EMsgGCSetItemPositions, 
                    Dota2.schema.lookupType("CMsgSetItemPositions").encode(payload).finish());
};

Dota2.Dota2Client.prototype.deleteItem = function(item_id) {
    /* Attempts to delete item by itemid. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }
    var buffer = new Buffer(8);
    buffer.writeUInt64LE(item_id);
    this._gc.send({
            "msg": Dota2.schema.lookupEnum("EGCItemMsg").k_EMsgGCDelete
        },
        buffer
    );
};