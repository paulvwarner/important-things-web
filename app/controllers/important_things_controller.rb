include ApplicationHelper
include ImportantThingsHelper

class ImportantThingsController < ApplicationController
  @important_things_per_page = 20

  def index
    authorize_for(Permission::NAMES[:important_thing_read], get_current_user_permissions)
    return if performed?

    # return important things list
    important_things_query = ImportantThing.all

    # apply filters
    if params[:searchText] && params[:searchText].to_s.size > 0
      search_term = params[:searchText].to_s.downcase
      important_things_query = important_things_query
                                 .where("lower(message) like '%" + search_term + "%'")
    end

    important_things = important_things_query
                         .page(params[:page])
                         .per(@important_things_per_page)

    render json: {
      importantThingsList: important_things.as_json,
      pageCount: important_things.total_pages
    }, status: 200
  end

  def show
    authorize_for(Permission::NAMES[:important_thing_read], get_current_user_permissions)
    return if performed?

    # return single important thing by id
    important_thing = ImportantThing
                        .find(params[:id])

    render json: important_thing.as_json, status: 200
  end

  def create
    begin
      authorize_for(Permission::NAMES[:important_thing_create], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        ImportantThing.create(
          {
            message: params[:message],
            notes: params[:notes],
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

  def update
    begin
      authorize_for(Permission::NAMES[:important_thing_update], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        important_thing_update = {}
        important_thing = ImportantThing.find(params[:id])

        if params.has_key?(:message)
          important_thing_update[:message] = params[:message]
        end

        if params.has_key?(:notes)
          important_thing_update[:notes] = params[:notes]
        end

        if params.has_key?(:weight)
          important_thing_update[:weight] = params[:weight]
        end

        important_thing.update(important_thing_update)

        render json: {}, status: 200
      end
    rescue => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def notify_now
    begin
      authorize_for(Permission::NAMES[:important_thing_read], get_current_user_permissions)
      return if performed?

      important_thing = ImportantThing.find(params[:id])
      send_notification_for(important_thing)

      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
