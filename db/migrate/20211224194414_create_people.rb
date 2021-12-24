class CreatePeople < ActiveRecord::Migration[6.1]
  def change
    create_table :people do |t|
      t.string "first_name", limit: 100, null: false
      t.string "last_name", limit: 100, null: false
      t.string "email", limit: 191, null: false

      t.timestamps null: false
    end
  end
end
