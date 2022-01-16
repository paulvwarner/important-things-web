class AddNewModelPermissions < ActiveRecord::Migration[6.1]
  def change
    affirmation_create = Permission.create(name: 'Affirmation Create')
    affirmation_read = Permission.create(name: 'Affirmation Read')
    affirmation_update = Permission.create(name: 'Affirmation Update')
    affirmation_delete = Permission.create(name: 'Affirmation Delete')
    commitment_create = Permission.create(name: 'Commitment Create')
    commitment_read = Permission.create(name: 'Commitment Read')
    commitment_update = Permission.create(name: 'Commitment Update')
    commitment_delete = Permission.create(name: 'Commitment Delete')

    admin = Role.where(name: 'Admin').first

    RolePermission.create(
      [
        {
          permission_id: affirmation_create.id,
          role_id: admin.id
        },
        {
          permission_id: affirmation_delete.id,
          role_id: admin.id
        },
        {
          permission_id: affirmation_read.id,
          role_id: admin.id
        },
        {
          permission_id: affirmation_update.id,
          role_id: admin.id
        },

        {
          permission_id: commitment_create.id,
          role_id: admin.id
        },
        {
          permission_id: commitment_delete.id,
          role_id: admin.id
        },
        {
          permission_id: commitment_read.id,
          role_id: admin.id
        },
        {
          permission_id: commitment_update.id,
          role_id: admin.id
        },
      ]
    )
  end
end
