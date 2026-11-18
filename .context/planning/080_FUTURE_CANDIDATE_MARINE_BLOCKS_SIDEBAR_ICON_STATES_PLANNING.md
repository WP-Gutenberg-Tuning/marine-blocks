# Marine Blocks Sidebar Icon States (Hover / Selected) — Planning

Created: **2026-11-16**. Status: **OPEN — planning chi tiết; chưa start; chưa SemVer; không code/build/lint/commit trừ lệnh human.**

Human 2026-11-16: cung cấp 2 logo mới tại `docs/ideations/icon logo/`:
- `MarineBlocks Icons_Hover.svg` — dùng khi hover (có highlight/stroke sáng, stroke-width ~350–375).
- `MarineBlocks Icons_Selected.svg` — dùng khi nút toggle sidebar đang active/selected (đổi palette sang chủ đạo vàng `#ffeb21` + lệch offset ~9.6px x / ~13.2px y so với Hover, đã được canh lại bố cục).

Master file `MarineBlocks Icons.svg` là Inkscape 3 page (x = 0 / 522 / 1044), không nhúng trực tiếp vào web.

Phiên bản đích (SemVer) và milestone chứa scope này **TBD — human quyết** (xem §9 D1). Theo Version Naming Rule (AGENTS.md §9): chưa chốt version → `Future Candidate`, không tự gán 1.3.x/1.4.x.

Đọc kèm: plan [054](054_DESIGN_SIDEBAR_VISUAL_CONTROLS_PLAN.md) (visual sidebar — icon này **nằm ngoài** 054), plan [056](056_FUTURE_CANDIDATE_BLOCK_INSERTER_ORGANIZATION.md) (inserter SVG — khác surface).

---

## 1. Vấn đề

Nút toggle **"Marine Blocks"** trên toolbar editor (mở Design sidebar) hiện chỉ có 1 trạng thái tĩnh: `assets/icons/marine-blocks.svg`. Human muốn nút có phản hồi thị giác cho 2 state: **hover** và **selected** (sidebar đang mở).

## 2. Hiện trạng (đã verify 2026-11-16, WP runtime local `D:\Github\minhhaifish`, WP 7.1.4, không có Gutenberg plugin)

Chuỗi hiện tại của icon:

1. `modules/typography-settings/typography-settings.php` — `skvn_marine_blocks_design_bootstrap()` (hook `enqueue_block_editor_assets`): enqueue `assets/css/design-sidebar.css` (dep `wp-components`) + nhét `window.skvnMarineDesign` qua `wp_add_inline_script`. `iconUrl` chỉ được set khi `file_exists()` (khoảng line 235–240).
2. `src/design-sidebar/sidebar-icon.tsx` — `MarineBlocksSidebarIcon` đọc `window.skvnMarineDesign?.iconUrl`, render `<img alt="" width={24} height={24} />`. (Phải là component, không phải string: `@wordpress/components` Icon coi string là Dashicon name — xem comment trong file.)
3. `src/design-sidebar/index.tsx:40` — `PluginSidebar icon={… MarineBlocksSidebarIcon : 'admin-customizer'}`; `isOpen` đã được đọc sẵn ở `index.tsx:21` qua `read('core/edit-post').getActiveGeneralSidebarName() === 'skvn-marine-design/design'`.
4. Gutenberg render: `PluginSidebar → ComplementaryArea → PinnedItems fill → @wordpress/components <Button size="compact" isPressed={…}>` trong `<div class="interface-pinned-items">` ở **header editor, document cha** (không nằm trong canvas iframe).

DOM đích (button) — verified trong `components.min.js` + `editor.min.js`:

```html
<div class="interface-pinned-items">
  <button type="button" class="components-button is-compact has-icon is-pressed"
          aria-pressed="true" aria-expanded="true"
          aria-controls="skvn-marine-design:design"
          aria-label="Marine Blocks"> … <img …> </button>
</div>
```

- `is-pressed` / `aria-pressed="true"` có mặt khi (và chỉ khi) sidebar đang mở **và** `isPressed: S && (!R || P)` trong PinnedItems fill — S = active, R = preference `showIconLabels`, P = viewport lớn. (`is-pressed` đã tồn tại trong components build hiện hành nhưng là **class nội bộ**, không phải public contract.)
- Hover/focus không có class riêng: dùng `.components-button:hover` / `:focus-visible`.
- CSS của pinned button trong core: `.interface-pinned-items .components-button{display:flex}`, `.components-button.has-icon{width:auto}` — không set size cho img, an toàn với img 24px.

