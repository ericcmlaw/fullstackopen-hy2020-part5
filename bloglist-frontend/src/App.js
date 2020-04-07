// 5.1 5.2 5.3 5.4 5.5 5.6 5.7 5.8 5.9 5.10 5.11 5.12 5.13 5.14 5.15 5.17 5.18 5.19 5.20 5.21 5.22

import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import SubmitForm from './components/SubmitForm'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  const blogFormRef = React.createRef()

  const compareLikes = (a, b) => {
    if (a.likes < b.likes) {
      return 1
    }
    if (a.likes > b.likes) {
      return -1
    }
    return 0
  }

  useEffect(async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs.sort(compareLikes))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (message, messageType) => {
    setMessage(message)
    setMessageType(messageType)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const showErrorMessage = (message) => showMessage(message, 'error')

  const showSuccessMessage = (message) => showMessage(message, 'success')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      showErrorMessage('wrong username or password')
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.setItem('loggedBlogAppUser', '')
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)

      showSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)

      setBlogs(blogs.concat(newBlog))

    } catch (exception) {
      showErrorMessage('error adding new blog')
    }
  }

  const submitForm = () => (
    <div>
      <h2>create new</h2>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <SubmitForm
          addBlog={addBlog}
        />
      </Togglable>
    </div>
  )


  const updateBlog = async (blog) => {
    const newBlog = {
      ...blog, likes: blog.likes + 1
    }
    delete newBlog.id
    delete newBlog.user

    const updatedBlog = await blogService.update(blog.id, newBlog)

    const newBlogs = blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    setBlogs(newBlogs)
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}`)) {
      await blogService.deleteOne(blog.id)
      const newBlogs = blogs.filter((b) => (b.id !== blog.id))
      setBlogs(newBlogs)
    }
  }

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={ user && user.username === blog.user.username ? deleteBlog : null} />
      )}
    </div>
  )


  return (
    <>
      <Notification message={message} messageType={messageType} />
      {
        (user === null)
          ? loginForm()
          : <>
            <p>{user.name} logged in <button onClick={logout} >log out</button></p>
            {submitForm()}

          </>
      }
      {blogForm()}
    </>
  )


}

export default App