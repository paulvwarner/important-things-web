class SetUpPermissions < ActiveRecord::Migration[6.1]
  def change
    can_access_app = Permission.create(
      name: 'Can Access App',
      description: 'Allowed to use mobile app.'
    )

    can_access_web_admin = Permission.create(
      name: 'Can Access Web Admin',
      description: 'Allowed to access admin web tools. Intended to exclude users who can only use the mobile app.'
    )

    admin = Role.where(name: 'Admin').first
    mobile_app_user = Role.where(name: 'Mobile App User').first

    RolePermission.create([
                            {
                              permission_id: can_access_web_admin.id,
                              role_id: admin.id
                            },

                            {
                              permission_id: can_access_app.id,
                              role_id: admin.id
                            },
                            {
                              permission_id: can_access_app.id,
                              role_id: mobile_app_user.id
                            },
                          ])
  end
end
