Feature: Articles

Background: Define URL
  Given url baseApiUrl
  * def tokenResponse = call read('../helpers/CreateToken.feature')
  * def authzToken = tokenResponse.authzToken

@ignore
Scenario: Create a new article
  Given header Authorization = 'Token ' + authzToken
  Given path 'articles'
  And request {"article": {"tagList": [],"title": "bla bla","description": "test desc","body": "body"}}
  When method Post
  Then status 201
  And match response.article.title == 'bla bla'

Scenario: Create and Delete article
  Given header Authorization = 'Token ' + authzToken
  Given path 'articles'
  And request {"article": {"tagList": [],"title": "germanchis","description": "test desc","body": "body"}}
  When method Post
  Then status 201
  And match response.article.title == 'germanchis'
  * def articleId = response.article.slug

  Given params {limit: 10, offset: 0}
  Given header Authorization = 'Token ' + authzToken
  Given path 'articles'
  When method Get
  Then status 200
  And match response.articles[0].title == 'germanchis'

  Given header Authorization = 'Token ' + authzToken
  Given path 'articles',articleId
  When method Delete
  Then status 204

  Given params {limit: 10, offset: 0}
  Given header Authorization = 'Token ' + authzToken
  Given path 'articles'
  When method Get
  Then status 200
  And match response.articles[0].title != 'germanchis'
