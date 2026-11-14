# V1 / 1.3.22 — PDP Related Card Profile & Chips (scope addition)

Created: **2026-11-14**. Status: **IN PROGRESS — P1 source added 2026-11-14 (schema/sanitize/resolve + module + theme mirror + 2 include; human đã build), P2 source added 2026-11-14 (Theme Design group `related` + copy action + contract capabilities; chưa build/lint), **P2.1 copy/list hardening 2026-11-14** (marker filter + DFS first block + `tools/tests/pdp-related-copy-blocks.test.php`); P3–P5 Chưa làm; P0 preflight trước P4**.

Decision doc: `docs/decisions/pdp-related-card-profile.md` (ACTIVE, chốt 2026-11-14; amend cùng ngày: `useCustomRelatedCard`, columns clamp).
Human duyệt scope addition vào current **V1 / 1.3.22 — Product Page Basic Design Controls** cùng ngày qua Q&A 9 điểm. Không bump metadata, không chuyển current, không release/deploy. Commit `feature patch:` theo precedent scope addition, chỉ khi human yêu cầu. Plan067 §12–20 giữ nguyên hiệu lực; phối hợp cùng-file xem §2.

## 1. Quyết định human 2026-11-14 (Q&A 9 điểm)

| # | Câu hỏi | Human chọn |
|---|---|---|
| 1 | SemVer / milestone | **Gộp vào 1.3.22** (scope addition, precedent plan061/057) |
| 2 | UI site default | **Theme Design group mới** — pattern group `product` của plan067 §18 |
| 3 | Per-product override | **Panel riêng** "Related products" + classic meta box riêng (mirror plan067 §19) |
| 4 | Specs presentation | **Grouped như Carousel** — 3 values + `+N` informational; gate 060: detail page phải expose đủ values |
| 5 | D4 allowlist vs card attrs | **Hai lớp** — `showProductTags`/`showProductCategories` bật khu vực chip; allowlist D4 + `displayTagLimit` govern nội dung |
| 6 | Query controls | **Chỉ `relatedCount`** (default 4); order/columns giữ mặc định Woo native |
| 7 | Profile inactive | **`useCustomRelatedCard` false** → Woo native nguyên vẹn — không presenter, không enqueue card assets (kể cả option đã save toàn default) |
| 8 | Defer | **Upsells** + **Intersection bật**. **KHÔNG defer**: Copy card settings (làm v1), classic editor meta box (làm v1) |
| 9 | imageRatio default | **1:1** (đồng bộ amendment human 2026-11-07 cho archive card 060) |

## 2. Phối hợp với plan067 trong cùng 1.3.22

Ba file bị CẢ HAI scope chạm: `modules/typography-settings/typography-settings.php`, `src/design-sidebar/theme-design.tsx`, `inc/customizer.php`.

- Sequencing mặc định: **P1–P4 của plan067 chạy trước**, group `related` (P2 của plan này) xây trên cơ chế group `product` đã có. Nếu human yêu cầu đảo thứ tự, implementation `related` phải viết cơ chế owner-map/snapshot/AJAX allowlist hỗ trợ cả hai group trong một lượt, không ghi đè nhánh `product`.
- `modules/product-design/*` và `inc/product-design.php` thuộc plan067 — plan này **không sửa**, chỉ thêm module/file mới cạnh bên.
- File contract §13 của plan067 được amend bởi bảng §12 của plan này; không tick checklist plan067 từ lượt này.

## 3. Schema profile

Site default: option `skvn_pdp_related` (plugin ghi, capability `manage_options`, nhóm Theme Design `related`).
Per-product: post meta `_skvn_pdp_related` (capability `edit_post`, panel sản phẩm, giống 1.3.22).

Mọi key luôn có sau sanitize; key sai về default của key đó, không hủy mảng. Key lạ bị bỏ.

