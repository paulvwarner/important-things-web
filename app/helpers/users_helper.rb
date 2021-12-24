module UsersHelper
  def user_full_query_includes
    [
      :person,
      {user_roles: [
        {role: [
          {role_permissions: [
            :permission
          ]},
        ]},
      ]},
    ]
  end

  def user_full_json_includes
    {
      include: [
        :person,
        {:user_roles => {:include => [
          {:role => {:include => [
            {:role_permissions => {:include => [
              :permission
            ]}},
          ]}},
        ]}},
      ],
      except: [:password],
    }
  end

  def generate_authentication_token
    authentication_token = nil
    # loop to make sure the token is unique
    loop do
      authentication_token = SecureRandom.base64(64)
      break unless User.find_by(authentication_token: authentication_token)
    end

    authentication_token
  end

end