**Gotcha `showIconLabels`** (core behavior, không né được): khi preference bật, ActionItem thay hẳn icon của plugin bằng checkmark `Io` + text `:after { content: attr(aria-label) }` (`.has-icon svg{display:none}`). Ở chế độ đó 2 logo mới **không bao giờ hiển thị**.

**Asset weight**: `MarineBlocks Icons_Hover.svg` = 46.594 B, `_Selected.svg` = 45.687 B — phần lớn là `c2pa:manifest` (base64, ~10–13KB) + inkscape/sodipodi/metadata cruft. File production hiện hành `assets/icons/marine-blocks.svg` (32.977 B) đã được strip sạch — 2 file mới phải xử lý tương tự.

## 3. Quyết định thiết kế — A+B hybrid (human chốt hướng 2026-11-16)

**Nguyên tắc: mỗi loại state dùng đúng cơ chế của nó.**

| State | Cơ chế | Nguồn sự thật |
|---|---|---|
| `selected` (sidebar mở) | **React** — `useSelect(getActiveGeneralSidebarName() === 'skvn-marine-design/design')` → toggle class `is-open` trên wrapper | Store `core/edit-post` (selector đã dùng ở `index.tsx:21`; không phụ thuộc class nội bộ `is-pressed`) |
| `hover` (+ keyboard focus) | **CSS** — `.components-button:hover` / `:focus-visible` trên nút cha | CSS thuần, mất `focus-visible` nếu làm bằng React |
| `open + hover` đồng thời | **Quy tắc ưu tiên: `selected` thắng `hover`** (state > affordance) — hover rule scope bằng `:not(.is-open)` | §9 D2 |

Không chọn: (A thuần — dính `is-pressed` nội bộ core), (B thuần — hover mất focus-visible, reimplement thứ CSS làm sẵn), (inline SVG sprite/`<g>` toggle — phình plugin editor bundle ~90KB, trái với quyết định giữ path data ngoài bundle), (`content: url()` swap trên img — không đáng tin).

**Fallback chain** (giữ nguyên tinh thần hiện hành): PHP chỉ set `iconHoverUrl`/`iconSelectedUrl` khi `file_exists()`; JS render variant nào có URL; base luôn còn hiệu lực; thiếu cả `iconUrl` → `index.tsx` fallback `'admin-customizer'` như cũ.

## 4. Các bước thực hiện (khi human gán SemVer + lệnh start)

**Bước 1 — Asset prep** (`wp-content/plugins/skvn-marine-blocks/assets/icons/`)
- [ ] Copy `MarineBlocks Icons_Hover.svg` → `marine-blocks-hover.svg`
- [ ] Copy `MarineBlocks Icons_Selected.svg` → `marine-blocks-selected.svg`
- [ ] Strip `c2pa:manifest`, `metadata`, `sodipodi:*`, `inkscape:*`, `xmlns:c2pa/inkscape/sodipodi`, rewrite `<svg>` root sạch như `marine-blocks.svg` (svgo nếu có sẵn, không thêm devDependency chỉ vì việc này — strip thủ công bằng script đọc file được)
- [ ] Giữ nguyên `viewBox="0 0 512 512"`, `width/height="512"`; giữ nguyên paths/fills; **không** chỉnh artwork
- [ ] Kiểm tra hiển thị ở 24px (human mắt thường): stroke sáng của Hover có thể shimmer ở size nhỏ — nếu xấu, human quyết chỉnh artwork hay chấp nhận

**Bước 2 — PHP payload** (`modules/typography-settings/typography-settings.php`, trong `skvn_marine_blocks_design_bootstrap()`, cạnh `iconUrl`)
- [ ] Thêm `$sidebar_icon_hover` / `$sidebar_icon_selected` + `file_exists()` guard; set `$payload['iconHoverUrl']` / `$payload['iconSelectedUrl']` bằng `plugins_url('assets/icons/…', …)` (cùng pattern `iconUrl` hiện hành)
- [ ] Không đụng gì khác trong hàm; không thêm `require`/`include` (assets được `tools/build-deploy-artifact.mjs` cp nguyên thư mục `assets/` — đã verify, **không cần audit deploy artifact**)

**Bước 3 — `src/design-sidebar/sidebar-icon.tsx`**
- [ ] Import `useSelect` từ `@wordpress/data`
- [ ] `const isOpen = useSelect( ( read ) => { try { return read( 'core/edit-post' )?.getActiveGeneralSidebarName?.() === 'skvn-marine-design/design'; } catch ( e ) { return false; } }, [] );` — defensive: store không tồn tại (site editor) → `false`, icon base vẫn render
- [ ] Render `<span className={ 'skvn-marine-sidebar-icon' + ( isOpen && selectedUrl ? ' is-open' : '' ) }>` chứa tối đa 3 `<img>` (`--base`/`--hover`/`--selected`), `alt=""`, `width={24} height={24}`; variant thiếu URL thì bỏ qua. `is-open` chỉ set khi có `selectedUrl` → thiếu file selected thì hover vẫn còn hiệu lực khi sidebar mở (base không bao giờ bị ẩn, các variant overlay absolute lên base)
- [ ] Giữ `export function MarineBlocksSidebarIcon()` như hiện tại; comment đầu file update lại (không còn "keeps path data out" cho riêng base)

