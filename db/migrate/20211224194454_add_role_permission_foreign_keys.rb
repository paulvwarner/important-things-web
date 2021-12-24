class AddRolePermissionForeignKeys < ActiveRecord::Migration[6.1]
  def change
    # user roles
    add_foreign_key :user_roles, :roles
    add_foreign_key :user_roles, :users

    # role permissions
    add_foreign_key :role_permissions, :roles
    add_foreign_key :role_permissions, :permissions
  end
end
