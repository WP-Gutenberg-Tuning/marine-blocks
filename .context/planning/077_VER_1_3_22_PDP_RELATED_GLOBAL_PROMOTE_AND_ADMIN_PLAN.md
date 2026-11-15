# V1 / 1.3.22 — PDP Related: Promote to site + admin global editor

Created: **2026-11-16**. Status: **PLANNED — human “lưu plan”; chưa start, chưa code.**
Current: **V1 / 1.3.22**. SemVer mặc định: **scope addition 1.3.22** (cùng option/meta plan076). Start / gộp 1.4.0 cần lệnh human riêng. Không bump, không chuyển current, không build.

Human model (2026-11-16): chỉnh trên **một** trang sản phẩm → Save chỉ đổi trang đó → nút **áp dụng toàn trang** = **copy/promote** thông số đã lưu sang setting global. Không bind, không loop catalog.

Nối: decision `docs/decisions/pdp-related-card-profile.md` (D6); plan [076](076_VER_1_3_22_PDP_RELATED_CARD_PROFILE_PLAN.md) giữ schema/resolve/presenter/loop. Menu label 1.4.0 theo [047](047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md). Adapter Woo-in-theme là tension 2026-11-15 — **ngoài** plan này.

---

## Context

- Site default đã là option `skvn_pdp_related` (`manage_options`). Per-product là meta `_skvn_pdp_related` + `override` (`edit_post`). Resolve: override true → dùng nguyên meta, **không merge** từ site.
- Editor global hiện tại = Theme Design group `related` (plan076 Q2). Draft không preview canvas; Page Save không ghi group. Sidebar còn palette/heading/fonts + group `product`.
- Copy v1 (076 §6) copy từ **Product Collection block đầu tiên trên page** → option. Không copy từ PDP đang test.
- Panel product đã có Override / Use site default. **Chưa** có Promote.
- Admin plugin đã có top-level `SKVN Marine` (`add_menu_page` slug `skvn-marine`): Footer, Header, Typography, Core Control, Preloader, Blog sidebar. Module: không hardcode reorder/rename; onsite ASE.

## Goal

1. Product: Save local giữ nguyên. Thêm nút Promote = copy 19 key đã sanitize sang option site.
2. Global editor canonical chuyển sang submenu **SKVN Marine** (sau 1.4.0: Marine Blocks). Gỡ dual-edit Theme Design.
3. Không đổi option/meta keys, presenter, Woo query.

## Human đã chốt (2026-11-16)

| # | Chốt | Không làm |
|---|---|---|
| 1 | Save product = chỉ PDP đó (`override` meta) | Save product không ghi option |
| 2 | “Áp dụng toàn trang” = **copy** snapshot 19 key → `skvn_pdp_related`, bật `useCustomRelatedCard` | Không bind product↔option; không live-link Collection |
| 3 | Product nguồn **giữ override** sau copy | Không auto `{ override: false }` trên nguồn |
| 4 | Product khác đang override **không bị đụng** | Không mass-reset `_skvn_pdp_related` |
| 5 | Global UI đích = admin `SKVN Marine` (label source 1.4.0 → Marine Blocks) | Không option SKVN “đổi tên menu”; ASE overlay onsite |
| 6 | Một editor global: admin page. Theme Design group `related` **không** còn canonical khi start | Dual-edit như Typography (C) |

Palette / heading / fonts **ở lại Theme Design** (token lúc sửa block). Group `product` (plan067) **không tự chuyển** trong plan này — câu hỏi mở §8.

---

## 1. Promote — copy, không link

Nguồn: meta product hiện tại, chỉ khi `override === true` (bool sanitize `true`/`1`).  
Đích: option `skvn_pdp_related`.  
Không copy key `override`.

```text
saved_meta (override true, 19 key)
  → skvn_marine_blocks_sanitize_pdp_related( meta )
  → useCustomRelatedCard = true
  → update_option( skvn_pdp_related, value )
```

`useCustomRelatedCard` trên meta nguồn nếu false: Promote **từ chối** hoặc confirm “sẽ bật owner trên site” — mặc định **từ chối** (tránh copy profile inactive thành global native). Human có thể đổi lúc start.

Sau Promote:

| Product | Hành vi |
|---|---|
| Nguồn (override vẫn true) | Vẫn meta. Trông giống option lúc bấm nút; sửa global sau **không** kéo theo |
| Override tắt | Đọc option mới |
| Override true khác | Giữ meta cũ |

Capability nút: **`manage_options`**. `edit_post` không đủ. Thiếu quyền: disable + help tiếng Anh. Confirm dialog trước khi ghi (overwrite option). Không ghi lúc Save product.

Transport: REST hoặc `admin-ajax` plugin, nonce + `manage_options`, cùng sanitize 076. Không custom SQL.

Copy-from-Collection (076 §6) **giữ** cho đến khi human chọn retire; nếu giữ, đặt trên **admin page**, không Theme Design.

