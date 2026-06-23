# RULES.md — Quy tắc viết Automation E2E (Playwright, multi-project)

Tài liệu này là chuẩn bắt buộc khi viết/maintain test trong repo. Mọi PR vi phạm các mục có đánh dấu **[BẮT BUỘC]** sẽ bị reject khi review.

---

## 1. Cấu trúc thư mục & quy ước đặt tên

```
tests/<domain>/<feature>.spec.ts        # ví dụ: tests/auth/register.spec.ts
pages/<Feature>Page.ts                  # PascalCase, hậu tố "Page"
flows/<Variant><Feature>Flow.ts         # ví dụ: OtpRegisterFlow.ts
fixtures/test-data/<project-name>/<feature>.data.ts
types/<feature>.types.ts
utils/<tên-chức-năng>.ts
```

- **[BẮT BUỘC]** Tên project trong `utils/projectConfig.ts` phải khớp 100% với tên thư mục trong `fixtures/test-data/<project-name>/`.
- Tên file spec = tên feature, không thêm "test", "spec" thừa: `register.spec.ts`, không phải `registerTest.spec.ts`.
- 1 file spec tương ứng 1 feature/màn hình, không gộp nhiều feature không liên quan vào 1 file.

## 2. Quy tắc Locator

- **[BẮT BUỘC]** Thứ tự ưu tiên locator:
  1. `getByTestId()` — yêu cầu FE gắn `data-testid`
  2. `getByRole()` (khi không thể thêm testid, ví dụ thư viện UI bên thứ 3)
  3. `getByText()` / `getByLabel()` — chỉ dùng cho assertion, hạn chế dùng để thao tác
- **CẤM** dùng CSS class (`.btn-primary`) hoặc XPath — dễ vỡ khi FE đổi style/cấu trúc DOM.
- Quy ước đặt tên `data-testid`: `<feature>-<element>-<type>`
  Ví dụ: `register-email-input`, `register-submit-button`, `register-otp-input`.
  → Phải thống nhất với FE dev trước khi viết test, để 1 testid dùng được cho mọi project (kể cả project có/không có field đó).

## 3. Quy tắc Page Object (POM)

- **[BẮT BUỘC]** Method **action** trong POM (`fill*`, `click*`, `submit*`) không được chứa `expect()`.
- **[BẮT BUỘC]** Method **assert*/verify*** thì NGƯỢC LẠI — được phép và nên có trong POM, vì locator là `private`, chỉ POM mới biết cách trỏ tới nó. Quy tắc là tách rõ 2 loại method bằng tên (`fillPhoneIfPresent` vs `assertPhoneFieldRenderState`), không phải cấm hoàn toàn assertion trong POM. Spec/Flow chủ động gọi method `assert*` khi cần kiểm tra UI, không để nó tự chạy ngầm bên trong 1 action method khác.
- **[BẮT BUỘC]** Với field optional theo project (vd: `phone?`), ngoài việc fill có điều kiện, PHẢI có thêm bước verify field render đúng/sai theo capability (`assertPhoneFieldRenderState(config.hasPhoneField)`). Lý do: `if (data.phone) await phoneInput.fill(...)` chỉ skip hành động khi data không có phone — nó KHÔNG phát hiện được trường hợp FE lỡ vẫn render field đó trên 1 project không nên có (hoặc ngược lại, ẩn nhầm field ở project bắt buộc có). Thiếu bước verify này, lỗi UI âm thầm trôi qua mà test vẫn pass.
- Page Object dùng chung cho **mọi project** — không tạo `RegisterPageProjectA.ts` riêng. Sự khác biệt giữa các project xử lý bằng:
  - Field optional trong data (ví dụ `phone?`) → method tự kiểm tra `if (data.phone)`, kèm `assert*` verify render state như trên.
  - Luồng UI khác hẳn (nhiều bước khác nhau) → xử lý ở tầng **Flow** (mục 4), không nhồi vào Page Object.
- Method trong POM đặt tên theo hành động: `fillBaseForm`, `submit`, `submitOtp` — không đặt tên mơ hồ như `doStuff`, `process`.

## 4. Quy tắc Flow (Strategy Pattern)

Dùng khi 2+ project có **luồng nghiệp vụ khác nhau hoàn toàn** (không chỉ thiếu/thừa field), ví dụ: có bước OTP, có bước chọn gói dịch vụ, redirect khác nhau.

- **[BẮT BUỘC]** Mỗi flow implement chung interface (`IRegisterFlow`, `ILoginFlow`, ...).
- **[BẮT BUỘC]** Việc chọn flow nào do `*FlowFactory.ts` quyết định, dựa trên field trong `ProjectCapabilities` (ví dụ `registerFlow: 'standard' | 'otp'`). **CẤM** if/else theo tên project (`if (projectName === 'project-b')`) ở bất kỳ đâu ngoài `projectConfig.ts` và `*FlowFactory.ts`.
- Khi nào dùng Flow, khi nào chỉ cần field optional trong data?
  - Chỉ thiếu/thừa 1-2 field, các bước còn lại giống nhau → field optional là đủ, **không cần** tạo Flow riêng.
  - Khác số bước, khác trang chuyển hướng, có bước xác thực bổ sung → bắt buộc tách Flow riêng.
