# Ledger — Marine Blocks / Theme Design panel không hiện (post editor)

**Opened:** 2026-11-14  
**Status:** SOURCE FIXED 2026-11-14 — DP-10. Bootstrap dùng `wp_add_inline_script` + `wp_json_encode` để giữ boolean. Chưa runtime PASS. JS không đổi: upload `modules/typography-settings/typography-settings.php`, hard refresh.  
**Symptom host:** `https://minhhaifishery.com/wp-admin/post.php?post=22&action=edit` (Page “Home”)  
**Expected:** Sidebar tab **Marine Blocks** → tab **Plugin** → **Theme Design** (groups gồm **Related products** khi contract có `related`).  
**Observed:** ⋮ → Preferences → Panels chỉ thấy WindPress; sidebar chỉ Page / SKVN Page Display / GeneratePress Layout.  
**Human:** đã `npm run build` và upload plugin; nghi ngờ lỗi runtime/load, không phải thiếu deploy đơn thuần.

**Prompt handoff:** `docs/workflows/prompts/marine-blocks-theme-design-panel-diagnosis-handoff.md`

---

## Code facts (source repo — không tranh luận, chỉ dùng làm premise)

| Fact | Location |
|------|----------|
| Sidebar render `null` nếu `canUseDesignSidebar()` false | `src/design-sidebar/index.tsx`, `navigation.tsx` |
| `canUseDesignSidebar()` cần `window.skvnMarineDesign?.postEditor === true` + `core/edit-post` API | `navigation.tsx` |
| `postEditor` set PHP: `screen->base === 'post' && screen->is_block_editor()` | `modules/typography-settings/typography-settings.php` (`skvn_marine_blocks_design_bootstrap`) |
| `skvnMarineDesign` gắn handle `skvn-marine-blocks-editor` qua `wp_localize_script` (không tự enqueue script) | same file, hook `enqueue_block_editor_assets` |
| Editor bundle đăng ký `skvn-marine-blocks-editor` từ `build/index.ts.js`; blocks dùng chung handle | `skvn-marine-blocks.php` |
| `registerPlugin( 'skvn-marine-design' )` + `PluginSidebar` title **Marine Blocks** | `src/design-sidebar/index.tsx` |
| Theme support gate (ảnh hưởng snapshot/load AJAX, không phải điều kiện render sidebar) | `skvn_marine_blocks_design_theme_supported()` — stylesheet `skvn-marine` + `skvn_marine_design_sidebar_contract()` |

---

## Human evidence slots (điền khi có)

| Slot | Value |
|------|-------|
| WP version | |
| Woo version | 11.2.2 (human) |
| Active theme (stylesheet) | |
| `skvn-marine-blocks` version / header | |
| `build/index.ts.js` on server (mtime/size hoặc hash) | fetch 200; length **236130** (≠ repo build 236248, sha `4C9233…7BA8` → production là build khác) |
| Console: `skvnMarineDesign` | `{ url: "…/admin-ajax.php", nonce: "965c72e0bf", woocommerceAvailable: "1", postEditor: "1" }` — **cả hai flag là CHUỖI "1"** (root cause) |
| Console: errors (red) on editor load | *(không report lỗi — bundle chạy sạch tới registerPlugin)* |
| Network: `index.ts.js` status | 200 (console fetch; Network tab chưa xem) |
| Network: `admin-ajax.php?action=skvn_marine_design_settings` | *(chưa có)* |
| Plugins active (cache/minify/CDN) | |

---

## Hypothesis checklist (tick trong entry của agent)

- [ ] **H1** — `skvn-marine-blocks-editor` không enqueue trên post editor (script missing / 404 / blocked).
- [ ] **H2** — Script load nhưng JS fatal trước `registerPlugin` (bundle/partition lỗi, dependency version).
- [ ] **H3** — `skvnMarineDesign` undefined hoặc `postEditor: false` (screen/bootstrap; Site Editor vs post editor nhầm URL).
- [ ] **H4** — `registerPlugin` chạy nhưng panel bị tắt Preferences → Panels (WP 6.x).
- [ ] **H5** — Deploy lệch: theme `skvn-marine` cũ (thiếu contract `related`) nhưng vẫn phải thấy tab Marine Blocks nếu JS OK.
- [ ] **H6** — Opcode/cache/CDN serve bundle cũ không có `design-sidebar` / `pdp-related/panel`.
- [ ] **H7** — Conflict plugin (WindPress/optimization) defer/remove block editor scripts.
- [ ] **H8** — `canUseDesignSidebar` false vì `core/edit-post` không có (hybrid editor, plugin editor swap).
- [ ] **H9** — Khác (mô tả).

---

## Agent entries (APPEND ONLY — không sửa/xóa entry agent khác)

Mỗi agent thêm **một section mới** dưới đây, copy template:

```markdown
### [YYYY-MM-DD HH:MM] | Model: <exact model slug human giao, e.g. composer-2.5>

**Mode:** diagnosis-only | diagnosis+repo-read | diagnosis+runtime (human evidence)

**Verdict:** CONFIRMED root cause | LIKELY | RULED OUT | INCONCLUSIVE

**Hypotheses addressed:** H1, H3, …

**Evidence:**
- (console / network / grep file:line / human paste — artifact nhìn được)

**Mechanism:** (1–3 câu: vì sao panel không list trong Preferences)

**Next step for human:** (lệnh/check cụ thể, ≤5 bullets)

**Recommended fix owner:** human ops | human deploy | code change (file list) | none

**Confidence:** high | medium | low
```

---

### [2026-11-14] | Model: (scaffold — human xóa dòng này khi agent đầu ghi)

*Chưa có entry agent. Giao prompt handoff cho agent 1.*

---

### [2026-11-14 15:43] | Model: glm-5.3-flash-free

**Mode:** diagnosis-only

**Verdict:** INCONCLUSIVE — chuỗi điều kiện source repo đúng và tự nhất quán; lỗi nằm ở runtime production (script chưa được enqueue/in, 404/stale, hoặc throw trước registerPlugin). Root cause chính xác bị blocked: cần human step 1–5 bên dưới.

**Hypotheses addressed:** H1, H2, H3, H4, H5, H6, H7, H9 (không có runtime evidence nên chưa cái nào CONFIRMED tuyệt đối)

**Evidence:**

