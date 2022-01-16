class CreateCommitments < ActiveRecord::Migration[6.1]
  def change
    create_table :commitments do |t|
      t.column :title, :string, null: false
      t.column :notes, :text

      t.timestamps
    end
  end
end
