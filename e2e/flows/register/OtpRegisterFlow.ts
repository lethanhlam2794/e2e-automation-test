import { RegisterPage } from '../../pages/RegisterPage';
import { ProjectCapabilities, RegisterTestData } from '../../types/register.types';
import { IRegisterFlow } from './IRegisterFlow';

// Môi trường test (staging/test) thường trả OTP cố định để automation không phụ thuộc SMS thật.
// Nếu hệ thống không hỗ trợ OTP cố định, thay đoạn này bằng API/DB call lấy OTP thực tế.
const TEST_OTP_CODE = '123456';

export class OtpRegisterFlow implements IRegisterFlow {
  constructor(private registerPage: RegisterPage) {}

  async execute(data: RegisterTestData, config: ProjectCapabilities) {
    await this.registerPage.goto('/register');
    await this.registerPage.assertPhoneFieldRenderState(config.hasPhoneField);
    await this.registerPage.fillBaseForm(data);
    await this.registerPage.acceptPrivacyIfPresent();
    await this.registerPage.submit();
    await this.registerPage.submitOtp(TEST_OTP_CODE);
  }
}
