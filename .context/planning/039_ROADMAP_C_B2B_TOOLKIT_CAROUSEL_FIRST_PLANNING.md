# 039 — Roadmap C: B2B Toolkit, Carousel First (stack — M1 → 1.3.17 IN PROGRESS)

**Status:** Human đã promote/bắt đầu M1 → V1 / 1.3.17 ngày 2026-10-13: Product/Post Carousel Stability & QA. IN PROGRESS; chưa có test PASS hoặc release approval. 5 chỉnh sửa audit PM vẫn hiệu lực.
**Milestone chính thức hiện tại:** V1 / 1.3.17 — Product/Post Carousel Block UI & Visual QA (IN PROGRESS, started 2026-10-13). 1.3.10 DEFERRED → M5, chưa hoàn thành.
**Nguồn:** `docs/decisions/project-goals-and-roadmap-reset.md` (quyết định human đã chốt + audit Muse 2026-10-13).
**POC chuẩn:** `.local/product-carousel-swiper-poc-03.html` (đã chốt, không chọn lại).
**Engine:** Swiper 11 giữ nguyên (`docs/decisions/collection-carousel-engine-keep-swiper.md`).

**Planning phân rã 1.3.17 (2026-10-14):** [040 — Block UI / Editor UX / Technical](040_VER_1_3_17_CAROUSEL_UI_UX_TECHNICAL_PLANNING.md) chứa baseline source, IDs/states/evidence, mapping toàn bộ §4–§4a và giải thích tích lũy. Đọc §10 cho delta human đã chốt với POC: mobile arrows giữ khi showArrows bật/có thể trượt, Product full title, Product mới media 1:1/contain; values/control/migration chi tiết còn mở, Post duyệt riêng. Không suy ra PASS hoặc phê duyệt settings architecture.

---

## 1. Mục tiêu roadmap C (human đã chốt)

Mapping addition2026-11-06: human cho triển khai Woo Archive M1 (plan059§9–10) **chung1.3.20 Product Category Grid + Category details**, giữ version đã dùng và CG/DS acceptance; theme native archive visuals, không archive builder/query ownership migration. Đây là source scope addition ngoài current1.3.19 theo precedent Category source; không chuyển mốc/bump metadata. Blog archive và Archive M2 chưa start. Giữ AM1/AL/AR evidence riêng.

**Mapping 2026-11-04:** human chốt **1.4.0 — Marine Blocks Identity & Compatibility Migration**, PLANNED chưa start; nền portability phục vụ M6, không kích hoạt toàn bộ M6/M3. [Plan 047](047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md). Setup UI cũ **1.4.0 → 1.4.1**; Layout Blocks Validation & Quote Evaluation/T-2 cũ **1.4.1 → 1.4.2**; giữ acceptance PENDING. Các bảng snapshot cũ bên dưới dùng số trước khi dời, đối chiếu mapping này và MILESTONES.md khi thực thi. Current vẫn 1.3.18, không bump metadata hoặc archive. MINOR mới dành cho scope migration sản phẩm/compatibility; naming đã chốt, start chưa chốt.

**Cập nhật 2026-11-03:** human chốt **1.3.19 → 1.3.22 Product Page Basic Design Controls → 1.3.23 Post Page Basic Design Controls**. Hai mốc mới PLANNED, chưa start; số PATCH là ngoại lệ human xác nhận cho feature mới, không đổi quy tắc SemVer. Scope và acceptance nằm trong `../MILESTONES.md`. Consumer template liên quan M6, nền visual/editor liên quan M3; không kích hoạt toàn bộ hai stack. Giữ PHP/GeneratePress, default chung và override giới hạn; đối chiếu acceptance 1.3.5 trước implementation, không xóa scope cũ. **2.0 bắt đầu migration từng bước**, không phải đã độc lập. Current vẫn 1.3.18.

**Cập nhật ưu tiên 2026-11-04:** human hoán đổi Sidebar/Hero: **1.3.19 Sidebar Foundation → 1.3.20 Product Category Grid → 1.3.21 Hero Contrast Repair**. Thay thứ tự Category trước Sidebar ngày 28/10. Sidebar nhận Carousel carry-over chưa hoàn tất từ 1.3.18, register tại MILESTONES.md; runtime QA giữ riêng với DS-01–07. Category tích hợp sidebar ở 1.3.20. Current vẫn 1.3.18; Sidebar/Category chưa start. Không kích hoạt toàn bộ M3/M6.

- Bộ công cụ cho **nhiều website B2B**, Gutenberg + Tailwind hướng tới, plugin độc lập theme.
- **Kết quả đầu tiên: Product Carousel + Post Carousel hoàn chỉnh** (giao diện, tương tác, responsive), test giao diện trước.
- Product dùng **dữ liệu Woo mặc định**; MOQ/lead time/cert chưa bắt buộc. Post dùng dữ liệu WP.
- Quote Flow **sau** test giao diện carousel. Slider (Hero/Parallax/Step) **dời mốc sau**. Header/footer mới **sau theme độc lập**; tạm giữ GeneratePress.
- Settings basic trong Block / advanced sidebar riêng: **đã duyệt cách chia và ưu tiên milestone kế tiếp ngày 2026-10-21**; scope/states/acceptance theo ideation sidebar, SemVer/start chưa xác nhận.

**Map milestone 2026-11-04:** human xác nhận **V1 / 1.4.3 — Interactive Illustrated Map**, PLANNED/Chưa làm, sau 1.4.2 và trước 1.5.0; ngoại lệ đánh số cho feature mới, không đổi SemVer rule. Scope/acceptance MAP-* tại MILESTONES.md và `docs/ideations/svg-maps/README.md`. Map là candidate consumer của nền sidebar/plugin; **chưa gán vào M1–M6**, không kích hoạt M3/M6. Giữ scope các mốc hiện có và debt map/contact cũ 1.1.2. Current vẫn 1.3.18, chưa start/bump/build.

## 2. Milestone stack M1–M6 (định danh scope, không phải SemVer)

| Nhãn | Kết quả | Trạng thái |
|---|---|---|
| M1 | Product/Post Carousel: UI trước, Editor UX/Technical sau | **1.3.17 Block UI IN PROGRESS** + **1.3.18 Editor UX/Technical PLANNED chưa start** (human split 2026-10-14); mapping §4b/040 §11 |
| M2 | Quote Flow từ carousel (CF7/CFDB7 end-to-end + T-2) | Sau 1.3.17 PASS; SemVer TBD |
| M3 | Nền theme độc lập + kiến trúc Tailwind, thoát GP | Đề xuất, chưa duyệt chi tiết |
| M4 | Hệ thống quản lý header/footer mới | Sau M3 (thứ tự đã chốt), đặc tả mở |
| M5 | Slider trưởng thành + settings hệ thống | Slider sau carousel (đã chốt); vị trí chính xác chưa duyệt. **M5 → 1.3.21 Hero Slider Contrast Repair** (human xác nhận 2026-10-19, hotfix ngoài current milestone — xem dưới) |
| M6 | Template thực tế + kiểm chứng đa site + chuẩn bị phát hành | Đề xuất, chưa duyệt |

### Chọn version khi đưa mục stack vào triển khai — human chốt 2026-10-13

039 được quản lý như milestone stack. Mỗi mục chỉ được triển khai sau khi agent đề xuất và human xác nhận SemVer cụ thể cùng việc bắt đầu/chuyển milestone. Áp dụng protocol trong AGENTS.md và MILESTONES.md, section `Milestone stack → SemVer`.

Mapping hiện hành: **M1 → 1.3.17 Block UI IN PROGRESS + 1.3.18 Editor UX/Technical PLANNED chưa start** (human split 2026-10-14). Mapping ban đầu 2026-10-13 gộp M1 vào 1.3.17 đã được thu hẹp; xem §4b/040 §11. M2–M6 **chưa gán SemVer**. Agent ghi version và nguồn human xác nhận vào mục tương ứng khi được duyệt. Không biến nhãn M1 thành current milestone, không suy ra version từ số thứ tự stack và không tự nhảy major.

