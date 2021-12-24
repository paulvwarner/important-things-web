class Person < ActiveRecord::Base
  has_one :user

  def name
    first_name + ' ' + last_name
  end
end
