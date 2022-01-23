desc 'set up web test suite data'

task :setup_web_test_suite_data => :environment do
  include ActionView::Helpers
  include TestDataHelper
  include UsersHelper

  puts 'generating web test suite data...'
  ActiveRecord::Base.transaction do
    ImportantThing.delete_all
    ImportantThing.create(get_common_pagination_test_records('message', 'notes'))

    Commitment.delete_all
    Commitment.create(get_common_pagination_test_records('title', 'notes'))

    Affirmation.delete_all
    Affirmation.create(get_common_pagination_test_records('message', 'notes'))

    mobile_user_role = Role.find_by(name: "Mobile App User")

    (1..101).each do |i|
      user_attrs = {}
      user_attrs[:firstName] = "Test"
      user_attrs[:lastName] = i.to_s.rjust(3, "0")
      user_attrs[:email] = 'paul.vincent.warner+test' + i.to_s.rjust(3, "0") + '@gmail.com'
      user_attrs[:password] = 'Testuser!' + i.to_s.rjust(3, "0")
      user_attrs[:roleId] = mobile_user_role.id

      create_user(user_attrs)
    end
  end
end
