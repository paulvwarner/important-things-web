class AddWebAdminUser < ActiveRecord::Migration[6.1]
  def change
    begin
      ActiveRecord::Base.transaction do
        admin = Role.create(
          {
            name: "Admin",
            description: "Has all permissions",
          }
        )

        User.create(
          {
            username: 'paul.vincent.warner@gmail.com',
            password: BCrypt::Password.create("I|||P0rT@||t_!"),
            person_id: Person.first_or_create(
              {
                email: 'paul.vincent.warner@gmail.com',
                first_name: 'Paul',
                last_name: 'Warner'}
            ).id,
            authentication_token: ''
          }
        )

        UserRole.create(
          {
            user_id: User.where({username: 'paul.vincent.warner@gmail.com'}).first.id,
            role_id: admin.id
          }
        )

      end
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
    end
  end
end
