import { useState } from 'react'
import PropTypes from 'prop-types'

const Newblogform = ({ createBlog }) => {

  const [author, setNewAuthor] = useState('')
  const [title, setNewTitle] = useState('')
  const [url, setNewUrl] = useState('')

  const clearData = () => {
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')

  }

  const addBlogToDB = (event) => {
    event.preventDefault()
    createBlog({
      author: author,
      title: title,
      url: url,
    })

    clearData()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlogToDB}>
        <div>
    title
          <input
            data-testid='title'
            type="text"
            value={title}
            name="title"
            onChange= {({ target }) => setNewTitle(target.value)}
            id='title-input'
          />
        </div>
        <div>
    author
          <input
            data-testid='author'
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setNewAuthor(target.value)}
            id='author-input'
          />
        </div>
        <div>
    url
          <input
            data-testid='url'
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setNewUrl(target.value)}
            id='url-input'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

Newblogform.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default Newblogform