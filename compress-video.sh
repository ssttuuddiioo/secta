#!/bin/bash
# Video compression script for web
# Usage: ./compress-video.sh input.mp4 output.mp4

INPUT="$1"
OUTPUT="$2"

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: ./compress-video.sh input.mp4 output.mp4"
  exit 1
fi

# Compress with H.264 codec, targeting ~5-8MB for 28MB file
# -crf 28: Higher compression (lower quality), good for web
# -preset medium: Balance between speed and compression
# -movflags +faststart: Optimize for web streaming
ffmpeg -i "$INPUT" \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -vf "scale=1920:-2" \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  "$OUTPUT"

echo "✅ Compressed video saved to: $OUTPUT"
echo "Original size: $(du -h "$INPUT" | cut -f1)"
echo "New size: $(du -h "$OUTPUT" | cut -f1)"




