# Editor preview frames — rollout plan

**Concept01 fidelity2026-11-09:** human nhận mẫu Slider làm reference và yêu cầu bám artifact; [062](062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md) là contract đối chiếu cho P3/EF-SLIDER, không đổi Step scope. Frame fill/border của Concept01 là baseline review của Slider; không tự bỏ/đổi palette, không promote thành token toàn theme. AF01–10/evidence actual editor bắt buộc; design reference không runtime PASS.

**Scheduling amendment2026-11-09:** human đưa **Slider Editor UI Redesign vào1.3.21**, cùng Hero contrast;044§10 giữ scope/SED acceptance. P3/EF-SLIDER và phần Slider EF-06 nhận tại1.3.21, chưa thiết kế/palette/coding/start. Audit canvas/chrome và tổ chức controls Slider/Slide. Step Slider giữ1.3.24, EF-STEP/Step acceptance không chuyển sang1.3.21. Current1.3.20; các current cũ dưới đây là checkpoint lịch sử.

Ngày: 2026-11-05. **Human approved planning/documentation; chưa triển khai khung chung.** Current vẫn V1 / 1.3.19. Không bump/build/chuyển milestone trong lượt docs này.

## Execution override — 2026-11-05

Verification: `node --disable-warning=ExperimentalWarning tools/tests/editor-preview-frame.test.mjs` **8/8 PASS** trên actual hook với VM mocked DOM geometry: gap0/8/24, collapsed margin convergence, parent gap change, horizontal siblings, previous removal/reorder targets, cleanup/rAF/style restoration. Đây không phải real browser/WordPress geometry. Agent review không thấy blocker; TSX/CSS parse không thay full typecheck/build.

Human yêu cầu “bám vào và thực hiện, đồng thời đưa agent commit”. P1/P2 đã có source: shared editor-only frame CSS + spacing hook, nhãn cho Product/Post Collection Carousel/Grid và Category Grid; heading/intro Collection thuộc root frame; bỏ nền/viền của khung body bên trong. Grid dùng #eff8fc/#c9e3ef; Carousel #f6f8fa/#dce4e9. Collection overview giữ card mẫu + summary/query/states/footer, Post note giữ giới hạn5 kết quả. Category notices nằm trong root, không thêm content/schema mới.

P0 source audit: Collection `useBlockProps` section sở hữu frame/alignment, Category `useBlockProps` div sở hữu frame và `CategoryGridPreview` sở hữu inner grid; các field/sidebar dùng Inspector riêng. Hook đo border rect trên actual block root + previous sibling frame trong cùng parent, thêm tối đa10px phần thiếu qua inline editor margin; không thêm khi gap đã đủ, bỏ correction khi reorder hoặc parent gap tăng, không đẩy hai frame nằm cạnh nhau ngang. Resize/parent child-list/parent attrs được observe và cleanup. Không đoán private Gutenberg wrapper selector; frame không serialize. **Đã có source, còn cần onsite proof cho parent layout và gap**; custom overlapping/positioned layouts nằm ngoài cap10, không che bằng overflow.

EF01–05 / EF-CAR-P, EF-GRID-CAT, EF-GRID-P, EF-CAR-POST, EF-GRID-POST: **Đã có source / Chờ kiểm chứng**, chưa PASS. Source syntax/CSS parse kiểm tĩnh; VM spacing tests do agent bổ sung và ghi output khi commit. Build/lint/onsite vẫn do human. Các dòng “chưa làm/chưa code” trong inventory dưới là snapshot trước execution override này, không gate hỏi lại.

P3 audit source: Slider `src/slider/edit.tsx` có root tại useBlockProps, Add toolbar, stacked InnerBlocks và static navigation; variations Hero/Product Showcase/Card Carousel ở `src/slider/variations.ts`. Chưa đổi source/palette Slider vì cần mockup riêng. P4: inventory src/index.ts + src không thấy step-slider/step-slide registration/source; MILESTONES1.3.10 và roadmap039 giữ deferred→M5. Không có runtime Step Slider để skin trong lượt này; mapping/version và thiết kế vẫn pending. Runbook: `docs/testing/editor-preview-frames-1.3.19.md`.

## 1. Quyết định và nguồn

