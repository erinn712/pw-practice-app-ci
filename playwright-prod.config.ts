import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';


require('dotenv').config();

export default defineConfig<TestOptions>({

  // use裡的任何設置，都可單獨加入project的use裡，加進去後會覆蓋掉上面的設置
  use: {
    globalsQaURL:'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL:'http://localhost:4200/',
  },

  projects: [
    {
      name: 'chromium',
    },
  ],
});