**Bước 4 — CSS** (`assets/css/design-sidebar.css`, **append section mới**, không sửa rule `.skvn-theme-design` hiện có; implementation dùng **overlay absolute** — base luôn render, variant phủ lên, không cần `:has()`, không ẩn base)
- [ ] `.skvn-marine-sidebar-icon{position:relative;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px}`
- [ ] `.skvn-marine-sidebar-icon__img{position:absolute;top:0;left:0;display:block;width:24px;height:24px}`
- [ ] `.skvn-marine-sidebar-icon__img--hover,.skvn-marine-sidebar-icon__img--selected{display:none}` (base **không** bị ẩn ở mọi state)
- [ ] `.components-button:hover .skvn-marine-sidebar-icon:not(.is-open) .skvn-marine-sidebar-icon__img--hover,.components-button:focus-visible .skvn-marine-sidebar-icon:not(.is-open) .skvn-marine-sidebar-icon__img--hover{display:block}`
- [ ] `.skvn-marine-sidebar-icon.is-open .skvn-marine-sidebar-icon__img--selected{display:block}` (hover scope `:not(.is-open)` → selected thắng khi open+hover)
- [ ] **Không** `!important`, không fixed width toolbar, không đụng `.interface-pinned-items`, không transition (xem D3)
- [ ] CSS vẫn enqueue qua handle `skvn-marine-blocks-design-sidebar` (dep `wp-components`) — đã đúng document cha, không qua `editorStyle` bundle

**Bước 5 — `src/design-sidebar/index.tsx`**
- [ ] Không đổi code switch icon (`iconUrl ? MarineBlocksSidebarIcon : 'admin-customizer'`)

**Bước 6 — Test runbook (tạo khi implement)**: `docs/testing/marine-blocks-sidebar-icon-states.md` theo onsite-first rule, gồm: target URL (post editor có Design sidebar), preconditions (build xong, hard refresh), exact steps, expected UX, pass/fail, evidence human report.

