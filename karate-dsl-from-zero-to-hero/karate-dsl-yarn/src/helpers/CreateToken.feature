Feature: Create Token

Background: Define URL
  Given url 'https://conduit-api.bondaracademy.com/api'

Scenario: Create Token
  Given path 'users/login'
  And request {"user": {"email": "mcwiise.cap@gmail.com", "password": "germanchis1234"}}
  When method Post
  Then status 200
  * def authzToken = response.user.token