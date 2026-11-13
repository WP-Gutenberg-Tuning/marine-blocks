# MILESTONES_HISTORY.md — SKVN Marine

> Archive for completed milestones from previous versions/phases.
> Không load file này mặc định khi bắt đầu task, trừ khi cần audit milestone cũ.
> Chỉ move milestone vào đây khi human approve chuyển milestone/version.

---

## V1 / 1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign — DONE

Status: **DONE_WITH_CARRY_OVER** (human PASS2026-11-13)
Started: **2026-11-12**
Transitioned: **2026-11-13** — human “Đã xong toàn phần 1.3.21” rồi lệnh “Chuyển sang 1.3.22 ngay”. Milestone development build, không release/deploy; metadata working bump sang1.3.22.

Human PASS2026-11-13: acceptance1.3.21 nghiệm thu **toàn phần** — Hero contrast (HERO-UI-01–03, HERO-UX-01), HERO-TECH-03 chớp “đã hết”, Slider Editor UI Redesign, cùng addon fill/focal/parallax/text motion. Plan071 overlay color: human “đã test rồi, xong rồi pass”; **repo không có source `overlayColor`** tại thời điểm đóng — ghi để audit, không coi là code đã hoàn thành. Evidence kỹ thuật chưa thu thập (HERO-TECH-01/02, P0 pin WP/Gutenberg/tagged API, native N01–03/iframe/assets, 3–10Slide/limits, AF01–10 paired fidelity, geometry/perf, build/lint output) là carry sang1.3.22, không mở lại trạng thái và không hạ PASS của human.

Snapshot bên dưới giữ nguyên nội dung/status tại thời điểm đóng; các dòng CURRENT/IN PROGRESS/“chưa archive” bên trong là lịch sử.
### 1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign (stack: M5) — archived snapshot

**Concept01 source2026-11-09:** human xác nhận P1 “Đã test, đúng UX”; tiếp tục P2/layout/P3 controls-states trong source theo063§13. Frame lavender/scroll rail/native stage/static Arrow–Add–Pagination footer có source; bỏ P1 URL gate/bootstrap/harness, normal editor sau human build.19selection/Add mocked tests + syntax10files PASS; presentation suite human10/10 PASS (64.42s, SSR/WP mocks). Human flow acceptance không tự PASS full N01–03/3–10Slide/locks/fidelity/perf/HERO. U01–09 + AF01–10 actual evidence pending; không close current1.3.20/bump/build/lint/deploy/commit/push. Các checkpoint chờ gate/source chưa có bên dưới là lịch sử superseded.

**Source start2026-11-09 — human “Tiến hành”:** bắt đầu063 P1 ngoài current1.3.20. Default-off QA harness (`skvn-slider-editor-proof=1`) có source native context/selection/mounted inactive presentation,14 mocked-store tests PASS và syntax5files PASS; N01–03/onsite API+iframe/assets chưa proof. **P2/P3 không rollout trước gate**, chưa final Concept01/PASS. Ledger063§12 + runbook§2.1; không bump/current transition/build/lint/commit/push/deploy. Các entry planning-only/no source/start bên dưới là lịch sử superseded về lệnh source start.

**Detailed execution plan2026-11-09:** [063](planning/063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) + [native editor runbook](../docs/testing/slider-editor-ui-1.3.21.md) chia P0–P5, source/AF mapping và controls/states inventory. P0 pin actual WP/Gutenberg/tagged APIs; P1 chứng minh một mounted native InnerBlocks tree, chọn/edit/IME/Undo/List View trước rollout frame/rail/footer. Visibility/context là kỹ thuật dự kiến chưa proof; không tự bỏ artifact nếu fail. Editor CSS handle riêng, legacy/schema/frontend giữ. Human chỉ yêu cầu planning; chưa coding/start1.3.21 hoặc đổi current1.3.20.

**Reference lock2026-11-09:** human xem Concept01 và nói “Good”, yêu cầu implementation bám artifact. [Plan062](planning/062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md) là contract bắt buộc: đọc canonical HTML/hash, AF01–10→source mapping, paired artifact/actual editor images và deviation register; không tự bỏ/đổi frame, bố cục hoặc nhãn. Reference accepted không là source/runtime PASS hoặc lệnh start; demo review controls/state không thành product implementation. Các câu chưa có mockup/layout dưới đây là checkpoint trước khi có reference, không gate hỏi lại bố cục Concept01; phần Inspector/variations/native feasibility còn phải audit.

Status: **DONE theo human (2026-11-13)** — “Đã xong toàn phần 1.3.21”. Acceptance1.3.21 được human nghiệm thu toàn phần; **chưa archive, chưa bump metadata, current vẫn1.3.21 cho tới khi human ra lệnh transition riêng**. Carry khi chuyển mốc: HERO-TECH-01/02, P0/native N01–03, paired fidelity/geometry/perf và build/lint evidence. Plan071 (màu overlay) **chưa có source** — cần human chốt defer/carry, không tự coi là đã làm.

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


## V1 / 1.3.20 — Product Category Grid + Category details + Woo Archive M1

Status: **DONE_WITH_CARRY_OVER** (human PASS2026-11-12)
Started: **2026-11-07**
Transitioned: **2026-11-12** — human yêu cầu “commit để tiến hành push milestone sang1.3.21”. Lúc chuyển mốc ghi `DEFERRED_WITH_CARRY_OVER`; cùng ngày human xác nhận đã pass toàn bộ nên trạng thái hiện hành là `DONE_WITH_CARRY_OVER`. Không git remote push/deploy.

Human PASS2026-11-12: “Đẩy version, đã pass toàn bộ, những lỗi nếu có sẽ sửa trong milestone khác, các thứ cần làm đã đủ và thực hiện đúng với thiết kế” — human xác nhận trong session rằng câu này nói về **1.3.20**. Ghi nhận: acceptance1.3.20 (Category CG-*/CGD-* và DS-01–07 áp Category; Woo Archive AM1/AL/AR/AC) **PASS theo human**, lỗi phát sinh sau đó sửa ở milestone khác. 1.3.20 không quay lại current. Evidence kỹ thuật chưa thu thập (combined37PHP/hook-template10, build/lint, onsite geometry) là carry, không mở lại trạng thái và không hạ PASS của human. Snapshot verbatim bên dưới giữ nguyên trạng thái tại thời điểm chuyển mốc; dòng PASS này là trạng thái nghiệm thu hiện hành của1.3.20.

Đích nhận acceptance chưa hoàn tất: carry register current1.3.21 trong MILESTONES.md. Giữ nguyên CG-*/CGD-*/DS-*, AM1/AL/AR/AC-*, DS/TD, S19/SR2, CP/EF, RS/CCP và Carousel carry; E02/PASS/model evidence cũ không thay. Blog archive, Archive M2, ratio control060§12 và Visual Sidebar054 vẫn deferred. Snapshot bên dưới giữ nguyên checklist/nội dung/status tại thời điểm chuyển để audit; trạng thái hiện hành của entry này là `DONE_WITH_CARRY_OVER` (human PASS2026-11-12) và ưu tiên hơn các dòng Current/IN PROGRESS bên trong.

#### Current Milestone — snapshot verbatim 2026-11-12

Current: **V1 / 1.3.20 — Product Category Grid + Category details + Woo Archive M1**
Status: **IN PROGRESS — human start/transition, source có sẵn, runtime Chờ kiểm chứng**
Started: **2026-11-07**
Human instruction: “cho agent push milestone lên1.3.20”. SemVer1.3.20 đã được chọn cho Category và bổ sung Woo M1; tiếp tục ngoại lệ numbering đã duyệt, không gán version khác. Đây là milestone advancement, không git remote push/deploy/release approval.

**1.3.19 → DEFERRED_WITH_CARRY_OVER**, snapshot current register + scope/checklist giữ nguyên tại MILESTONES_HISTORY.md §1.3.19. Không đánh completed/PASS vì chuyển mốc. Các checkpoint dated trước2026-11-07 còn ghi current1.3.19/1.3.18 là lịch sử; entry current này và AGENTS.md là source of truth mới. Metadata được sync development1.3.20 bằng bump-only, build/lint/onsite do human; không phát hành tự động.

#### Scope và acceptance current1.3.20

Category extension2026-11-09: human duyệt hướng và giao **planning chi tiết**, chưa coding delta. [Plan061](planning/061_VER_1_3_20_CATEGORY_GRID_DESCRIPTION_ACTION_CONTROLS_PLAN.md) bổ sung Full plain-text description/Excerpt, căn description, Action width Auto/Full/Custom%, alignment, Pill/custom px, Follow content/Bottom và khoảng cách exact/minimum. Defaults cũ/term persistence giữ; px inputs là ngoại lệ hẹp Category Action, không toàn plugin. CGD-UI01–04, CGD-ED01–03, CGD-TECH01–04 **Chưa làm**; [runbook](../docs/testing/category-grid-description-actions-1.3.20.md). Giữ current1.3.20, không bump/chuyển mốc hoặc start toàn bộ visual Sidebar054; CG/DS/carry cũ không mất acceptance.

Archive hotfix059§12–13: human start2026-11-07, chung current1.3.20; grid alignment HF-AX và mobile category disclosure MN-* có source,5JS state/focus modelPASS; PHP lint/onsite geometry/native Woo Chờ kiểm chứng. Giữ HF-HDR FAIL lịch sử/AP-11; không đổi product ratio/query/plugin hoặc bump/deploy.

Island width recipe2026-11-11: human report grid 4→2 cột khi bọc trong Group container. Điều tra kết luận **không code delta** — pipeline width đã có (Collection `contentWidth` control + align class mapper; Category Grid/Slider `supports.align`); nguyên nhân là recipe 2 bước (Group align Wide/Full + block Content width/align) không được biết, container query 760/880px lật layout im lặng. Theme CSS propagation bị loại vì nhân bản layout engine Gutenberg (vi phạm contract một owner). Giao [recipe + T-ISLAND-01–03](../docs/testing/group-island-width-1.3.20.md), human verify onsite; PITFALLS DP-07 ghi nhận. Island pattern/style variation **deferred 1.4.x** theo human — bake 2 bước, ăn palette slug; không tự start, chưa gán SemVer.

