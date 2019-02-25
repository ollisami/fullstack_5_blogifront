import React from 'react'
import 'jest-dom/extend-expect'
import { render, fireEvent } from 'react-testing-library'
import { prettyDOM } from 'dom-testing-library'
import SimpleBlog from './SimpleBlog'

test('SimpleBlog renders content', () => {
  const blog = {
    title: 'testTitle',
    author: 'testAuthor',
    likes: 1
  }

  const mockHandler = jest.fn()

  const component = render(
    <SimpleBlog blog={blog} onClick={mockHandler}/>
  )
  
  expect(component.container).toHaveTextContent(
    'testTitle'
  )

  expect(component.container).toHaveTextContent(
    'testAuthor'
  )

  expect(component.container).toHaveTextContent(
    'blog has 1 likes'
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)
  expect(mockHandler.mock.calls.length).toBe(2)
})
