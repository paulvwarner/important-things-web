Rails.application.routes.draw do
  root 'web_client#index'

  get '/login', to: 'web_client#index'
  get '/important-things', to: 'web_client#index'
  get '/important-things/add', to: 'web_client#index'
  get '/important-things/:id', to: 'web_client#index'
  get '/commitments', to: 'web_client#index'
  get '/commitments/add', to: 'web_client#index'
  get '/commitments/:id', to: 'web_client#index'
  get '/affirmations', to: 'web_client#index'
  get '/affirmations/add', to: 'web_client#index'
  get '/affirmations/:id', to: 'web_client#index'
  get '/users', to: 'web_client#index'

  scope path: "/api" do
    post '/users/login', to: 'users#login'
    post '/users/:token/logout', to: 'users#logout'
    resources :users

    post '/important-things/:id/notify-now', to: 'important_things#notify_now'
    resources :important_things, :path => 'important-things'

    resources :commitments
    resources :affirmations
  end
end
