class InitialImportantThings < ActiveRecord::Migration[6.1]
  def change
    ImportantThing.create({message: 'Test Important Thing 1'})
    ImportantThing.create({message: 'Test Important Thing 2'})
    ImportantThing.create({message: 'Test Important Thing 3'})
  end
end
