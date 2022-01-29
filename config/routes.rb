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
  get '/users/add', to: 'web_client#index'
  get '/users/:id', to: 'web_client#index'

  scope path: "/api" do
    post '/users/login', to: 'users#login'
    post '/users/:token/logout', to: 'users#logout'
    get '/users/is-person-email-available/:email',
        to: 'users#is_person_email_available',
        :constraints => {:email => /[^\/]+/}
    resources :users
    resources :roles

    post '/important-things/:id/notify-now', to: 'important_things#notify_now'
    get '/important-things/for-app', to: 'important_things#index_for_app'
    resources :important_things, :path => 'important-things'

    get '/commitments/for-app', to: 'commitments#index_for_app'
    resources :commitments

    get '/affirmations/for-app', to: 'affirmations#index_for_app'
    resources :affirmations

    get '/notification-config', to:'notification_configs#show'
    put '/notification-config', to:'notification_configs#update'
  end
end
