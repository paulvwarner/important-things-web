class CreateUserRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :user_roles do |t|
      t.column :user_id, :bigint, :null => false
      t.column :role_id, :bigint, :null => false

      t.timestamps null: false
    end
  end
end
