CREDENTIALS = YAML.load_file("#{Rails.root.to_s}/spec/support/credentials.yml")

def perform_login(username, password, expected_user_name)
  visit login_path
  page.fill_in 'usernameInput', with: username
  page.fill_in 'passwordInput', with: password
  page.find('.pill-button-text', text: 'LOGIN').click

  # wait until user is logged in
  page.find('.admin-header-username-display', text: 'Logged in as ' + expected_user_name)
end

def login_as_admin
  perform_login(
    CREDENTIALS['admin_username'],
    CREDENTIALS['admin_password'],
    'Paul Warner'
  )
end
