#!/bin/sh

#
# This file will checkout the latest SteamKit repo and regenerate the dota 2 protobufs, no config required
# Installation of Protobuf library required: https://code.google.com/p/protobuf/downloads/list
#
TMP_FOLDER="/tmp/SteamKit"
DOTA_PROTOS_PATH="$TMP_FOLDER/Resources/Protobufs/dota"

git clone https://github.com/SteamRE/SteamKit.git $TMP_FOLDER

# this will link the necessary google protos
ln -s $DOTA_PROTOS_PATH/../google $DOTA_PROTOS_PATH/

# list of files to be generated
for FILENAME in base_gcmessages gcsdk_gcmessages dota_gcmessages_client dota_gcmessages_common
do
	protoc --descriptor_set_out=$FILENAME.desc --include_imports --proto_path=$DOTA_PROTOS_PATH $DOTA_PROTOS_PATH/$FILENAME.proto
	echo "generated $FILENAME"
done

rm -rf $TMP_FOLDER

echo "done!"
