import React from 'react'
import { 
  render, waitForElement 
} from 'react-testing-library'
jest.mock('./services/blogs')
import App from './App'

describe('<App />', () => {
  it('if no user logged, blogs are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('kirjaudu')
    )

    expect(component.container).toHaveTextContent(
        'login'
    )

    expect(component.container).not.toHaveTextContent(
        'logged in'
    )

    expect(component.container).not.toHaveTextContent(
        'Title:'
    )
  })
  it('if logged, blogs are rendered', async () => {
    const user = {
        username: 'tester',
        token: '1231231214',
        name: 'Teuvo Testaaja'
    }  
    
    localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    const component = render(
        <App />
    )
    component.rerender(<App />)

    await waitForElement(
        () => component.getByText('Teuvo Testaaja logged in')
      )

    expect(component.container).toHaveTextContent(
        'Title:'
    )
  })
})