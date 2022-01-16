class CreateAffirmations < ActiveRecord::Migration[6.1]
  def change
    create_table :affirmations do |t|
      t.column :message, :string, null: false
      t.column :notes, :text

      t.timestamps
    end
  end
end
