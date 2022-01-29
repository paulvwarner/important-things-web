require 'fcm'

module ImportantThingsHelper
  def send_random_it_notification
    Rails.logger.debug "starting send_random_it_notification"
    important_things_json = ImportantThing.where(active: true).as_json
    random_select_array = []
    important_things_json.each do |important_thing_json|
      weight = important_thing_json['weight']
      (1..weight).each do
        random_select_array.push(important_thing_json['id'])
      end
    end

    Rails.logger.debug "send_random_it_notification - random select array " + random_select_array.to_yaml

    random_select_index = rand(0..(random_select_array.size - 1))

    Rails.logger.debug "send_random_it_notification - index selected: " + random_select_index.to_s

    important_thing = ImportantThing.find(random_select_array[random_select_index])

    Rails.logger.debug "send_random_it_notification for: " + important_thing.to_yaml

    send_notification_for(important_thing)
  end

  def schedule_next_notification_job
    Rails.logger.debug "start schedule_next_notification_job"
    notification_config = NotificationConfig.first

    # randomize and log when next notification will happen
    min_minutes = notification_config[:min_notify_interval_hours] * 60
    max_minutes = notification_config[:max_notify_interval_hours] * 60
    wait_mins = rand(min_minutes..max_minutes)

    Rails.logger.info "Scheduling next important thing notification in " +
                        (wait_mins / 60).to_s + " hours " +
                        (wait_mins % 60).to_s + " minutes."

    ImportantThingNotificationJob.set(wait: wait_mins.minute).perform_later(notification_config[:active_job_key])
  end

  def send_notification_for(important_thing)
    fcm = FCM.new(
      'AAAAHQDVQCw:APA91bGaPNPRz0-lxPAvidhI2-65rLJ8_lE7dvHT4Vwr61ByjiWtxqPCDhYULpzBXU4H5aH8gxLTDovaepjXYGJOWhOPcWfxkzENp26LndReBdhueXNNcEkRrWyjQmrJ6It69RgoHSRn',
      File.join(Rails.root, 'config', 'importantthingsmobile-firebase-adminsdk-a312w-2ff251740e.json'),
      'importantthingsmobile'
    )

    fcm.send_v1(
      {
        topic: "importantthings",
        notification: {
          body: important_thing[:message],
        },
      }
    )
  end

  def create_important_thing(important_thing_attrs)
    ImportantThing.create(
      {
        message: important_thing_attrs[:message],
        notes: important_thing_attrs[:notes],
        weight: important_thing_attrs[:weight]
      }
    )
  end
end
