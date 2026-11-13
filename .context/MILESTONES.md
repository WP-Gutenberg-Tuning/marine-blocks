# MILESTONES.md — SKVN Marine

> Source of truth cho milestone hiện tại và checklist chuyển mốc.
> File này phải được đọc khi bắt đầu task.
> Chỉ human mới có quyền xác nhận chuyển milestone/version.

---

## Current Milestone

Current: **V1 / 1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign**
Status: **IN PROGRESS — human start/transition, source có sẵn một phần, runtime Chờ kiểm chứng**
Started: **2026-11-12**
Human instruction: “commit để tiến hành push milestone sang1.3.21”. SemVer1.3.21 đã được human chốt2026-10-19 (đổi mapping2026-11-04) cho Hero contrast và mở rộng2026-11-09 với Slider Editor UI Redesign; không gán version khác. Đây là milestone advancement, không git remote push/deploy/release approval.

Human clarification2026-11-12: câu “Đẩy version, đã pass toàn bộ, những lỗi nếu có sẽ sửa trong milestone khác…” thuộc **ngữ cảnh1.3.20**, không phải PASS1.3.21. Ghi nhận nằm ở MILESTONES_HISTORY §1.3.20 (**1.3.20 → DONE_WITH_CARRY_OVER**). Current1.3.21 giữ **IN PROGRESS**, metadata1.3.21, không archive, không chuyển1.3.22. Commit tự chuyển1.3.22 (`563a66e`) đã revert bằng `cee8ed0`; transition chỉ xảy ra khi human ra lệnh riêng.

**1.3.20 → DONE_WITH_CARRY_OVER** (human PASS2026-11-12; lúc chuyển mốc ghi `DEFERRED_WITH_CARRY_OVER`). Snapshot current register + scope/checklist giữ nguyên tại MILESTONES_HISTORY.md §1.3.20. Category đã có source và human-tested một phần (T07/T09/T10/T11 PASS theo human, CGD-TECH03/04 PASS; T01–T06/T08/T12 chỉ confirm mức UX, không formal PASS); Woo Archive M1 AM1/AL/AR/AC vẫn Chờ kiểm chứng. **Human PASS2026-11-12** chốt acceptance1.3.20 ở mức người dùng (chi tiết history §1.3.20); evidence kỹ thuật còn thiếu là carry. Entry current này + AGENTS.md là source of truth mới; checkpoint dated trước2026-11-12 còn ghi current1.3.20 là lịch sử, superseded.

### Scope và acceptance current1.3.21

**Hero Slider Contrast Repair** — PATCH sửa cascade mặc định của Slider hiện có, không thêm block/attribute/dependency. Theme `style.css:98-115` đặt `color` lên `.wp-block-heading` ở (0,2,1) và thắng mọi rule Hero; carrier `color` trên `.skvn-slide__content` + `color: inherit` ở (0,3,0) đã có source. CTA mặc định white-pill + navy `#073b5a`, hover/focus `#eaf7ff`, guard `:not(.has-background)` ở (0,4,0) để thắng GP inline `a.wp-block-button__link` (0,2,1) mà không đụng background/gradient chọn tay. **Human PASS2026-11-13** cho HERO-UI-01–03 và HERO-UX-01. **Human2026-11-13 (bổ sung): “đã hết chớp, các cái khác pass, đang sửa một số cái nhỏ”** — HERO-TECH-03 kết luận theo human: chớp **không còn tái hiện**; các mục còn lại human xác nhận pass ở mức UX. Đây là xác nhận nghiệm thu, **không phải lệnh chuyển mốc**: current vẫn1.3.21 IN PROGRESS cho tới khi human ra lệnh riêng, và các lỗi nhỏ đang sửa phải được ghi lại trước khi đóng.

**Hero Slide background fill + copy/apply** — **scope amendment2026-11-12** (human Q&A + “OK, ghi lại”): per-slide fill trên Hero (default / custom solid+gradient / transparent), lớp dưới ảnh; modal Apply tách Fill vs Background image; plan [068](planning/068_VER_1_3_21_HERO_SLIDE_BACKGROUND_FILL_AND_COPY_PLAN.md), runbook [hero-slide-background-fill-1.3.21](../docs/testing/hero-slide-background-fill-1.3.21.md), acceptance **HSB-***. Human đã test; source implement — runtime HSB-* Chờ kiểm chứng; tách acceptance khỏi HERO-* (044 cố ý không schema).

**Hero Slide background image focal point** — **scope amendment2026-11-12** (sau test fill): per-slide focal (`FocalPointPicker`) cho mọi preset có slide background; Apply: Focal-only + focal kèm khi copy image; replace ảnh **giữ** focal; plan [069](planning/069_VER_1_3_21_HERO_SLIDE_BACKGROUND_IMAGE_FOCAL_POINT_PLAN.md), runbook [hero-slide-background-focal-1.3.21](../docs/testing/hero-slide-background-focal-1.3.21.md), acceptance **HSF-***. **Source2026-11-13** — chờ build + HSF onsite/runtime.

**Slider Editor UI Redesign** — đổi editor presentation/tổ chức control của Slider/Slide, không đổi frontend render/schema/save/motion. Nối053 P3/EF-SLIDER và phần Slider của EF-06; **Step Slider vẫn1.3.24**, không gộp. Source Concept01: P1 UX flow human “Đã test, đúng UX” (2026-11-09); P2/P3 frame lavender, scroll rail, native stage, static Arrow–Add–Pagination footer và Inspector states có source;19 selection/Add mocked tests + syntax10files PASS, presentation suite human10/10 PASS (64.42s, SSR/WP mocks). Human PASS thêm U02/U03/U05 ngày2026-11-12; còn U01/U04/U06/U07/U08/U09. **Chưa PASS**: native N01–03, WP/Gutenberg/iframe/assets evidence, 3–10Slide/limits, paired artifact/actual fidelity, geometry/perf. P0 pin WP/Gutenberg runtime + tagged API vẫn là gate trước khi coi là final. Harness `skvn-slider-editor-proof=1` là QA gate P1 đã retire, không phải UX sản phẩm; không chạy Swiper/autoplay trong editor; một mounted InnerBlocks tree, context/active state chỉ ở UI.

Contract bắt buộc: đọc [062](planning/062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md) + canonical HTML/CSS/JS artifact, kiểm hash, map AF01–10→source và so ảnh artifact/actual cùng available width trước coding/review; mọi delta bố cục/khung/nền/labels phải có evidence để human quyết. [063](planning/063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) chia P0–P5 và giữ ledger; runbook [slider-editor-ui-1.3.21](../docs/testing/slider-editor-ui-1.3.21.md) giữ exact cases.

Checklist đầy đủ HERO-*/SED-* ở mục §1.3.21 bên dưới; process waiver2026-11-12 vẫn hiệu lực ở nghĩa “không revert source editor đã làm khi current còn1.3.20”, không còn nghĩa chặn chuyển mốc.

| Work package | Source / acceptance | Trạng thái / evidence cần tiếp |
|---|---|---|
| Hero Slider Contrast Repair | Plan044; HERO-UI-01–03, HERO-UX-01, HERO-TECH-01–03 | **Human PASS2026-11-13** cho contrast (HERO-UI/UX) và **chớp đã hết**. HERO-TECH-01/02 (diff review, no-invalid-block, regression ngoài Hero) vẫn Chờ kiểm chứng hoặc carry khi chuyển mốc. |
| Slider Editor UI Redesign | Plan062/063 + Concept01 artifact; U01–U09, AF01–10, N01–03, SED-ED01–04/SED-TECH01/SED-UI01 | Đã có source, runtime Chờ kiểm chứng. P0 pin WP/Gutenberg/tagged API; native N01–03/iframe/assets, 3–10Slide/limits, paired screenshots, geometry/perf và no-invalid-block còn thiếu. Hero editor stage: human A 2026-11-13, sàn 36rem, chờ xem sau reload. |
| Hero Slide background fill | Plan068; HSB-UI-01–03, HSB-UX-01–02, HSB-TECH-01–02 | Source có; human đã test; HSB-* onsite Chờ kiểm chứng. |
| Hero Slide background focal | Plan069; HSF-UI-01–02, HSF-UX-01–02, HSF-TECH-01–02 | Plan070 source 2026-11-13: inset đứng yên = 0, scale che translate. Chờ human PRC-01–06. HSF-TECH-01 chưa PASS. |
| Slide overlay color | Plan071 | Planning 2026-11-13. Chưa code. Màu đặc, default `#073b5a`. |
| Parallax Translate only | Plan072; PTO-01–05. Research mép: plan073 | Source 072: Translate only không gắn scale. Edge blur `parallaxBlur` 0–48, mặc định 0. Cả hai chờ human xem trên frontend sau build. |
| Slider text stagger | Plan075; research074. STA-01–08, FAD-01–07 | Source 2026-11-13. Text motion Off / Stagger / Fade, mặc định Off. Chờ build và STA/FAD trên frontend. Đánh chữ §8.2 khi có nhu cầu, chưa code. |
| Ngoài current scope | Blog archive, Woo Archive M2 inquiry/second language, ratio control060§12, Visual Sidebar054 Q1–Q3, Step Slider1.3.24 | Chưa start/deferred; không tự gán vào1.3.21 hoặc mở ratio setting trong patch1:1. Step Slider giữ018/1.3.24 và acceptance riêng. |

### Carry register từ1.3.20 →1.3.21 — không mất acceptance

Đích theo dõi phần chưa nghiệm thu; không đổi owner/IDs hoặc tự mở coding scope. Snapshot 1.3.20 ở history giữ checklist gốc; bảng này là con trỏ vận hành, không thay hoặc rút gọn yêu cầu.

| Nhóm carry | IDs / nguồn gốc | Trạng thái giữ / bước tiếp |
|---|---|---|
| Category Grid + Category details | Plan049/061; CG-UI-01–04, CG-UX-01–03, CG-TECH-01–05, CGD-UI01–04/CGD-ED01–03/CGD-TECH01–04 | **Human PASS2026-11-12 cho scope1.3.20** (T07/T09/T10/T11 và CGD-TECH03/04 đã PASS trước đó; phần còn lại theo lời human “đã pass toàn bộ”). Evidence kỹ thuật chưa thu thập (DS-01–07 áp Category, geometry/onsite) là carry, không mở lại trạng thái. |
| Woo Archive M1 + shared Product card | Plan059/060; AM1-*, AL-01–06, AR-*, AC-* | **Human PASS2026-11-12 cho scope1.3.20**; source e7f789f, CSS7modelPASS + baseline16mockPASS giữ phạm vi. combined37PHP/hook-template10, build/lint và onsite geometry chưa có evidence → carry, không mở lại. Ảnh1:1 giữ, ratio control không mở. |
| Sidebar foundation + Theme Design | DS-01–07, TD-01–04 và named TD concurrency/owner/conflict cases;048/050 | Đã có source, runtime Chờ kiểm chứng: selection/tab/Undo/save/reopen, permissions/theme gate, draft/conflict/storage/fonts và conditional assets/lifecycle. |
| Sidebar hardening | S19-01–04 và toàn bộ SR2-* trong050/051 | Giữ source + VM/mock evidence từng plan; không runtime PASS. Handoff `docs/testing/plugin-design-sidebar-1.3.19-review-handoff.md`; test được carry, không xóa scope vì version mới. |
| Editor preview/canvas | CP01–05, EF01–06;052/053 | CP/EF onsite Chờ kiểm chứng; EF01–05 có source/8VM spacing modelPASS; EF06 phần Step vẫn audit/planning, phần Slider nay thuộc scope1.3.21. |
| Responsive Spacer | RS-UI-01–03, RS-UX-01–05, RS-TECH-01–04;055 | Source có,13Node model/spacing checksPASS phạm vi cũ; build/lint/geometry/onsite Chờ kiểm chứng; follow-up mint frame vượt khung Wide vẫn planning. |
| Content Actions | Toàn bộ CCP-* và CCP-R1–R4/R01–R06;057 |18modelPASS/11controller mockedPASS giữ; real WP clipboard/parse/Undo/permissions/Save/menu/runtime/build Chờ kiểm chứng. Right-click058 vẫn Deferred sau2.0. |
| Carousel carry từ1.3.18 | UX-01–13 (UX-02a và IDs con), UI-18-TITLE/STYLE; TECH-01–13 (TECH-08a/12 và IDs con), E01–E15;045/040 | E02/PASS có sẵn giữ nguyên; phần khác giữ status/evidence gốc, không làm lại PASS nếu không có regression. |
| Legacy carry C/D/media/arrows | State owner/overflow C, skeleton D-01–08, Post visual, controls hide/disabled, G-MEDIA, editor preview040§13 | Chờ kiểm chứng; giữ human override không sửa skeleton hoặc thêm skeleton toàn trang. Arrow centering source chờ onsite. |
| Chưa duyệt |054 visual controls Q1–Q3 | Planning/deferred, không tự start cùng1.3.21. Giữ decision/evidence tại plan, chờ human chọn khi trở lại scope. |

**Loading/navigation046 vẫn thuộc1.3.18**, acceptance LDR-01–09/UXHF-01–10 theo runbook riêng; không nhập vào1.3.21.

### Deferred test reminder khi bắt đầu1.3.21

Trước follow-up runtime khác, human chạy deferred baseline còn treo: Category CGD/CG/DS, Woo Archive AM1/AL/AR, cộng carry DS/TD/S19/SR2/CP/EF/RS/CCP và Carousel. Cho1.3.21, build/lint theo AGENTS bằng human rồi kiểm HERO-* + N01–03/SED trên đúng build đó; gửi versions/URLs, ảnh editor/frontend desktop/mobile, paired artifact/actual và console/network. Source/model PASS không thay runtime PASS.

### Island foundation — ngoài scope1.3.21, defer1.4.x

[066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK](planning/066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK.md) giữ toàn bộ kết luận Group/island: island = band + measure + gutter (ba chủ, không gộp); ba thất bại riêng của core Group — F1 clamp760/container query, F2 nền=box nên Wide dừng1200, F3 GP+80 math; measure model M1/M2/M3 (khuyến nghị M3-a native + M3-c hai variation); kiến trúc A1/A2/B/C với T1 là **dependency cứng**, A2 block variation là bước1 và B custom block là end state sau P0 proof. Stopgap WindPress **dormant**; chưa SemVer, chưa start, không source delta. Gates G-01..G-08 chưa đạt; G-05 yêu cầu chạy deferred test1.3.20 trước khi mở. Root cause 80px ở PITFALLS DP-07.1 và [group-island-windpress-class-1.3.20](../docs/testing/group-island-windpress-class-1.3.20.md); recipe/measure ở [group-island-width-1.3.20](../docs/testing/group-island-width-1.3.20.md).

## Standing rules, forward reminders và legacy checkpoints

Các mục dưới đây là quy tắc thường trực, nhắc việc tương lai và checkpoint lịch sử (1.3.18–1.3.19, 2.0.0). Chúng không thuộc scope1.3.21 và không bị thay bởi transition2026-11-12; các dòng ghi current1.3.20/1.3.18 hoặc “chưa chuyển mốc” là lịch sử đã superseded.

