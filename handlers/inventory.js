var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.setItemPositions = function(item_positions) {
    /* Attempts to move inventory items to positions as noted itemPositions - which is interpreted as a [itemid, position] tuple. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Setting item positions.");
    var payloadItemPositions = item_positions.map(function(item) {
            return {
                "itemId": item[0],
                "position": item[1]
            };
        }),
        payload = new Dota2.schema.CMsgSetItemPositions({
            "itemPositions": payloadItemPositions
        });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCSetItemPositions;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
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
            "msg": Dota2.schema.EGCItemMsg.k_EMsgGCDelete
        },
        buffer
    );
};