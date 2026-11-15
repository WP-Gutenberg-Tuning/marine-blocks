# PDP Related Card Profile — onsite runbook 1.3.22

Plan: [076](../../.context/planning/076_VER_1_3_22_PDP_RELATED_CARD_PROFILE_PLAN.md). Decision: `docs/decisions/pdp-related-card-profile.md`. P0 map: [pdp-related-p0-preflight-1.3.22](pdp-related-p0-preflight-1.3.22.md).

**Status:** Chưa làm — source P1–P4 có; REL-* chờ evidence human. Không PASS từ mocked tests.

**URL site:** human điền  
**Theme / plugin version:** human điền sau build  
**Woo / WP:** human điền (local map là Woo **10.7.x** — khác major → STOP, báo agent)

Default owner `useCustomRelatedCard` = **off** → related vẫn Woo native. Mọi case card SKVN cần bật owner (site hoặc override sản phẩm).

---

## Không thuộc runbook này

Upsells, intersection highlight, token typography/color theo vai trò, UI columns tách khỏi `relatedCount`, picklist term ID, archive ratio controls, plan067 Product page checklist.

---

## Fixtures

Human điền URL thật. Cùng build với version ghi trên.

| ID | Sản phẩm / trang | Cần có |
|---|---|---|
| R-A | PDP | Ảnh; ≥2 nhóm attribute; **một nhóm >3 values** (gate +N) |
| R-B | PDP | Không attribute |
| R-C | PDP | Tags: không / 1 / nhiều / tên dài (có thể vài SP) |
| R-D | PDP | Có `product_cat` |
| R-E | PDP | ≥4 related native (share cat/tag/attr) |
| R-F | PDP | Chỉ 1–2 related |
| R-G | Page published | **Một** block `skvn-marine/product-collection` (copy action) |
| R-H | PDP | Không override meta — theo option site |

P0 F1–F6 = R-A…R-F. Thiếu R-A hoặc R-E → không PASS REL-UI-01.

---

## Preconditions

- Theme `skvn-marine`, plugin `skvn-marine-blocks` (build hiện hành), WooCommerce active.
- Không có `wp-content/themes/skvn-marine/woocommerce/` (theme override `content-product`).
- Admin `manage_options` cho Theme Design + copy. User `edit_post` (không `manage_options`) cho panel sản phẩm / negative save group.
- Trước runtime follow-up khác: deferred baseline 1.3.20 (Category / Woo Archive / DS) — REL-TRACE-01.

---

## Thứ tự

1. Build/lint + mocked tests (dưới).
2. P0 Gate A (version + hook snippet) — [preflight](pdp-related-p0-preflight-1.3.22.md). Woo ≠ 10.7.x → STOP.
3. P0 Gate B trên R-A (PDP hiện **đủ** values bị card rút 3/+N). FAIL → decision memo full-values; **không** PASS REL-UI-01.
4. REL-UX-01 / REL-UX-02 (editor) trước frontend nặng.
5. REL-UI-01 / REL-UI-02 (frontend, owner on).
6. REL-TECH-01 / 02 / 03.
7. REL-TRACE-01 (docs, không onsite UI).

---

## Build / lint (human)

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

```bash
php -l wp-content/themes/skvn-marine/inc/pdp-related.php
php -l wp-content/themes/skvn-marine/inc/templates/related-product-card.php
php tools/tests/pdp-related-sanitize.test.php
php tools/tests/pdp-related-copy-blocks.test.php
php tools/tests/pdp-related-card.test.php
php tools/tests/pdp-related-hooks.test.php
```

Zip/upload (module PHP ngoài `build/`):

```bash
node tools/build-deploy-artifact.mjs
bash tools/package-plugin-zip.sh
unzip -l build/skvn-marine-blocks.zip | rg 'modules/pdp-related-settings/pdp-related-settings.php|assets/css/product-card.css'
unzip -l build/skvn-marine.zip | rg 'inc/templates/related-product-card.php'
```

---

## REL-UI-01 — Card related (owner on)

**Setup:** Theme Design → Related products → **Use SKVN related cards** on → Save group. R-H không override.