### UX hotfix bổ sung trong 1.3.18 — 2026-11-03

Human xác nhận đưa initial loading logo và fade chuyển trang vào milestone hiện tại, commit nhãn UX hotfix. **Chỉ planning; chưa duyệt implementation plan, chưa code/commit.** Plan [046](planning/046_VER_1_3_18_SITE_LOADING_NAVIGATION_UX_HOTFIX_PLAN.md), acceptance UXHF-01–10 và runbook `docs/testing/site-loading-navigation-ux-hotfix-1.3.18.md`. Không đổi current/version hoặc scope các mốc 1.3.21–23; không sửa skeleton, không coi hiệu ứng chuyển trang là fix toàn bộ flash cũ. Giữ nguyên acceptance/debt 045; completion hotfix không tự đóng milestone.

Cập nhật 2026-11-04: đoạn trên là checkpoint planning cũ; plan 046 đã ghi approval cũ và **đã có source trong b9332d3 — Hotfix Site loader**, chưa có evidence runtime PASS. Human yêu cầu điều tra commit và đề xuất cải thiện, không code/commit. **046 §11: homepage loader kéo rèm là proposal chưa implementation**; mapping UXHF→LDR-01–08 và runbook tương ứng giữ acceptance navigation/legacy, scope/frequency/settings còn cần chốt sau inventory. Không sửa skeleton, không chuyển current/bump version hoặc tự đánh dấu hoàn thành.

Execution update 2026-11-04 (UX hotfix 046): human đã yêu cầu bắt đầu, cung cấp DOM `https://minhhaifishery.com/home/`. §11 execution record có source rèm Smooth opt-in 750ms/main Hero ready/fallback1500, pre-init Hero, gate autoplay và vá step1/show-after0. 8 lifecycle VM tests PASS; build/lint và onsite LDR-01–09 chưa kiểm chứng. Snapshot Smooth onsite=false; không tự đổi options. Giữ skeleton/debt/current/version; chưa commit/deploy. Snapshot planning ở phần UX hotfix phía trên là lịch sử, không còn là gate implementation; không mở scope Editor UX 045.

### Review sau khi qua2.0 — feature proposals và Editor Context Menu (2026-11-05)

**Update mới hơn:** 057 đã được human duyệt coding+commit trong current1.3.19 không bump, xem scope addition ở đầu file và057§17. Các câu pending057 bên dưới là checkpoint trước approval;058 vẫn Deferred sau2.0, không thay trigger review/xếp lịch.

Human tách Content actions thành hai plan: [057](planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md) dùng menu ⋮ sẵn có của từng block, ưu tiên trước (SemVer/start TBD); [058](planning/058_FUTURE_CANDIDATE_EDITOR_CONTEXT_MENU_AFTER_2_0.md) right-click **Deferred sau khi qua2.0**. Khi đạt trigger này, agent phải tổng hợp các tính năng đề xuất đang chờ rồi trình human chốt scope/SemVer/thứ tự thực hiện. Không coi vừa bắt đầu2.0 là đã qua2.0; không tự gán2.0.1/2.1.0 hoặc start. Giữ CCP-TECH03 ở058, không mất acceptance. Update2026-11-05: human yêu cầu và cho commit research/plan/handoff docs;057§10–16 có proposal P0–P5, API/version gate, acceptance và memo scope/start còn mở. Handoff `docs/workflows/prompts/block-content-actions-agent-handoff.md`; runbook `docs/testing/block-content-actions.md`. Không đổi current/bump hoặc thêm057 vào1.3.19 khi chưa được human duyệt riêng.

### Nhắc thảo luận khi bắt đầu tách GeneratePress — Header/Footer và Mega Menu (2026-11-09)

**Trigger:** khi human bắt đầu/chuyển sang công việc tách theme khỏi GeneratePress (roadmap hiện tại: 2.0.0 bắt đầu migration), agent phải chủ động thông báo và đưa [digest megamenu](../docs/ideations/megamenu/README.md) ra thảo luận sâu trước khi chốt kế hoạch header/footer của đợt migration. Không đợi tới khi standalone hoàn tất mới nhắc.

- [ ] Trình lại digest cả thư mục: module Header/Footer, quản lý templates, navigation/drawer và research sóng; phân biệt reference với scope đã duyệt.
- [ ] Thảo luận host theme, plugin component/assets vs theme placement, storage/menu source, CTA mobile, phạm vi templates/conditions/wave và migration/fallback từ hệ hiện tại; mang theo câu hỏi §6 và acceptance HF-*.
- [ ] Trình human quyết định phạm vi, thứ tự và **SemVer/milestone cụ thể** sau khi đối chiếu roadmap. Chỉ ghi đã quyết khi có xác nhận; nếu chưa chốt, giữ mục chờ và ghi câu hỏi còn mở.

Đây là lịch nhắc để thảo luận/chốt milestone, **không phải lệnh triển khai ở 2.0.0**. Quyết định dựng module sau khi theme độc lập khỏi GeneratePress vẫn giữ hiệu lực; việc nhắc sớm không tự gán module vào 2.0.0 hoặc 3.0.0, không chuyển current 1.3.20. Theo dõi cùng [plan 013](planning/013_VERSION_2_0_0_TO_3_0_0_STANDALONE_BLOCK_THEME_PLANNING.md).

### Follow-up đã lưu cho 2.0.0 — GP layout dependency (2026-11-04)

Mục tiêu human bổ sung: **không phải chỉnh sửa thủ công toàn site khi migrate khỏi GeneratePress**. GP-LAYOUT-02 trong plan 013/runbook yêu cầu compatibility/mapping cho content và settings cũ, không cần resave từng page/post; nếu cần data migration phải có dry-run/report, chạy lại an toàn và rollback. Kiểm inventory URL/fixtures trên staging clone; mọi ngoại lệ cần báo trước cutover. Theo dõi từ 2.0.0 tới standalone gate 3.0.0; không tự cho phép rewrite dữ liệu hoặc thay current.

Human yêu cầu hoãn xử lý tới khi bắt đầu tách GeneratePress: không chọn GP Content Container **Contained** thì content tràn, SKVN Full width canvas on/off không giải quyết (human report, chưa đo/root cause chưa xác minh). **Deferred → V2 / 2.0.0**, standalone verification → V3 / 3.0.0; giữ current 1.3.18. Khi 2.0.0 trở thành current, nhắc chạy baseline GP-LAYOUT-01 trước follow-up layout khác. Planning 013 carry-in GP-LAYOUT-01; runbook `docs/testing/gp-content-container-layout-migration.md` có hai ảnh gốc đã lưu, state matrix và acceptance bộ layout/control SKVN. Không vá source hoặc khởi động migration trong lượt ghi nhận này.

### Thứ tự đã chốt — Sidebar 1.3.19 → Category Grid 1.3.20 → Hero contrast 1.3.21

Human xác nhận **2026-11-04**: hoán đổi scope 1.3.21 và 1.3.19 — **1.3.19 Plugin Design Sidebar Foundation → 1.3.20 Product Category Grid + Category details → 1.3.21 Hero Slider Contrast Repair**. Thay thứ tự Category trước Sidebar ngày 2026-10-28. Sidebar/Category chưa start; Hero giữ source đã có và acceptance chưa kiểm. Current vẫn 1.3.18; đây là đổi planning, chưa chuyển mốc/bump metadata.

- Sidebar: Selected block / Plugin tabs, selection/shortcut, component design controls và Theme Design (typography/fonts/brand colors theo capability SKVN Marine thực hỗ trợ).
- Consumers đầu tiên: Product/Post Carousel và Product Category Grid. Slider, Step Slider, 2-side Product tích hợp tại milestone riêng.
- Nguồn scope/states/acceptance DS-01–DS-07: `docs/workflows/ideation-plugin-design-sidebar.md`; section 1.3.19 bên dưới. Giữ acceptance 1.3.18/plan 045.
- SemVer đã xác nhận; trước implementation cần execution plan và human xác nhận start, không hỏi lại version. Không bump metadata trong lượt planning.

---

### Milestone stack → SemVer — bắt buộc trước khi triển khai

Future scopes: Product Category Grid + Category details giữ **1.3.20**, Post Category Grid riêng (SemVer TBD). Scope/states/acceptance ở `docs/ideations/category-grid-spec.md`. Human đổi thứ tự 2026-11-04: Sidebar **1.3.19** trước Category **1.3.20**, Hero contrast **1.3.21**. Không kích hoạt toàn bộ taxonomy collections/admin/filter deferred; cần lệnh start riêng.

Human decision (2026-10-13): roadmap 039 là **milestone stack**. Các nhãn M1–M6 chỉ định danh scope trong stack, không phải version và không thay current milestone.

- Audit, review và planning được dùng nhãn stack khi mục còn chưa có version.
- Trước khi đưa một mục vào triển khai, agent phải xác định scope, đề xuất SemVer cụ thể theo Version Naming Rule, nêu lý do chọn MAJOR/MINOR/PATCH, đối chiếu version hiện tại và các version đã dùng/đã dự kiến trong MILESTONES.md. Không tái dùng hoặc đè scope của một version khác nếu chưa có quyết định human rõ ràng.
- Human phải xác nhận SemVer và việc bắt đầu/chuyển milestone trước implementation. Nếu đã xác nhận trong session hoặc tài liệu quyết định thì dùng quyết định đó, không hỏi lại. Chọn ưu tiên/scope trong stack không tự là phê duyệt version hay chuyển mốc.
- Chưa có SemVer được xác nhận: tiếp tục audit/planning; không implement mục mới, đổi current milestone, bump metadata hoặc archive milestone/tension.
- Khi được xác nhận, ghi mapping nhãn stack → SemVer vào roadmap 039, đồng bộ current milestone trong AGENTS.md và MILESTONES.md theo Transition Rule. Định dạng current: `V<phase> / <MAJOR.MINOR.PATCH> — <tên scope>`; M1–M6 chỉ được ghi thêm như tham chiếu stack.
- Prompt handoff triển khai phải có version đã xác nhận, scope/acceptance và tham chiếu stack. Không ghi `Current: M1` hoặc dùng M1 thay cho `1.3.x`. Nếu mapping và current milestone không khớp, dừng implementation và báo chênh lệch.
- Sync metadata chỉ sau khi bắt đầu milestone đã được human xác nhận; milestone development build vẫn khác release approved. Chat chỉ planning/Markdown không chạy bump/build.

Quy tắc này không chọn version cho mục nào và không chuyển current milestone hiện tại.

### Chuyển ưu tiên (defer/reprioritize) — chỉ human quyết

- Phân biệt **hoàn thành milestone bình thường** (đủ acceptance DONE + smoke test + human approve theo Transition Rule) với **human quyết định hoãn/thay ưu tiên** khi milestone hiện tại chưa bắt đầu hoặc chưa hoàn thành.
- Khi human xác nhận chuyển ưu tiên, milestone cũ có thể ở trạng thái deferred dù checklist chưa DONE: giữ nguyên checklist, acceptance chưa giải quyết và mọi truy vết planning/decision; không bao giờ đánh dấu completed cho milestone bị dời và không làm mất acceptance nào.
- SemVer của scope mới và lệnh bắt đầu/chuyển mốc có thể được human xác nhận cùng lúc; nếu đã xác nhận trong session hoặc tài liệu quyết định thì dùng quyết định đó, không hỏi lại.
- Lượt chỉ sửa quy tắc không đổi Current, không archive milestone/tension, không bump metadata.

## Transition Rule

Với yêu cầu block/UI, acceptance DONE ở rule này nghĩa là đã kiểm chứng đạt và có approval cần thiết; không đồng nghĩa chỉ có source. Dùng trạng thái yêu cầu/evidence theo `docs/standards/block-ui-editor-ux-technical-review-contract.md`; không tự đổi status lịch sử hoặc bỏ acceptance.

Chuyển theo nhánh hoàn thành bình thường khi:

- Tất cả acceptance checklist của milestone hiện tại đã DONE.
- Runtime smoke test liên quan đã chạy.
- Human explicitly approve chuyển milestone.

Nếu human đổi ưu tiên khi mốc cũ chưa hoàn thành, áp dụng nhánh defer/reprioritize ở trên; không yêu cầu tick DONE giả. Giữ scope/checklist deferred ở checkpoint để tiếp tục sau, ghi sự kiện chuyển ưu tiên trong history.

Khi chuyển milestone:

1. Update `AGENTS.md` current milestone.
2. Update `.context/MILESTONES.md` current milestone.
3. If this is a release/deploy boundary, verify WordPress theme/plugin release metadata with `node tools/bump-project-version.mjs <version>` and follow `docs/workflows/versioning-release-workflow.md`.
4. If the milestone added or changed runtime PHP `require`/`include` paths, run the runtime file audit in `docs/workflows/deploy-artifact-workflow.md` before zip upload.
5. Move completed milestone checklist/notes sang `.context/MILESTONES_HISTORY.md`.
6. Move `RESOLVED_ACTIVE` tensions của milestone cũ từ `.context/TENSIONS_ACTIVE.md` sang `.context/TENSIONS_HISTORY.md`, đổi `Status: ARCHIVED`.
7. Giữ lại OPEN tensions còn liên quan trong `.context/TENSIONS_OPEN.md`.
8. Không tự archive hoặc tự chuyển milestone nếu human chưa approve.

## Version Naming Rule

- Version dùng SemVer: `MAJOR.MINOR.PATCH`.
- `MAJOR` tăng khi đổi phase lớn hoặc đổi kiến trúc/phạm vi sản phẩm lớn, ví dụ `1.x.x` → `2.0.0`.
- `MINOR` tăng khi thêm feature/scope mới nhưng vẫn cùng major, ví dụ `1.0.0` → `1.1.0`.
- `PATCH` tăng khi fix, hardening, hoặc integration nhỏ trong cùng minor, ví dụ `0.5.0` → `0.5.1`.
- Version launch-ready của một major là `MAJOR.0.0`, ví dụ `1.0.0` là V1 launch-ready, `2.0.0` là V2 launch-ready.
- Không dùng nhãn kiểu `1.0.0 Prep` cho feature mới. Nếu là prep trước launch, nó phải nằm trong milestone trước launch hoặc ghi `Future Candidate`.
- Nếu chưa chắc version của future work, ghi `Future Candidate` thay vì tự gán version.
- Planning filename phải khớp target version chính, ví dụ `001_VERSION_1_1_0_<TOPIC>_PLANNING.md` hoặc `002_VERSION_2_0_0_<TOPIC>_PLANNING.md`.
- Không đổi current milestone/version nếu chưa có human approve rõ ràng.
- `.context/MILESTONES.md` is the planning/scope source of truth. It does not automatically update WordPress theme/plugin `Version:` headers.
- When human explicitly starts a milestone, the agent may run `node tools/bump-project-version.mjs <version>` and rebuild plugin assets so the working WordPress metadata advertises the current milestone version. This is a milestone development build, not release approval.
- Before packaging or deploying a milestone release, verify again with `node tools/bump-project-version.mjs <version>` and rebuild plugin assets.

---