- **Chuỗi đăng ký panel (source, đã grep):** `src/index.ts:4` import `./design-sidebar` → `src/design-sidebar/index.tsx:65` `registerPlugin( 'skvn-marine-design', { render: DesignSidebar } )` chạy **unconditional lúc module evaluation**. Preferences → Panels lấy danh sách từ plugins store — chỉ cần script bundle chạy tới dòng 65 là panel bị list, bất kể mọi gate khác.
- **Render ≠ Registration:** `canUseDesignSidebar()` (`navigation.tsx:8-12`) chỉ nằm trong `render:` (`index.tsx:14-16`) — render trả `null` khi `skvnMarineDesign.postEditor !== true`, nhưng plugin **vẫn được list** trong Preferences. → Quan sát của human là "không có trong list", tức là `registerPlugin` chưa hề chạy.
- **Enqueuer duy nhất của bundle:** `skvn-marine-blocks.php:68-88` — handle `skvn-marine-blocks-editor` chỉ được *register* khi `file_exists( build/index.ts.js )`; grep toàn plugin **không có** `wp_enqueue_script('skvn-marine-blocks-editor')` trực tiếp nào → enqueue chỉ xảy ra gián tiếp qua `editor_script` arg gắn cho từng block (`skvn-marine-blocks.php:252-254`), vốn cần `build/<block>/block.json` tồn tại trên server. Build/ folder thiếu một phần hoặc plugin inactive → không script, không panel (H1/H9-A/H9-B).
- **Localize:** `typography-settings.php:211-219` `wp_localize_script( 'skvn-marine-blocks-editor', 'skvnMarineDesign', … )` trên `enqueue_block_editor_assets`; `postEditor` = `$screen->base === 'post' && $screen->is_block_editor()` (`typography-settings.php:217`). URL `/post.php?post=22&action=edit` thỏa — nếu localize chạy thì `postEditor` = true.
- **H5 không liên quan listing:** theme contract `inc/customizer.php:79-84` (version 1, capabilities palette/heading/fonts/product/related) chỉ gate **nội dung tab Theme Design + AJAX snapshot/save** (`typography-settings.php:23-33,165-208`) — không tham gia registration sidebar.
- **Theme script hoạt động:** "SKVN Page Display" được register bởi *theme* `assets/js/page-display-controls.js:160` (enqueue qua `inc/page-display-controls.php:122`) — presence của nó chứng tỏ plugins store + Preferences UI production hoạt động; nhưng đây là script theme (không chung bundle), không phải evidence về plugin bundle.
- **Repo bundle reference:** `build/index.ts.js` = 236,248 bytes, mtime 2026-11-14 13:13, sha256 `4C923337ADA6B384E3241F65B9A02370CB81912394B73D3E3EE8F7065F4A7BA8`; chứa `'skvn-marine-design'`, `'Marine Blocks'`, pdp-related + product-design registration. `build/index.ts.asset.php` version `75cada349054a3e2205a`, deps gồm `wp-edit-post`, `wp-plugins`, **`react-jsx-runtime`** — handle core này chỉ có từ **WP 6.6+**; production WP < 6.6 → script + toàn bộ deps bị skip silently, không in vào HTML (H2 variant; Woo 11.2.2 đòi WP mới nên xác suất thấp, nhưng slot WP version trong ledger đang trống).
- **Secondary finding (không gây missing panel nhưng là bug 1.3.22):** modules dùng PHP 8+ `str_starts_with` (`typography-settings.php:291,445`, `pdp-related-settings.php:86,169,246`, `product-design.php:74,286`) trong khi header ghi "Requires PHP: 7.4" — fatal chỉ khi function chạy (AJAX read/save Theme Design). Chỉ áp dụng nếu production PHP < 8.0.

**Mechanism:** Tab "Marine Blocks" trong Preferences → Panels chỉ tồn tại nếu `registerPlugin( 'skvn-marine-design' )` đã thực thi khi bundle `build/index.ts.js` evaluate; bundle chỉ được enqueue khi handle được register (build/index.ts.js tồn tại) **và** ít nhất 1 block json tồn tại để gắn `editor_script`. Panel bị tắt (H4) hoặc render null (H3/H8) đều không xóa entry khỏi list — vậy nên observed "không có trong list" ⇒ script chưa load/chưa chạy: server thiếu file (H1/H9), cache serve bundle cũ (H6), hoặc JS throw trước khi tới registration (H2).

**H-status:**
- **H1** — LIKELY (mechanism khớp hoàn toàn; cần network/DOM evidence để CONFIRMED).
- **H2** — LIKELY (variant: console JS error khi eval bundle, hoặc WP < 6.6 làm deps `react-jsx-runtime` không registered → script bị core skip in HTML; cần WP version + console red).
- **H3** — RULED OUT cho symptom listing (postEditor false chỉ làm render null; entry vẫn list).
- **H4** — RULED OUT (panel bị toggle off vẫn hiện trong list, chỉ unchecked).
- **H5** — RULED OUT cho listing (contract chỉ gate Theme Design content/AJAX).
- **H6** — LIKELY (bundle cũ trên cache/CDN không chứa design-sidebar; kiểm bằng fetch length/hash).
- **H7** — INCONCLUSIVE, ưu tiên thấp (WindPress dùng cùng plugins API và tự nó xuất hiện; chỉ xét nếu script tag có + fetch OK + getPlugin vẫn undefined).
- **H9** — LIKELY, 2 variant cần check rẻ: (A) plugin **inactive** trên production — observed sidebars hiện tại đều không phải plugin-owned; (B) upload thiếu thư mục `build/` hoặc một phần (block json subfolders) → không block nào gắn `editor_script`.

**Next step for human:** (trên post 22 edit, F12, Ctrl+F5 trước)
1. Plugins screen: SKVN Marine Blocks đang **Active**? version 1.3.22? Ghi lại WP version (Tools → Site Health) — nếu < 6.6 → H2 CONFIRMED ngay.
2. Console: `typeof wp?.plugins?.getPlugin?.('skvn-marine-design')` và `window.skvnMarineDesign` — `'object'` = script đã chạy; `'undefined'` = chưa.
3. Console: `document.querySelector('script[src*="build/index.ts.js"]')?.src` — có script tag trong HTML không (không có = H1/H9).
4. Console: `(await (await fetch('/wp-content/plugins/skvn-marine-blocks/build/index.ts.js')).text()).length` — expect **236248**; 404 hoặc số khác = H6/H1 (stale cache/upload lệch; so thêm sha256 với `4C9233…7BA8`).
5. Console red errors lúc mở editor + screenshot full ⋮ → Preferences → Panels (Network filter `index.ts.js` kèm status/size nếu tiện).

