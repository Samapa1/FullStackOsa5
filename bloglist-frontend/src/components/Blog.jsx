import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateBlog = () => {
    likeBlog({
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blog.likes +1,
      id: blog.id
    })

  }

  const [details, setDetails] = useState(false)
  const hideWhenDetails = { display: details ? 'none' : '' }
  const showWhenDetails = { display: details ? '' : 'none' }

  // const style1 = { ...hideWhenDetails, ...blogStyle }

  // const showMore = () => {
  //   setDetails(true)
  // }

  return(
    <div>
      <div style={{ ...hideWhenDetails, ...blogStyle }} className="notexpanded">
        <p>{blog.title} {blog.author} <button onClick={() => setDetails(true)}>view</button></p>
      </div>
      <div style={{ ...showWhenDetails, ...blogStyle }} className="expanded">
        <p>{blog.title} {blog.author}<button onClick={() => setDetails(false)}>hide</button></p>
        <p>{blog.url}</p>
        <p>likes: {blog.likes} <button onClick={() => {updateBlog()}}>like</button></p>
        <p>{blog.user.name}</p>
        {blog.user.name === user.name ? <p><button onClick={() => {removeBlog(blog.id)}}>remove</button></p> : null}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog