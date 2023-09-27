class ChangeCommitmentsToSelfCareTools < ActiveRecord::Migration[7.0]
  def change
    rename_table :commitments, :self_care_tools
  end
end
