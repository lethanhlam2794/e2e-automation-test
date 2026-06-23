import { RegisterPage } from '../../pages/RegisterPage';
import { ProjectCapabilities } from '../../types/register.types';
import { IRegisterFlow } from './IRegisterFlow';
import { StandardRegisterFlow } from './StandardRegisterFlow';
import { OtpRegisterFlow } from './OtpRegisterFlow';

/**
 * QUY TẮC: Thêm flow mới (project có luồng UI hoàn toàn khác)
 * = tạo class mới implement IRegisterFlow + thêm 1 case ở switch dưới đây.
 * KHÔNG sửa logic bên trong StandardRegisterFlow/OtpRegisterFlow cho riêng 1 project.
 */
export function createRegisterFlow(
  config: ProjectCapabilities,
  registerPage: RegisterPage
): IRegisterFlow {
  switch (config.registerFlow) {
    case 'otp':
      return new OtpRegisterFlow(registerPage);
    case 'standard':
    default:
      return new StandardRegisterFlow(registerPage);
  }
}
