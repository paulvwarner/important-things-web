class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session, if: Proc.new {|c| c.request.format == 'application/json'}

  before_action :authenticate

  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    token = request.headers['HTTP_WWWAUTHENTICATE']

    return if token.blank?

    User.find_by(authentication_token: token.to_s, active: true).present?
  end

  def render_unauthorized
    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
    render json: { message: 'Bad credentials' }, status: 401
  end

  def get_current_user_permissions
    Permission
      .joins(:role_permissions)
      .joins("JOIN user_roles on user_roles.role_id = role_permissions.role_id")
      .joins("JOIN users on users.id = user_roles.user_id")
      .where(
        "users.authentication_token = ? AND users.active = 1",
        request.headers['HTTP_WWWAUTHENTICATE'].to_s
      )
      .pluck("permissions.name")
      .uniq
  end

  def authorize_for (required_permission, current_user_permissions)
    authorize_for_any([required_permission], current_user_permissions)
  end

  def authorize_for_any (required_permissions, current_user_permissions)
    current_user_authorized = false
    required_permissions.each do |permission_name|
      if current_user_permissions.include?(permission_name)
        current_user_authorized = true
        break
      end
    end

    if !current_user_authorized
      Rails.logger.info "User not authorized for this operation - must have one of these permissions: " + required_permissions.to_yaml
      render_forbidden
    end
  end

  def render_forbidden
    render json: nil, status: 403
  end
end