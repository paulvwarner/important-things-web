class AddMobileAppUserRole < ActiveRecord::Migration[6.1]
  def change
    Role.create({
                  name: "Mobile App User",
                  description: "User of the mobile app - receives reminders about important things",
                })
  end
end
