class CreateImportantThings < ActiveRecord::Migration[6.1]
  def change
    create_table :important_things do |t|
      t.column :message, :string, null: false

      t.timestamps
    end
  end
end
