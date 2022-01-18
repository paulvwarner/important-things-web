class ActiveFlags < ActiveRecord::Migration[6.1]
  def change
    add_column :important_things, :active, :boolean, :default => true
    add_column :affirmations, :active, :boolean, :default => true
    add_column :commitments, :active, :boolean, :default => true
  end
end
