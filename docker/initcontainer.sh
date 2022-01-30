#!/usr/bin/env bash
# Start the puma server
exec bundle exec rails server -b 0.0.0.0 -e $RAILS_ENV -p $PORT