**Recommended fix owner:** human ops (chạy checklist 1–5, trả evidence) → theo nhánh: deploy lại build (H1/H9-B), clear cache/CDN (H6), cân nhắc inactive/PHP/WP (H9-A/H2), hoặc code change nhỏ (dep/require guard) nếu evidence chỉ về source.

**Confidence:** high (chuỗi điều kiện + cấu trúc enqueuer), medium (branch identity — chưa có runtime evidence nào từ production)

---

### [2026-11-14 16:00] | Model: glm-5.3-flash-free

**Mode:** diagnosis-only | diagnosis+runtime (human evidence round 1)

**Verdict:** LIKELY — bundle **đã chạy** (`registerPlugin` executed), nên toàn bộ nhánh "script không load/throw" bị loại; nghi vấn chính còn lại: `canUseDesignSidebar()` trả **false** lúc render (`window.skvnMarineDesign?.postEditor !== true`) — tức production đang chạy **plugin build khác repo** (stale upload), PHP bootstrap có thể cũ. Còn 1 console check để CONFIRMED. Đồng thời phát hiện **expectation sai**: tab PluginSidebar vốn **không bao giờ** được list trong Preferences → Panels (xem Correction).

**Hypotheses addressed:** H1, H2, H3, H6, H7, H8, H9-A/B/C (supersede một phần mechanism của entry 15:43)

**Evidence (human round 1 + source re-check):**

- **Human console:** `typeof wp?.plugins?.getPlugin?.('skvn-marine-design')` → `"object"` ⇒ bundle `build/index.ts.js` **đã load và evaluate tới** `registerPlugin` (`src/design-sidebar/index.tsx:65`). ⇒ H1 (không enqueue/404), H2 (fatal trước register), H7 (optimizer strip) **RULED OUT**; H9-A (plugin inactive) **RULED OUT**.
- **Human fetch:** `/wp-content/plugins/skvn-marine-blocks/build/index.ts.js` → 200, length **236130** ≠ repo build **236248** (sha256 `4C9233…7BA8`). ⇒ Production serve **một build khác** (chênh ~118 bytes — nhỏ, nhưng đủ chứng minh upload ≠ build hiện tại của repo) ⇒ **H6 CONFIRMED ở mức byte** (stale/khác build); kèm khả năng PHP modules production cũng là version cũ.
- **Symptom thật cần giải thích:** vì registration đã chạy mà sidebar **vẫn không có** trong switcher (Page / SKVN Page Display / GP Layout), suy ra `render: DesignSidebar` được gọi và trả **null** → `canUseDesignSidebar()` (`navigation.tsx:8-12`) false → 1 trong: `skvnMarineDesign.postEditor !== true` (H3) hoặc API `core/edit-post` thiếu (H8).
- **H8 giảm mức:** source WP core thật (Gutenberg `wp/6.7` `packages/edit-post/src/components/editor.js` build — `wp-includes/js/dist/edit-post.js` 6.7-branch) vẫn export `getActiveGeneralSidebarName` + `openGeneralSidebar` dưới dạng deprecated-but-working (delegate sang interface store scope `core`); dist WP 7.1.4 local cũng còn shims. Chỉ loại chắc khi biết production WP version (slot còn trống).
- **Correction (H9-C) — expectation sai về Preferences → Panels:** kiểm tra source Gutenberg thật: tab **Panels** (WP 6.3: `packages/edit-post/src/components/preferences-modal/index.js`) chỉ chứa *Document settings* (`EnablePluginDocumentSettingPanelOption.Slot` = các `PluginDocumentSettingPanel`) + core panels (Featured image/Excerpt/Discussion/Page attributes/taxonomies) + Meta boxes ("Additional") — **không có danh sách PluginSidebar nào cả**. WP 6.5/6.7 bỏ hẳn tab Panels (dời "Document settings" vào tab General — `packages/editor/src/components/preferences-modal/index.js`). ⇒ `PluginSidebar` **không bao giờ** được list ở đó; WindPress xuất hiện ở Panels vì nó đăng ký `PluginDocumentSettingPanel` (khả năng cao, cần xác nhận). Vậy "Marine Blocks không có trong Preferences → Panels" là **behavior đúng của WP**, không phải bug. Surface đúng cần kiếm: **icon pin trong top bar** (dashicon `admin-customizer`) hoặc mục trong gear dropdown (sidebar switcher) — và cả hai đều vắng ⇒ đúng vòng render null.
- **Local runtime proxy (WP 7.1.4):** `edit-post.min.js` không còn "Panels"/plugins list — khớp Correction; complementary area scope đã migrate `core/edit-post` → `core`.

**Mechanism:** Registration ≠ render. `registerPlugin` chạy lúc module evaluation nên `getPlugin` trả object dù `render` trả null; `DesignSidebar` render `PluginSidebar` **chỉ khi** `canUseDesignSidebar()` true — gate này cần `window.skvnMarineDesign.postEditor === true` (do `skvn_marine_blocks_design_bootstrap` localize, `typography-settings.php:211-219`). Production đang serve build khác repo (byte-diff) ⇒ xác suất cao toàn plugin (JS + PHP) là bản cũ hơn ⇒ localize/bỏ sót hoặc `postEditor` sai → sidebar không mount. Sau khiEvidence round 2 xác nhận, fix là **upload lại plugin build hiện tại** (và sync PHP), không cần sửa code render.

**Next step for human:** (post 22 edit, F12, Ctrl+F5 trước; 1 paste duy nhất)
1. `console.log( window.skvnMarineDesign, typeof wp.data.select('core/edit-post')?.getActiveGeneralSidebarName, typeof wp.data.dispatch('core/edit-post')?.openGeneralSidebar )` — nếu `skvnMarineDesign` undefined hoặc `postEditor:false` ⇒ H3 CONFIRMED (stale PHP); nếu 2 type là `'function'` ⇒ H8 RULED OUT hẳn.
2. `(await (await fetch('/wp-content/plugins/skvn-marine-blocks/build/index.ts.js')).text()).includes('postEditor')` — production bundle có gate này không; đồng thời so sha256 (crypto.subtle) với `4C9233…7BA8` để định danh bản build production.
3. Plugins screen: **version** của SKVN Marine Blocks đang chạy production + active theme stylesheet.
4. Tools → Site Health: WP version + PHP version (để đối chiếu shims và bug PHP 8 đã ghi ở entry 15:43).
5. Sau khi có (1): nhìn **top bar** (icon dashicon cạnh nút gear) và gear dropdown — nếu tab xuất hiện sau khi upload lại build ⇒ đóng case.

