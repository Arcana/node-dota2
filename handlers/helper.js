var Dota2 = require("../index");

// Enums
/**
 * Enum for the different fantasy stats
 * @alias module:Dota2.FantasyStats
 * @readonly
 * @enum {number}
 **/
Dota2.FantasyStats = {
    KILLS: 0,
    DEATHS: 1,
    CREEPS: 2,
    GPM: 3,
    TOWERS: 4,
    ROSHAN: 5,
    TEAMFIGHT: 6,
    OBSERVER: 7,
    STACKS: 8,
    RUNES: 9,
    FIRSTBLOOD: 10,
    STUNS: 11
}
/**
 * Enum for all server regions. This enum is kept up to date on a best effort base.
 * For the up-to-date values, check your game's regions.txt or {@link https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/regions.txt|SteamDB's version}
 * @alias module:Dota2.ServerRegion
 * @readonly 
 * @enum {number}
 */
Dota2.ServerRegion = {
    UNSPECIFIED : 0,
    USWEST : 1,
    USEAST : 2,
    EUROPE : 3,
    KOREA : 4,
    SINGAPORE : 5,
    DUBAI : 6,
    AUSTRALIA : 7,
    STOCKHOLM : 8,
    AUSTRIA : 9,
    BRAZIL : 10,
    SOUTHAFRICA : 11,
    PWTELECOMSHANGHAI : 12,
    PWUNICOM : 13,
    CHILE : 14,
    PERU : 15,
    INDIA : 16,
    PWTELECOMGUANGZHOU : 17,
    PWTELECOMZHEJIANG : 18,
    JAPAN : 19,
    PWTELECOMWUHAN : 20
};

/**
 * Enum for different types of series.
 * @alias module:Dota2.SeriesType
 * @readonly
 * @enum {number}
 */
Dota2.SeriesType = {
    NONE: 0,
    BEST_OF_THREE: 1,
    BEST_OF_FIVE: 2
};


/**
 * @callback module:Dota2~requestCallback
 * @param {number} errorCode - Null if everything went well, else the error code
 * @param {Object} responseMessage - The response message the GC sent
 */

// Helper methods
Dota2._parseOptions = function(options, possibleOptions) {
    var details, option, type, value;

    details = {};

    for (option in options) {
        value = options[option];
        type = possibleOptions[option];
        if (type == null) {
            if (this.debug) {
                this.Logger.debug("Option " + option + " is not possible.");
            }
            continue;
        }
        if (typeof value !== type) {
            if (this.debug) {
                this.Logger.debug("Option " + option + " must be a " + type + ".");
            }
            continue;
        }
        details[option] = value;
    }

    return details;
};

Dota2._convertCallback = function(handler, callback) {
    var self = this;
    if (callback && handler) {
        return function (header, body) {
            handler.call(self, body, callback);
        }
    } else {
        return undefined;
    }
};

Dota2._getPropertyByValue = function(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

Dota2._getMessageName = function(kMsg) {
    var msgTypes = [Dota2.schema.EDOTAGCMsg,  
                    Dota2.schema.ESOMsg, 
                    Dota2.schema.EGCBaseClientMsg,
                    Dota2.schema.EGCEconBaseMsg,
                    Dota2.schema.EGCBaseMsg,
                    Dota2.schema.EGCItemMsg,
                    Dota2.schema.EGCMsgInitiateTradeResponse,
                    Dota2.schema.EGCMsgResponse,
                    Dota2.schema.EGCMsgUseItemResponse];
    for (var i=0; i<msgTypes.length; i++) {
        let msg = Object.keys(msgTypes[i]).find(key => msgTypes[i][key] === kMsg);
        if (msg) return msg;
    }
}