| Key | Allowlist | Default | Ghi chú |
|---|---|---|---|
| `useCustomRelatedCard` | bool | `false` | **Owner bật SKVN related** — chỉ khi `true` sau resolve mới args filter, template swap, enqueue card CSS |
| `showImage` | bool | `true` | Chỉ áp khi `useCustomRelatedCard` true |
| `imageRatio` | `1:1`, `4:3`, `3:2`, `16:9`, `auto` | `1:1` | Định dạng dùng dấu `:` như schema Collection (`ImageRatio`, `controls.tsx:133`) |
| `mediaLayout` | `flush`, `padded`, `floating` | `flush` | Khớp geometry archive card 060 |
| `showProductTags` | bool | `true` | Lớp 1 — bật khu vực chip tag |
| `showProductCategories` | bool | `false` | Lớp 1 — bật khu vực chip category |
| `showSpecChips` | bool | `true` | Tắt → không specs section |
| `chipStyle` | `tag`, `hashtag`, `dot`, `plain` | `tag` | Schema Collection |
| `chipColorScheme` | palette slug (token theme) hoặc `''` | `''` | Không nhận raw hex; class `skvn-chips--{slug}` |
| `productActionMode` | `view`, `quote`, `both`, `custom` | `quote` | Default presenter Collection; **default cần human review khi onsite** |
| `customActionUrl` | string (esc_url_raw) | `''` | Chỉ dùng khi mode `custom`; không append quote context v1 |
| `chipAllowTags` | bool | `true` | Lớp 2 — D4 allowlist `product_tag` |
| `chipAllowCategories` | bool | `false` | Lớp 2 — D4 allowlist `product_cat` (capability render mới, opt-in) |
| `displayTagLimit` | int `0–10` | `3` | `0` = không giới hạn; `1–10` = cap + `+N` informational span |
| `relatedCount` | int `1–10` | `4` | `posts_per_page` khi active; `columns` = clamp(`relatedCount`, 1, 4) — §7 |

Site option: **15 key** (không có `override`). Meta khi override: `override` + **15 key** (gồm `useCustomRelatedCard`).

**Profile active (runtime):** `skvn_marine_blocks_pdp_related_is_active( $resolved )` → `useCustomRelatedCard === true` (bool sanitize). Không so diff với default. Plugin API vắng → luôn inactive (native).

Meta sản phẩm thêm đúng một key: `override` — semantics y hệt plan067 §3/§14:
- `override` false / meta rỗng / JSON hỏng: bỏ mọi key còn lại, dùng option site.
- `override` true: dùng bản sanitize của meta; **key thiếu lấy default bảng trên, không lấy từng key từ site**.
- Use default / Reset ghi `{ "override": false }`; không `delete_post_meta`.

**Không có trong schema v1** (defer, xem §11): key specs mode (related cố định grouped), `badgeBehavior` (cố định display-only như 060 archive), token typography/color theo vai trò (`titleFont*`, `detailsFont*`, `action*`), `showPrice`/`showSku`/`showStock`, `appendQuoteContext`, `chipHighlightCurrent` (intersection).

## 4. Sanitize & resolve

Plugin `modules/pdp-related-settings/pdp-related-settings.php`:
- `skvn_marine_blocks_sanitize_pdp_related( $raw )` — luật plan067 §14: enum `isset && is_string && in_array(..., true)`; bool chỉ `true`/`1` (chuỗi `'false'`/`'true'`/`''` → false, không ép `(bool)`); int dùng bounded int (không `absint`, `0` hợp lệ — precedent Category action/DP-06); key lạ bỏ.
- `skvn_marine_blocks_sanitize_pdp_related_meta( $raw )` — mirror plan067 meta sanitize: override sai → `array('override' => false)`; override đúng → override + 15 key.
- `skvn_marine_blocks_get_pdp_related( $product_id )` — resolve chỉ plugin đọc DB: sanitize option → nếu meta không array hoặc override không true/1 → trả site → ngược lại sanitize meta.
- `skvn_marine_blocks_pdp_related_is_active( $resolved )` — bool owner; export cho theme enqueue/hooks.

Theme `inc/pdp-related.php`:
- `skvn_marine_sanitize_pdp_related()` + `skvn_marine_get_pdp_related()` — same luật, comment `keep in sync with` trỏ sang nhau (pattern plan067 §14).
- Theme getter: nếu `function_exists( 'skvn_marine_blocks_get_pdp_related' )` → gọi plugin; plugin vắng → trả default bảng §3, **không** `get_option`/`get_post_meta` trực tiếp (security guideline).

## 5. Presenter context `related` (plugin)

Sửa `modules/collection-render/cards.php` — thêm nhánh context, **không đổi** grid/carousel/archive hiện có (AC-TECH02 060):

