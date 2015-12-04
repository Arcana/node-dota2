var Dota2 = require("../index"),
    util = require("util");

Dota2._playerHistoryOptions = {
    start_at_match_id: "number",
    matches_requested: "number",
    hero_id: "number",
    request_id: "number"
};

// Methods
Dota2.Dota2Client.prototype.requestPlayerMatchHistory = function(account_id, options, callback) {
    callback = callback || null;
    options = options || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting `accountId`'s player match history.  Listen for `playerMatchHistoryData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending player match history request");
    var command = Dota2._parseOptions(options, Dota2._playerHistoryOptions);
    command.account_id = account_id;
    command.matches_requested = command.matches_requested || 1;
    command.request_id = command.request_id || account_id;
    var payload = new Dota2.schema.CMsgDOTAGetPlayerMatchHistory(command);
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgDOTAGetPlayerMatchHistory;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPlayerMatchHistoryResponse.call(_self, body, callback);
        }
    );
};

Dota2.Dota2Client.prototype.requestProfile = function(account_id, request_name, callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending profile request");
    var payload = new Dota2.schema.CMsgDOTAProfileRequest({
        "account_id": account_id,
        "request_name": request_name,
        "engine": 1
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCProfileRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onProfileResponse.call(_self, body, callback);
        }
    );
};

Dota2.Dota2Client.prototype.requestProfileCard = function(account_id, callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile card.  Listen for `profileCardData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending profile card request");
    var payload = new Dota2.schema.CMsgClientToGCGetProfileCard({
        "account_id": account_id
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetProfileCard;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onProfileCardResponse.call(_self, body, callback);
        }
    );
};

Dota2.Dota2Client.prototype.requestPassportData = function(account_id, callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending passport data request");
    var payload = new Dota2.schema.CMsgPassportDataRequest({
        "account_id": account_id
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPassportDataRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPassportDataResponse.call(_self, body, callback);
        }
    );
};

Dota2.Dota2Client.prototype.requestHallOfFame = function(week, callback) {
    week = week || null;
    callback = callback || null;
    var _self = this;

    /* Sends a message to the Game Coordinator requesting `accountId`'s passport data.  Listen for `passportData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending hall of fame request.");
    var payload = new Dota2.schema.CMsgDOTAHallOfFameRequest({
        "week": week
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCHallOfFameRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onHallOfFameResponse.call(_self, body, callback);
        }
    );
};

Dota2.Dota2Client.prototype.requestPlayerInfo = function(account_ids) {
    // This one doesn't support callbacks
    account_ids = account_ids || [];
    account_ids = Array.isArray(account_ids) ? account_ids : [account_ids];

    var _self = this;

    if (account_ids.length == 0) {
        if (this.debug) util.log("Account ids must be a single id or array of ids.");
        return null;
    }

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending player info request.");

    var payload = new Dota2.schema.CMsgGCPlayerInfoRequest({
        account_ids: account_ids
    });

    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPlayerInfoRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );
};

Dota2.Dota2Client.prototype.requestTrophyList = function(account_id, callback) {
    account_id = account_id || null;

    var _self = this;

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending trophy list request.");

    var payload = new Dota2.schema.CMsgClientToGCGetTrophyList({
        "account_id": account_id
    });

    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetTrophyList;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onTrophyListResponse.call(_self, body, callback);
        }
    );
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onPlayerMatchHistoryResponse = function onPlayerMatchHistoryResponse(message, callback) {
    callback = callback || null;
    var matchHistoryResponse = Dota2.schema.CMsgDOTAGetPlayerMatchHistoryResponse.decode(message);

    if (typeof matchHistoryResponse.matches != "undefined") {
        if (this.debug) util.log("Received player match history data");
        this.emit("playerMatchHistoryData", matchHistoryResponse.requestId, matchHistoryResponse);
        if (callback) callback(null, matchHistoryResponse);
    } else {
        if (this.debug) util.log("Received a bad GetPlayerMatchHistoryResponse");
        if (callback) callback(matchHistoryResponse.result, matchHistoryResponse);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgDOTAGetPlayerMatchHistoryResponse] = onPlayerMatchHistoryResponse;

var onProfileResponse = function onProfileResponse(message, callback) {
    callback = callback || null;
    var profileResponse = Dota2.schema.CMsgDOTAProfileResponse.decode(message);

    if (profileResponse.result === 1) {
        if (this.debug) util.log("Received profile data for: " + profileResponse.game_account_client.account_id);
        this.emit("profileData", profileResponse.game_account_client.account_id, profileResponse);
        if (callback) callback(null, profileResponse);
    } else {
        if (this.debug) util.log("Received a bad profileResponse");
        if (callback) callback(profileResponse.result, profileResponse);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCProfileResponse] = onProfileResponse;

var onProfileCardResponse = function onProfileCardResponse(message, callback) {
    callback = callback || null;
    var profileCardResponse = Dota2.schema.CMsgDOTAProfileCard.decode(message);

    if (this.debug) util.log("Received profile card data for: " + profileCardResponse.account_id);
    this.emit("profileCardData", profileCardResponse.account_id, profileCardResponse);
    if (callback) callback(null, profileCardResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetProfileCardResponse] = onProfileCardResponse;

var onPassportDataResponse = function onPassportDataResponse(message, callback) {
    callback = callback || null;
    var passportDataResponse = Dota2.schema.CMsgPassportDataResponse.decode(message);

    if (this.debug) util.log("Received passport data for: " + passportDataResponse.account_id);
    this.emit("passportData", passportDataResponse.account_id, passportDataResponse);
    if (callback) callback(null, passportDataResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCPassportDataResponse] = onPassportDataResponse;

var onHallOfFameResponse = function onHallOfFameResponse(message, callback) {
    callback = callback || null;
    var hallOfFameResponse = Dota2.schema.CMsgDOTAHallOfFameResponse.decode(message);

    if (hallOfFameResponse.eresult === 1) {
        if (this.debug) util.log("Received hall of fame response for week: " + hallOfFameResponse.hall_of_fame.week);
        this.emit("hallOfFameData", hallOfFameResponse.hall_of_fame.week, hallOfFameResponse.hall_of_fame.featured_players, hallOfFameResponse.hall_of_fame.featured_farmer, hallOfFameResponse);
        if (callback) callback(null, hallOfFameResponse);
    } else {
        if (this.debug) util.log("Received a bad hall of fame.");
        if (callback) callback(hallOfFameResponse.result, hallOfFameResponse);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCHallOfFameResponse] = onHallOfFameResponse;

var onPlayerInfoResponse = function onPlayerInfoResponse(message) {
    var playerInfoResponse = Dota2.schema.CMsgGCPlayerInfo.decode(message);

    if (this.debug) util.log("Received new player info data");
    this.emit("playerInfoData", playerInfoResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCPlayerInfo] = onPlayerInfoResponse;

var onTrophyListResponse = function onTrophyListResponse(message, callback) {
    var trophyListResponse = Dota2.schema.CMsgClientToGCGetTrophyListResponse.decode(message);

    if (this.debug) util.log("Received new trophy list data.");
    this.emit("trophyListData", trophyListResponse);
    if (callback) callback(null, trophyListResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCGetTrophyListResponse] = onTrophyListResponse;