## Current V1.x Checkpoint

### 1.1.2 — Product Quote Flow & Map Block Testing

Status: **PENDING**

Purpose:

- Resolve deferred quote data-flow testing after the CF7 interface has already passed onsite visual review.
- Test quote submission from product/product-card/page-block flows, not only the standalone Request Quote page.
- Confirm map block/display issue because the current map surface is not viewable.
- Treat this as testing and source hardening around blocks/pages, not a custom CF7 form handler.

Carry-in from 0.10.0:

- CF7/Request Quote interface visual check: **PASS by human feedback on 2026-06-05**.
- Remaining quote debt is data flow only: submit, store, hidden/context fields, product-origin query params, and success/thank-you behavior.

Acceptance draft:

- [ ] Human runs `docs/testing/onsite-quote-flow-0.7.0.md` data-flow section from a product/product-card/page-block origin
- [ ] Human runs `docs/testing/onsite-quote-flow-0.7.1.md` runtime handoff data-flow section
- [ ] Human runs `docs/testing/onsite-map-block-1.1.2.md` on the onsite map page/surface
- [ ] Request Quote form submission succeeds from product-origin URL/query params
- [ ] CFDB7 stores at least one test submission
- [ ] CFDB7 row confirms visible fields are stored
- [ ] CFDB7 row confirms hidden/context fields are stored: `product_id`, `product_sku`, `product_name`, `product_url`, `source_url`, and UTM fields
- [ ] Thank-you/success UX confirmed
- [ ] Product CTA/query params confirmed from onsite product/product-card/page-block flow
- [ ] Console/log issues recorded or confirmed clean for quote flow
- [ ] Map block/display surface is visible onsite
- [ ] If current map cannot be viewed, mismatch is documented with screenshot, target URL, block markup/source, and console notes
- [ ] No custom PHP form handler is introduced
- [ ] No n8n webhook is exposed or required
- [ ] Human approves closing 1.1.2 testing

### 1.3.1 — Slider Navigation & Pagination Controls UX

Status: **DONE**
Started: **2026-06-11**
Completed: **2026-06-12**
Approved by human: **2026-06-12**

Purpose:

- Replace the dots-specific editor concept with a complete pagination contract.
- Add independent arrow and pagination visibility, style, and position controls.
- Add Swiper-owned timed fraction and timed segments without a second autoplay
  or timer controller.
- Keep one Slider-level governed duration and no per-Slide duration.
- Build on the corrected V1 / 1.3.0 media, geometry, pagination, and memory
  foundation.

Decision:

- `docs/decisions/slider-navigation-and-pagination-controls.md`

Dependencies:

- V1 / 1.3.0 dynamic rendering and repair foundation completed with human
  onsite approval on 2026-06-11.
- Existing `dots` and arbitrary delay values need explicit Gutenberg
  compatibility behavior.

Acceptance draft:

- [x] `dots` migrates to the approved pagination contract without invalidating existing content
- [x] Arrow visibility, three styles, and four positions follow the decision contract
- [x] Pill is disabled when Side center is selected
- [x] Pagination visibility, four styles, and three positions follow the decision contract
- [x] Matching bottom positions cluster as `arrows | pagination`
- [x] Different arrow and pagination positions remain independent
- [x] Zero/one real Slide hides both control families and disables autoplay
- [x] Timed pagination follows Swiper autoplay without a second timer/controller
- [x] Current/total numbering uses real Slides and excludes loop clones
- [x] Slider duration uses governed `5/7/9/12s` choices with a documented legacy-value policy
- [x] Hover, focus, document visibility, and interaction pause reasons compose correctly
- [x] Mobile and reduced-motion fallbacks work
- [x] Editor preview remains static and does not run autoplay/timer progress
- [x] Human approves 1.3.1 controls UX implementation



### 1.3.3 — Dynamic Product And Post Collections

Status: **DONE**
Started: **2026-06-13**
Completed: **2026-06-16**
Approved by human: **2026-06-16**
Note: Implementation shipped. Remaining onsite QA for product grid and post collection deferred to 1.3.9.

Purpose:

- Add governed dynamic collection blocks for product and post surfaces:
  Product Grid, Product Carousel, Post Grid, and Post Carousel.
- Use custom SKVN dynamic blocks while querying/rendering through native
  WordPress and WooCommerce APIs under the hood.
- Keep editor UX simple with four inserter choices, backed by two logic blocks:
  `skvn-marine/product-collection` and `skvn-marine/post-collection`.
- Preserve B2B funnel context through product card actions and Request Quote
  URLs.
- Ship plugin-owned baseline CSS/runtime so the blocks remain portable if the
  SKVN theme changes.

Decision:

- `docs/decisions/skvn-dynamic-collections-1.3.3.md`

Planning:

- `.context/planning/archives/024_VERSION_1_3_3_DYNAMIC_COLLECTIONS_PLANNING.md`

Testing:

- `docs/testing/onsite-dynamic-collections-1.3.3.md`

Architecture:

- Product collections own WooCommerce product query, product card markup,
  quote/context actions, and WooCommerce inactive fallback.
- Post collections own WordPress post query and post card markup.
- Grid and Carousel are layout modes, not separate query owners.
- Editor-facing inserter choices are:
  `SKVN Product Grid`, `SKVN Product Carousel`, `SKVN Post Grid`,
  and `SKVN Post Carousel`.
- Saved content stores query/layout/action attributes only. It does not store
  snapshots of product or post card HTML.
- Carousel layouts reuse only the relevant Slider/Swiper foundation: adapter,
  pause policy, document visibility behavior, and reduced-motion guard.
- Grid layouts do not load carousel runtime.
- Product/Post cards must not be forced into `skvn-marine/slide` InnerBlocks.

Constraints:

- Do not use direct custom SQL.
- Do not depend on WooCommerce experimental Product Collection extension APIs
  as the SKVN source of truth in V1.
- Do not save product/post snapshots into page content.
- Do not implement Product Taxonomy Collections admin in this milestone.
- Do not implement product attribute query, faceted filters, AJAX load more,
  grouped taxonomy navigation, archive builder, or universal CPT collection in
  this milestone.
- Do not add custom object/transient caching unless onsite evidence proves it
  is required.
- Product collections must not fatal when WooCommerce is inactive.
- Carousel autoplay is off by default, disabled for reduced motion, and must not
  run in the editor.
- If autoplay is enabled, render a visible Pause/Play control.

Implementation order:

1. Contract and shared constants/types.
2. Post Collection Grid.
3. Product Collection Grid.
4. Shared carousel runtime and Product/Post Carousel variations.
5. Performance, dependency, fallback, and accessibility hardening.
6. Human onsite QA and source fix pass.

Acceptance draft:

- [x] `docs/decisions/skvn-dynamic-collections-1.3.3.md` is reviewed before source implementation
- [x] `skvn-marine/product-collection` and `skvn-marine/post-collection` are registered as dynamic blocks
- [x] Four inserter choices exist: Product Grid, Product Carousel, Post Grid, Post Carousel
- [x] Saved markup stores attributes only and does not snapshot product/post cards
- [ ] Product collections query through WooCommerce/native APIs without direct custom SQL
- [x] Post collections query through WordPress native APIs
- [ ] Query controls support category/tag multi-select, `AND`/`OR`, item limit, and approved order modes
- [ ] `Shuffle balanced pool` avoids SQL random ordering and uses the documented pool strategy
- [x] Grid respects max 5 columns and max 3 rows
- [x] Carousel respects max 10 items
- [x] Responsive presets `1-1-1`, `2-1-1`, `3-2-1`, `4-2-1`, and `5-3-1` work
- [ ] Product cards support governed field visibility and quote/view/custom action modes
- [ ] Request Quote action preserves product context in the generated URL
- [ ] Post cards support governed field visibility and read/custom action modes
- [ ] Badge behavior supports display-only and archive-link modes
- [ ] Product image fallback uses product image, WooCommerce placeholder, then SKVN fallback
- [ ] Post image fallback uses featured image, then SKVN fallback
- [ ] Carousel reuses shared pause/reduced-motion policy without making grid load carousel runtime
- [ ] Autoplay off/default, pause, document visibility, focus, and reduced-motion behavior pass
- [x] WooCommerce inactive state does not fatal product collection blocks
- [x] Plugin baseline CSS keeps blocks readable without relying on theme patterns
- [ ] Theme pattern follow-up is deferred until plugin implementation and onsite QA pass
- [ ] Plugin build, PHP syntax checks, deploy artifact audit if runtime PHP paths change, and onsite QA pass
- [ ] Human approves milestone completion

Deferred to 2.x.x or later:

- `Products -> Taxonomy Collections`
- Product Taxonomy Collections admin
- Attribute/tag thumbnail metadata UI
- Group by taxonomy
- Faceted/AJAX filtering
- Archive builder
- Technical product/specification card
- Universal CPT collection block

### 1.3.5 — Post, Product & Archive Page Improvements

Status: **PLANNING**
Started: **2026-06-17**

Purpose:

- Cải thiện giao diện và UX cho trang Post, Product, và Archive theo Style C Hybrid.
- Thiết lập font token system configurable qua WP Customizer.
- Fix CSS token bridge giữa `--skvn-*` và `--wp--preset--*`.
- Ẩn comment section và Reviews tab không phù hợp B2B.
- Phục vụ context xuất nhập khẩu thủy sản cao cấp (grouper, mahi-mahi) — positioning gần luxury food brand.

Planning:

- `.context/planning/archives/025_VER_1_3_5_POST_PRODUCT_ARCHIVE_IMPROVEMENTS.md`

Design artifacts:

- `docs/artifacts/post-archive-style-C-hybrid.html`
- `docs/artifacts/single-post-style-C.html`
- `docs/artifacts/single-product-style-C.html`
- `docs/artifacts/font-compare-b2b.html`

Implementation order:

1. Font Customizer control (default: Instrument Serif)
2. CSS token bridge fix (`--skvn-color-*` → `--wp--preset--color--*`)
3. Archive page — Style C Hybrid
4. Single Product page — conversion priority
5. Single Post page — content marketing

Acceptance draft:

- [ ] Font Customizer control hoạt động, 4 preset chuyển đổi được
- [ ] Instrument Serif là default, load từ Google Fonts
- [ ] CSS token bridge: `--skvn-color-*` reference đúng chiều từ WP preset vars
- [ ] Archive page dùng layout Style C Hybrid (featured post + card grid)
- [ ] Sidebar archive: open = 2fr + 1fr, closed = full-width 3-col grid
- [ ] Single Product: gallery trái + details phải, Quote CTA primary nổi bật
- [ ] Single Product: Reviews tab đã bị ẩn
- [ ] Single Product: placeholder navy branded "Hình sắp cập nhật"
- [ ] Single Product: trust signals (VSATTP, HACCP, Cold Chain, Bảo hành)
- [ ] Single Post: hero image + content + sidebar phải
- [ ] Single Post: comment section đã bị ẩn
- [ ] Layout sizing dùng `fr`/`%` — không hardcode px/em
- [ ] `prefers-reduced-motion` áp dụng cho mọi animation
- [ ] Desktop + Mobile QA pass cho cả 3 page types
- [ ] Human approves milestone completion

### 1.3.8 — Slider Parallax

Status: **DONE**
Started: **2026-07-01**
Completed: **2026-07-01**
Approved by human: **2026-07-01**

Purpose:

- Add Slider Parallax effect using Swiper 11 built-in Parallax Module.
- Implement both translate + scale depth on background image layer.
- Governed intensity presets (subtle/medium/strong) with coupled inset to prevent edge-reveal.
- Support all three transitions (wipe/fade/zoom-out) without auto-disable.

Decision:

- `docs/decisions/slider-parallax-both-1.3.8.md`

Dependencies:

- V1 / 1.3.6 Trục C (single post fix) completed; Trục A → **1.3.7** impl; Trục D onsite QA → **1.3.11**.
- V1 / 1.3.1 controls and dynamic rendering foundation stable.

Acceptance draft:

- [ ] `enableParallax` + `parallaxIntensity` attributes in Slider `block.json`
- [ ] `.skvn-slide__bg` wrapper added to PHP render, editor, and saved markup
- [ ] Inspector toggle + intensity presets (subtle/medium/strong) visible when enabled
- [ ] Runtime parallax (translate + scale) applies only when enabled and `slidesPerView === 1`
- [ ] Inset CSS var couples with intensity: subtle -20%, medium -35%, strong -50%
- [ ] `prefers-reduced-motion` disables parallax completely (no inline transform)
- [ ] Card carousel / multi-view: parallax disabled via `slidesPerView > 1` guard
- [ ] Editor badge "Parallax ON · {intensity}" shows when enabled; no parallax motion in editor
- [ ] Wipe + parallax: translate background while content wipes — no edge-reveal
- [ ] Fade + parallax: fade transitions with background depth — working
- [ ] Zoom-out + parallax: compounded scale (media zoom-out + bg scale) intentional, no artifact
- [ ] Loop, autoplay, keyboard, touch: no regression
- [ ] Old slider content (pre-parallax) renders without fatal error
- [ ] Plugin build, PHP lint, deploy artifact audit pass
- [ ] Human approves milestone completion

### 1.3.9 — Custom Icon Upload

Status: **PARKING / Future Candidate**

Purpose:

- Upload custom icon asset for SKVN Marine branding (block inserter, admin menu).
- Defer until icon design finalized.

### 1.3.4 — Core Control Foundation & Core Button Hover

Status: **PENDING**

Purpose:

- Add `SKVN Marine -> Core Control` as the shared settings and registry surface
  for optional WordPress core-block and editor enhancements.
- Establish a migration-ready Core Control architecture inside the current
  `skvn-marine-blocks` plugin.
- Prove the architecture with the first opt-in enhancement:
  `Core Button Hover Colors`.
- Move the existing editor-only Block Copy/Paste utility under Core Control and
  govern it with the same registry and option.

Decision:

- `docs/decisions/core-control-core-button-hover.md`

Planning:

- `.context/planning/archives/023_VERSION_1_3_4_CORE_CONTROL_PLANNING.md`

Dependencies:

- V1 / 1.3.1 remains focused on Slider controls and contract completion.
- Human must approve starting V1 / 1.3.4 before implementation or project
  version metadata changes.

Scope:

- Add a module-shaped PHP foundation under `modules/core-control/`.
- Add editor extension code under `src/core-controls/`.
- Store feature toggles in the namespaced `skvn_core_controls` option.
- Register one reusable feature registry so later core enhancements do not
  duplicate menu, Settings API, sanitization, or asset-loading logic.
- Add `Core Button Hover Colors`, disabled by default.
- Add `Block Copy/Paste`, disabled by default.
- Extend all `core/button` blocks with namespaced hover text/background color
  controls in a separate stable Inspector panel.
- Apply configured colors to `:hover` and `:focus-visible`, with scoped CSS and
  reduced-motion handling.
- Preserve compatibility attributes and saved values when the feature is
  disabled.
- Block Copy/Paste must not override native clipboard handlers, alter saved
  markup, add frontend assets, or depend on Gutenberg private DOM/UI.

Constraints:

