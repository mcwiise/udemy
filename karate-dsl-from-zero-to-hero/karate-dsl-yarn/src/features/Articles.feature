Feature: Articles

Background: Define URL
  Given url 'https://conduit-api.bondaracademy.com/api'

@ignore
Scenario: Create a new article
  Given path 'users/login'
  And request {"user": {"email": "mcwiise.cap@gmail.com", "password": "germanchis1234"}}
  When method Post
  Then status 200
  * def token = response.user.token

  Given header Authorization = 'Token ' + token
  Given path 'articles'
  And request {"article": {"tagList": [],"title": "bla bla","description": "test desc","body": "body"}}
  When method Post
  Then status 201
  And match response.article.title == 'bla bla'

