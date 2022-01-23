require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/users/user_spec_helper'

RSpec.describe 'User List Operations', type: :system do
  scenario 'test user list pagination' do
    login_as_admin

    visit users_path
    page.find('.common-list-page-header-text', text: 'Users')

    common_list_pagination_test('.users-list-row-cell.full-name')
  end

  scenario 'test user list search' do
    login_as_admin

    visit users_path
    page.find('.common-list-page-header-text', text: 'Users')

    common_list_search_test('.users-list-row-cell.full-name')
  end
end
