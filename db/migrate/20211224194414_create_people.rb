class CreatePeople < ActiveRecord::Migration[6.1]
  def change
    create_table :people do |t|
      t.column :first_name, :string, null: false
      t.column :last_name, :string, null: false

      # 191 limit is necessary in order to have an index on a utf8mb4 string field
      t.column :email, :string, limit: 191, null: false

      t.timestamps null: false
    end
  end
end
