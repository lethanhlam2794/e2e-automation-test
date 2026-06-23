import { RegisterTestData } from '../types/register.types';
import { happyRegisterData as projectARegisterData } from '../fixtures/test-data/project-a/register.data';
import { happyRegisterData as projectBRegisterData } from '../fixtures/test-data/project-b/register.data';

/**
 * Static import map thay vì dynamic import(`...${projectName}...`).
 * Đánh đổi: thêm project mới phải thêm 1 dòng import + 1 entry ở map dưới,
 * nhưng đổi lại có type safety đầy đủ, IDE autocomplete, và không phụ thuộc
 * cách bundler/test-runner resolve dynamic import bằng template string.
 */
const registerDataMap: Record<string, RegisterTestData> = {
  'project-a': projectARegisterData,
  'project-b': projectBRegisterData,
};

export function loadRegisterData(projectName: string): RegisterTestData {
  const data = registerDataMap[projectName];
  if (!data) {
    throw new Error(
      `[loadTestData] Không tìm thấy register data cho project "${projectName}". ` +
        `Thêm import + entry vào registerDataMap trong utils/loadTestData.ts.`
    );
  }
  return data;
}
