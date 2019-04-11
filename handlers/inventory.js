'use strict';

var Dota2 = require("../index");

// Methods
/**
 * Attempts to change the position of one or more items in your inventory.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#setItemPositions
 * @param {Object[]} item_positions - The new positions of the items
 * @param {number} item_positions[].item_id - ID of the item
 * @param {number} item_positions[].position - New position of the item
 */
Dota2.Dota2Client.prototype.setItemPositions = function(item_positions) {
    this.Logger.debug("Setting item positions.");

    let payload = new Dota2.schema.CMsgSetItemPositions({
        "item_positions": item_positions
    });
    this.sendToGC(Dota2.schema.EGCItemMsg.k_EMsgGCSetItemPositions, payload);
};

/**
 * Attempts to delete an item in your inventory.
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#deleteItem
 * @param {number} item_id - ID of the item
 */
Dota2.Dota2Client.prototype.deleteItem = function(item_id) {
    /* Attempts to delete item by itemid. */
    if (!this._gcReady) {
        this.Logger.error("GC not ready, please listen for the 'ready' event.");
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
