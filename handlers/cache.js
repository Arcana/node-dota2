var Dota2 = require("../index"),
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

var cacheTypeIDs = {
  LOBBY: 2004,
  PARTY: 2003,
  PARTY_INVITE: 2006
};

// Handlers
function handleSubscribedType(obj)
{
  switch(obj.type_id)
  {
    // Lobby snapshot.
    case cacheTypeIDs.LOBBY:
      var lobby = dota_gcmessages_common.CSODOTALobby.parse(obj.object_data[0]);
      if(this.debug) util.log("Received lobby snapshot for lobby ID "+lobby.lobby_id);
      this.emit("practiceLobbyUpdate", lobby);
      this.Lobby = lobby;
      break;
    // Party snapshot.
    case cacheTypeIDs.PARTY:
      var party = dota_gcmessages_common.CSODOTAParty.parse(obj.object_data[0]);
      if(this.debug) util.log("Received party snapshot for party ID "+party.party_id);
      this.emit("partyUpdate", party);
      this.Party = party;
      break;
    // Party invite snapshot.
    case cacheTypeIDs.PARTY_INVITE:
      var party = dota_gcmessages_common.CSODOTAPartyInvite.parse(obj.object_data[0]);
      if(this.debug) util.log("Received party invite snapshot for group ID "+party.group_id);
      this.emit("partyInviteUpdate", party);
      this.PartyInvite = party;
      break;
    default:
      if(this.debug) util.log("Unknown cache ID: "+obj.type_id);
      break;
  }
};

Dota2.Dota2Client.prototype._handleWelcomeCaches = function handleWelcomeCaches(message)
{
  var welcome = gcsdk_gcmessages.CMsgClientWelcome.parse(message);
  var _self = this;

  if(welcome.outofdate_subscribed_caches)
    welcome.outofdate_subscribed_caches.forEach(function(cache){
      cache.objects.forEach(function(obj){
        handleSubscribedType.call(_self, obj);
      });
    });
};

var handlers = Dota2.Dota2Client.prototype._handlers;


handlers[Dota2.ESOMsg.k_ESOMsg_CacheSubscribed] = function onCacheSubscribed(message) {
  var subscribe = gcsdk_gcmessages.CMsgSOCacheSubscribed.parse(message);
  var _self = this;

  if(this.debug){
    util.log("Cache subscribed, type "+subscribe.objects[0].type_id);
  }

  subscribe.objects.forEach(function(obj){
    handleSubscribedType.call(_self, obj);
  });
};

handlers[Dota2.ESOMsg.k_ESOMsg_UpdateMultiple] = function onCacheSubscribed(message) {
  var multi = gcsdk_gcmessages.CMsgSOMultipleObjects.parse(message);
  var _self = this;

  if(multi.objects_modified)
    multi.objects_modified.forEach(function(obj){
      handleSubscribedType.call(_self, obj);
    });
};

handlers[Dota2.ESOMsg.k_ESOMsg_CacheUnsubscribed] = function onCacheUnsubscribed(message) {
  var unsubscribe = gcsdk_gcmessages.CMsgSOCacheUnsubscribed.parse(message);
  var _self = this;

  if(this.debug) util.log("Cache unsubscribed, "+unsubscribe.owner_soid);

  if(this.Lobby && unsubscribe.owner_soid === this.Lobby.lobby_id)
  {
    this.Lobby = null;
    this.emit("practiceLobbyCleared");
  }else if(this.Party && unsubscribe.owner_soid === this.Party.party_id)
  {
    this.Party = null;
    this.emit("partyCleared");
  }else if(this.PartyInvite && unsubscribe.owner_soid === this.PartyInvite.group_id)
  {
    this.PartyInvite = null;
    this.emit("partyInviteCleared");
  }
};

handlers[Dota2.ESOMsg.k_ESOMsg_CacheDestroy] = function onCacheDestroy(message) {
  var destroy = gcsdk_gcmessages.CMsgSOSingleObject.parse(message);
  var _self = this;

  if(this.debug) util.log("Cache destroy, "+destroy.type_id);

  if(destroy.type_id === cacheTypeIDs.PARTY_INVITE)
  {
    this.PartyInvite = null;
    this.emit("partyInviteCleared");
  }
};
