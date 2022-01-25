require 'bcrypt'

class UsersController < ApplicationController
  include BCrypt
  include UsersHelper
  include ApplicationHelper

  class_variable_set(:@@users_per_page, 20)

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
    elsif user
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
    else
      render json: {}, status: 200
    end
  end

  def logout
    begin
      user = User.find_by(authentication_token: URI::DEFAULT_PARSER.unescape(params[:token]))
      user.update({authentication_token: ''})

    rescue Exception => e
      Rails.logger.info "Error occurred while logging out: " + e.to_yaml
      render json: {message: e.message}, status: 500
      return
    end

    render json: {}, status: 200
  end

  def is_person_email_available
    begin
      email_usage_query = Person.where(
        "lower(email) = ?",
        URI::DEFAULT_PARSER.unescape(params[:email]).to_s.downcase
      )

      email_is_available = (email_usage_query.count == 0)

      render json: email_is_available, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def index
    authorize_for(Permission::NAMES[:user_read], get_current_user_permissions)
    return if performed?

    # return users list
    users_query = User
                    .includes(user_list_query_includes)
                    .joins(:person)
                    .where(active: true)

    # apply filters
    if params[:searchText] && params[:searchText].to_s.size > 0
      search_term = params[:searchText].to_s.downcase
      users_query = users_query
                      .where(
                        "lower(people.email) like '%" +
                          search_term.to_s +
                          "%' OR lower(concat(people.first_name, ' ', people.last_name)) like '%" +
                          search_term.to_s + "%'"
                      )
    end

    users = users_query
              .order('people.email')
              .page(params[:page])
              .per(@@users_per_page)

    render json: {
      modelList: users.as_json(user_list_json_includes),
      pageCount: users.total_pages
    }, status: 200
  end

  def show
    authorize_for(Permission::NAMES[:user_read], get_current_user_permissions)
    return if performed?

    # return single user by id
    user = User.includes(user_list_query_includes)
               .find(params[:id])

    render json: user.as_json(user_list_json_includes), status: 200
  end

  def create
    begin
      authorize_for(Permission::NAMES[:user_create], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        create_user(params)
      end
      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def update
    begin
      authorize_for(Permission::NAMES[:user_update], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        user_update = {}
        person_update = {}

        user = User.find(params[:id])
        person = Person.find(user[:person_id])

        if params.has_key?(:active)
          user_update[:active] = params[:active]
        end

        if params.has_key?(:firstName)
          person_update[:first_name] = params[:firstName]
        end

        if params.has_key?(:lastName)
          person_update[:last_name] = params[:lastName]
        end

        if params.has_key?(:email)
          person_update[:email] = params[:email]
          user_update[:username] = params[:email]
        end

        if params.has_key?(:password) && !params[:password].blank?
          user_update[:password] = BCrypt::Password.create(params[:password])
        end

        if params.has_key?(:roleId)
          # users can only have one role - but data model can support more roles if necessary
          current_role = UserRole.find_by(user_id: user.id)
          if current_role[:role_id] != params[:roleId]
            UserRole.where(user_id: user.id).delete_all

            UserRole.create({
                              user_id: user.id,
                              role_id: params[:roleId]
                            })
          end
        end

        user.update(user_update)
        person.update(person_update)

        render json: {}, status: 200
      end
    rescue => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
