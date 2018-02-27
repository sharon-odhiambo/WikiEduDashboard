# frozen_string_literal: true

require "#{Rails.root}/lib/data_cycle/batch_update_logging"

# Executes all the steps of 'update_constantly' data import task
class ShortUpdate
  include BatchUpdateLogging

  def initialize
    setup_logger
    set_courses_to_update
    run_update
    return if updates_paused?

    run_update_with_pid_files(:short)
  end

  private

  def set_courses_to_update
    @courses = Course.ready_for_short_update.to_a
    log_message "Ready to update #{@courses.count} courses"
  end

  def run_update
    log_start_of_update 'Short update tasks are beginning.'
    update_course_revisions
    log_end_of_update 'Short update finished.'
  # rubocop:disable Lint/RescueException
  rescue Exception => e
    log_end_of_update 'Short update failed.'
    raise e
  end
  # rubocop:enable Lint/RescueException

  ###############
  # Data import #
  ###############

  def update_course_revisions
    log_message 'Importing revisions and articles for current editathons'
    Course.ready_for_short_update.each { |course| UpdateCourseRevisions.new(course) }
  end
end
