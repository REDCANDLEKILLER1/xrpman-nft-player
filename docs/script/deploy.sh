#!/bin/bash

# Configuration
VERSION="1.2.0"
OUTPUT_DIR="./docs"
ASSETS_DIR="./assets"

echo "🚀 XRPMAN Player Deployment v$VERSION"

# Create directories
mkdir -p $OUTPUT_DIR/assets/{js,css}
mkdir -p $OUTPUT_DIR/icons

# Process assets
cp -r $ASSETS_DIR/* $OUTPUT_DIR/assets/
cp ./icon.png $OUTPUT_DIR/icons/icon-512x512.png
convert ./icon.png -resize 192x192 $OUTPUT_DIR/icons/icon-192x192.png

# Generate fallback audio
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 -acodec libmp3lame $OUTPUT_DIR/fallback.mp3

# Minify JS
terser ./js/player.js -o $OUTPUT_DIR/assets/js/player.js --compress --mangle
terser ./js/auth.js -o $OUTPUT_DIR/assets/js/auth.js --compress --mangle

# Generate integrity hashes
PLAYER_HASH=$(openssl dgst -sha384 -binary $OUTPUT_DIR/assets/js/player.js | openssl base64 -A)
AUTH_HASH=$(openssl dgst -sha384 -binary $OUTPUT_DIR/assets/js/auth.js | openssl base64 -A)

# Update index.html
sed -i.bak \
  -e "s|assets/js/player.js\"|assets/js/player.js\" integrity=\"sha384-$PLAYER_HASH\"|" \
  -e "s|assets/js/auth.js\"|assets/js/auth.js\" integrity=\"sha384-$AUTH_HASH\"|" \
  $OUTPUT_DIR/index.html

echo "✅ Deployment package ready in $OUTPUT_DIR"
