import { defineConfig } from '@playwright/test';
import 'dotenv/config';
import { projectConfigs } from './e2e/utils/projectConfig';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  // Sinh project Playwright trực tiếp từ bảng cấu hình trung tâm.
  // Thêm project mới chỉ cần sửa utils/projectConfig.ts, KHÔNG sửa file này.
  projects: projectConfigs.map((cfg) => ({
    name: cfg.name,
    use: { baseURL: cfg.baseURL },
  })),
});