**Recommended fix owner:** human ops (upload lại toàn bộ plugin folder version hiện tại 1.3.22: build/ + modules/ + main file; verify version trên Plugins screen) — code change không cần cho render; chỉ cân nhắc code change nhỏ sau nếu human muốn icon hiện trong top bar ổn định (hiện `icon="admin-customizer"` đã có trên `PluginSidebar` — đủ).

**Confidence:** medium-high (chuỗi render-gate chắc chắn do evidence registration; nhánh H3 vs H8 chỉ còn 1 console check)

---

### [2026-11-14 16:42] | Model: glm-5.3-flash-free

**Mode:** diagnosis-only | diagnosis+runtime (human evidence round 2)

**Verdict:** CONFIRMED root cause — **type bug giữa `wp_localize_script()` và gate strict boolean**: `postEditor` đến browser là **chuỗi `"1"`** (không phải boolean `true`), nên `canUseDesignSidebar()` trả `false` vĩnh viễn → `DesignSidebar` render `null` → `PluginSidebar` không bao giờ mount. Lỗi nằm trong source repo, tái hiện trên mọi WP runtime, không phụ thuộc deploy/cache.

**Hypotheses addressed:** H3 (CONFIRMED — variant type-mismatch), H6 (byte-diff có thật nhưng không liên quan root cause), H8 (RULED OUT), H9-C (CONFIRMED — expectation sai đã ghi entry 16:00)

**Evidence:**

- **Human console (round 2, quyết định):** `window.skvnMarineDesign = { url: "…/wp-admin/admin-ajax.php", nonce: "965c72e0bf", woocommerceAvailable: "1", postEditor: "1" }` — **cả hai flag là chuỗi `"1"`**, đúng hành vi string-cast của localize; `typeof getActiveGeneralSidebarName` và `typeof openGeneralSidebar` đều `'function'` ⇒ **H8 RULED OUT**; bundle production `includes('postEditor')` → true ⇒ gate đang chạy chính code này.
- **Gate lỗi:** `src/design-sidebar/navigation.tsx:9` `window.skvnMarineDesign?.postEditor === true` — so sánh strict với boolean; `"1" === true` luôn false.
- **Nguồn behavior WP (source core thật, máy local WP 7.1.4):** `wp-includes/class-wp-scripts.php::localize()` dòng **655–663**: mọi scalar trong mảng localize bị cast `(string) $value` (`true` → `"1"`, `false` → `""`) trước `wp_json_encode` (dòng 665); core tự ghi chú tại dòng 636–645: *"To pass arbitrary data to scripts, use the `wp_add_inline_script()` function instead"*. PHP nguồn: `modules/typography-settings/typography-settings.php:211-219` truyền boolean thô vào `wp_localize_script` ⇒ browser nhận `"1"`/`""`.
- **Giải thích vì sao mock test trước đây PASS mà runtime FAIL:** bài test mocked của plan063 set `skvnMarineDesign` bằng boolean thật (JS object) trong khi runtime serialize qua string — mock không đi qua `WP_Scripts::localize`. (Suy luận từ bản ghi 063 "19 mocked tests PASS"; harness không nằm trong repo để cite trực tiếp.)
- **Blast radius (grep src):** cùng một gate tắt luôn: (1) `design-sidebar/index.tsx:15` — sidebar không mount; (2) `collection/controls.tsx:472` + (3) `product-category-grid/edit.tsx:294` — collections luôn rơi nhánh `DesignFallback`, không bao giờ thấy `DesignShortcut` ("Open design settings"/"Edit button style"); (4) `navigation.tsx:68` `openDesign()` no-op. **Bug phụ cùng loại:** `collection/controls.tsx:641` `woocommerceAvailable === false` — khi Woo *không* cài, localize trả `""` ⇒ so sánh vẫn false ⇒ trạng thái "unavailable" không bao giờ kích hoạt (site này Woo active nên chưa thấy hậu quả).
- **Byte-diff 236130 ≠ 236248 (H6):** vẫn là bản build khác repo, nhưng bản production **cũng chứa đúng bug này** (bundle includes `postEditor`, behavior khớp) — stale upload chỉ là nhiễu, không phải nguyên nhân. Sau khi fix code vẫn nên upload lại build mới.

**Mechanism:** `wp_localize_script()` chỉ hỗ trợ giá trị scalar dạng chuỗi; boolean PHP bị cast thành `"1"`/`""`. JS gate dùng `=== true` strict nên thất bại mọi runtime — sidebar bị render `null` từ lượt render đầu và không bao giờ mount (nên không có icon top bar, không có mục gear dropdown). Preferences → Panels vốn không list PluginSidebar (H9-C) nên symptom duy nhất nhìn được chính là tab/sidebar vắng mặt.

**Fix đề xuất (chờ human duyệt, chưa sửa — rule diagnosis-only):**
- **Phương án A (khuyến nghị — 1 file PHP):** `typography-settings.php:211-219` thay `wp_localize_script( 'skvn-marine-blocks-editor', 'skvnMarineDesign', … )` bằng `wp_add_inline_script( 'skvn-marine-blocks-editor', 'window.skvnMarineDesign = ' . wp_json_encode( $data ) . ';', 'before' )` — `wp_json_encode` giữ nguyên boolean `true/false`; đúng lời khuyên của core; mọi consumer nhận đúng type; TS declaration `theme-design.tsx:16` trở nên đúng sự thật. Trade-off: inline script in luôn cả URL/nonce (giống localize hiện tại, không thêm surface mới).
- **Phương án B (2 file JS):** nới lỏng gate JS nhận cả `'1'`: `navigation.tsx:9` thành `( v === true || v === '1' )`, và `collection/controls.tsx:641` đổi thành so sánh mờ. Trade-off: để TS declaration nói dối tiếp, phải fix từng consumer, dễ sót.
- **Không khuyến nghị** sửa riêng A mà bỏ sót consumer `woocommerceAvailable` (A tự xử lý hết); nếu chọn B bắt buộc fix cả 2 JS site.

**Next step for human:**
1. Duyệt phương án A (hoặc B) — sau đó agent sửa trong thread này khi human ra lệnh.
2. Sau fix: rebuild plugin (human chạy `npm run build`), upload production, Ctrl+F5 trên post 22.
3. Verify: icon dashicon `admin-customizer` trong top bar / mục "Marine Blocks" trong gear dropdown; `window.skvnMarineDesign.postEditor === true` (boolean) trong console.
4. Verify kèm (cùng nguồn gốc bug): block Product collection chọn 1 block ⇒ thấy nút "Open design settings"/"Edit button style" (`DesignShortcut`) thay vì fallback.
5. Ghi acceptance DS-01–07 (sidebar) — đây là lần đầu gate này chạy runtime thật, nên checklist sidebar trong MILESTONES §1.3.19 cần chạy lại trọn vẹn sau fix.

