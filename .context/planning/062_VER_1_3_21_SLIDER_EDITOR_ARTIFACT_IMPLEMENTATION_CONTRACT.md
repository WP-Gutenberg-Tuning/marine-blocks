# 1.3.21 — Slider Editor: contract bám artifact Concept 01

**Execution companion2026-11-09:** đọc [063](063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) để thực hiện contract này: P0 tagged-runtime APIs, P1 native proof, P2–P5 layout/states/Inspector/assets/evidence; [runbook](../../docs/testing/slider-editor-ui-1.3.21.md).063 không thay AF01–10/hash hoặc cho phép redesign; chưa coding/start1.3.21. Handoff§7 phải kèm063.

Ngày2026-11-09. **Reference accepted for implementation planning; chưa coding/start hoặc runtime PASS.** Current vẫn1.3.20. Human đã xem artifact, nói “Good” và yêu cầu có cách bảo đảm implementation bám theo mẫu. Đây là ràng buộc implementation/review của scope1.3.21 đã nhận, không tạo version hoặc đổi current.

## 1. Canonical reference và thứ tự áp dụng

- Artifact: [slider-editor-redesign-prototype.html](../../docs/artifacts/editor-ui/slider-editor-redesign-prototype.html).
- Ghi chú/phạm vi: [prototype notes](../../docs/artifacts/editor-ui/slider-editor-redesign-prototype.md).
- Revision: **Concept01 / 2026-11-09**.
- SHA-256 của HTML đã giao human: `5B938946C253E36E9F73D35C817C2FBF1F5F9F65375DE9A7D4A04853E2C352EF`.
- Spec/mapping: [044§10](044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md), frame rollout [053](053_EDITOR_PREVIEW_FRAMES_ROLLOUT.md), milestone ledger MILESTONES.md §1.3.21.

Agent phải đọc **HTML/CSS/JS thực** của artifact và contract này trước coding/review, không chỉ đọc bản tóm tắt trong chat. Khi bắt đầu implementation ghi hash đã đọc vào execution ledger và handoff; nếu hash khác, xác định revision/decision thay đổi trước khi dùng làm baseline. Không sửa artifact cho giống implementation rồi gọi đó là match.

Quyết định mới rõ ràng của human ưu tiên; contract này cụ thể hóa phần cần giữ; artifact là chuẩn hình ảnh/hành vi ở phần được map bên dưới; prototype scaffolding không được vượt invariants native Gutenberg/security/a11y/data. Nếu mapping xung đột kỹ thuật thực sự, trình evidence và phương án thay đổi có hình minh họa, giữ baseline cũ đến khi human quyết; không âm thầm đơn giản hóa thiết kế.

Artifact cần có trong Git/handoff cùng contract. `.gitignore` chỉ mở riêng HTML và notes của Concept01, không mở toàn bộ artifacts. Chưa commit không được nói checkout khác đã nhận file; trước bàn giao branch/commit phải kiểm `git ls-files` có cả hai file và links/hash đúng. Lượt này không tự stage/commit/push.

## 2. Phần phải bám — traceability matrix

**Current execution:** human xác nhận P1 “Đã test, đúng UX”; P2/P3 source map AF01–10 thực tại **063§13**, runbook§0. Canvas/rail/metadata/navigation/CSS/enqueue đã nối source, P1 gate/harness retire. Bảng dự kiến/Chưa làm và checkpoint default-off dưới đây là baseline lịch sử, superseded về source status; full actual fidelity/native acceptance vẫn Chờ kiểm chứng, không PASS từ code. Canonical HTML/hash giữ nguyên, cần paired images sau build.

Execution2026-11-09: human “Tiến hành” start063 P1; AF04 có native feasibility source default-off qua URL `skvn-slider-editor-proof=1`, mapping063§12/runbook§2.1. Chưa actual native proof; các AF layout/thumb/footer/labels còn chưa làm. P1 numbered switcher là harness, không thay accepted Concept01 hoặc final AF02/03/05. Bảng Chưa làm bên dưới giữ trạng thái full implementation; không đổi artifact/hash để khớp harness. P2/P3 chờ N01–03 và onsite API baseline.

