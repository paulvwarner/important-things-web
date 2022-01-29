require 'fcm'

module ImportantThingsHelper
  def schedule_next_notification
    notification_config = NotificationConfig.first

    # randomize and log when next notification will happen
    min_minutes = notification_config[:min_notify_interval_hours] * 60
    max_minutes = notification_config[:max_notify_interval_hours] * 60
    notification_wait_mins = rand(min_minutes..max_minutes)

    Rails.logger.info "Starting important things notifications - next notification in " +
                        (notification_wait_mins / 60).to_s + " hours " +
                        (notification_wait_mins % 60).to_s + " minutes."

    ImportantThingNotificationJob.set(wait: notification_wait_mins.minute).perform_later
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
