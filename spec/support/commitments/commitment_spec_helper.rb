require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
include CommitmentsHelper

def submit_commitment_form(commitment_attrs)
  page.find('#title').fill_in with: commitment_attrs[:title]
  page.find('#notes').fill_in with: commitment_attrs[:notes]

  page.find('.common-form-button.save-button').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Commitments')
end

def create_commitment_in_admin(commitment_attrs)
  page.find('.add-button').click
  page.find('.common-modal-header-text', text: 'New Commitment')

  submit_commitment_form(commitment_attrs)
end

def verify_commitment_list_row(commitment_list_row, expected_commitment_data)
  expect(commitment_list_row.find('.title').text)
    .to eq(expected_commitment_data[:title])
end

def get_commitment_list_row(commitment_attrs)
  page
    .find(
      '.commitments-list-row-cell.title',
      text: commitment_attrs[:title]
    )
    .ancestor('.common-list-values-row')
end

def verify_commitment_detail(commitment_attrs)
  page.find('.common-modal-header-text', text: 'Update Commitment')

  # verify detail page
  expect(page.find('#title').value).to eq(commitment_attrs[:title])
  expect(page.find('#notes').value).to eq(commitment_attrs[:notes])
end

def update_commitment_in_admin(commitment_attrs)
  # assumes edit modal is open
  submit_commitment_form(commitment_attrs)
end

def delete_commitment
  page.find('.common-form-button.delete-button').click

  # confirm
  page.find('.common-modal-header-text', text: 'Confirm Delete')
  page.find('.confirm-delete-modal-button-text', text: 'DELETE').click

  # verify delete occurred
  wait_for_page_load
  page.find('.toast-message', text: 'Successfully deleted commitment.').click

  # verify we're back on list page (modal is closed)
  page.find('.common-list-page-header-text', text: 'Commitments')
  expect(page).not_to have_css('.common-modal')
end

def create_commitment_for_test(commitment_attrs)
  commitment = create_commitment(commitment_attrs)
  commitment.as_json
end