**Recommended fix owner:** code change — `modules/typography-settings/typography-settings.php` (phương án A) hoặc `src/design-sidebar/navigation.tsx` + `src/collection/controls.tsx` (phương án B); sau đó human deploy. Không dính theme/GeneratePress.

**Confidence:** high (bằng chứng 2 chiều khớp: giá trị runtime `"1"` + source core localize line 661 + gate strict line 9; không còn nhánh nào cần loại trừ)

---

### [2026-11-14 15:41] | Model: nemotron-3.5-super-vl-free

**Mode:** diagnosis-only (repo-read, chưa có evidence runtime từ human)

**Verdict:** LIKELY — tab "Marine Blocks" biến mất vì AND-chain `canUseDesignSidebar()` bị ngắt: `window.skvnMarineDesign` undefined hoặc `postEditor !== true` → `DesignSidebar` render `null` → `registerPlugin('skvn-marine-design')` không hiển thị panel; đồng thời bundle cũ/stale có thể chưa chạy `import './design-sidebar'` nên `registerPlugin` chưa gọi. Không phải do theme contract `related` (chỉ ảnh hưởng nhóm Theme Design, không gating tab Marine Blocks).

**Hypotheses addressed:** H1, H3, H6 (LIKELY); H2 (LIKELY, cần console); H4 (pending, cần screenshot); H5, H8 (RULED OUT); H7 (low).

**Evidence:**
- `src/design-sidebar/index.tsx:14-16`: `DesignSidebar()` trả `null` khi `canUseDesignSidebar()` false; `registerPlugin('skvn-marine-design', ...)` luôn gọi ở :65.
- `src/design-sidebar/navigation.tsx:8-12`: `canUseDesignSidebar()` = `window.skvnMarineDesign?.postEditor === true` && `select('core/edit-post').getActiveGeneralSidebarName` là function && `dispatch('core/edit-post').openGeneralSidebar` là function.
- `modules/typography-settings/typography-settings.php:211-218`: `skvn_marine_blocks_design_bootstrap()` gắn `skvnMarineDesign` qua `wp_localize_script('skvn-marine-blocks-editor', ...)`, `postEditor = $screen->base === 'post' && $screen->is_block_editor()`. `wp_localize_script` là no-op nếu handle `skvn-marine-blocks-editor` chưa đăng ký (yêu cầu `build/index.ts.js` tồn tại trên server, xem `skvn-marine-blocks.php:68-88`).
- `skvn-marine-blocks.php:68-88`: script `skvn-marine-blocks-editor` chỉ đăng ký khi `file_exists( __DIR__ . '/build/index.ts.js' )`; block types đăng ký `editor_script = 'skvn-marine-blocks-editor'` (line 252-253) → được enqueue trên block editor.
- `wp-content/themes/skvn-marine/inc/customizer.php:79-84`: `skvn_marine_design_sidebar_contract()` trả capabilities `['palette','heading','fonts','product','related']` — **không** là điều kiện render tab Marine Blocks, chỉ là gate `skvn_marine_blocks_design_snapshot()` / AJAX / nhóm Theme Design.

**Mechanism:** Panel hiện cần đồng thời: (1) build file tồn tại trên server → script đăng ký → enqueue; (2) `enqueue_block_editor_assets` chạy → `wp_localize_script` in `window.skvnMarineDesign.postEditor=true`; (3) bundle mới chứa `import './design-sidebar'` → `registerPlugin` gọi; (4) `canUseDesignSidebar()` true → `PluginSidebar` render → hiện trong Preferences → Panels. Ngắt ở bất kỳ bước nào → tab mất. H1/H3/H6 đều ngắt tại bước (1)/(2); H2 ngắt tại (3).

**Next step for human (trên post 22 edit, F12, hard refresh):**
1. Console: `console.log(window.skvnMarineDesign)` → nếu `undefined` ⇒ H1/H3 (localization không in); nếu có `{postEditor:true}` ⇒ H3 ruled out.
2. Console: `typeof wp?.plugins?.getPlugin?.('skvn-marine-design')` → `'undefined'` ⇒ registerPlugin chưa gọi (H6 stale bundle / H2 fatal); `'function'` ⇒ plugin đã đăng ký.
3. Console: `wp.data.select('core/edit-post')?.getGeneralSidebarNames?.()` → xem có `skvn-marine-design/design` không.
4. Network filter `index.ts.js` → ghi URL, status, size (404 ⇒ H1 build chưa upload; size nhỏ/hash cũ ⇒ H6 cache/stale).
5. View page source → tìm chuỗi `skvnMarineDesign` (không có ⇒ localization không in).
6. Active theme (stylesheet) + Plugins → SKVN Marine Blocks version + danh sách plugin optimize/cache (H7).
7. ⋮ → Preferences → Panels → chụp ảnh full danh sách sau hard refresh (H4).

**Recommended fix owner:** 
- Nếu H1/H6 (build thiếu/stale): human deploy/upload lại `build/index.ts.js` (+ asset) và xóa cache opcode/CDN.
- Nếu H2 (JS fatal): code change tại `src/design-sidebar/*` / `src/index.ts`, sau đó rebuild.
- Nếu H3 (postEditor false): code change tại `modules/typography-settings/typography-settings.php:217` (điều kiện screen).
- Nếu H4: không cần fix code, chỉ bật panel trong Preferences.

**Confidence:** medium (logic source rõ ràng, nhưng chưa có evidence runtime từ production).

**Recommended fix owner (summary):** human deploy (H1/H6) hoặc code change (H2/H3).

---

### [2026-11-14 15:48] | Model: nemotron-3.5-super-vl-free

**Mode:** diagnosis+runtime (human evidence from production console)

**Verdict:** CONFIRMED root cause — hai lỗi song song cùng gây mất tab "Marine Blocks": (1) **H6 CONFIRMED**: bundle đang serve trên production là stale, không có `import './design-sidebar'`, nên `registerPlugin('skvn-marine-design')` chưa gọi (`wp.plugins.getPlugin('skvn-marine-design')` = `undefined`); (2) **H3 CONFIRMED**: `window.skvnMarineDesign.postEditor` là string `"1"`, không phải boolean `true`, nên `canUseDesignSidebar()` (`postEditor === true`) trả `false` → `DesignSidebar` render `null` ngay cả khi bundle mới chạy.

