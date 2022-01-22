class RolesController < ApplicationController
  def index
    authorize_for(Permission::NAMES[:user_read], get_current_user_permissions)
    return if performed?

    render json: Role.all.as_json, status: 200
  end
end
