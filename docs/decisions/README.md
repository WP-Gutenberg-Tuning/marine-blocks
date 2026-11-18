# SKVN Marine — Decision Index

> Index + quy ước cho `docs/decisions/`.
> Nạp file này thay vì đọc tuần tự toàn bộ thư mục. Chi tiết milestone nằm ở `.context/MILESTONES.md` và `AGENTS.md` §9.

## Cấu trúc thư mục

```text
docs/decisions/          decision đang hiệu lực + evergreen foundation (được load khi task liên quan)
docs/decisions/reports/  tài liệu tham chiếu kỹ thuật — KHÔNG phải quyết định scope mới
docs/decisions/archives/ decision đã superseded / implemented-and-closed / living-doc đã đóng băng
docs/decisions/.assets/  hình minh hoạ
```

## Quy ước bắt buộc

1. **Tên file**: `<topic>-<semver>.md` khi decision gắn với milestone; bỏ hậu tố khi decision là evergreen hoặc milestone chưa được xác nhận.
2. **Hậu tố version phải tồn tại trong `AGENTS.md` §9.** Agent KHÔNG tự gán SemVer mới. Nếu chưa có version đã xác nhận → bỏ hậu tố và ghi `Milestone: none` + giải thích trong `Notes`.
3. **Mỗi file có đúng 1 dòng `Status:`** với đúng một giá trị trong bảng dưới. Ghi chú QA, mapping lịch sử, hay lý do chuyển archive nằm ở `Notes:` — không nhét vào `Status`.
4. **Mỗi file có `Milestone:`** (giá trị `V1 / x.y.z` hoặc `none`) và `Lifecycle:` (`active` | `evergreen` | `archived`).
5. **Không xoá decision.** File hết hiệu lực → chuyển vào `archives/` và nêu rõ trong `Status`/`Superseded by`.
6. **Reference trong file đã archive** chỉ sửa path, giữ nguyên câu chữ lịch sử. Reference trong file còn sống thì sửa path kèm ghi chú.

### Giá trị `Status`

| Status | Nghĩa |
|---|---|
| `ACTIVE` | Đang hiệu lực, có thể còn implement hoặc còn ràng buộc milestone sau |
| `IMPLEMENTED` | Đã implement; onsite QA có thể vẫn pending (xem `Notes`) |
| `SUPERSEDED` | Bị decision khác thay thế — bắt buộc có dòng `Superseded by:` |
| `ARCHIVED` | Living doc đã đóng băng, không còn được cập nhật |

### Giá trị `Lifecycle`

| Lifecycle | Nghĩa |
|---|---|
| `active` | Nằm ở root; load khi task chạm domain đó |
| `evergreen` | Nền tảng lâu dài; không phụ thuộc milestone cụ thể |
| `archived` | Nằm trong `archives/`; chỉ đọc khi audit lịch sử hoặc truy vết quyết định cũ |

---

## 1. Active — contract/scope đang hiệu lực

- **Marine Blocks direction & migration (2026-11-04):** [plan 047](../../.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md), target 1.4.0, SemVer đã xác nhận, chưa start. Thay identity GU Supercharger/full-FSE; launch gate sau 1.5.x giữ theo amendment trong launch decision. Plugin styling độc lập, WindPress enhance core/pattern website; theme identity giữ nguyên.

### Slider

| File | Milestone | Note |
|---|---|---|
| [`slider-completion-spec-1.3.0.md`](slider-completion-spec-1.3.0.md) | V1 / 1.3.0 | Source of truth cho Slider layer contract |
| [`slider-navigation-and-pagination-controls.md`](slider-navigation-and-pagination-controls.md) | V1 / 1.3.1 | Arrow/pagination/autoplay governed controls |
| [`slider-editor-arrow-preview-1.3.6.md`](slider-editor-arrow-preview-1.3.6.md) | V1 / 1.3.6 | CASE-006 editor arrow preview |
| [`slider-parallax-both-1.3.8.md`](slider-parallax-both-1.3.8.md) | V1 / 1.3.8 | Rev 1.1 parallax contract |
| [`swiper-architecture.md`](swiper-architecture.md) | none | Runtime usage map (2 consumer) + loopFix invariant |
| [`fullscreen-step-slider-1.3.10.md`](sliders/step-slider/fullscreen-step-slider-1.3.10.md) | V1 / 1.3.24 (origin 1.3.10) | PLANNED, chưa start; product contract 2026-11-09 |
| [`2-side-product-slider.md`](sliders/2-side-product-slider/2-side-product-slider.md) | Chưa gán | Product direction đã chốt, chưa start |

