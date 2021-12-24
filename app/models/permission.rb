class Permission < ActiveRecord::Base
  has_many :role_permissions

  NAMES = {
    can_access_web_admin: 'Can Access Web Admin',
    can_access_app: 'Can Access App',
  }
end
