require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
include AffirmationsHelper

def submit_affirmation_form(affirmation_attrs)
  page.find('#message').fill_in with: affirmation_attrs[:message]
  page.find('#notes').fill_in with: affirmation_attrs[:notes]

  page.find('.common-form-button.save-button').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Affirmations')
end

def create_affirmation_in_admin(affirmation_attrs)
  page.find('.add-button').click
  page.find('.common-modal-header-text', text: 'New Affirmation')

  submit_affirmation_form(affirmation_attrs)
end

def verify_affirmation_list_row(affirmation_list_row, expected_affirmation_data)
  expect(affirmation_list_row.find('.message').text)
    .to eq(expected_affirmation_data[:message])
end

def get_affirmation_list_row(affirmation_attrs)
  page
    .find(
      '.affirmations-list-row-cell.message',
      text: affirmation_attrs[:message]
    )
    .ancestor('.common-list-values-row')
end

def verify_affirmation_detail(affirmation_attrs)
  page.find('.common-modal-header-text', text: 'Update Affirmation')

  # verify detail page
  expect(page.find('#message').value).to eq(affirmation_attrs[:message])
  expect(page.find('#notes').value).to eq(affirmation_attrs[:notes])
end

def update_affirmation_in_admin(affirmation_attrs)
  # assumes edit modal is open
  submit_affirmation_form(affirmation_attrs)
end

def delete_affirmation
  page.find('.common-form-button.delete-button').click

  # confirm
  page.find('.common-modal-header-text', text: 'Confirm Delete')
  page.find('.confirm-delete-modal-button-text', text: 'DELETE').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Affirmations')
end

def get_created_affirmation_data(affirmation_attrs)
  affirmation = create_affirmation(affirmation_attrs)
  affirmation.as_json
end
