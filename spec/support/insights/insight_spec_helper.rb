require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
include InsightsHelper

def submit_insight_form(insight_attrs)
  page.find('#message').fill_in with: insight_attrs[:message]
  page.find('#notes').fill_in with: insight_attrs[:notes]
  page.find('#weight').fill_in with: insight_attrs[:weight]

  page.find('.common-form-button.save-button').click

  # verify we're back on list page
  wait_for_page_load
  page.find('.common-list-page-header-text', text: 'Insights')
end

def create_insight_in_admin(insight_attrs)
  page.find('.add-button').click
  page.find('.common-modal-header-text', text: 'New Insight')

  submit_insight_form(insight_attrs)
end

def verify_insight_list_row(insight_list_row, expected_insight_data)
  expect(insight_list_row.find('.message').text)
    .to eq(expected_insight_data[:message])

  expect(insight_list_row.find('.weight').text)
    .to eq(expected_insight_data[:weight].to_s)
end

def get_insight_list_row(insight_attrs)
  page
    .find(
      '.insights-list-row-cell.message',
      text: insight_attrs[:message]
    )
    .ancestor('.common-list-values-row')
end

def verify_insight_detail(insight_attrs)
  page.find('.common-modal-header-text', text: 'Update Insight')

  # verify detail page
  expect(page.find('#message').value).to eq(insight_attrs[:message])
  expect(page.find('#notes').value).to eq(insight_attrs[:notes])
  expect(page.find('#weight').value).to eq(insight_attrs[:weight].to_s)
end

def update_insight_in_admin(insight_attrs)
  # assumes edit modal is open
  submit_insight_form(insight_attrs)
end

def delete_insight
  page.find('.common-form-button.delete-button').click

  # confirm
  page.find('.common-modal-header-text', text: 'Confirm Delete')
  page.find('.confirm-delete-modal-button-text', text: 'DELETE').click

  # verify delete occurred
  wait_for_page_load
  page.find('.toast-message', text: 'Successfully deleted insight.').click

  # verify we're back on list page (modal is closed)
  page.find('.common-list-page-header-text', text: 'Insights')
  expect(page).not_to have_css('.common-modal')
end

def create_insight_for_test(insight_attrs)
  insight = create_insight(insight_attrs)
  insight.as_json
end
