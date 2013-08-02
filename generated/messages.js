var Dota2 = require("../index");

// TODO: Autogenerate these from SteamRE resources, in to seperate file.
// Warning:  These values can change with Dota 2 updates.
Dota2.EGCItemMsg = {
    k_EMsgGCSetItemPosition: 1001,
    k_EMsgGCDelete: 1004,
    k_EMsgGCSetItemPositions: 1077
};

Dota2.EGCBaseClientMsg = {
    k_EMsgGCClientWelcome: 4004,
    k_EMsgGCServerWelcome: 4005,
    k_EMsgGCClientHello: 4006,
    k_EMsgGCServerHello: 4007,
    k_EMsgGCClientConnectionStatus: 4009,
    k_EMsgGCServerConnectionStatus: 4010
};

Dota2.EDOTAGCMsg = {
    k_EMsgGCJoinChatChannel: 7009,
    k_EMsgGCJoinChatChannelResponse: 7010,
    k_EMsgGCLeaveChatChannel: 7272,
    k_EMsgGCOtherJoinedChannel: 7013,
    k_EMsgGCOtherLeftChannel: 7014,
    k_EMsgGCRequestDefaultChatChannel: 7058,
    k_EMsgGCRequestDefaultChatChannelResponse: 7059,
    k_EMsgGCRequestChatChannelList: 7060,
    k_EMsgGCRequestChatChannelListResponse: 7061,
    k_EMsgGCChatMessage: 7273,
    k_EMsgClientsRejoinChatChannels: 7217,
    k_EMsgGCToGCLeaveAllChatChannels: 7220,
    k_EMsgGCGuildCreateRequest: 7222,
    k_EMsgGCGuildCreateResponse: 7223,
    k_EMsgGCGuildSetAccountRoleRequest: 7224,
    k_EMsgGCGuildSetAccountRoleResponse: 7225,
    k_EMsgGCRequestGuildData: 7226,
    k_EMsgGCGuildData: 7227,
    k_EMsgGCGuildInviteAccountRequest: 7228,
    k_EMsgGCGuildInviteAccountResponse: 7229,
    k_EMsgGCGuildCancelInviteRequest: 7230,
    k_EMsgGCGuildCancelInviteResponse: 7231,
    k_EMsgGCGuildUpdateDetailsRequest: 7232,
    k_EMsgGCGuildUpdateDetailsResponse: 7233,
    k_EMsgGCGuildInviteData: 7254,
    k_EMsgGCPassportDataRequest: 7248,
    k_EMsgGCPassportDataResponse: 7249,
    k_EMsgGCMatchDetailsRequest: 7095,
    k_EMsgGCMatchDetailsResponse: 7096,
    k_EMsgGCProfileRequest: 7098,
    k_EMsgGCProfileResponse: 7099,
    k_EMsgGCHallOfFameRequest: 7172,
    k_EMsgGCHallOfFameResponse:  7173,
    k_EMsgGCMatchmakingStatsRequest: 7197,
    k_EMsgGCMatchmakingStatsResponse: 7198
};

Dota2.DOTAChatChannelType_t = {
    DOTAChannelType_Regional: 0,
    DOTAChannelType_Custom: 1,
    DOTAChannelType_Party: 2,
    DOTAChannelType_Lobby: 3,
    DOTAChannelType_Team: 4,
    DOTAChannelType_Guild: 5
};