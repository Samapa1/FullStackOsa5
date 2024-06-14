import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Newblogform from './components/Newblogform'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const [notification, setNewNotification] = useState({ data:null, type:'info' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(sortBlogs))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    handleNotification({ data: 'logged out', type:'info' })
  }

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const data = await blogService.create(blogObject)
      setBlogs(blogs.concat(data).sort(sortBlogs))
      handleNotification({ data: `${data.title} by ${data.author} added`, type:'info' })
    }
    catch (exception) {
      handleNotification({ data: 'adding of the blog failed', type:'error' })
    }
  }

  const likeBlog = async(blogObject) => {
    const data = await blogService.update(blogObject)
    setBlogs((blogs.map(blog => {
      if (blog.id === data.id) {
        return { ...blog, likes: data.likes }
      }
      else {
        return blog
      }
    }).sort(sortBlogs)))
  }

  const removeBlog = async(id) => {
    if (window.confirm(`Remove blog ${blogs.find(blog => blog.id ===id).title} by ${blogs.find(blog => blog.id ===id).author}`)) {
      const removedBlog = await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      handleNotification({ data: 'Blog deleted!', type:'info' })
    }}


  const sortBlogs = (a, b) => {
    return b.likes - a.likes
  }

  const handleNotification =(notification) => {
    setNewNotification(notification)
    setTimeout(() => {
      setNewNotification({ data:null, type:'info' })
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      handleNotification({ data: 'login ok!', type:'info' })
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleNotification({ data: 'wrong username or password', type:'error' })
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              data-testid='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <div>
        <p>{user.name} logged in <button onClick= {logOut}>log out</button></p>
      </div>
      <div>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <Newblogform createBlog={createBlog}/>
        </Togglable>
        <br></br>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} likeBlog={likeBlog} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App