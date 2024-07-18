import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'

test.beforeEach(async({ page })=> {
  await page.goto('/') // config file裡的baseURL
})

test('navigate to form page @smoke @regression', async({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().datepickerPage()
  await pm.navigateTo().smartTablePage()
  await pm.navigateTo().formLayoutsPage()
  await pm.navigateTo().toastrPage()
  await pm.navigateTo().tooltipPage()
})

// CI demo
test.only('parametrized methods', async({ page }) => {
  const pm = new PageManager(page)
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`

  await pm.navigateTo().formLayoutsPage()
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
  // await page.screenshot({ path: 'screenshots/formLayoutsPage.png'})
  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
  // await page.locator('nb-card', { hasText: 'Inline form'}).screenshot({ path: 'screenshots/inlineForm.png' })

  // await pm.navigateTo().datepickerPage()

  // // 選擇第一個小日曆的日期
  // await pm.onDatepickerPage().selectCommonDatePickerDateFormToday(10)

  // // 選擇第二個小日曆區間
  // await pm.onDatepickerPage().selectDatePickerWithRangeFormToday(2, 3)

})

// CI demo
test.only('testing with GitLab CI', async({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().datepickerPage()
  await pm.navigateTo().smartTablePage()
})

test.only('radio buttons', async({ page }) => {
  const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid"})

  // await usingTheGridForm.getByLabel('Option 1').check({ force: true })
  await usingTheGridForm.getByRole('radio', { name: 'Option 2'}).check({ force: true })
  const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 1'}).isChecked() // return boolean
  await expect(usingTheGridForm).toHaveScreenshot({ maxDiffPixels:  250})

  // expect(radioStatus).toBeTruthy()
  // await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1'})).toBeChecked()
  
  // await usingTheGridForm.getByRole('radio', { name: 'Option 2'}).check({ force: true })
  // expect(await usingTheGridForm.getByRole('radio', { name: 'Option 1 '}).isChecked()).toBeFalsy()
  // expect(await usingTheGridForm.getByRole('radio', { name: 'Option 2 '}).isChecked()).toBeTruthy()
})
