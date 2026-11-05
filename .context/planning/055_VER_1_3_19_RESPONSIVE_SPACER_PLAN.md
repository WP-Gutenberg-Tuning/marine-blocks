# Responsive Spacer — detailed plan

Ngày: **2026-11-05**. Status: **Đã có source / Chờ kiểm chứng onsite**.
Human duyệt thực hiện plan và commit trong milestone hiện tại ngày2026-11-05. Scope bổ sung vào **V1 / 1.3.19 — Plugin Design Sidebar Foundation** theo chỉ thị rõ, không mở/chuyển milestone hoặc bump metadata. Commit prefix human chọn: `feature patch:`.
Version rationale: đây là feature mới, thông thường tăng MINOR; human xác nhận ngoại lệ bổ sung vào development milestone1.3.19 hiện hành. Không chiếm các scope đã dành1.3.20–23,1.4.0–3,1.5.0/1.5.3,1.6.0/1.7.0; không đổi Version Naming Rule hoặc release status. Đoạn Future Candidate/TBD của planning checkpoint được thay bằng quyết định này.

## 1. Mục đích, rationale và phạm vi

Tạo khoảng trống dọc giữa các section với giá trị Desktop / Tablet / Mobile, chỉnh trực quan trong Gutenberg. Case tham chiếu: screenshot human ngày 2026-11-05, Hero sát Category Grid và các Collection sát nhau. Screenshot là evidence của nhu cầu thị giác; chưa có URL/DOM để kết luận CSS owner hoặc đo khoảng cách hiện tại.

So sánh đã trao đổi:

- Core Spacer phù hợp chèn nhanh khoảng trống; hướng ở đây cần thêm responsive values và editor frame thống nhất.
- Margin đi cùng section thuận tiện khi reorder, nhưng một hệ margin riêng trên mọi block sẽ mở scope controls/cascade rộng hơn.
- Parent block gap phù hợp nhịp đều; section padding phù hợp khoảng đệm có nền. Responsive Spacer là công cụ cho khoảng trống được tác giả đặt rõ vị trí, không thay thế cả hai cơ chế đó.

Scope: một block utility riêng, responsive height, editor frame, persistence qua Page Save/Undo, CSS frontend không cần JS. Không tự chèn vào trang cũ, không sửa margin mọi block, không extend core/spacer, không thay đổi theme layout hoặc chạy migration DB.

## 2. Decision ledger — đã duyệt và đề xuất mới

### Human đã chốt trong chat

1. Preview dùng hệ **khung đã có**, text căn giữa, có một indicator cho giá trị spacing đang áp dụng. Không dùng nhãn nổi ngoài khung.
2. Biểu diễn chiều cao bằng **padding trên/dưới vùng text indicator**, thay cho margin.
3. Với H <= 200px: mỗi phía padding H / 2.
4. Với H > 200px: mỗi phía padding cố định 100px; indicator vẫn hiển thị H thật.
5. Frontend luôn dùng H thật, không bị cap 200px. Ví dụ 400px: editor 100 + 100px padding, indicator 400px; frontend height 400px.

### Baseline plan được human cho implementation, chưa có visual/runtime approval

- Palette mint utility tại §4; chỉ chrome editor, không màu nền frontend.
- Breakpoint, default, inheritance, numeric constraints và control location tại §5–6 nằm trong baseline plan được human cho implementation ngày2026-11-05; không suy đã runtime PASS.
- Nhãn “Preview capped at 200px” là copy đề xuất để giải thích cap, không phải thêm giới hạn dữ liệu.

### Hướng bị thay thế / không dùng

- Ba dải Desktop/Tablet/Mobile xếp chồng và có chiều cao riêng: dễ hiểu nhầm cộng dồn.
- Dải Tablet ngắn ngang hơn Desktop: dễ hiểu nhầm Spacer đổi chiều rộng.
- Nhãn nổi chỉ khi selected: không phù hợp yêu cầu khung hiện có.
- Khẳng định khung editor cao đúng H: sai vì có chrome và line-height.
- Cap spacing frontend ở 200px: trái quyết định human.