Island full-bleed2026-11-12: human làm rõ yêu cầu thật — island phải **giới hạn max-width nội dung nhưng background tràn 2 viền**; align Wide giữ nền trong box 1200px nên không đạt. Kết luận: **Full cho container (nền tràn) + measure cho content bên trong** (constrained 760 hoặc Wide 1200), không cần CSS mới; `alignfull` chỉ tới biên màn hình khi trang bật Full Width Canvas. Ghi nhận gap thiết kế: `.skvn-section` island hiện override từng class con lên 1200px (`style.css:130-157`) nên block khác rơi về 760 → container query tablet; island primitive 1.4.x thay bằng một measure do band sở hữu. Recipe §3 + T-ISLAND-04 (nền tràn) đã cập nhật; design contract Container Nesting và module theme đồng bộ; vẫn không code delta.

Island Elementor rebuttal2026-11-12: human yêu cầu lấy **chuẩn UX Elementor** làm tham chiếu cho hiện tượng "nền chỉ bao đúng width". Đối chiếu tài liệu Elementor (Define container layout/Section Overview): Boxed mặc định giữ box ngoài = available width → nền tràn, measure do Width control; `Full Width` + Width 1200 thì nền dừng ở 1200 — **Elementor cũng không cho nền vượt box**. Vậy ảnh 760/1200 là "Full Width + Width", không phải Boxed; recipe 2 bước chính là Boxed. Khác biệt còn lại: default và số bước (Gutenberg thiếu một control); thêm mismatch measure 760 đọc chữ vs ~1140–1200 layout. Phản biện ghi tại [recipe §4](../docs/testing/group-island-width-1.3.20.md), contract Container Nesting và module theme cập nhật. Decision gate mở §7.1: giữ recipe (A) hay thêm island pattern zero-CSS vào1.3.20 (B); không chọn CSS override. Chưa start, không bump.

Island research handoff2026-11-12: human chuyển phản biện cho agent có khả năng đọc ảnh; prompt tại [handoff](../docs/workflows/prompts/group-island-elementor-rebuttal-agent-handoff.md). Số đo ảnh trong §1 dựa trên giả định scale 1:1 (ảnh1903x927) **chưa chứng minh** — agent research phải xác minh DPR/zoom và tính lại CSS px trước khi dùng 760/1200 làm premise, rồi chốt A/B. Research/docs only, không code/commit/bump.

Island WindPress stopgap2026-11-12: human chốt WindPress là chữa cháy có hạn đến khi có island group. Luật: grid trong Group là một box, con theo cha, cha phủ hết con. Chỉ Group island tạm, một class riêng chưa đặt tên; core Group khác giữ FSE; cấm overflow cắt card; không đưa vào plugin/theme CSS. Gỡ khi island group thành chủ width. §7.1 A/B chưa chọn. 80px chưa có chủ. Decision [group-island-windpress-stopgap-1.3.20](../docs/decisions/group-island-windpress-stopgap-1.3.20.md). Chưa viết utility, chưa start island, không bump.

Island WindPress class prototype2026-11-12: pixel scan lại ảnh (RLE, System.Drawing) cho số card: ảnh (1) grid 572..1411 = 840 (2×414+12) trong Group 760; ảnh (2) grid 352..1631 = 1280 (4×311+3×12) trong Group 1200. Cả hai grid bám **mép trái** Group, vượt **mép phải đúng 80px**; delta 80px hằng số, không theo align/số cột (2 cột +40/cột, 4 cột +20/cột) → **width delta của block grid**, không phải align Wide hay container query. Prototype **một class một rule** `.skvn-island-group` (đề xuất, `.skvn-island` đã thuộc theme) clamp con trực tiếp về content box, không overflow, specificity (0,5,0) thắng `!important` (0,1,0) của core; kèm diagnostic phân biệt 4 chủ khả dĩ của 80px, T-ISLAND-05–09, cảnh báo typography Full và variant C1/C2 cho full-bleed+measure. Doc [group-island-windpress-class-1.3.20](../docs/testing/group-island-windpress-class-1.3.20.md); chưa nạp site/WindPress, chưa chốt tên, không runtime/theme/plugin delta, không bump.

Island 80px owner2026-11-12: đo onsite (post=71, frontend, `clientWidth 1903`/`dpr 1`/`zoom 1` ⇒ scale 1:1): island Wide 351.5..1551.5 = 1200; `.skvn-category-grid` 351.5..1631.5 = **1280**, `max-width: calc(100% + 80px)`, margin 0/0, static ⇒ delta chỉ phải, trái khít. **Chủ = GeneratePress dynamic inline CSS** (`#generate-style-inline-css`): `.entry-content .alignwide, body:not(.no-sidebar) .entry-content .alignfull{margin-left:-40px;width:calc(100% + 80px);max-width:calc(100% + 80px)}` `(0,2,0)`; GP giả định padding 40px, canvas SKVN zero padding, core ép margin auto `!important` ⇒ mất bù trái. Không phải lỗi Category Grid, không phải container query, không phải tàn dư site CSS (`wp-custom-css` false). Bug cấp canvas: mọi `.alignwide` nested trong container đều +80 phải (slider/collection/grid) ⇒ PITFALLS DP-07.1. Probe inject rule §2: 1280→1200, delta 80→0 ⇒ **rule prototype thắng, T-ISLAND-05 PASS kỹ thuật**; nhưng rule **không có mặt** trong CSS serve (vắng cả `windpress-cached-inline-css` và `windpress:vfs` 9.477 byte) ⇒ paste chưa lưu/compile vào project WindPress đang serve, onsite PASS chưa đạt. Hai hướng chưa chọn: T1 theme neutralize GP `.alignwide` trên canvas (chữa cả slider/collection, cần duyệt vì đổi geometry) vs T2 tiếp stopgap class. Không source delta, không bump.

Island foundation2026-11-12: human **tạm không dùng Group** ⇒ stopgap WindPress **dormant**, T2 không theo đuổi; yêu cầu gom kết luận/đánh giá thành nền cho block group island. Tài liệu [066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK](../.context/planning/066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK.md) chốt: island = band + measure + gutter (ba chủ, không gộp); **ba thất bại riêng** của core Group (F1 clamp760/container query, F2 nền=box nên Wide dừng 1200, F3 GP+80 math) với ba cách chữa khác nhau; measure model M1/M2/M3 (M1 loại vì grid 760 lật tablet; khuyến nghị M3-a native + M3-c hai variation); kiến trúc A1 style variation (không sở hữu measure), A2 block variation core/group (khuyến nghị bước 1: 1 click, markup Group, có transform), B custom block InnerBlocks (end state nếu cần control, phải P0 proof `supports.layout`), C pattern (harness only); T1 là **dependency cứng**; hợp đồng width/CSS/editor-64px/migration/validation; acceptance đề xuất GI-B01–08/GI-E01–06/GI-T01–10; gates G-01..G-08 (SemVer, kiến trúc, P0, T1, deferred test 1.3.20, tokens, naming, mockup) đều **chưa đạt**. **Foundation only** — island defer1.4.x, chưa SemVer, chưa start, không source delta, không bump, current1.3.20 giữ.




| Work package | Source / acceptance | Trạng thái / evidence cần tiếp |
|---|---|---|
| Product Category Grid + Category details | Plan049; CG-UI-01–04, CG-UX-01–03, CG-TECH-01–05; DS-01–07 áp Category | Đã có source, Chờ kiểm chứng. Giữ native category data/thumbnail/description, query eligibility/count, picker/save/conflict/persistence và plugin độc lập theme. |
| Woo Archive M1 + shared Product card | Plan059/060; AM1-*, AL-01–06, AR-* áp Woo và AC-* | Source e7f789f; ảnh1:1, desktop category sidebar trái/tablet navigation trên, native Woo query/count/order/pagination, shared presenter/assets + fallback. CSS7modelPASS và baseline16mockPASS giữ phạm vi; combined37PHP/hook-template10 chưa hoàn tất PASS, onsite/build/lint chưa có evidence. |
| Ngoài current scope | Blog archive, Archive M2 inquiry/second language, ratio control follow-up060§12 | Chưa start/deferred, không tự gán vào1.3.21 hoặc mở ratio setting trong patch1:1. Hero1.3.21 vẫn hotfix riêng. |

Runbooks hiện hành: `docs/testing/product-category-grid-1.3.20.md`, `docs/testing/archive-repair-1.3.x.md`. Source/design approval/model PASS không tự là runtime PASS. Header/footer shared issues không tự gộp repair; CF7/CFDB7 quote contract giữ.

#### Carry register từ1.3.19 →1.3.20 — không mất acceptance

Đây là đích theo dõi phần chưa nghiệm thu; không đổi owner/IDs hoặc tự mở thêm coding scope. Chạy deferred baseline liên quan trước follow-up không liên quan và cập nhật từng evidence, không suy PASS từ transition.

| Nhóm carry | IDs / nguồn gốc | Trạng thái giữ / bước tiếp |
|---|---|---|
| Sidebar foundation + Theme Design | DS-01–07, TD-01–04 và named TD concurrency/owner/conflict cases;048/050/runbook sidebar | Đã có source, runtime Chờ kiểm chứng; selection/tab/Undo/save/reopen, permissions/theme gate, draft/conflict/storage/fonts và conditional assets/lifecycle. |
| Sidebar hardening | S19-01–04 và toàn bộ SR2-* trong050/051 | Giữ source + VM/mock evidence từng plan; không runtime PASS. Handoff `docs/testing/plugin-design-sidebar-1.3.19-review-handoff.md`; test được carry, không xóa scope vì version mới. |
| Editor preview/canvas | CP01–05, EF01–06;052/053 và runbooks canvas/frame | CP/EF onsite Chờ kiểm chứng; EF01–05 có source/8VM spacing modelPASS, EF06 Slider/Step vẫn audit/planning chưa implementation. |
| Responsive Spacer | RS-UI-01–03, RS-UX-01–05, RS-TECH-01–04;055/runbook spacer1.3.19 | Source có,13Node model/spacing checksPASS phạm vi cũ; build/lint/geometry/onsite Chờ kiểm chứng. Margin/emoji preview source giữ, không suy editor lag đã xử lý. |
| Content Actions | Toàn bộ CCP-* và CCP-R1–R4/R01–R06;057/runbook |18modelPASS/11controller mockedPASS giữ; real WP clipboard/parse/Undo/permissions/Save/menu/runtime/build Chờ kiểm chứng. Right-click058 vẫn Deferred sau2.0. |
| Carousel carry từ1.3.18 qua1.3.19 | UX-01–13 (UX-02a và IDs con), UI-18-TITLE/STYLE; TECH-01–13 (TECH-08a/12 và IDs con), E01–E15;045/040/runbooks | E02/PASS có sẵn giữ nguyên; phần khác giữ status/evidence gốc, không làm lại PASS nếu không có regression. Source/model không thay Technical runtime. |
| Legacy carry C/D/media/arrows | State owner/overflow C, skeleton D-01–08, Post visual, controls hide/disabled, G-MEDIA và editor preview040§13 | Chờ kiểm chứng; giữ human override không sửa skeleton hoặc thêm skeleton toàn trang. Arrow centering source chờ onsite. |
| Chưa duyệt |054 visual controls Q1–Q3 | Planning/deferred, không tự start cùng1.3.20. Giữ decision/evidence tại plan, chờ human chọn khi trở lại scope. |

