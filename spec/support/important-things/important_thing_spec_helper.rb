require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
include ImportantThingsHelper

def submit_important_thing_form(important_thing_attrs)
  page.find('#message').fill_in with: important_thing_attrs[:message]
  page.find('#notes').fill_in with: important_thing_attrs[:notes]
  page.find('#weight').fill_in with: important_thing_attrs[:weight]

  page.find('.common-form-button.save-button').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Important Things')
end

def create_important_thing_in_admin(important_thing_attrs)
  page.find('.add-button').click
  page.find('.common-modal-header-text', text: 'New Important Thing')

  submit_important_thing_form(important_thing_attrs)
end

def verify_important_thing_list_row(important_thing_list_row, expected_important_thing_data)
  expect(important_thing_list_row.find('.message').text)
    .to eq(expected_important_thing_data[:message])

  expect(important_thing_list_row.find('.weight').text)
    .to eq(expected_important_thing_data[:weight].to_s)
end

def get_important_thing_list_row(important_thing_attrs)
  page
    .find(
      '.important-things-list-row-cell.message',
      text: important_thing_attrs[:message]
    )
    .ancestor('.common-list-values-row')
end

def verify_important_thing_detail(important_thing_attrs)
  page.find('.common-modal-header-text', text: 'Update Important Thing')

  # verify detail page
  expect(page.find('#message').value).to eq(important_thing_attrs[:message])
  expect(page.find('#notes').value).to eq(important_thing_attrs[:notes])
  expect(page.find('#weight').value).to eq(important_thing_attrs[:weight].to_s)
end

def update_important_thing_in_admin(important_thing_attrs)
  # assumes edit modal is open
  submit_important_thing_form(important_thing_attrs)
end

def delete_important_thing
  page.find('.common-form-button.delete-button').click

  # confirm
  page.find('.common-modal-header-text', text: 'Confirm Delete')
  page.find('.confirm-delete-modal-button-text', text: 'DELETE').click

  # verify delete occurred
  wait_for_page_load
  page.find('.toast-message', text: 'Successfully deleted important thing.').click

  # verify we're back on list page (modal is closed)
  page.find('.common-list-page-header-text', text: 'Important Things')
  expect(page).not_to have_css('.common-modal')
end

def create_important_thing_for_test(important_thing_attrs)
  important_thing = create_important_thing(important_thing_attrs)
  important_thing.as_json
end
