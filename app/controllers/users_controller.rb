require 'bcrypt'

class UsersController < ApplicationController
  include BCrypt
  include UsersHelper
  include ApplicationHelper

  skip_before_action :authenticate, only: [:login]

  def login
    Rails.logger.info 'Login attempt for username "' + params[:username] + '"'
    token = nil
    user = User.includes(user_full_query_includes)
               .find_by(username: params[:username])

    if user != nil
      db_password = Password.new(user[:password])

      if db_password == params[:password]
        if user[:authentication_token].blank?
          token = generate_authentication_token
          user[:authentication_token] = token
          user.save!
        else
          token = user[:authentication_token]
        end
      else
        Rails.logger.info "Login failed - passwords didn't match."
      end
    end

    if user && !user.active
      render json: {message: 'User has been deactivated.'}, status: 401
    else
      if token != nil
        Rails.logger.info "Login successful for user " + user[:username].to_s + ' with token ' + token
      end

      permission_ids = []
      user.user_roles.each do |user_role|
        user_role.role.role_permissions.each do |role_permission|
          permission_ids.push(role_permission.permission_id)
        end
      end

      permissions = Permission.where("id in (?)", permission_ids.uniq)

      render json: {
        user: user.as_json(user_full_json_includes),
        permissions: permissions.as_json
      }, status: 200
    end
  end

  def logout
    begin
      user = User.find_by(authentication_token: URI.unescape(params[:token]))
      user.update({authentication_token: ''})

    rescue Exception => e
      Rails.logger.info "Error occurred while logging out: " + e.to_yaml
      render json: {message: e.message}, status: 500
      return
    end

    render json: {}, status: 200
  end
end
