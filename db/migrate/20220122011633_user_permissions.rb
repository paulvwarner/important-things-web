class UserPermissions < ActiveRecord::Migration[6.1]
  def change
    ActiveRecord::Base.transaction do
      user_create = Permission.create(name: 'User Create')
      user_read = Permission.create(name: 'User Read')
      user_update = Permission.create(name: 'User Update')
      user_delete = Permission.create(name: 'User Delete')

      admin = Role.where(name: 'Admin').first

      RolePermission.create(
        [
          {
            permission_id: user_create.id,
            role_id: admin.id
          },
          {
            permission_id: user_delete.id,
            role_id: admin.id
          },
          {
            permission_id: user_read.id,
            role_id: admin.id
          },
          {
            permission_id: user_update.id,
            role_id: admin.id
          },
        ]
      )
    end
  end
end