## 2. Admin global editor

Submenu dưới `skvn-marine`:

- Title/menu: `Related products` (English, text domain `skvn-marine-blocks`).
- Cap: `manage_options`.
- Fields: cùng 19 key / label / lock khi owner off như Theme Design group `related`.
- Save: Settings API hoặc POST plugin, `skvn_marine_blocks_sanitize_pdp_related`.
- Help: site default; product Override thắng; Promote từ product copy vào đây.

Khi start 077: **gỡ editor** group `related` khỏi `theme-design.tsx` (và AJAX save `related` nếu không còn consumer). Có thể để một dòng link “Edit in SKVN Marine → Related products”. Không để hai form ghi cùng option.

Không thêm SKVN option đổi `menu_title`. 1.4.0 đổi label top-level trong source; ASE đổi hiển thị onsite.

## 3. Storage / resolve — không đổi

076 §3–4 giữ: option 19 key, meta `override` + 19, `skvn_marine_blocks_get_pdp_related()`, `is_active`. Theme getter vẫn gọi plugin. Loop/presenter/P4 không đụng.

## 4. Files (khi start)

**Allowed (plugin, ≤5/gói):**

- `modules/pdp-related-settings/pdp-related-settings.php` — Promote handler + admin page/submenu.
- `src/pdp-related/panel.tsx` — nút Promote, confirm, gate `manage_options`.
- `src/design-sidebar/theme-design.tsx` — gỡ group `related` (gói UI).
- `modules/typography-settings/typography-settings.php` — chỉ nếu copyRelated/save group `related` phải chuyển/gỡ.
- Test: `tools/tests/pdp-related-promote.test.php` (mới).

**Forbidden:** `themes/generatepress/**`; option/meta key rename; `inc/woocommerce.php`; mass `update_post_meta` mọi product; ASE/dependency mới; menu rename option; Woo adapter move (1.4.0 tension).

Classic meta box: cùng Promote nếu `manage_options`, hoặc chỉ Gutenberg v1 — chốt lúc start (mặc định: Gutenberg + admin page; classic chỉ Override như 076).

## 5. Acceptance (Chưa làm — chỉ khi start)

| ID | Nhóm | Expected |
|---|---|---|
| REL-UX-03 | Editor UX | Override on + owner on + Save → chỉ PDP đó. Promote + confirm + `manage_options` → option = snapshot; nguồn vẫn override; PDP không override theo option mới; PDP override khác không đổi |
| REL-UX-04 | Editor UX | Admin SKVN Marine → Related products sửa/lưu option; Theme Design **không** còn form related; Page Save product không ghi option |
| REL-TECH-04 | Technical | Promote: sanitize 19 key, không copy `override`, force owner true; thiếu cap/nonce/`override` false → không ghi option; role `edit_post` không Promote |

REL-UX-01 (Theme Design group) **sửa expected khi start 077**: chuyển sang admin page + Copy-from-Collection nếu còn. Không đánh PASS 076 bằng source 077. REL-* 076 khác giữ.

## 6. Sequencing khi human “implement”

1. Promote PHP + test mocked (option write, cap, reject inactive).
2. Panel nút + confirm (cần current user cap trong editor).
3. Admin submenu + fields + save.
4. Gỡ Theme Design group `related`; chuyển copyRelated sang admin nếu giữ.
5. Runbook amend `docs/testing/pdp-related-card-1.3.22.md` — fixture Promote / quyền / không mass-reset.

Human chạy build/lint; agent không tự chạy.

## 7. Tensions / Conflicts

- Plan076 Q2 = Theme Design group `related`. 077 **thay UI canonical**, không thay storage. Ghi ở 076 header; không xóa lịch sử Q2.
- Dual Typography admin + Theme Design = bài học: related không lặp.
- Sidebar “mệt” hết related nhưng **còn group `product`** nếu chưa chuyển (mở §8).
- Theme + plugin deploy cùng gói (DP-11) vẫn đúng cho loop adapter; 077 không sửa.

## 8. Còn mở — không tự chốt

1. Start trong **1.3.22** hay để **1.4.0** (cùng đổi menu Marine Blocks).
2. Chuyển luôn group **Product page** (`skvn_product_design`) sang admin, hay **Related thôi**.
3. Giữ hay retire Copy-from-Collection sau khi có Promote.
4. Promote khi meta `useCustomRelatedCard` false: reject (mặc định) vs confirm bật owner.
5. Classic editor: có nút Promote hay không.

Default nếu chưa quyết trước lệnh start: Related-only; giữ Copy-from-Collection trên admin; reject Promote khi owner local off; classic không Promote.

## 9. Default vận hành

Chưa lệnh implement: **giữ A** — Theme Design group `related` + Copy-from-Collection như 076. Plan077 chỉ ledger. Không gỡ UI hiện tại.