| Bước | Expected |
|---|---|
| 1. Mở R-A, R-E desktop | Section heading vẫn **Related products** (Woo native). Item là `li.skvn-related-shared-card` chứa `article.skvn-collection-card--related`. |
| 2. Card | Title + grouped specs + CTA cùng family Collection. Default ratio **1:1** (class `skvn-collection--ratio-1-1` và/hoặc flush 1:1). |
| 3. DOM links | Ảnh và title là `<a>` riêng. **Không** `<a>` lồng trong media. Badge/chip là `<span>`, không link taxonomy. |
| 4. CTA | Khớp `productActionMode` (default quote → `/request-a-quote/?product_id=`). Human review style onsite. |
| 5. R-E, `relatedCount` 4 | 4 item, Woo `columns-4` (hoặc loop columns 4). |
| 6. Đổi `relatedCount` = 5, Save, reload R-E | 5 item, columns **4** (clamp). |
| 7. `relatedCount` = 2 trên R-F | 2 item, columns **2**. |
| 8. Mobile + zoom 200% | Không cắt title/chip; không scrollbar ngang do card. |
| 9. Owner **off**, Save, reload | Lại `content-product` native; **không** `skvn-related-shared-card`. |

**Pass:** 1–9 đúng trên same-build. **Fail:** nested `<a>`, mất heading Woo, columns không clamp, card hiện khi owner off.

**Evidence:** screenshot desktop/mobile/zoom 200%; 1 snippet HTML một related `li`; Network có/không `product-card.css` (on/off).

---

## REL-UI-02 — Term chips

**Setup:** owner on. `displayTagLimit` = 3. `showProductTags` + `chipAllowTags` on.

| Bước | Expected |
|---|---|
| 1. R-C không tag | Không hàng chip tag; không overlay rỗng trên ảnh. |
| 2. R-C một tag | Một chip `<span class="skvn-collection-card__spec-tag">`. |
| 3. R-C nhiều tag | Đúng 3 chip + `+N` informational (không bấm/expand). Screen-reader text kèm `+N`. |
| 4. Tên dài | Wrap, không che gần hết ảnh (chips nằm body, không overlay). |
| 5. `chipAllowTags` off | Không chip tag dù `showProductTags` on. |
| 6. R-D, `showProductCategories` + `chipAllowCategories` on | Chip category hiện. Tắt một trong hai → không chip cat. |
| 7. Keyboard/touch | Chip không phải control; focus đi title/CTA/ảnh. |

**Pass:** hai lớp `show* && chipAllow*`; cap + `+N`; không picklist term. **Fail:** chip khi allowlist off; `+N` là button; cat chip trên grid/carousel/archive.

**Evidence:** list tag/cat từng fixture; screenshot 0/1/nhiều; 1 DOM `term-chips`.

---

## REL-UX-01 — Theme Design group `related`

Editor post (Marine Blocks → Theme Design → **Related products**).

| Bước | Expected |
|---|---|
| 1. Owner off | Mọi control disabled trừ **Use SKVN related cards**. |
| 2. Owner on, đổi `mediaLayout` + `relatedCount`, Save group | Reload editor: values còn. Option `skvn_pdp_related` 15 key. |
| 3. Đổi rồi Discard | Values về bản saved; status không còn unsaved draft. |
| 4. Copy từ R-G | Help “Uses the first Product Collection block on the page only.” Notice **Copied. Not linked to the source block.** Owner thành on. |
| 5. Sửa card attrs block trên R-G, reload PDP | Related **không** đổi theo block (not linked). |
| 6. Conflict (optional): tab 2 save group, tab 1 save | Conflict table; Use current / Keep draft không tự ghi. |
| 7. User không `manage_options` | Save group / copy → lỗi quyền; draft giữ. |

**Pass:** save/discard/copy/not-linked đúng. **Fail:** copy linked; copy không bật owner; palette/fonts bị ghi nhầm.

**Evidence:** ảnh panel; video copy + sửa block; `wp option get skvn_pdp_related` trước/sau copy.

---

## REL-UX-02 — Per-product panel + classic

| Bước | Expected |
|---|---|
| 1. Product block editor, panel **Related products** | Có. Post type ≠ product → không panel. |
| 2. Override off | “Using the site default.” Controls disabled. Frontend R-H theo option site. |
| 3. Override on, đổi `imageRatio` + `relatedCount` + owner, Update, reopen | Values còn. Meta `_skvn_pdp_related` = `override` + 15 key. |
| 4. Override on, **tắt owner** trên SP, Update | PDP đó Woo native; SP khác (R-H) vẫn theo site. |
| 5. **Use site default**, Update | Meta đúng `{ "override": false }` — **không** `delete_post_meta`. Frontend theo site. |
| 6. Classic editor (nếu có) | Meta box cùng field/label; save giữ values. Block editor không gửi nonce classic → handler bỏ qua. |

