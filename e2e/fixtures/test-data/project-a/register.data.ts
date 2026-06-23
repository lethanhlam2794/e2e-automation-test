import { ProjectARegisterFormData } from '../../../types/register.types';

export const happyRegisterData: ProjectARegisterFormData = {
  username: `user${Date.now()}`,
  email: `user_${Date.now()}@test.com`,
  password: 'Test@12345',
  confirmPassword: 'Test@12345',
  bankAccountName: 'NGUYEN VAN A',
  phoneNumber: '0901234567',
  address: '123 Nguyen Trai',
  referrerCode: '',
};
