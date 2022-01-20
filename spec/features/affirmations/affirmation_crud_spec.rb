require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/affirmations/affirmation_spec_helper'

RSpec.describe 'Affirmation CRUD', type: :system do
  # these are named starting with an "a" so they show on page 1 of the lists
  affirmation_create_attrs = {
    message: "a test affirmation",
    notes: "affirm notes",
  }

  affirmation_update_attrs = {
    message: "a test affirmation update",
    notes: "affirm notes update",
  }

  scenario 'create affirmation' do
    login_as_admin

    visit affirmations_path
    page.find('.common-list-page-header-text', text: 'Affirmations')

    create_affirmation_in_admin(affirmation_create_attrs)

    # verify on list page
    page.find('.search-bar-field').fill_in with: affirmation_create_attrs[:message]
    affirmation_list_row = get_affirmation_list_row(affirmation_create_attrs)

    verify_affirmation_list_row(affirmation_list_row, affirmation_create_attrs)

    # go to detail page
    affirmation_list_row.click

    verify_affirmation_detail(affirmation_create_attrs)
  end

  scenario 'update an affirmation' do
    before_affirmation = get_created_affirmation_data(affirmation_create_attrs)

    login_as_admin
    visit affirmations_path
    page.find('.common-list-page-header-text', text: 'Affirmations')

    # verify data before update
    page.find('.search-bar-field').fill_in with: affirmation_create_attrs[:message]
    affirmation_list_row = get_affirmation_list_row(affirmation_create_attrs)
    verify_affirmation_list_row(affirmation_list_row, affirmation_create_attrs)
    affirmation_list_row.click

    verify_affirmation_detail(affirmation_create_attrs)

    # perform update
    update_affirmation_in_admin(affirmation_update_attrs)

    # verify update in list row
    page.find('.search-bar-field').fill_in with: affirmation_update_attrs[:message]
    affirmation_list_row = get_affirmation_list_row(affirmation_update_attrs)
    verify_affirmation_list_row(affirmation_list_row, affirmation_update_attrs)

    # verify update in detail page
    affirmation_list_row.click
    verify_affirmation_detail(affirmation_update_attrs)
  end

  scenario 'deactivate an affirmation' do
    before_affirmation = get_created_affirmation_data(affirmation_create_attrs)

    login_as_admin
    visit affirmations_path
    page.find('.common-list-page-header-text', text: 'Affirmations')

    # basic check for the affirmation
    page.find('.search-bar-field').fill_in with: affirmation_create_attrs[:message]
    expect(page).to have_text(affirmation_create_attrs[:message])

    # verify data before update
    page.find('.search-bar-field').fill_in with: affirmation_create_attrs[:message]
    affirmation_list_row = get_affirmation_list_row(affirmation_create_attrs)
    verify_affirmation_list_row(affirmation_list_row, affirmation_create_attrs)
    affirmation_list_row.click

    verify_affirmation_detail(affirmation_create_attrs)

    # perform update
    delete_affirmation

    # verify delete in list - basic check for absence of the affirmation
    expect(page).not_to have_text(affirmation_create_attrs[:message])
  end


end
