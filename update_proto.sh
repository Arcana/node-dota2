#!/bin/bash
pushd proto
rm *.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/base_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/gcsdk_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_client.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_shared_enums.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/econ_shared_enums.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_client_fantasy.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_common.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_common_match_management.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/steammessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/econ_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/gcsystemmsgs.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_msgid.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_client_chat.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_client_match_management.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_client_enums.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_client_guild.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_client_watch.proto 
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/Protobufs/dota_gcmessages_client_team.proto 
popd
