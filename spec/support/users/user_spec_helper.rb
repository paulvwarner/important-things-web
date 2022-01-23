require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
include UsersHelper

def submit_user_form(user_attrs)
  page.find('#firstName').fill_in with: user_attrs[:firstName]
  page.find('#lastName').fill_in with: user_attrs[:lastName]
  page.find('#email').fill_in with: user_attrs[:email]
  page.find('.role-selector .option-circle-' + user_attrs[:roleId].to_s).click

  if user_attrs.has_key?(:password) && user_attrs.has_key?(:confirmPassword)
    page.find('#password').fill_in with: user_attrs[:password]
    page.find('#confirmPassword').fill_in with: user_attrs[:confirmPassword]
  end

  page.find('.common-form-button.save-button').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Users')
end

def create_user_in_admin(user_attrs)
  page.find('.add-button').click
  page.find('.common-modal-header-text', text: 'New User')

  submit_user_form(user_attrs)
end

def verify_user_list_row(user_list_row, expected_user_data)
  expect(user_list_row.find('.full-name').text)
    .to eq(expected_user_data[:firstName] + ' ' + expected_user_data[:lastName])
  expect(user_list_row.find('.email').text).to eq(expected_user_data[:email])
  expect(user_list_row.find('.role').text).to eq(expected_user_data[:roleName])
end

def get_user_list_row(user_attrs)
  page
    .find(
      '.users-list-row-cell.full-name',
      text: user_attrs[:firstName] + ' ' + user_attrs[:lastName]
    )
    .ancestor('.common-list-values-row')
end

def verify_user_detail(user_attrs)
  page.find('.common-modal-header-text', text: 'Update User')

  # verify detail page
  expect(page.find('#firstName').value).to eq(user_attrs[:firstName])
  expect(page.find('#lastName').value).to eq(user_attrs[:lastName])
  expect(page.find('#email').value).to eq(user_attrs[:email])

  # expect a certain radio option to be selected (to show a "selected" dot)
  expect(page.find('.role-selector .option-circle-' + user_attrs[:roleId].to_s + ' .common-radio-option-dot'))
end

def update_user_in_admin(user_attrs)
  # assumes edit modal is open
  submit_user_form(user_attrs)
end

def delete_user
  page.find('.common-form-button.delete-button').click

  # confirm
  page.find('.common-modal-header-text', text: 'Confirm Delete')
  page.find('.confirm-delete-modal-button-text', text: 'DELETE').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Users')
end

def create_user_for_test(user_attrs)
  user = create_user(user_attrs)
  user.as_json
end

def create_user_test(create_user_attrs)
  login_as_admin

  visit users_path
  page.find('.common-list-page-header-text', text: 'Users')

  create_user_in_admin(create_user_attrs)

  # verify on list page
  create_user_full_name = create_user_attrs[:firstName] + ' ' + create_user_attrs[:lastName]
  page.find('.search-bar-field').fill_in with: create_user_full_name
  user_list_row = get_user_list_row(create_user_attrs)

  verify_user_list_row(user_list_row, create_user_attrs)

  # go to detail page
  user_list_row.click

  verify_user_detail(create_user_attrs)

  # verify login (fails for mobile user)
  login_as_test_user(create_user_attrs)
end

def update_user_test(create_user_attrs, update_user_attrs)
  create_user_for_test(create_user_attrs)

  login_as_admin
  visit users_path
  page.find('.common-list-page-header-text', text: 'Users')

  # verify data before update
  create_user_full_name = create_user_attrs[:firstName] + ' ' + create_user_attrs[:lastName]
  page.find('.search-bar-field').fill_in with: create_user_full_name
  user_list_row = get_user_list_row(create_user_attrs)
  verify_user_list_row(user_list_row, create_user_attrs)
  user_list_row.click

  verify_user_detail(create_user_attrs)

  # perform update
  update_user_in_admin(update_user_attrs)

  # verify update in list row
  update_user_full_name = update_user_attrs[:firstName] + ' ' + update_user_attrs[:lastName]
  page.find('.search-bar-field').fill_in with: update_user_full_name
  user_list_row = get_user_list_row(update_user_attrs)
  verify_user_list_row(user_list_row, update_user_attrs)

  # verify update in detail page
  user_list_row.click
  verify_user_detail(update_user_attrs)

  # verify login (fails for mobile user)
  login_as_test_user(update_user_attrs)
end

def deactivate_user_test(create_user_attrs)
  create_user_for_test(create_user_attrs)

  login_as_admin
  visit users_path
  page.find('.common-list-page-header-text', text: 'Users')

  # basic check for the user
  user_full_name = create_user_attrs[:firstName] + ' ' + create_user_attrs[:lastName]
  page.find('.search-bar-field').fill_in with: user_full_name
  expect(page).to have_text(user_full_name)

  # verify data before update
  page.find('.search-bar-field').fill_in with: user_full_name
  user_list_row = get_user_list_row(create_user_attrs)
  verify_user_list_row(user_list_row, create_user_attrs)
  user_list_row.click

  verify_user_detail(create_user_attrs)

  # perform update
  delete_user

  # verify delete in list - basic check for absence of the user
  expect(page).not_to have_text(user_full_name)

  # verify login (fails for deactivated user)
  login_as_test_user(create_user_attrs, true)
end

def test_user_form_validation(user_attrs, is_new_user)
  # test empty form - this method assumes form is empty
  page.find('.common-form-button.save-button').click

  page.find('.toast-message', text: 'Please enter an email address.').click
  page.find('.toast-message', text: 'Please enter a first name.').click
  page.find('.toast-message', text: 'Please enter a last name.').click

  if is_new_user
    page.find('.toast-message', text: 'Please enter a password.').click
    page.find('.toast-message', text: 'Please select a role.').click
  end

  # fill out all fields, test invalid email
  page.find('#firstName').fill_in with: user_attrs[:firstName]
  page.find('#lastName').fill_in with: user_attrs[:lastName]

  if is_new_user
    page.find('#password').fill_in with: user_attrs[:password]
    page.find('#confirmPassword').fill_in with: user_attrs[:confirmPassword]
    page.find('.role-selector .option-circle-' + user_attrs[:roleId].to_s).click
  end

  page.find('#email').fill_in with: 'fake email'

  page.find('.common-form-button.save-button').click

  page.find('.toast-message', text: 'Please enter a valid email address.').click

  # test already used email
  page.find('#email').fill_in with: CREDENTIALS['admin_username'].to_s
  page.find('.common-form-button.save-button').click
  page.find('.toast-message', text: 'Another user is already using that email address - please enter a different email address.').click

  # test password that isn't long enough and that lacks required characters
  page.find('#email').fill_in with: user_attrs[:email]
  page.find('#password').fill_in with: 'pass'
  page.find('#confirmPassword').fill_in with: 'pass'
  page.find('.common-form-button.save-button').click

  page.find('.toast-message', text: 'Passwords must be at least 8 characters long.').click
  page.find('.toast-message', text: 'Passwords must contain at least one upper case letter.').click
  page.find('.toast-message', text: 'Passwords must contain at least one number.').click
  page.find('.toast-message', text: 'Passwords must contain at least one of these characters:').click

  # test password mismatch
  page.find('#password').fill_in with: user_attrs[:password]
  page.find('#confirmPassword').fill_in with: 'pass'
  page.find('.common-form-button.save-button').click

  page.find('.toast-message', text: 'Password does not match confirm password.').click

  # close form, dismiss leave without save warnings
  page.find('.cancel-button').click
  page.find('.leave-without-saving-warning-modal-leave-button').click
end
