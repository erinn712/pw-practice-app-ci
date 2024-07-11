import { test as base } from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
  globalsQaURL: string,
  formLayoutPage: string,
  pageManager: PageManager
}

export const test = base.extend<TestOptions>({
  globalsQaURL: ['', { option: true }], // [default value, object option }]

  // formLayoutPage: [async({ page }, use) => {
  //   await page.goto('/')
  //   await page.getByText('Forms').click()
  //   await page.getByText('Form Layouts').click()
  //   await use('')
  // }, { auto: true }],

  formLayoutPage: async({ page }, use) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    await use('')
  },

  // 在pageManager中使用formLayoutPage
  pageManager: async({ page, formLayoutPage }, use) => {
    const pm = new PageManager(page)
    await use(pm)
  }
})