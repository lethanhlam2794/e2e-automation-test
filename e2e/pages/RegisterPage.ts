import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegisterTestData } from '../types/register.types';

export class RegisterPage extends BasePage {
  private usernameInput = this.page.locator('input[name="username"]');
  private emailInput = this.page.locator('input[name="email"]');
  private passwordInput = this.page.locator('input[name="password"]');
  private confirmPasswordInput = this.page.locator('input[name="confirmPassword"]');
  private bankAccountNameInput = this.page.locator('input[name="bankAccountName"]');
  private phoneInput = this.page.locator('input[name="phoneNumber"]');
  private addressInput = this.page.locator('input[name="address"]');
  private referrerCodeInput = this.page.locator('input[name="referrerCode"]');
  private privacyCheckbox = this.page.locator('#privacy');
  private submitButton = this.page.locator('button[type="submit"]');
  private otpInput = this.page.locator('input[name="otp"]');
  private otpSubmitButton = this.page.locator('button[type="submit"]');

  constructor(page: Page) {
    super(page);
  }

  async fillBaseForm(data: RegisterTestData) {
    if (data.username) {
      await this.usernameInput.fill(data.username);
    }

    if (data.email) {
      await this.emailInput.fill(data.email);
    }

    await this.passwordInput.fill(data.password);

    if ('confirmPassword' in data && data.confirmPassword) {
      await this.confirmPasswordInput.fill(data.confirmPassword);
    }

    if ('bankAccountName' in data && data.bankAccountName) {
      await this.bankAccountNameInput.fill(data.bankAccountName);
    }

    if ('address' in data && data.address) {
      await this.addressInput.fill(data.address);
    }

    if (data.referrerCode) {
      await this.referrerCodeInput.fill(data.referrerCode);
    }
  }

  async fillPhoneIfPresent(data: RegisterTestData & { phoneNumber?: string }) {
    if ('phoneNumber' in data && data.phoneNumber) {
      await this.phoneInput.fill(data.phoneNumber);
    }
  }

  async acceptPrivacyIfPresent() {
    if ((await this.privacyCheckbox.count()) > 0) {
      await this.privacyCheckbox.click();
    }
  }

  async assertPhoneFieldRenderState(expectedVisible: boolean) {
    if (expectedVisible) {
      await expect(this.phoneInput).toBeVisible();
    } else {
      await expect(this.phoneInput).toHaveCount(0);
    }
  }

  async submit() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async submitOtp(code: string) {
    await this.otpInput.fill(code);
    await this.otpSubmitButton.click();
  }
}
