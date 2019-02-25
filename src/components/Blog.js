import React, { useState } from 'react'

const Blog = ({ blog, update, remove, username }) => {
  const [showInfo, setShowInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleShowInfo = () => {
    setShowInfo(!showInfo)
  }

  const renderUser = (blog) => {
    if (blog.user) {
      return (
        <p>added by {blog.user.name}</p>
      )
    }
    return null
  }

  const renderRemoveButton = (remove, blog, username) => {
    if (blog.user && username === blog.user.username) {
      return <button onClick={(e) => remove(e,blog)}>Remove</button>
    }
    return null
  }

  const renderInfo = (blog,update, remove) => (
    <div>
      <p>{blog.url}</p>
      <p>
        {blog.likes} likes
        <button onClick={(e) => update(e,blog)}>like</button>
      </p>
      {renderUser(blog)}
      {renderRemoveButton(remove,blog,username)}
    </div>
  )

  return (
    <div style={blogStyle}>
      <div className='togglableContent' onClick={toggleShowInfo}>
        {blog.title} {blog.author}
        {showInfo && renderInfo(blog,update,remove,username)}
      </div>
    </div>
  )
}

export default Blog