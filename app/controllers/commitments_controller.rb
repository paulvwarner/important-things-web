include ApplicationHelper
include CommitmentsHelper

class CommitmentsController < ApplicationController
  class_variable_set(:@@commitments_per_page, 20)

  def index
    authorize_for(Permission::NAMES[:commitment_read], get_current_user_permissions)
    return if performed?

    # return commitments list
    commitments_query = Commitment.where(active: true)

    # apply filters
    if params[:searchText] && params[:searchText].to_s.size > 0
      search_term = params[:searchText].to_s.downcase
      commitments_query = commitments_query
                            .where("lower(title) like '%" + search_term.to_s + "%'")
    end

    commitments = commitments_query
                    .order(:title)
                    .page(params[:page])
                    .per(@@commitments_per_page)

    render json: {
      modelList: commitments.as_json,
      pageCount: commitments.total_pages
    }, status: 200
  end

  def index_for_app
    authorize_for(Permission::NAMES[:can_access_app], get_current_user_permissions)
    return if performed?

    # return commitments list - for app, this returns every active one
    commitments = Commitment
                         .where(active: true)
                         .order(:title)

    render json: commitments.as_json, status: 200
  end

  def show
    authorize_for(Permission::NAMES[:commitment_read], get_current_user_permissions)
    return if performed?

    # return single commitment by id
    commitment = Commitment
                   .find(params[:id])

    render json: commitment.as_json, status: 200
  end

  def create
    begin
      authorize_for(Permission::NAMES[:commitment_create], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        create_commitment(params)
      end
      render json: {}, status: 200
    rescue Exception => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end

  def update
    begin
      authorize_for(Permission::NAMES[:commitment_update], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        commitment_update = {}
        commitment = Commitment.find(params[:id])

        if params.has_key?(:title)
          commitment_update[:title] = params[:title]
        end

        if params.has_key?(:notes)
          commitment_update[:notes] = params[:notes]
        end

        if params.has_key?(:active)
          commitment_update[:active] = params[:active]
        end

        commitment.update(commitment_update)

        render json: {}, status: 200
      end
    rescue => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
