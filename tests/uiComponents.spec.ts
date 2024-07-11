import { test,expect } from '@playwright/test'

test.beforeEach(async({ page })=> {
  await page.goto('/')
})

test.describe('Form Layout page @smoke', () => {
  test.describe.configure({ retries: 0 })
  test.beforeEach(async({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('input fields', async({ page }) => {
    const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid"}).getByRole('textbox', { name: "email"})
    await usingTheGridEmailInput.fill('test@test.com')
    await usingTheGridEmailInput.clear() // Playwright的clear()不能用鏈式連接在fill()後面
    await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 200})

    // generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue()
    expect(inputValue).toEqual('test2@test.com')

    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
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
})

test('checkboxes', async({ page }) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Toastr').click()

  await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true }) // 因為有visually-hidden所以必須使用 { force: true }
  await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true })

  const allBoxes = page.getByRole('checkbox')
  for(const box of await allBoxes.all()) {
    await box.uncheck({ force: true })
    expect(await box.isChecked()).toBeFalsy()
  }
})

test('Lists and Dropdowns', async({ page }) => {
  const dropDownMenu = page.locator('ngx-header nb-select')
  await dropDownMenu.click()

  page.getByRole('list') // when the list has a UL tag
  page.getByRole('listitem') // when the list has LI tag

  // const optionList = page.getByRole('list').locator('nb-option')
  const optionList = page.locator('nb-option-list nb-option')
  await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])

  await optionList.filter({ hasText: 'Cosmic' }).click()
  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  const colors = {
    'light': 'rgb(255, 255, 255)',
    'Dark': 'rgb(34, 43, 69)',
    'Cosmic': 'rgb(50, 50, 89)',
    'Corporate': 'rgb(255, 255, 255)'
  }

  await dropDownMenu.click()

  for(const color in colors) {
    await optionList.filter({ hasText: color }).click()
    await expect(header).toHaveCSS('background-color', colors[color])
    if(color !== 'Corporate') {
      await dropDownMenu.click()
    }
  }
})

test('tooltips', async({ page }) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Tooltip').click()

  const toolTipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' })
  await toolTipCard.getByRole('button', { name: 'Top' }).hover()

  page.getByRole('tooltip') // if you have a role tooltip created
  const tooltip = await page.locator('nb-tooltip').textContent()
  expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({ page }) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?')
    dialog.accept()
  })

  await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click()
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})


test('web tables @block', async({ page }) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  // 1. get the row by any test in this row
  // 未點選編輯前email等等資訊是div內的text，但點選編輯後，email為input的屬性
  const targetRow = page.getByRole('row', { name: 'twitter@outlook.com'}) // name 指稱 HTML text
  await targetRow.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('35')
  await page.locator('.nb-checkmark').click()

  // ID是唯一值，但ID的值有可能與年齡重複，就會抓到兩個rows(121行'：const targetRow = page.getByRole('row', { name: '11'}))
  // 2. get the row base on the value in the specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
  // page.getByRole('row', { name: '11'})會找到兩行，因此運用filter定位在名為11且index為1(第2個)的td元素
  const targetRowById = page.getByRole('row', { name: '11'}).filter({ has: page.locator('td').nth(1).getByText('11')})
  await targetRowById.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
  await page.locator('.nb-checkmark').click()
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

  // 3. test filter of the table
  const ages = ['20', '30', '40', '200']

  for(let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)

    // Playwright跑得比layout改變的速度還快，造成failed，所以加入delay
    await page.waitForTimeout(500)

    const ageRows = page.locator('tbody tr')

    for(let row of await ageRows.all()) {
      const cellValue = await row.locator('td').last().textContent()

      if(age === '200') {
        expect(await page.getByRole('table').textContent()).toContain('No data found')
      } else {
        expect(cellValue).toEqual(age)
      }
      
    }
  }

})

test('datepicker', async({ page }) => {
  await page.getByText('Forms').click()
  await page.getByText('Datepicker').click()

  const calendarInputField = page.getByPlaceholder('Form Picker')
  await calendarInputField.click()

  // getByText('1')會抓到1.10.11.12.13.14.15.....所以必須給他額外的參數 { exact: true }
  // await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', { exact: true }).click()
  // await expect(calendarInputField).toHaveValue('Jun 1, 2024')

  let date = new Date()
  date.setDate(date.getDate() + 200)
  const expectedDate = date.getDate().toString()
  const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'})
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
  const expectedYear = date.getFullYear()
  const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent() // 返回Promise< string | null >，可能返回字串或null
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

  // 當月份不等於預期的月份時，點擊右箭頭
  // 如果確信await page.locator('nb-calendar-view-mode').textContent()會返回string，則可以使用calendarMonthAndYear as string
  // 但await page.locator('nb-calendar-view-mode').textContent()若返回null則可能導致運行時錯誤
  if(calendarMonthAndYear !== null) {
    while(!(calendarMonthAndYear).includes(expectedMonthAndYear)) {
      await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
      calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
  }
  
  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
  await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({ page }) => {
  // update attribute
  // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  // await tempGauge.evaluate( node => {
  //   node.setAttribute('cx', '232.630')
  //   node.setAttribute('cy', '232.630')
  // })
  // await tempGauge.click()

  // mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
  await tempBox.scrollIntoViewIfNeeded() // 移動滑鼠至tempBox區域

  // 選擇中心點
  const box = await tempBox.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2

  // 移動滑鼠至中心點
  await page.mouse.move(x, y) // (150, 150)
  await page.mouse.down()
  await page.mouse.move(x + 100, y) // (250, 150)
  await page.mouse.move(x + 100, y + 100) // (250, 250)
  await page.mouse.up()
  await expect(tempBox).toContainText('30')
})