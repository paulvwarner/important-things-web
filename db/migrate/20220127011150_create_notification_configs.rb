class CreateNotificationConfigs < ActiveRecord::Migration[6.1]
  def change
    create_table :notification_configs do |t|
      t.column :notifications_enabled, :boolean, :default => false
      t.column :active_job_key, :string
      t.column :min_notify_interval_hours, :bigint
      t.column :max_notify_interval_hours, :bigint

      t.timestamps
    end
  end
end