Human đã promote M1 thành current V1 / 1.3.17. Bắt đầu M1 không phê duyệt toàn bộ scope/mapping M2–M6 hoặc tự bắt đầu các mốc sau.

### M5 → 1.3.21 — Hero Slider Contrast Repair (hotfix ngoài current milestone)

Human xác nhận Hero contrast dạng hotfix ngoài current ngày 2026-10-19 với version cũ 1.3.19. **2026-11-04 dời Hero → 1.3.21**, nhường 1.3.19 cho Sidebar. Giữ source/acceptance/hình thức hotfix; current vẫn 1.3.18, không bump/archive trong lượt đổi planning.

Hệ quả bắt buộc:

- Không bump `style.css` / plugin header / `package.json` cho 1.3.21 — bump metadata chỉ áp dụng khi milestone được bắt đầu làm current theo Transition Rule.
- Không ghi 1.3.21 vào trường "Current Milestone" của `AGENTS.md` hay `.context/MILESTONES.md`.
- T-DEMO-1 (đề xuất 1.3.15 cho parallax stabilization) vẫn OPEN và **không bị 1.3.21 xử lý**; 1.3.21 chỉ đụng Hero contrast.
- Đây là tiền lệ hotfix ngoài current milestone; nếu lặp lại nhiều lần thì cân nhắc lại T-DEMO-1 thay vì tiếp tục nhồi version.

Scope/acceptance: `.context/planning/044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md` (§4.2–§4.3, §7). Kiểm chứng: `docs/testing/hero-slider-contrast-and-flicker-repair.md`.

## 3. Mapping cũ → mới, từng mục (truy vết, không xóa code)

> "Đã implement" ≠ "đã QA PASS". Cách xử lý: Kế thừa / Gộp / Dời / Xem lại.
> "Xem lại" cần human quyết từng mục; chưa phê duyệt dời/loại cả nhóm.
> Không suy ra toàn bộ M1–M6 chạy tuần tự: chỉ chốt carousel trước Quote Flow,
> slider sau carousel, header/footer mới sau theme độc lập.