- `skvn_marine_blocks_render_product_card( $product, $attrs, 'related' )`: attrs từ profile đã resolve; force `cardContext` riêng, `badgeBehavior` display-only.
- Specs: **grouped như Carousel** (mặc định 3 values + `+N` informational) khi `showSpecChips` true — nhánh này phải render grouped kể cả khi không có layout attr (điều kiện grouped hiện tại ở cards.php:469 là archive-or-carousel; related thêm điều kiện riêng).
- Chips: render term của sản phẩm đó cho `product_tag` / `product_cat` theo lớp hai: taxonomy X chip iff `showX && chipAllowX`, cap `displayTagLimit`, thừa → `+N` span informational (không click/expand, có screen-reader text). **`product_cat` chip là render mới của product card — chỉ tồn tại trong nhánh `related`**, không leak sang grid/carousel/archive.
- Badges overlay trên media là sibling của image link, **không nested anchors** (060 §5.2); overlay phải là sibling của image link khi cần, **không nested anchors**; thiếu term → không render empty overlay.
- Ratio: nhánh related tự render class ratio trên wrapper card (`skvn-collection--ratio-{n}`) vì không có section Collection bọc ngoài. **Check bắt buộc** (bài học state owner trong module file): CSS selector trong `assets/css/product-card.css` phải match đúng phần tử render — verify từng ratio value, không suy từ class tồn tại trong source.
- Không query, không tạo Swiper, không output `li`/`swiper-slide`/container Collection; caller đưa WC_Product vào.
- Enqueue card-only CSS qua helper có sẵn ở cards.php ~592–607 (đối chiếu symbol khi code); theme chỉ enqueue khi `is_product()` && `skvn_marine_blocks_pdp_related_is_active( $resolved )` && plugin API có. Không Swiper/editor JS.

## 6. Copy card settings from Product Collection (làm v1)

Nơi: trong panel group `related` của Theme Design (§7). D2: copy một lần, **not linked to source block**, không parse block mỗi PDP request.

- UI: Toggle đầu panel `Use SKVN related cards` (`useCustomRelatedCard`). `SelectControl` "Source page" liệt kê các page published có chứa block `skvn-marine/product-collection` + nút `Copy card settings` + help: **"Uses the first Product Collection block on the page only."** + notice sau copy: "Copied. Not linked to the source block." Presentation controls (trừ owner toggle) **disabled** khi `useCustomRelatedCard` false.
- Server (plugin, capability `manage_options` + nonce):
  - Danh sách page: WP_Query native `post_type=page`, `post_status=publish`, ≤200, không custom SQL; **lọc PHP** `str_contains( post_content, '<!-- wp:skvn-marine/product-collection' )` (tránh false negative của WP search). Runbook ghi nên dùng trang có **một** block mẫu.
  - `parse_blocks` trang được chọn → **DFS document order** (`innerBlocks` kể cả Group/Columns) lấy attrs block product-collection **đầu tiên** → map CHỈ key nằm trong schema §3 (trừ `useCustomRelatedCard` từ block) → sanitize từng key bằng cùng hàm §4 → merge với option hiện tại → set `useCustomRelatedCard` **true** → ghi option `skvn_pdp_related` → trả snapshot mới.
  - **Không copy**: `categories`, `tags`, `relation`, `orderMode`, `layout`, `heading`, `eyebrow`, `itemsToShow`, responsive preset, autoplay, typography token keys (chưa có trong schema v1 — ghi limitation trong UI help text).
- Không có page nào khớp: select hiện trạng thái rỗng, không nút bấm được.

## 7. Theme integration — Related loop (Woo native giữ query owner)

File mới `inc/pdp-related.php` + template-part mới `inc/templates/related-product-card.php`. **Không sửa** `inc/woocommerce.php`.

