#!/bin/sh
pushd proto
rm *.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota_s2/base_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota_s2/gcsdk_gcmessages.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota_s2/dota_gcmessages_client.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota_s2/dota_gcmessages_client_fantasy.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota_s2/dota_gcmessages_common.proto
wget https://raw.githubusercontent.com/SteamDatabase/GameTracking/master/Protobufs/dota_s2/steammessages.proto
popd