require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/commitments/commitment_spec_helper'

RSpec.describe 'Commitment CRUD', type: :system do
  # these are named starting with an "a" so they show on page 1 of the lists
  commitment_create_attrs = {
    title: "a test commitment",
    notes: "affirm notes",
  }

  commitment_update_attrs = {
    title: "a test commitment update",
    notes: "affirm notes update",
  }

  scenario 'create commitment' do
    login_as_admin

    visit commitments_path
    page.find('.common-list-page-header-text', text: 'Commitments')

    create_commitment_in_admin(commitment_create_attrs)

    # verify on list page
    page.find('.search-bar-field').fill_in with: commitment_create_attrs[:title]
    commitment_list_row = get_commitment_list_row(commitment_create_attrs)

    verify_commitment_list_row(commitment_list_row, commitment_create_attrs)

    # go to detail page
    commitment_list_row.click

    verify_commitment_detail(commitment_create_attrs)
  end

  scenario 'update an commitment' do
    before_commitment = get_created_commitment_data(commitment_create_attrs)

    login_as_admin
    visit commitments_path
    page.find('.common-list-page-header-text', text: 'Commitments')

    # verify data before update
    page.find('.search-bar-field').fill_in with: commitment_create_attrs[:title]
    commitment_list_row = get_commitment_list_row(commitment_create_attrs)
    verify_commitment_list_row(commitment_list_row, commitment_create_attrs)
    commitment_list_row.click

    verify_commitment_detail(commitment_create_attrs)

    # perform update
    update_commitment_in_admin(commitment_update_attrs)

    # verify update in list row
    page.find('.search-bar-field').fill_in with: commitment_update_attrs[:title]
    commitment_list_row = get_commitment_list_row(commitment_update_attrs)
    verify_commitment_list_row(commitment_list_row, commitment_update_attrs)

    # verify update in detail page
    commitment_list_row.click
    verify_commitment_detail(commitment_update_attrs)
  end

  scenario 'deactivate an commitment' do
    before_commitment = get_created_commitment_data(commitment_create_attrs)

    login_as_admin
    visit commitments_path
    page.find('.common-list-page-header-text', text: 'Commitments')

    # basic check for the commitment
    page.find('.search-bar-field').fill_in with: commitment_create_attrs[:title]
    expect(page).to have_text(commitment_create_attrs[:title])

    # verify data before update
    page.find('.search-bar-field').fill_in with: commitment_create_attrs[:title]
    commitment_list_row = get_commitment_list_row(commitment_create_attrs)
    verify_commitment_list_row(commitment_list_row, commitment_create_attrs)
    commitment_list_row.click

    verify_commitment_detail(commitment_create_attrs)

    # perform update
    delete_commitment

    # verify delete in list - basic check for absence of the commitment
    expect(page).not_to have_text(commitment_create_attrs[:title])
  end


end
