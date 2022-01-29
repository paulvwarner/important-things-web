class ImportantThingNotificationJob < ApplicationJob
  queue_as :default

  include SuckerPunch::Job

  def perform(*args)
    puts 'PVW perform job'
  end

  after_perform do |job|
    puts 'PVW after_perform'
    # pvw todo invoke job again later
    # self.class.set(:wait => 10.minutes).perform_later(job.arguments.first)
  end
end