Tất cả implementation/evidence hiện **Chưa làm**. Cột source phải được agent điền **file:symbol** khi thực hiện; không đánh PASS bằng việc có tên file trong bảng.

| ID | Nhóm / anchor artifact | Bắt buộc giữ | Source dự kiến / trạng thái | Cách kiểm / evidence |
|---|---|---|---|---|
| AF01 | Editor UX; `.editor-frame`, `.frame-header` | Một khung ngoài có nền/viền, nhãn loại Slider, trạng thái số slide; không bỏ frame/background hoặc tạo khung riêng quanh mọi Slide | `src/slider/edit.tsx` + editor CSS/enqueue; Chưa làm | Paired screenshots có/không selection, loaded stylesheet + root DOM |
| AF02 | Editor UX; `.workspace`, `.slide-rail`, `.stage-column` | Desktop danh sách trái, một vùng chỉnh slide phải, active rõ; dùng chiều rộng canvas, không quay lại xếp tất cả slides dọc như kết quả redesign | Slider/Slide editor native-selection adapter; Chưa làm | Matched-width screenshots + rail/stage/root rect |
| AF03 | Editor UX; `.slide-list`, `.slide-row` | Thumbnail nhỏ + số + title, rail có chiều cao giới hạn/cuộn riêng;10items không làm khung cao theo10items; active item được đưa vào vùng nhìn thấy sau chọn/thêm | Native block tree-derived list, no snapshots/store song song; Chưa làm | 1/3/10 items, select via rail/List View, scrollTop/row bounds, keyboard |
| AF04 | Editor UX; `#scene`, `#editing-title` | Một editing target rõ, content native chỉnh trực tiếp; đổi selection giữ nội dung chưa Save/focus/IME/history; không dùng ảnh chụp hoặc clone HTML thay native blocks | `src/slider/edit.tsx`, `src/slide/edit.tsx`; feasibility proof trước rollout; Chưa làm | Native typing/IME, switch and return, Undo/Redo/save/reopen; video + saved content |
| AF05 | Editor UX; `.navigation-row`, `.nav-example` | Footer ngoài vùng cuộn: Arrow sample trái, Add giữa, Pagination sample phải ở wide canvas; không bị đẩy theo độ dài rail | Editor-only presentation/control mapping; Chưa làm | Paired shots/rect 3groups,10items và long content |
| AF06 | Editor UX; `.nav-caption` | Dòng `Arrow Style: <value>`, `Position: <value>`, `Pagination Indicator: <value>`, `Position: <value>`; label/value cùng dòng khi đủ chỗ, không đổi thành Previous/Next/Editing slide | Real attrs → static samples/captions, English/i18n; Chưa làm | Change each existing setting, compare name/value; screenshot + attrs |
| AF07 | Editor UX; `#arrow-sample`, `#pagination-sample` | Samples tĩnh theo style thực; không phải nút đổi editing target, không autoplay/timer animation. Timed styles minh họa trạng thái tĩnh; position caption phản ánh setting, không ép sample strip đến vị trí đó trên canvas | Existing navigation attrs, no Swiper editor; Chưa làm | DOM/events/runtime audit, changed attrs render matching samples |
| AF08 | Editor UX; `#add-slide`, `.add-group` | Add slide ở giữa footer; thêm/chọn slide mới; focus vào nội dung editable phù hợp. Limits hiện hành giữ, disable kèm lý do khi đạt max | Existing Add API/limit policy; Chưa làm | Hero3→5 và disabled; default10→11; focus/List View/history |
| AF09 | Editor UX; `.mobile-picker`, media queries | Canvas hẹp chuyển rail thành selector gọn phía trên, không mất active state; footer reflow giữ đủ nhóm/labels/Add | Editor-container-responsive adaptation, not outer viewport alone; Chưa làm | Narrow editor do Sidebar/Columns và mobile viewport; root/parent rect, focus, no overflow |
| AF10 | Editor UX / Technical; CSS baseline | Giữ visual hierarchy/spacing/rail-stage proportions/frame candidate của Concept01; không thay palette/layout một cách không báo. Assets phải thực nạp trong editor, không chỉ có trong build | Scoped editor styles/registration; Chưa làm | Paired shots + computed styles/network; source mapping và diff explanations |

