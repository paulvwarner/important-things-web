require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/insights/insight_spec_helper'

RSpec.describe 'Insight CRUD', type: :system do
  # these are named starting with an "a" so they show on page 1 of the lists
  insight_create_attrs = {
    message: "a test insight",
    notes: "it's important",
    weight: 1
  }

  insight_update_attrs = {
    message: "a test insight update",
    notes: "it's still important",
    weight: 2
  }

  scenario 'create insight' do
    login_as_admin

    visit insights_path
    page.find('.common-list-page-header-text', text: 'Insights')

    create_insight_in_admin(insight_create_attrs)

    # verify on list page
    search_list_for(insight_create_attrs[:title])
    insight_list_row = get_insight_list_row(insight_create_attrs)

    verify_insight_list_row(insight_list_row, insight_create_attrs)

    # go to detail page
    insight_list_row.click

    verify_insight_detail(insight_create_attrs)
  end

  scenario 'update an insight' do
    create_insight_for_test(insight_create_attrs)

    login_as_admin
    visit insights_path
    page.find('.common-list-page-header-text', text: 'Insights')

    # verify data before update
    search_list_for(insight_create_attrs[:title])
    insight_list_row = get_insight_list_row(insight_create_attrs)
    verify_insight_list_row(insight_list_row, insight_create_attrs)
    insight_list_row.click

    verify_insight_detail(insight_create_attrs)

    # perform update
    update_insight_in_admin(insight_update_attrs)

    # verify update in list row
    search_list_for(insight_update_attrs[:title])
    insight_list_row = get_insight_list_row(insight_update_attrs)
    verify_insight_list_row(insight_list_row, insight_update_attrs)

    # verify update in detail page
    insight_list_row.click
    verify_insight_detail(insight_update_attrs)
  end

  scenario 'deactivate an insight' do
    create_insight_for_test(insight_create_attrs)

    login_as_admin
    visit insights_path
    page.find('.common-list-page-header-text', text: 'Insights')

    # basic check for the insight
    search_list_for(insight_create_attrs[:title])
    expect(page).to have_text(insight_create_attrs[:message])

    # verify data before update
    insight_list_row = get_insight_list_row(insight_create_attrs)
    verify_insight_list_row(insight_list_row, insight_create_attrs)
    insight_list_row.click

    verify_insight_detail(insight_create_attrs)

    # perform update
    delete_insight

    # verify delete in list - basic check for absence of the insight
    expect(page).not_to have_text(insight_create_attrs[:message])
  end
end