- **Quy ước đặt tên class Flow theo HÀNH VI** (`StandardRegisterFlow`, `OtpRegisterFlow`), **không** đặt theo tên project (`ProjectARegisterFlow`, `ProjectBRegisterFlow`). Lý do: khi số project tăng lên 5-10, rất hay gặp tình huống 3-4 project dùng chung 1 kiểu luồng (vd: cùng có OTP). Đặt tên theo hành vi cho phép tái dùng đúng 1 class cho nhiều project qua Factory, tránh nhân bản code giống hệt nhau dưới các tên class khác nhau. Nếu sau này 1 project có biến thể quá đặc thù không khớp hành vi nào có sẵn, lúc đó mới tạo class mới — và đặt tên theo hành vi của riêng nó, không theo tên project.

## 5. Quy tắc Test Data

- **[BẮT BUỘC]** Test data của mỗi project nằm riêng tại `fixtures/test-data/<project-name>/`, không hardcode data trong file `*.spec.ts`.
- **[BẮT BUỘC]** Load data bằng **static import map** (`utils/loadTestData.ts`), KHÔNG dùng `require()` hay `import()` động với template string. Lý do: dynamic import theo tên project khiến TypeScript không kiểm tra được tồn tại file tại compile-time, IDE không autocomplete, và một số bundler/ESM setup resolve sai đường dẫn lúc build. Đánh đổi: thêm project mới phải thêm 1 dòng import + 1 entry trong map — chấp nhận được vì đổi lại có type safety đầy đủ.
- Data phải khai báo đúng type (`RegisterFormData`, ...) để TypeScript bắt lỗi khi thiếu field bắt buộc.
- Data nhạy cảm (mật khẩu test, tài khoản thật) **KHÔNG** commit trực tiếp — dùng biến môi trường hoặc secret manager của CI, file data chỉ giữ giá trị mặc định cho local.
- Email/SĐT trong data happy case nên sinh động (`Date.now()`, `faker`) để tránh trùng tài khoản đã tồn tại giữa các lần chạy.

## 6. Quy tắc viết test case

- Mỗi `test()` tuân theo **AAA**: Arrange – Act – Assert, có thể chú thích comment 3 phần này khi logic dài.
- **[BẮT BUỘC]** Mỗi `test()` chỉ kiểm tra **1 kịch bản** (1 happy case, 1 negative case...). Không gộp nhiều assertion không liên quan vào 1 test.
- Assertion dùng `expect()` của Playwright, **không** dùng `if/console.log` để tự kiểm tra điều kiện.
- Test phải **độc lập**: không phụ thuộc thứ tự chạy, không phụ thuộc state để lại từ test khác (mỗi test tự tạo data/account riêng nếu cần).

## 7. Quy tắc Tag

- **[BẮT BUỘC]** Mọi `describe`/`test` phải có ít nhất 1 tag trong: `@happy`, `@negative`, `@smoke`, `@regression`.
- Giai đoạn đầu chỉ chạy `@happy`: `npx playwright test --grep @happy`.
- Khi thêm negative case: tạo file data riêng (`register.invalid.data.ts`) + test mới gắn `@negative`, **không sửa** spec happy case hiện có.

## 8. Quy tắc thêm Project mới (checklist)

Khi onboard 1 project/client mới:

1. Thêm 1 object vào `utils/projectConfig.ts` (baseURL, các flag capability, `registerFlow`).
2. Thêm `.env.<project-name>` chứa biến URL tương ứng.
3. Tạo thư mục `fixtures/test-data/<project-name>/` với data đầy đủ field bắt buộc theo type.
4. Nếu project có luồng UI khác hẳn → tạo Flow class mới implement interface tương ứng + đăng ký trong Factory.
5. Thêm `project-name` vào `matrix.project` trong `.github/workflows/e2e.yml`.
6. **KHÔNG** sửa Page Object / spec hiện có trừ khi phát sinh field/locator mới dùng chung.

## 9. Quy tắc Assertion

- Assertion về trạng thái UI cuối (toast thành công, redirect, hiển thị lỗi) đặt trong spec, không đặt trong POM/Flow.
- Dùng `await expect(locator).toBeVisible()` thay vì `expect(await locator.isVisible()).toBe(true)` — tận dụng auto-retry của Playwright.
- Không dùng `page.waitForTimeout()` cố định để chờ — luôn chờ theo điều kiện (`waitFor`, `expect(...).toBeVisible()`).

## 10. Quy tắc Git / PR

- Tên branch: `e2e/<feature>-<mô-tả-ngắn>`, ví dụ `e2e/register-happy-case`.
- Commit message: `test(register): add happy case cho project-a & project-b`.
- PR bắt buộc đính kèm: project nào đã chạy pass (`--project=...`), ảnh chụp report nếu có lỗi đã fix.
- Review checklist trước khi merge:
  - [ ] Không hardcode data trong spec
  - [ ] Không có `waitForTimeout` cố định
  - [ ] Page Object không chứa `expect()`
  - [ ] Có tag (`@happy`/`@negative`/...)
  - [ ] Chạy pass trên **tất cả** project liên quan, không chỉ 1 project
  - [ ] Không if/else theo tên project ngoài `projectConfig.ts`/`*FlowFactory.ts`

## 11. Quy tắc CI

- Mỗi project chạy như 1 job riêng trong matrix (`fail-fast: false`) — lỗi ở project A không chặn kết quả của project B.
- Giai đoạn đầu CI chỉ chạy `--grep @happy`; mở rộng sang `@regression` khi đã ổn định và có lịch chạy riêng (nightly).
- Report (`playwright-report/`) luôn upload làm artifact kể cả khi job fail, để debug nhanh.
