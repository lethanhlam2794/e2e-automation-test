import { LoginFormData } from '../types/login.type';
import { getJwtFromBrowser } from '../utils/authToken';
import { BasePage } from './BasePage';
export class LoginPage extends BasePage {
  private usernameInput = this.page.locator('input[name="username"]');
  private emailInput = this.page.locator('input[name="email"]');
  private passwordInput = this.page.locator('input[name="password"]');
  private submitButton = this.page.locator('button[type="submit"]');

  async fillForm(data: LoginFormData) {
    if (data.username) {
      await this.usernameInput.fill(data.username);
    }

    if (data.email) {
      await this.emailInput.fill(data.email);
    }

    await this.passwordInput.fill(data.password);
  }

  async submit() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

  async getSessionToken() {
    return getJwtFromBrowser(this.page);
  }
}
