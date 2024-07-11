import {test, expect} from "@playwright/test" 

test('input fields', async({ page }, testInfo) => {

  await page.goto('/', {waitUntil: 'domcontentloaded'})

  if(testInfo.project.name == 'mobile') { // 只有在mobile裝置時才點擊toggle
    await page.locator('.sidebar-toggle').click()
  }
  
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()

  if(testInfo.project.name == 'mobile') {
    await page.locator('.sidebar-toggle').click()
  }
  

  const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid"}).getByRole('textbox', { name: "email"})
  await usingTheGridEmailInput.fill('test@test.com')
  await usingTheGridEmailInput.clear() // Playwright的clear()不能用鏈式連接在fill()後面
  await usingTheGridEmailInput.pressSequentially('test2@test.com')

})