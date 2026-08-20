# tedo-landingpage

[![Codecov](https://codecov.io/gh/starci-lab/tedo-landingpage/graph/badge.svg?token=H5BVDJFL0G)](https://codecov.io/gh/starci-lab/tedo-landingpage)
[![SonarQube Quality Gate](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=alert_status&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)
[![SonarQube Coverage](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=coverage&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)
[![SonarQube Bugs](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=bugs&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)
[![SonarQube Vulnerabilities](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=vulnerabilities&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)
[![SonarQube Code Smells](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=code_smells&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)
[![SonarQube Maintainability](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=sqale_rating&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)
[![SonarQube Reliability](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=reliability_rating&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)
[![SonarQube Security](https://sonar.starci.org/api/project_badges/measure?project=tedo-landing&metric=security_rating&token=sqb_8e3f6a0eb90ecd0b631a85ba6174dd59456a562b)](https://sonar.starci.org/dashboard?id=tedo-landing)

Landing page cho Tedo — công ty phần mềm AI-first. Song ngữ vi/en.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 + HeroUI v3
- next-intl, routing theo `/[locale]` (`vi`, `en`)
- Dark-only, accent lime `#c6f24e`

## Chạy local

```bash
npm install
npm run dev        # http://localhost:3002
```

| Lệnh | Việc |
| --- | --- |
| `npm run dev` | Dev server, port 3002 |
| `npm run build` | Build production |
| `npm run typecheck` | `tsc --noEmit` |

Đừng chạy `build` khi `dev` đang chạy — cả hai ghi vào `.next`, build production đè chunk của dev và trang sẽ vỡ với lỗi `__webpack_modules__[moduleId] is not a function`. Gặp rồi thì `rm -rf .next` rồi start lại.

## Cấu trúc

```
messages/{vi,en}.json          toàn bộ nội dung, key phải khớp 1-1
src/config/brand.ts            tên brand, email, domain, link đặt lịch
src/components/sections/       11 section của landing
src/components/grid-background.tsx   nền lưới kỹ thuật
src/components/circuit-traces.tsx    mạch điện + chấm sáng chạy
src/app/globals.css            token màu, theme HeroUI, CSS nền lưới/mạch
```

Đổi tên công ty: sửa `src/config/brand.ts` và các chuỗi `Tedo` trong `messages/*.json`.

## Lưu ý khi sửa

**HeroUI v3 là client-only.** Mọi file import `@heroui/react` phải có `"use client"` ở đầu, kể cả khi chỉ dùng component tĩnh như `Card` hay `Chip`. Thiếu thì build lỗi `'client-only' cannot be imported from a Server Component`.

**Theme HeroUI** đi qua biến ngữ nghĩa (`--background`, `--surface`, `--accent`, `--border`, `--radius`) khai trong `.dark` ở `globals.css`. Sửa ở đó, đừng đè class từng component.

**Nền lưới** dùng màu viết thẳng, không dùng token `--color-line`. Hai token đó vẽ viền card thật khắp trang — vặn sáng cho nền sẽ làm dày mọi viền card.

**Chấm sáng trên mạch**: `stroke-dasharray` chạy trên `pathLength="100"` nên đơn vị là phần trăm chiều dài đường. Nếu đổi khoảng cách chấm thì phải sửa `stroke-dashoffset` trong `@keyframes tedo-pulse` cho bằng đúng một chu kỳ dash, lệch là vòng lặp giật.

## Còn dở

- [ ] **Case study đang là nội dung giả.** Xem `TODO(content)` trong `src/components/sections/cases.tsx`. Badge "Chờ khách duyệt" giữ nguyên cho tới khi có số liệu thật được khách đồng ý.
- [ ] **Form liên hệ chưa có nơi nhận.** `/api/contact` trả 501 khi thiếu env `CONTACT_WEBHOOK_URL`, và form hiện thông báo mời email trực tiếp. Cố ý — form trả 200 mà không có đích đến thì lead rơi vào hư không. Xem `.env.example`.
- [ ] **Domain và email trong `src/config/brand.ts` đang là tạm** (`tedo.dev`, `hello@tedo.dev`, link cal.com).
- [ ] Bản `en.json` chưa cập nhật theo đợt viết lại `vi.json` gần nhất, hai bản đang lệch giọng.
