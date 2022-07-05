#!/usr/bin/bash

PORT=${PORT:=3000}
SQUAD_COUNT=${SQUAD_COUNT:=10}
curl "http://localhost:$PORT/join" \
  -X POST \
  -H "authorization: bearer $JWT" \
  -H "content-type: application/json" \
  -d "{
    \"name\": \"$NAME\",
    \"squadCount\": $SQUAD_COUNT
  }"
