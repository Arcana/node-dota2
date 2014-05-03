@echo off

set PROTODIR=D:\GitHub\SteamKit\Resources\Protobufs
set PROTOBUFS=base_gcmessages gcsdk_gcmessages dota_gcmessages_client dota_gcmessages_common

for %%X in ( %PROTOBUFS% ) do (
	protoc --descriptor_set_out=%%X.desc --include_imports --proto_path=%PROTODIR% --proto_path=%PROTODIR%\dota --proto_path=%PROTODIR%\steamclient %PROTODIR%\dota\%%X.proto
)
