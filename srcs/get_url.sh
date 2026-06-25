#!/bin/sh

docker logs cloudflared 2>&1 | \
grep --line-buffered -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' | \
head -n 1
