#!/bin/sh
sleep 5 && \
docker logs -f cloudflared 2>&1 | \
grep -m 1 -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' | \
head -n 1 > url && \
cat url
