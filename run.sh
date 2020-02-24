#!/bin/bash -eu

trap "exit" INT TERM ERR
trap "kill 0" EXIT

node service-a.js | sed 's/^/service-a: /' &
sleep 1
node service-b.js | sed 's/^/service-b: /' &
sleep 1
node gateway.js   | sed 's/^/gateway:   /' &

wait
