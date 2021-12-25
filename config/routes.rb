Rails.application.routes.draw do
  root 'web_client#index'

  get '/login', to: 'web_client#index'
  get '/important-things', to: 'web_client#index'

  scope path: "/api" do
    post '/users/login', to: 'users#login'
    resources :users

    resources :important_things, :path => '/important-things'
  end
end
