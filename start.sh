#!/bin/bash

SOURCE="$BASH_SOURCE"
SOURCE_PATH="$(dirname "$BASH_SOURCE")"

cd $SOURCE_PATH
node ./server.js