Human duyệt đề xuất sau screenshot Product Carousel: đưa Featured products/optional intro vào cùng khung, một khung ngoài, Carousel giữ nền xám xanh hiện tại, Grid xanh biển nhạt, nhãn loại block và khoảng cách dọc giữa khung. Sau đó yêu cầu lập plan vì mới chỉnh hai surface và sẽ còn chỉnh Slider/Step Slider. Contract: `docs/standards/editor-preview-frame-contract.md`. Plan052 tiếp tục sở hữu phần card trái / summary-query phải; không bị thay bởi tài liệu này.

Phạm vi “hai surface đã chỉnh” là Product Carousel canvas presentation và Category Grid controls/width. Không được hiểu cả hai đã có khung/chrome mới hoặc đã nghiệm thu. Source/evidence inventory bên dưới là baseline, không lời hứa runtime PASS.

## 2. Inventory / rollout register

| ID | Consumer | Baseline | Công việc còn lại / trạng thái |
|---|---|---|---|
| EF-CAR-P | Product Collection / Carousel | plan052 đã có source: card trái, summary/query phải, note footer; heading/intro vẫn ngoài khung | Chưa làm khung chung: đưa heading/intro vào, nhãn loại, dời màu/viền ra khung ngoài, spacing; CP01–05 vẫn chờ onsite |
| EF-GRID-CAT | Product Category Grid | Có source number controls cùng hàng + Wide default; chưa có preview frame theo family | Chưa làm: khung xanh nhạt, nhãn, spacing; không thêm heading attribute nếu block không có heading/intro; giữ picker/details/editor notices |
| EF-GRID-P | Product Collection / Grid | Dùng chung Collection editor nhưng plan052 chỉ áp Product Carousel | Chưa làm: audit card/info/query inventory, áp frame Grid mà không ép thành carousel |
| EF-CAR-POST | Post Collection / Carousel | Chưa áp presentation052; có acceptance Post riêng | Chưa làm: audit preview Post rồi áp frame Carousel; không tự dùng dữ liệu/specs Product |
| EF-GRID-POST | Post Collection / Grid | Chưa áp frame mới | Chưa làm: frame Grid và thông tin Post; giữ date/author/excerpt/category/action consumers |
| EF-SLIDER | Slider / Hero và variations liên quan | `src/slider/edit.tsx`, `src/slide/`; editor có own wrappers/chrome/InnerBlocks | Chưa làm: audit từng variation, vẽ preview, chốt màu Slider; không đổi frontend/Swiper/height/autoplay |
| EF-STEP | Step Slider | Existing plan018 scope1.3.10 deferred → roadmap039 stackM5 | Chưa làm: audit runtime/source owner và mapping version trước triển khai; preview/interaction/màu chưa chốt, không coi là một block mới đã register |

Grid/Carousel là họ màu dùng chung Product/Post; Slider/Step Slider chưa gán palette, không tự tạo màu mỗi block. Không reopen Category Floating hoặc query ownership trong plan này. Category breakpoint theo màn hình vẫn pending riêng, không phải task frame.

## 3. Các gói thực hiện

1. **P0 — Audit chrome/spacing:** inventory root wrapper/heading/intro/preview/editor notices/InnerBlocks của từng consumer; xác định parent blockGap/margins, width owner, selectors và controls hit area trên WordPress onsite. Output bảng owner + screenshot/rect baseline. Đặc biệt không áp margin5px global. Chốt cơ chế đạt gap tối thiểu10px, không double gap parent.
2. **P1 — Hai consumer đầu:** Product Carousel + Product Category Grid theo contract. Một khung root chứa toàn bộ nội dung của block; Category không tự được thêm heading/intro mới. Màu nền/viền editor-scoped bằng tokens có thể tái dùng; giữ native attrs/Page Save/Undo. Runbook + source checks + onsite trước khi gọi PASS.
3. **P2 — Các Collection còn lại:** Product Grid, Post Carousel, Post Grid. Audit thông tin và states trước reuse wrapper; reuse chrome có >=2 consumers, không tạo query/store framework mới. Kiểm hồi quy P1 khi đổi shared CSS.
4. **P3 — Slider:** vẽ và duyệt preview riêng theo variation; quyết màu trước coding. Bảo toàn Add Slide/List View/selection/focus/IME/stacked edit, arrow preview và giới hạn slides theo các contract đang có. Không đẩy acceptance Hero contrast/parallax vào đây rồi đánh dấu hoàn thành.
5. **P4 — Step Slider:** đọc plan018/roadmap039 và source tương ứng, làm rõ implementation/version hiện hành; đề xuất canvas + trạng thái step active/inactive/empty, nhãn giới hạn static preview, keyboard/editing. Chỉ triển khai khi scope/SemVer đã được human xác nhận theo AGENTS. Không tự phục hồi milestone1.3.10 hoặc mở fullscreen runtime.

