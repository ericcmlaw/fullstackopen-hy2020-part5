import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const buttonLabel = (visible) ? 'hide' : 'view'
  const showWhenVisible = { display: visible ? 'block' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      <div className='overview'>
        {`${blog.title} ${blog.author} `}
        <button className='toggleBtn' onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div className='detail' style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button className='likeBtn' onClick={() => updateBlog(blog)}>like</button></div>
        <div>{(blog.user) ? blog.user.name : ''}</div>
        { (deleteBlog) ? <div>  <button className='deleteBtn' onClick={() => deleteBlog(blog)}>delete</button></div> : null }
      </div>
    </div>
  )
}

export default Blog
