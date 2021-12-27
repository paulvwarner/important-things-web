include ApplicationHelper

class ImportantThingsController < ApplicationController
  def index
    authorize_for(Permission::NAMES[:can_access_web_admin], get_current_user_permissions)
    return if performed?

    # return important things list
    important_things = ImportantThing.all.as_json

    render json: {
      importantThingsList: important_things,
    }, status: 200
  end
end