### Collections & WooCommerce

| File | Milestone | Note |
|---|---|---|
| [`skvn-dynamic-collections-1.3.3.md`](skvn-dynamic-collections-1.3.3.md) | V1 / 1.3.3 | Contract gốc cho product/post collection |
| [`collection-hover-interactions-1.3.7.md`](collection-hover-interactions-1.3.7.md) | V1 / 1.3.7 | Card hover + carousel controls |
| [`collection-carousel-engine-keep-swiper.md`](collection-carousel-engine-keep-swiper.md) | none | Giữ Swiper cho collection carousel (chưa implement) |
| [`product-data-model.md`](product-data-model.md) | none | WooCommerce native products/attributes |
| [`product-card-grid-layout-contract.md`](product-card-grid-layout-contract.md) | none | CSS contract cho product card grid |
| [`pdp-related-card-profile.md`](pdp-related-card-profile.md) | V1 / 1.3.22 | PDP Related: profile `related`, Woo query, chip rules v1 — ACTIVE, scope addition 1.3.22 |
| [`woo-catalog-css-migration-1.5.0.md`](woo-catalog-css-migration-1.5.0.md) | V1 / 1.5.0 | Pending — CSS chuyển sang plugin woo-catalog |

### Editor controls & animation

| File | Milestone | Note |
|---|---|---|
| [`skvn-editor-controls-0.8.0.md`](skvn-editor-controls-0.8.0.md) | V1 / 0.8.0 | Governance contract sidebar controls |
| [`gutenberg-editor-chrome-contract.md`](gutenberg-editor-chrome-contract.md) | V1 / 1.3.6 | Bắt buộc đọc trước khi sửa slider editor |
| [`block-animation-strategy.md`](block-animation-strategy.md) | V1 / 1.2.0 | Boundary animation theme vs plugin |
| [`feature-showcase-1.2.3.md`](feature-showcase-1.2.3.md) | V1 / 1.2.3 | Panel-only block decision |

### Admin surfaces

| File | Milestone | Note |
|---|---|---|
| [`core-control-core-button-hover.md`](core-control-core-button-hover.md) | V1 / 1.3.4 | Core Control registry + button hover colors |
| [`footer-page-settings-0.9.0.md`](footer-page-settings-0.9.0.md) | V1 / 0.9.0 | `skvn_footer_page_id` settings page |
| [`footer-appearance-settings-0.11.0.md`](footer-appearance-settings-0.11.0.md) | V1 / 0.11.0 | Footer background preset |
| [`header-actions-search-0.12.0.md`](header-actions-search-0.12.0.md) | V1 / 0.12.0 | Header actions + B2B search |
| [`single-post-layout-and-mobile-surfaces.md`](single-post-layout-and-mobile-surfaces.md) | V1 / 1.3.6 | Single post layout + mobile surfaces |

### Theme / layout / typography

| File | Milestone | Note |
|---|---|---|
| [`typography-scope-and-font-loading.md`](typography-scope-and-font-loading.md) | V1 / 1.3.6 | Source of truth; tham chiếu từ `inc/typography.php`, `inc/customizer.php` |
| [`canvas-alignment-and-generatepress-exit.md`](canvas-alignment-and-generatepress-exit.md) | none | Canvas width ownership vs GeneratePress |
| [`brand-profile-theme-tokens.md`](brand-profile-theme-tokens.md) | V1 / 0.7.0 | Token contract cho patterns/editor/frontend |
| [`page-display-controls.md`](page-display-controls.md) | V1 / 0.5.1 | Landing canvas preset, hide header/footer |
| [`b2b-seafood-editorial-typography-1.2.3.md`](b2b-seafood-editorial-typography-1.2.3.md) | V1 / 1.2.3 | Visual-language note tái sử dụng được |
| [`group-island-windpress-stopgap-1.3.20.md`](group-island-windpress-stopgap-1.3.20.md) | V1 / 1.3.20 | WindPress chữa cháy có hạn trên Group island tạm — **dormant** từ 2026-11-12 (human tạm không dùng Group); nền cho block island: [plan 066](../../.context/planning/066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK.md) |

