var Dota2 = require("../index"),
    util = require("util");

// Helper methods
Dota2._parseOptions = function(options, possibleOptions) {
    var details, option, type, value;

    details = {};

    for (option in options) {
        value = options[option];
        type = possibleOptions[option];
        if (type == null) {
            if (this.debug) {
                util.log("Option " + option + " is not possible.");
            }
            continue;
        }
        if (typeof value !== type) {
            if (this.debug) {
                util.log("Option " + option + " must be a " + type + ".");
            }
            continue;
        }
        details[option] = value;
    }

    return details;
};

Dota2._convertCallback = function(handler, callback) {
    var self = this;
    return function (header, body) {
        handler.call(self, body, callback);
    }
};