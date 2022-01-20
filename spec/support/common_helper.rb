def pause_test
  $stderr.write 'Test paused. Press enter to continue.'
  $stdin.gets
end

def wait_for_page_load
  # expect loading indicator, but be forgiving if it disappeared too quickly
  begin
    expect(page).to have_css('.loading-indicator-overlay')
  rescue Exception => e
    Rails.logger.info "Test couldn't find loading indicator."
  end
  expect(page).not_to have_css('.loading-indicator-overlay')
end

def expect_one_page(page_range, label_element_css)
  page_range.each do |index|
    page.find(label_element_css, exact_text: 'Test ' + index.to_s.rjust(3, "0"))
  end
end

def common_list_pagination_test(label_element_css)
  expect_one_page(1..20, label_element_css)
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 021')

  # expect 5 visible pages and ellipsis indicating more
  # (All lists are populated with 101 test records split into pages 20 records long, meaning there are 6 total pages.)
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '1')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '2')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '3')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '4')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '5')
  expect(page).not_to have_css('.pagination-element.pagination-link', exact_text: '6')
  expect(page).to have_css('.pagination-ellipsis', exact_text: '...')

  page.find('.pagination-element.pagination-link', exact_text: '2').click

  expect_one_page(21..40, label_element_css)
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 020')
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 041')

  # test display of 5th page
  page.find('.pagination-element.pagination-link', exact_text: '5').click
  expect_one_page(81..100, label_element_css)
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 080')
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 101')

  # expect pagination options to show previously hidden sixth page link
  expect(page).not_to have_css('.pagination-element.pagination-link', exact_text: '1')
  expect(page).to have_css('.pagination-ellipsis', exact_text: '...')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '2')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '3')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '4')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '5')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '6')
end

def common_list_search_test(label_element_css)
  expect_one_page(1..20, label_element_css)
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 021')

  # find one item
  page.find('.search-bar-field').fill_in with: '21'
  page.find(label_element_css, exact_text: 'Test 021')
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 001')
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 020')

  # expect only one page of results, meaning pagination options disappear
  expect(page).not_to have_css('.common-list-pagination-options')

  # find multiple pages of items
  page.find('.search-bar-field').fill_in with: '1'
  page.find(label_element_css, exact_text: 'Test 001')
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 002')
  expect(page).not_to have_css(label_element_css, exact_text: 'Test 022')

  # expect two pages of results
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '1')
  expect(page).to have_css('.pagination-element.pagination-link', exact_text: '2')
  expect(page).not_to have_css('.pagination-element.pagination-link', exact_text: '3')
  expect(page).not_to have_css('.pagination-element.pagination-link', exact_text: '4')
  expect(page).not_to have_css('.pagination-element.pagination-link', exact_text: '5')
end
