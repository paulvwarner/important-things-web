class User < ActiveRecord::Base
  belongs_to :person
  has_one :user_profile
  has_many :user_roles
end
