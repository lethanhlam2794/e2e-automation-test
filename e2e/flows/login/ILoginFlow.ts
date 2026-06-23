import { LoginFormData, ProjectLoginCapabilities } from '../../types/login.type';

export interface ILoginFlow {
  execute(data: LoginFormData, config: ProjectLoginCapabilities): Promise<void>;
}