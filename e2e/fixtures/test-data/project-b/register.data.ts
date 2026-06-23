import { RegisterTestData } from '../../../types/register.types';

export const happyRegisterData: RegisterTestData = {
  username: `user${Date.now()}`,
  email: `user_${Date.now()}@test.com`,
  password: 'Test@12345',
  bankAccountName: 'Nguyen Van A',

};
