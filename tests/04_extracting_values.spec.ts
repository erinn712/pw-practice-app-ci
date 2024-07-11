import { test, expect } from '@playwright/test'

test.beforeEach(async({ page }) => {
    await page.goto('/') // 打開網址
    await page.getByText('Forms').click() // 找到包含Forms的元素並點擊
    await page.getByText('Form Layouts').click()
})

test('extracting values', async({ page }) => {
    // single test value
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form'})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // all test value
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents() // 回傳array: ["Option 1", "Option 2", "Disabled Option"]
    expect(allRadioButtonsLabels).toContain('Option 1')

    // input value
    // 無法直接拿到值，所以必須使用inputValue
    const emailField = basicForm.getByRole('textbox', { name: 'Email'})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    // 取屬性的值
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('assertions', async({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: 'Basic Form'}).locator('button')

    // General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')
    
    // Locator assertions
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertions 略過fail
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()
})