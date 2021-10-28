#!/bin/bash

# Start the first process
./npm run start:backend &

# Start the second process
./npm run server &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?