- Do not modify WordPress core, Gutenberg private panel UI, or GeneratePress.
- Do not create or rename a plugin.
- Do not use raw unnamespaced attributes, classes, options, or CSS variables.
- Do not use `!important` or require frontend JavaScript.
- The feature toggle controls UI and styling, not parsing compatibility.
- Do not add Core Control enhancements beyond Button Hover and Block Copy/Paste
  in this milestone.
- Do not add automatic third-party plugin conflict detection.
- Keep the first admin UI functional and clear; visual redesign is later scope.

Acceptance draft:

- [ ] `Core Control` appears under the existing `SKVN Marine` admin menu
- [ ] The registry supports adding another feature without duplicating the settings-page foundation
- [ ] `skvn_core_controls` is registered and sanitizes only known boolean keys
- [ ] `Core Button Hover Colors` defaults to disabled
- [ ] `Block Copy/Paste` defaults to disabled
- [ ] Disabled state exposes no hover controls and applies no hover styling
- [ ] Enabled state exposes text/background hover controls for all `core/button` blocks
- [ ] Existing buttons remain unchanged until hover values are configured
- [ ] Hover and `:focus-visible` use the configured colors
- [ ] Reduced-motion removes the governed color transition
- [ ] Disable/re-enable preserves configured values
- [ ] Editor reload and plugin deactivate/reactivate do not produce invalid blocks
- [ ] Editor preview and frontend output remain consistent
- [ ] Enabled Block Copy/Paste exposes exactly two editor menu actions
- [ ] Disabled Block Copy/Paste exposes neither action
- [ ] Slider and nested block hierarchy survive cross-page visual-editor paste
- [ ] Native WordPress copy/paste behavior remains unchanged
- [ ] No `!important`, frontend JavaScript, WordPress core change, or GeneratePress change is introduced
- [ ] PHP lint, plugin build, deploy artifact audit, and onsite QA pass
- [ ] Human approves milestone completion

### 1.3.10 — Fullscreen Step Slider

Status: **DEFERRED**
Deferred: **2026-10-13**, human chuyển ưu tiên sang 1.3.17 carousel stability.
Nơi nhận: **M5 — Slider → V1 / 1.3.24 — Fullscreen Step Slider**, human gán version ngày **2026-11-07**. 1.3.10 giữ DEFERRED, chưa hoàn thành; acceptance và planning/decision links bên dưới được kế thừa đầy đủ tại 1.3.24. Chưa có lệnh start.

Purpose:

- Add a dedicated fullscreen process/timeline Slider block for urgent landing
  page storytelling needs.
- Build it on top of the V1 / 1.3.0 dynamic Slider rendering foundation instead
  of creating a second Slider engine.
- Provide bottom tab navigation with per-step progress, media/content layers,
  and motion presets suitable for sequential process narratives.
- Keep Gutenberg-native editing with InnerBlocks and child step blocks; do not
  switch to a `slides` array or custom slide repeater.
- Inherit parallax foundation from V1 / 1.3.8 and adapt as needed.

Planning:

- `.context/planning/018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md`

Decision:

- `docs/decisions/sliders/step-slider/fullscreen-step-slider-1.3.10.md`

Dependencies:

- V1 / 1.3.0 dynamic Slider render architecture.
- V1 / 1.3.8 Slider Parallax foundation (optional inheritance).

Acceptance draft:

- [ ] Architecture contract is approved before source implementation
- [ ] `skvn-marine/step-slider` and `skvn-marine/step-slide` ownership is documented
- [ ] Step Slider uses dynamic PHP render and shared Slider foundation
- [ ] Editor uses Gutenberg-native InnerBlocks/List View operations
- [ ] Bottom tab navigation reflects slide order and active state
- [ ] Progress bar synchronizes with Swiper autoplay, click, hover/focus pause, and reduced motion
- [ ] Wipe/text motion uses governed presets and has reduced-motion fallback
- [ ] Mobile tab UI remains readable without overflow
- [ ] No custom slide manager, `slides` array, or second runtime is introduced
- [ ] Plugin build, PHP syntax checks, deploy artifact audit, and onsite QA pass
- [ ] Human approves milestone completion

### 1.3.11 — Comprehensive Onsite QA (Slider, Collections & Controls)

Status: **PENDING**

Purpose:

- Consolidated **onsite QA** for Slider family: Hero, Product Showcase, Card Carousel, Parallax effect, Step Slider.
- Test V1 / 1.3.0 dynamic rendering + 1.3.1 controls + 1.3.8 parallax + 1.3.10 step slider on live site.
- Verify Accordion, Card motion, and B2B Feature Showcase checks that were deferred from earlier milestones.
- Verify 1.3.3 dynamic collections + **1.3.7** collection polish and button-hover work onsite.
- Verify **1.3.6** carry-in: slider bottom-center flank controls (source shipped).
- Run comprehensive memory, accessibility, responsive, and reduced-motion validation.

Product launch **deferred** → post **V1 / 1.5.x**; identity cập nhật 2026-11-04 thành **Marine Blocks**, migration target 1.4.0 theo plan 047, public version cần xác nhận lại. Decision: `docs/decisions/gu-supercharger-launch-post-1.5x.md` (amended).

Testing:

- `docs/testing/onsite-slider-motion-1.3.2.md`
- `docs/testing/onsite-feature-showcase-1.2.3.md`
- `docs/testing/onsite-dynamic-collections-1.3.3.md`
- `docs/testing/onsite-button-hover-1.3.7.md`
- `docs/testing/onsite-slider-flank-controls-1.3.6.md`

Acceptance draft:

**Slider Dynamic Rendering & Controls (1.3.1):**
- [ ] Human verifies all three Slider presets insert useful sample content
- [ ] Human verifies existing Slider content opens without invalid-block recovery
- [ ] Human verifies Hero, Product Showcase, and Card Carousel frontend layouts through dynamic render
- [ ] Human verifies V1 / 1.3.1 arrow and pagination controls across desktop and mobile
- [ ] Human verifies timed pagination, pause/resume, reduced-motion fallback, real-Slide numbering

**Slider Parallax (1.3.8):**
- [ ] Parallax effect enabled/disabled in editor and frontend works correctly
- [ ] Subtle/medium/strong intensity presets show expected depth
- [ ] No edge-reveal artifacts (image mismatch) at viewport edges
- [ ] Wipe + parallax: coordinate without conflicts
- [ ] Fade + parallax: coordinate without conflicts
- [ ] Zoom-out + parallax: compounded scale is intentional, not artifact
- [ ] Parallax disabled correctly with `prefers-reduced-motion` and `slidesPerView > 1`

**Step Slider (1.3.10):**
- [ ] Bottom tab navigation renders and sync correctly
- [ ] Progress bar updates during autoplay and user interaction
- [ ] Step content loads without invalid-block errors
- [ ] Mobile tab UI remains readable and touchable

**Accordion, Card Motion, Feature Showcase:**
- [ ] Human verifies Accordion interaction and accessibility
- [ ] Human verifies Card motion device targeting and no-JS/reduced-motion fallbacks
- [ ] Human verifies the B2B Seafood Feature Showcase pattern editor/frontend layout

**Slider bottom-center flank controls (carry-in 1.3.6 Trục D — source shipped):**
- [ ] `bottom-center` arrows + `bottom-center` pagination → `‹ pagination ›` (all pagination styles)
- [ ] `pill` + cluster giữ order mặc định `arrows | pagination`
- [ ] `bottom-left` / `bottom-right` / `side-center` không regression
- [ ] Editor preview khớp frontend flank layout
- [ ] Human onsite PASS per `docs/testing/onsite-slider-flank-controls-1.3.6.md`
- [ ] Mobile timed pagination width — tune deferred (evidence in QA notes)

**Button hover & collection CTAs (carry-in 1.3.7 — onsite QA):**
- [ ] Buttons (core/button with feature) inside SKVN Slider slides receive configured custom hover on :hover/:focus-visible onsite (no strikethrough in DevTools; computed colors match vars); falls back to preset when no custom hover or feature off
- [ ] Base Gutenberg hover (`a:hover, a:focus, a:active { color: var(--contrast); }` or equivalent) không bị break cho links/buttons trong slider vs ngoài slider
- [ ] Specificity audit passed per contract onsite: hover rule (feature or collection) ≥ strongest theme/slider rule
- [ ] Onsite + DevTools evidence per `docs/testing/onsite-button-hover-1.3.7.md`
- [ ] New collection CTAs hovers match 028 spec onsite (bg/underline, reduced-motion, :focus-visible)
- [ ] No regression on existing button visuals, slider layouts, or collection card hovers

**Collections (1.3.3 + 1.3.7 polish) onsite QA:**
- [ ] Product Grid renders correctly onsite with WooCommerce products (real data)
- [ ] Post Grid renders correctly onsite with real posts
- [ ] Product Carousel renders and Swiper initializes without errors
- [ ] Post Carousel renders and Swiper initializes without errors
- [ ] Responsive presets (`1-1-1`, `2-1-1`, `3-2-1`, `4-2-1`, `5-3-1`) work on desktop and mobile
- [ ] Product card quote/view actions link correctly with product context
- [ ] Post card read action links to the correct post URL
- [ ] Image fallback (product placeholder / SKVN fallback) works when no image is set
- [ ] WooCommerce inactive state shows graceful fallback, no fatal

**General:**
- [ ] Human verifies idle and repeated-interaction memory use settles without continuous growth
- [ ] Invalid-block, console, layout, and cache issues are recorded or confirmed clean
- [ ] Any source defects are fixed and re-tested
- [ ] Browser console is clean across all tested surfaces
- [ ] Human approves closing Slider & Collections comprehensive QA

### 1.3.7 — Collection Block UI & Card Styles

Status: **DONE**
Started: **2026-06-23**
Completed: **2026-07-01**
Approved by human: **2026-07-01**

Human confirmed (Option A + added scope 2026-06-22): Dedicated 1.3.7 slot for collection UI/card styles polish + "hover button" work (fix stuck case of buttons inside Slider not receiving hover like Gutenberg `a:hover { color: var(--contrast); }` mechanism, plus polish hovers on new collection CTAs). See `docs/testing/onsite-button-hover-1.3.7.md` for DevTools verification steps. Planning source 028 finalized; button hover compatibility pulled from 1.3.8 plans per user request. Human moved current milestone to 1.3.7 on 2026-06-23.

Human routing (2026-06-23): Implementation + build gate thuộc **1.3.7**; onsite/human/DevTools QA thuộc **1.3.11**.

Purpose:

- Nâng cấp giao diện và UX của `skvn-marine/product-collection` và `skvn-marine/post-collection`.
- Fix 2 bugs đã xác nhận từ code review (2026-06-17).
- Thêm các block attribute mới để kiểm soát heading, spacing, archive CTA.
- Triển khai card style variants dựa trên design artifact `.local/Seafood Export Carousels Tailwind.html`.
- **Không bao gồm** các feature yêu cầu data model chưa tồn tại (MOQ, Lead Time, certifications) — đó là scope 1.5.0.
- Resolve "hover button" for action elements: ensure new collection CTAs (quote, catalog, read-more...) have proper hovers per 028 spec + reduced-motion; make buttons/links inside Slider respect base Gutenberg hover (`a:hover, a:focus, a:active { color: var(--contrast); }`) or Core Button Hover feature when configured (without being overridden by hero preset hard-codes). DevTools tests per contract (specificity, class/vars, computed styles on :hover).

Planning:

- `.context/planning/028_VER_1_3_7_COLLECTION_UI_CARD_STYLES_PLANNING.md`
- `.context/planning/026_VER_1_3_6_BLOCK_EDITOR_UX_AND_SLIDER_PARALLAX_PLANNING.md` (Trục A — carry-in)
- `.context/planning/archives/031_VER_1_3_6_SLIDER_BOTTOM_CENTER_FLANK_CONTROLS_PLANNING.md` (Trục D — carry-in, source shipped)

Onsite QA: deferred to **1.3.11** (`onsite-button-hover-1.3.7.md`, `onsite-dynamic-collections-1.3.3.md`, `onsite-slider-flank-controls-1.3.6.md`).

Design artifact:

- `.local/Seafood Carousels.html` — UI reference (bundled HTML, mở bằng browser)

Bugs cần fix (đã xác nhận):

- `imageRatio` attribute không tạo class `skvn-collection--ratio-*` → ratio setting vô nghĩa
- Carousel arrows (`left: -1.25rem` / `right: -1.25rem`) bị clip bởi `overflow: hidden` của Swiper container

Phase 1 scope (data có sẵn — làm được ngay):

- Spacing: `margin-top` / `margin-bottom` cho `.skvn-collection` section, khoảng cách heading → grid/carousel
- Heading controls: toggle `showHeading` (boolean), `eyebrow` text attribute (vd: "EXPORT CATALOG", "INSIGHTS")
- Intro text: attribute `intro` đã có, cần đảm bảo render và style đúng
- Archive CTA: `archiveUrl` + `archiveLabel` attribute cho section footer ("Xem toàn bộ danh mục →", "Đọc tất cả bài viết →")
- Catalog CTA: `showCatalogCta: boolean` + `catalogCtaUrl: string` + `catalogCtaLabel: string` (default: "Tải catalog") — toggle on/off, URL do user tự điền (PDF trực tiếp hoặc lead gen page). Áp dụng cho cả `product-collection` và `post-collection`.
- Card styles: ít nhất 1 style variant từ design artifact (product card + post card)
- Category badge overlay trên ảnh (thay vì bên dưới title như hiện tại)
- 4-column preset: thêm option `4-2-1` vào SelectControl editor và CSS
- Hover polish for new CTAs (catalog-cta, cta, read-more, archive, pdf per 028 CSS) + reduced-motion guard.
- Slider button hover compatibility (buttons inside slides use custom hover from Core feature or base --contrast when expected; hero hard-codes use var fallback).

Các feature CHƯA planning xong (cần brainstorm tiếp):

- Card style system: bao nhiêu style variant? switch bằng attribute hay CSS class? theme override hay plugin-owned?
- Prefetch strategy: hover-prefetch cho product card links hay không? Ảnh hưởng performance thế nào?
- Image ratio per collection type: product default 1:1, post default 16:9 — hardcode theo preset hay user-selectable?
- `badgeBehavior: 'overlay'` — overlay badge trên ảnh có cần thêm enum value mới không?

Constraints:

- Không implement MOQ, Lead Time, certifications, spec sheet PDF — scope 1.5.0.
- Card styles phải work với dữ liệu WooCommerce/WP có sẵn, không cần custom meta.
- Plugin-owned CSS; không phụ thuộc vào theme class.
- Hover work must follow gutenberg-block-extension-css-contract.md (specificity check in DevTools first, editor.BlockListBlock for preview, scoped class+vars, behavior test not source grep, reduced-motion for all hovers). Slider case limited to making preset hovers respect feature vars (no change to core-control itself).

Acceptance draft:

**Carry-in 1.3.6 — Editor UX (Trục A):**
- [ ] Tất cả Inspector panels dùng 4-section Content/Style/Layout/Advanced
- [ ] Slider và Accordion có empty state placeholder với action button
- [ ] Collection skeleton grid match responsive preset khi editor đang load
- [ ] Block icons và descriptions không còn blank trong inserter
- [ ] Inspector panel refactor không invalidate content hiện có

**Collection UI & card styles (1.3.7 Phase 1):**
- [ ] `imageRatio` tạo class `skvn-collection--ratio-*` và áp dụng đúng trên frontend + editor
- [ ] Carousel nav arrows nằm section header (không bị clip bởi Swiper overflow)
- [ ] Spacing margin-top/bottom + heading → grid/carousel gap hoạt động
- [ ] `showHeading`, `eyebrow`, `intro` render và style đúng
- [ ] Archive CTA (`archiveUrl` + `archiveLabel`) render đúng section footer
- [ ] Catalog CTA toggle + URL + label hoạt động (product + post collection)
- [ ] Card style variant (product + post) khớp design artifact baseline
- [ ] Category badge overlay trên ảnh
- [ ] Preset `4-2-1` có trong editor SelectControl và CSS responsive

**Button hover & collection CTAs (implementation):**
- [ ] New collection CTAs hovers implemented per 028 §4 (bg/underline changes, transitions); reduced-motion guard in CSS; :focus-visible styles present
- [ ] Core Button Hover + slider preset CSS shipped: custom hover vars apply when feature on; preset fallbacks when off
- [ ] Editor preview hover works (BlockListBlock wrapper + vars visible in editor iframe DevTools)

**Chung:**
- [ ] `tests/slider-block.test.mjs` flank regression pass (automated guard for 1.3.6 Trục D source)
- [ ] Plugin build + PHP lint pass
- [ ] Human approves milestone completion (implementation scope; onsite QA closes in 1.3.11)

---


### 1.4.0 — Marine Blocks Identity & Compatibility Migration

Status: **PLANNED — Chưa làm**

Human decision **2026-11-04**: chốt **1.4.0** cho migration; Setup UI cũ 1.4.0 → **1.4.1**, Layout/Quote Validation cũ 1.4.1 → **1.4.2**, cả hai PENDING và giữ nguyên acceptance. Chưa start; current 1.3.18 và metadata giữ nguyên. MINOR 1.4.0 dành cho scope chuyển identity/compatibility sản phẩm; không chỉ sửa nhãn PATCH. Migration phải bảo vệ dữ liệu/consumer cũ theo plan 047.

Plan: `.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md` — mapping, evidence baseline, P0–P4, MB-01–MB-09.

- Marine Blocks (`marine-blocks`, PHP `marine_blocks_`) thay identity GU Supercharger; theme SKVN Marine giữ nguyên.
- Bộ block chuyên dụng và patterns để dựng/chỉnh sửa/bàn giao nhanh; không full-FSE supercharger. Plugin styling/runtime độc lập; WindPress enhance core/pattern website.
- [ ] MB-01/09: Editor naming, saved content, workflow/i18n PASS.
- [ ] MB-02/03/06: visual/query/runtime và independence PASS.
- [ ] MB-04/05: settings, theme consumers, idempotent data migration PASS.
- [ ] MB-07/08: packaging/activation và rollback rehearsal PASS.
- [ ] Start xác nhận trước implementation (SemVer 1.4.0 đã chốt); pilot onsite và human nghiệm thu trước completion.

Migration không đồng nghĩa public launch; gate sau 1.5.x giữ tới quyết định riêng, không tự reset version 0.0.1 hoặc hủy acceptance cũ.

### 1.4.1 — SKVN Theme Init Setup UI

Status: **PENDING**

Purpose:

- Discuss and design an wp-admin setup screen for reusable SKVN setup tasks.
- Candidate setup card: Request A Quote Workflow.
- The UI should let an admin load a reviewed setup template from wp-admin instead of requiring WP-CLI for every setup pass.

Wireframe note:

```text
Admin sidebar
└── SKVN Theme init setup
    ├── [Request A Quote Workflow]
    ├── [Future setup card]
    ├── [Future setup card]
    └── [Nạp setup]
```

Constraints:

- Do not implement in 0.7.0 or 0.10.0.
- Must be discussed carefully before implementation.
- Must not add a dependency/plugin unless human explicitly changes dependency policy.
- Must not custom-code CF7 form handling; setup UI may only create/update approved WP content/config.
- Must require wp-admin capability checks and nonce protection when implemented.

Acceptance draft:

- [ ] Human approves exact setup cards and button behavior
- [ ] Admin capability requirement is defined
- [ ] Setup actions are previewable or clearly described before running
- [ ] Setup actions are idempotent where possible
- [ ] Request A Quote Workflow setup maps to approved CF7/page/docs contract
- [ ] Setup/docs mention trusted `source_url` contract (no `HTTP_HOST`; WP routing only) — aligns with T-2 in 1.4.2
- [ ] No n8n webhook is exposed
- [ ] Human approves milestone completion

### 1.4.2 — Layout Blocks Validation & Quote Evaluation

Status: **PENDING**

Purpose:

- Run the deferred editor/frontend/runtime validation for the `1.1.0` card-grid and card blocks.
- Evaluate whether `skvn-marine/quote` is justified only after card-grid/card validation evidence is available.
- Keep deferred validation explicit instead of treating the untested `1.1.0` implementation as runtime-approved.
- Close **T-2** (trusted `source_url` / quote context URL) from the 2026 security audit: source hardening landed in 1.3.6; onsite verification and quote-chain confirmation belong here with the other quote evaluation work.

Carry-in from security audit — **T-2: Trusted `source_url`**

Context:

- Finding: building `source_url` from `$_SERVER['HTTP_HOST']` allowed host-header poisoning in quote query params.
- Source fix (1.3.6): `skvn_marine_blocks_get_current_source_url()` in `modules/collection-render/cards.php` now uses WordPress routing (`get_permalink()`, `home_url()`, archive/term APIs). See `docs/standards/security-guidelines.md`.
- Remaining work for 1.4.2: prove the value end-to-end in the quote flow (URL → CF7 hidden field → CFDB7), not only in source review.

Testing:

- `docs/testing/card-grid-layout-blocks-1.1.0.md`
- `docs/testing/onsite-quote-flow-0.7.1.md` — include `source_url` host/context checks
- `docs/standards/security-guidelines.md` — T-2 audit reference

Acceptance draft:

- [ ] Human runs the deferred card-grid/card editor and frontend test
- [ ] Desktop, tablet, and mobile screenshots are recorded
- [ ] No invalid-block or recovery warning appears
- [ ] Editor/frontend parity is acceptable for layout decisions
- [ ] Preset combinations do not cause overflow, overlap, or unreadable text
- [ ] Browser console issues are recorded or confirmed clean
- [ ] `skvn-marine/quote` is evaluated after validation evidence is available
- [ ] Any source defects found during validation are fixed and re-tested
- [ ] **T-2:** Product-collection (or product CTA) quote URL `source_url` matches the real onsite page URL (same site host as WordPress config; no forged/external host)
- [ ] **T-2:** CFDB7 test row stores `source_url` and it matches the page the user clicked from
- [ ] **T-2:** Human approves closing T-2 after onsite quote evidence (or documents deferral with target milestone if quote test blocked)
- [ ] Human approves closing the deferred `1.1.0` validation



### 1.3.12 — SKVN Team Credits Easter Egg

Status: **PENDING**

Purpose:

- Close the Slider milestone sequence with a private wp-admin tribute to SKVN
  employees who contributed to the project.
- Keep the tribute discoverable as an Easter egg without adding public
  frontend output or changing normal admin navigation.

Decision:

- `docs/decisions/skvn-team-credits-easter-egg-1.3.9.md`

> Mismatch chưa xử lý (human chưa quyết): milestone này là `1.3.12` nhưng file decision có hậu tố `1.3.9`. Giữ nguyên tên file; xem `docs/decisions/README.md` §5.

Scope:

- Add `Built with care by the SKVN team.` to the plugin header comment.
- Trigger an accessible credits dialog/panel after five clicks on the existing
  top-level `SKVN Marine` wp-admin menu.
- Preserve normal menu navigation and count clicks across reloads with
  `sessionStorage`.

Acceptance draft:

- [ ] Plugin header and admin asset contain the approved credit messages
- [ ] Normal menu clicks continue to navigate normally
- [ ] Five clicks within the governed interval open the credits experience
- [ ] Counter survives navigation in the same admin session and resets safely
- [ ] Credits UI is accessible and dismissible
- [ ] No frontend output, database write, tracking, or network request is added
- [ ] Human approves final tribute copy and any names
- [ ] PHP lint, plugin build, and wp-admin smoke test pass
- [ ] Human approves milestone completion

### 1.3.16 — Comprehensive Testing (1.3.x Feature QA)

Status: **PENDING**

Purpose:

- Consolidated testing phase for all 1.3.x feature milestones after implementation.
- Verify Collection UI (1.3.7), Slider Parallax (1.3.8), Step Slider (1.3.10), and Team Credits (1.3.12) onsite.
- Test button hover compatibility, collection CTAs, editor UX polish.
- Defer all untested acceptance items from earlier milestones to this comprehensive QA pass.

Acceptance draft:

**From 1.3.7 — Collection UI & Button Hover:**
- [ ] `imageRatio` class renders and applies correctly onsite
- [ ] Carousel arrows visible + not clipped by Swiper overflow
- [ ] Spacing (margin-top/bottom, heading gap) works onsite
- [ ] `showHeading`, `eyebrow`, `intro` render and style correctly
- [ ] Archive CTA works and links correct
- [ ] Catalog CTA toggle, URL, label functional onsite
- [ ] Card style variants match design artifact
- [ ] Category badge overlay displays correctly
- [ ] Preset `4-2-1` responsive works mobile/desktop
- [ ] New collection CTAs hovers work onsite per 028 spec
- [ ] Core Button Hover feature + slider preset hovers work onsite
- [ ] Editor preview hover visible in DevTools
- [ ] Slider block regression test pass (`tests/slider-block.test.mjs`)

**From 1.3.8 — Slider Parallax:**
- [ ] Parallax enable/disable works frontend
- [ ] Subtle/medium/strong intensity presets show expected depth
- [ ] No edge-reveal artifacts (image mismatch at viewport edges)
- [ ] Wipe + parallax coordinate without conflicts
- [ ] Fade + parallax coordinate without conflicts
- [ ] Zoom-out + parallax compounded scale intentional
- [ ] Parallax disabled with `prefers-reduced-motion` and `slidesPerView > 1`

**From 1.3.10 — Step Slider (if implemented):**
- [ ] Bottom tab navigation renders and syncs correctly
- [ ] Progress bar updates during autoplay and user interaction
- [ ] Step content loads without invalid-block errors
- [ ] Mobile tab UI readable and touchable

**From 1.3.12 — Team Credits:**
- [ ] Easter egg trigger (5 clicks) opens credits UI
- [ ] Credits UI accessible and dismissible
- [ ] No frontend output or database writes

**General:**
- [ ] Plugin build + PHP lint pass
- [ ] Browser console clean across all surfaces
- [ ] Memory use settles without growth
- [ ] No invalid-block warnings on existing content
- [ ] Human approves milestone completion

### 1.3.17 — Product/Post Carousel Block UI & Visual QA (stack: M1)

Đã archive 2026-10-19 → `.context/MILESTONES_HISTORY.md` (DONE_WITH_CARRY_OVER; A+B+C PASS theo human onsite, sửa regression state owner + gói D skeleton chưa kiểm chứng; 6 mục carry sang 1.3.18).

### 1.3.18 — Product/Post Carousel Editor UX & Technical (stack: M1 follow-up)

Archived checkpoint 2026-11-04 → MILESTONES_HISTORY.md, **DEFERRED_WITH_CARRY_OVER** theo human chuyển ưu tiên. Acceptance/checklist/evidence giữ nguyên; Carousel → 1.3.19; loading/navigation 046 vẫn thuộc 1.3.18, chưa nghiệm thu.

### 1.3.19 — Plugin Design Sidebar Foundation

Archived2026-11-07 → MILESTONES_HISTORY.md §1.3.19, **DEFERRED_WITH_CARRY_OVER** theo human chuyển current1.3.20. Snapshot/checklist/evidence giữ nguyên; đích nhận phần chưa nghiệm thu là current1.3.20 carry register. Không completed/PASS; loading/navigation046 vẫn1.3.18.

### 1.3.20 — Product Category Grid + Category details + Woo Archive M1

Archive shared-card approval2026-11-07: human duyệt060 với ảnh **1:1**; ratio setting để scope kế tiếp chưa gánversion. Source shared presenter/assets/theme adapter đã thêm;060§11–12/runbook.7CSS cascade modelPASS; combined32PHP/hook-template10 chưa chạy; actual AC/AM1/AL/AR/CG/DS chưa PASS. Không chuyển current/bump metadata hoặc thêm ratio setting hiện tại.

Archive card design proposal2026-11-07: human yêu cầu plan reuse Product Carousel card, **chưa duyệt/code delta**. Plan060 `planning/060_VER_1_3_20_ARCHIVE_PRODUCT_CARD_REUSE_PLAN.md`: shared presenter/assets + native archive adapter/fallback, grouped visible specs/tags và +N policy, AC-* acceptance. Chờ duyệt§10; không thay five-row baseline/AM1 hoặc16model evidence trước approval, không chuyển current/bump.

Archive M1 evidence2026-11-07: human `tools/tests/woo-archive-m1.test.php` **16/16 PASS (mocked model only)**. Scope guards/spec extraction/MOQ/category tree/escaping/native placeholder;059§10 + runbook lưu evidence. PHP/build versions và lint output chưa có; Woo/GP/runtime/AL/AM1/AR vẫn Chờ kiểm chứng. Không đổi CG/DS/current1.3.19 hoặc đánh milestone PASS.

Scope addition / source start2026-11-06: human “Thực hiện” và chọn “chung với1.3.20” cho Woo Archive M1 theo059§9. Bổ sung Shop/product category/tag native archive visuals: desktop category sidebar trái, tablet navigation trên, card5specs và quote CTA. Cùng1.3.20 theo ngoại lệ numbering đã có; không đổi Category CG/DS scope, không tự chuyển current1.3.19/bump metadata hoặc suy nghiệm thu. Blog/M2 chưa start. Source thực hiện trong theme, execution059§10; AM1/AL/AR và runbook `docs/testing/archive-repair-1.3.x.md` Chờ kiểm chứng. Current1.3.19 và carry acceptance giữ nguyên như khi Category source được thêm ngoài current.

Execution plan: `.context/planning/049_VER_1_3_20_PRODUCT_CATEGORY_GRID_EXECUTION_PLAN.md` (2026-11-04). Planning/data/render contract độc lập Carousel; Design integration phụ thuộc Sidebar1.3.19. C0–C6 giữ toàn bộ CG-* và DS áp Category. Human duyệt Q1=A eligibility/count gồm descendants theo catalog/stock policy; Q2=A card gọn, 3/2/1 cột theo container có controls, image/name bật và description/count/CTA tùy bật; Q3=B rich text native an toàn, excerpt riêng ở card. Chi tiết defaults/links tại049 §6. Category details Save category/Page Save khác Theme Design Save riêng. Checkpoint trước start; current1.3.20 đã được human bắt đầu2026-11-07.

