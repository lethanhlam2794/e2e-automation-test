import { Page } from '@playwright/test';

/**
 * QUY TẮC: BasePage và mọi Page Object con CHỈ chứa action/getter,
 * KHÔNG chứa expect()/assertion. Assertion luôn nằm trong file *.spec.ts.
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: 'networkidle' });
  }

  async waitForToast(text: string) {
    await this.page.getByText(text).waitFor({ state: 'visible' });
  }
}
