import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'Testing the application',
    author: 'Tester',
    url: 'www.testworld.com',
    likes: 0,
    user: { username: 'testaaja', name:'Testaaja' }
  }

  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const div1 = container.querySelector('.notexpanded')
  expect(div1).not.toHaveStyle('display: none')

  const div2 = container.querySelector('.expanded')
  expect(div2).toHaveStyle('display: none')

  screen.debug()
})

test('when the button is clicked also url, likes and user are shown', async () => {
  const blog = {
    title: 'Testing the application',
    author: 'Tester',
    url: 'www.testworld.com',
    likes: 0,
    user: { username: 'testaaja', name:'Testaaja' }
  }

  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div1 = container.querySelector('.notexpanded')
  expect(div1).toHaveStyle('display: none')

  const div2 = container.querySelector('.expanded')
  expect(div2).not.toHaveStyle('display: none')

  screen.debug()

})

test('clicking like button calls event handler function twice', async () => {
  const blog = {
    title: 'Testing the like button',
    author: 'Tester',
    url: 'www.testworld.com',
    likes: 0,
    user: { username: 'testaaja', name:'Testaaja' }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={blog.user} likeBlog={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

  screen.debug()


})