AF-* bổ sung, không thay SED-*/HERO-*/EF-06. AF04/08 cũng áp Technical/native API; Block UI frontend không đổi do redesign, SED-UI01/HERO-* vẫn kiểm riêng. Bảng này không cho phép bỏ yêu cầu native List View/reorder/delete/duplicate chỉ vì sample HTML chưa vẽ các action đó; ưu tiên native toolbar/List View ngoài working frame khi phù hợp, mapping phải ghi rõ.

## 3. Thông số tham chiếu và adaptation

Đây là **giá trị baseline từ artifact**, không tự khóa pixel chiều cao nội dung Hero thật:

- Frame fill `#f4f5fc`, border `#d9dcef`, radius14px, padding22px ở wide; candidate palette nay là mốc so ảnh Concept01, chưa biến thành token/theme-wide option. Không tự bỏ/đổi; palette mới cần delta review.
- Desktop `.workspace`: rail210px, gap24px, stage `minmax(0,1fr)`; rail cap356px, rows min68px. 900px viewport trong HTML chuyển rail174/gap18/frame padding18.
- Artifact660px chuyển native selector thay rail; footer từ3groups sang2groups và Add hàng dưới. Trong Gutenberg, dùng **available editor container width** làm owner; không dựa mỗi window width vì Sidebar/nested Group làm canvas hẹp. Ngưỡng cụ thể phải đo/ghi thay đổi khi host geometry khác.
- Stage minh họa min-height356px, text/image/gradient chỉ là content fixture. Native slide thật có thể dài hơn: grow naturally, không cắt text/RichText hoặc forced height để giống ảnh. List vẫn capped; footer không nằm trong list scroller. Không thêm viewport math/overflow mask hoặc scroll cho mọi vùng chỉ để ép screenshot match.
- Human 2026-11-13 chọn A: slide Hero trong editor sàn `36rem`, `max-height: none`. Sàn 356px giữ cho slide không phải Hero. Rail vẫn cap 356px. Trần `480px` của `.skvn-slide--hero-max-height` không còn là chiều cao editor. Pitfall 9 / AP-14.
- Type/font/content trong artifact là mẫu; dùng actual content/attrs/native styles, không hardcode các câu marketing/màu nội dung xuống plugin. Visual comparison phải cùng fixture/font/available width để phân biệt content difference với layout drift.

Phần được thích nghi kỹ thuật: React structure, enqueue, native selection/focus, responsive owner, control APIs và safe markup. Phần phải trình khi muốn thay đổi: vị trí/loại các vùng, rail thay bằng layout khác, mất thumbnail/labels/info, footer controls, palette/frame, editing model khác làm mất native access. Tolerance1px chỉ dùng cho rounding phép đo, không cho phép lệch lớn rồi tự tính PASS.

## 4. Những thứ không copy từ demo

- Top Review fixture/Concept01 badge và footer Try preview styles là **review tools**, không đưa thành control cạnh tranh Inspector. Values sample phải lấy attrs thật. Dòng giải thích prototype/edits-in-tab không ship thành text sản phẩm.
- Demo dùng JS array/contenteditable để thử layout; plugin dùng native block tree/store/RichText. Không nhúng iframe HTML artifact vào editor như implementation, không chép demo state hoặc tạo store thứ hai.
- SVG nền/placeholder copy chỉ minh họa nội dung; không cấp media mặc định mới. Không ép mọi variation có template/CTA/gradient giống sample.
- Fix active-row visibility trong demo mới có source, browser revalidation còn pending. Design acceptance không biến defect prototype thành behavior phải giữ; phải sửa tính đúng đắn và ghi evidence, giữ ý định active item visible.
- Native a11y, permissions, empty/missing/long content và variants không có trong sample cần bổ sung thích hợp; không hy sinh chúng để lấy ảnh giống mẫu.