- Args filter `woocommerce_output_related_products_args`: chỉ khi `skvn_marine_blocks_pdp_related_is_active( $resolved )` → `posts_per_page = relatedCount`, `columns = min( max( relatedCount, 1 ), 4 )` (clamp 1–4); order/IDs/orderby giữ Woo. Inactive → trả args nguyên vẹn.
- Rendering: flag-scoped template swap **chỉ trong related loop** (mirror 060 §11): `woocommerce_before_related_products` bật flag → filter `wc_get_template_part` cho `content-product` trỏ template-part related (gọi presenter context `related`) → `woocommerce_after_related_products` gỡ flag (try/finally, restore an toàn khi exception).
- Giữ các Woo loop actions; suppress chỉ known core/fallback presentation callbacks trong từng item và restore priorities — same inventory as 060 §11 (đối chiếu hooks thật theo Woo version P0).
- Fallback: inactive, thiếu plugin API (`function_exists` guard), hoặc theme template thiếu → related render native Woo nguyên vẹn, không fatal, không enqueue card CSS. Plugin inactive → **không** template-swap dù theme getter có default §3.
- Heading "Related products" giữ native Woo; không thêm key đổi heading.
- Enqueue card assets: conditional `is_product() && is_active && plugin API có`; dùng filemtime versioning. Layout cột: owner Woo `columns` arg khi active; runbook same-build kiểm 3–4 items desktop/mobile (grid theme cho native path không đổi trong scope này).
- WooCommerce class vắng: không filter args, không swap template, không body class.

Đọc trước khi code: `docs/standards/css-layout-safety-contract.md`, `docs/standards/gutenberg-block-extension-css-contract.md` (nếu chạm render filter), `docs/standards/security-guidelines.md` (option/meta output path).

## 8. Theme Design group `related` + contract

Mirror plan067 §18 (nhánh `product`), thay owner bằng `related`:

- `modules/typography-settings/typography-settings.php`:
  - Owner map: `related` → option `skvn_pdp_related`; sanitize dedicated (không chạy vòng hex của palette); so khớp sau ghi dùng cùng hàm related; revision `skvn_marine_blocks_design_revision()` trên mảng **15 key** đã sanitize; capability `manage_options` (nhánh non-fonts).
  - `skvn_marine_blocks_design_snapshot()`: nếu contract có `related` → `groups.related` = value sanitize + revision + `canEdit`; thiếu capability → không có key.
  - AJAX save allowlist thêm `related`; validate riêng: 15 key, enum string trong allowlist, bool JSON thật (không nhận chuỗi), `displayTagLimit`/`relatedCount` int trong bounds; sai → 400, draft giữ.
- `inc/customizer.php` `skvn_marine_design_sidebar_contract()`: thêm capability `related`; giữ `version => 1` (array_diff fail cho đến khi theme kèm capability — hai file cùng lượt, như plan067).
- `src/design-sidebar/theme-design.tsx`:
  - `Group` thêm `'related'`; `Values` nhận boolean; `hasDraft` + mảng panel map thêm `related`; label group `Related products`.
  - Controls (label tiếng Anh, text domain `skvn-marine-blocks`, không hex, không px): Toggle `Use SKVN related cards` (`useCustomRelatedCard`); Select cho `imageRatio` (1:1, 4:3, 3:2, 16:9, Auto), `mediaLayout` (Flush, Padded, Floating), `chipStyle` (Tag, Hashtag, Dot, Plain), `chipColorScheme` (palette options + None), `productActionMode` (View product, Request quote, Both, Custom URL); Toggle cho `showImage`, `showProductTags`, `showProductCategories`, `showSpecChips`, `chipAllowTags`, `chipAllowCategories`; TextControl number bounded cho `displayTagLimit` (0–10, help: "0 shows all terms") và `relatedCount` (1–10); TextControl cho `customActionUrl` (chỉ bật khi mode Custom). Khi `useCustomRelatedCard` false: controls kia disabled (toggle owner vẫn bật).
  - Phần D4 riêng: heading phụ "Chip sources (allowlist)" + help "Terms come from each related product. No fixed term picklist." `chipAllowTags` **disabled** khi `showProductTags` false; `chipAllowCategories` **disabled** khi `showProductCategories` false.
  - Copy action UI (§6). Panel chỉ render khi snapshot có `groups.related`; conflict/Discard dùng cơ chế group sẵn có, bool hiện On/Off.

## 9. Per-product panel + classic meta box

Mirror plan067 §19:

