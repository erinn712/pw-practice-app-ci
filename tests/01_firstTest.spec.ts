import { test } from '@playwright/test'

// 在所有測試之前：beforeAll hook
// test.beforeAll(async({ page }) => {
// })

// 重複的動作：beforeEach hook
test.beforeEach(async({ page }) => {
    await page.goto('/') // 打開網址
    await page.getByText('Forms').click() // 找到包含Forms的元素並點擊
})

test('the first test',async ({ page }) => {
    // await page.goto('/')
    // await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click() // 找到包含Forms Layouts的元素並點擊
})

test('navigate to datepicker page',async ({ page }) => {
    // await page.goto('/')
    // await page.getByText('Forms').click()
    await page.getByText('Datepicker').click() // 找到包含Forms Layouts的元素並點擊
})