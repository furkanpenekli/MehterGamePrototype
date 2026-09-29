#!/bin/sh
# usage: many.sh tag profile count -> count runs in parallel, logs in out/logs/tag
D="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$D/out/logs/$1"
for n in $(seq 1 $3); do "$D/run.sh" $2 $n > "$D/out/logs/$1/$(echo $2 | tr : _)-$n.txt" & done; wait
