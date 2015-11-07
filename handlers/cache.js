var Dota2 = require("../index"),
    util = require("util");

var cacheTypeIDs = {
    LOBBY: 2004,
    PARTY: 2003,
    PARTY_INVITE: 2006
};

// Handlers
function handleSubscribedType(obj_type, object_data) {
    switch (obj_type) {
        // Lobby snapshot.
        case cacheTypeIDs.LOBBY:
            var lobby = Dota2.schema.CSODOTALobby.decode(object_data);
            if (this.debug) util.log("Received lobby snapshot for lobby ID " + lobby.lobby_id);
            this.emit("practiceLobbyUpdate", lobby);
            this.Lobby = lobby;
            break;
            // Party snapshot.
        case cacheTypeIDs.PARTY:
            var party = Dota2.schema.CSODOTAParty.decode(object_data);
            if (this.debug) util.log("Received party snapshot for party ID " + party.party_id);
            this.emit("partyUpdate", party);
            this.Party = party;
            break;
            // Party invite snapshot.
        case cacheTypeIDs.PARTY_INVITE:
            var party = Dota2.schema.CSODOTAPartyInvite.decode(object_data);
            if (this.debug) util.log("Received party invite snapshot for group ID " + party.group_id);
            this.emit("partyInviteUpdate", party);
            this.PartyInvite = party;
            break;
        default:
            if (this.debug) util.log("Unknown cache ID: " + obj_type);
            break;
    }
};

Dota2.Dota2Client.prototype._handleWelcomeCaches = function handleWelcomeCaches(message) {
    var welcome = Dota2.schema.CMsgClientWelcome.decode(message);
    var _self = this;

    if (welcome.outofdate_subscribed_caches)
        welcome.outofdate_subscribed_caches.forEach(function(cache) {
            cache.objects.forEach(function(obj) {
                handleSubscribedType.call(_self, obj.type_id, obj.object_data[0]);
            });
        });
};

var handlers = Dota2.Dota2Client.prototype._handlers;

var onCacheSubscribed = function onCacheSubscribed(message) {
    var subscribe = Dota2.schema.CMsgSOCacheSubscribed.decode(message);
    var _self = this;

    if (this.debug) {
        util.log("Cache subscribed, type " + subscribe.objects[0].type_id);
    }

    subscribe.objects.forEach(function(obj) {
        handleSubscribedType.call(_self, obj.type_id, obj.object_data[0]);
    });
};
handlers[Dota2.schema.ESOMsg.k_ESOMsg_CacheSubscribed] = onCacheSubscribed;

var onUpdateMultiple = function onUpdateMultiple(message) {
    var multi = Dota2.schema.CMsgSOMultipleObjects.decode(message);
    var _self = this;

    if (multi.objects_modified)
        multi.objects_modified.forEach(function(obj) {
            handleSubscribedType.call(_self, obj.type_id, obj.object_data);
        });
};
handlers[Dota2.schema.ESOMsg.k_ESOMsg_UpdateMultiple] = onUpdateMultiple;

var onCreate = function onCreate(message) {
    var single = Dota2.schema.CMsgSOSingleObject.decode(message);
    var _self = this;

    if (this.debug) {
        util.log("Create, type " + single.type_id);
    }
    handleSubscribedType.call(_self, single.type_id, single.object_data);
}
handlers[Dota2.schema.ESOMsg.k_ESOMsg_Create] = onCreate;

var onCacheUnsubscribed = function onCacheUnsubscribed(message) {
    var unsubscribe = Dota2.schema.CMsgSOCacheUnsubscribed.decode(message);
    var _self = this;

    if (this.debug) util.log("Cache unsubscribed, " + unsubscribe.owner_soid.id);

    if (this.Lobby && "" + unsubscribe.owner_soid.id === "" + this.Lobby.lobby_id) {
        this.Lobby = null;
        this.emit("practiceLobbyCleared");
    } else if (this.Party && "" + unsubscribe.owner_soid.id === "" + this.Party.party_id) {
        this.Party = null;
        this.emit("partyCleared");
    } else if (this.PartyInvite && "" + unsubscribe.owner_soid.id === "" + this.PartyInvite.group_id) {
        this.PartyInvite = null;
        this.emit("partyInviteCleared");
    }
};
handlers[Dota2.schema.ESOMsg.k_ESOMsg_CacheUnsubscribed] = onCacheUnsubscribed;

var onCacheDestroy = function onCacheDestroy(message) {
    var destroy = Dota2.schema.CMsgSOSingleObject.decode(message);
    var _self = this;

    if (this.debug) util.log("Cache destroy, " + destroy.type_id);

    if (destroy.type_id === cacheTypeIDs.PARTY_INVITE) {
        this.PartyInvite = null;
        this.emit("partyInviteCleared");
    }
};
handlers[Dota2.schema.ESOMsg.k_ESOMsg_CacheDestroy] = onCacheDestroy;