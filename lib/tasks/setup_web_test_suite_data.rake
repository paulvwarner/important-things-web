desc 'set up web test suite data'

task :setup_web_test_suite_data => :environment do
  include ActionView::Helpers
  include TestDataHelper

  puts 'generating web test suite data...'
  ActiveRecord::Base.transaction do
    ImportantThing.delete_all
    ImportantThing.create(get_common_pagination_test_records('message', 'notes'))

    Commitment.delete_all
    Commitment.create(get_common_pagination_test_records('title', 'notes'))

    Affirmation.delete_all
    Affirmation.create(get_common_pagination_test_records('message', 'notes'))
  end
end
