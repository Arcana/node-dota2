var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    dota2 = require("../"),
    bot = new steam.SteamClient(),
    Dota2 = new dota2(bot, true);

global.config = require("./config");

/* Steam logic */
var onSteamLogOn = function onSteamLogOn(){
        bot.setPersonaState(steam.EPersonaState.Busy); // to display your bot's status as "Online"
        bot.setPersonaName(config.steam_name); // to change its nickname
        util.log("Logged on.");

        Dota2.launch();
        Dota2.on("ready", function() {
            // Dota2.setItemPositions([[ITEM ID, POSITION]]);
            // Dota2.deleteItem(ITEM ID);
            // Dota2.joinChat("wobwobwob");
            // setTimeout(function(){ Dota2.sendMessage("wobwobwob", "wowoeagnaeigniaeg"); }, 5000);
            // setTimeout(function(){ Dota2.leaveChat("wobwobwob"); }, 10000);
        });

        Dota2.on("chatMessage", function(channel, personaName, message) {
            util.log([channel, personaName, message].join(", "));
        });
        // setTimeout(function(){ Dota2.exit(); }, 5000);
    },
    onSteamSentry = function onSteamSentry(sentry) {
        util.log("Received sentry.");
        require('fs').writeFileSync('sentry', sentry);
    },
    onSteamServers = function onSteamServers(servers) {
        util.log("Received servers.");
        fs.writeFile('servers', JSON.stringify(servers));
    },
    onWebSessionID = function onWebSessionID(webSessionID) {
        util.log("Received web session id.");
        // steamTrade.sessionID = webSessionID;
        bot.webLogOn(function onWebLogonSetTradeCookies(strCookies) {
            util.log("Received cookies.");
            cookies = strCookies.split(";");
            for (var i = 0; i < cookies.length; i++) {
                // steamTrade.setCookie(cookies[i]);
            }
        });
    };

bot.logOn(config.steam_user, config.steam_pass, config.steam_guard_code || fs.readFileSync('sentry'));
bot.on("loggedOn", onSteamLogOn)
    .on('sentry', onSteamSentry)
    .on('servers', onSteamServers)
    .on('webSessionID', onWebSessionID);