require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/users/user_spec_helper'

CREDENTIALS = YAML.load_file("#{Rails.root.to_s}/spec/support/credentials.yml")

RSpec.describe 'User CRUD', type: :system do
  admin_role = Role.find_by(name: "Admin")
  mobile_app_user_role = Role.find_by(name: "Mobile App User")

  # these are named starting with an "a" so they show on page 1 of the lists
  mobile_user_create_attrs = {
    firstName: "A Test",
    lastName: "Created User",
    email: "paul.vincent.warner+e2ecreate@gmail.com",
    password: "FakeUser09?",
    confirmPassword: "FakeUser09?",
    roleId: mobile_app_user_role.id,
    roleName: mobile_app_user_role[:name]
  }

  mobile_user_update_attrs = {
    firstName: "A Big Test",
    lastName: "Updated User",
    email: "paul.vincent.warner+e2eupdate@gmail.com",
    password: "FakeUser10?",
    confirmPassword: "FakeUser10?",
    roleId: mobile_app_user_role.id,
    roleName: mobile_app_user_role[:name]
  }

  admin_user_create_attrs = {
    firstName: "Admin",
    lastName: "Created User",
    email: "paul.vincent.warner+e2eacreate@gmail.com",
    password: "FakeUser11?",
    confirmPassword: "FakeUser11?",
    roleId: admin_role.id,
    roleName: admin_role[:name]
  }

  admin_user_update_attrs = {
    firstName: "Admin",
    lastName: "Updated User",
    email: "paul.vincent.warner+e2eaupdate@gmail.com",
    password: "FakeUser11?",
    confirmPassword: "FakeUser11?",
    roleId: admin_role.id,
    roleName: admin_role[:name]
  }

  scenario 'create mobile user form validation' do
    login_as_admin

    visit users_path
    page.find('.common-list-page-header-text', text: 'Users')

    page.find('.add-button').click
    page.find('.common-modal-header-text', text: 'New User')

    test_user_form_validation(mobile_user_create_attrs, true)
  end

  scenario 'update mobile user form validation' do
    create_user_for_test(mobile_user_create_attrs)
    login_as_admin
    visit users_path
    page.find('.common-list-page-header-text', text: 'Users')
    user_list_row = get_user_list_row(mobile_user_create_attrs)
    user_list_row.click
    page.find('.common-modal-header-text', text: 'Update User')

    # empty all form fields
    page.find('#firstName').fill_in with: ''
    page.find('#lastName').fill_in with: ''
    page.find('#password').fill_in with: ''
    page.find('#confirmPassword').fill_in with: ''
    page.find('#email').fill_in with: ''

    test_user_form_validation(mobile_user_create_attrs, false)
  end

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

  scenario 'update admin user without password change' do
    create_user_for_test(admin_user_create_attrs)

    login_as_admin
    visit users_path
    page.find('.common-list-page-header-text', text: 'Users')

    # verify data before update
    create_user_full_name = admin_user_create_attrs[:firstName] + ' ' + admin_user_create_attrs[:lastName]
    search_list_for(create_user_full_name)
    user_list_row = get_user_list_row(admin_user_create_attrs)
    verify_user_list_row(user_list_row, admin_user_create_attrs)
    user_list_row.click

    verify_user_detail(admin_user_create_attrs)

    # save form with no changes
    page.find('.common-form-button.save-button').click

    # verify we're back on list page
    wait_for_page_load
    page.find('.common-list-page-header-text', text: 'Users')

    # verify update in list row
    update_user_full_name = admin_user_create_attrs[:firstName] + ' ' + admin_user_create_attrs[:lastName]
    search_list_for(update_user_full_name)
    user_list_row = get_user_list_row(admin_user_create_attrs)
    verify_user_list_row(user_list_row, admin_user_create_attrs)

    # verify update in detail page
    user_list_row.click
    verify_user_detail(admin_user_create_attrs)

    # verify login - password didn't change and the original should still work
    login_as_test_user(admin_user_create_attrs)
  end

  scenario 'deactivate admin user' do
    deactivate_user_test(admin_user_create_attrs)
  end
end