Snapshot/checklist gốc đầy đủ ở history1.3.19 và plans/runbooks; bảng carry không thay hoặc rút gọn yêu cầu. **Loading/navigation046 vẫn thuộc1.3.18**, acceptance LDR-01–09/UXHF-01–10 theo runbook riêng; không nhập vào Category.

#### Deferred test reminder khi bắt đầu1.3.20

Trước follow-up runtime khác, human chạy build/lint theo AGENTS và baseline Category/Archive + carry Sidebar/Spacer/Content Actions/Carousel liên quan. Gửi build/versions/URLs, screenshots editor/frontend desktop/mobile, console/network và query/quote evidence theo runbook. Khi deploy nhắc chụp Editor UI cho selling point; transition này chưa deploy.


## V1 / 1.3.19 — Plugin Design Sidebar Foundation

Status: **DEFERRED_WITH_CARRY_OVER**
Started: **2026-11-04**
Transitioned: **2026-11-07** — human yêu cầu “cho agent push milestone lên1.3.20”. Đây là chuyển ưu tiên/start1.3.20, không phải nghiệm thu hoặc completed1.3.19; không git remote push/deploy.

Đích nhận acceptance chưa hoàn tất: current1.3.20 carry register trong MILESTONES.md. Giữ nguyên DS/TD, S19/SR2, CP/EF, RS/CCP và Carousel carry từ1.3.18; E02/PASS/model evidence cũ không thay. Controls054 chưa duyệt và Slider/Step preview EF06 vẫn planning/deferred, không tự được coding bởi transition. Loading/navigation046 tiếp tục scope1.3.18, không nhập vào Category. Các snapshot bên dưới giữ nguyên checklist/nội dung/status tại thời điểm chuyển để audit; trạng thái entry này DEFERRED_WITH_CARRY_OVER ưu tiên hơn các dòng Current/IN PROGRESS lịch sử trong snapshot.

Không có RESOLVED_ACTIVE tension nào có Milestone hiện hành1.3.19 trong TENSIONS_ACTIVE tại transition: Hero đã được scheduling thành1.3.21; các entry khác1.4.1/1.3.3/1.3.x. Không sweep/đổi Status của tensions thuộc mốc khác, OPEN giữ nguyên.

### Snapshot current register trước transition (nguyên văn)

## Current Milestone

Current: **V1 / 1.3.19 — Plugin Design Sidebar Foundation**
Status: **IN PROGRESS**
Started: **2026-11-04**
Stack ref: **M1 follow-up** — roadmap 039; 1.3.18 deferred checkpoint archived 2026-11-04, carry register bên dưới. Human yêu cầu agent Sol coding plan 048; Q1=A/Q2=A đã duyệt. Metadata development 1.3.19, chưa release approval. Các checkpoint trước lệnh start dưới đây giữ như lịch sử, không thay current.

AGENTS.md current milestone phải match file này.

Content Actions evidence2026-11-06: human model suite18/18 PASS (Node24.16.0/npm11.13.0, sau repair8ee4a3f),057§26/runbook. Model rerun pending trong checkpoint dưới đã được đáp ứng; build/lint và runtime CCP-* vẫn Chờ kiểm chứng, không tự nghiệm thu/chuyển1.3.19.

Content Actions repair register2026-11-05: human cho thực hiện057§19–24 sau review `0a53a2d`; CCP-R1–R4 **Đã có source repair / runtime Chờ kiểm chứng** (nguồn clipboard bound, descendant permission/mode/controlled, Paste limits, styled spans). Execution057§25; `.context/PITFALLS.md` AP-08–10. Controller tests11/11 PASS giới hạn mock WP APIs + HTML JSDOM; model suite cần human rerun. Giữ acceptance CCP-* gốc và R01–R06; build/lint/onsite còn chờ. Không bump/chuyển/đóng1.3.19 hoặc tự nghiệm thu.

Content Actions scope addition — human2026-11-05: **duyệt nguyên gói057§11–14, start coding và commit `feature patch:` trong current1.3.19, không bump metadata hoặc chuyển milestone**. Ngoại lệ bổ sung development milestone theo human như055, không thay Version Naming Rule. Scope Product/Post Collections + Slider/Slide, menu ⋮ từng block, exact type/shape, query là content, empty ghi đè, giữ style đích/atomic Undo. Stack ref: scope addition của current M1 follow-up. Approval057§17; P0 runtime API/version preflight và CCP-* **Chưa làm**, không runtime/release PASS. Runbook `docs/testing/block-content-actions.md`; prompt `docs/workflows/prompts/block-content-actions-agent-handoff.md`. Giữ DS/TD/carry acceptance và right-click058 Deferred sau2.0; không hỏi lại scope/version/start đã duyệt.

Responsive Spacer scope addition — human2026-11-05: duyệt plan055, thực hiện và commit trong current **1.3.19**, prefix `feature patch:`. Feature mới thông thường tăng MINOR; human chọn ngoại lệ bổ sung development milestone đang mở, không đổi Version Naming Rule/current hoặc release status. Static block có source Inspector responsive values/inherit/reset, mint frame/capped padding200, frontend uncapped CSS-only. RS-UI-01–03/RS-UX-01–05/RS-TECH-01–03 **Đã có source / Chờ kiểm chứng onsite**; RS-TECH-04 chờ human build/lint/artifact. 13 Node tests PASS phạm vi model/viewport/CSS-contract + shared frame mô phỏng, không runtime PASS. Plan: `planning/055_VER_1_3_19_RESPONSIVE_SPACER_PLAN.md`; runbook `docs/testing/responsive-spacer-1.3.19.md`. Giữ toàn bộ DS/TD/carry acceptance.

Design Sidebar visual-controls follow-up: [plan054](planning/054_DESIGN_SIDEBAR_VISUAL_CONTROLS_PLAN.md) đang planning, Q1–Q3 chờ human chốt. Scope đề xuất presentation existing consumers trong current1.3.19, chưa code/approve runtime, không tự mở Category Floating hoặc đổi Theme Design persistence. Giữ DS/TD/SR2/carry acceptance.

### Editor preview presentation register — 2026-11-05

Execution update: human yêu cầu thực hiện053 và agent commit. EF01–05 cho Collection Product/Post Carousel/Grid + Category Grid đã có source, 8VM spacing tests PASS (không phải browser evidence); CP/EF onsite vẫn Chờ kiểm chứng. EF06 Slider/Step mới audit: Slider có source nhưng preview/palette cần chốt, Step chưa có registered runtime. Không chuyển current/version, không đóng acceptance; runbook `docs/testing/editor-preview-frames-1.3.19.md`.

Planning checkpoint trước implementation: Plan052 Product Carousel đã có source, CP01–05 còn chờ kiểm chứng. Human duyệt khung preview dùng chung: [plan053](planning/053_EDITOR_PREVIEW_FRAMES_ROLLOUT.md), contract `docs/standards/editor-preview-frame-contract.md`. Giữ heading/intro trong khung, nhãn type, palette Carousel/Grid và gap dọc tối thiểu10px có parent ownership. P1/P2 nay đã có source theo execution ở trên; audit/thiết kế preview Slider và Step Slider theo gói riêng, không tự đổi mapping1.3.10/stackM5 hoặc chuyển current. Acceptance EF01–06 bổ sung, không thay DS/TD/CP hoặc carry register hiện có.


### Snapshot scope/acceptance trước transition (nguyên văn)

### 1.3.19 — Plugin Design Sidebar Foundation

Repair approval 2026-11-05: human “theo đề xuất, làm xong commit theo mốc” duyệt phương án A/F0–F5 của `.context/planning/050_VER_1_3_19_REVIEW_REPAIR_PLAN.md` — S19-01–04 (Post hover persistence, storage-owner concurrency, conflict recovery, disclosure focus). Coding/commit source1.3.19 được phép; chưa runtimePASS hoặc release approval. Handoff review: `docs/testing/plugin-design-sidebar-1.3.19-review-handoff.md`.

Status: **IN PROGRESS — started 2026-11-04 by human instruction; source in progress, runtime chưa kiểm chứng**.
Execution plan: `.context/planning/048_VER_1_3_19_PLUGIN_DESIGN_SIDEBAR_EXECUTION_PLAN.md` — P0–P6, control placement, DS/TD acceptance và Carousel carry-over. Human duyệt 2026-11-04 §6 Q1=A (Fonts chỉnh trực tiếp, tái dùng theme_mod/presets), Q2=A (draft + Save riêng theo nhóm, áp dụng sau lưu; giữ draft khi chuyển tab/lỗi; chưa live preview). Approval hướng triển khai, chưa start hoặc runtime PASS.
Confirmed: **2026-10-28** — Sidebar ban đầu 1.3.21 sau Category; **2026-11-04 human hoán đổi với Hero contrast, Sidebar → 1.3.19 trước Category 1.3.20**. Chưa start.

Version rationale: feature mới thường tăng MINOR; **1.3.19 là ngoại lệ đánh số do human xác nhận 2026-11-04**, thay version Sidebar 1.3.21. Giữ Version Naming Rule, không chuyển current/archive/bump metadata.