Carry-in từ đổi thứ tự 2026-11-04: tích hợp nền Sidebar 1.3.19 khi Category có source; kế thừa acceptance vị trí controls/Category details không lẫn Design, keyboard/sidebar hẹp, preview → save/reopen → frontend với inherited token/block override, nội dung dài/thiếu ảnh/responsive. Giữ DS-01–07 áp dụng cho consumer Category và toàn bộ CG-*; không yêu cầu tạo Category trước trong 1.3.19.

Design lock **2026-10-28**: human duyệt `docs/artifacts/editor-ui/category-grid-picker-prototype.html`; phạm vi và source delta theo companion `.md`. Giữ UI baseline, không tự redesign; drag desktop/arrow touch là requirement còn phải hiện thực. Không coi design approval là runtime PASS hoặc lệnh start.

Status: **IN PROGRESS — current, human start2026-11-07; Category source7ef45ff + Archive sourcee7f789f, runtime Chờ kiểm chứng**.
Confirmed: **2026-10-27** — human chọn 1.3.20 cho Category Grid. Update **2026-11-04**: version giữ nguyên, triển khai sau Sidebar 1.3.19; Hero contrast chuyển sang 1.3.21.

Implementation note **2026-11-04 (agent)** — additive, không đổi current 1.3.19, không đóng 1.3.19, không PASS mục nào:

- Source có: `modules/category-grid/` (`category-grid.php`, `resolver.php`, `render.php`, `rest.php`) và `src/product-category-grid/` (block.json, store/API/data, picker, selected list, details, preview, design, save coordinator, `style.css`).
- Contract chốt trong code: Q1=A count/hide-empty trên sản phẩm catalog-visible gồm descendants, một `WP_Query` + một `wp_get_object_terms`, custom URL không vượt rule, all-empty → frontend `''`; Q2=A card một anchor duy nhất (CTA là `<span>`), mặc định ảnh+tên, description/count/path/CTA tắt, số cột 3/2/1 theo container; Q3=B description native sanitize theo `pre_term_description` allowlist, excerpt riêng, chỉ ghi field dirty.
- Save: Save category riêng + explicit Page Save, không flush periodic autosave; response cũ chỉ cập nhật persisted base, không xoá draft mới; conflict kiểm cả description lẫn thumbnail **trước khi ghi**; per-item partial result; permission `edit_term` / `upload_files` server-side.
- Artifact C1: `docs/artifacts/editor-ui/product-category-grid-1.3.20.md`. Runbook onsite: `docs/testing/product-category-grid-1.3.20.md` (URL/version onsite **cần human cung cấp**).
- Phần Design dùng shell Sidebar 1.3.19 (`src/design-sidebar/index.tsx`) theo hướng additive: supported target + tiêu đề/summary + `CategoryDesignControls` + reset keys riêng. File này thuộc owner 1.3.19 và đã đổi trong cùng lượt; khi merge phải giữ cả hai bên, không ghi đè.
- Chưa chạy `npm run build` / `php -l` / deploy artifact audit; chưa có runtime evidence. CG-UI-01–04, CG-UX-01–03, CG-TECH-01–05, DS-01–07 giữ **Chờ kiểm chứng**. Ngưỡng container 480/880px là giá trị C1 tạm, phải đo onsite.
- Transition2026-11-07: human đã chuyển current sang1.3.20;1.3.19 DEFERRED_WITH_CARRY_OVER, không completed. Metadata sync development1.3.20, không release approval.


Scope: chọn Product Category thủ công, grid responsive, archive/custom URL, hide-empty, Category details chỉnh thumbnail + description trực tiếp WooCommerce, thiếu thumbnail dùng Woo placeholder, Save category/Page Save và native notices. Spec/acceptance CG-* và các chi tiết còn mở: `docs/ideations/category-grid-spec.md`.

Version rationale: feature thường tăng MINOR; **1.3.20 là ngoại lệ do human xác nhận**. Thứ tự mới 2026-11-04 là Sidebar 1.3.19 → Category 1.3.20 → Hero contrast 1.3.21. Post Category riêng, chưa gán số. Chưa start/current/bump metadata.

### 1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign (stack: M5, **CURRENT từ 2026-11-12**)

**Concept01 source2026-11-09:** human xác nhận P1 “Đã test, đúng UX”; tiếp tục P2/layout/P3 controls-states trong source theo063§13. Frame lavender/scroll rail/native stage/static Arrow–Add–Pagination footer có source; bỏ P1 URL gate/bootstrap/harness, normal editor sau human build.19selection/Add mocked tests + syntax10files PASS; presentation suite human10/10 PASS (64.42s, SSR/WP mocks). Human flow acceptance không tự PASS full N01–03/3–10Slide/locks/fidelity/perf/HERO. U01–09 + AF01–10 actual evidence pending; không close current1.3.20/bump/build/lint/deploy/commit/push. Các checkpoint chờ gate/source chưa có bên dưới là lịch sử superseded.

**Source start2026-11-09 — human “Tiến hành”:** bắt đầu063 P1 ngoài current1.3.20. Default-off QA harness (`skvn-slider-editor-proof=1`) có source native context/selection/mounted inactive presentation,14 mocked-store tests PASS và syntax5files PASS; N01–03/onsite API+iframe/assets chưa proof. **P2/P3 không rollout trước gate**, chưa final Concept01/PASS. Ledger063§12 + runbook§2.1; không bump/current transition/build/lint/commit/push/deploy. Các entry planning-only/no source/start bên dưới là lịch sử superseded về lệnh source start.

**Detailed execution plan2026-11-09:** [063](planning/063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) + [native editor runbook](../docs/testing/slider-editor-ui-1.3.21.md) chia P0–P5, source/AF mapping và controls/states inventory. P0 pin actual WP/Gutenberg/tagged APIs; P1 chứng minh một mounted native InnerBlocks tree, chọn/edit/IME/Undo/List View trước rollout frame/rail/footer. Visibility/context là kỹ thuật dự kiến chưa proof; không tự bỏ artifact nếu fail. Editor CSS handle riêng, legacy/schema/frontend giữ. Human chỉ yêu cầu planning; chưa coding/start1.3.21 hoặc đổi current1.3.20.

**Reference lock2026-11-09:** human xem Concept01 và nói “Good”, yêu cầu implementation bám artifact. [Plan062](planning/062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md) là contract bắt buộc: đọc canonical HTML/hash, AF01–10→source mapping, paired artifact/actual editor images và deviation register; không tự bỏ/đổi frame, bố cục hoặc nhãn. Reference accepted không là source/runtime PASS hoặc lệnh start; demo review controls/state không thành product implementation. Các câu chưa có mockup/layout dưới đây là checkpoint trước khi có reference, không gate hỏi lại bố cục Concept01; phần Inspector/variations/native feasibility còn phải audit.

Status: **IN PROGRESS (source) — CURRENT từ 2026-11-12. Human2026-11-13: contrast PASS, chớp đã hết, các mục khác pass ở mức UX; đang sửa một số lỗi nhỏ nên chưa đóng mốc.** Còn HERO-TECH-01/02, P0/native N01–03, fidelity/perf và evidence kỹ thuật — chờ carry hoặc kiểm tiếp khi human ra lệnh.

**Clarification2026-11-12:** câu “Đẩy version, đã pass toàn bộ…” của human thuộc **ngữ cảnh1.3.20** (ghi tại MILESTONES_HISTORY §1.3.20), **không** phải nghiệm thu1.3.21. Vì vậy HERO-*/SED-* giữ nguyên trạng thái Chờ kiểm chứng; current vẫn1.3.21; không archive, không chuyển1.3.22, metadata1.3.21. Commit tự chuyển1.3.22 (`563a66e`) đã revert (`cee8ed0`).

**Process waiver2026-11-12:** human xác nhận Editor UI Slider đã được làm khi current vẫn1.3.20 và chưa bump1.3.21. Giữ source đó; không revert vì lệch thứ tự version. Đây không phải runtime PASS, không đóng SED-*/HERO-*, không bump metadata và không chuyển current. Cùng ngày chủ dự án PASS U02, U03, U05. Còn U01, U04, U06, U07, U08, U09. Contrast và hiện tượng chớp vẫn nghiệm thu riêng. **Superseded một phần 2026-11-12:** human đã chuyển current sang1.3.21; waiver chỉ còn nghĩa “không revert source editor đã làm sớm”, không còn chặn bump/chuyển mốc.

**Scope amendment2026-11-12:** human chốt planning **Hero Slide background fill + Apply modal** vào1.3.21 — [068](planning/068_VER_1_3_21_HERO_SLIDE_BACKGROUND_FILL_AND_COPY_PLAN.md); acceptance HSB-*; chưa implement.

**Scope amendment2026-11-09:** human yêu cầu thêm redesign phần Slider Editor UI vào1.3.21. **Contrast: đã có source, runtime Chờ kiểm chứng. Editor redesign: đã có source Concept01 (P1 UX flow được human xác nhận2026-11-09; P2/P3 source theo063§13), runtime Chờ kiểm chứng — supersede câu “PLANNED/Chưa làm, chưa start”.** Version1.3.21 giữ theo quyết định human, đây là mở scope đã duyệt cùng version, không đổi Version Naming Rule. Hình thức hotfix ngoài current áp phần contrast đã có; không dùng source editor để tự chuyển current khỏi1.3.20.

Editor scope: canvas/preview/chrome, tổ chức Inspector/settings của Slider/Slide, nhận diện parent/slide và luồng Add/select/reorder/edit; audit Hero, Product Showcase, Card Carousel và Slider mặc định để xác định UI phù hợp từng variation. Kế thừa P3/EF-SLIDER và phần Slider của EF-06 từ053, cùng khung/spacing/asset contract. Layout cụ thể, palette và việc di chuyển control cần proposal/mockup trước coding; chưa phê duyệt một kiểu preview mới. Bảo toàn native InnerBlocks/List View/RichText, Undo/save/reopen và controls hiện hành; không custom slide store hoặc runtime Swiper/autoplay trên canvas. Step Slider vẫn1.3.24; không gộp sang đây.
Confirmed: **2026-10-19** — Hero contrast được chọn 1.3.19 dạng hotfix ngoài current; **2026-11-04 human dời scope này sang 1.3.21**, giữ source/status/acceptance và hình thức hotfix ngoài current.
Current milestone: **V1 / 1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign** từ human transition2026-11-12. Hình thức “hotfix ngoài current” của Hero chấm dứt từ đây; Hero vào acceptance của mốc hiện hành cùng editor redesign, không tách archive riêng.
SemVer rationale: PATCH — sửa cascade/default của Slider đã có, không thêm feature/schema/dependency. Mapping cũ 1.3.19 được thay bằng **1.3.21** theo human 2026-11-04 để dành 1.3.19 cho Sidebar.

Rationale trên là của repair gốc; amendment2026-11-09 bổ sung editor redesign theo human vào cùng1.3.21, không suy PATCH là quyền thêm schema/feature frontend. Plan044§10 giữ scope/acceptance mới; contrast/flicker và editor nghiệm thu riêng.

> **Bump metadata cho 1.3.21 từ 2026-11-12.** 1.3.21 đã là current nên áp dụng nhánh “milestone được bắt đầu làm current”: sync working metadata bằng `node tools/bump-project-version.mjs 1.3.21` (bump-only) rồi human rebuild plugin assets. Câu “không bump metadata cho 1.3.21” phía trên chỉ còn giá trị lịch sử của giai đoạn hotfix ngoài current.

Scope:
- Sửa contrast mặc định của preset Hero trong `wp-content/plugins/skvn-marine-blocks/src/slider/style.css`: carrier `color` trên `.skvn-slide__content` + `color: inherit` ở specificity đủ thắng rule heading của theme (0,3,0 vs 0,2,1).
- CTA Hero: white-pill + navy `#073b5a`, hover/focus `#eaf7ff`, có guard `:not(.has-background)` để không đụng background/gradient chọn tay; custom hover vẫn theo marker `has-skvn-btn-hover-*`.
- Editor dùng chung selector với frontend (một CSS handle cho hai surface); giữ stacked preview, không chạy Swiper/autoplay.

Ngoài scope:
- Không đổi renderer/schema/save markup/`variations.ts`; không thêm class `has-background` giả.
- Không sửa theme. Không đổi effect/duration/autoplay/loop/parallax/text-shadow.
- Hiện tượng chớp có outcome riêng, chưa xác định root cause; contrast PASS không đồng nghĩa chớp đã sửa.

Planning: `.context/planning/044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md`
Testing: `docs/testing/hero-slider-contrast-and-flicker-repair.md`
Hero slide fill (addon): `.context/planning/068_VER_1_3_21_HERO_SLIDE_BACKGROUND_FILL_AND_COPY_PLAN.md` — `docs/testing/hero-slide-background-fill-1.3.21.md`
Roadmap mapping: 039 §"M5 → 1.3.21".

Acceptance (điểm tương ứng HERO-* trong 044 §7):
- [ ] Source: selector matrix đúng — default thắng theme fallback, explicit color thắng default, Group color tới được heading, custom hover thắng hover fallback, preset Product Showcase/Card Carousel không đổi.
- [ ] Human chạy build + PHP lint, báo output.
- [x] HERO-UI-01 PASS runtime: default text sáng trên gradient, có và không có ảnh. Human PASS2026-11-13.
- [x] HERO-UI-02 PASS runtime: palette/inline/Group/reset đúng, save-reopen không mất dữ liệu. Human PASS2026-11-13.
- [x] HERO-UI-03 PASS runtime: CTA normal/hover/focus, gradient và custom hover được giữ. Human PASS2026-11-13.
- [x] HERO-UX-01 PASS runtime: editor preview khớp frontend, stacked preview không Swiper. Human PASS2026-11-13.
- [ ] HERO-TECH-01/02: diff review, không invalid-block, regression Product Showcase/Card Carousel/core button ngoài Hero sạch.
- [x] HERO-TECH-03: kết luận chớp — human2026-11-13 “đã hết chớp”, không còn tái hiện trên build đang dùng. Contrast PASS và chớp hết là hai kết quả riêng, cùng ghi nhận ngày này.
- [ ] Human approve kết quả visual.

Acceptance bổ sung Editor redesign — **Chưa làm**, không thay HERO-*:

- [ ] SED-ED01 — Audit controls/content/states theo từng variation, proposal/mockup canvas + Sidebar/Inspector; human chốt layout/palette trước coding.
- [ ] SED-ED02 — Parent/slide rõ, tận dụng chiều rộng canvas, responsive editor/sidebar hẹp; giữ các thông tin và controls cần thiết, không có control chết hoặc ẩn mất setting đang dùng.
- [ ] SED-ED03 — Add/select/reorder/delete/duplicate, native List View/InnerBlocks/RichText, keyboard/focus/IME, Undo/Redo/save/reopen và giới hạn slide hiện hành hoạt động.
- [ ] SED-ED04 — Khung ngoài/label/màu và spacing theo053 sau khi duyệt palette; states empty/one/many/limit/missing media/long content đầy đủ, preview static ghi rõ giới hạn.
- [ ] SED-TECH01 — Editor CSS thực sự được enqueue, không style leak; schema/save/data owner giữ, không engine/store song song; no-invalid-block và frontend regression trên các variations.
- [ ] SED-UI01 — Frontend behavior/layout/motion của redesign giữ baseline, contrast source dùng chung không regression; evidence đúng build, tách lỗi cũ/chớp.

