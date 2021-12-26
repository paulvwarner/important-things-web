class AddMobileUser < ActiveRecord::Migration[6.1]
  def change
    begin
      ActiveRecord::Base.transaction do
        mobile_user = Role.find_by(name: "Mobile App User")

        User.create(
          {
            username: 'paul.vincent.warner+m1@gmail.com',
            password: BCrypt::Password.create("testuser1"),
            person_id: Person.first_or_create(
              {
                email: 'paul.vincent.warner+m1@gmail.com',
                first_name: 'Paul',
                last_name: 'Mobile 1'}
            ).id,
            authentication_token: ''
          }
        )

        UserRole.create(
          {
            user_id: User.where({username: 'paul.vincent.warner+m1@gmail.com'}).first.id,
            role_id: mobile_user.id
          }
        )

      end
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
    end
  end
end
