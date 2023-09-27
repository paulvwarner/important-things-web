require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/self-care-tools/self_care_tool_spec_helper'

RSpec.describe 'Self-Care Tool List Operations', type: :system do
  scenario 'test self-care tool list pagination' do
    login_as_admin

    visit self_care_tools_path
    page.find('.common-list-page-header-text', text: 'Self-Care Tools')

    common_list_pagination_test('.self-care-tools-list-row-cell.title')
  end

  scenario 'test self-care tool list search' do
    login_as_admin

    visit self_care_tools_path
    page.find('.common-list-page-header-text', text: 'Self-Care Tools')

    common_list_search_test('.self-care-tools-list-row-cell.title')
  end
end
