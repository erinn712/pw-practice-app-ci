import { test, expect } from '@playwright/test'

test.beforeEach(async({ page }, testInfo) => {
    await page.goto(process.env.URL) // 打開網址
    await page.getByText('Button Triggering AJAX Request').click() // 按下按鈕
    testInfo.setTimeout(testInfo.timeout + 2000) // 加2秒timeout
})

test('auto waiting 1', async({ page }) => {
    // 按下按鈕後會於15秒後出現.bg-success的元素
    const successButton = page.locator('.bg-success')
    await successButton.click()
})

test('auto waiting 2', async({ page }) => {
    // 按下按鈕後獲取"Data loaded with AJAX get request."的文字
    const successButton = page.locator('.bg-success')
    const text = await successButton.textContent()
    expect(text).toEqual('Data loaded with AJAX get request.')
})

test('auto waiting 3', async({ page }) => {
    // textContent改成使用allTextContents() => fail，allTextContent不會auto waiting
    const successButton = page.locator('.bg-success')
    // 手動加上waiting
    await successButton.waitFor({ state: "attached" })
    const text = await successButton.allTextContents()
    // toEqual比對array，改成toContain比對字串
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('auto waiting 4', async({ page }) => {
    const successButton = page.locator('.bg-success')
    // 斷言的預設timeout是5秒 => fail，因此補上{ timeout: 20000 }設定
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })
})

test.skip('alternative waits', async({ page }) => {
    const successButton = page.locator('.bg-success')

    //___wait for element
    // await page.waitForSelector('.bg-success')

    //___wait for particular response
    // URL來源：Network裡的RequestURL
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //___wait for network calls to be completed ('NOT RECOMMENDED')
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()

    expect(text).toContain('Data loaded with AJAX get request.')


})

// Global timeout -> Test timeout(default: 30000ms) -> Action timeout / Navigation timeout / Expect timeout(default: 5000ms)

test.skip('timeout', async({ page }) => {
    // test.setTimeout(10000)
    test.slow() // triple the default timeout，config設置timeout: 10000，最後的timeout是10*3=30秒
    const successButton = page.locator('.bg-success')
    await successButton.click()

})