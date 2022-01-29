include ApplicationHelper
include ImportantThingsHelper

class NotificationConfigsController < ApplicationController
  def show
    authorize_for(Permission::NAMES[:notification_config_read], get_current_user_permissions)
    return if performed?

    render json: NotificationConfig.first.as_json, status: 200
  end

  def update
    begin
      authorize_for(Permission::NAMES[:notification_config_update], get_current_user_permissions)
      return if performed?

      ActiveRecord::Base.transaction do
        notification_config_update = {}
        notification_config = NotificationConfig.first

        start_notifications = false

        if params.has_key?(:notifications_enabled)
          notification_config_update[:notifications_enabled] = params[:notifications_enabled]
          if notification_config[:notifications_enabled] == false && params[:notifications_enabled] == true
            start_notifications = true
          elsif notification_config[:notifications_enabled] == true && params[:notifications_enabled] == false
            notification_config_update[:active_job_key] = ''
          end
        end

        if params.has_key?(:min_notify_interval_hours)
          notification_config_update[:min_notify_interval_hours] = params[:min_notify_interval_hours]
        end

        if params.has_key?(:max_notify_interval_hours)
          notification_config_update[:max_notify_interval_hours] = params[:max_notify_interval_hours]
        end

        if start_notifications
          notification_config_update[:active_job_key] = SecureRandom.base64(24)
        end

        notification_config.update(notification_config_update)

        if start_notifications
          schedule_next_notification_job
        end

        render json: {}, status: 200
      end
    rescue => e
      Rails.logger.info "Error occurred: " + e.to_yaml
      render json: {message: e.message}, status: 500
    end
  end
end
