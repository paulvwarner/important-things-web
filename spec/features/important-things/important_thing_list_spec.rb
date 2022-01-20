require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/important-things/important_thing_spec_helper'

RSpec.describe 'Important Thing List Operations', type: :system do
  scenario 'test important thing list pagination' do
    login_as_admin

    visit important_things_path
    page.find('.common-list-page-header-text', text: 'Important Things')

    common_list_pagination_test('.important-things-list-row-cell.message')
  end

  scenario 'test important thing list search' do
    login_as_admin

    visit important_things_path
    page.find('.common-list-page-header-text', text: 'Important Things')

    common_list_search_test('.important-things-list-row-cell.message')

  end
end
