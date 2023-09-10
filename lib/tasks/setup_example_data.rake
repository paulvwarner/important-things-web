desc 'set up example data'

task :setup_example_data => :environment do
  include ActionView::Helpers
  include TestDataHelper

  puts 'generating example data...'
  ActiveRecord::Base.transaction do
    ImportantThing.delete_all
    ImportantThing.create(
      [
        {
          message: 'Drink enough water.',
          notes: "If you feel terrible right now, it might just be because you haven't had enough water."
        },
        {
          message: 'Go outside.',
          notes: "You'll probably feel better afterwards."
        },
        {
          message: 'Look at an animal every day.',
          notes: "It makes you happy!"
        },
      ]
    )

    Commitment.delete_all
    Commitment.create(
      [
        {title: "Finish building the Important Things MVP.", },
        {title: "Fix bugs in Important Things.", },
      ]
    )

    Affirmation.delete_all
    Affirmation.create(
      [
        {message: "I'm worthy of love."},
        {message: "I'm valuable regardless of my productivity or performance."},
      ]
    )
  end
end
