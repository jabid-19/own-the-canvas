#!/bin/bash
# Runs src/components/props.sweep.test.tsx in batches of 5 components, one process per batch.
# Usage: scripts/prop-sweep.sh [batch-index...]   (no args = every batch). Exit 1 if any batch fails.
cd "$(dirname "$0")/.."
NAMES=($(for d in src/components/*/; do n=$(basename "$d"); [ -f "$d$n.tsx" ] && echo "$n"; done))
B=()
for ((i = 0; i < ${#NAMES[@]}; i += 5)); do B+=("$(IFS=,; echo "${NAMES[*]:i:5}")"); done
IDX=("$@"); [ ${#IDX[@]} -eq 0 ] && IDX=($(seq 0 $((${#B[@]} - 1))))
fail=0
for i in "${IDX[@]}"; do
  echo "=== batch $i: ${B[$i]}"
  SWEEP="${B[$i]}" NODE_OPTIONS=--max-old-space-size=6144 npx vitest run src/components/props.sweep.test.tsx 2>&1 \
    | grep -E "Tests |FAIL .*>|AssertionError" || true
  [ "${PIPESTATUS[0]}" -ne 0 ] && fail=1
done
exit $fail
