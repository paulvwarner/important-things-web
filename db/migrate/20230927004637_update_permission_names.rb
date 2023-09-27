class UpdatePermissionNames < ActiveRecord::Migration[7.0]
  def change
     Permission.find_by(name: 'Important Thing Create').update!(name: 'Insight Create')
     Permission.find_by(name: 'Important Thing Read').update!(name: 'Insight Read')
     Permission.find_by(name: 'Important Thing Update').update!(name: 'Insight Update')
     Permission.find_by(name: 'Important Thing Delete').update!(name: 'Insight Delete')

     Permission.find_by(name: 'Commitment Create').update!(name: 'Self-Care Tool Create')
     Permission.find_by(name: 'Commitment Read').update!(name: 'Self-Care Tool Read')
     Permission.find_by(name: 'Commitment Update').update!(name: 'Self-Care Tool Update')
     Permission.find_by(name: 'Commitment Delete').update!(name: 'Self-Care Tool Delete')
  end
end
