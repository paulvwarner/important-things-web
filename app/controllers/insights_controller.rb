include ApplicationHelper
include InsightsHelper

class InsightsController < ApplicationController
  class_variable_set(:@@insights_per_page, 20)

  def index
    authorize_for(Permission::NAMES[:insight_read], get_current_user_permissions)
    return if performed?

    # return insights list
    insights_query = Insight.where(active: true)

    # apply filters
    if params[:searchText] && params[:searchText].to_s.size > 0
      search_term = params[:searchText].to_s.downcase
      insights_query = insights_query
                                 .where("lower(message) like '%" + search_term.to_s + "%'")
    end

    insights = insights_query
                         .order(:message)
                         .page(params[:page])
                         .per(@@insights_per_page)

    render json: {
      modelList: insights.as_json,
      pageCount: insights.total_pages
    }, status: 200
  end

  def index_for_app
    authorize_for(Permission::NAMES[:can_access_app], get_current_user_permissions)
    return if performed?

    # return insights list - for app, this returns every active one
    insights = Insight
                         .where(active: true)
                         .order(:message)

    render json: insights.as_json, status: 200
  end

  def show
    authorize_for(Permission::NAMES[:insight_read], get_current_user_permissions)
    return if performed?

    # return single insight by id
    insight = Insight
                        .find(params[:id])

    render json: insight.as_json, status: 200
  end

  def create
    begin
      authorize_for(Permission::NAMES[:insight_create], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        create_insight(params)
      end
      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def update
    begin
      authorize_for(Permission::NAMES[:insight_update], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        insight_update = {}
        insight = Insight.find(params[:id])

        if params.has_key?(:message)
          insight_update[:message] = params[:message]
        end

        if params.has_key?(:notes)
          insight_update[:notes] = params[:notes]
        end

        if params.has_key?(:weight)
          insight_update[:weight] = params[:weight]
        end

        if params.has_key?(:active)
          insight_update[:active] = params[:active]
        end

        insight.update(insight_update)

        render json: {}, status: 200
      end
    rescue => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def notify_now
    begin
      authorize_for(Permission::NAMES[:insight_read], get_current_user_permissions)
      return if performed?

      insight = Insight.find(params[:id])
      send_notification_for(insight)

      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
