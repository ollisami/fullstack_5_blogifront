import React from 'react'
import 'jest-dom/extend-expect'
import { render, fireEvent } from 'react-testing-library'
import { prettyDOM } from 'dom-testing-library'
import Blog from './Blog'

test('Blog renders content', () => {
  const blog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 1
  }

  const updateMockHandler = jest.fn()
  const removeMockHandler = jest.fn()
  const mockUsername = 'testUsername'

  const component = render(
    <Blog blog={blog} update={updateMockHandler} remove={removeMockHandler} username={mockUsername}/>
  )
  
  expect(component.container).toHaveTextContent(
    'testTitle'
  )

  expect(component.container).toHaveTextContent(
    'testAuthor'
  )

  expect(component.container).not.toHaveTextContent(
    'testUrl'
  )

  expect(component.container).not.toHaveTextContent(
    '1 likes'
  )

  const button = component.container.querySelector('.togglableContent')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'testUrl'
  )

  expect(component.container).toHaveTextContent(
    '1 likes'
  )

  fireEvent.click(button)
  expect(component.container).not.toHaveTextContent(
    'testUrl'
  )

  expect(component.container).not.toHaveTextContent(
    '1 likes'
  )
  //console.log(prettyDOM(component))
})