require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/important-things/important_thing_spec_helper'

RSpec.describe 'Important Thing CRUD', type: :system do
  # these are named starting with an "a" so they show on page 1 of the lists
  important_thing_create_attrs = {
    message: "a test important thing",
    notes: "it's important",
    weight: 1
  }

  important_thing_update_attrs = {
    message: "a test important thing update",
    notes: "it's still important",
    weight: 2
  }

  scenario 'create important thing' do
    login_as_admin

    visit important_things_path
    page.find('.common-list-page-header-text', text: 'Important Things')

    create_important_thing_in_admin(important_thing_create_attrs)

    # verify on list page
    page.find('.search-bar-field').fill_in with: important_thing_create_attrs[:message]
    important_thing_list_row = get_important_thing_list_row(important_thing_create_attrs)

    verify_important_thing_list_row(important_thing_list_row, important_thing_create_attrs)

    # go to detail page
    important_thing_list_row.click

    verify_important_thing_detail(important_thing_create_attrs)
  end

  scenario 'update an important thing' do
    create_important_thing_for_test(important_thing_create_attrs)

    login_as_admin
    visit important_things_path
    page.find('.common-list-page-header-text', text: 'Important Things')

    # verify data before update
    page.find('.search-bar-field').fill_in with: important_thing_create_attrs[:message]
    important_thing_list_row = get_important_thing_list_row(important_thing_create_attrs)
    verify_important_thing_list_row(important_thing_list_row, important_thing_create_attrs)
    important_thing_list_row.click

    verify_important_thing_detail(important_thing_create_attrs)

    # perform update
    update_important_thing_in_admin(important_thing_update_attrs)

    # verify update in list row
    page.find('.search-bar-field').fill_in with: important_thing_update_attrs[:message]
    important_thing_list_row = get_important_thing_list_row(important_thing_update_attrs)
    verify_important_thing_list_row(important_thing_list_row, important_thing_update_attrs)

    # verify update in detail page
    important_thing_list_row.click
    verify_important_thing_detail(important_thing_update_attrs)
  end

  scenario 'deactivate an important thing' do
    create_important_thing_for_test(important_thing_create_attrs)

    login_as_admin
    visit important_things_path
    page.find('.common-list-page-header-text', text: 'Important Things')

    # basic check for the important thing
    page.find('.search-bar-field').fill_in with: important_thing_create_attrs[:message]
    expect(page).to have_text(important_thing_create_attrs[:message])

    # verify data before update
    important_thing_list_row = get_important_thing_list_row(important_thing_create_attrs)
    verify_important_thing_list_row(important_thing_list_row, important_thing_create_attrs)
    important_thing_list_row.click

    verify_important_thing_detail(important_thing_create_attrs)

    # perform update
    delete_important_thing

    # verify delete in list - basic check for absence of the important thing
    expect(page).not_to have_text(important_thing_create_attrs[:message])
  end
end
