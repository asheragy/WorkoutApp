#!/usr/bin/env bash
# Push the repo's app.sqlite to the app's external files directory on the
# connected emulator and make it writable by the app.
#
# Files created by `adb push` are owned by the `shell` user, so the app
# (which runs as its own uid) can only read them. This script fixes the
# ownership and mode afterwards using `adb root`.
set -euo pipefail

PKG=com.workoutapp
DB_NAME=app.sqlite
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO_ROOT/$DB_NAME"
DEST_DIR="/storage/emulated/0/Android/data/$PKG/files"
DEST="$DEST_DIR/$DB_NAME"

if [ ! -f "$SRC" ]; then
  echo "error: $SRC not found" >&2
  exit 1
fi

# Stop the app so it is not holding the database open while we replace it,
# and remove any journal/WAL files left over from the old database.
adb shell am force-stop "$PKG"
adb shell rm -f "$DEST-journal" "$DEST-wal" "$DEST-shm"

adb push "$SRC" "$DEST"

# Resolve the app's uid (e.g. 10191 -> u0_a191) so this works on any image.
APP_UID="$(adb shell dumpsys package "$PKG" | sed -n 's/^ *appId=\([0-9]*\).*/\1/p' | head -n1)"
if [ -z "$APP_UID" ]; then
  echo "error: could not determine uid for $PKG (is it installed?)" >&2
  exit 1
fi
APP_USER="u0_a$((APP_UID - 10000))"

adb root >/dev/null
adb wait-for-device
adb shell chown "$APP_USER:ext_data_rw" "$DEST"
adb shell chmod 660 "$DEST"
adb unroot >/dev/null
adb wait-for-device

echo "Pushed $SRC to $DEST"
adb shell ls -l "$DEST"
