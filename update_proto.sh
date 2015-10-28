#!/bin/sh
pushd proto
rm *.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/base_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/gcsdk_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/dota_gcmessages_client.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/dota_gcmessages_client_fantasy.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/dota_gcmessages_common.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/steammessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/econ_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota/gcsystemmsgs.proto 
popd