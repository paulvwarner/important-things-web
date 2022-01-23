require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/users/user_spec_helper'

RSpec.describe 'User CRUD', type: :system do
  # these are named starting with an "a" so they show on page 1 of the lists
  mobile_user_create_attrs = {
    firstName: "A Test",
    lastName: "Created User",
    email: "paul.vincent.warner+e2ecreate@gmail.com",
    password: "FakeUser09?",
    confirmPassword: "FakeUser09?",
    roleId: Role.find_by(name: "Mobile App User").id,
    roleName: "Mobile App User"
  }

  mobile_user_update_attrs = {
    firstName: "A Big Test",
    lastName: "Updated User",
    email: "paul.vincent.warner+e2eupdate@gmail.com",
    password: "FakeUser10?",
    confirmPassword: "FakeUser10?",
    roleId: Role.find_by(name: "Mobile App User").id,
    roleName: "Mobile App User"
  }

  admin_user_create_attrs = {
    firstName: "Admin",
    lastName: "Created User",
    email: "paul.vincent.warner+e2eacreate@gmail.com",
    password: "FakeUser11?",
    confirmPassword: "FakeUser11?",
    roleId: Role.find_by(name: "Admin").id,
    roleName: "Admin"
  }

  admin_user_update_attrs = {
    firstName: "Admin",
    lastName: "Updated User",
    email: "paul.vincent.warner+e2eaupdate@gmail.com",
    password: "FakeUser11?",
    confirmPassword: "FakeUser11?",
    roleId: Role.find_by(name: "Admin").id,
    roleName: "Admin"
  }

  scenario 'create mobile user' do
    create_user_test(mobile_user_create_attrs)
  end

  scenario 'update mobile user' do
    update_user_test(mobile_user_create_attrs, mobile_user_update_attrs)
  end

  scenario 'deactivate mobile user' do
    deactivate_user_test(mobile_user_create_attrs)
  end

  scenario 'create admin user' do
    create_user_test(admin_user_create_attrs)
  end

  scenario 'update admin user' do
    update_user_test(admin_user_create_attrs, admin_user_update_attrs)
  end

  scenario 'deactivate admin user' do
    deactivate_user_test(admin_user_create_attrs)
  end
end