| Milestone cũ (Status) | → Stack | Cách xử lý |
|---|---|---|
| 1.3.3 Collections (DONE, acceptance còn trống) | M1 | Kế thừa nền query/render/preset; DONE cũ không chứng minh đạt POC-03 |
| 1.3.7 Collection UI (DONE, QA dời) | M1 | Kế thừa + delta visual lock POC-03 (audit A3 trong bản ghi chung) |
| Planning 038 Visual Lock | M1 | Kế thừa phương pháp gated, đổi artifact chuẩn sang POC-03; engine Swiper giữ nguyên |
| 1.3.11 + 1.3.16 QA trùng (PENDING cả hai) | M1 (carousel) + M5 (slider) + deferred | Gộp QA carousel vào acceptance 1.3.17; xem bảng nơi nhận §4a. Không đóng QA cũ, không resolve tension chỉ vì mapping |
| 1.1.2 Quote Flow & Map (PENDING) | M2 (+ map Xem lại riêng) | Gộp quote-data-flow → M2; map block tách track riêng |
| 1.4.1: T-2 source_url + quote evaluation (PENDING) | M2 | Gộp T-2 verification end-to-end → M2; layout validation xem lại riêng |
| 1.3.10 Step Slider (DEFERRED từ 2026-10-13) | M5 | Human chuyển ưu tiên sang 1.3.17; giữ checklist/links tại MILESTONES, ghi sự kiện trong history, không ghi completed |
| 1.3.8 Parallax stabilization còn lại, T-DEMO-1 (đề xuất 1.3.15 OPEN) | M5 | Dời; T-DEMO-1 vẫn OPEN, xử lý ở mốc slider |
| 1.3.1 Controls (DONE) | M5 | Giữ làm nền đã ship, không việc mới |
| 1.4.0 Setup UI (PENDING) | M3 (phần phục vụ theme độc lập) + Xem lại (phần còn lại) | Chỉ phần setup phục vụ thoát GP vào M3 |
| 1.3.4 Core Control (PENDING) | Tách: giữ tương thích phần đã có; hoãn phần mở rộng mới | Phần mở rộng mới không vào M1 |
| 1.3.12 Credits (PENDING) | Parking | Không chặn M6 |
| 1.3.9 Custom Icon (PARKING) | Candidate | Chỉ kích hoạt khi có nhu cầu thiết kế cụ thể |
| 1.6.0 Surface Presets (PENDING) | M3 | Đánh giá cùng visual/Tailwind architecture |
| 1.5.3 TOC Block + Shortcode (PLANNED, planning 037) | Đề xuất M6 — **chưa chốt** | Lý do đề xuất: TOC là article-reading UX + hội tụ numbering 1.3.14, không phụ thuộc carousel/toolkit core; CĐS page cũng là template ứng dụng. Human quyết nơi nhận cuối |
| 1.7.0 Front page CĐS (PENDING) | M6 | Template ứng dụng, không là dependency của toolkit |
| 1.3.5 Post/Product/Archive (PLANNING) | Xem lại (đề xuất M6; phần font/token liên quan M3) | Chờ duyệt |
| 1.5.0 Woo Catalog (BRAINSTORM) | Dời sau M2, xem lại hủy/giữ | Không chặn 1.3.17 (dữ liệu mặc định) |
| 2.0.0 → 3.0.0 thoát GeneratePress | M3 | Khung truy vết hướng thoát GP |
| Header/footer hiện có (GP) | Giữ tạm | Hệ thống quản lý mới ở M4 (sau M3) |
| Post 1.5.x GU Supercharger launch | Xem lại | Launch chưa đồng nhất giữa tài liệu; không đổi slug/namespace ở 1.3.17 |

## 4. Acceptance baseline trước split — giữ đầy đủ; version ownership hiện hành tại §4b

Scope giữ nguyên M1 đã chốt; không thêm hệ thống settings nâng cao.

- [ ] Product Carousel (Woo mặc định) khớp POC-03 ở desktop/tablet/mobile (so ảnh cạnh nhau).
- [ ] Arrows header: loop bật thì trượt liên tục; không loop thì kiểm giới hạn/disabled; không đủ item để trượt thì controls không gây hiểu nhầm. Dots pill đồng bộ + clickable; keyboard ←/→ kiểm riêng (source hiện chưa configure Keyboard).
- [ ] Autoplay off mặc định; khi bật: Pause/Play, hover/focus/tab-ẩn pause, reduced-motion tắt.
- [ ] Card link đúng URL; quote URL giữ product context (không chứng minh CF7 — sang M2).
- [ ] Woo inactive graceful, không fatal; empty state rõ.
- [ ] Post Carousel duyệt visual riêng (POC không có Post demo sống).
- [ ] QA carousel nhận từ 1.3.11/1.3.16 đạt (bảng §4a): imageRatio, arrows không clip, spacing/heading/eyebrow/intro, archive + catalog CTA, card variants, badge overlay, preset 4-2-1 responsive, collection CTA hovers, editor preview hover.
- [ ] Responsive: kiểm quanh breakpoint 640/1024, đổi chiều rộng/orientation, số lượng item ít/đủ/nhiều (bổ sung theo review PM — 3 ảnh tĩnh 1280/768/375 chưa đủ).
- [ ] Console sạch trên surfaces carousel; kiểm chung memory/invalid-block/a11y cho surfaces bị tác động (phân bổ theo §4a, không bỏ mất).
- [ ] Grid layout không regression; editor không chạy Swiper.
- [ ] Human PASS 1.3.17 trước khi sang M2.

### 4a. Nơi nhận acceptance QA cũ (1.3.11 / 1.3.16) — đầy đủ, không bỏ mất

