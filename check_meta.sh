#!/bin/bash
TARGET="https://www.grasswhoopin.com"
echo "STATUS: [SCANNING] $TARGET"
echo "---------------------------------------------------"
curl -s "$TARGET" | grep -iE '<meta.*(property|name)="(og:|twitter:|description)"|<title>.*</title>' | sed -E 's/^[[:space:]]+//'
echo "---------------------------------------------------"
