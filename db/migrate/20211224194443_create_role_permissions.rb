class CreateRolePermissions < ActiveRecord::Migration[6.1]
  def change
    create_table :role_permissions do |t|
      t.column :permission_id, :bigint, :null => false
      t.column :role_id, :bigint, :null => false

      t.timestamps null: false
    end
  end
end
