var Dota2 = require("../index"),
    util = require("util");

// Methods

Dota2.Dota2Client.prototype.setItemPositions = function(itemPositions) {
  /* Attempts to move inventory items to positions as noted itemPositions - which is interpreted as a [itemid, position] tuple. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Setting item positions.");
  var payloadItemPositions = itemPositions.map(function(item){ return {"itemId": item[0], "position": item[1]}; }),
    payload = new Dota2.schema.CMsgSetItemPositions({"itemPositions": payloadItemPositions});
  this.protoBufHeader.msg = Dota2.EDOTAGCMsg.k_EMsgGCSetItemPositions;
  this._gc.send(this.protoBufHeader,
                payload.toBuffer()
  );
};

Dota2.Dota2Client.prototype.deleteItem = function(itemid) {
  /* Attempts to delete item by itemid. */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }
  var buffer = new Buffer(8);
  buffer.writeUInt64LE(itemid); 
  this._gc.send({
          "msg":    Dota2.EGCItemMsg.k_EMsgGCDelete
        },
        buffer
  );
};