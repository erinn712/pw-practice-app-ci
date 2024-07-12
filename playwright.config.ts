import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';


require('dotenv').config();

export default defineConfig<TestOptions>({
  timeout: 40000,
  globalTimeout: 60000,
  expect: {
    timeout: 2000
  },

  retries:  1,
  reporter: [
    ['json', { outputFile: 'test-results/jsonReport.json' }],
    ['junit', { outputFile: 'test-results/junitReport.xml' }],
    // ['allure-playwright'],
    ['html']
  ],
  
  // use裡的任何設置，都可單獨加入project的use裡，加進去後會覆蓋掉上面的設置
  use: {
    globalsQaURL:'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: 'http://localhost:4200/',
    // baseURL: process.env.DEV === '1' ? 'http://localhost:4201/' 
    //   : process.env.STAGING === '1' ? 'http://localhost:4202/'
    //   : 'http://localhost:4200/',

    trace: 'on-first-retry',
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },

  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/',
      },
    },
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        video: {
          mode: 'on',
          size: { width: 1920, height: 1080 }
        }
      },
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: {
          width: 1920, height: 1080
        }
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13'],
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    reuseExistingServer: true // port: 4200被占用
  }
});