Không tự đánh dấu milestone hoàn thành, không runtime PASS và không release approved khi thiếu evidence.

### 1.3.22 — Product Page Basic Design Controls

Status: **PLANNED — implementation Chưa làm, chưa start**. Plan067 đã tạo (2026-11-12) được **giữ nguyên, không phát triển tiếp** theo lệnh human cho tới khi có lệnh transition riêng.
Confirmed: **2026-11-03** — Product trước Post; sau hoán đổi 2026-11-04, nền sidebar là **1.3.19**, thứ tự các consumer Product **1.3.22 → 1.3.23** giữ nguyên.

Version rationale: đây là feature mới, thông thường tăng MINOR; **1.3.22 và 1.3.23 là ngoại lệ đánh số do human xác nhận**, như 1.3.20–21. Không đổi Version Naming Rule, không chuyển current 1.3.18, không bump metadata hoặc archive.

Scope: chỉnh thiết kế cơ bản Single Product khi vẫn là child theme GeneratePress: preset gallery/thông tin và tỷ lệ hai cột, độ rộng, bật/tắt thành phần phù hợp, typography/màu/khoảng cách và style thông số/CTA theo token; thiết kế mặc định chung + override giới hạn từng sản phẩm với Use default/Reset. Nội dung và gallery/attributes lấy dữ liệu native WooCommerce. Tận dụng shell/controls 1.3.19; đây là consumer riêng, không mở rộng ngược scope 1.3.19.

Boundary: theme giữ template PHP/hooks và visual output; plugin giữ editor UI/logic phù hợp, không tạo store/font loader cạnh tranh. Chưa làm full template drag/drop, template condition engine, archive builder hoặc data model woo-catalog 1.5.0. Giữ quote flow hiện có, không viết form handler mới. **2.0 bắt đầu migrate từng bước khỏi GeneratePress**, không phải đã độc lập; không chốt mốc hoàn tất ở đây.

Acceptance draft — tất cả **Chưa làm**, chưa có runtime evidence:
- [ ] PDP-UI-01 — Block UI: preset/style/visibility áp dụng đúng trên desktop/mobile với title dài, có/không ảnh và thiếu/đủ thuộc tính; CTA đọc được, focus/contrast/touch phù hợp; kiểm screenshot, geometry và quote URL giữ product context.
- [ ] PDP-UX-01 — Editor UX: phân biệt default chung với override sản phẩm; Use default/Reset, save/reopen và save failure không gây ghi nhầm phạm vi; keyboard/sidebar hẹp dùng được; evidence video và giá trị đã lưu.
- [ ] PDP-TECH-01 — Technical: native Woo data, quyền/sanitize/escape, fallback khi dependency không khả dụng, không sửa GP parent; không tải runtime không cần thiết; kiểm source/network/console và regression quote/gallery trên build ghi rõ.
- [ ] PDP-TRACE-01 — Trước implementation lập execution plan và đối chiếu từng acceptance liên quan của **1.3.5**: kế thừa phần đã có, chỉ triển khai delta; không xóa acceptance hoặc đánh dấu 1.3.5 completed. Archive scope vẫn ở nơi cũ.
- [ ] Tạo runbook onsite với URL/fixtures/steps/expected/evidence, human duyệt trước completion. SemVer đã chốt; bắt đầu/chuyển current cần lệnh riêng.

Research/rationale: `docs/research/theme-template-editor-fse-transition-research-2026-11-03.md`; roadmap 039, mục cập nhật 2026-11-03. Execution plan có sẵn nhưng **planning-only, chưa code, chưa start**: [067](planning/067_VER_1_3_22_PRODUCT_PAGE_DESIGN_CONTROLS_EXECUTION_PLAN.md) — chỉ thi hành sau lệnh transition riêng của human. Liên hệ stack: consumer template thực tế liên quan M6 và nền visual/editor liên quan M3; không kích hoạt toàn bộ M3/M6 hoặc đổi thứ tự các scope khác.

### 1.3.23 — Post Page Basic Design Controls

Status: **PLANNED — implementation Chưa làm, chưa start**.
Confirmed: **2026-11-03** — sau 1.3.22; cùng ngoại lệ version và boundary ghi ở trên.

Scope: Single Post presets, có/không sidebar, độ rộng nội dung, vị trí ảnh đại diện, bật/tắt metadata/related posts, typography và khoảng cách; default chung + override giới hạn từng bài, Use default/Reset. Dùng native WordPress content/Gutenberg, tái sử dụng nền controls của 1.3.19/1.3.22; theme vẫn render PHP/GeneratePress. Không gộp Post Category Grid (SemVer còn TBD), không tự xây TOC mới hoặc mở template builder đầy đủ.

Acceptance draft — tất cả **Chưa làm**, chưa có runtime evidence:
- [ ] POST-UI-01 — Block UI: preset/style/visibility đúng với bài ngắn/dài, thiếu/có ảnh và metadata, nội dung Gutenberg đa dạng; desktop/mobile không tràn, typography dễ đọc, links/focus/contrast phù hợp; evidence ảnh/geometry.
- [ ] POST-UX-01 — Editor UX: phân biệt default/override, controls có tác dụng, reset/save/reopen đúng; lỗi lưu giữ draft; keyboard/sidebar hẹp dùng được; evidence video/saved state.
- [ ] POST-TECH-01 — Technical: không mất/nhân đôi native content, quyền/sanitize/escape đúng, không sửa GP parent; asset loading phù hợp, regression Product và bài cũ được kiểm; evidence source/network/console/build.
- [ ] POST-TRACE-01 — Map acceptance liên quan **1.3.5** trước implementation; giữ nguyên status/checklist cũ, không coi version mới là bằng chứng hoàn thành công việc cũ.
- [ ] Tạo runbook onsite riêng và human duyệt kết quả trước completion; chưa bắt đầu hoặc bump metadata.

Rationale tách mốc: Product cần QA Woo gallery/specs/Request Quote; Post cần QA nội dung Gutenberg và reading UX. Mỗi surface có evidence nghiệm thu độc lập, giảm phạm vi regression của từng lượt.

### 1.3.24 — Fullscreen Step Slider

Status: **PLANNED — implementation Chưa làm, chưa start**.
Confirmed: **2026-11-07** — human gán 1.3.24 cho Step Slider sau khi đối chiếu các slot 1.3.23–1.3.26. Mapping: **1.3.10 DEFERRED → stack M5 (phần Step Slider) → 1.3.24**; không kích hoạt toàn bộ M5.

Version rationale: đây là feature mới, thông thường tăng MINOR; **1.3.24 là ngoại lệ đánh số cụ thể do human xác nhận**, theo precedent 1.3.22–23. Slot chưa được gán trước quyết định này; không đè scope khác hoặc đổi Version Naming Rule. Đây chỉ là chốt version, không phải lệnh start/chuyển current, bump metadata, build hoặc release. Current giữ **V1 / 1.3.20**.

Scope và dependencies: kế thừa đầy đủ Purpose/Dependencies của 1.3.10 và plan018; block family Step Slider/Step Slide riêng cho process/timeline fullscreen, bottom tabs + per-step progress, shared dynamic Slider foundation/Swiper, native InnerBlocks/List View. Không tạo engine hoặc slide manager thứ hai. Tích hợp nền sidebar/editor frame theo capability riêng khi lập execution plan; palette/mockup và quyết định kiến trúc còn mở phải được chốt trước source implementation.

Acceptance kế thừa — tất cả **Chưa làm**, chưa có runtime evidence; checklist 1.3.10 giữ nguyên để truy vết:

- [ ] Architecture contract được duyệt trước source implementation; ownership `step-slider`/`step-slide` rõ. Namespace khi implement phải theo identity/migration thực tế, không tự rename ngoài 1.4.0.
- [ ] Dynamic PHP render + shared Slider foundation; không engine/runtime thứ hai, `slides` array hoặc custom slide manager.
- [ ] Gutenberg-native InnerBlocks/List View cho chỉnh sửa, thêm/xóa/sắp xếp step; không invalid-block khi save/reopen.
- [ ] Bottom tabs phản ánh đúng thứ tự/active step; progress đồng bộ Swiper autoplay, click và hover/focus pause; reduced-motion fallback đúng.
- [ ] Wipe/text motion dùng governed presets và reduced-motion fallback; mobile tabs đọc được, thao tác được, không tràn.
- [ ] Execution plan ghi riêng Block UI / Editor UX / Technical, Content & States và Acceptance & Evidence; giữ toàn bộ acceptance 1.3.10 và research/open decisions plan018 §14.
- [ ] Build, PHP syntax, deploy artifact audit và onsite QA có evidence trên build xác định; tạo runbook `docs/testing/` trước onsite, human duyệt trước completion.

Nguồn: `planning/018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md`, `docs/decisions/sliders/step-slider/fullscreen-step-slider-1.3.10.md`, roadmap039. Giữ filename cũ để bảo toàn liên kết. Hero contrast 1.3.21, Blog Archive, Archive M2 và ratio controls không được gộp vào 1.3.24 bởi quyết định này.

### 1.4.3 — Interactive Illustrated Map

Status: **PLANNED — Chưa làm, chưa start**.
Confirmed: **2026-11-04** — human chốt 1.4.3 sau 1.4.2 và trước 1.5.0; current vẫn V1 / 1.3.18.

Version rationale: đây là feature mới, thông thường tăng MINOR; **1.4.3 là ngoại lệ đánh số cụ thể do human xác nhận**, không đổi Version Naming Rule. Không đổi scope 1.4.0 Migration, 1.4.1 Setup UI, 1.4.2 Layout/Quote Validation, 1.5.0 Woo Catalog, 1.5.3 TOC hoặc 1.6.0 Surface Presets. Xác nhận version/commit tài liệu không phải lệnh start, bump metadata hoặc release.

Scope: block bản đồ minh họa SVG tham chiếu mapId; marker mở thẻ thông tin, tọa độ % neo tâm icon, responsive/zoom có kiểm chứng; sửa nội dung ngay trong thẻ; cấu hình dữ liệu và Save map tại sidebar riêng của plugin. Hai bảng maps/map_points (tiền tố site; tên vật lý hoàn thiện khi execution plan), nội dung chi tiết nằm trong điểm. Không CPT, không markdown parser, không bảng popup riêng, không đưa dữ liệu vào Woo Catalog. Plugin owns data/editor/runtime; tương thích identity Marine Blocks sau 1.4.0. Không yêu cầu chuyển theme sang FSE.

Nguồn thiết kế và truy vết: `docs/ideations/svg-maps/README.md` (quyết định mới ưu tiên hơn source artifact cũ), `docs/ideations/svg-maps/bao-cao-tong-hop-ban-do-tuong-tac.md`. Sidebar là consumer của nền editor chung, tích hợp riêng trong 1.4.3; không mở rộng acceptance consumer của milestone nền. Stack M1–M6: chưa gán; chỉ ghi candidate consumer, không tự kích hoạt M3/M6. Đây là bản đồ minh họa mới, không tự đóng debt OpenStreetMap/contact map cũ ở 1.1.2.

Acceptance — tất cả **Chưa làm**, chưa có runtime evidence:

- [ ] MAP-UI-01 — Giao diện: nền/marker/nhãn/thẻ hiển thị đúng desktop/tablet/mobile; đổi nhãn không lệch tâm icon; các trạng thái thiếu/có nội dung, ảnh và nội dung dài không tràn; kiểm screenshot/geometry và source UI-01–09.
- [ ] MAP-UI-02 — Giao diện: mọi điểm truy cập được khi zoom hoặc dùng danh sách; click/touch/Enter/Space mở đúng thẻ, đóng và trả focus đúng nguồn; reduced motion, focus/contrast kiểm trên môi trường ghi rõ. Chốt cách xử lý zoom/mobile còn mở trong execution plan.
- [ ] MAP-UI-03 — Giao diện: nền thiếu/gãy hiện lỗi rõ; không tự thay nền hoặc dời điểm. Kiểm nguồn ảnh bị chặn/xóa, so tọa độ trước/sau chọn lại nền; giữ UI-10.
- [ ] MAP-ED-01 — Editor UI: cấu hình dữ liệu ở sidebar plugin, gắn rõ map đang sửa và phạm vi dùng chung; block không lặp form cấu hình, nội dung điểm sửa trong thẻ; keyboard/sidebar hẹp dùng được. Kiểm selection, đúng map và preview; ED-12.
- [ ] MAP-ED-02 — Editor UI: Apply changes chỉ đưa nháp thẻ vào nháp map; Cancel bỏ phần chưa áp dụng; Save map mới lưu bền toàn bộ. Dirty/saving/saved/error rõ; lỗi giữ nháp để thử lại, lưu page không thay Save map. Kiểm Apply/Cancel/Save/reopen và lỗi lưu; ED-11, ED-01–10 giữ truy vết.
- [ ] MAP-ED-03 — Editor UI: tỷ lệ cố định theo từng map sau khi tạo, khởi đầu 4:3; hiện tỷ lệ yêu cầu/thực tế, kích thước nguồn, mức phù hợp và preview toàn bộ không crop; thay nền giữ tọa độ, nhắc kiểm lại vị trí dù cùng tỷ lệ; nền gãy có chọn lại ảnh. Kiểm fixture sai tỷ lệ/cùng tỷ lệ khác tranh; ED-13.
- [ ] MAP-BE-01 — Backend kỹ thuật: hai bảng maps/map_points, detail_title/detail_body_html/detail_image_media_id trong điểm; map dùng chung qua mapId, điểm thuộc map. CRUD/schema upgrade/xóa giữ nhất quán, mapping JSON/media đúng, import lỗi không phá dữ liệu; kiểm fresh install/upgrade/export-import/invalid input; BE-01–05/10.
- [ ] MAP-BE-02 — Backend kỹ thuật: map published giữ bản cũ tới khi Save map thành công toàn bộ; không lộ dữ liệu cập nhật dở. Lưu lỗi giữ published cũ và nháp; retry thành công mới cập nhật các page dùng chung/cache. Kiểm gây lỗi giữa lượt lưu và đọc hai page; BE-06/11. Cơ chế nguyên khối cụ thể cần execution plan.
- [ ] MAP-BE-03 — Backend kỹ thuật: quyền/validation/sanitize/escape, media/SVG contract, instance IDs không trùng, assets có điều kiện và cleanup, map thiếu/draft/lỗi query có trạng thái rõ; kiểm hai map/cùng map hai lần, quyền thiếu, JS lỗi; BE-06–09. Không coi sanitizer artifact là production boundary.
- [ ] MAP-TRACE-01 — Execution plan phải giữ toàn bộ UI-*, ED-*, BE-*, DOC-* trong index; chốt hoặc defer rõ các điểm mở: snapshot revision, chỉnh đồng thời, thẻ rỗng/xóa sạch nội dung, zoom/mobile, grab offset, undo/reorder, thêm List/Buttons. Không tự thêm scope hoặc bỏ acceptance.
- [ ] Tạo runbook `docs/testing/` trước runtime/onsite: URL, setup/fixtures, steps, expected/pass-fail và evidence; human nghiệm thu trước completion. Version đã chốt; start cần lệnh riêng.