- `skvn-marine-blocks.php`: một `require_once __DIR__ . '/modules/pdp-related-settings/pdp-related-settings.php';`
- Module PHP: `register_post_meta( 'product', '_skvn_pdp_related', single, type object, auth_callback edit_post, show_in_rest schema = override + 15 key, additionalProperties false, enums trong schema, sanitize_callback = skvn_marine_blocks_sanitize_pdp_related_meta )` trên `init`.
- `src/pdp-related/panel.tsx` (mới), import từ `src/index.ts` (một dòng) — không thêm entry webpack:
  - `PluginDocumentSettingPanel` name `skvn-pdp-related`, title `Related products`; chỉ khi post type `product`.
  - `useEntityProp( 'postType', 'product', 'meta' )`; meta không phải object → coi `{ override: false }`.
  - Toggle `Override related products`; bật → `override: true` + 15 default cho key thiếu; tắt → ghi đúng `{ override: false }`. Khi override: mirror UX §8 (`useCustomRelatedCard` + chip allowlist disabled rules).
  - `override !== true`: controls disabled + dòng `Using the site default.`; nút `Use site default` → `{ override: false }`.
  - Không nút Save riêng — dirty đi theo Update sản phẩm; xếp dọc, keyboard native.
- Classic editor: meta box cùng field/label, nonce `skvn_pdp_related_nonce`, `save_post_product` guard (nonce + autosave + `edit_post`), `update_post_meta` với sanitize meta; block editor không gửi nonce này nên handler return.

## 10. Gói làm

| Gói | Việc | File | Xong khi |
|---|---|---|---|
| P1 | Schema + sanitize + resolve + module + theme mirror | `modules/pdp-related-settings/pdp-related-settings.php` (mới), `inc/pdp-related.php` (mới, chỉ sanitize/getter), 2 require/include (plugin main, theme functions) | Đọc-lai theo bảng input/output plan067 §16 style: rác → default; override false bỏ meta; override true không kéo key site |
| P2 | Theme Design group + copy action + contract | `typography-settings.php`, `theme-design.tsx`, `inc/customizer.php` | Save group `related` ra option riêng; revision lệch không ghi; copy action ghi option và không link source |
| P3 | Per-product panel + classic | `src/pdp-related/panel.tsx` (mới), `src/index.ts` (1 import), module PHP (meta + meta box) | Override save/reopen/reset đúng; classic cùng field |
| P0 | Preflight (trước P4) | Runbook + onsite/local fixture | Gate grouped specs: PDP expose đủ attribute values (060 §5.1); hook/template map Woo installed version (060 §11 P0). FAIL → decision memo, không mở P4. |
| P4 | Related loop integration + template-part + presenter nhánh | `inc/pdp-related.php` (phần hook), `inc/templates/related-product-card.php` (mới), `cards.php` (nhánh `related`), `functions.php` include | `useCustomRelatedCard` false → native; active → card SKVN; columns/count theo §7; fallback không fatal; selector CSS match element thật |
| P5 | Runbook | `docs/testing/pdp-related-card-1.3.22.md` (mới) | Human duyệt runbook; build/lint human chạy (§13) |

Không commit trừ khi human yêu cầu; không tự build/lint/deploy. Mỗi phiên = một gói, dừng sau khi gói xong (pattern plan067 §12).

## 11. Deferred (không làm v1)

- **Upsells** dùng cùng presenter (D5 "nếu cùng presenter").
- **Intersection bật** — highlight term trùng SP đang xem; v1 không có key, không code nhánh bật (D4 mặc định off).
- **Token typography/color** theo vai trò card (`titleFont*`, `detailsFont*`, `action*`) — v1 theme-styled default; copy action không copy các key này (limitation ghi trong UI).
- `relatedOrderBy`, **UI `columns` riêng** (v1 derive từ `relatedCount` clamp 1–4), `appendQuoteContext`, specs mode key, `badgeBehavior` key, picklist term ID (rejected vĩnh viễn theo D2/D4).
- Ratio controls 060§12 vẫn scope kế tiếp riêng; plan này không mở ratio setting archive.

## 12. Files allowed / forbidden

**Allowed (plugin):** `modules/pdp-related-settings/pdp-related-settings.php` (mới), `skvn-marine-blocks.php` (1 require), `src/pdp-related/panel.tsx` (mới), `src/index.ts` (1 import), `src/design-sidebar/theme-design.tsx`, `modules/typography-settings/typography-settings.php`, `modules/collection-render/cards.php` (nhánh `related`).

