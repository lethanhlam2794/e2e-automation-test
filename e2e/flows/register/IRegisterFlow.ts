import { ProjectCapabilities, RegisterTestData } from '../../types/register.types';

export interface IRegisterFlow {
  execute(data: RegisterTestData, config: ProjectCapabilities): Promise<void>;
}