### 1.3.x — WooCommerce + Blog Archive Repair (Future Candidate, SemVer TBD)

Status: **PLANNED — discussion, chưa start**. Human2026-11-06 yêu cầu sửa hai archive trong1.3.x, tạo file để thảo luận trước; chưa chọn predecessor/version cụ thể. **Đề xuất** sau1.3.23 Post Page Basic Design Controls; không tự gán1.3.24, đổi current hoặc bump metadata. Trước implementation xác nhận scope/PATCH rationale, version chưa dùng và start theo AGENTS. Nếu phát sinh feature/controls mới cần đánh giá lại SemVer, không tự coi nhãn1.3.x là ngoại lệ numbering.

Update2026-11-06 (supersedes Woo scheduling above): human đã cho thực hiện Woo Archive M1 **chung1.3.20**. Woo M1 không còn đợi sau1.3.23; source start/acceptance theo entry1.3.20 và059§10. **Blog archive** vẫn PLANNED/SemVer TBD, chưa start; **Archive M2** chưa start. Không chuyển current1.3.19 hoặc coi source là PASS.

Plan `planning/059_FUTURE_CANDIDATE_WOOCOMMERCE_BLOG_ARCHIVE_REPAIR.md`: inventory Shop/product taxonomy + posts index/category/tag; template/route/main-query map, design trước sửa, responsive/cards/sidebar/pagination/empty states. Theme owns visuals; WP/Woo native query/routing giữ owner; không thay bằng plugin Collection query hoặc mở archive builder/facets2.x. Giữ plan025/1.3.5 acceptance và1.3.22–23 regression. AR-* **Chưa làm**; URL/pain points/design/SemVer/start còn mở; không runtime code trong lượt planning.

### 1.4.x — Block Inserter SVG & Organization (Future Candidate, SemVer TBD)

Status: **PLANNED — chưa start**.

Human decision **2026-11-05**: Inserter hiện rối, icon thiếu phân biệt và grouping chưa phù hợp nên chính người dựng plugin cũng hay bấm nhầm. Ghi scope sửa **sau các mục1.4.x đã có**, hiện là sau1.4.3 Interactive Illustrated Map. Thứ tự: 1.4.0 Migration → 1.4.1 Setup UI → 1.4.2 Layout/Quote Validation → 1.4.3 Map → Inserter SVG & Organization. Chưa tự gán1.4.4 hoặc chuyển current1.3.19; số SemVer/start cần xác nhận trước implementation theo Version Naming Rule.

Scope: inventory base blocks/variations/inner blocks; SVG phù hợp công dụng, family nhất quán; grouping theo nhiệm vụ, tên/search rõ; audit entry trùng hoặc không nên chèn độc lập. Giữ saved-content compatibility, namespaces/attrs/defaults khi thay presentation; không patch core/private DOM. Không đồng nhất với Design Sidebar visual controls054 hoặc preview frame053/055; các acceptance đó giữ riêng.

Plan/source evidence/acceptance draft **IO-UX-01–03, IO-TECH-01–02**: `planning/056_FUTURE_CANDIDATE_BLOCK_INSERTER_ORGANIZATION.md`. Tất cả **Chưa làm**; human đã chốt lịch/scope, chưa duyệt SVG/grouping cụ thể hoặc runtime PASS. Mockup toàn Inserter và onsite thử tìm/chọn block trước nghiệm thu; runbook tạo khi mở task. Không bump/build trong lượt note này.

### 1.5.0 — Woo Catalog Plugin (`woo-catalog`)

Status: **BRAINSTORM / PLANNING IN PROGRESS**

> ⚠️ Planning chưa hoàn tất. Cần session brainstorm riêng về data model trước khi bắt đầu.
> Milestone này phụ thuộc vào 1.3.7 (Collection UI) đã pass onsite QA.
> Step Slider foundation from 1.3.10 available for inheritance if needed.

Planning:

- `.context/planning/027_VERSION_1_5_0_WOO_CATALOG_PLUGIN_PLANNING.md`

Purpose:

- Tạo plugin riêng `woo-catalog` để sở hữu toàn bộ product data model và visual style cho B2B catalog.
- Tách data registration ra khỏi `skvn-marine-blocks` — blocks plugin sẽ optional-read từ catalog plugin.
- Enable các feature card đòi hỏi structured product data mà 1.3.7 không thể implement.
- Cung cấp catalog type selector (seafood, courses, custom) — mỗi type là 1 profile riêng.

Decisions đã chốt (2026-06-18):

- **Plugin slug**: `woo-catalog` (generic, reusable ngoài skvn-marine)
- **PHP prefix**: `woo_catalog_` (không dùng `skvn_marine_` vì plugin này là domain-agnostic)
- **Catalog type selector**: Settings page → chọn type (seafood / courses / custom-deferred) → activate profile tương ứng
- **CSS ownership split**:
  - `skvn-marine-blocks` sở hữu: card layout CSS (flexbox structure, aspect-ratio, spacing, hover shape)
  - `woo-catalog` sở hữu: semantic color CSS (cert badge colors, tag background, origin badge) — delivered as CSS custom properties
- **Style controls architecture**:
  - Global brand settings → plugin settings page → lưu vào `wp_options` → inject CSS variables vào `:root`
  - Per-block override → catalog plugin inject `InspectorControls` panel vào `skvn-marine/collection` qua WordPress `addFilter` (block plugin không biết về catalog controls)

Lý do tách plugin riêng (đã quyết định 2026-06-17):

- MOQ, Lead Time, certifications dùng nhiều hơn 1 chỗ: single product page, collection block, REST API, PDF export tương lai.
- `skvn-marine-blocks` là rendering layer — không nên sở hữu business data model.
- Deactivation independence: tắt blocks → data còn; tắt catalog → blocks gracefully degrade.
- Tránh technical debt khi single product page (1.5.x+) cũng cần hiển thị các field này.
- Plugin generic (`woo-catalog`) → có thể reuse cho site khác hoặc swap catalog type mà không sửa blocks.

Yêu cầu kỹ thuật cần note kỹ (brainstorm tiếp):

- **Certification display**: colored bullet hay icon? Badge color map per term slug? Ai owns màu — taxonomy term meta hay CSS hardcode?
- **Prefetch**: khi user hover product card, có prefetch single product page không? Cần đánh giá performance impact trước khi quyết định.
- **REST API exposure**: `show_in_rest: true` cho tất cả meta? Cần auth hay public? Ảnh hưởng đến headless future?
- **Data migration**: nếu ai đã nhập product data dạng free-text trước milestone này, migration plan như thế nào?
- **ACF dependency**: dùng ACF Free để define fields hay `register_meta` thủ công? Ảnh hưởng đến portability.
- **Spec sheet PDF**: upload attachment WordPress hay external URL? Khi attachment bị xóa thì sao?
- **MOQ unit**: "5 MT" là 1 text field hay tách `_woo_catalog_moq_value` (number) + `_woo_catalog_moq_unit` (MT/KG/container)? Ảnh hưởng đến sorting/filtering sau này.
- **Per-block attribute registration**: catalog plugin dùng hook nào để register extra attributes cho `skvn-marine/collection` mà không sửa block.json?

`skvn-marine-blocks` side (sau khi catalog plugin có):

- Optional-read pattern: `if (function_exists('woo_catalog_get_fields'))` — không fatal khi catalog inactive
- Đọc certifications, MOQ, Lead Time, spec sheet từ `woo_catalog_get_fields($product_id)` 
- Render conditionally — empty fields không render, không vỡ layout

Dependency chain:

- 1.3.7 (Collection UI) → onsite QA pass → 1.5.0 catalog data model → collection block full card style

Acceptance draft (sơ bộ, cần hoàn thiện):

- [ ] Architecture contract và data model schema được approve trước implementation
- [ ] `woo-catalog` plugin tồn tại độc lập, active/deactivate không ảnh hưởng blocks
- [ ] Catalog type selector hoạt động trong plugin settings page
- [ ] `product_certification` taxonomy registered và có WP admin UI
- [ ] MOQ, Lead Time, Spec Sheet PDF meta registered với WooCommerce product panel
- [ ] Global style settings (badge shape, colors) inject CSS variables đúng vào frontend + editor
- [ ] Catalog plugin inject per-block InspectorControls qua `addFilter` — không sửa block plugin
- [ ] `skvn-marine-blocks` optional-reads catalog fields — graceful degrade khi catalog inactive
- [ ] Collection product card hiển thị đủ certifications, MOQ, Lead Time, spec sheet link
- [ ] Human approves data model schema và field formats trước khi code
- [ ] Human approves milestone completion

---

### Post 1.5.x — Marine Blocks Product Launch

**Update 2026-11-04:** identity đích Marine Blocks (`marine-blocks`, namespace `marine-blocks/*`), migration chuyển sang target 1.4.0 theo plan 047. Public version cần xác nhận lại, không tự reset 0.0.1. Gate launch/QA bên dưới giữ nguyên; các tên GU Supercharger và nghiên cứu tên cũ dưới đây chỉ là baseline lịch sử, không phải identity đã khóa hiện hành. Khi thực hiện checklist dùng tên Marine Blocks; availability tên mới chưa xác minh. Không yêu cầu human duyệt lại identity đã chốt.

Status: **PENDING**

Human decision (2026-06-23): Launch product plugin **sau khi V1 / 1.5.x ổn định** (woo-catalog + blocks integration + confidence trên nhiều site production). Không launch tại 1.3.11.

Decision + name research: `docs/decisions/gu-supercharger-launch-post-1.5x.md`

Identity (locked):

```text
Display name:    Gutenberg Supercharger (marketing / admin)
Plugin slug:     gu-supercharger
Text domain:     gu-supercharger
Block namespace: gu-supercharger/*
Product version: 0.0.1
```

Name research summary (2026-06-23):

- wp.org slug `gu-supercharger` — **available** (0 plugins)
- wp.org slug `supercharger` — **taken** (Supercharger AI — khác product; tránh slug trùng)
- Block namespace `gu-supercharger` — no public conflict found; migration từ `skvn-marine/*` bắt buộc

Dependencies:

- V1 / 1.5.x milestones DONE (woo-catalog + `skvn-marine-blocks` optional-read + onsite)
- 1.3.11 comprehensive QA DONE (hoặc defects từ QA đã fix trước launch)
- Multi-site migration tool + pilot evidence

Acceptance draft:

- [ ] Human approves launch identity: **GU Supercharger** / **Gutenberg Supercharger** `0.0.1`
- [ ] wp.org slug `gu-supercharger` reserved or submitted (nếu distribute qua directory)
- [ ] Plugin folder/zip `gu-supercharger`; block namespace `gu-supercharger/*` registered
- [ ] Migration tool converts saved `skvn-marine/*` blocks → `gu-supercharger/*` (pilot site PASS)
- [ ] Option keys: map hoặc shim documented; không mất footer/core-control settings sau migrate
- [ ] Release metadata `0.0.1` + deploy artifact audit pass
- [ ] Runbook: deactivate `skvn-marine-blocks` → migrate → activate `gu-supercharger` (per site)
- [ ] Onsite smoke trên ≥1 pilot site: Slider + Collection + Core Control — no fatal, no invalid-block
- [ ] Human approves public launch **GU Supercharger 0.0.1**

---

### 1.6.0 — SKVN Surface Presets

Status: **PENDING**

Purpose:

- Add SKVN-local approved surface presets such as flat, soft, glass, elevated, and outlined.
- Keep production visual output independent from WindPress/Tailwind utilities.
- Let the theme own `skvn-surface--*` classes, tokens, fallbacks, and contrast/readability rules.
- Let plugin/editor controls select safe presets later without raw CSS, raw class, arbitrary color, blur, or shadow input.
- Design governed typography presets and a font delivery mode switch: Google CDN or local self-hosted, without raw CSS or arbitrary font URLs.

Planning:

- `.context/planning/009_VERSION_1_6_0_SKVN_SURFACE_PRESETS_PLANNING.md`

Acceptance draft:

- [ ] Surface preset contract is documented before code
- [ ] Typography preset and delivery-mode contract is documented before code
- [ ] Admin can choose approved body, heading, and UI font presets without raw CSS or raw URLs
- [ ] Admin can choose Google CDN or local self-hosted delivery mode
- [ ] Frontend enqueues only the selected font delivery mode by default
- [ ] Local self-hosted mode documents cache path, failure fallback, and license/source constraints
- [ ] Theme CSS defines approved `skvn-surface--*` classes
- [ ] Presets use SKVN tokens and do not depend on WindPress
- [ ] Glass has a non-blur fallback
- [ ] Editor/frontend parity is checked for the first supported surface
- [ ] At least one SKVN-owned block or layout surface can select a preset through safe controls
- [ ] No raw class, raw CSS, or arbitrary color/blur/shadow input is required
- [ ] Human approves milestone completion

### 1.7.0 — Front page trang Chuyển đổi số

Status: **PENDING**

Purpose:

- Plan and implement the front page inspired by `.local/test-artifacts/ChuyenDoiSo.html`.
- Provide a document/resource front page with post list items that can show a thumbnail or fallback icon.
- Display tags from the external plugin-owned taxonomy without recreating or renaming that taxonomy.
- Display category lists and document/guide counts from real data, not hardcoded numbers.
- Support whole-site search styling and integration boundary; search logic remains WordPress/search-plugin owned, while SKVN owns safe visual classes and optional wrapper/block rendering.

Planning:

- `.context/planning/010_VERSION_1_7_0_FRONT_PAGE_TRANG_CHUYEN_DOI_SO_PLANNING.md`

Acceptance draft:

- [ ] Human confirms the external plugin taxonomy names and search integration boundary
- [ ] Front-page IA is documented before code: hero/search, resource list, category/count sidebar, access CTA, KPI strip, footer
- [ ] Source data ownership is documented: external plugin taxonomy/search owns data, SKVN consumes and styles
- [ ] Theme-owned visual classes are defined before plugin output depends on them
- [ ] Post/resource list supports thumbnail or fallback icon
- [ ] Tag/status badges are governed by presets/classes, not raw arbitrary classes
- [ ] Category/document counts come from real WordPress data
- [ ] Whole-site search form works with WordPress/search-plugin logic or documented hook fallback
- [ ] Core Query Loop/pattern alternative is evaluated before creating a custom block
- [ ] If a custom block is needed, it belongs in `skvn-marine-blocks` and degrades safely when the external taxonomy/search plugin is inactive
- [ ] No raw Tailwind, inline CSS, or inline scripts from the benchmark artifact are used as production content
- [ ] Human approves milestone completion
