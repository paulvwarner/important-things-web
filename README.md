# Important Things

The Important Things system consists of a Rails/React web application and a React Native mobile application that uses an API exposed by the web application. The purpose of the system is to allow me to record and remind myself of things I think are important, including ideas, commitments, and affirmations. The web application lets you manage users and important things, and the mobile app lets you browse important things and get reminders of important things (push notifications).

A user management system isn't really necessary for this project, since only I will ever use it, but almost every real project I've ever made has needed a user management system, so I built one to show I'm able to do that.

Things that can be improved
- 
- there's just one mobile app user permission - all app api calls check that.
- app lists aren't paginated

# Installation

__DB setup__
- Open mysql workbench. I'm using MySQL version 5.6.24.
- Connect to local DB - hostname localhost, defaults for others ok (username root with no password).
- Run db/setup-01.sql in local DB (through mysql workbench) - creates the local database.
- We don't use seed data in this project.

__one-time setup__
- this project requires ruby 2.7.0.  install that using RVM if you don't have it yet. `rvm install ruby-2.7.0`
- set installed ruby version to default - `rvm --default use 2.7.0`
- using ruby 2.7.0 causes a lot of warnings to be thrown from most rails commands, making their output hard to read.  To suppress these warnings, add this to your ~/.bashrc file (you could use `vi ~/.bashrc`): `export RUBYOPT='-W:no-deprecated -W:no-experimental'`.  After that, run `source ~/.bashrc` to apply the warning suppression.

__set up before running rails app__
- `npm install` (**make sure you're using node 14.18.2!** see below for notes on using `n` command for this.)
- `bundle install`
- `rake db:migrate`


__To run rails app locally__
`npm start`

__to update database to latest version using migrations__
`rake db:migrate`


__npm and node versions__
* I use "n" to manage my node installation (`sudo npm install -g n`)
* for the npm install command to work correctly, and for subsequent webpack calls to work (and for the associated mobile app to work), you'll need to use v14.18.2 (`sudo n 14.18.2`)

__SASS__
This project uses SASS for its CSS.  I use a RubyMine File Watcher to convert all SCSS files to one CSS file.
(This requires using the "track root files only" option.)


# Common commands

Set up personal data:
`RUBYOPT=-W:no-deprecated RAILS_ENV=development bundle exec rake setup_personal_data`

delete and recreate local environment with personal data:
`RAILS_ENV=development rake db:drop db:create db:migrate && RUBYOPT=-W:no-deprecated RAILS_ENV=development bundle exec rake setup_personal_data`

I'm not using the latest react-router-dom version because it doesn't support <Prompt/> (as of 1/12/22), which this project uses.


# Web Test Suite

Example command to run an individual RSpec test (from project root directory):
`RAILS_ENV=e2e_test RUBYOPT=-W:no-deprecated rspec --format documentation spec/features/important-things/important_thing_crud_spec.rb`

Run all RSpec tests (from project root directory):
`RAILS_ENV=e2e_test RUBYOPT=-W:no-deprecated rspec --format documentation`

__Test data__
The tests use a "e2e_test" environment database.  I set one up by running `e2e-test-db-setup` to create the database and a testing user.  The tests currently expect the e2e_test database to be populated with initial migration data only.

to drop the test database, recreate it, then run the migrations, then populate it with test data, run:
`RAILS_ENV=e2e_test rake db:drop db:create db:migrate && RUBYOPT=-W:no-deprecated RAILS_ENV=e2e_test bundle exec rake setup_web_test_suite_data`

I didn't use an environment called "test" because Rspec or something else in the chain of testing tools I use always deletes all data in the "test" environment database before running the suite, including static data added during migrations.

RSpec tests ("scenario" blocks) are all wrapped in database transactions that ultimately get rolled back, so the data created during each test doesn't stay in the database.  If a test passes, the data gets rolled back immediately.  If a test fails and the suite moves to another test, it seems like the data from the failed test stays around while the next tests run, but it also seems to go away when the whole test suite stops running.

To pause a test, use pause_test in the code of the test.  The test will pause until you press enter in the Terminal.

# Notifications
This uses sucker punch for notification jobs.

# editing credentials
```
export EDITOR=vi
rails credentials:edit
```
depends on /config/master.key file being around


# Docker, Heroku
example commands:
```
docker build -t warnerburg/important-things:1.7 .

# log into heroku container registry
heroku container:login

# does a docker build and docker push (to heroku container registry).  Has to always be to "web"
heroku container:push web

# release latest web image pushed to CR
heroku container:release web
```

show heroku logs:
```
heroku logs -a pvw-important-things --tail
```


# To Document Later...
- flow of leave without saving warnings
