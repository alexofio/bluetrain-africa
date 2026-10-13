#!/bin/sh
# Builds dist-single/bluetrain-africa.html: one self-contained file (JS, CSS, fonts, logos, favicon inlined)
set -e
npx vite build -c vite.single.config.js
python3 -I - << 'PY'
import base64
fav = base64.b64encode(open("public/favicon.svg", "rb").read()).decode()
s = open("dist-single/index.html").read().replace('href="/favicon.svg"', 'href="data:image/svg+xml;base64,' + fav + '"')
open("dist-single/bluetrain-africa.html", "w").write(s)
print(len(s) // 1024, "KB")
PY
