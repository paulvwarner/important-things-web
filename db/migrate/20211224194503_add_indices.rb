class AddIndices < ActiveRecord::Migration[6.1]
  def change
    add_index :people, :email, unique: true
    add_index :users, :username, unique: true
  end
end
