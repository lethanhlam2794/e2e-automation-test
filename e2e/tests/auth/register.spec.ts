import { test, expect } from '../../fixtures/base.fixture';
import { createRegisterFlow } from '../../flows/register/RegisterFlowFactory';

test.describe('Dang ky tai khoan @happy', () => {
  test('dang ky thanh cong voi du lieu hop le', async ({
    page,
    registerPage,
    projectConfig,
    registerData,
  }) => {
    const flow = createRegisterFlow(projectConfig, registerPage);

    await flow.execute(registerData, projectConfig);

    await expect(page.getByText('Đăng ký thành công', { exact: true })).toBeVisible({
      timeout: 15_000,
    });
  });
});