## 3. Anatomy và công thức preview

```text
┌─────────────────────────────────────────────────────────┐
│                    RESPONSIVE SPACER                    │
│        Desktop: 30px · [Tablet: 20px] · Mobile: 12px      │
│                                                         │
│           <padding-top = min(H, 200) / 2>                │
│                        ↕ 20px                           │
│           <padding-bottom = min(H, 200) / 2>             │
│                                                         │
│         Preview capped at 200px — only when H > 200      │
└─────────────────────────────────────────────────────────┘
```

Các chú thích padding không render thành text. Chỉ một khung ngoài, không panel con có border. Header/summary là phần cố định; vùng indicator là phần biến thiên. Không text editable trên canvas, không kéo resize trong phiên bản đầu.

Với H là effective spacing đã resolve cho viewport hiện tại:

```text
P = min(H, 200) / 2
indicator padding-block-start = P px
indicator padding-block-end   = P px
frontend height              = H px
```

| H | Top | Bottom | Indicator | Cap note |
|---:|---:|---:|---|---|
| 0 | 0 | 0 | ↕ 0px | Không |
| 1 | 0.5 | 0.5 | ↕ 1px | Không |
| 20 | 10 | 10 | ↕ 20px | Không |
| 30 | 15 | 15 | ↕ 30px | Không |
| 199 | 99.5 | 99.5 | ↕ 199px | Không |
| 200 | 100 | 100 | ↕ 200px | Không |
| 201 | 100 | 100 | ↕ 201px | Có |
| 400 | 100 | 100 | ↕ 400px | Có |

Khung tổng = border + chrome/padding cố định + line-height indicator + 2P + cap note nếu có. Không dùng tổng chiều cao khung làm acceptance H. Giữ line-height indicator cố định; geometry đo riêng padding của indicator. Chrome có thể wrap ở canvas hẹp và tăng chiều cao hợp lệ.

Khung vẫn hiện khi unselected, kể cả H=0 để nhận diện/chọn được như các preview khác. Selected/focus giữ native Gutenberg outline; không đổi padding để tạo hiệu ứng selection. Chữ giữa, tab order không phát sinh nút giả trên canvas. Summary không phải ba nút đổi preview riêng.

## 4. Màu và typography — utility / mint family

Spacer nhận mint nhạt để phân biệt utility với Collection Carousel xám xanh và Grid xanh biển. Đây là editor chrome, không thay palette website; không dùng gold hoặc đổ màu lên frontend spacer.

| Role | Giá trị | Quy định |
|---|---|---|
| Frame background | `#f0fdfa` | Mint rất nhạt, toàn khung |
| Frame border | `#99d5ca` | 1px solid, không shadow |
| Label / body / indicator | `#134e4a` | Đủ đậm trên nền nhạt; kiểm contrast thực tế |
| Secondary/inherited/cap note | `#3f625d` | Không dùng opacity làm mờ text |
| Current screen chip background | `#ccfbf1` | Highlight màn hình đang có hiệu lực |
| Current screen chip text/border | `#115e59` | Text semibold, border 1px; luôn kèm chữ |
| Focus/selection | Native editor focus color | Không thay bằng mint nhạt khó nhìn |

Anatomy kế thừa `.skvn-editor-preview-frame`: radius 12px, base padding 20px, box-sizing border-box. Label 11px/600/line-height 1.5 và letter-spacing 0.06em như khung hiện tại, đổi text-align center. Summary/notes 12px/line-height 1.5; indicator 14px/600/line-height 20px. Summary flex-wrap, giữ từng cặp tên/giá trị cùng nhau; không ellipsis che số. Ở 320px được xuống hàng, vẫn căn giữa.

Class/variables dự kiến trước migration: `.skvn-editor-preview-frame--spacer`, `--skvn-editor-frame-bg`, `--skvn-editor-frame-border`; block editor CSS riêng sở hữu indicator/summary/text tokens. Nếu triển khai sau migration 1.4.0 thì dùng identity mới theo plan047, không register hai namespace tùy tiện.

