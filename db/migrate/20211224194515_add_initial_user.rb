class AddInitialUser < ActiveRecord::Migration[6.1]
  def change
    begin
      ActiveRecord::Base.transaction do
        admin = Role.create({
                              name: "Admin",
                              description: "Has all permissions",
                            })

        # pvw todo here - add email to people table before running these, finish this up
        User.create({
                      username: 'paul.vincent.warner@gmail.com',
                      password: BCrypt::Password.create("I|||P0rT@||t_!"),
                      person_id: Person.first_or_create({email: 'paul.vincent.warner@gmail.com', first_name: 'Paul', last_name: 'Warner'}).id,
                      authentication_token: '12312312312344412341231231212323'
                    })

        UserRole.create([
                          {
                            user_id: User.where({username: 'paul.vincent.warner@gmail.com'}).first.id,
                            role_id: admin.id
                          }
                        ])

      end
    rescue Exception => e
      Rails.logger.info "Error occurred: "+e.to_yaml

    end
  end
end
