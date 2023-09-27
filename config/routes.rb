Rails.application.routes.draw do
  root 'web_client#index'

  get '/login', to: 'web_client#index'
  get '/insights', to: 'web_client#index'
  get '/insights/add', to: 'web_client#index'
  get '/insights/:id', to: 'web_client#index'
  get '/self-care-tools', to: 'web_client#index'
  get '/self-care-tools/add', to: 'web_client#index'
  get '/self-care-tools/:id', to: 'web_client#index'
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

    post '/insights/:id/notify-now', to: 'insights#notify_now'
    get '/insights/for-app', to: 'insights#index_for_app'
    resources :insights

    get '/self-care-tools/for-app', to: 'self_care_tools#index_for_app'
    resources :self_care_tools, :path => 'self-care-tools'

    get '/affirmations/for-app', to: 'affirmations#index_for_app'
    resources :affirmations

    get '/notification-config', to: 'notification_configs#show'
    put '/notification-config', to: 'notification_configs#update'
  end
end
