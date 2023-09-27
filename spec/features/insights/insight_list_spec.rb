require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/insights/insight_spec_helper'

RSpec.describe 'Insight List Operations', type: :system do
  scenario 'test insight list pagination' do
    login_as_admin

    visit insights_path
    page.find('.common-list-page-header-text', text: 'Insights')

    common_list_pagination_test('.insights-list-row-cell.message')
  end

  scenario 'test insight list search' do
    login_as_admin

    visit insights_path
    page.find('.common-list-page-header-text', text: 'Insights')

    common_list_search_test('.insights-list-row-cell.message')

  end
end
