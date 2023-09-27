require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/self-care-tools/self_care_tool_spec_helper'

RSpec.describe 'Self-Care Tool CRUD', type: :system do
  # these are named starting with an "a" so they show on page 1 of the lists
  self_care_tool_create_attrs = {
    title: "a test self-care tool",
    notes: "affirm notes",
  }

  self_care_tool_update_attrs = {
    title: "a test self-care tool update",
    notes: "affirm notes update",
  }

  scenario 'create self-care tool' do
    login_as_admin

    visit self_care_tools_path
    page.find('.common-list-page-header-text', text: 'Self-Care Tools')

    create_self_care_tool_in_admin(self_care_tool_create_attrs)

    # verify on list page
    search_list_for(self_care_tool_create_attrs[:title])
    self_care_tool_list_row = get_self_care_tool_list_row(self_care_tool_create_attrs)

    verify_self_care_tool_list_row(self_care_tool_list_row, self_care_tool_create_attrs)

    # go to detail page
    self_care_tool_list_row.click

    verify_self_care_tool_detail(self_care_tool_create_attrs)
  end

  scenario 'update a self-care tool' do
    create_self_care_tool_for_test(self_care_tool_create_attrs)

    login_as_admin
    visit self_care_tools_path
    page.find('.common-list-page-header-text', text: 'Self-Care Tools')

    # verify data before update
    search_list_for(self_care_tool_create_attrs[:title])
    self_care_tool_list_row = get_self_care_tool_list_row(self_care_tool_create_attrs)
    verify_self_care_tool_list_row(self_care_tool_list_row, self_care_tool_create_attrs)
    self_care_tool_list_row.click

    verify_self_care_tool_detail(self_care_tool_create_attrs)

    # perform update
    update_self_care_tool_in_admin(self_care_tool_update_attrs)

    # verify update in list row
    search_list_for(self_care_tool_update_attrs[:title])
    self_care_tool_list_row = get_self_care_tool_list_row(self_care_tool_update_attrs)
    verify_self_care_tool_list_row(self_care_tool_list_row, self_care_tool_update_attrs)

    # verify update in detail page
    self_care_tool_list_row.click
    verify_self_care_tool_detail(self_care_tool_update_attrs)
  end

  scenario 'deactivate a self-care tool' do
    create_self_care_tool_for_test(self_care_tool_create_attrs)

    login_as_admin
    visit self_care_tools_path
    page.find('.common-list-page-header-text', text: 'Self-Care Tools')

    # basic check for the self_care_tool
    search_list_for(self_care_tool_create_attrs[:title])
    expect(page).to have_text(self_care_tool_create_attrs[:title])

    # verify data before update
    search_list_for(self_care_tool_create_attrs[:title])
    self_care_tool_list_row = get_self_care_tool_list_row(self_care_tool_create_attrs)
    verify_self_care_tool_list_row(self_care_tool_list_row, self_care_tool_create_attrs)
    self_care_tool_list_row.click

    verify_self_care_tool_detail(self_care_tool_create_attrs)

    # perform update
    delete_self_care_tool

    # verify delete in list - basic check for absence of the self-care tool
    expect(page).not_to have_text(self_care_tool_create_attrs[:title])
  end


end
