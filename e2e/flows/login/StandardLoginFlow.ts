import { LoginPage } from '../../pages/LoginPage';
import { LoginFormData, LoginSession, ProjectLoginCapabilities } from '../../types/login.type';
import { URL_LINKS } from '../../constants/constants';
import { ILoginFlow } from './ILoginFlow';

export class StandardLoginFlow implements ILoginFlow {
  constructor(private loginPage: LoginPage) {}

  async execute(data: LoginFormData, _config: ProjectLoginCapabilities): Promise<LoginSession> {
    await this.loginPage.goto(URL_LINKS.LOGIN);
    await this.loginPage.fillForm(data);
    await this.loginPage.submit();

    const token = await this.loginPage.getSessionToken();
    return {
      jwt: token.jwt,
      bearer: token.bearer,
      tokenSource: token.source,
      tokenKey: token.key,
    };
  }
}
