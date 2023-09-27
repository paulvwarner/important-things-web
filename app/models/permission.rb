class Permission < ActiveRecord::Base
  has_many :role_permissions

  NAMES = {
    can_access_web_admin: 'Can Access Web Admin',
    can_access_app: 'Can Access App',

    insight_create: 'Insight Create',
    insight_read: 'Insight Read',
    insight_update: 'Insight Update',
    insight_delete: 'Insight Delete',

    notification_config_read: 'Notification Config Read',
    notification_config_update: 'Notification Config Update',

    affirmation_create: 'Affirmation Create',
    affirmation_read: 'Affirmation Read',
    affirmation_update: 'Affirmation Update',
    affirmation_delete: 'Affirmation Delete',

    self_care_tool_create: 'Self-Care Tool Create',
    self_care_tool_read: 'Self-Care Tool Read',
    self_care_tool_update: 'Self-Care Tool Update',
    self_care_tool_delete: 'Self-Care Tool Delete',

    user_create: 'User Create',
    user_read: 'User Read',
    user_update: 'User Update',
    user_delete: 'User Delete',
  }
end