## 5. Checkpoints bắt buộc khi được giao implementation

1. **Trước source:** xác minh canonical files/hash, đọc AF01–10, ghi mapping source/symbol và các adaptation dự kiến. Không cần xin duyệt lại layout đã nhận; chỉ xin quyết phần khác baseline có rationale/evidence.
2. **Native feasibility:** làm lát cắt tối thiểu3slides để chứng minh chọn child, edit text/IME, chuyển/return và Undo/List View hoạt động mà không clone tree/mất nội dung. Nếu cách mount/hide dự kiến không đáp ứng, báo trước khi rollout toàn UI; không tự bỏ list-left/single-stage.
3. **Trong source:** triển khai frame + two-column + footer đủ các vùng trước khi polish; giữ loaded assets, labels và Inspector owners. Cập nhật AF mapping từng phần, không báo “xong UI” khi chỉ có CSS hoặc mẫu detached.
4. **Trước nghiệm thu:** mở artifact và Gutenberg actual cùng content/available width; chụp đặt cạnh nhau wide/narrow. Ghi ảnh artifact/actual, build/hash, environment và sai khác từng AF-ID. Cần ảnh actual editor và network assets; screenshot HTML riêng không chứng minh plugin đã làm.
5. **Handoff/commit khi được giao:** đính source mapping + AF checklist/evidence/deviation register, canonical HTML+notes+contract có trong Git. Nếu thiếu browser/onsite thì ghi pending, không tự PASS hoặc đóng milestone.

## 6. Deviation register và review gate

Mọi lệch đáng kể phải có `AF-ID → baseline → proposed/actual → lý do → ảnh/DOM evidence → ảnh hưởng → human decision`. Không dùng “Gutenberg khó”/“đẹp hơn” làm evidence. Không thay artifact để xóa lệch; thay thiết kế đã được human đồng ý thì giữ revision cũ, tạo revision mới và cập nhật hash/trace.

| AF-ID | Baseline / delta | Trạng thái | Evidence / quyết định |
|---|---|---|---|
| All | Chưa có implementation, chưa có delta để so | Chưa làm | Human2026-11-09 chấp nhận mẫu để làm reference; browser/Gutenberg acceptance còn pending |

Review không đạt nếu mất một vùng đã chốt, labels sai nghĩa, sử dụng demo state thay native content, hoặc còn deviation chưa được trình/giải quyết. Review đúng artifact là điều kiện cần; native behavior/a11y/regression phải đạt riêng. Không có cơ chế docs nào tự bảo đảm100% nếu không thu evidence actual; contract giúp human và agent khác kiểm chứng được việc bám mẫu.

## 7. Handoff bắt buộc (copy vào task triển khai)

```text
Target: V1 /1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign.
Current vẫn1.3.20 cho tới human transition; không tự bump/start.
Read AGENTS/context →044§10 →062 →canonical HTML/CSS/JS + notes →063 execution plan.
Reference: Concept01 SHA-256 5B938946C253E36E9F73D35C817C2FBF1F5F9F65375DE9A7D4A04853E2C352EF.
Implement AF01–10 with source mapping; preserve native InnerBlocks/List View/history/IME.
Do not redesign, remove frame/background, reinterpret Arrow samples as navigation,
or copy demo array/iframe into plugin. Report evidence-backed deviations before pivot.
Human build/lint/onsite; no runtime PASS without actual editor screenshots/behavior.
Deliver matched artifact/actual images, AF checklist + deviations and SED/HERO evidence.
```

Lượt này chỉ khóa reference và workflow docs; chưa coding plugin, build/lint/deploy hoặc commit.
