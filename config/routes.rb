Rails.application.routes.draw do
  root 'web_client#index'

  get '/login', to: 'web_client#index'
  get '/important-things', to: 'web_client#index'

  scope path: "/api" do
    post '/users/login', to: 'users#login'
  end
end
