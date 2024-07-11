import { test } from '@playwright/test'

test.beforeEach(async({ page }) => {
    await page.goto('/') // 打開網址
    await page.getByText('Forms').click() // 找到包含Forms的元素並點擊
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({ page }) => {
    // locator不是promise，但click是，因此要注意是否為promise

    // by Tag name
    await page.locator('input').first().click()

    // by ID 
    page.locator('#inputEmail1')

    // by Class value
    page.locator('.shape-rectangle')

    // by attribute
    page.locator('[placeholder="Email"]')

    // by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle')
    page.locator('input[placeholder="Email"][nbinput]')

    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({ page }) => {
    await page.getByRole('textbox', { name: "Email"}).first().click()
    await page.getByRole('button', { name: "Sign in" }).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Dashboard').click()
})