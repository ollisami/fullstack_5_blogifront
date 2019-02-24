import React from 'react'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  if(isError) {
    return (
      <div className="error">
        ERROR: {message}
      </div>
    )
  }

  return (
    <div className="notification">
      MSG: {message}
    </div>
  )
}

export default Notification