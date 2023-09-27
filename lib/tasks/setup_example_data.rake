desc 'set up example data'

task :setup_example_data => :environment do
  include ActionView::Helpers
  include TestDataHelper

  puts 'generating example data...'
  ActiveRecord::Base.transaction do
    Insight.delete_all
    Insight.create(
      [
        {
          message: 'People need human interaction.',
          notes: "That includes you!"
        }
      ]
    )

    SelfCareTool.delete_all
    SelfCareTool.create(
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

    Affirmation.delete_all
    Affirmation.create(
      [
        {message: "I'm worthy of love."},
        {message: "I'm valuable regardless of my productivity or performance."},
      ]
    )
  end
end
