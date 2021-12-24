class CreateRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :roles do |t|
      t.column :name, :string, :limit => 100, :null => false
      t.column :description, :string, :limit => 100

      t.timestamps null: false
    end
  end
end
