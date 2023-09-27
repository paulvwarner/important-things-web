require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
include SelfCareToolsHelper

def submit_self_care_tool_form(self_care_tool_attrs)
  page.find('#title').fill_in with: self_care_tool_attrs[:title]
  page.find('#notes').fill_in with: self_care_tool_attrs[:notes]

  page.find('.common-form-button.save-button').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Self-Care Tools')
end

def create_self_care_tool_in_admin(self_care_tool_attrs)
  page.find('.add-button').click
  page.find('.common-modal-header-text', text: 'New Self-Care Tool')

  submit_self_care_tool_form(self_care_tool_attrs)
end

def verify_self_care_tool_list_row(self_care_tool_list_row, expected_self_care_tool_data)
  expect(self_care_tool_list_row.find('.title').text)
    .to eq(expected_self_care_tool_data[:title])
end

def get_self_care_tool_list_row(self_care_tool_attrs)
  page
    .find(
      '.self-care-tools-list-row-cell.title',
      text: self_care_tool_attrs[:title]
    )
    .ancestor('.common-list-values-row')
end

def verify_self_care_tool_detail(self_care_tool_attrs)
  page.find('.common-modal-header-text', text: 'Update Self-Care Tool')

  # verify detail page
  expect(page.find('#title').value).to eq(self_care_tool_attrs[:title])
  expect(page.find('#notes').value).to eq(self_care_tool_attrs[:notes])
end

def update_self_care_tool_in_admin(self_care_tool_attrs)
  # assumes edit modal is open
  submit_self_care_tool_form(self_care_tool_attrs)
end

def delete_self_care_tool
  page.find('.common-form-button.delete-button').click

  # confirm
  page.find('.common-modal-header-text', text: 'Confirm Delete')
  page.find('.confirm-delete-modal-button-text', text: 'DELETE').click

  # verify delete occurred
  wait_for_page_load
  page.find('.toast-message', text: 'Successfully deleted self-care tool.').click

  # verify we're back on list page (modal is closed)
  page.find('.common-list-page-header-text', text: 'Self-Care Tools')
  expect(page).not_to have_css('.common-modal')
end

def create_self_care_tool_for_test(self_care_tool_attrs)
  self_care_tool = create_self_care_tool(self_care_tool_attrs)
  self_care_tool.as_json
end