Scope:
- Shell Selected block / Plugin; mở từ toolbar/block shortcut, chọn đúng target và quay về Block Inspector.
- Tích hợp Product/Post Carousel; chuẩn bị điểm tích hợp Product Category Grid cho 1.3.20. Giữ Content/Query/Layout cơ bản tại Inspector, design controls theo thành phần tại sidebar riêng.
- Theme Design: typography/fonts/brand colors theo capability SKVN Marine; tái sử dụng nguồn settings hiện có, không tạo store/font loader cạnh tranh. Theme khác ẩn integration, giữ dữ liệu và chức năng block độc lập.
- Category details (thumbnail/description Woo dùng chung) giữ boundary với style cục bộ. Sidebar 1.3.19 chuẩn bị adapter; Category Grid tích hợp khi triển khai 1.3.20, không xây Category trước trong milestone nền.
- Save/Undo block, save settings chung, quyền, loading/error/fallback, responsive và keyboard accessibility.

Không gồm: triển khai Slider/Step Slider/2-side Product, font delivery governance 1.6.0, linked global styles/defaults gói E. Consumers tương lai tích hợp trong milestone riêng.

Acceptance — toàn bộ **Chưa làm**, không có runtime evidence:
- [ ] Editor UX: DS-01–DS-07 trong ideation được map đầy đủ vào execution plan; selection/no selection/unsupported/multi-selection, delete/duplicate/undo không ghi nhầm target; có video/ảnh kiểm chứng.
- [ ] Editor UX: controls Carousel có vị trí rõ, không mất chức năng; kiểm keyboard và sidebar hẹp. Acceptance Category controls/details kế thừa sang 1.3.20 khi consumer có source.
- [ ] Block UI: preview → save/reopen → frontend đúng cho inherited token/block override; kiểm Product/Post, nội dung dài/thiếu ảnh và responsive bằng ảnh đối chiếu. Category chạy cùng chuỗi kiểm trong 1.3.20.
- [ ] Technical: permissions kiểm phía server, save lỗi giữ dữ liệu; thử SKVN Marine/theme khác/đổi theme quay lại; evidence saved values, network/console.
- [ ] Technical: không mount runtime/refetch query chỉ vì đổi tab/style; regression các consumer và settings hiện có được kiểm chứng.
- [ ] Human duyệt onsite trước completion; nguồn scope và chi tiết states: `docs/workflows/ideation-plugin-design-sidebar.md`.

#### Carousel carry-over từ 1.3.18 — human 2026-11-04

Đích nhận toàn bộ phần còn thiếu evidence/implementation của 045 và runbook 1.3.18 là **1.3.19**. Mỗi ID giữ trạng thái/evidence gốc; tại checkpoint 1.3.18 phần chưa hoàn tất được **Deferred → 1.3.19**, không đánh dấu PASS. Không làm lại các case đã PASS nếu chưa có thay đổi/regression liên quan.

- **Editor UX / Block UI:** UX-01–13 (gồm UX-02a, UX-09/10/11 và IDs con), UI-18-TITLE/STYLE; controls/placement/hide-disabled, query/preview/save-reopen parity, CTA hover/chip colors, typography/reset, G-MEDIA/legacy và Post visual. Đối chiếu từng case E01–E15 của runbook; E02 giữ PASS hiện có.
- **Technical / runtime riêng với sidebar:** TECH-01–13 (gồm TECH-08a/12 và IDs con), query/render/actions/security/valid links, keyboard, Product manual-only/Post pause/reduced-motion, loop/count/resize, Grid compatibility, conditional assets/cleanup/memory và build/deploy evidence. Không coi DS-01–07 thay cho các kiểm chứng này.
- **Carry-in chưa kiểm:** gói C state owner/overflow, gói D skeleton D-01–08, arrow centering, Post visual. Giữ override không sửa skeleton và không thêm skeleton toàn trang; chỉ test/ghi debt, không tự mở scope sửa.
- **Nguồn kiểm:** plan 045 §4–6/§9–13, plan 040 §11/§13 và `docs/testing/carousel-editor-ux-technical-1.3.18.md` cùng runbooks C/D/arrows. Khi 1.3.19 trở thành current, nhắc human chạy phần deferred trước follow-up không liên quan; ghi URL/build/fixture/evidence và cập nhật từng ID.
- **Scope độc lập:** UX hotfix loading/navigation 046 vẫn được theo dõi tại 1.3.18, không tự coi report Carousel là nghiệm thu hotfix hoặc chuyển acceptance LDR/UXHF sang Sidebar.


---

## V1 / 1.3.17 — Product/Post Carousel Block UI & Visual QA (stack: M1)

Status: **DONE_WITH_CARRY_OVER**
Started: **2026-10-13**
Scope refined: **2026-10-14** (human tách giao diện vs Editor UX/Technical sang 1.3.18)
Closed: **2026-10-19**, human approve chuyển milestone sau onsite test.

Planning: `.context/planning/040_VER_1_3_17_CAROUSEL_UI_UX_TECHNICAL_PLANNING.md` §11 (mapping version), §13 (Editor preview — **chưa triển khai**, chuyển 1.3.18); roadmap `.context/planning/039_ROADMAP_C_B2B_TOOLKIT_CAROUSEL_FIRST_PLANNING.md` §4–§4a; repair plan `.context/planning/043_VER_1_3_17_CAROUSEL_ONSITE_REPAIR_PLAN.md` (gói A/B/C/D + §7a regression).

Test docs: `docs/testing/carousel-repair-acceptance-1.3.17.md` (A), `carousel-attributes-summary-1.3.17.md` (B), `carousel-preinit-fallback-1.3.17.md` (C), `carousel-skeleton-loading-1.3.17.md` (D).

### Kết quả theo gói (human xác nhận onsite 2026-10-19)

| Gói | Nội dung | Trạng thái |
|---|---|---|
| A | Width Normal/Wide/Full (P2 Wide-cho-mới) | **PASS** — human test onsite + approve |
| B | Grouped attributes + `+N`, `specValuesLimit` 2/3/4, default 3 | **PASS** — human test onsite + approve |
| C | Pre-init geometry, ready/fallback, isolation | **PASS** về chức năng; **sửa regression** ngày 2026-10-19 (state owner) → xác minh sau sửa **Chờ kiểm chứng** |
| D | Local skeleton (watchdog 5s) | **Đã có source, CHƯA test onsite** → carry sang 1.3.18 |

### Regression đã phát hiện và sửa

Scrollbar ngang tồn tại sau khi Swiper init; arrows luôn ẩn; skeleton không hiện. Root cause: JS gắn state class lên `.skvn-collection__carousel-outer` trong khi CSS state selector viết theo `.skvn-collection--carousel` trên `<section>` → selector không bao giờ match. Sửa tại `src/collection-view.ts` (`resolveStateElement()`) + `src/collection/style.css` (chỉ ẩn `.swiper-wrapper`, không ẩn cha chứa skeleton). Bài học + check bắt buộc: `.context/modules/PLUGIN_SKVN_MARINE_BLOCKS.md` → "Collection Carousel Runtime State Contract". Chi tiết: 043 §7a.

### Acceptance carry sang 1.3.18 (human chốt 2026-10-19)

- Xác minh lại sau bản sửa state owner (gói C).
- Gói D — skeleton: source có, cần build/lint + onsite D-01…D-08.
- Post Carousel visual — human duyệt riêng.
- Controls: quyết định hide/disabled và placement.
- G-MEDIA — chọn/lưu ba media layouts + cơ chế legacy.
- Editor preview theo 040 §13 (UX-09/10/11, TECH-12).

Tên/scope trước split (truy vết): "Product/Post Carousel Stability & QA" gộp cả ba nhóm; tổng acceptance ở 039 §4–§4a và 040 §7/§11. M1 chưa hoàn tất: M1 = 1.3.17 + 1.3.18.

---

## V1 / 0.1.0 — Child Theme Skeleton + Local Runtime Baseline

Status: **DONE**
Started: **2026-05-18**
Completed: **2026-05-20**
Approved by human: **2026-05-20**

Acceptance:

- [x] Local WP runtime root exists: `D:\Github\minhhaifish`
- [x] `.local/ENVIRONMENT.md` stores local paths and credentials
- [x] `.local/` is git ignored
- [x] WordPress core installed in runtime root
- [x] GeneratePress parent theme installed in runtime root
- [x] `skvn-marine` child theme active in runtime root
- [x] `skvn-marine-blocks` plugin active in runtime root
- [x] External required plugins installed in runtime root, not source repo
- [x] PHP server smoke test returns HTTP 200 on `http://localhost:8080`
- [x] Theme PHP syntax check passed after latest code changes
- [x] Plugin build check passed after latest code changes
- [x] Human approves milestone completion

---

## V1 / 0.2.0 — Design System, Block Styles, Patterns

Status: **CARRIED_WITH_TEST_DEBT**
Started: **2026-05-20**
Carried forward: **2026-05-21**
Approved by human to continue: **2026-05-21**

Acceptance:

- [x] Theme tokens reviewed/refined
- [x] `theme.json` reviewed/refined
- [x] Base typography/layout implemented
- [x] Header baseline implemented with GeneratePress + SKVN child theme CSS, no header builder plugin
- [x] Footer baseline implemented with theme pattern/template + SKVN child theme CSS, no footer builder plugin
- [x] Block styles implemented
- [x] Starter patterns implemented
- [x] Trust feature strip reusable pattern implemented
- [x] Newsletter signup band reusable pattern implemented with replaceable image block and no custom form handler
- [ ] Homepage test page assembled in WP editor with placeholder content/images to validate layout before finalizing reusable patterns
- [ ] Runtime smoke test passed
- [x] Human approves continuing to 0.3.0 with test debt

Test debt carried into V1:

- Insert `wp-content/themes/skvn-marine/patterns/homepage-test.php` into a WordPress page.
- Visually review desktop/mobile layout in runtime.
- Run runtime smoke test when local WP server responds reliably.

---

## V1 / 0.3.0 — Slider / Slide Block

Status: **CARRIED_WITH_TEST_DEBT**
Started: **2026-05-21**
Carried forward: **2026-05-21**
Approved by human to continue: **2026-05-21**

Acceptance:

- [x] TypeScript build pipeline passes
- [x] Slider + Slide block registration works
- [x] Swiper dependency rationale documented
- [x] Swiper loads only for slider block frontend
- [x] Swiper config comes from block attributes
- [x] Keyboard navigation enabled
- [x] Pause on hover implemented
- [x] `prefers-reduced-motion` disables autoplay
- [x] Editor uses stacked/simplified preview, no autoplay
- [ ] Runtime smoke test passed
- [x] Human approves continuing to 0.4.0 with test debt

Test debt carried into V1:

- Create a `Slider Runtime Test 0.3.0` page in runtime.
- Insert `skvn-marine/slider` with at least 3 `skvn-marine/slide` children.
- Verify frontend slider initialization, arrows, dots, keyboard navigation, hover pause, reduced-motion autoplay behavior, and console status.

---

## V1 / 0.4.0 — Woo Product Sections

Status: **CARRIED_WITH_TEST_DEBT**
Started: **2026-05-21**
Carried forward: **2026-05-21**
Approved by human to continue: **2026-05-21**

Acceptance:

- [x] V1 decision: use WooCommerce native blocks/patterns
- [x] Woo native product patterns created/styled
- [x] Product card visual styling implemented
- [x] Mobile CTA remains visible
- [x] No custom Product Grid/List blocks in V1
- [ ] Runtime smoke test passed
- [x] Human approves continuing to 0.5.0 with test debt

Test debt carried into V1:

- Create a `Woo Product Sections Test 0.4.0` page in runtime.
- Insert `SKVN Woo Category Strip` and `SKVN Woo Product Grid`.
- Verify categories/products render from real WooCommerce data.
- Verify product card CTA remains visible on mobile.
- Verify no invalid block warning after save/reload.

---

## V1 / 0.5.0 — SKVN Full Width Layout

Status: **DONE**
Started: **2026-05-21**
Completed: **2026-05-22**
Approved by human: **2026-05-22**

Acceptance:

- [x] `SKVN Full Width` page template exists in child theme
- [x] Template keeps GeneratePress header/footer intact
- [x] Template removes the narrow default content wrapper for selected pages
- [x] `.alignfull` sections can reach viewport width
- [x] Inner content remains constrained to SKVN wide width
- [x] Pattern UI test page uses the full-width layout
- [x] Desktop hero headline no longer collapses into a narrow column
- [x] Mobile has no horizontal scroll
- [x] PHP syntax check passed
- [x] Runtime smoke test passed
- [x] Human approves milestone completion

---

## V1 / 0.5.1 — Page Display & Sidebar Controls

Status: **DONE**
Started: **2026-05-22**
Completed: **2026-06-02**
Approved by human: **2026-06-02**

Acceptance:

- [x] CF7/CFDB7 deferred until after V1 / 0.6.0
- [x] n8n deferred until after version 1.0.0
- [x] Quote UI/page surface moved to V1 / 0.6.0
- [x] Page editor exposes a Hide site header toggle
- [x] Page editor exposes a Hide site footer toggle
- [x] Toggle values are saved as page meta with `skvn_marine_`/`_skvn_` naming
- [x] Frontend applies header/footer visibility per page without editing GeneratePress parent
- [x] Controls are available through admin/editor UI, not raw class input
- [x] Runtime visual smoke test passed
- [x] Human approves milestone completion

---

## V1 / 0.6.0 — Quote UI & Editor Controls

Status: **DONE**
Started: **2026-06-02**
Completed: **2026-06-02**
Approved by human: **2026-06-02**

Acceptance:

- [x] Quote CTA visual path uses `/request-a-quote/?product_id=123`
- [x] Request quote page visual surface exists or is planned as an editor-owned page
- [x] Quote UI uses project visual classes/tokens
- [x] Editing controls that marketing users need are exposed through sidebar controls, not raw class input
- [x] Runtime visual smoke test passed
- [x] Human approves milestone completion

---

## V1 / 0.7.0 — Basic CF7/CFDB7 Quote Form

Status: **CARRIED_WITH_RUNTIME_VERIFICATION_DEBT**
Started: **2026-06-02**
Carried forward: **2026-06-02**
Approved by human to continue: **2026-06-02**

Acceptance:

- [x] CF7 form contract prepared for Request a Quote
- [x] CF7 markup uses project classes: `skvn-form`, `skvn-quote-form`, `skvn-button`, `skvn-button--primary`
- [x] Required visible fields prepared
- [x] Required hidden fields prepared: `product_id`, `product_sku`, `product_name`, `product_url`, `source_url`, UTM fields
- [x] Thank-you page contract prepared
- [x] n8n remains deferred/unexposed
- [x] WP Admin setup path documented for onsite testing
- [ ] Onsite CF7 form existence confirmed by human evidence
- [ ] Onsite request quote page contains the CF7 form
- [ ] Onsite thank-you page exists
- [ ] CFDB7 stores quote submission
- [ ] Runtime quote form smoke test passed
- [ ] Human approves milestone completion

Completion snapshot:

Done:

- CF7 markup contract exists in `docs/artifacts/cf7-quote-form-0.7.0.md`.
- Visible and hidden field contract exists.
- Theme source contains SKVN form/button styling for quote form classes.
- Dev/runtime setup shortcut exists in `tools/setup-quote-flow-070.php`.
- Onsite-first test checklist exists in `docs/testing/onsite-quote-flow-0.7.0.md`.
- WP Admin manual setup path is documented for onsite testing.
- n8n remains deferred and unexposed by repo/source changes.

Not done / carried to 0.7.1:

- Onsite CF7 form existence has not been confirmed with evidence in repo.
- Onsite request quote page shortcode placement has not been confirmed with evidence in repo.
- Onsite thank-you page existence has not been confirmed with evidence in repo.
- CFDB7 storage has not been confirmed with a submitted row.
- Runtime smoke test has not passed.

Deferred test debt:

- [ ] Onsite hidden/context field and full UX smoke test is intentionally deferred to V1 / 0.10.0 because human is working under time pressure.
- [ ] See `docs/testing/onsite-quote-flow-0.7.0.md`.
- [ ] Related docs/files to open at V1 / 0.10.0:
  - `docs/testing/onsite-quote-flow-0.7.0.md` — exact onsite test checklist and evidence format
  - `docs/artifacts/cf7-quote-form-0.7.0.md` — expected CF7 form markup/classes/fields
  - `docs/decisions/quote-flow.md` — quote-flow scope and deferred n8n decision
  - `.context/modules/QUOTE_FLOW.md` — active quote-flow module protocol
  - `docs/standards/security-guidelines.md` — form/security constraints
  - `wp-content/themes/skvn-marine/style.css` — source styles for `skvn-form` / `skvn-quote-form`

---

## V1 / 0.7.1 — Quote Flow Runtime Verification & Handoff

Status: **CARRIED_TO_0.10.0**
Started: **2026-06-02**
Carried forward: **2026-06-03**
Approved by human to continue: **2026-06-03**

Purpose:

- Close the remaining 0.7.0 verification gap without pretending this is a new feature milestone.
- Confirm that the manually created onsite/admin setup matches the source/docs contract.
- Apply only small quote-flow fixes if onsite evidence shows a mismatch.
- Do not add new quote-flow features before onsite/runtime evidence or explicit approval.

Acceptance:

- [x] Onsite/admin handoff checklist exists in `docs/testing/onsite-quote-flow-0.7.1.md`
- [ ] Human confirms the onsite CF7 form exists
- [ ] Human confirms `/request-a-quote/` contains the CF7 shortcode/form
- [ ] Human confirms `/quote-thank-you/` exists
- [ ] CF7 form markup matches `docs/artifacts/cf7-quote-form-0.7.0.md`
- [ ] CFDB7 stores at least one test submission
- [ ] Hidden/context fields appear in stored submission or mismatch is documented for 0.10.0
- [ ] Runtime smoke test result is recorded
- [ ] No n8n webhook is exposed
- [ ] Human approves closing 0.7.x quote-form setup

Carried to 0.10.0:

- Onsite CF7 form existence evidence.
- Request quote page CF7 shortcode/form evidence.
- Thank-you page existence evidence.
- CF7 markup comparison.
- CFDB7 stored submission evidence.
- Hidden/context field verification.
- Runtime smoke test result.
- No exposed n8n webhook evidence.

---

## V1 / 0.8.0 — SKVN Editor Controls

Status: **CARRIED_TO_0.10.0**
Started: **2026-06-03**
Carried forward: **2026-06-03**
Approved by human to continue: **2026-06-03**

Purpose:

- Add Elementor-inspired but token-governed sidebar controls for SKVN-owned Gutenberg blocks and translated layout surfaces.
- Let editors adjust tone, spacing, width, margin, padding, responsive visibility, and block-specific behavior without raw classes, raw hex values, or unrestricted inline CSS.
- Keep theme-owned visual tokens as the source of truth while plugin-owned blocks expose safe presets.

Acceptance:

- [x] Editor controls contract is documented before code in `docs/decisions/skvn-editor-controls-0.8.0.md`
- [x] Onsite editor-controls test checklist exists in `docs/testing/onsite-editor-controls-0.8.0.md`
- [x] Theme owns tone, spacing, width, radius, shadow, and visual classes for the first `SKVN Accordion` control pass
- [x] Plugin owns block sidebar UI, block attributes, saved markup, and interactive block behavior for the first `SKVN Accordion` control pass
- [x] Controls are grouped into Content, Style, Layout, and Advanced sections for `SKVN Accordion`
- [x] Margin and padding controls use presets/tokens first, with responsive overrides only where needed
- [x] No freeform raw class input is required for marketing editors in `SKVN Accordion`
- [x] No raw hex/rgb/hsl values or arbitrary inline spacing values are required in `SKVN Accordion`
- [x] Slider editor UX tension is resolved before implementing slider-specific controls
- [ ] Editor and frontend output stay visually aligned onsite
- [x] GeneratePress parent remains untouched
- [x] Human approves continuing to 0.9.0 with onsite test debt

Carried to 0.10.0:

- Run `docs/testing/onsite-editor-controls-0.8.0.md` on the onsite site.
- Confirm SKVN Accordion controls persist after save/reload.
- Confirm frontend output matches editor intent.
- Review desktop/mobile screenshots.
- Record console/editor errors or confirm clean.

---

## V1 / 0.9.0 — Footer Page Settings

Status: **CARRIED_TO_0.10.0**
Started: **2026-06-03**
Carried forward: **2026-06-03**
Approved by human to continue: **2026-06-03**

Purpose:

- Add a plugin settings page that stores the selected reusable footer page ID in `skvn_footer_page_id`.
- Let the theme render the selected footer page into GeneratePress' `generate_footer` surface.
- Keep GeneratePress as the footer foundation and fall back to the default GeneratePress footer when no page is selected.
- Implement the footer settings code as a migration-ready module inside the current `skvn-marine-blocks` plugin; do not create or rename to `gutenberg-supercharger` or `gutenberg-turbo` in 0.9.0.
- Treat `Gutenberg Supercharger` as a possible V4 / 4.0.0 umbrella-plugin direction and standard/core product name only. `Gutenberg Supercharger Stage 2` is the pro/commercial stage name. `Gutenberg Remap` is retained only as an alternate/redirect candidate.

Acceptance:

- [x] Plugin settings page stores `skvn_footer_page_id`
- [x] Setting value is restricted to a valid WordPress page ID
- [x] Theme `inc/footer.php` renders the selected footer page through `generate_footer`
- [x] Default GeneratePress footer remains the fallback when no page is selected
- [x] No custom CPT is introduced
- [x] No display rules system is introduced
- [x] Footer settings are module-shaped inside `skvn-marine-blocks`, with current slug/text domain/option key preserved
- [x] No `gutenberg-supercharger`/`gutenberg-turbo` plugin, plugin slug rename, namespace rename, or option-key rename is introduced
- [x] GeneratePress parent remains untouched
- [x] Footer output is escaped/sanitized through WordPress-safe rendering paths
- [ ] Online smoke test confirms selected footer page renders
- [ ] Online smoke test confirms fallback footer works
- [x] Online test checklist/report exists in `docs/testing/footer-page-settings-0.9.0.md` and `docs/decisions/footer-page-settings-0.9.0.md`
- [x] Human approves continuing to 0.10.0 with online test debt

Carried to 0.10.0:

- Run `docs/testing/footer-page-settings-0.9.0.md` on the online site.
- Confirm selected footer page renders.
- Confirm default GeneratePress fallback works.
- Confirm invalid page ID fallback or document mismatch.

---

## V1 / 0.10.0 — Onsite Test Debt Resolution

Status: **DONE_WITH_CARRIED_DATA_FLOW_DEBT**
Started: **2026-06-03**
Completed: **2026-06-05**
Approved by human: **2026-06-05**

Purpose:

- Resolve onsite test debt carried from 0.8.0 and 0.9.0.
- Record footer evidence and CF7 interface evidence.
- Separate remaining CF7 form/data flow checks from visual/UI readiness.

Acceptance:

- [x] Human runs `docs/testing/footer-page-settings-0.9.0.md` on the online site and reports evidence
- [x] Footer Page Settings selected footer page renders online
- [x] Footer Page Settings default GeneratePress fallback works online
- [x] Footer Page Settings invalid page ID fallback is confirmed or mismatch is documented
- [x] Onsite CF7 form existence confirmed by human evidence
- [x] Onsite request quote page contains the CF7 shortcode/form
- [x] CF7/Request Quote interface visual check passed onsite
- [x] Desktop/mobile benchmark UI issues were reviewed and source CSS hardening was applied where needed
- [x] Human approves closing onsite test debt milestone

Not closed in 0.10.0 / carried to 1.1.2:

- CF7 form submission/data flow.
- CFDB7 stored submission evidence.
- Visible field storage evidence.
- Hidden/context field storage evidence.
- Product/product-card/page-block origin query params.
- Thank-you/success UX after submit.
- Map block/display issue because the current map surface is not viewable.

Carry-forward target:

- V1 / 1.1.2 — Product Quote Flow & Map Block Testing.

---

## V1 / 0.11.0 — SKVN Marine Admin Menu

Status: **DONE**
Started: **2026-06-05**
Carried forward: **2026-06-05**
Approved by human to continue: **2026-06-05**
Completed after onsite launch: **2026-06-05**

Purpose:

- Move the existing SKVN Footer admin surface out of `Settings`.
- Create a top-level `SKVN Marine` admin menu owned by `skvn-marine-blocks`.
- Put the footer settings screen under the `SKVN Marine` admin menu as one tab/page.
- Add a safe footer background preset setting for the selected footer page.
- Leave admin menu ordering/repositioning to the external ASE plugin instead of hardcoding menu position rules in SKVN code.

Acceptance:

- [x] Source implements `SKVN Marine -> Footer` under the plugin-owned admin menu.
- [x] Existing option key `skvn_footer_page_id` remains unchanged.
- [x] New option key `skvn_footer_background_preset` stores an approved preset, not raw color input.
- [x] Footer background preset is sanitized to approved values.
- [x] Theme applies footer background only when a valid custom footer page is active.
- [x] Theme styles `.skvn-footer-page` and outer `.skvn-site-footer` for selected presets.
- [x] Default GeneratePress fallback footer remains the source fallback path.
- [x] Capability checks and nonce protection remain through the WordPress Settings API.
- [x] SKVN code does not hardcode advanced admin menu ordering; ASE handles menu repositioning onsite.
- [x] Onsite evidence confirms `Settings -> SKVN Footer` is no longer the primary admin location.
- [x] Onsite evidence confirms custom footer and fallback behavior.
- [x] Human approves milestone completion after onsite evidence.

Closed in 1.0.0 onsite launch pass:

- `docs/testing/footer-appearance-settings-0.11.0.md`.
- `docs/testing/onsite-0.11-0.12-completion-checklist.md`.

---

## V1 / 0.12.0 — SKVN Header Actions And B2B Search

Status: **DONE**
Started: **2026-06-05**
Carried forward: **2026-06-05**
Approved by human to continue: **2026-06-05**
Completed after onsite launch: **2026-06-05**

Purpose:

- Add governed header actions without replacing the GeneratePress header shell.
- Support product search, post/site search, contact CTA, and optional Request Quote CTA.
- Plan the B2B search results experience as a governed page that separates Products from Related articles.
- Keep phase 1 search lightweight: taxonomy/title-first native WP/Woo queries, no Elastic/OpenSearch, and no custom query cache.

Acceptance:

- [x] Human confirms 0.12.0 as the exact implementation target before code.
- [x] Source renders header actions through GeneratePress hook integration without editing GeneratePress parent files.
- [x] `SKVN Marine -> Header` settings are documented and implemented.
- [x] Product search can be enabled/disabled in source settings.
- [x] Post/site search can be enabled/disabled in source settings.
- [x] Contact button can be enabled/disabled in source settings.
- [x] Request Quote button can be enabled/disabled in source settings.
- [x] Search target is explicit in source: products, articles, or all site.
- [x] B2B search results template separates Products from Related articles.
- [x] Product matching uses product tags/categories/title before content fallback.
- [x] Related article matching uses post tags/categories/title before content fallback.
- [x] No Elastic/OpenSearch dependency is added in phase 1.
- [x] No custom query cache or SQL cache table is added in phase 1.
- [x] Onsite evidence confirms GeneratePress header remains stable.
- [x] Onsite evidence confirms header mobile behavior does not break GeneratePress navigation.
- [x] Onsite evidence confirms keyboard/focus behavior for search and buttons.
- [x] Human approves milestone completion after onsite evidence.

Closed in 1.0.0 onsite launch pass:

- `docs/testing/header-actions-search-0.12.0.md`.
- `docs/testing/onsite-0.11-0.12-completion-checklist.md`.

---

## V1 / 1.0.0 — V1 Launch Ready

Status: **DONE**
Started: **2026-06-05**
Completed: **2026-06-05**
Approved by human: **2026-06-05**

Purpose:

- Confirm the V1 launch-ready baseline after onsite launch.
- Close 0.11.0 and 0.12.0 onsite UI/test debt after human reported pass.
- Keep post-launch quote data-flow and map checks deferred to V1 / 1.1.2.

Recommended onsite stability plugins:

- Admin and Site Enhancements (ASE) — recommended onsite admin/governance helper for menu organization and wp-admin workflow polish. SKVN source must not hardcode advanced admin menu ordering that belongs to ASE.
- Ultra Addons for Contact Form 7 — recommended onsite CF7 helper for form UI/stability enhancements around the existing CF7 workflow. This does not change the V1 rule: do not custom-code quote form handling; CF7/CFDB7 remain the quote form/data layer.
- Both plugins are external WordPress runtime dependencies only. They must not be copied or committed into this source repo.

Acceptance:

- [x] Accessibility pass
- [x] Mobile QA pass
- [x] SEO/GEO structure pass
- [x] Performance and asset loading review
- [x] Admin and Site Enhancements (ASE) is reviewed/active onsite if needed for admin workflow stability.
- [x] Ultra Addons for Contact Form 7 is reviewed/active onsite if needed for CF7 form UI/stability.
- [x] No forbidden parent-theme changes
- [x] No external plugins committed to source repo
- [x] Human approves V1 launch readiness

Boundary carry-forward:

- n8n remains deferred/unexposed and should be reviewed only at the V1 → V2 boundary unless human explicitly moves it into scope earlier.

Init prompt:

- `docs/artifacts/init-prompt-v1-1.0.0-launch-ready.md`

Next milestone:

- V1 / 1.1.0 — Layout Blocks.

---

## V1 / 1.1.0 — Layout Blocks

Status: **DONE — VALIDATION DEFERRED**
Started: **2026-06-05**
Moved forward by human: **2026-06-07**

Purpose:

- Add governed `skvn-marine/card-grid` and `skvn-marine/card` layout blocks.
- Keep visual styling theme-owned and block logic plugin-owned.
- Prepare stable layout markup without coupling layout blocks to motion behavior.

Implementation completed:

- [x] Footer background preset admin UI uses stable swatch/preview treatment.
- [x] Repeated layout artifacts justify shared grid/card governance.
- [x] Core-block and theme-pattern alternatives were evaluated.
- [x] `skvn-marine/card-grid` and `skvn-marine/card` exist in the plugin.
- [x] Blocks use `block.json`, TypeScript, and InnerBlocks.
- [x] Controls save stable `skvn-*` layout classes.
- [x] Theme CSS implements the layout-critical classes.
- [x] No frontend JavaScript runtime was added for static grids.
- [x] Layout blocks do not expose or depend on motion controls.
- [x] Plugin build passed.

Deferred by explicit human decision:

- Run `docs/testing/card-grid-layout-blocks-1.1.0.md`.
- Confirm editor/frontend behavior at desktop, tablet, and mobile widths.
- Evaluate `skvn-marine/quote` only after card-grid/card validation.
- Close validation under V1 / 1.4.1.

Next milestone:

- V1 / 1.2.0 — Slider Editor & Motion.

---

## V1 / 1.2.0 — Slider Editor & Motion

