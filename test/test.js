var steam = require("steam"),
    dota2 = require("../"),
    steamClient = new steam.SteamClient(),
    steamUser = new steam.SteamUser(steamClient),
    Dota2 = new dota2.Dota2Client(steamClient, true);

var launchDota2 = function (done) {
    steamClient.connect();
    steamClient.on('connected', function() {
        steamUser.logOn({
            "account_name": process.env.STEAM_USERNAME,
            "password": process.env.STEAM_PASSWORD,
        });
    });

    steamClient.on('logOnResponse', function onSteamLogOn(logonResp) {
        if (logonResp.eresult == steam.EResult.OK) {
            Dota2.launch();
            Dota2.on("ready", function() {
                done();
            });
        }
    });
};

// Dota2 tests!
describe('Dota2', function() {
    this.timeout(30000); // 30s timeout because Steam is slooooooooow

    describe('#launch', function() {
        it('should receive ready event from GC', function(done) {
            // I love indentation.

            launchDota2(done);
        });
    });
});