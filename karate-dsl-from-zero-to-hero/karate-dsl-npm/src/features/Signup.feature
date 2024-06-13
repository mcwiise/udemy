Feature: Sign up new user

Background: Preconditions
  Given url baseApiUrl

Scenario: New user sign up
  Given def userData = {"email": "tales@mailinator.com", "username": "tales", "pass": "123"}
  Given path 'users'
  And request 
  """
    {
      "user":{
        "email": #(userData.email), 
        "username":  #(userData.username), 
        "password": #(userData.pass)
      }
    }
  """
  When method Post
  Then status 201