Trước coding, bổ sung palette/consumer vào `docs/standards/editor-preview-frame-contract.md` và file registry `docs/standards/site-branding-guideline.md` với trạng thái đúng. Không đổi palette đã duyệt của Grid/Carousel. Palette ở đây là baseline của plan, chưa phải contrast/onsite PASS.

## 5. Responsive semantics — đề xuất baseline

### Viewport, không container

Spacer đổi theo **chiều rộng viewport trang**, không theo chiều rộng cột chứa nó. Hai Spacer ở hai Columns trên cùng trang dùng cùng device tier. Width vẫn do parent/canvas sở hữu; không 100vw/margin âm.

Đề xuất khớp các ngưỡng đang có trong `src/shared/motion.ts` (không import runtime motion chỉ để lấy breakpoint):

| Tier | CSS viewport width |
|---|---|
| Mobile | < 768px |
| Tablet | >= 768px và < 1024px |
| Desktop | >= 1024px |

Dùng mobile-first CSS với min-width 768/1024 để không có khoảng hở ở fractional widths. Không per-block breakpoint trong phiên bản đầu; không thay DEVICE_QUERIES của motion ngoài scope.

### Dữ liệu và inheritance

Schema đề xuất: `desktopHeight` integer default 30; `tabletHeight` và `mobileHeight` optional integer, bỏ key nghĩa là inherit. Không lưu effective values vào ba key khi chưa có override.

```text
D = valid desktopHeight, fallback 30
T = valid tabletHeight nếu có, ngược lại D
M = valid mobileHeight nếu có, ngược lại T
```

`0` là explicit zero, không phải missing; Reset Tablet/Mobile bỏ override. Reset Desktop về 30. Clear input trong lúc gõ là state tạm local; không ghi NaN/chuỗi rỗng. Blur input trống quay về giá trị đang lưu, không tự biến thành zero. Mũi tên step 1px; số âm, fractional, chuỗi CSS, NaN/Infinity bị từ chối với help/error rõ ràng. Số hợp lệ phải là nonnegative safe integer; không đặt max=200 lên input. Giới hạn sản phẩm thực tế nếu muốn thêm sau này phải quyết riêng, không tự clamp ở preview cap.

UI dùng input số px cho utility này, theo hướng human đã chọn; không mở arbitrary CSS/unit/margin cho block khác. Đây là ngoại lệ hẹp của hướng preset spacing chung, không mở lại constraints Slider hoặc core controls.

### Editor preview owner

Nguồn sự thật của tier là viewport canvas đang render, tương ứng frontend media queries. Không lấy chiều rộng sidebar/admin window hoặc width wrapper trong Columns. Native device preview là thao tác đổi canvas; không mặc định label “Tablet” của core đồng nghĩa mọi breakpoint của plugin.

P0 phải kiểm API/public hooks thực tế trên WordPress onsite: iframe/non-iframe, native device switch, canvas resize. Ưu tiên CSS media queries trong canvas document để áp padding và chọn indicator tương ứng, chỉ một indicator có hiệu lực/đọc được ở mỗi thời điểm. Có thể dùng hook public hoặc listener matchMedia của canvas ownerWindow nếu cần state text; listener phải cleanup và không mutation/poll private DOM. Không chốt một selector experimental làm invariant trước audit.

Nếu native preset có width rơi sang tier khác, summary/indicator phải nói tier thực tế; tài liệu test ghi rõ width, không tô Tablet trong khi áp Mobile. Không có API an toàn: báo limitation và dừng phần tích hợp tương ứng, không giả lập PASS.

## 6. Controls và persistence

