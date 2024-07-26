const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')
const { createBlog } = require('./helper')

describe('Blog app', () => {
    
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Tiina Testaaja',
        username: 'tiinat',
        password: 'kesa'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Timo Testaaja',
        username: 'timo',
        password: 'kissa'
      }
    })
      await page.goto('http://localhost:5173')
      })
  
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await page.getByRole('button', { name: 'login' }).click()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'tiinat', 'kesa')
        await expect(page.getByText('Tiina Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'tiinat', 'kesa3')
        await expect(page.getByText('wrong username or password')).toBeVisible()
        await expect(page.getByText('Tiina Testaaja logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
        await loginWith(page, 'tiinat', 'kesa')
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('Koodaus4')
        await page.getByTestId('author').fill('SP')
        await page.getByTestId('url').fill('www.scalaprogramming.com')
        await page.getByRole('button', { name: 'create' }).click()
        const newBlog = page.getByText('Koodaus4 SP')
        const newBlogParent = newBlog.locator('..')
        await expect(newBlogParent.getByText('Koodaus4 SP view')).toBeVisible()
        await expect(page.getByText('blogs')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Koodaus', 'SP', 'www.koodausmaailma.com')
      const newBlog = page.getByText('Koodaus SP')
      const newBlogParent = newBlog.locator('..')
      await newBlogParent.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('like')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
    })

    test('the user who added the blog can remove it', async ({ page }) => {
      await createBlog(page, 'Koodaus', 'SP', 'www.koodausmaailma.com')
      const newBlog = page.getByText('Koodaus SP')
      const newBlogParent = newBlog.locator('..')
      await newBlogParent.getByRole('button', { name: 'view' }).click()
      await expect(newBlogParent.getByText('Koodaus SP hide')).toBeVisible()
      page.on('dialog', async dialog => await dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await page.waitForTimeout(1000)
      await expect(newBlogParent.getByText('Koodaus SP hide')).not.toBeVisible()

    })

    test('only the user who added the blog sees the remove-button', async ({ page }) => {
      await createBlog(page, 'Koodaus', 'SP', 'www.koodausmaailma.com')
      const newBlog = page.getByText('Koodaus SP')
      const newBlogParent = newBlog.locator('..')
      await newBlogParent.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).toBeVisible()
      await page.getByRole('button', { name: 'log out' }).click()
      await loginWith(page, 'timo', 'kissa')
      await newBlogParent.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('remove')).not.toBeVisible()
    })

    test('the blog with most likes comes first', async ({ page }) => {
      await createBlog(page, 'Koodaus', 'SP', 'www.koodausmaailma.com')
      await createBlog(page, 'Scala', 'SP', 'www.scalamaailma.com')
      await createBlog(page, 'Java', 'SP', 'www.javamaailma.com')

      const firstBlog = page.getByText('Koodaus SP')
      const firstBlogParent = firstBlog.locator('..')
      await firstBlogParent.getByRole('button', { name: 'view' }).click()
      await firstBlogParent.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000)
      await firstBlogParent.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000)
      await firstBlogParent.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000)

      const secondBlog = page.getByText('Scala SP')
      const secondBlogParent = secondBlog.locator('..')
      await secondBlogParent.getByRole('button', { name: 'view' }).click()
      await secondBlogParent.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000)
 
      const thirdBlog = page.getByText('Java SP')
      const thirdBlogParent = thirdBlog.locator('..')
      await thirdBlogParent.getByRole('button', { name: 'view' }).click()
      await thirdBlogParent.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000)
      await thirdBlogParent.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000)



      const allblogs = await page.locator('.expanded').all()
      await expect(allblogs[0].getByText('Koodaus SP')).toBeVisible()
      await expect(allblogs[0].getByText('likes: 3')).toBeVisible()

      await expect(allblogs[1].getByText('Java SP')).toBeVisible()
      await expect(allblogs[1].getByText('likes: 2')).toBeVisible()

      await expect(allblogs[2].getByText('Scala SP')).toBeVisible()
      await expect(allblogs[2].getByText('likes: 1')).toBeVisible()

    })
})

})