class NotificationConfigPerms < ActiveRecord::Migration[6.1]
  def change
    notification_config_read = Permission.create(name: 'Notification Config Read')
    notification_config_update = Permission.create(name: 'Notification Config Update')

    admin = Role.where(name: 'Admin').first

    RolePermission.create(
      [
        {
          permission_id: notification_config_read.id,
          role_id: admin.id
        },
        {
          permission_id: notification_config_update.id,
          role_id: admin.id
        },
      ]
    )

  end
end