- Inserter title `Responsive Spacer`, description `Add vertical spacing with separate desktop, tablet, and mobile values.`; dùng category plugin hiện hành, icon arrows dọc đơn giản.
- Inspector panel `Spacing height`, ba dòng Desktop/Tablet/Mobile, hậu tố px. Tablet/Mobile có Reset và help `Inherited from Desktop` / `Inherited from Tablet` theo nguồn hiệu lực thực tế. Summary vẫn hiển thị effective số, đánh dấu inherited bằng chữ/help đọc được.
- Proposed first insert: Desktop 30px, Tablet/Mobile inherit. Fixture 30/20/12 dùng kiểm thử, không tự coi là default đã human duyệt.
- Control → attributes → canvas → Page Save → reopen → frontend phải nối xuyên suốt. Không Save riêng, không option/theme_mod/REST mới.
- Nguồn chỉnh đầu tiên là Inspector. Nếu đưa vào Selected block Design Sidebar, chỉ render cùng component controls ghi cùng attrs; không tạo draft/storage owner thứ hai. Không để selection Spacer hiện controls Collection cũ. Audit capability registry/no-selection/multi-selection trước integration; có thể dùng Inspector fallback nếu sidebar chưa consumer.
- Không expose color, typography, align, native spacing/dimensions thứ hai hoặc raw HTML chỉ để sửa utility; không tự set margin bên ngoài. Native copy/duplicate/reorder/delete/Undo/Redo giữ hoạt động.
- Không tự transform core/spacer: chuyển block đang có cần migration/transform riêng được kiểm chứng.

## 7. Frontend architecture và layout boundaries

Ưu tiên block **static**: `block.json`, `edit.tsx`, `save.tsx`, block-local normalize/types, `editor.css`, `style.css`; register JS trong `src/index.ts` và PHP block list hiện hành. Không cần thêm PHP runtime module hoặc frontend script, không Swiper/observer/motion/query.

Save một empty decorative div bằng public block wrapper API, `aria-hidden="true"`, không tabindex/role tương tác. Serialize CSS custom properties bằng giá trị normalize + px; CSS frontend scoped class áp height theo ba viewport tiers. Không serialize nhãn, indicator, frame class, màu editor, cap note hoặc preview padding. Validate save/reopen vì static markup thay đổi có thể ảnh hưởng block validation.

Frontend box: height H, padding/border/margin mặc định 0, box-sizing border-box; không background, không min-height để giữ chọn. H=0 box height 0. Không tự thêm editor frame-gap adapter vào frontend.

**Spacer height khác tổng khoảng cách hai section:** parent block gap và section margins có thể vẫn thêm bên ngoài. Không thể hứa nhập 30 thì khoảng cách hai nội dung chắc chắn là 30 trong mọi parent. Help đề xuất: `Adds this height. Parent block spacing and section margins may add extra space.` Test fixture parent gap=0 để prove H trước, rồi kiểm parent gap>0 và ghi rõ tổng. Không tự neutralize parent gap bằng margin âm hoặc global selectors. Author chọn một owner cho nhịp section.

Trong editor, xem adapter khoảng hở tối thiểu10px của frame053 có áp cho Spacer hay không. Nếu dùng, phần bổ sung chỉ là editor chrome; không cộng vào H và không biến indicator padding thành max-gap correction. Kiểm hai Spacer liền nhau và Spacer cạnh Collection/Group, không sửa helper chung nếu chưa có evidence.

Assets: CSS spacing frontend phải hoạt động khi không theme/WindPress và khi JS tắt; conditional load theo block khi pipeline cho phép. CSS khung phải tới đúng editor document, không chỉ tồn tại trong extracted bundle. Không enqueue toàn JS plugin chỉ để Spacer frontend hoạt động. P0 chọn enqueue path theo bootstrap thật; nếu thêm require/include mới thì cập nhật deploy packaging và audit runtime file theo workflow.

## 8. Thứ tự implementation khi đã có version/start