P1/P2 thuộc follow-up preview hiện có, cần lệnh triển khai sau lượt docs này; chưa có source khung chung. P3/P4 là planning follow-up, chưa phải approval coding toàn bộ Slider/Step Slider. Không tự gán version mới; các quyết định version cũ giữ nguyên.

## 4. Requirement / acceptance register

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| EF-01 | Editor UX | Heading/intro và preview chung một frame, nhãn type rõ | Chưa làm | Move chrome boundary, giữ native content editing | RichText/toggle/selection/Undo/save-reopen | Source hiện tại controls.tsx; screenshot human thấy heading ngoài frame |
| EF-02 | Editor UX | Palette theo family, nhẹ và không tint card | Chưa làm | Carousel #f6f8fa/#dce4e9; Grid #eff8fc/#c9e3ef | Đặt hai family cạnh nhau; dark/light card fixtures, contrast/focus | Contract palette approved; runtime pending |
| EF-03 | Technical | Hai frame kề có gap thực tế >=10px, không cộng parent gap | Chưa làm | Audit owner/adapters P0; tránh global margin | Parent gap0/8/24px, root/nested, rect/margin/gap | Chưa có geometry; không hardcode selector trước audit |
| EF-04 | Editor UX | Tận dụng rộng, stack hẹp, không mất info/states | Source052 chỉ Product Carousel; khung mới chưa làm | Reuse presentation theo inventory, giữ disclosures/notes | >760/760/520/320px; title dài/image off/error/empty/max items | CP01–05 giữ acceptance cũ, chưa PASS |
| EF-05 | Technical | Không đổi frontend/query/storage/runtime | Chưa làm cho frame | Editor-only scope/schema unchanged | Diff + frontend regression cùng fixture/build | N/A runtime cho lượt docs; implementation phải chứng minh |
| EF-06 | Editor UX | Slider/Step chrome giữ Add/selection/keyboard/IME | Chưa audit | P3/P4 riêng, màu/mockup chờ chốt | List View/Add/delete/undo/focus/mobile editor | Existing slider chrome docs là baseline, chưa evidence mới |

Block UI frontend: không thiết kế lại, acceptance là không regression. A11y/responsive/performance áp vào từng hàng: nhãn chữ không chỉ màu; no focus clipping; nested layout/scrollbar; không thêm request/runtime vì chrome.

## 5. Evidence và documentation trước mỗi implementation

- Runbook ghi target URL/editor/page ID/build/browser/WP, setup fixtures, steps, expected, pass/fail, screenshots/console/geometry. Product `/home/` có HTML/screenshot human; Slider/Step URL chưa xác nhận, điền khi có target, không lấy local thiếu content làm source failure.
- Product Carousel tiếp tục `docs/testing/carousel-editor-ux-technical-1.3.18.md` CP01–05 trong current1.3.19. Category tiếp tục `docs/testing/product-category-grid-1.3.20.md`. Slider/Step bổ sung runbook phù hợp khi scope triển khai đã xác định; không tự ghi PASS.
- Build/PHP lint do human chạy theo AGENTS. Metadata không bump do thay tài liệu. Không code/artifact/build/commit/deploy trong lượt planning này.

## 6. Các quyết định còn mở

Không còn cần duyệt lại palette Collection/Grid hoặc nguyên tắc một khung. Còn cần audit spacing adapter (technical, không hỏi human đoán selector), thiết kế/palette Slider và Step Slider, inventory/version mapping Step Slider trước coding. Các lựa chọn trực quan Design Sidebar bằng SVG/CSS là scope khác; không mặc nhiên triển khai cùng frame.
