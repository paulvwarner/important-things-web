class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.column :username, :string, limit: 191, :null => false
      t.column :person_id, :bigint, :null => false
      t.column :password, :string, :null => false
      t.column :authentication_token, :string, :null => false
      t.column :active, :boolean, :null => false, :default => true

      t.timestamps null: false
    end

    add_foreign_key :users, :people
  end
end
