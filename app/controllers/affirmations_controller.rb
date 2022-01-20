include ApplicationHelper
include AffirmationsHelper

@@affirmations_per_page = 20

class AffirmationsController < ApplicationController

  def index
    authorize_for(Permission::NAMES[:affirmation_read], get_current_user_permissions)
    return if performed?

    # return affirmations list
    affirmations_query = Affirmation.where(active: true)

    # apply filters
    if params[:searchText] && params[:searchText].to_s.size > 0
      search_term = params[:searchText].to_s.downcase
      affirmations_query = affirmations_query
                             .where("lower(message) like '%" + search_term.to_s + "%'")
    end

    affirmations = affirmations_query
                     .order(:message)
                     .page(params[:page])
                     .per(@@affirmations_per_page)

    render json: {
      modelList: affirmations.as_json,
      pageCount: affirmations.total_pages
    }, status: 200
  end

  def show
    authorize_for(Permission::NAMES[:affirmation_read], get_current_user_permissions)
    return if performed?

    # return single affirmation by id
    affirmation = Affirmation
                    .find(params[:id])

    render json: affirmation.as_json, status: 200
  end

  def create
    begin
      authorize_for(Permission::NAMES[:affirmation_create], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        create_affirmation(params)
      end
      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def update
    begin
      authorize_for(Permission::NAMES[:affirmation_update], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        affirmation_update = {}
        affirmation = Affirmation.find(params[:id])

        if params.has_key?(:message)
          affirmation_update[:message] = params[:message]
        end

        if params.has_key?(:notes)
          affirmation_update[:notes] = params[:notes]
        end

        if params.has_key?(:active)
          affirmation_update[:active] = params[:active]
        end

        affirmation.update(affirmation_update)

        render json: {}, status: 200
      end
    rescue => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
