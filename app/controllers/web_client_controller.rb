class WebClientController < ApplicationController
  skip_before_action :authenticate, only: [:index]

  def index
    render 'web_client/index'
  end
end