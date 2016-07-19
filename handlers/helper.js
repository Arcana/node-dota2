var Dota2 = require("../index"),
    util = require("util");

// Enums
Dota2.EResult = {
    k_EResultOK : 1, // success
    k_EResultFail : 2, // generic failure 
    k_EResultNoConnection : 3, // no/failed network connection
    // k_EResultNoConnectionRetry : 4, // OBSOLETE - removed
    k_EResultInvalidPassword : 5, // password/ticket is invalid
    k_EResultLoggedInElsewhere : 6, // same user logged in elsewhere
    k_EResultInvalidProtocolVer : 7, // protocol version is incorrect
    k_EResultInvalidParam : 8, // a parameter is incorrect
    k_EResultFileNotFound : 9, // file was not found
    k_EResultBusy : 10, // called method busy - action not taken
    k_EResultInvalidState : 11, // called object was in an invalid state
    k_EResultInvalidName : 12, // name is invalid
    k_EResultInvalidEmail : 13, // email is invalid
    k_EResultDuplicateName : 14, // name is not unique
    k_EResultAccessDenied : 15, // access is denied
    k_EResultTimeout : 16, // operation timed out
    k_EResultBanned : 17, // VAC2 banned
    k_EResultAccountNotFound : 18, // account not found
    k_EResultInvalidSteamID : 19, // steamID is invalid
    k_EResultServiceUnavailable : 20, // The requested service is currently unavailable
    k_EResultNotLoggedOn : 21, // The user is not logged on
    k_EResultPending : 22, // Request is pending (may be in process, or waiting on third party)
    k_EResultEncryptionFailure : 23, // Encryption or Decryption failed
    k_EResultInsufficientPrivilege : 24, // Insufficient privilege
    k_EResultLimitExceeded : 25, // Too much of a good thing
    k_EResultRevoked : 26, // Access has been revoked (used for revoked guest passes)
    k_EResultExpired : 27, // License/Guest pass the user is trying to access is expired
    k_EResultAlreadyRedeemed : 28, // Guest pass has already been redeemed by account, cannot be acked again
    k_EResultDuplicateRequest : 29, // The request is a duplicate and the action has already occurred in the past, ignored this time
    k_EResultAlreadyOwned : 30, // All the games in this guest pass redemption request are already owned by the user
    k_EResultIPNotFound : 31, // IP address not found
    k_EResultPersistFailed : 32, // failed to write change to the data store
    k_EResultLockingFailed : 33, // failed to acquire access lock for this operation
    k_EResultLogonSessionReplaced : 34,
    k_EResultConnectFailed : 35,
    k_EResultHandshakeFailed : 36,
    k_EResultIOFailure : 37,
    k_EResultRemoteDisconnect : 38,
    k_EResultShoppingCartNotFound : 39, // failed to find the shopping cart requested
    k_EResultBlocked : 40, // a user didn't allow it
    k_EResultIgnored : 41, // target is ignoring sender
    k_EResultNoMatch : 42, // nothing matching the request found
    k_EResultAccountDisabled : 43,
    k_EResultServiceReadOnly : 44, // this service is not accepting content changes right now
    k_EResultAccountNotFeatured : 45, // account doesn't have value, so this feature isn't available
    k_EResultAdministratorOK : 46, // allowed to take this action, but only because requester is admin
    k_EResultContentVersion : 47, // A Version mismatch in content transmitted within the Steam protocol.
    k_EResultTryAnotherCM : 48, // The current CM can't service the user making a request, user should try another.
    k_EResultPasswordRequiredToKickSession : 49, // You are already logged in elsewhere, this cached credential login has failed.
    k_EResultAlreadyLoggedInElsewhere : 50, // You are already logged in elsewhere, you must wait
    k_EResultSuspended : 51,
    k_EResultCancelled : 52,
    k_EResultDataCorruption : 53,
    k_EResultDiskFull : 54,
    k_EResultRemoteCallFailed : 55,
};

Dota2.ServerRegion = {
    UNSPECIFIED : 0,
    USWEST : 1,
    USEAST : 2,
    EUROPE : 3,
    KOREA : 4,
    SINGAPORE : 5,
    DUBAI : 6,
    AUSTRALIA : 7,
    STOCKHOLM : 8,
    AUSTRIA : 9,
    BRAZIL : 10,
    SOUTHAFRICA : 11,
    PWTELECOMSHANGHAI : 12,
    PWUNICOM : 13,
    CHILE : 14,
    PERU : 15,
    INDIA : 16,
    PWTELECOMGUANGZHOU : 17,
    PWTELECOMZHEJIANG : 18,
    JAPAN : 19,
    PWTELECOMWUHAN : 20
};

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
    if (callback && handler) {
        return function (header, body) {
            handler.call(self, body, callback);
        }
    } else {
        return undefined;
    }
};