import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

let blog
let component
let overview
let detail
let toggleBtn
let mockHandler
let likeBtn

beforeEach(() => {
  blog = {
    'likes': 1337,
    'url': 'http://www.google.com',
    'author': 'Author McAuthorface',
    'title': 'How to write a good title',
    'user': {
      'username': 'root',
      'name': 'Administrator',
      'id': '5e831d6b3565bd2ad64f4f5c'
    },
    'id': '5e8339941a21d541d5dda7bd'
  }

  mockHandler = jest.fn()
  component = render(<Blog blog={blog} updateBlog={mockHandler} />)

  overview = component.container.querySelector('.overview')
  detail = component.container.querySelector('.detail')

  toggleBtn = component.container.querySelector('.toggleBtn')
  likeBtn = component.container.querySelector('.likeBtn')

})

test('renders the blog title and author not url nor likes', () => {
  expect(overview).toHaveStyle('display: block')
  expect(detail).toHaveStyle('display: none')
})

test('button controlling the shown details has been clicked', () => {
  fireEvent.click(toggleBtn)

  expect(detail).toHaveStyle('display: block')
})


test('like button is clicked twice', () => {

  fireEvent.click(likeBtn)

  fireEvent.click(likeBtn)

  expect(mockHandler.mock.calls).toHaveLength(2)
})