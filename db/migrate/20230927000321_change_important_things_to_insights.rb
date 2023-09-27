class ChangeImportantThingsToInsights < ActiveRecord::Migration[7.0]
  def change
    rename_table :important_things, :insights
  end
end