**Bước 7 — Human chạy build + lint** (agent không tự chạy/lint/deploy theo protocol):
```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

## 5. Acceptance (ID → kiểm → evidence)

**Editor UX**
- [ ] **ISB-UX-01** (default) — mở post editor: nút Marine Blocks hiện base logo 24px, không console error. Evidence: screenshot + console.
- [ ] **ISB-UX-02** (hover) — chuột vào nút → Hover variant; chuột ra → base; **không** áp dụng khi sidebar đang mở (selected thắng). Evidence: screenshot.
- [ ] **ISB-UX-03** (keyboard) — Tab focus vào nút → variant hover qua `:focus-visible`; Space/Enter toggle sidebar → selected khi mở. Evidence: screenshot + mô tả thao tác.
- [ ] **ISB-UX-04** (selected) — sidebar mở: selected variant hiển thị và giữ nguyên khi hover (priority D2). Đóng sidebar → base. Evidence: screenshot ×2.

**Technical**
- [ ] **ISB-TECH-01** (fallback) — xóa tạm `marine-blocks-hover.svg` khỏi assets → build lại → nút vẫn render base, không lỗi JS; restore file sau test. Evidence: output human + console.
- [ ] **ISB-TECH-02** (packaging) — `assets/` đã nằm trong deploy artifact (verified `tools/build-deploy-artifact.mjs` cp `assets/` recursive) → 2 file tự theo vào zip; không thêm PHP runtime require nên không phát sinh deploy audit. Evidence: `unzip -l build/skvn-marine-blocks.zip | grep assets/icons`.
- [ ] **ISB-TECH-03** (bundle) — không inline path data vào JS editor bundle; icon đi qua URL. Evidence: `grep -c "c2pa" build/index.ts.js` = 0 (hoặc soát manual).
- [ ] **ISB-TECH-04** (a11y) — img `alt=""` (decorative), nút giữ `aria-label` do PluginSidebar cấp ("Marine Blocks"), focus ring native của `.components-button` còn nguyên. Evidence: DOM inspect screenshot.

**Traceability**
- [ ] **ISB-TRACE-01** — planning này **không** tự kích hoạt code; implement chỉ sau khi human gán SemVer/milestone + lệnh start; acceptance runtime chỉ PASS khi human report onsite (source ≠ PASS).

Deferred/N/A: frontend (không có surface frontend), Block UI (N/A — editor chrome), performance (2 request ảnh 512px cache-friendly qua `filemtime` không áp dụng cho assets tĩnh nhưng plugins_url + browser cache ổn; không đo Core Web Vitals).

## 6. Caveats đã biết (không phải bug của plan)

1. **`showIconLabels` preference ON** → WP thay icon plugin bằng checkmark + text label; hover/selected vô hiệu trong mode đó. Chấp nhận hành vi core (default) hoặc human quyết khác (§9 D5).
2. **Site editor (`core/edit-site`)**: `core/edit-post` store không đảm bảo tồn tại → icon fallback base qua guard §4 Bước 3; Design sidebar vốn cũng chỉ khả dụng ở post editor (`canUseDesignSidebar()`).
3. **`is-pressed` không dùng** — hybrid tránh hoàn toàn class nội bộ này.
4. **24px legibility** của stroke Hover — human quyết ở Bước 1.
5. Duplicate IDs giữa các file SVG: vô hại vì mỗi file là `<img>` (document riêng). Nếu tương lai inline chung page, phải rename IDs — ghi nhận, không xử lý bây giờ.

## 7. Rủi ro

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Human kỳ vọng hover thắng khi sidebar mở | thấp | D2 chốt rõ trước khi code; đảo rule CSS 1 dòng |
| Artwork 24px quá chi tiết | trung bình | Bước 1 review visual gate trước khi gắn payload |
| `wp.data.select('core/edit-post')` throw ở context lạ | thấp | try/catch + optional chain trong useSelect; fallback base |
| C2pa metadata bị strip mất provenance chữ ký số | thấp | File gốc giữ nguyên ở `docs/ideations/icon logo/`; chỉ bản shipping bị strip |
| WP đổi `.components-button` markup | thấp | CSS scope qua wrapper class của mình; không đụng `.interface-pinned-items` |

## 8. Non-goals

- Không sửa `marine-blocks.svg` (base), không đổi artwork, không palette mới ngoài 2 file đã cấp.
- Không thêm animation/transition (nếu muốn fade → §9 D3).
- Không bump metadata, không chuyển milestone, không commit/push khi chưa có lệnh human.
- Không đụng Inserter (056), không đụng 054 Design Sidebar visual controls.
- Không thêm dependency (svgo chỉ dùng nếu đã có sẵn hoặc human cho phép).

## 9. Human decisions — đã chốt 2026-11-16

- **D1 — SemVer/milestone**: scope addition vào current pointer **1.3.24** theo lệnh human ("làm cùng với milestone hiện tại, làm xong commit riêng để biết sau này có gì revert"). Không bump metadata, không chuyển current; Step Slider vẫn PLANNED chưa start.
- **D2 — Priority `open + hover`**: **selected thắng hover** (hover scope `:not(.is-open)`).
- **D3 — Transition**: **không** animation; swap tức thì qua `display`.
- **D4 — Strip metadata**: script throwaway ngoài repo (file gốc giữ ở `docs/ideations/icon logo/` làm provenance); kết quả 46.6KB→33.0KB (hover), 45.7KB→32.1KB (selected) — tương đương production `marine-blocks.svg` (33KB).
- **D5 — `showIconLabels`**: chấp nhận hành vi core (icon plugin bị checkmark + text thay thế khi pref bật).

## 10. Trạng thái

- 2026-11-16: planning tạo theo yêu cầu human ("lập planning chi tiết") sau khi research (xem thread).
- 2026-11-16 (cùng ngày): **source implement xong** theo lệnh human ("làm cùng với milestone hiện tại, làm xong commit riêng") — D1 chốt: **scope addition vào current pointer 1.3.24** (không bump metadata/chuyển current; Step Slider vẫn PLANNED chưa start); D2 default chốt: **selected > hover**; D3: **không transition**; D4: strip metadata bằng script throwaway (file gốc giữ ở `docs/ideations/icon logo/`); D5: chấp nhận core `showIconLabels` behavior. Source: `assets/icons/marine-blocks-hover.svg` + `marine-blocks-selected.svg` (stripped, viewBox 512, không c2pa/inkscape), PHP payload `iconHoverUrl`/`iconSelectedUrl` (file_exists guard), `sidebar-icon.tsx` A+B hybrid (overlay absolute + `is-open` gate), CSS append `design-sidebar.css`. Runbook `docs/testing/marine-blocks-sidebar-icon-states.md`. Commit riêng `feature patch:` (revert unit độc lập).
- **Acceptance ISB-UX/TECH/TRACE — Chưa làm**: chờ human build + onsite. Runtime PASS chỉ khi human report.
