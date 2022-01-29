class Permission < ActiveRecord::Base
  has_many :role_permissions

  NAMES = {
    can_access_web_admin: 'Can Access Web Admin',
    can_access_app: 'Can Access App',

    important_thing_create: 'Important Thing Create',
    important_thing_read: 'Important Thing Read',
    important_thing_update: 'Important Thing Update',
    important_thing_delete: 'Important Thing Delete',

    notification_config_read: 'Notification Config Read',
    notification_config_update: 'Notification Config Update',

    affirmation_create: 'Affirmation Create',
    affirmation_read: 'Affirmation Read',
    affirmation_update: 'Affirmation Update',
    affirmation_delete: 'Affirmation Delete',

    commitment_create: 'Commitment Create',
    commitment_read: 'Commitment Read',
    commitment_update: 'Commitment Update',
    commitment_delete: 'Commitment Delete',

    user_create: 'User Create',
    user_read: 'User Read',
    user_update: 'User Update',
    user_delete: 'User Delete',
  }
end
