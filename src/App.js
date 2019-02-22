import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
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

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          käyttäjätunnus
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          salasana
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">kirjaudu</button>
      </form>
    </div>  
  )

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

  const loginInformation = () => (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={() => handleLogout()}>logout</button>
    </div>
  )

  const renderBlogs = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}}
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} isError={true} />
      <Notification message={notificationMessage} isError={false} />
      {user === null ? 
        loginForm() : 
        <div>
          {loginInformation()}
          {blogForm()}
          {renderBlogs()}
        </div>
      }
    </div>
  )
}

export default App