> 1.3.11 và 1.3.16 giữ Status PENDING; chưa đóng QA cũ hoặc resolve tension chỉ vì mapping.

**→ M1 carousel + collection: baseline nhận trước split; nay chia 1.3.17/1.3.18 theo §4b:**

| Nguồn | Acceptance nhận |
|---|---|
| 1.3.11 Collections QA | Product Grid render đúng (Woo thật); Post Grid render đúng; Product/Post Carousel render + Swiper init không lỗi; presets `1-1-1/2-1-1/3-2-1/4-2-1/5-3-1` desktop + mobile; quote/view actions đúng + giữ product context; post read action đúng URL; image fallback (placeholder/SKVN); Woo inactive graceful |
| 1.3.16 From 1.3.7 | `imageRatio` render + apply đúng; arrows nhìn được + không clip; spacing (margin/gap) đúng; `showHeading`/eyebrow/intro đúng; archive CTA đúng link; catalog CTA toggle/URL/label đúng; card variants khớp artifact; badge overlay đúng; preset `4-2-1` responsive; collection CTA hovers đúng spec + reduced-motion + `:focus-visible`; editor preview hover thấy được trong DevTools |
| General (phần carousel) | Console sạch trên surfaces carousel; invalid-block không xuất hiện trên content collection; memory ổn định sau tương tác lặp trên trang carousel |

**→ M5 stack slider QA (mốc slider sau, chưa có SemVer):**

| Nguồn | Acceptance nhận |
|---|---|
| 1.3.11 Slider rendering/controls | 3 presets insert đúng; content cũ mở không invalid; Hero/Showcase/Card Carousel qua dynamic render; arrows/pagination desktop + mobile; timed pagination, pause/resume, reduced-motion, real-Slide numbering |
| 1.3.11 Parallax + 1.3.16 From 1.3.8 | Enable/disable đúng; subtle/medium/strong đúng depth; không edge-reveal; wipe/fade/zoom-out phối hợp đúng; tắt khi reduced-motion và `slidesPerView > 1` |
| 1.3.11 Step Slider + 1.3.16 From 1.3.10 | Tab navigation + sync; progress bar theo autoplay/tương tác; không invalid-block; mobile tab đọc được + touch được (chỉ khi đã implement) |
| 1.3.11 Flank controls (1.3.6 carry-in) | `bottom-center` cluster `‹ pagination ›` mọi pagination style; pill giữ order `arrows \| pagination`; các vị trí khác không regression; editor khớp frontend; onsite PASS theo test doc flank |
| 1.3.11 Button hover + 1.3.16 hover (phần slider) | Buttons trong slides nhận custom hover khi feature bật (`:hover`/`:focus-visible`, không strikethrough); base Gutenberg hover không vỡ trong/ngoài slider; specificity audit đạt |
| 1.3.16 Slider regression | `tests/slider-block.test.mjs` flank regression pass |
| General (phần slider) | Console sạch trên surfaces slider; memory ổn định sau tương tác lặp |

**Research input cho M5 (thêm 2026-10-14, không đổi scope/mapping/thứ tự/status/acceptance của roadmap):**

- Nghiên cứu slider: `docs/ideations/sliders/INDEX.md` — Step Slider là research input trực tiếp cho M5 (planning 018 đã hấp thụ và ghi truy vết tại §14); Seafood Store là candidate để so sánh interaction/composition, **không** phải scope M5 và không được tự đưa vào/ra milestone.
- Điểm chưa thống nhất giữa nghiên cứu và contract dự án: `docs/ideations/sliders/PROJECT_ALIGNMENT.md` (mục `NS-01`, `A-01`…`A-06`, `B-01`…`B-09`, `C-01`…`C-06`, `D-01`…`D-08`). M5 chưa có SemVer; các quyết định còn mở được liệt kê ở mục `§F` của file đó.

**→ Deferred rõ ràng (không bỏ, không vào 1.3.17):**