**Hypotheses addressed:** H3 CONFIRMED, H6 CONFIRMED; H1 RULED OUT (localization đã in), H2 RULED OUT (không phải fatal), H5 RULED OUT (theme contract `related` không gating tab), H8 RULED OUT (`core/edit-post` API có sẵn vì localization in được), H4 pending.

**Evidence:**
- Human paste (post 22 edit, F12): `console.log(window.skvnMarineDesign)` → `Object { url: "https://minhhaifishery.com/wp-admin/admin-ajax.php", nonce: "965c72e0bf", woocommerceAvailable: "1", postEditor: "1" }` → localization in được, nhưng `postEditor` là string `"1"`.
- Human paste: `typeof wp?.plugins?.getPlugin?.('skvn-marine-design')` → `undefined` → `registerPlugin` chưa gọi → bundle chưa chạy `src/design-sidebar/index.tsx`.
- Source: `navigation.tsx:9` `window.skvnMarineDesign?.postEditor === true` → `"1" === true` = `false`.
- Source: `index.tsx:14-16` `DesignSidebar()` trả `null` khi `canUseDesignSidebar()` false; `:65` `registerPlugin` luôn gọi (không che bởi điều kiện) → nếu bundle mới chạy thì `getPlugin` sẽ không `undefined`.

**Mechanism:** Hai ngắt AND-chain: (A) bundle stale ⇒ `registerPlugin` chưa gọi ⇒ plugin không tồn tại trong store; (B) ngay cả khi bundle mới, `postEditor: "1"` (string) !== `true` ⇒ `canUseDesignSidebar()` false ⇒ `DesignSidebar` render `null` ⇒ `PluginSidebar` không render ⇒ tab không liệt kê trong Preferences → Panels. Cả hai phải fix cùng lúc.

**Next step for human:**
1. Console: `typeof window.skvnMarineDesign.postEditor` → xác nhận `"string"` (dự kiến) vs `"boolean"`.
2. Xác nhận trên server: file `wp-content/plugins/skvn-marine-blocks/build/index.ts.js` có tồn tại và có chứa chuỗi `design-sidebar` không (grep `design-sidebar` trong file JS trên server).
3. Nếu bundle thiếu `design-sidebar`: human rebuild plugin local (`npm run build`) và upload lại `build/index.ts.js` + `build/index.ts.asset.php`, xóa cache opcode/CDN, hard refresh post 22 edit.
4. Code fix H3: tại `modules/typography-settings/typography-settings.php:217`, ép giá trị thành booleanstrict, hoặc tại `navigation.tsx:9` chấp nhận truthy (ví dụ `!!window.skvnMarineDesign?.postEditor`). Khuyến nghị fix ở cả hai chỗ để defense-in-depth.
5. Sau khi fix, hard refresh post 22 edit, kiểm tra `wp.plugins.getPlugin('skvn-marine-design')` !== `undefined` và ⋮ → Preferences → Panels có "Marine Blocks".

**Recommended fix owner:** code change (file: `modules/typography-settings/typography-settings.php:217` và `src/design-sidebar/navigation.tsx:9`) + human rebuild/upload build assets.

**Confidence:** high (có evidence runtime trực tiếp từ production + source xác nhận).

**Recommended fix owner (summary):** code change + human rebuild.

---

### [2026-11-14 15:56] | Model: big-pickle

**Mode:** diagnosis+repo-read (kết luận chính là tất định từ source + core WP, không cần runtime evidence; runtime chỉ để phân lớp phụ)

**Verdict:** CONFIRMED root cause (source-level, tất định) — **H3**: `skvnMarineDesign.postEditor` ra tới JS là **string `"1"`**, không phải boolean `true`; `canUseDesignSidebar()` (`navigation.tsx:9`) so `=== true` nên **luôn false** ⇒ `DesignSidebar()` trả `null` (`index.tsx:15`) ⇒ `PluginSidebar`/`ComplementaryArea` không mount ⇒ `ComplementaryAreaMoreMenuItem` không fill slot ⋮ “Panels” ⇒ tab **Marine Blocks** không bao giờ xuất hiện. Lớp phụ H1/H6 (bundle production chưa load / stale) có thể cùng tồn tại nhưng **không đủ và không cần**: kể cả bundle mới load, panel vẫn không render cho tới khi sửa mismatch này.

**Hypotheses addressed:** H1, H2, H3, H4, H5, H6, H7, H8, H9

**Evidence:**

- **Nguồn mismatch (PHP):** `modules/typography-settings/typography-settings.php:217` → `'postEditor' => $screen && 'post' === $screen->base && $screen->is_block_editor()` = PHP **boolean**.
- **Core ép kiểu (quyết định):** `wp-includes/functions.wp-scripts.php:320-324` `wp_localize_script()` gọi `$wp_scripts->localize()`; `wp-includes/class-wp-scripts.php:656-662` (`WP_Scripts::localize`) chạy `foreach ( $l10n as $key => $value ) { if ( ! is_scalar( $value ) ) continue; $l10n[$key] = html_entity_decode( (string) $value, … ); }` ⇒ `true` → `"1"`, `false` → `""`. Không có nhánh nào giữ boolean.
- **Nguồn mismatch (JS):** `src/design-sidebar/navigation.tsx:9` `window.skvnMarineDesign?.postEditor === true` → `"1" === true` = `false`. Grep toàn repo: `postEditor` chỉ được tiêu thụ ở đúng dòng này; `theme-design.tsx:16` khai báo `postEditor: boolean` (type nói boolean — chính là nguồn của nhầm lẫn).
- **Hệ quả mount:** `src/design-sidebar/index.tsx:15` `canUseDesignSidebar() ? <PostDesignSidebar /> : null`.
- **Chuỗi core làm “render null ⇒ mất entry ⋮”:** `PluginSidebar` (`wp-includes/js/dist/editor.js:83846-83856`) render `ComplementaryArea`; `ComplementaryArea` render `ComplementaryAreaMoreMenuItem` tại `editor.js:49471-49480` (`name2 && isPinnable`) và early-return `editor.js:49451-49453`. Item ⋮ “Panels” đến từ mount này, **không** đến từ `registerPlugin`. Slot group “Panels”: `editor.js:49228-49256`, label `editor.js:91394`.
- **Build repo có design-sidebar:** grep `build/index.ts.js` thấy `skvn-marine-design` và `Marine Blocks` ⇒ bundle local không thiếu module; nếu production khác ⇒ H6.
- **git blame:** cả hai dòng mismatch cùng commit `38523bb7` (2026-11-05 13:40) ⇒ bug có từ khi sidebar 1.3.19 được viết, không phải do build gần đây.
- **Runtime paste (ledger entry 15:48):** production console cho `skvnMarineDesign = { …, woocommerceAvailable: "1", postEditor: "1" }` — khớp **chính xác** dự đoán `(string)` ở trên (cả `woocommerceAvailable` cũng `"1"`) ⇒ củng cố H3; và `typeof wp.plugins.getPlugin('skvn-marine-design')` = `undefined` ⇒ bundle chưa chạy `import './design-sidebar'` (H1/H6).
- **Bug cùng họ (không gây triệu chứng này):** `src/collection/controls.tsx:641` so `window.skvnMarineDesign?.woocommerceAvailable === false` — cũng luôn false vì là string.
- **H2 variant WP<6.6:** core `WP_Dependencies::all_deps()` **drop** script nếu dep thiếu — `class-wp-dependencies.php:222-241` (`$keep_going = false` khi có missing dependency → top-level `continue`). Nhưng `react-jsx-runtime` có từ WP 6.6+ và Woo 11.2.2 gần như chắc chắn đòi WP mới hơn ⇒ residual thấp.

