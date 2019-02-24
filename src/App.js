import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
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
    setUsername('')
    setPassword('')
    setNotificationMessage('Uloskirjautuminen onnistui')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <label>
        Title:
        <input
          type="text"
          value={newTitle}
          onChange={handleTitleChange}
        />
      </label>
      <br></br>
      <label>
        Author:
        <input
          type="text"
          value={newAuthor}
          onChange={handleAuthorChange}
        />
      </label>
      <br></br>
      <label>
      URL
        <input
          type="text"
          value={newUrl}
          onChange={handleUrlChange}
        />
      </label>
      <button type="submit">Lisää</button>
    </form>
  )

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
    }

    blogService
      .create(blogObject).then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`a new blog ${newTitle} by ${newAuthor} added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
  }

  const updateBlog = (event, blogObject) => {
    blogObject.likes = blogObject.likes + 1
    event.preventDefault()
    blogService
      .update(blogObject).then(returnedBlog => {
        setNotificationMessage(`blog updated`)
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
        setNotificationMessage(`blog deleted`)
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
          key={blog.id}
          blog={blog}
          update={updateBlog}
          remove={removeBlog}
          username={user.username}
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
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
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