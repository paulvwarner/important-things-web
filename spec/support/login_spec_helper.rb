CREDENTIALS = YAML.load_file("#{Rails.root.to_s}/spec/support/credentials.yml")

def perform_login(username, password, expected_user_name, is_mobile_user = false, is_deactivated = false)
  visit login_path
  page.fill_in 'usernameInput', with: username
  page.fill_in 'passwordInput', with: password
  page.find('.pill-button-text', text: 'LOGIN').click

  if is_deactivated
    page.find('.toast-message', text: 'User has been deactivated.')
  elsif is_mobile_user
    page.find('.toast-message', text: 'User does not have web admin access.')
  else
    # wait until user is logged in
    page.find('.admin-header-username-display', text: 'Logged in as ' + expected_user_name, wait: 15)
  end
end

def login_as_test_user(user_attrs, is_deactivated = false)
  perform_login(
    user_attrs[:email],
    user_attrs[:password],
    user_attrs[:firstName] + ' ' + user_attrs[:lastName],
    user_attrs[:roleName] == 'Mobile App User',
    is_deactivated
  )
end

def login_as_admin
  perform_login(
    CREDENTIALS['admin_username'],
    CREDENTIALS['admin_password'],
    'Paul Warner'
  )
end
