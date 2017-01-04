var Dota2 = require("../index"),
    util = require("util");

var cacheTypeIDs = {
    // Legacy values
    LOBBY: 2004,
    PARTY: 2003,
    PARTY_INVITE: 2006,
    LOBBY_INVITE: 2011,
    // Actual values
    CSOEconItem : 1,
    CSOItemRecipe : 5,
    CSOEconGameAccountClient : 7,
    CSOSelectedItemPreset : 35,      // no longer exists in game files
    CSOEconItemPresetInstance : 36,  // no longer exists in game files
    CSOEconItemDropRateBonus : 38,
    CSOEconItemLeagueViewPass : 39,
    CSOEconItemEventTicket : 40,
    CSOEconItemTournamentPassport : 42,
    CSODOTAGameAccountClient : 2002,
    CSODOTAParty : 2003,
    CSODOTALobby : 2004,
    CSODOTAPartyInvite : 2006,
    CSODOTAGameHeroFavorites : 2007,
    CSODOTAMapLocationState : 2008,
    CMsgDOTATournament : 2009,
    CSODOTAPlayerChallenge : 2010,
    CSODOTALobbyInvite : 2011
};

// Handlers
function handleSubscribedType(obj_type, object_data) {
    switch (obj_type) {
        // Inventory item
        case cacheTypeIDs.CSOEconItem:
            if (this.debug) util.log("Received inventory snapshot");
            var inv = object_data.map(obj => Dota2.schema.lookupType("CSOEconItem").decode(obj));
            this.emit("inventoryUpdate", inv);
            this.Inventory = inv;
            break;
        // Lobby snapshot.
        case cacheTypeIDs.CSODOTALobby:
            // object_data is an array when called from onCacheSubscribed
            // but an object when called from onUpdateMultiple
            var lobby = Dota2.schema.lookupType("CSODOTALobby").decode([].concat(object_data)[0]);
            if (this.debug) util.log("Received lobby snapshot for lobby ID " + lobby.lobby_id);
            this.emit("practiceLobbyUpdate", lobby);
            this.Lobby = lobby;
            break;
        // Lobby invite snapshot.
        case cacheTypeIDs.CSODOTALobbyInvite:
            var lobby = Dota2.schema.lookupType("CSODOTALobbyInvite").decode(object_data[0]);
            if (this.debug) util.log("Received lobby invite snapshot for group ID " + lobby.group_id);
            this.emit("lobbyInviteUpdate", lobby);
            this.LobbyInvite = lobby;
            break;
        // Party snapshot.
        case cacheTypeIDs.CSODOTAParty:
            var party = Dota2.schema.lookupType("CSODOTAParty").decode([].concat(object_data)[0]);
            if (this.debug) util.log("Received party snapshot for party ID " + party.party_id);
            this.emit("partyUpdate", party);
            this.Party = party;
            break;
        // Party invite snapshot.
        case cacheTypeIDs.CSODOTAPartyInvite:
            var party = Dota2.schema.lookupType("CSODOTAPartyInvite").decode(object_data[0]);
            if (this.debug) util.log("Received party invite snapshot for group ID " + party.group_id);
            this.emit("partyInviteUpdate", party);
            this.PartyInvite = party;
            break;
        default:
            if (this.debug) util.log("Unhandled cache ID: " + obj_type);
            break;
    }
};

Dota2.Dota2Client.prototype._handleWelcomeCaches = function handleWelcomeCaches(message) {
    var welcome = Dota2.schema.lookupType("CMsgClientWelcome").decode(message);
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
    var subscribe = Dota2.schema.lookupType("CMsgSOCacheSubscribed").decode(message);
    var _self = this;

    if (this.debug) {
        util.log("Cache(s) subscribed, type(s): " + subscribe.objects.map(obj=>obj.type_id).toString());
    }

    subscribe.objects.forEach(function(obj) {
        handleSubscribedType.call(_self, obj.type_id, obj.object_data);
    });
};
handlers[Dota2.schema.lookupEnum("ESOMsg").k_ESOMsg_CacheSubscribed] = onCacheSubscribed;

var onUpdateMultiple = function onUpdateMultiple(message) {
    var multi = Dota2.schema.lookup("CMsgSOMultipleObjects").decode(message);
    var _self = this;

    if (multi.objects_modified)
        multi.objects_modified.forEach(function(obj) {
            handleSubscribedType.call(_self, obj.type_id, obj.object_data);
        });
};
handlers[Dota2.schema.lookupEnum("ESOMsg").k_ESOMsg_UpdateMultiple] = onUpdateMultiple;

var onCreate = function onCreate(message) {
    var single = Dota2.schema.lookup("CMsgSOSingleObject").decode(message);
    var _self = this;

    if (this.debug) {
        util.log("Create, type " + single.type_id);
    }
    handleSubscribedType.call(_self, single.type_id, single.object_data);
}
handlers[Dota2.schema.lookupEnum("ESOMsg").k_ESOMsg_Create] = onCreate;

var onCacheUnsubscribed = function onCacheUnsubscribed(message) {
    var unsubscribe = Dota2.schema.lookup("CMsgSOCacheUnsubscribed").decode(message);
    var _self = this;

    if (this.debug) util.log("Cache unsubscribed, " + unsubscribe.owner_soid.id);

    if (this.Lobby && "" + unsubscribe.owner_soid.id === "" + this.Lobby.lobby_id) {
        this.Lobby = null;
        this.emit("practiceLobbyCleared");
    } else if (this.LobbyInvite && "" + unsubscribe.owner_soid.id === "" + this.LobbyInvite.group_id) {
        this.LobbyInvite = null;
        this.emit("lobbyInviteCleared");
    } else if (this.Party && "" + unsubscribe.owner_soid.id === "" + this.Party.party_id) {
        this.Party = null;
        this.emit("partyCleared");
    } else if (this.PartyInvite && "" + unsubscribe.owner_soid.id === "" + this.PartyInvite.group_id) {
        this.PartyInvite = null;
        this.emit("partyInviteCleared");
    }
};
handlers[Dota2.schema.lookupEnum("ESOMsg").k_ESOMsg_CacheUnsubscribed] = onCacheUnsubscribed;

var onCacheDestroy = function onCacheDestroy(message) {
    var destroy = Dota2.schema.lookup("CMsgSOSingleObject").decode(message);
    var _self = this;

    if (this.debug) util.log("Cache destroy, " + destroy.type_id);

    if (destroy.type_id === cacheTypeIDs.CSODOTAPartyInvite) {
        this.PartyInvite = null;
        this.emit("partyInviteCleared");
    }
    if (destroy.type_id === cacheTypeIDs.CSODOTALobbyInvite) {
        this.LobbyInvite = null;
        this.emit("lobbyInviteCleared");
    }
};
handlers[Dota2.schema.lookupEnum("ESOMsg").k_ESOMsg_Destroy] = onCacheDestroy;