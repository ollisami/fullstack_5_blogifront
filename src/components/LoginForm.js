import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          käyttäjätunnus
          <input
            type     = {username.type}
            value    = {username.value}
            name     = "Username"
            onChange = {username.onChange}
          />
        </div>
        <div>
          salasana
          <input
            type     = {password.type}
            value    = {password.value}
            name     = "Password"
            onChange = {password.onChange}
          />
        </div>
        <button type="submit">kirjaudu</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default LoginForm