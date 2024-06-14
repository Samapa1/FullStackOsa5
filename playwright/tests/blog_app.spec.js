const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
        })
    
    test('Login form is shown', async ({ page }) => {
        
        await page.goto('http://localhost:5173')
        await page.getByRole('button', { name: 'login' }).click()
  })
})


describe('Login', () => {

    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Tiina Testaaja',
            username: 'tiinat',
            password: 'kesa'
          }
        })
    
        await page.goto('http://localhost:5173')
      })
      
        
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByRole('textbox').first().fill('tiinat')
        await page.getByRole('textbox').last().fill('kesa')
        await page.getByRole('button', { name: 'login' }).click()
      
        await expect(page.getByText('Tiina Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByRole('textbox').first().fill('tiinat')
        await page.getByRole('textbox').last().fill('kesa3')
        await page.getByRole('button', { name: 'login' }).click()


        // const errorDiv = await page.locator('.messagestyle error')
        // await expect(errorDiv).toContainText('wrong username or password')
        await expect(page.getByText('wrong username or password')).toBeVisible()
        await expect(page.getByText('Tiina Testaaja logged in')).not.toBeVisible()
    })
  })

describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Tiina Testaaja',
            username: 'tiinat',
            password: 'kesa'
          }
        })
    
        await page.goto('http://localhost:5173')
        await page.getByRole('textbox').first().fill('tiinat')
        await page.getByRole('textbox').last().fill('kesa')
        await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('Scala')
        await page.getByTestId('author').fill('SP')
        await page.getByTestId('url').fill('www.scalaprogramming.com')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText('Scala SP')).toBeVisible()
    })
})