# frozen_string_literal: true

#= Preview all emails at http://localhost:3000/rails/mailers/alert_mailer
class AlertMailerPreview < ActionMailer::Preview
  def articles_for_deletion_alert
    AlertMailer.alert(example_alert(type: 'ArticlesForDeletionAlert'), example_user)
  end

  def productive_course_alert
    AlertMailer.alert(example_alert(type: 'ProductiveCourseAlert'), example_user)
  end

  def continued_course_activity_alert
    AlertMailer.alert(example_alert(type: 'ContinuedCourseActivityAlert'), example_user)
  end

  def need_help_alert
    AlertMailer.alert(Alert.where(type: 'NeedHelpAlert').last, example_user)
  end

  def over_enrollment_alert
    AlertMailer.alert(example_over_enrollment_alert, example_user)
  end

  def generic_alert
    AlertMailer.alert(example_alert, example_user)
  end

  def de_userfying_alert
    AlertMailer.alert(example_de_userfying_alert, example_user)
  end

  private

  def example_user
    User.new(email: 'sage@example.com', username: 'Ragesoss', permissions: 1)
  end

  def example_student
    User.new(email: 'nospam@nospam.com', username: 'nospam', permissions: 0)
  end

  def example_course
    Course.new(title: "Apostrophe's Folly", slug: "School/Apostrophe's_Folly_(Spring_2019)",
               expected_students: 5, user_count: 11)
  end

  def example_article
    Article.new(title: "King's_Gambit", wiki: Wiki.first, namespace: 0)
  end

  def example_over_enrollment_alert
    Alert.new(type: 'OverEnrollmentAlert', course: example_course, id: 9)
  end

  def example_alert(type: 'HighQualityArticleEditAlert')
    Alert.new(type: type, article: example_article,
              course: example_course, id: 9)
  end

  def example_de_userfying_alert
    Alert.new(type: 'DeUserfyingAlert', article: example_article,
              course: Course.last, id: 9, user: example_student,
              details: { logid: 125126035, timestamp: '2021-12-16T08:10:56Z' })
  end
end
