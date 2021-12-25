class CreatePermissions < ActiveRecord::Migration[6.1]
  def change
    create_table :permissions do |t|
      t.column :name, :string, :null => false
      t.column :description, :string

      t.timestamps null: false
    end
  end
end
