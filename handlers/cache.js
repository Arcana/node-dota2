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
            var lobbyInvite = Dota2.schema.lookupType("CSODOTALobbyInvite").decode(object_data[0]);
            if (this.debug) util.log("Received lobby invite snapshot for group ID " + lobbyInvite.group_id);
            this.emit("lobbyInviteUpdate", lobbyInvite);
            this.LobbyInvite = lobbyInvite;
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

// Events
/**
 * Emitted when the GC sends an inventory snapshot. The GC is incredibly
 * inefficient and will send the entire object even if it's a minor update.
 * You can use this to detect when a change was made to your inventory (e.g. drop)
 * Note that the {@link module:Dota2.Dota2Client#Inventory|Inventory} property will be the old value until after this event 
 * completes to allow comparison between the two.
 * @event module:Dota2.Dota2Client#inventoryUpdate
 * @param {CSOEconItem[]} inventory - A list of `CSOEconItem` objects
 */
 /**
 * Emitted when the GC sends a lobby snapshot. The GC is incredibly
 * inefficient and will send the entire object even if it's a minor update.
 * You can use this to detect when a lobby has been entered / created
 * successfully as well. Note that the {@link module:Dota2.Dota2Client#Lobby|Lobby} property will be the old
 * value until after this event completes to allow comparison between the
 * two.
 * @event module:Dota2.Dota2Client#practiceLobbyUpdate
 * @param {CSODOTALobby} lobby - The new state of the lobby.
 */
 /**
 * Emitted when leaving a lobby (aka, the lobby is cleared). This can
 * happen when kicked, upon leaving a lobby, etc. There are other events
 * to tell when the bot has been kicked.
 * @event module:Dota2.Dota2Client#practiceLobbyCleared
 */
 /**
 * Emitted when the bot received an invite to a lobby
 * @event module:Dota2.Dota2Client#lobbyInviteUpdate
 * @param {CSODOTALobbyInvite} lobbyInvite - The invitation to a lobby.
 */
 /**
 * Emitted when the Lobby Invite is cleared, for example when
 * accepting/rejecting it or when the lobby is closed.
 * @event module:Dota2.Dota2Client#lobbyInviteCleared
 */
 /**
 * Emitted when the GC sends a party snapshot. The GC is incredibly
 * inefficient and will send the entire object even if it's a minor update.
 * You can use this to detect when a party has been entered / created
 * successfully as well. Note that the {@link module:Dota2.Dota2Client#Party|Party} property will be the old
 * value until after this event completes to allow comparison between the
 * two.
 * @event module:Dota2.Dota2Client#partyUpdate
 * @param {CSODOTAParty} party - The new state of the party.
 */
 /**
 * Emitted when leaving a party (aka, the party is cleared). This can
 * happen when kicked, upon leaving a party, etc. There are other callbacks
 * to tell when the bot has been kicked.
 * @event module:Dota2.Dota2Client#partyCleared
 */
 /**
 * Emitted when the GC sends a party invite snapshot. The GC is incredibly
 * inefficient and will send the entire object even if it's a minor update.
 * You can use this to detect when an incoming party invite has been sent.
 * Note that the {@link module:Dota2.Dota2Client#PartyInvite|PartyInvite} property will be the old
 * value until after this event completes to allow comparison between the two.
 * @event module:Dota2.Dota2Client#partyInviteUpdate
 * @param {CSODOTAPartyInvite} partyInvite - The invitation to a party.
 */
 /**
 * Emitted when the Party Invite is cleared, for example when
 * accepting/rejecting it or when the party is closed
 * @event module:Dota2.Dota2Client#partyInviteCleared
 */

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

    if (this.Lobby && unsubscribe.owner_soid.id.eq(this.Lobby.lobby_id)) {
        this.Lobby = null;
        this.emit("practiceLobbyCleared");
    } else if (this.LobbyInvite && unsubscribe.owner_soid.id.eq(this.LobbyInvite.group_id)) {
        this.LobbyInvite = null;
        this.emit("lobbyInviteCleared");
    } else if (this.Party && unsubscribe.owner_soid.id.eq(this.Party.party_id)) {
        this.Party = null;
        this.emit("partyCleared");
    } else if (this.PartyInvite && unsubscribe.owner_soid.id.eq(this.PartyInvite.group_id)) {
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