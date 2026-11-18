# Decision: GU Supercharger Launch (post V1 / 1.5.x)

Status: ACTIVE
Milestone: none
Lifecycle: active
Notes: quyết định LOCKED 2026-06-23; launch boundary = sau khi V1 / 1.5.x ổn định.
**Date:** 2026-06-23 (revised — supersedes 1.3.11 launch timing)  
**Prior decision:** `docs/decisions/archives/gutenberg-supercharger-launch-1.3.11.md` — **SUPERSEDED**  
**Milestone boundary:** After **V1 / 1.5.x** stabilizes (woo-catalog integration + multi-site confidence)

---

## Decision

### Marketplace preparation note — 2026-11-06

Human yêu cầu tổng hợp sale points trước, trình bày sau khi chuẩn bị đưa lên marketplace. Register: [Marine Blocks selling points](../product/marketplace-selling-points.md); Content Actions là SP-01 đã được human chọn. Khi mở task marketplace/launch, agent phải đọc register, kiểm evidence/scope hiện hành và trình human chọn cách trình bày trước khi viết/xuất bản listing. Đây là yêu cầu chuẩn bị nội dung, không tự chọn marketplace/ngày/version hoặc thay launch gate bên dưới.

### Amendment — 2026-11-04 (hiệu lực ưu tiên)

Human chốt **Marine Blocks** (`marine-blocks`, PHP `marine_blocks_`), thay identity GU/Gutenberg Supercharger; không hướng full-FSE supercharger. Plugin styling/runtime riêng; website WindPress enhance core/pattern. Migration chuyển sang **1.4.0**, SemVer đã xác nhận, chưa start, không đợi public launch. Xem [plan 047](../../.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md).

File vẫn ACTIVE cho gate public launch sau 1.5.x và QA. Identity, yêu cầu giữ tên cũ tới launch và migration chỉ tại launch bên dưới là lịch sử đã bị thay thế. Public version cần xác nhận lại, không tự reset 0.0.1. Research tên cũ không áp dụng cho marine-blocks. Giữ acceptance: dùng tên mới khi thực hiện và nối evidence migration 1.4.0 vào launch gate.

Human chốt:

1. **Defer public launch** — không ship product plugin tại 1.3.11.
2. **Launch sau khi hết 1.5.x** — khi woo-catalog + collection integration + các site đang chạy đã ổn định.
3. **Identity mới:**

```text
Display name:  Gutenberg Supercharger (marketing) — có thể rút gọn GU Supercharger trong UI
Plugin slug:   gu-supercharger
Text domain:   gu-supercharger
Block namespace: gu-supercharger   (vd. gu-supercharger/slider)
Product SemVer:  0.0.1 (line riêng, không dùng SKVN theme 1.3.x)
```

4. **Namespace migration** là một phần của launch boundary (không giữ `skvn-marine/*` trong product public) — cần migration tool + pilot multi-site.

---

## Name research (2026-06-23)

### WordPress.org plugin slug

| Slug | wp.org status | Ghi chú |
|------|---------------|---------|
| **`gu-supercharger`** | **Available** — search 0 plugins | ✅ Khuyến nghị dùng |
| `gutenberg-supercharger` | Available — search 0 plugins | Dài hơn; vẫn OK nếu muốn SEO rõ |
| **`supercharger`** | **Taken** | [Supercharger AI](https://wordpress.org/plugins/supercharger/) (Code Supply Co.) — AI engagement toolkit, **khác category** nhưng trùng từ khóa search |

### Block namespace `gu-supercharger`

- WordPress **không có registry global** cho block namespace — conflict chỉ xảy ra nếu **hai plugin active cùng lúc** đăng ký cùng tên block.
- Không tìm thấy plugin/block public nào dùng namespace `gu-supercharger` (search wp.org + web 2026-06-23).
- Namespace ngắn, hợp lệ (`[a-z0-9-]+`).

### Brand / SEO risk (không chặn kỹ thuật)

- **Supercharger AI** (`wpsupercharger.com`) — user search "supercharger wordpress" có thể nhầm. Mitigation: display name đầy đủ **Gutenberg Supercharger**, tagline riêng, slug `gu-supercharger` (khác `supercharger`).
- Native Instruments **Supercharger GT** — audio plugin, không liên quan WP ecosystem.

### Khuyến nghị

- **Slug + block namespace:** `gu-supercharger` — available, distinct khỏi `supercharger`.
- **Reserve wp.org slug sớm** khi gần launch (tránh squatting).
- **Trademark/domain audit** riêng trước commercial scale (ngoài scope research kỹ thuật này).

---

## Until post-1.5.x (dev)

- Dev tiếp tục: `skvn-marine` theme + `skvn-marine-blocks` plugin.
- Block namespace giữ `skvn-marine/*` — bảo vệ **N site production** đang chạy.
- 1.3.11 = **onsite QA only** — không launch product.

---

## At launch (post 1.5.x)

Prerequisites:

- [ ] 1.5.x acceptance DONE (woo-catalog + blocks optional-read + onsite)
- [ ] Multi-site pilot migration (≥1 staging + ≥1 production non-critical)
- [ ] Migration tool: `skvn-marine/*` → `gu-supercharger/*` trong `post_content` + block deprecations
- [ ] Option key map documented (`skvn_*` → `gu_supercharger_*` hoặc preserve với shim)

Release:

- [ ] Plugin `gu-supercharger` **0.0.1** zip + deploy artifact audit
- [ ] Không yêu cầu mọi site đổi cùng ngày — nhưng mỗi site migrate theo runbook (deactivate old, migrate content, activate new)
- [ ] Human approves public launch

---

## References

- `.context/MILESTONES.md` §1.3.11 (QA) + §GU Supercharger Launch
- `.context/planning/008_FUTURE_CANDIDATE_GUTENBERG_TURBO_PLANNING.md`
- `docs/workflows/versioning-release-workflow.md`
