describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function () {
    cy.contains('login').click()
    cy.contains('username')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('sfdsf')
      cy.get('#password').type('fdsfdf')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('hello world')
      cy.get('#url').type('http://www.google.com')
      cy.get('#submit').click()

      cy.contains('a blog created by cypress')
    })
    // todo: 5.20
    it('user can like a blog', function () {
      cy.createBlog({
        title: 'Blazing Fast Delightful Testing',
        author: 'Rick Hanlon',
        url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience'
      })
      cy.get('.blog')
        .get('.toggleBtn').click()
        .get('.detail').contains('likes 0')
        .get('.detail').get('.likeBtn').click()
        .get('.detail').contains('likes 1')
    })

    it('user who created a blog can delete it', function () {
      cy.createBlog({
        title: 'Blazing Fast Delightful Testing',
        author: 'Rick Hanlon',
        url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience'
      })
      cy.get('.blog')
        .get('.toggleBtn').click()
        .get('.detail').get('.deleteBtn').click()
      cy.get('html').should('not.contain', 'Blazing Fast Delightful Testing')
    })

    it('blogs are ordered according to likes', function () {
      cy.createBlog({
        title: 'hgfhfghgg',
        author: 'Rick Hanlon',
        url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
        likes: 323
      })

      cy.createBlog({
        title: 'gdfgdfg Fast hfghfg Testing',
        author: 'Rick Hanlon',
        url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
        likes: 123
      })
      cy.createBlog({
        title: 'dfsdfdsfg',
        author: 'Rick Hanlon',
        url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
        likes: 626
      })
      cy.get('.blog:first').contains('dfsdfdsfg')
      cy.get('.blog:last').contains('gdfgdfg Fast hfghfg Testing')
    })
  })

})