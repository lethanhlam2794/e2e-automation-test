import { LoginFormData, LoginSession, ProjectLoginCapabilities } from '../../types/login.type';

export interface ILoginFlow {
  execute(data: LoginFormData, config: ProjectLoginCapabilities): Promise<LoginSession>;
}
