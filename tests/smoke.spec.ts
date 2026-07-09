import { test, expect } from '@playwright/test'

/**
 * Smoke tests for the Catnip and Cattitude site.
 *
 * The pages are a faithful clone of the live site's design + content, served
 * as Next.js routes. These tests confirm the static export renders each route
 * and the core visitor information (who we are, where we are, how to help).
 */

const ROUTES = [
  '/',
  '/who-we-are',
  '/adoptions',
  '/fosters',
  '/supporters',
  '/donate-and-wishlist',
  '/contact',
]

test.describe('Home page', () => {
  test('renders the organization name', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Catnip and Cattitude/i)
    await expect(page.getByText(/Welcome to Catnip and Cattitude/i).first()).toBeVisible()
  })

  test('shows the mailing address and phone number', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/P\.?O\.? Box 2140/i).first()).toBeVisible()
    await expect(page.getByText(/Willows, CA/i).first()).toBeVisible()
    await expect(page.locator('a[href="tel:5303305433"]').first()).toBeVisible()
  })

  test('links to the Facebook page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href*="facebook.com/CatnipCattitude"]').first()).toBeVisible()
  })
})

test.describe('Navigation routes', () => {
  for (const path of ROUTES) {
    test(`renders ${path} with the site nav`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status()).toBeLessThan(400)
      await expect(page).toHaveTitle(/Catnip and Cattitude/i)
      // The cloned design renders (logo banner is on every page) and the shared
      // nav links to every route. Use toBeAttached — the responsive nav keeps
      // hidden mobile/desktop copies, so a specific copy may not be "visible".
      await expect(page.getByText(/Welcome to Catnip and Cattitude/i).first()).toBeVisible()
      await expect(page.locator('a[href="/adoptions"]').first()).toBeAttached()
    })
  }
})