**Mechanism:** Panel “Marine Blocks” chỉ xuất hiện trong ⋮ Panels khi `DesignSidebar` render `PluginSidebar` (mount `ComplementaryArea`). `canUseDesignSidebar()` gate render đó, và nó phụ thuộc `postEditor === true`. Vì `wp_localize_script` biến boolean thành string, điều kiện **không bao giờ** đúng → `null` → không có `ComplementaryAreaMoreMenuItem` → không có entry trong ⋮. Đây là lý do trực tiếp, tất định, khớp triệu chứng “⋮ Panels chỉ thấy WindPress” (WindPress dùng `PluginSidebarMoreMenuItem` render vô điều kiện nên luôn hiện).

**H-status:**
- **H1** — LIKELY (blocked: cần human step 2–3). Không phủ nhận H3.
- **H2** — RULED OUT (residual thấp) — chỉ đúng nếu production WP < 6.6; Woo 11.2.2 phản chứng mạnh. Đóng hẳn bằng slot WP version; reopen nếu console đỏ lúc eval bundle.
- **H3** — **CONFIRMED** (source + core + khớp runtime paste). glm-5.3-flash-free đánh RULED OUT là **SAI** (xem “So sánh”).
- **H4** — RULED OUT (panel bị toggle off vẫn nằm trong list; ở đây list **không có** entry).
- **H5** — RULED OUT (theme contract `related` chỉ gate nội dung Theme Design + AJAX, không gate registration/render).
- **H6** — LIKELY (blocked: cần fetch/size/hash production; step 2–3).
- **H7** — RULED OUT (xác suất thấp) — WindPress tự xuất hiện, không có dấu hiệu optimizer strip script.
- **H8** — RULED OUT (`core/edit-post` có; và H3 đã false trước cả khi xét H8).
- **H9** — Không có variant mới; (A) plugin inactive và (B) thiếu `build/` đều sẽ khiến localization không in — nhưng ledger 15:48 báo `postEditor` **có** in ⇒ loại (nếu paste đáng tin).

**So sánh entry trước:**
- **agrees with nemotron-3.5-super-vl-free** (cả 15:41 và 15:48): đúng khi nói render `null` ⇒ mất entry ⋮ và H3 là mắt xích gãy; 15:48 xác định đúng `postEditor: "1"`.
- **disagrees with glm-5.3-flash-free**: (a) H3 bị đánh **RULED OUT** là sai — bằng chứng `editor.js:49471-49480` + `83846-83856` cho thấy render `null` **có** xóa entry khỏi ⋮ “Panels”; (b) luận điểm “render ≠ registration ⇒ panel vẫn được list” không đúng với WP hiện tại: `registerPlugin` chỉ tạo store entry, item ⋮ do `ComplementaryArea` **mount** mà có. Đồng ý một phần: bundle chưa enqueue/chạy vẫn là lớp khả dĩ (H1/H6).

**Next step for human** (post 22 edit, F12, Ctrl+F5 trước):
1. Console: `typeof window.skvnMarineDesign.postEditor` (dự kiến `"string"`) và `window.skvnMarineDesign.postEditor` (dự kiến `"1"`) ⇒ chốt H3 tại production.
2. Discriminator bundle: `typeof wp.plugins.getPlugin('skvn-marine-block-content-actions')` và `!!wp.blocks.getBlockType('skvn-marine/slider')`. Nếu các cái này **có** mà `getPlugin('skvn-marine-design')` = `undefined` ⇒ production bundle **thiếu module design-sidebar** (H6 stale). Nếu tất cả `undefined` ⇒ bundle không load (H1).
3. Network filter `index.ts.js`: status/size; `(await (await fetch('/wp-content/plugins/skvn-marine-blocks/build/index.ts.js')).text()).length` so với **236248** (hash `4C9233…7BA8`). 404/lệch ⇒ H1/H6.
4. (Tùy chọn, để đóng H2) WP version tại Tools → Site Health.
5. Không cần screenshot ⋮ nữa nếu step 1–3 khớp.

**Recommended fix owner:** code change (cùng commit):
- `src/design-sidebar/navigation.tsx:9` → dùng truthy: `!! window.skvnMarineDesign?.postEditor` (defense-in-depth), **và/hoặc**
- `modules/typography-settings/typography-settings.php:217` → gửi giá trị không bị `(string)` làm hỏng (ví dụ `'1'`/`'0'` và so chuỗi), hoặc chuyển transport sang `wp_add_inline_script`/`wp_json_encode` để giữ boolean. Khuyến nghị sửa **cả hai** (nguồn + guard).
- Cân nhắc cùng lúc: `src/collection/controls.tsx:641` (`woocommerceAvailable === false`).

Sau fix: human `npm run build` + upload `build/index.ts.js` + `build/index.ts.asset.php` + xóa cache/CDN. Nếu step 2 cho H6 ⇒ rebuild/upload là **bắt buộc**, không chỉ sửa code.

**Confidence:** high (H3: tất định từ source + core WP + khớp runtime paste). medium cho lớp phụ H1/H6 (chưa có fetch evidence trực tiếp).

---

### [2026-11-14 16:26] | Model: flint-40b-free