**Pass:** override/reset/reopen đúng; owner tắt trên một SP không kéo site. **Fail:** Use default xóa meta; key site lẫn vào override.

**Evidence:** `wp post meta get <id> _skvn_pdp_related` sau bước 3 và 5; ảnh panel.

---

## REL-TECH-01 — Inactive / plugin off / Woo off

| Bước | Expected |
|---|---|
| 1. Owner off (option đã save defaults) | Related native. Network **không** `skvn-marine-product-card` / `product-card.css` trên PDP. |
| 2. Deactivate `skvn-marine-blocks` | PDP không fatal. Related native. Không swap template. Bật lại plugin sau khi ghi evidence. |
| 3. (Nếu test được) Woo inactive | Không fatal theme (`function_exists` / `class_exists`). |

**Pass:** inactive = native, không enqueue card CSS. **Fail:** CSS card khi owner off; white screen khi plugin off.

**Evidence:** Network HAR hoặc screenshot; 1 ảnh related native khi off.

---

## REL-TECH-02 — Args + no regression

Cùng R-E, so trước/sau owner.

| Bước | Expected |
|---|---|
| 1. Owner off | `posts_per_page` / columns Woo mặc định (thường 4/4). Ghi số item + class columns. |
| 2. Owner on, `relatedCount` 5 | 5 related, columns 4. Order/IDs vẫn Woo related (không lấy query Collection). |
| 3. Shop / category / Product Grid / Product Carousel / Post card | Không đổi layout/query so baseline 1.3.20 (AC-TECH02/03). Cat chip **không** xuất hiện ngoài related. |
| 4. Upsells trên PDP (nếu có) | Vẫn native Woo — ngoài scope v1. |

**Pass:** args chỉ đổi khi active; archive/grid/carousel không regression. **Fail:** shop dùng related template; upsells bị swap.

**Evidence:** đếm item; class `columns-*`; 1 ảnh shop/carousel cùng build.

---

## REL-TECH-03 — Sanitize / permissions

Mocked `pdp-related-sanitize.test.php` + `pdp-related-copy-blocks.test.php` là baseline, **không** thay onsite.

| Bước | Expected |
|---|---|
| 1. Save group với key lạ (console/REST nếu tiện) | Key lạ bỏ; 15 key còn. |
| 2. `displayTagLimit` 11 / `relatedCount` 0 | Về default 3 / 4. |
| 3. Copy payload / option raw hex `chipColorScheme` | Không nhận hex; `''` hoặc slug. |
| 4. Role không `manage_options` | Option + copy 403. Role không `edit_post` không ghi meta. |
| 5. Copy không copy `categories` / `itemsToShow` / query attrs | Option related không có key query. |

**Pass:** bounds/allowlist/capability. **Fail:** query attrs lọt option; `'false'` string thành true.

**Evidence:** output WP-CLI option/meta; mocked test log nếu chạy lại.

---

## REL-TRACE-01 — Checklist không lẫn

| Kiểm | Expected |
|---|---|
| MILESTONES §1.3.22 PDP-UI/UX/TECH/TRACE (plan067) | Không bị tick vì related. |
| Acceptance 1.3.5 | Giữ status cũ. |
| REL-* | Chỉ đổi khi human PASS từng ID — source ≠ PASS. |
| Deferred 1.3.20 | Đã nhắc / đã chạy trước follow-up runtime khác. |

**Evidence:** ghi “đã đối chiếu” + ngày.

---

## Gate B reminder (chặn REL-UI-01)

R-A: chụp specs **trên PDP**. Related card cùng SP chỉ 3 values + `+N`. Nếu PDP **thiếu** phần bị rút → FAIL Gate B, decision memo, không PASS REL-UI-01.

---

## WP-CLI (optional)

```bash
wp option get skvn_pdp_related
wp post meta get <product_id> _skvn_pdp_related
```

---

## Evidence log (human)

| ID | Result | URL / note | Evidence |
|---|---|---|---|
| P0-A | | | |
| P0-B | | | |
| REL-UI-01 | | | |
| REL-UI-02 | | | |
| REL-UX-01 | | | |
| REL-UX-02 | | | |
| REL-TECH-01 | | | |
| REL-TECH-02 | | | |
| REL-TECH-03 | | | |
| REL-TRACE-01 | | | |
