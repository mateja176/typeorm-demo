#!/usr/bin/bash

PORT=${PORT:=3000}
curl "http://localhost:$PORT/armies" \
  -H "authorization: bearer $JWT"
