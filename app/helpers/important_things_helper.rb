require 'fcm'

module ImportantThingsHelper
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
end
