import { test, expect } from '@playwright/test'

test.beforeEach(async({ page }) => {
    await page.goto('/') // 打開網址
    await page.getByText('Forms').click() // 找到包含Forms的元素並點擊
    await page.getByText('Form Layouts').click()
})

test('locating child element', async({ page }) => {
    // 定位：nb-card底下的nb-radio，文字為Option 1的元素
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    // 找到第一個符合條件的元素
    // 此處的locator('nb-card')並非必須，用getByRole即可找到，寫上去只是展示依據巢狀結構尋找元素的用法
    // regular locator及user facing locator可混合使用
    await page.locator('nb-card').getByRole('button', { name: 'Sign In' }).first().click()

    // index of the element
    // 第4個nb-card，只有一個button可以不給name
    // 避免使用，因為順序可能改變
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent element', async({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid'}).getByRole('textbox', { name: "Email"}).click()
    await page.locator('nb-card', { has: page.locator('#inputEmail')}).getByRole('textbox', { name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', { name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', { name: "Password"}).click()

    // 鏈式連接層層過濾
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', { name: "Email"}).click()

    // 唯一在Playwright運用XPath的情況
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: "Email"}).click()
})

test('Reusing the locators', async({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic Form' })
    const emailField = basicForm.getByRole('textbox', { name: 'Email' })

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', { name: 'Password' }).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')

})

test('extracting values', async({ page }) => {
    // single test value
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form'})
    const buttonText = await basicForm.locator('button').textContent()  // 返回值
    expect(buttonText).toEqual('Submit')
})