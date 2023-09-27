require 'fcm'

module InsightsHelper
  def send_random_it_notification
    Rails.logger.debug "starting send_random_it_notification"
    insights_json = Insight.where(active: true).as_json
    random_select_array = []
    insights_json.each do |insight_json|
      weight = insight_json['weight']
      (1..weight).each do
        random_select_array.push(insight_json['id'])
      end
    end

    Rails.logger.debug "send_random_it_notification - random select array " + random_select_array.to_yaml

    random_select_index = rand(0..(random_select_array.size - 1))

    Rails.logger.debug "send_random_it_notification - index selected: " + random_select_index.to_s

    insight = Insight.find(random_select_array[random_select_index])

    Rails.logger.debug "send_random_it_notification for: " + insight.to_yaml

    send_notification_for(insight)
  end

  def schedule_next_notification_job
    Rails.logger.debug "start schedule_next_notification_job"
    notification_config = NotificationConfig.first

    # randomize and log when next notification will happen
    min_minutes = notification_config[:min_notify_interval_hours] * 60
    max_minutes = notification_config[:max_notify_interval_hours] * 60
    wait_mins = rand(min_minutes..max_minutes)

    Rails.logger.info "Scheduling next insight notification in " +
                        (wait_mins / 60).to_s + " hours " +
                        (wait_mins % 60).to_s + " minutes."

    InsightNotificationJob.set(wait: wait_mins.minute).perform_later(notification_config[:active_job_key])
  end

  def send_notification_for(insight)
    fcm = FCM.new(
      Rails.application.credentials.fcm_server_key,
      File.join(Rails.root, 'config', 'importantthingsmobile-firebase-adminsdk-317b9ace552d.json'),
      'importantthingsmobile'
    )

    fcm.send_v1(
      {
        topic: "importantthings",
        notification: {
          body: insight[:message].to_s,
        },
      }
    )
  end

  def create_insight(insight_attrs)
    Insight.create(
      {
        message: insight_attrs[:message],
        notes: insight_attrs[:notes],
        weight: insight_attrs[:weight]
      }
    )
  end
end
