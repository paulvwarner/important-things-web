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
