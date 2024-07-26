import { render, screen } from '@testing-library/react'
import Newblogform from './Newblogform'
import userEvent from '@testing-library/user-event'

test('blogform functions correctly when new blog is created', async () => {

  const user = userEvent.setup()
  const mockHandler = vi.fn()

  const { container } = render(<Newblogform createBlog={mockHandler} />)

  const title = container.querySelector('#title-input')
  const author = container.querySelector('#author-input')
  const url = container.querySelector('#url-input')

  const button = screen.getByText('create')

  await user.type(title, 'testing the form')
  await user.type(author, 'Tester')
  await user.type(url, 'www.testingforms.com')

  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('testing the form')
  expect(mockHandler.mock.calls[0][0].author).toBe('Tester')
  expect(mockHandler.mock.calls[0][0].url).toBe('www.testingforms.com')

  screen.debug()


})