| Phase | Công việc và file dự kiến | Exit evidence |
|---|---|---|
| P0 — audit/gate | Xác nhận version/start, namespace theo thời điểm; audit PHP register list, build metadata copy, editor stylesheet handle, canvas device APIs, sidebar capability | Inventory file:line + screenshot/viewport fixture; không dựa riêng docs latest |
| P1 — data/frontend | Tạo `src/responsive-spacer/` schema/normalization/save/style; JS/PHP registration | Serialized fixture, effective height ở 0/20/200/400 và breakpoint edges; JS-off |
| P2 — controls | Inspector shared component, inherit/reset/validation, Page Save/Undo, sidebar target guard | Video controls→save/reopen→frontend, no stale selection |
| P3 — frame/palette | Spacer variant shared frame, centered summary, indicator P formula/cap note, scoped editor CSS | Computed padding + palette screenshot 320px/desktop; frame-gap regression |
| P4 — QA/handoff | Runbook tests, build/lint human, artifact audit nếu có PHP runtime include | Evidence theo §9; không suy build PASS là runtime PASS |

Không thay nhiều consumer chung chỉ để thêm utility. Nếu đổi shared frame CSS/helper, regression bắt buộc Collection Grid/Carousel + Category. Registry palette cập nhật cùng lượt source. Work có thể vượt3–5 file do thêm block, registration và docs; ghi rõ lý do trong execution record.

## 9. Acceptance register

Execution2026-11-05: source rows dưới đây chưa là runtime PASS. RS-UI-01–03, RS-UX-01–05, RS-TECH-01–02 **Đã có source / Chờ kiểm chứng onsite**; RS-TECH-03 chờ browser regression, RS-TECH-04 chờ human build/lint/artifact. RS-TECH-01 có model test mô phỏng PASS phạm vi §12, chưa static-block validation trong WordPress.

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence cần thu |
|---|---|---|---|---|---|---|
| RS-UI-01 | Block UI | H đúng theo viewport, gồm0 và >200 | Đã có source | Kiểm frontend CSS/schema | Đo box ở767/768/1023/1024 và widths lẻ | Rect + computed height, URL/build |
| RS-UI-02 | Block UI | Decorative/invisible, JS-off, không overflow | Đã có source | Kiểm wrapper/scoped styles | JS off, scrollbar, Group/Columns, theme khác | DOM/scrollWidth + screenshot |
| RS-UI-03 | Block UI | Không giấu ảnh hưởng parent gap/margins | Đã có source | Kiểm help + layout ownership | Parent gap0/24; hai Spacer liền nhau | Height từng box và gap thật |
| RS-UX-01 | Editor UX | Một frame, text giữa, palette mint, đọc được ở320px | Đã có source | Kiểm editor variant/CSS | Selected/unselected/focus/zoom200% | Screenshot + contrast measurements |
| RS-UX-02 | Editor UX | Padding=min(H,200)/2; số thật; cap chỉ khi>200 | Đã có source | Kiểm preview resolver/render | 0/1/20/30/199/200/201/400 | Computed padding + text |
| RS-UX-03 | Editor UX | Native device switch/resize áp đúng canvas tier | Đã có source | Kiểm canvas ownerDocument | iframe/non-iframe supported, Columns hẹp | Width/matched tier/indicator video |
| RS-UX-04 | Editor UX | Inherit/reset khác0, keyboard và errors rõ | Đã có source | Kiểm controls/normalization | Reset chuỗi, zero, invalid, keyboard | Attr snapshots + recording |
| RS-UX-05 | Editor UX | Selection/Undo/save/reopen giữ đúng block | Đã có source | Kiểm Inspector wiring | Duplicate/reorder/delete/multi-select | Video + saved content |
| RS-TECH-01 | Technical | Static save validation, type-safe effective values | Đã có source | Kiểm schema/normalize/save | Parse/serialize/reopen, malformed fixture | Test output + no invalid block |
| RS-TECH-02 | Technical | Assets đúng scope, no JS runtime/new dependency | Đã có source | Kiểm registration/enqueue | Network/iframe loaded CSS; no-Spacer page | Handles/network + source inventory |
| RS-TECH-03 | Technical | Frame regression không ảnh hưởng consumers cũ | Chờ kiểm chứng | Browser regression ngoài VM | Collection/Category + adjacent frames | Before/after rect/screenshots |
| RS-TECH-04 | Technical | Build/lint/artifact hợp lệ | Chờ kiểm chứng | Human checks/deploy inventory | Build/lint và package audit nếu áp dụng | Exact output + build/zip ID |