**Allowed (theme):** `inc/pdp-related.php` (mới), `inc/templates/related-product-card.php` (mới), `functions.php` (1 include), `inc/customizer.php` (1 capability), `assets/css/product-card.css` của plugin chỉ khi selector ratio/chip cần rule scoped (đọc css-layout-safety contract trước, một owner width).

**Forbidden:** `themes/generatepress/**`; `inc/woocommerce.php`; `inc/product-design.php` + `modules/product-design/*` (của plan067); block.json/schema block Collection; saved content các block hiện có; `style.css` theme (không cần rule mới ngoài product-card.css scoped).

Hơn 5 file do multi-surface (schema/UI/panel/loop/presenter) — documented, tách gói P1–P5.

## 13. Acceptance REL-* — tất cả Chưa làm

| ID | Nhóm | Expected | Kiểm / evidence |
|---|---|---|---|
| REL-UI-01 | Block UI | Card related (chỉ khi `useCustomRelatedCard` true) cùng design family Collection (title/chips/grouped specs/CTA), ratio 1:1 default, CTA `productActionMode` onsite review, không nested link; layout cột khớp `columns` clamp | Same-build screenshots PDP desktop/mobile/zoom 200%; DOM link validation |
| REL-UI-02 | Block UI | Chips theo term từng SP; cap `displayTagLimit` + `+N` informational; allowlist off → không chip; category chip chỉ khi bật | Fixtures 0/1/nhiều tag, SP có category; keyboard/touch; không picklist giả |
| REL-UX-01 | Editor UX | Theme Design group `related`: owner toggle; save/discard/revision conflict đúng; Copy action: first block only notice, copy bật `useCustomRelatedCard`; sửa source block sau đó KHÔNG đổi related (not linked) | Save/reopen; copy rồi edit block, so option; evidence video/ảnh |
| REL-UX-02 | Editor UX | Per-product panel: override on/off, Use site default, reopen còn meta; classic editor cùng field; SP không override theo option site | Editor + classic fixture; save lỗi giả nếu gây được |
| REL-TECH-01 | Technical | `useCustomRelatedCard` false (kể cả option saved defaults) → Woo native, không enqueue card CSS; plugin API vắng → không swap/enqueue; Woo off → không fatal | Fixture toggle off / plugin off; network request check |
| REL-TECH-02 | Technical | Khi active: args đổi `posts_per_page` + `columns` clamp; inactive: args nguyên; order/IDs giữ Woo; archive/grid/carousel/post card không regression (AC-TECH02/03 060 giữ) | So sánh before/after cùng fixture; regression runs |
| REL-TECH-03 | Technical | Sanitize/escape/permissions: `manage_options` cho option + copy action, `edit_post` cho meta; key lạ bỏ; int bounds đúng; không leak query attrs | Malicious fixtures option/meta/copy payload; role không đủ quyền nhận lỗi |
| REL-TRACE-01 | Technical | Plan067 checklist không bị tick từ scope này; 1.3.5 checklist giữ nguyên; deferred baseline 1.3.20 chạy trước runtime follow-up | Đối chiếu MILESTONES §1.3.22 + register carry |

**Gate grouped specs (P0):** trước P4 và trước khi coi REL-UI-01 PASS phải xác nhận detail page expose đủ attribute values (gate 060 §5.1). FAIL → dừng, decision memo full-values fallback — không tự đổi schema.

## 14. Runbook & build

- Runbook: `docs/testing/pdp-related-card-1.3.22.md` — fixtures: SP có tags + categories + attributes nhiều values; SP không tags; SP không attributes; `useCustomRelatedCard` off vs on; override on (kể cả tắt owner trên SP); một page **một** Product Collection (copy action); P0 PDP attribute gate; plugin-off fixture. Steps/expected/pass-fail/evidence per ID; human điền URL + version sau build.
- Human chạy build/lint khi source thay đổi (agent không tự chạy):

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

```bash
php -l wp-content/themes/skvn-marine/inc/pdp-related.php
```

```bash
php tools/tests/pdp-related-sanitize.test.php
php tools/tests/pdp-related-copy-blocks.test.php
```

- Module PHP mới nằm ngoài `build/` — trước zip/upload human chạy `node tools/build-deploy-artifact.mjs` + `bash tools/package-plugin-zip.sh` và kiểm zip có `modules/pdp-related-settings/pdp-related-settings.php` + `inc/templates/related-product-card.php` theo deploy artifact workflow.