| Nguồn | Nơi nhận | Lý do |
|---|---|---|
| 1.3.11 Accordion interaction/a11y | M6 application validation (deferred) | Block độc lập, không thuộc carousel/toolkit core |
| 1.3.11 Card motion (device targeting, no-JS/reduced-motion) | M6 application validation (deferred) | Như trên |
| 1.3.11 Feature Showcase pattern | M6 application validation (deferred) | Như trên |
| Core Button Hover *feature* (1.3.4, chưa implement) | Ở lại 1.3.4 (xem lại) | Feature chưa tồn tại; chỉ phần hover-compat đã ship mới được QA ở 1.3.17/M5 |
| 1.3.16 From 1.3.12 Team Credits | Parking (theo human quyết) | Không chặn M6 |
| General (memory/a11y/responsive/compat) | Phân bổ theo surface bị tác động ở hai bảng trên | Không kiểm chung chung một lần rồi bỏ sót |


## 4b. Scope split hiện hành — human 2026-10-14

- **1.3.17 IN PROGRESS: Product/Post Carousel Block UI & Visual QA** — UI-01–08/UI-02a/03a/04a, visual Product/Post, responsive/geometry và regression tối thiểu của phần UI thay đổi.
- **1.3.18 PLANNED, chưa start: Product/Post Carousel Editor UX & Technical** — UX-01–08/UX-02a và TECH-01–11/TECH-08a Deferred theo mapping 040 §11.1. Build/test verification chia theo phần thực sự thay ở từng version.
- §4–§4a giữ acceptance baseline trước split để không mất việc; phân công version chính thức tại [040 §11](040_VER_1_3_17_CAROUSEL_UI_UX_TECHNICAL_PLANNING.md#11-quyết-định-tách-scope-thành-hai-semver--2026-10-14-hiện-hành). Full keyboard/loop/pause/query/security/lifecycle/editor parity thuộc 1.3.18, không kéo lại current qua nhãn regression.
- Current cần visual evidence + minimum smoke Grid/links/interactions/focus/reduce/no new fatal-invalid-block của UI đổi. Source defects cũ giữ evidence và Deferred, không tự PASS.
- Hướng đã chốt: CTA thẳng hàng; controls có tác dụng (hide/disabled mở); Post riêng; preset + bounded controls + reset rõ; truthful preview/help; inset padding vài mức token đều top/left/right, radius tự tính. Chưa token values/default/reset semantics/panel layout/technical architecture.
- P0–P5 tại §5 là trình tự gộp trước split; dùng 040 §11.5 cho execution current. M1 gồm hai patch; không tự start 1.3.18 hoặc M2. Không archive/transition/bump trong lượt planning.
## 5. Trình tự gộp trước split — xem §4b/040 §11 để thực thi current

P0 fixture (human: Woo + ≥6 sp + 2 pages) → P1 smoke → P2 card/chrome CSS lock → P3 geometry (`spaceBetween 20`, loop/non-loop, giữ preset hiện có) → P4 Post → P5 responsive/motion/a11y + test doc `docs/testing/onsite-collection-carousel-m1.md`.

Files dự kiến (chưa sửa): `src/collection/style.css`, `src/collection-view.ts`, `modules/collection-render/cards.php`, không đổi `*/block.json` chỉ để đổi default, test doc mới. Không đụng `src/shared/*`, `src/slider/**`, theme, GP nếu chưa có bằng chứng.

## 6. Review PM đã được human xác nhận — 2026-10-13

Nguồn chi tiết: [record chung](../../docs/decisions/project-goals-and-roadmap-reset.md), section `Review PM — 5 điểm đã được human xác nhận`. Thay thế D1–D3 cũ; agent không hỏi lại hoặc coi đây là blocker P2.

1. Woo mặc định là baseline M1; không bắt nhập MOQ/lead time/cert/demo meta B2B để PASS.
2. Product Carousel variation đã là `4-2-1` (`src/product-collection/variations.ts:23`); giữ default block gốc/Grid `3-2-1`. Post default chưa chốt mới. Không mặc định đổi block.json; nếu đổi sau này phải kiểm saved attributes/PHP fallback.
3. A11y không chứng minh Keyboard ←/→: collection-view.ts chưa import/configure Keyboard; audit/test và xử lý gap carousel nếu cần.
4. Navigation acceptance tách loop/non-loop và trường hợp item không đủ để trượt; không bắt disabled đầu/cuối khi loop bật.
5. Cert class không chặn M1; ưu tiên giữ class, sửa CSS nếu cần. POC là chuẩn visual, không bắt DOM giống hệt. Card render động; không coi resave là thay đổi class một chiều.

5 chỉnh sửa không tự phê duyệt implementation; lệnh promote/bắt đầu 2026-10-13 đã kích hoạt M1 riêng. Post visual vẫn cần human acceptance riêng.

## 6a. Review roadmap còn mở (PM)

- §3 đã tách từng mục theo hướng human chốt 2026-10-13 (Setup UI→M3 phần theme; Core Control tách giữ-tương-thích/hoãn-mở-rộng; Credits parking; Icon candidate; Surface→M3; CĐS→M6; TOC đề xuất M6 chưa chốt; GP 2.0→3.0→M3; header/footer tạm→M4). Các dòng "Xem lại" vẫn cần quyết cuối từng mục.
- M1–M6 không khóa lịch thực hiện tuần tự: chỉ chốt carousel trước Quote Flow; slider làm sau carousel; header/footer mới sau theme độc lập.
- QA carousel vào M1 và QA slider về mốc sau là đề xuất mapping; không tự resolve tension hoặc đổi status nguồn chính thức.
- Test responsive cần bổ sung quanh breakpoint 640/1024, thay đổi chiều rộng/orientation và các số lượng item ít/đủ/nhiều. Ba ảnh 1280/768/375 chưa đủ chứng minh responsive tốt khi resize trên Duo/Fold. Đây là đề xuất test PM, không yêu cầu tính năng bản lề.

## 7. Promote 1.3.17 — human bắt đầu 2026-10-13

- Ghi lệnh bắt đầu + version đã xác nhận vào bản ghi chung; Current mới:
  `V1 / 1.3.17 — Product/Post Carousel Stability & QA` (stack ref: M1) trong AGENTS.md + MILESTONES.md theo Transition Rule.
- 1.3.10 chưa bắt đầu: ghi deferred đúng trạng thái (giữ checklist + truy vết slider sang M5), không coi là completed; cách lưu history ghi rõ trong lệnh chuyển mốc.
- Move `RESOLVED_ACTIVE` tensions của milestone cũ sang `TENSIONS_HISTORY.md` (Status ARCHIVED); giữ OPEN.
- Chưa bump metadata trong planning. Khi human bắt đầu milestone mới, đối chiếu quy tắc milestone development build trong AGENTS.md; release/deploy có verification riêng. Không đồng nhất development version với release approved.
- Không đổi slug/namespace/option keys trong 1.3.17.
- Prompt handoff triển khai phải có version đã xác nhận (`1.3.17`), scope/acceptance (§4) và tham chiếu stack (M1). Không ghi `Current: M1`. Nếu mapping và current milestone không khớp, dừng implementation và báo chênh lệch.

### Kết quả promote đã ghi (2026-10-13)

- Current AGENTS.md/MILESTONES.md: 1.3.17 IN PROGRESS, stack M1; mục tiêu carousel ổn định, acceptance §4–§4a.
- 1.3.10 DEFERRED, không completed; checklist còn nguyên. History chỉ ghi sự kiện chuyển ưu tiên.
- Không có active tension thuộc 1.3.10 để archive; các OPEN và active thuộc mốc khác giữ nguyên.
- Chat PM chỉ sửa Markdown. Muse tiếp tục implementation trong scope đã chốt; metadata bump/build và test onsite còn chờ thực hiện/evidence, không suy ra PASS.
- Trạng thái chưa-bắt-đầu trong draft `.local/MILESTONES-roadmap-C-draft.md` đã bị quyết định promote này thay thế; draft không là current source of truth.