Test runbook: `docs/testing/responsive-spacer-1.3.19.md`. Evidence phải ghi tier, width, attrs, build/commit, URL, expected/actual. Không PASS từ mô phỏng thuần hoặc screenshot editor đơn lẻ.

## 10. Source evidence và references

- `src/shared/editor-preview-frame/style.css`: khung hiện tại radius12/padding20, label, Grid variant; `docs/standards/editor-preview-frame-contract.md`: palette family và minimum-gap semantics.
- `src/shared/motion.ts`: viewport tiers768/1024 đã có cho motion; chỉ tham chiếu ngưỡng, không đổi ownership runtime đó.
- `src/index.ts`, `skvn-marine-blocks.php`: JS/PHP registration và enqueue paths hiện có. `package.json`: version1.3.19, @wordpress/scripts ^30.6.0, TypeScript ^5.6.3; không pin WordPress runtime version. P0 phải ghi onsite WordPress version và public API availability trước premise implementation.
- [WordPress block edit/save API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/): public wrapper/save lifecycle; static block approach là proposal của plan.
- [WordPress core/editor data](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/): có selector getDeviceType trong docs hiện tại; chưa chứng minh availability/width mapping trên onsite. Không dùng latest docs thay kiểm major/runtime thật.
- `docs/standards/css-layout-safety-contract.md`, `docs/standards/block-ui-editor-ux-technical-review-contract.md`, plan047 migration và plan053 frames là constraints liên quan.

## 11. Giới hạn và bước tiếp

User duyệt implementation trong current1.3.19 và commit; không chuyển current/archive acceptance. Source không phải onsite/release PASS. Build/lint/deploy vẫn do human theo project protocol.

## 12. Execution record — 2026-11-05

- Block `skvn-marine/responsive-spacer` static, schema/normalize/save/controls/viewport/editor CSS trong `src/responsive-spacer/`; desktop default30, optional Tablet/Mobile, zero khác inherit. Chỉ native Inspector; Design Sidebar xử lý như unsupported và hướng về Block settings, không hiện controls Collection cũ.
- `src/index.ts` + PHP block list register block. Metadata `style` tham chiếu handle `skvn-marine-responsive-spacer`; PHP register `assets/css/responsive-spacer.css` bằng filemtime. Frontend không có JS runtime; assets folder đã thuộc deploy/zip path hiện hành. Không thêm runtime PHP require/include.
- Editor CSS basename `style.css` được import vào entry hiện hành, PHP cấp editor_style_handles đúng `skvn-marine-blocks-editor`; không sửa shared frame CSS/helper. Shared frame hook dùng cho minimum editor gap, tách khỏi H.
- Viewport hook dùng matchMedia của ownerDocument.defaultView, cleanup hai listeners; breakpoints768/1024. Iframe preview source đã nối; non-iframe native preview phụ thuộc viewport document thực tế, chưa có onsite evidence. Không giả định preset label bằng breakpoint; runbook kiểm actual width.
- `node --test --experimental-test-isolation=none tools/tests/responsive-spacer.test.mjs tools/tests/editor-preview-frame.test.mjs`: **13/13 PASS**, gồm5 Spacer model/viewport/CSS-contract tests +8 shared frame simulated geometry/lifecycle regression. Lệnh test isolation mặc định bị sandbox `spawn EPERM`; đổi sang cùng tiến trình chạy thành công. Không phải browser geometry, asset delivery hoặc WP serialization PASS.
- Chưa chạy build/lint/packaging hoặc onsite; không chỉnh generated build files bằng tay. Human build trước sử dụng block/zip. New block metadata chỉ xuất hiện trong build sau human build.
- Task cần hơn3–5 files vì thêm block hoàn chỉnh (schema, controls, save, CSS, viewport), JS/PHP registrations, tests và context/standards/runbook; không mở consumer/theme ngoài scope.
