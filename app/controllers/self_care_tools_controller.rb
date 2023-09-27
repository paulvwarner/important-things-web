include ApplicationHelper
include SelfCareToolsHelper

class SelfCareToolsController < ApplicationController
  class_variable_set(:@@self_care_tools_per_page, 20)

  def index
    authorize_for(Permission::NAMES[:self_care_tool_read], get_current_user_permissions)
    return if performed?

    # return self care tools list
    self_care_tools_query = SelfCareTool.where(active: true)

    # apply filters
    if params[:searchText] && params[:searchText].to_s.size > 0
      search_term = params[:searchText].to_s.downcase
      self_care_tools_query = self_care_tools_query
                                .where("lower(title) like '%" + search_term.to_s + "%'")
    end

    self_care_tools = self_care_tools_query
                        .order(:title)
                        .page(params[:page])
                        .per(@@self_care_tools_per_page)

    render json: {
      modelList: self_care_tools.as_json,
      pageCount: self_care_tools.total_pages
    }, status: 200
  end

  def index_for_app
    authorize_for(Permission::NAMES[:can_access_app], get_current_user_permissions)
    return if performed?

    # return self care tools list - for app, this returns every active one
    self_care_tools = SelfCareTool
                        .where(active: true)
                        .order(:title)

    render json: self_care_tools.as_json, status: 200
  end

  def show
    authorize_for(Permission::NAMES[:self_care_tool_read], get_current_user_permissions)
    return if performed?

    # return single self_care_tool by id
    self_care_tool = SelfCareTool
                       .find(params[:id])

    render json: self_care_tool.as_json, status: 200
  end

  def create
    begin
      authorize_for(Permission::NAMES[:self_care_tool_create], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        create_self_care_tool(params)
      end
      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def update
    begin
      authorize_for(Permission::NAMES[:self_care_tool_update], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        self_care_tool_update = {}
        self_care_tool = SelfCareTool.find(params[:id])

        if params.has_key?(:title)
          self_care_tool_update[:title] = params[:title]
        end

        if params.has_key?(:notes)
          self_care_tool_update[:notes] = params[:notes]
        end

        if params.has_key?(:active)
          self_care_tool_update[:active] = params[:active]
        end

        self_care_tool.update(self_care_tool_update)

        render json: {}, status: 200
      end
    rescue => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
