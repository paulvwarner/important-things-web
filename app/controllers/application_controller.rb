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
end