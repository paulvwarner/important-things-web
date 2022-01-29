class SetNotificationConfig < ActiveRecord::Migration[6.1]
  def change
    NotificationConfig.create({
                                notifications_enabled: false,
                                min_notify_interval_hours: 8,
                                max_notify_interval_hours: 32,
                              })
  end
end
