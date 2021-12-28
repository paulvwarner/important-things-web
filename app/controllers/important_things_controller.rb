include ApplicationHelper

class ImportantThingsController < ApplicationController
  def index
    authorize_for(Permission::NAMES[:important_thing_read], get_current_user_permissions)
    return if performed?

    # return important things list
    important_things = ImportantThing.all.as_json

    render json: {
      importantThingsList: important_things,
    }, status: 200
  end

  def create
    begin
      authorize_for(Permission::NAMES[:important_thing_create], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        ImportantThing.create(
          {
            message: params[:message],
            weight: params[:weight]
          }
        )
      end
      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
