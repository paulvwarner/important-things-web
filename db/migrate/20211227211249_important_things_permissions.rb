class ImportantThingsPermissions < ActiveRecord::Migration[6.1]
  def change
    ActiveRecord::Base.transaction do
      important_thing_create = Permission.create(name: 'Important Thing Create')
      important_thing_read = Permission.create(name: 'Important Thing Read')
      important_thing_update = Permission.create(name: 'Important Thing Update')
      important_thing_delete = Permission.create(name: 'Important Thing Delete')

      admin = Role.where(name: 'Admin').first

      RolePermission.create(
        [
          {
            permission_id: important_thing_create.id,
            role_id: admin.id
          },
          {
            permission_id: important_thing_delete.id,
            role_id: admin.id
          },
          {
            permission_id: important_thing_read.id,
            role_id: admin.id
          },
          {
            permission_id: important_thing_update.id,
            role_id: admin.id
          },
        ]
      )
    end
  end
end
