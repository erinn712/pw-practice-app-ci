import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'
import { timeout } from 'rxjs-compat/operator/timeout'

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
  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
})

test.only('testing with GitLab CI', async({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().datepickerPage()
  await pm.navigateTo().smartTablePage()
})

test.only('radio buttons', async({ page }) => {
  const pm = new PageManager(page)
  await pm.navigateTo().formLayoutsPage()
  const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid"})

  await usingTheGridForm.getByRole('radio', { name: 'Option 2'}).check({ force: true })
  expect(await usingTheGridForm.getByRole('radio', { name: 'Option 2 '}).isChecked()).toBeTruthy()
})
