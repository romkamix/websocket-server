NAME="websocket.service"
SOURCE="$BASH_SOURCE"
SOURCE_PATH="$(dirname "$BASH_SOURCE")"

ln -s $SOURCE_PATH/$NAME /etc/systemd/system/$NAME
