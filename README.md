# Important Things web app

The purpose of Important Things is to track and remind myself of things I think are important. Right now that means insights, commitments, and affirmations I want to remember. I also built this to 1) demonstrate that I know how to build web/mobile applications like this and 2) to get more experience using React hooks.

Important Things consists of a Rails/React web application and a React Native mobile application that uses an API exposed by the web application. The web application lets you manage users and important things, and the mobile app lets you browse important things and get reminders of important things (push notifications).

A user management system isn't really necessary for this project, since I think only I will ever use this, but almost every real project I've ever made has needed a user management system, so I built one to show I'm able to do that.

#### Links:
- This repository is for the Rails/React web application. The mobile app's repository is: https://github.com/paulvwarner/important-things-mobile
- Task tracking, known issues (Trello): https://trello.com/b/vLhGVm4Z/important-things-web-app



# Installation (on a Mac)

#### DB setup
- Running this project locally requires you to run a local MySQL server.  I'm using MySQL version 5.6.24.
- To create a local database this can use, connect to your local DB server and run db/local-db-setup.sql.

#### Environment setup
- This project requires ruby 2.7.0.  Install that using RVM or the ruby version manager of your choice if you don't have it yet. If using RVM:
  - Install ruby 2.7.0: `rvm install ruby-2.7.0`
  - Set ruby 2.7.0 to default: `rvm --default use 2.7.0`
- This project uses npm to install JavaScript dependencies. You may need to use node v14.18.2 for the npm install command and the webpack configuration to work. I use "n" to manage my node installation. To use "n" to set the correct node version:
  - install n: `npm install -g n`
  - set node version to use: `n 14.18.2`

#### SASS configuration
This project uses SASS for its CSS.  I use a RubyMine File Watcher to convert all SCSS files to one CSS file that the web app uses.
(This requires using the "track root files only" option.)

#### Install dependencies and run DB migrations
- `npm install`
- `bundle install`
- `rake db:migrate`

#### Set up example data
- `bundle exec rake setup_example_data`

#### To run Rails app locally:
- `npm start`

This runs webpack to bundle the client JavaScript code into one JS file, then runs the web app on a local Puma server on port 3000.



# Web Test Suite

This project includes an end-to-end test suite using Rspec, Selenium, and Capybara.

#### Example command to run an individual RSpec test (from project root directory):
`RAILS_ENV=e2e_test rspec --format documentation spec/features/important-things/important_thing_crud_spec.rb`

#### Run all RSpec tests (from project root directory):
`RAILS_ENV=e2e_test rspec --format documentation`

#### Run all RSpec tests in headless mode (from project root directory):
`HEADLESS=true RAILS_ENV=e2e_test rspec --format documentation`

#### Test data
The tests use a "e2e_test" environment database.  I set one up by running `e2e-test-db-setup` on my local MySQL server to create the database and a testing user.  The tests currently expect the e2e_test database to be populated with initial migration data and test data created via a rake task.

To drop the test database, recreate it, then run the migrations, then populate it with test data, run:
`RAILS_ENV=e2e_test rake db:drop db:create db:migrate && RAILS_ENV=e2e_test bundle exec rake setup_web_test_suite_data`

I didn't use an environment called "test" because Rspec or something else in the chain of testing tools I use always deletes all data in the "test" environment database before running the suite, including static data added during migrations.

RSpec tests ("scenario" blocks) are all wrapped in database transactions that ultimately get rolled back, so the data created during each test doesn't stay in the database.

To pause a test, use pause_test in the code of the test.  The test will pause until you press enter in the Terminal.



# Deployment
I currently deploy this to a Heroku "production" environment after packaging it as a Docker container.



# To Document Later...
- flow of "leave without saving" warnings
- how notifications work
