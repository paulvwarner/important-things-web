class ItNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :important_things, :notes, :text
  end
end
