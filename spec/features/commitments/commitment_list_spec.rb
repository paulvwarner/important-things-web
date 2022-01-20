require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/commitments/commitment_spec_helper'

RSpec.describe 'Commitment List Operations', type: :system do
  scenario 'test commitment list pagination' do
    login_as_admin

    visit commitments_path
    page.find('.common-list-page-header-text', text: 'Commitments')

    common_list_pagination_test('.commitments-list-row-cell.title')
  end

  scenario 'test commitment list search' do
    login_as_admin

    visit commitments_path
    page.find('.common-list-page-header-text', text: 'Commitments')

    common_list_search_test('.commitments-list-row-cell.title')
  end
end
