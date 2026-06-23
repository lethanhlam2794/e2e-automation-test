import { RegisterPage } from '../../pages/RegisterPage';
import { ProjectCapabilities, RegisterTestData } from '../../types/register.types';
import { IRegisterFlow } from './IRegisterFlow';
import { URL_LINKS } from '../../constants/constants';

export class StandardRegisterFlow implements IRegisterFlow {
  constructor(private registerPage: RegisterPage) {}

  async execute(data: RegisterTestData, config: ProjectCapabilities) {
    await this.registerPage.goto(URL_LINKS.REGISTER);
    // Verify UI khớp với capability khai báo, phát hiện sớm nếu FE đổi form ngoài ý muốn
    await this.registerPage.assertPhoneFieldRenderState(config.hasPhoneField);
    await this.registerPage.fillBaseForm(data);
    await this.registerPage.fillPhoneIfPresent(data);
    await this.registerPage.acceptPrivacyIfPresent();
    await this.registerPage.submit();
  }
}