Status: **DONE — ONSITE QA DEFERRED**
Started: **2026-06-07**
Moved forward by human: **2026-06-07**

Implemented:

- [x] Slide background image choose, replace, remove, and editor preview.
- [x] Governed overlay opacity.
- [x] Editable heading, lead, and CTA template.
- [x] Plugin-owned Swiper and structural CSS.
- [x] Accessible Accordion progressive enhancement with real-height animation.
- [x] Card motion presets with independent Desktop/Tablet/Mobile targeting.
- [x] Reduced-motion and no-JavaScript fallback architecture.
- [x] Plugin build and PHP syntax checks passed.

Deferred by explicit human decision:

- Onsite editor and frontend verification.
- Slider image persistence and Swiper behavior.
- Accordion and Card motion accessibility/responsive checks.
- Consolidate these tests with 1.2.1 under V1 / 1.2.9.

Next milestone:

- V1 / 1.2.1 — SKVN Slider Presets & Inserter.

---

## V1 / 1.2.1 — SKVN Slider Presets & Inserter

Status: **DONE — FRONTEND ARCHITECTURE FIX DEFERRED**
Started: **2026-06-07**
Completed: **2026-06-08**
Approved by human: **2026-06-08**

Purpose:

- Register one `SKVN Marine` Block Inserter category.
- Add Hero Slider, Product Showcase, and Card Carousel as variations/templates
  over the existing Slider/Slide blocks and Swiper runtime.
- Keep native Gutenberg stacked editing and List View operations.

Acceptance:

- [x] Human approved the add-and-see preset direction and rejected a custom slide manager for MVP.
- [x] `SKVN Marine` appears as a dedicated Block Inserter category.
- [x] Existing SKVN-owned blocks appear under `SKVN Marine`.
- [x] Hero Slider, Product Showcase, and Card Carousel appear as inserter choices.
- [x] Presets reuse `skvn-marine/slider`, `skvn-marine/slide`, and one Swiper runtime.
- [x] No slide manager, selected-slide canvas, or setup modal was introduced.
- [x] Native Gutenberg List View and block actions remain usable.
- [x] Existing Slider serialization remained valid.
- [x] Plugin build passed.
- [x] Human approved milestone completion and transition to V1 / 1.2.3.

Deferred:

- Frontend Hero Slider media/content frame bug is documented in
  `docs/testing/archives/slider-frontend-media-content-layer-bug-1.2.1.md`.
- The static markup workaround was rejected to avoid compound deprecation debt.
- Dynamic Slider rendering architecture is planned for V1 / 1.3.0.
- Slider/motion onsite QA must be reconciled with the V1 / 1.3.0 migration
  before the deferred QA milestone is closed.

Next milestone:

- V1 / 1.2.3 — SKVN Feature Showcase.

---

## V1 / 1.2.3 — SKVN Feature Showcase

Status: **DONE — ONSITE QA CARRIED TO 1.2.9**
Started: **2026-06-08**
Completed: **2026-06-09**
Approved by human: **2026-06-09**

Purpose:

- Activate and refactor `SKVN Feature Showcase` into a reusable panel-only block.
- Keep the B2B seafood editorial intro as an optional theme pattern.
- Preserve the existing standard Accordion as a separate content contract.

Completed:

- [x] Registered `skvn-marine/feature-showcase` under `SKVN Marine`.
- [x] Added editable panel count, order, label, heading, copy, image, and ALT.
- [x] Added horizontal and vertical desktop layouts.
- [x] Added desktop hover/focus activation and mobile tap disclosure.
- [x] Added governed Ocean, Deep navy, Marine teal, and Fresh sky color packages.
- [x] Preserved native `details`/`summary`, keyboard access, no-JS readability,
      and reduced-motion fallback.
- [x] Prevented active-panel collapse and image/content flashing.
- [x] Improved panel response by animating `flex-grow` instead of the full
      `flex` shorthand.
- [x] Added the `B2B Seafood Feature Showcase` theme pattern.
- [x] Restored Gutenberg normal/wide/full width semantics under
      `SKVN Full Width Canvas`.
- [x] Documented the full-width surface plus governed inner-container contract.
- [x] Plugin build, PHP lint, diff check, and context consistency passed.

Carried to V1 / 1.2.9:

- Onsite Feature Showcase interaction and responsive verification.
- Real Media Library image and ALT verification.
- B2B pattern editor/frontend parity.
- Full Width Canvas normal, wide, and full alignment verification.
- Legacy saved-pattern compatibility verification.

Next milestone:

- V1 / 1.2.9 — Slider & Motion Onsite QA.

---

## V1 / 1.2.4 — Prepare for custom color and heading

Status: **CLOSED — SCOPE CLEANUP**
Started: **2026-06-09**
Moved forward by human: **2026-06-11**

Completed:

- [x] Fixed color drift between `theme.json` and `style.css`.
- [x] Established the customization baseline.
- [x] Reviewed `theme.json`.

Not completed in this milestone:

- Typography settings block setup was not accepted as complete.
- The human explicitly moved development forward to V1 / 1.3.0.
- Any future typography/customization work must be scheduled under an approved
  milestone instead of remaining attached to 1.2.4.

---

## V1 / 1.2.9 — Slider & Motion Onsite QA

Status: **CLOSED — REMAINING QA MOVED TO 1.3.1**
Started: **2026-06-09**
Moved forward by human: **2026-06-11**

Passed by human feedback:

- [x] Slider image choose, replace, remove, and editor persistence.
- [x] Slider keyboard, autoplay, reduced-motion, navigation, and responsive behavior.
- [x] Feature Showcase desktop hover/focus, mobile tap, gradients, and images.
- [x] Full Width Canvas normal, wide, and full alignment semantics.

Moved to V1 / 1.3.1:

- Slider preset sample-content insertion.
- Hero, Product Showcase, and Card Carousel frontend layouts.
- Existing-content migration and invalid-block checks after dynamic rendering.
- Accordion interaction and accessibility.
- Card motion device targeting and no-JS/reduced-motion fallbacks.
- B2B Seafood Feature Showcase pattern editor/frontend layout.
- Final invalid-block, console, layout, cache, defect, and approval checks.

Reason:

- Slider frontend QA should validate the V1 / 1.3.0 dynamic rendering contract,
  not the superseded static frontend architecture.

Next milestone:

- V1 / 1.3.0 — Slider Dynamic Rendering Architecture.

---

## V1 / 1.3.0 — Slider Dynamic Rendering Architecture

Status: **DONE**
Started: **2026-06-11**
Completed: **2026-06-11**
Approved by human: **2026-06-11**

Purpose:

- Move Slider and Slide frontend output to dynamic PHP rendering.
- Preserve Gutenberg InnerBlocks, block identities, existing content, and one
  Swiper runtime.
- Establish stable Hero media, overlay, content, full-width, pagination, and
  runtime lifecycle ownership.

Completed:

- [x] Slider and Slide render through plugin-owned PHP callbacks.
- [x] Existing InnerBlocks render exactly once without a bulk resave.
- [x] Attachment ID is the preferred Hero media identity with legacy URL
      fallback.
- [x] Hero media, overlay, fallback gradient, and content use explicit layers.
- [x] Product Showcase and Card Carousel retain flow layouts and suppress Hero
      background media.
- [x] Slider joins the existing SKVN full-width canvas through `alignfull`
      without viewport-width hacks.
- [x] Pagination remains inside the Slider frame.
- [x] Slider structural CSS is emitted and registered from the actual
      `style-view.ts.css` frontend asset and is also available in the editor.
- [x] One Swiper instance initializes per Slider root.
- [x] Pointer, focus, and document-visibility listeners have explicit cleanup.
- [x] Destroyed Swiper instances can return to fallback state and reinitialize.
- [x] Reduced motion disables autoplay.
- [x] Existing arbitrary delay values remain compatible.
- [x] Compatibility fixture, plugin build, PHP lint, layout audit, deploy
      artifact build, and plugin zip audit passed.
- [x] Human onsite smoke test confirmed Hero media, full-width geometry,
      controls/pagination placement, editor compatibility, and stable idle RAM.
- [x] Human approved transition to V1 / 1.3.1.

Repair evidence:

- Initial onsite failure and State Delta diagnosis:
  `docs/artifacts/start-v1-1.3.0-slider-repair.md`
- Active architecture decision:
  `docs/decisions/slider-completion-spec-1.3.0.md`

Next milestone:

- V1 / 1.3.1 — Slider Navigation & Pagination Controls UX.

---

## V1 / 1.3.1 — Slider Navigation & Pagination Controls UX

Status: **DONE**
Started: **2026-06-11**
Completed: **2026-06-12**
Approved by human: **2026-06-12**

Completed:

- [x] Existing dots behavior migrates to the pagination contract without invalidating content.
- [x] Arrow and pagination visibility, style, position, and clustering controls work.
- [x] Zero/one Slide disables controls and autoplay.
- [x] Timed pagination follows Swiper autoplay and real-Slide numbering.
- [x] Governed autoplay and transition durations are exposed in the editor.
- [x] Hover, focus, visibility, interaction pause, mobile, and reduced-motion behavior work.
- [x] Editor preview remains static.
- [x] Presentation panel copy, Zoom Out behavior, and governed Slider height presets were refined.
- [x] Human fully approved the milestone and requested transition.

Next milestone:

- V1 / 1.3.2 — Feature Showcase Autoplay And Panel Links.

---

## V1 / 1.3.2 — Feature Showcase Autoplay And Panel Links

Status: **DONE_WITH_FOLLOW_UP_FIXES**
Started: **2026-06-12**
Completed: **2026-06-13**
Approved by human: **2026-06-13**

Purpose:

- Add governed Hover and Autoplay interaction modes to
  `skvn-marine/feature-showcase`.
- Add a magnetic/snapping delay control limited to `3`, `5`, `7`, and `9`
  seconds.
- Add one optional Gutenberg LinkControl destination per panel, rendered as a
  CTA inside panel content rather than turning `summary` into a link.
- Share reduced-motion, governed delay, pause/resume, and document visibility
  invariants with Slider after Slider stability is verified.

Completed:

