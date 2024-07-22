import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {

  // 缺點：如果有2-30個locator，較難閱讀
  // 保留locator在method中是較恰當的方式，debug時較方便
  // readonly formLayoutsMenuItem: Locator
  // readonly datepickerMenuItem: Locator
  // readonly smartTableMenuItem: Locator
  // readonly toastrMenuItem: Locator
  // readonly tooltipMenuItem: Locator

  constructor(page: Page) {
    // this.page = page
    // 修改為
    super(page)

    // this.formLayoutsMenuItem = page.getByText('Form Layouts')
    // this.datepickerMenuItem = page.getByText('Datepicker')
    // this.smartTableMenuItem = page.getByText('Smart Table')
    // this.toastrMenuItem = page.getByText('Toastr')
    // this.tooltipMenuItem = page.getByText('Tooltip')
  }

  async formLayoutsPage() {
    // await this.page.getByText('Forms').click()
    await this.selectGroupMenuItem('Forms')

    // 保留locator在method中是較恰當的方式，debug時較方便
    await this.page.getByText('Form Layouts').click()
    // await this.formLayoutsMenuItem.click()
  }

  async datepickerPage() {
    // await this.page.getByText('Forms').click() 把展開的選單關掉了
    // await this.page.waitForTimeout(1000) 如果加上這行，未判斷選單是否展開，運行時會出錯，因為playwright運作很快速，所以在關閉前就點擊了
    await this.selectGroupMenuItem('Forms')
    await this.page.getByText('Datepicker').click()
  }

  async smartTablePage() {
    // await this.page.getByText('Tables & Data').click()
    await this.selectGroupMenuItem('Tables & Data')
    await this.page.getByText('Smart Table').click()
  }

  async toastrPage() {
    // await this.page.getByText('Modal & Overlays').click()
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.getByText('Toastr').click()
  }

  async tooltipPage() {
    // await this.page.getByText('Modal & Overlays').click()
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.getByText('Tooltip').click()
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle)
    const expendedState = await groupMenuItem.getAttribute('aria-expanded')

    if(expendedState === "false") {
      await groupMenuItem.click()
    }
  }
}