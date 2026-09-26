#!/bin/sh
# usage: run.sh profile n -> plays one run of the bot in headless Chrome and prints its log
D="$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)"
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
"$CHROME" --headless=new --disable-gpu --mute-audio --user-data-dir="$D/out/prof/$1-$2-$$"   --virtual-time-budget=${BUDGET:-2400000} --dump-dom "file:///$D/out/test.html#$1" 2>/dev/null | python -c "
import sys,re,html
s=sys.stdin.read(); m=re.search(r'<pre id=\"botlog\">(.*?)</pre>',s,re.S)
print(html.unescape(m.group(1)) if m else 'NO LOG')"
