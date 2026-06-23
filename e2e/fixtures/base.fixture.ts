import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { getProjectConfig } from '../utils/projectConfig';
import { loadRegisterData } from '../utils/loadTestData';
import { ProjectCapabilities, RegisterTestData } from '../types/register.types';

type Fixtures = {
  registerPage: RegisterPage;
  projectConfig: ProjectCapabilities;
  registerData: RegisterTestData;
};

export const test = base.extend<Fixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  // testInfo.project.name = tên project đang chạy (khớp với playwright.config.ts)
  projectConfig: async ({}, use, testInfo) => {
    await use(getProjectConfig(testInfo.project.name));
  },

  registerData: async ({}, use, testInfo) => {
    const data = loadRegisterData(testInfo.project.name);
    await use(data);
  },
});

export { expect } from '@playwright/test';
