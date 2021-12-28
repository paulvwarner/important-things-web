class AddImportantThingWeight < ActiveRecord::Migration[6.1]
  def change
    add_column :important_things, :weight, :integer, {:null => false, :default => 1}
  end
end
