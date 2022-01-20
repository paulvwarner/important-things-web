require 'rails_helper'
require 'support/login_spec_helper'
require 'support/common_helper'
require 'support/affirmations/affirmation_spec_helper'

RSpec.describe 'Affirmation List Operations', type: :system do
  scenario 'test affirmation list pagination' do
    login_as_admin

    visit affirmations_path
    page.find('.common-list-page-header-text', text: 'Affirmations')

    common_list_pagination_test('.affirmations-list-row-cell.message')
  end

  scenario 'test affirmation list search' do
    login_as_admin

    visit affirmations_path
    page.find('.common-list-page-header-text', text: 'Affirmations')

    common_list_search_test('.affirmations-list-row-cell.message')
  end
end