- [x] V1 / 1.3.0 and V1 / 1.3.1 stability gates are complete.
- [x] Hover and Autoplay modes work without an all-closed state.
- [x] Delay control snaps only to `3s`, `5s`, `7s`, and `9s`.
- [x] Hover, keyboard focus, document visibility, and reduced motion pause or disable autoplay correctly.
- [x] Each panel supports an optional Gutenberg LinkControl CTA.
- [x] CTA interaction does not conflict with disclosure activation.
- [x] Existing Feature Showcase content opens without invalid-block recovery.
- [x] Shared autoplay helpers do not regress Slider runtime behavior.
- [x] No-JavaScript disclosure and links remain usable.
- [x] Plugin build and onsite QA pass by human confirmation.
- [x] Human approves milestone completion and transition.

Follow-up:

- Any newly discovered defects from this milestone will be fixed later instead
  of blocking transition to V1 / 1.3.3.

Next milestone:

- V1 / 1.3.3 — Dynamic Product And Post Collections.

---

## V1 / 1.3.6 — Block Editor UX & Single Post Fix

Status: **CARRIED_WITH_SCOPE_DEBT**
Started: **2026-06-17**
Carried forward: **2026-06-23**
Approved by human to continue: **2026-06-23**

Note: Human directed **current milestone pointer** → 1.3.7 (2026-06-23). Đây **không** phải đóng milestone 1.3.6 với toàn bộ acceptance DONE. Chỉ Trục C (Single Post Fix) hoàn tất tại thời điểm archive. Trục A → **1.3.7** impl; Trục D + collections/button-hover QA → **1.3.11**. Product launch **GU Supercharger 0.0.1** deferred post **1.5.x** (`gu-supercharger`). Lỗi archive ban đầu ghi `Status: DONE` là sai protocol — đã sửa.

Purpose:

- Nâng cấp Inspector panel UX cho tất cả SKVN blocks (Content/Style/Layout/Advanced).
- Fix single post hero width, heading font, và thumbnail aspect-ratio (1.3.5 visual debt).
- ThumbPress-compatible: dùng CSS `aspect-ratio` + `object-fit: cover`, không `add_image_size()`.
- ~~Slider Parallax~~ — deferred → **1.3.8** (decision locked 2026-06-22).

Planning:

- `.context/planning/026_VER_1_3_6_BLOCK_EDITOR_UX_AND_SLIDER_PARALLAX_PLANNING.md`

Acceptance draft:

**Trục C — Single Post Fix:**
- [x] Hero `.skvn-post-hero` render full-width trong GP content area
- [x] Heading trong hero dùng `font-family: var(--skvn-font-heading)`
- [x] Thumbnail hero dùng `aspect-ratio: 16/9` + `object-fit: cover`
- [x] Card thumbnail (archive, related) dùng `aspect-ratio: 3/2` + `object-fit: cover`
- [x] Không có `add_image_size()` mới — ThumbPress-compatible
- [x] Hero content inset + spacing đồng bộ với article (`--skvn-single-gap`, `--skvn-single-inset-inline`) — human verified 2026-06-19

**Trục A — Editor UX:**
- [ ] Tất cả Inspector panels dùng 4-section Content/Style/Layout/Advanced
- [ ] Slider và Accordion có empty state placeholder với action button
- [ ] Collection skeleton grid match responsive preset khi editor đang load
- [ ] Block icons và descriptions không còn blank trong inserter
- [ ] Inspector panel refactor không invalidate content hiện có

**Slider bottom-center flank controls (Trục D — planning 031 v2.0, source IMPLEMENTED — pending QA):**
- Planning: `.context/planning/archives/031_VER_1_3_6_SLIDER_BOTTOM_CENTER_FLANK_CONTROLS_PLANNING.md`
- Onsite: `docs/testing/onsite-slider-flank-controls-1.3.6.md`
- Umbrella: `.context/planning/026_VER_1_3_6_BLOCK_EDITOR_UX_AND_SLIDER_PARALLAX_PLANNING.md` §4.6
- [ ] `bottom-center` arrows + `bottom-center` pagination → `‹ pagination ›` (all pagination styles)
- [ ] `pill` + cluster giữ order mặc định `arrows | pagination`
- [ ] `bottom-left` / `bottom-right` / `side-center` không regression
- [ ] Editor preview khớp frontend flank layout
- [ ] `tests/slider-block.test.mjs` flank regression pass
- [ ] Human onsite PASS per flank test doc
- [ ] Mobile timed pagination width — tune deferred tới 1.3.9 QA

**Chung:**
- [ ] Plugin build pass, PHP lint pass
- [ ] Human approves milestone completion

Next milestone:

- V1 / 1.3.7 — Collection Block UI & Card Styles.

---

## 2026-10-13 — Reprioritize V1 / 1.3.10 → V1 / 1.3.17

Human decision: bắt đầu promote milestone hiện tại để carousel chạy ổn định.

- Mốc mới: **V1 / 1.3.17 — Product/Post Carousel Stability & QA**, IN PROGRESS; stack ref M1, roadmap 039.
- Mốc cũ **1.3.10 — Fullscreen Step Slider: DEFERRED**, chưa bắt đầu/chưa hoàn thành. Đây là lịch sử đổi ưu tiên, không phải completed milestone.
- Scope/checklist 1.3.10 giữ nguyên tại `.context/MILESTONES.md` §1.3.10; planning 018 và decision fullscreen-step-slider-1.3.10 vẫn giữ truy vết. Nơi nhận tương lai: stack M5, chưa gán version mới.
- Không có RESOLVED_ACTIVE tension nào mang milestone 1.3.10; không move tension thuộc milestone khác. OPEN tensions giữ nguyên, không tự resolve QA debt.
- Không QA PASS, release approval hay metadata bump trong chat planning này. Muse thực thi, human kiểm chứng onsite.
## V1 / 1.3.18 — Product/Post Carousel Editor UX & Technical (stack: M1 follow-up)

Status: **DEFERRED_WITH_CARRY_OVER**
Onsite checkpoint **2026-11-04**: human báo Carousel cơ bản có thể sử dụng, yêu cầu chuyển phần chưa kiểm sang milestone kế và hoán đổi Sidebar/Hero. **Phần acceptance còn thiếu của 1.3.18 → Deferred, đích nhận 1.3.19** theo register carry-over trong section 1.3.19; giữ PASS và IDs/evidence đã có, không suy rộng Technical PASS. Chưa đóng/chuyển current 1.3.18; runbook `docs/testing/carousel-editor-ux-technical-1.3.18.md` là checklist gốc cần chạy tiếp.
Started: **2026-10-19**, human chuyển current từ 1.3.17 sau khi approve 1.3.17 onsite.
Confirmed: **2026-10-14**, human xác nhận "semver + 1" sau current 1.3.17, dành Editor UX và Technical.
Version check: không thấy 1.3.18 được dùng/reserved trong AGENTS/.context/docs trước khi ghi.
SemVer rationale: PATCH tiếp thep cho sửa/hardening collection hiện có cùng minor 1.3; không phê duyệt feature architecture mới.
Planning reference: `planning/045_VER_1_3_18_CAROUSEL_EDITOR_UX_TECHNICAL_EXECUTION_PLAN.md` — file đã tồn tại; human yêu cầu lập chi tiết ngày 2026-10-20, §9–13 chia 7 hệ thống và gói P0–P6, requirement/evidence giữ ID cũ. Runbook: `docs/testing/carousel-editor-ux-technical-1.3.18.md`. Đây là planning, chưa bắt đầu implementation Editor UX.

Override human 2026-10-20: không sửa skeleton trong đợt Editor UX này, không triển khai skeleton toàn trang. Giữ debt test D dưới đây và báo cáo chớp khi load là chưa giải quyết, không tự PASS/xóa acceptance. Arrow centering đã sửa source riêng, chờ onsite theo `docs/testing/carousel-arrow-centering-1.3.18.md`.

Scope: nhận **Deferred UX-01–08, UX-02a, TECH-01–11, TECH-08a** theo 040 §11.1; TECH-10/11 chia verification theo từng version. Giữ toàn bộ source defects và acceptance cũ trong mapping.

Carry-in từ 1.3.17 (human chốt 2026-10-19):
- **Xác minh lại gói C** sau bản sửa state owner (regression scrollbar ngang) — hiện **Chờ kiểm chứng**.
- **Gói D skeleton** — source đã có 2026-10-19, chưa build/lint/onsite; cần test D-01…D-08.
- **Post Carousel visual** — human duyệt riêng.
- **Controls** — quyết định hide/disabled và placement.
- **G-MEDIA** — chọn/lưu ba media layouts + cơ chế legacy.
- **Editor preview theo 040 §13** (UX-09/10/11, TECH-12); artifact prototype 172/172 PASS không phải nghiệm thu editor thật.

Acceptance carry-in:
- [ ] Controls có tác dụng, labels/defaults/query/preview/save-reload parity (UX IDs).
- [ ] Preset + bounded controls + reset rõ; truthful preview/help, không Swiper/autoplay editor.
- [ ] Query/render/actions/context, valid markup/security, keyboard, pause/autoplay/reduced-motion, loop/count/resize đúng (TECH IDs).
- [ ] Legacy ratio mechanism/tương thích old/new Product/Post được quyết và kiểm; không tự ép content cũ.
- [ ] Grid/editor compatibility, lifecycle/memory/assets/build và full evidence theo 040 §11.1.
- [ ] Editor preview 040 §13: card mẫu gọn, cấu hình label–value, grid query 3/2/1 + Xem thêm/Thu gọn, khung width editor-only.
- [ ] Xác minh lại C + D onsite (bằng chứng có trong repo).
- [ ] Human nghiệm thu sau kiểm chứng.

Metadata: bump **1.3.17** đã chạy cho release boundary; bump sang 1.3.18 chỉ khi human ra lệnh bắt đầu implementation 1.3.18. M1 gồm 1.3.17 + 1.3.18; UI PASS không phải toàn bộ Technical PASS. Quote Flow vẫn sau visual gate, bắt đầu M2 cần quyết định riêng.


Transition 2026-11-04: human yêu cầu agent Sol bắt đầu 1.3.19 theo plan 048. Chuyển ưu tiên, không completion/PASS. Toàn bộ checklist chưa tick giữ nguyên; Carousel thiếu evidence nhận tại carry register 1.3.19, E02 giữ PASS. Loading/navigation 046 vẫn scope 1.3.18: b9332d3 + source execution §11, 8 VM tests PASS, build/lint/onsite LDR-01–09/UXHF-01–10 chưa kiểm; không nhập acceptance vào Sidebar, không sửa skeleton.
