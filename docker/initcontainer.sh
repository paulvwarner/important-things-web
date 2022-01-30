#!/usr/bin/env bash
# Start the puma server in production environment
exec bundle exec rails server -b 0.0.0.0 -e production -p $PORT
