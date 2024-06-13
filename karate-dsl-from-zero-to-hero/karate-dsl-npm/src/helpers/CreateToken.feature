Feature: Create Token

Background: Define URL
  Given url baseApiUrl

Scenario: Create Token
  Given path 'users/login'
  And request {"user": {"email": "#(userEmail)", "password": "#(userPassword)"}}
  When method Post
  Then status 200
  * def authzToken = response.user.token