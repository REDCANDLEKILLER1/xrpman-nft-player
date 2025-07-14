#!/bin/bash

BASE_URL="http://localhost:8080"
TEST_DIR="./test-results"
mkdir -p $TEST_DIR

echo "🧪 Running XRPMAN Player Tests..."

# Test cases
test_pwa_manifest() {
  curl -s "$BASE_URL/manifest.json" | jq . > $TEST_DIR/manifest.json
  [ $? -eq 0 ] && echo "✅ Manifest Test" || echo "❌ Manifest Test"
}

test_service_worker() {
  curl -s "$BASE_URL/assets/sw.js" > $TEST_DIR/sw.js
  grep -q "CACHE_NAME" $TEST_DIR/sw.js
  [ $? -eq 0 ] && echo "✅ Service Worker Test" || echo "❌ Service Worker Test"
}

test_audio_fallback() {
  curl -s "$BASE_URL/fallback.mp3" --head | grep -q "200 OK"
  [ $? -eq 0 ] && echo "✅ Audio Fallback Test" || echo "❌ Audio Fallback Test"
}

# Execute tests
test_pwa_manifest
test_service_worker
test_audio_fallback

echo "📊 Test results saved to $TEST_DIR"
