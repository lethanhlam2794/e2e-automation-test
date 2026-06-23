import { ProjectCapabilities } from '../types/register.types';

/**
 * QUY TẮC: Thêm project mới = thêm 1 object vào mảng này.
 * KHÔNG được sửa logic trong pages/ hoặc flows/ để "if tên project == ...".
 * Mọi rẽ nhánh phải dựa vào các field boolean/enum khai báo ở đây.
 */
export const projectConfigs: ProjectCapabilities[] = [
  {
    name: 'project-a',
    baseURL: process.env.PROJECT_A_URL || 'https://greenify.greensoftware.asia',
    hasPhoneField: true,
    requiresOtp: false,
    registerFlow: 'standard',
  },
  {
    name: 'project-b',
    baseURL: process.env.PROJECT_B_URL || 'https://project-b.example.com',
    hasPhoneField: false,
    requiresOtp: true,
    registerFlow: 'otp',
  },
];

export function getProjectConfig(name: string): ProjectCapabilities {
  const config = projectConfigs.find((p) => p.name === name);
  if (!config) {
    throw new Error(
      `[projectConfig] Không tìm thấy cấu hình cho project "${name}". ` +
        `Kiểm tra lại utils/projectConfig.ts hoặc tên --project khi chạy lệnh.`
    );
  }
  return config;
}
