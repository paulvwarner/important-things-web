module NotificationConfigsHelper
  def check_should_continue_job(active_job_key, task_description)
    notification_config = NotificationConfig.first
    notifications_enabled = notification_config[:notifications_enabled]
    active_job_keys_match = active_job_key == notification_config[:active_job_key]

    verdict = notifications_enabled && active_job_keys_match ?
                'should ' + task_description :
                'should not ' + task_description

    notifications_status = 'notifications ' + (notifications_enabled ? 'enabled' : 'disabled')
    match_status = 'active job keys ' + (active_job_keys_match ? 'match' : 'do not match')
    Rails.logger.debug verdict + ' - ' + notifications_status + ' - ' + match_status + '.'

    notifications_enabled && active_job_keys_match
  end
end