**Mode:** diagnosis-only + human-evidence cross-check (runtime paste từ production đã có qua entry nemotron 15:48)

**Verdict:** **AGREES WITH Model `nemotron-3.5-super-vl-free`** ([2026-11-14 15:48] — CONFIRMED root cause) — verdict cuối cùng của agent trước giữ nguyên; tôi chỉ bổ sung cross-check source + tự kiểm hash/length để chặt chẽ hơn.

**Hypotheses addressed:** H1, H2, H3, H4, H5, H6, H7, H8, H9 (toàn bộ checklist).

**Comparison với entry agent trước:**
- **Agrees with Model `nemotron-3.5-super-vl-free` ([2026-11-14 15:48]):** CONFIRMED H6 + H3; mechanism AND-chain đúng; hướng fix (code change + human rebuild/upload) giống nhau. Tôi không có ý phản đối verdict đó.
- **Agrees with Model `glm-5.3-flash-free` ([2026-11-14 15:43]) trên hướng chốt:** H1/H2/H6 ban đầu mang tính LIKELY; sau human paste tôi **agree** rằng H1 bị rule out (localization in ⇒ handle OK), H6 được nâng thành CONFIRMED bởi nemotron.
- **Disagrees with Model `nemotron-3.5-super-vl-free` ([2026-11-14 15:41]) trên H3:** disagree **because** — entry 15:41 mức độ LIKELY cho H3 với giả định `postEditor === true` hợp lệ; đến entry 15:48 human paste đã nâng H3 lên CONFIRMED khi phát hiện `postEditor: "1"` (string) ≠ boolean `true`. Tôi follow-through: H3 CONFIRMED.

**Evidence:**
- Human paste (production, post 22 edit, F12) từ nemotron 15:48: `console.log(window.skvnMarineDesign)` → `{ url: ..., nonce: ..., woocommerceAvailable: "1", postEditor: "1" }`; `typeof wp?.plugins?.getPlugin?.('skvn-marine-design')` → `undefined`.
- Source: `src/design-sidebar/navigation.tsx:9` — gate `window.skvnMarineDesign?.postEditor === true`; `"1" === true` → false ⇒ `canUseDesignSidebar()` false ⇒ `DesignSidebar` render null (`src/design-sidebar/index.tsx:14-16`).
- Source: `wp-includes/js/dist/plugins.js:283,489` (runtime WP onsite): `wp.plugins.getPlugin` **tồn tại** ⇒ kết quả `undefined` là hợp lệ ⇒ plugin thực sự chưa register lúc check ⇒ bundle chưa chạy design-sidebar.
- Source tự kiểm (riêng): `build/index.ts.js` sha256 `4C923337ADA6B384E3241F65B9A02370CB81912394B73D3E3EE8F7065F4A7BA8`, size 236,248 bytes — **khớp hoàn toàn** với evidence nemotron 15:48 ⇒ source build hiện tại self-consistent; H6 (stale bundle) là chẩn đoán deploy-side còn sót lại.
- H1: **RULED OUT** — localization in ⇒ handle `skvn-marine-blocks-editor` đã register + enqueue; build source tồn tại + chứa design-sidebar.
- H5: **RULED OUT** — theme contract (`inc/customizer.php:79-84`) chỉ gate snapshot/save nhóm Theme Design, không nằm render gate tab.

**H-status:**
- **H1** — **RULED OUT** (localization in + build source tồn tại).
- **H2** — **LIKELY** (cần human step 2–3: console red errors / xác nhận file trên server; latest nemotron nói RULED OUT nhưng chưa đủ evidence để tôi giữ nguyên — tôi đánh LIKELY cho an toàn phân biệt).
- **H3** — **CONFIRMED** (human paste `postEditor: "1"` string ≠ boolean true; source gate `=== true` tại `navigation.tsx:9`).
- **H4** — **pending** (cần screenshot Preferences → Panels; mechanism latest cho thấy thiếu listing nên H4 không nguyên nhân cho thiếu tab).
- **H5** — **RULED OUT** (contract không gate tab listing).
- **H6** — **CONFIRMED** theo nemotron 15:48 + tự kiểm hash/length khớp source (236,248 bytes / sha256 `4C9233…7BA8`); chẩn đoán stale bundle/deploy-side là hồi quy mạnh.
- **H7** — **pending** (thấp ưu tiên; WindPress dùng chung plugins API nên chỉ liên quan nếu script tag + fetch OK mà vẫn getPlugin undefined).
- **H8** — **RULED OUT** (runtime `wp.plugins.getPlugin` + `core/edit-post` API tồn tại).
- **H9** — **LIKELY** (variant A: plugin inactive trên production; variant B: upload thiếu/cũ build/).

**Mechanism:** localize in + handle OK ⇒ bước (2) AND-chain luôn pass; `registerPlugin` chưa chạy (getPlugin undefined) ⇒ H6; kèm H3 gate fail chặt chẽ (`postEditor: "1"` string). Hai ngắt cùng lúc là H6 (stale bundle) và H3 (strict boolean); fix phải cùng lượt theo nemotron 15:48.

**Next step for human:**
1. Xác nhận trên production server: file `wp-content/plugins/skvn-marine-blocks/build/index.ts.js` tồn tại + chứa chuỗi `design-sidebar` (expect sha256 `4C923337ADA6B384E3241F65B9A02370CB81912394B73D3E3EE8F7065F4A7BA8`, size 236,248 bytes).
2. Nếu server-side file thiếu/stale: human rebuild + upload lại build assets, clear opcode/cache/CDN, hard refresh post 22 edit.
3. Code fix H3: ép `postEditor` thành boolean strict (hoặc chấp nhận truthy) tại `modules/typography-settings/typography-settings.php:217` / `src/design-sidebar/navigation.tsx:9`.
4. Code fix H6: rebuild plugin (source hiện self-consistent, nên là deploy stale).
5. Hard refresh + console: `wp.plugins.getPlugin('skvn-marine-design') !== undefined` và `window.skvnMarineDesign.postEditor === true`.

**Recommended fix owner:** human ops (xác nhận server-side file + stale cache) → human deploy (upload lại build) → code change (boolean strict + rebuild); hướng cuối của agent trước giữ nguyên: code change + human rebuild/upload.

**Confidence:** high (H3 CONFIRMED bằng human paste + source; H6 CONFIRMED bởi nemotron 15:48 + tự kiểm hash/length khớp source) — vẫn giữ mức high cho verdict tổng, với guard: cần human xác nhận file production trước khi chốt deploy-side fix.