include ApplicationHelper
include InsightsHelper
include NotificationConfigsHelper

class ImportantThingNotificationJob < ApplicationJob
  queue_as :default

  include SuckerPunch::Job

  def perform(active_job_key)
    should_continue_job = check_should_continue_job(active_job_key, 'perform job')

    if should_continue_job
      send_random_it_notification
    end
  end

  after_perform do |job|
    active_job_key = job.arguments.first
    should_continue_job = check_should_continue_job(active_job_key, 'schedule next job')
    if should_continue_job
      schedule_next_notification_job
    end
  end
end
