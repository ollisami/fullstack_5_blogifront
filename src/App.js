import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import  { useField } from './hooks'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)

  const username  = useField('text')
  const password  = useField('password')
  const newTitle  = useField('text')
  const newAuthor = useField('text')
  const newUrl    = useField('text')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username:username.value, password:password.value
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      username.reset()
      password.reset()

    } catch (exception) {
      setErrorMessage('käyttäjätunnus tai salasana virheellinen')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    username.reset()
    password.reset()
    setNotificationMessage('Uloskirjautuminen onnistui')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <label>
        Title:
        <input {...newTitle.props()} />
      </label>
      <br></br>
      <label>
        Author:
        <input {...newAuthor.props()}/>
      </label>
      <br></br>
      <label>
      URL
      <input {...newUrl.props()} />
      </label>
      <button type="submit">Lisää</button>
    </form>
  )

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle.value,
      author: newAuthor.value,
      url: newUrl.value,
      likes: 0,
    }

    blogService
      .create(blogObject).then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`a new blog ${newTitle.value} by ${newAuthor.value} added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        newTitle.reset()
        newAuthor.reset()
        newUrl.reset()
      })
  }

  const updateBlog = (event, blogObject) => {
    blogObject.likes = blogObject.likes + 1
    event.preventDefault()
    blogService
      .update(blogObject).then(() => {
        setNotificationMessage('blog updated')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
  }

  const removeBlog = (event, blogObject) => {
    event.preventDefault()
    blogService
      .remove(blogObject).then(() => {
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )
        setNotificationMessage('blog deleted')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
  }

  const loginInformation = () => (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={() => handleLogout()}>logout</button>
    </div>
  )

  const renderBlogs = () => (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key      = {blog.id}
            blog     = {blog}
            update   = {updateBlog}
            remove   = {removeBlog}
            username = {user.username}
          />
        )}
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} isError={true} />
      <Notification message={notificationMessage} isError={false} />
      {user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleSubmit={handleLogin}
          />
        </Togglable> :
        <div>
          {loginInformation()}
          <Togglable buttonLabel='Create new'>
            {blogForm()}
          </Togglable>
          {renderBlogs()}
        </div>
      }
    </div>
  )
}

export default App