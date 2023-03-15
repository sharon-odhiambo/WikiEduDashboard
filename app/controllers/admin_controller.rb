# frozen_string_literal: true

# Controller admin panel
class AdminController < ApplicationController
  def index
    check_user_auth
  end

  private

  def check_user_auth
    return if current_user&.admin?
    flash[:notice] = t('dashboard.flash_notice')
    redirect_to root_path
  end
end
