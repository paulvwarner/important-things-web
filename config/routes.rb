Rails.application.routes.draw do
  root 'web_client#index'

  get '/login', to: 'web_client#index'
  get '/important-things', to: 'web_client#index'
  get '/important-things/add', to: 'web_client#index'
  get '/users', to: 'web_client#index'

  scope path: "/api" do
    post '/users/login', to: 'users#login'
    post '/users/:token/logout', to: 'users#logout'
    resources :users

    resources :important_things, :path => 'important-things'
  end
end
