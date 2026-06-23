import { LoginPage } from '../../pages/LoginPage';
import { LoginFormData, ProjectLoginCapabilities } from '../../types/login.type';
import { ILoginFlow } from './ILoginFlow';

export class StandardLoginFlow implements ILoginFlow {
  constructor(private loginPage: LoginPage) {}

  async execute(data: LoginFormData, config: ProjectLoginCapabilities) {
    await this.loginPage.goto(config.baseURL);
    await this.loginPage.fillForm(data);
    await this.loginPage.submit();
  }
}