var Dota2 = require("../index"),
    util = require("util");

Dota2.Dota2Client.prototype.requestMyTeams = function requestMyTeams(callback) {
    // Request the team data for the currently logged in user
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Requesting my own team data");
    var payload = new Dota2.schema.CMsgDOTARequestTeamData({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCRequestTeamData;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onTeamDataResponse.call(_self, body, callback);
        }
    );
}

Dota2.Dota2Client.prototype.requestTeamProfile = function requestTeamProfile(team_id, callback) {
    // Request the profile of a given team
    callback = callback || null;
    
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending team profile request");
    var payload = new Dota2.schema.CMsgDOTATeamProfileRequest({
        "team_id": team_id
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCTeamProfileRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onTeamProfileResponse.call(_self, body, callback);
        }
    );
}

Dota2.Dota2Client.prototype.requestTeamIDByName = function requestTeamIDByName(team_name, callback) {
    // Request the ID of a given team
    callback = callback || null;
    
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending team ID by name request");
    var payload = new Dota2.schema.CMsgDOTATeamIDByNameRequest({
        "name": team_name
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCTeamIDByNameRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onTeamIDByNameResponse.call(_self, body, callback);
        }
    );
}

Dota2.Dota2Client.prototype.requestTeamMemberProfile = function requestTeamMemberProfile(steam_id, callback) {
    // Request the profile of a given team member
    callback = callback || null;
    
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending team member profile request");
    var payload = new Dota2.schema.CMsgDOTATeamMemberProfileRequest({
        "steam_id": steam_id
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCTeamMemberProfileRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onTeamProfileResponse.call(_self, body, callback);
        }
    );
}

Dota2.Dota2Client.prototype.requestProTeamList = function requestProTeamList(callback) {
    // Request the list of pro teams
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Requesting list of pro teams");
    var payload = new Dota2.schema.CMsgDOTAProTeamListRequest({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCProTeamListRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onProTeamListResponse.call(_self, body, callback);
        }
    );
}


var handlers = Dota2.Dota2Client.prototype._handlers;

var onTeamDataResponse = function onTeamDataResponse(message, callback) {
    var teamDataResponse = Dota2.schema.CMsgDOTARequestTeamDataResponse.decode(message);
    
    if (teamDataResponse.result === Dota2.schema.CMsgDOTARequestTeamDataResponse.Result.SUCCESS) {
        if (this.debug) util.log("Received my teams response " + JSON.stringify(teamDataResponse));
        this.emit("teamData", teamDataResponse.data);
        if (callback) callback(null, teamDataResponse);
    } else {
        if (this.debug) util.log("Received a bad my teams response " + JSON.stringify(teamDataResponse));
        if (callback) callback(teamDataResponse.result, teamDataResponse);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCRequestTeamDataResponse] = onTeamDataResponse;

var onTeamProfileResponse = function onTeamProfileResponse(message, callback) {
    var teamProfileResponse = Dota2.schema.CMsgDOTATeamProfileResponse.decode(message);
    
    if (teamProfileResponse.eresult === 1) {
        if (this.debug) util.log("Received team profile response " + JSON.stringify(teamProfileResponse));
        this.emit("teamProfile", teamProfileResponse.team.team_id, teamProfileResponse.team);
        if (callback) callback(null, teamProfileResponse);
    } else {
        if (this.debug) util.log("Couldn't find team profile " + JSON.stringify(teamProfileResponse));
        if (callback) callback(teamProfileResponse.eresult, teamProfileResponse);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCTeamProfileResponse] = onTeamProfileResponse;

var onTeamIDByNameResponse = function onTeamIDByNameResponse(message, callback) {
    var teamID = Dota2.schema.CMsgDOTATeamIDByNameResponse.decode(message);
    
    if (teamID.eresult === 1) {
        if (this.debug) util.log("Received team ID " + teamID.team_id);
        this.emit("teamID", teamID.team_id);
        if (callback) callback(null, teamID);
    } else {
        if (this.debug) util.log("Couldn't find team ID " + JSON.stringify(teamID));
        this.emit("teamID", null);
        if (callback) callback(teamID.eresult, teamID);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCTeamIDByNameResponse] = onTeamIDByNameResponse;

var onProTeamListResponse = function onProTeamListResponse(message, callback) {
    var teams = Dota2.schema.CMsgDOTAProTeamListResponse.decode(message);
    
    if (teams.eresult === 1) {
        if (this.debug) util.log("Received pro team list");
        this.emit("proTeamListData", teams.teams);
        if (callback) callback(null, teams);
    } else {
        if (this.debug) util.log("Bad pro team list response " + JSON.stringify(teams));
        this.emit("proTeamListData", null);
        if (callback) callback(teams.eresult, teams);
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCProTeamListResponse] = onProTeamListResponse;