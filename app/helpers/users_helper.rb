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
        {:person => {:methods => [
          :name
        ]}},
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

  def user_list_query_includes
    [
      :person,
      {user_roles: [
        :role
      ]},
    ]
  end

  def user_list_json_includes
    {
      include: [
        {:person => {:methods => [
          :name
        ]}},
        {:user_roles => {:include => [
          :role
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

  def create_user(user_attrs)
    user = User.create(
      {
        username: user_attrs[:email],
        password: BCrypt::Password.create(user_attrs[:new_password]),
        person_id: Person.create(
          {
            email: user_attrs[:email],
            first_name: user_attrs[:firstName],
            last_name: user_attrs[:lastName]}
        ).id,
        authentication_token: generate_authentication_token
      }
    )

    role = Role.find(user_attrs[:roleId])

    UserRole.create(
      [
        {
          user_id: user.id,
          role_id: role.id
        }
      ]
    )

    user
  end
end
