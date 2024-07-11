import { Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class DatepickerPage extends HelperBase {

  constructor(page: Page) {
    super(page)
  }

  async selectCommonDatePickerDateFormToday(numberOfDaysFormToday: number) {
    // 選擇Placeholder為Form Picker的input
    const calendarInputField = this.page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFormToday)
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }

  async selectDatePickerWithRangeFormToday(startDay: number, endDay: number) {
    // 選擇Placeholder為Datepicker With Range內的input
    const calendarInputField = this.page.getByPlaceholder('Range Picker')
    await calendarInputField.click()
    const dateToAssertStart = await this.selectDateInTheCalendar(startDay)
    const dateToAssertEnd = await this.selectDateInTheCalendar(endDay)
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }

  // 選擇日曆內的日期
  private async selectDateInTheCalendar(numberOfDaysFormToday: number) {
    let date = new Date()
    date.setDate(date.getDate() + numberOfDaysFormToday)
    const expectedDate = date.getDate().toString()
    const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent() // 返回Promise< string | null >，可能返回字串或null
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

    if(calendarMonthAndYear !== null) {
      while(!(calendarMonthAndYear).includes(expectedMonthAndYear)) {
        await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
      }
    }

    const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')
    const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
    if(await dayCell.first().isVisible()) {
      await dayCell.getByText(expectedDate, { exact: true }).click()
    } else {
      await rangeCell.getByText(expectedDate, { exact: true }).click()
    }
    return dateToAssert
  }
}