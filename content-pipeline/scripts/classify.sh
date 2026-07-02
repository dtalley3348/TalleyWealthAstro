#!/usr/bin/env bash
# classify.sh <video>  ->  prints one of: talkinghead | broll | uncertain
# Heuristic: talking-heads have sustained speech; b-roll is usually quiet or has no
# real speech. The uncertain middle is flagged for a quick human confirm.
set -uo pipefail

INPUT="$1"
base="$(basename "$INPUT")"

# Override hatches: route folders or clear filenames force a classification.
shopt -s nocasematch
if [[ "$INPUT" == *"/broll/"* || "$INPUT" == *"/b-roll/"* || "$base" == *broll* || "$base" == *b-roll* ]]; then echo "broll"; exit 0; fi
if [[ "$INPUT" == *"/talkinghead/"* || "$INPUT" == *"/talking-head/"* || "$base" == *talkinghead* || "$base" == *talking-head* ]]; then echo "talkinghead"; exit 0; fi
shopt -u nocasematch

# Default path: let vision classify unlabeled phone uploads. Folder/filename rules above
# are only override hatches, not the expected workflow.
VISUAL="$(node scripts/classify-visual.mjs "$INPUT" 2>>work/classifier.log || true)"
if [[ "$VISUAL" == "talkinghead" || "$VISUAL" == "broll" || "$VISUAL" == "uncertain" ]]; then
  echo "$VISUAL"
  exit 0
fi

# No audio track at all -> b-roll.
has_audio=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$INPUT" 2>/dev/null | head -1)
if [ -z "$has_audio" ]; then echo "broll"; exit 0; fi

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$INPUT" 2>/dev/null)
SIL=$(ffmpeg -nostdin -i "$INPUT" -af "silencedetect=noise=-30dB:d=0.5" -f null - 2>&1 \
  | awk -F'silence_duration: ' '/silence_duration/{s+=$2} END{print s+0}')

awk -v d="$DUR" -v s="$SIL" 'BEGIN{
  if (d<=0) { print "uncertain"; exit }
  r=(d-s)/d
  if (r>=0.5) print "talkinghead";
  else if (r<=0.2) print "broll";
  else print "uncertain"
}'