### Roadmap & product boundary

| File | Milestone | Note |
|---|---|---|
| [`project-goals-and-roadmap-reset.md`](project-goals-and-roadmap-reset.md) | none | Bản ghi planning hướng C (WORKING) |
| [`gu-supercharger-launch-post-1.5x.md`](gu-supercharger-launch-post-1.5x.md) | none | LOCKED — launch sau V1 / 1.5.x |
| [`quote-flow.md`](quote-flow.md) | none | Same-site Request a Quote, không custom form handler |
| [`skvn-team-credits-easter-egg-1.3.9.md`](skvn-team-credits-easter-egg-1.3.9.md) | V1 / 1.3.9 | Requirement approved, implementation deferred |

---

## 2. Evergreen foundation

| File | Nội dung |
|---|---|
| [`architecture.md`](architecture.md) | Theme/plugin boundary, V1 project goal |
| [`design-direction.md`](design-direction.md) | Color direction sau 0.5.1 hotfix |
| [`caching-strategy.md`](caching-strategy.md) | Không cache `/cart/`, `/checkout/`, `/request-a-quote/`, v.v. |

---

## 3. Reports — tham chiếu kỹ thuật, không phải decision

Xem [`reports/README.md`](reports/README.md).

---

## 4. Archives

Xem [`archives/README.md`](archives/README.md). Không load mặc định; chỉ đọc khi audit lịch sử quyết định.

---

## 5. Mismatch version đang giữ nguyên (chờ human)

Các mục dưới đây **cố ý chưa sửa** vì sửa cần quyết định version của human:

| Mismatch | Thực tế | Trạng thái |
|---|---|---|
| Team Credits | File/hậu tố `1.3.9`; `AGENTS.md` §9 + `MILESTONES.md` liệt kê scope này dưới `1.3.12` | Giữ tên file `skvn-team-credits-easter-egg-1.3.9.md`; chưa quyết định rename/gán lại version |
| Loading Screen | Hậu tố `1.3.13` chỉ là số planning `035_VER_1_3_13_...` | Giữ hậu tố, `Milestone: none` |
| Post Heading Numbering | Hậu tố `1.3.14` chỉ là số planning `036_VER_1_3_14_...` | Giữ hậu tố, `Milestone: none` |
| Blog Sidebar Content Settings | Hậu tố `1.3.12` trùng milestone Team Credits | Đã bỏ hậu tố → `archives/blog-sidebar-content-settings.md` |
| Typography Report | Header report gốc ghi milestone `1.5.0 — Typography Settings`, nhưng `1.5.0` hiện là Woo Catalog Plugin | Chưa renumber; scope contract mới hơn là `typography-scope-and-font-loading.md` |
| Collection Hover Interactions | Hậu tố `1.3.8` trùng Slider Parallax | Đã đổi → `collection-hover-interactions-1.3.7.md` (human xác nhận 2026-10-13) |
| Fullscreen Step Slider | File gốc tên `1.5.0`, origin 1.3.10; human gán 1.3.24 | Đã đổi tên lịch sử và đặt tại `sliders/step-slider/fullscreen-step-slider-1.3.10.md` |

---

## 6. Lịch sử thay đổi thư mục này

- **2026-10-13** — human phê duyệt cleanup tài liệu. Chuẩn hóa `Status`/`Milestone`/`Lifecycle` cho toàn bộ file; tạo `reports/` và các index README; chuyển 5 file implemented/superseded vào `archives/`; rename 3 file để khớp milestone. Không thay đổi quyết định sản phẩm, milestone, hay version nào.
