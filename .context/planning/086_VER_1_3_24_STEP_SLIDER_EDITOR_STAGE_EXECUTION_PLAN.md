# V1 / 1.3.24 — Step Slider editor stage: plan thực hiện

Ngày: **2026-11-20**. Human: artifact HTML là hướng dẫn nhìn. Plan này chỉ dẫn agent dựng đúng UI đó trong Gutenberg.

Source bước 1–6 đã viết 2026-11-20. Nút ảnh nằm trên toolbar của bước (`BlockControls`), không nằm góc khung: toolbar Gutenberg neo đỉnh block đang chọn và đè `top: 12px`. Root editor mang `skvn-editor-preview-frame`, số đo khung theo artifact: nền `#f4f5fc`, viền `#d9dcef`, bo `14px`, padding `22px`. Hàng đầu có ô `▥`. Nút Add step dùng kiểu artifact, không dùng nền nút secondary của Gutenberg. `editor.css` tắt `min-height: 100svh` của style frontend trên canvas editor. Markup cũ `is-overlay-light|medium|strong` được nhận bằng deprecated của `step-slide`, không đổi `save` hiện tại. Không bump metadata, không đổi current, không build, không commit.

Decision: [step-slider-editor-stage-1.3.24.md](../../docs/decisions/sliders/step-slider/step-slider-editor-stage-1.3.24.md). Khung mô tả: [082](082_VER_1_3_24_STEP_SLIDER_EDITOR_UI_PLAN.md). Plan 082 ngày 2026-11-16 có rail trái; decision 2026-11-20 thay rail đó. Làm theo file này, không dựng lại rail.

Khóa sau review cùng ngày: khung 16:9 là sân biên tập theo artifact, không phải preview front-end. Ảnh trong khung là `<img>`. Scrim editor là gradient của artifact. Playback giữ năm control trong Inspector Gutenberg. Cột Playback 230px cạnh canvas là thiết kế sidebar, làm sau 1.4.x (mục 9), không thuộc lần code plan này. Chiều ngang của chrome editor theo canvas Gutenberg, cùng bài học Slider và Responsive Spacer. Khóa R1–R5 ở mục 8.

## 0. Đọc, rồi mới sửa

1. Mở [step-slider-editor-stage-prototype.html](../../docs/artifacts/editor-ui/step-slider-editor-stage-prototype.html) trong trình duyệt. Giữ cửa sổ đó để đối chiếu. CSS đi kèm: [step-slider-editor-stage-prototype.css](../../docs/artifacts/editor-ui/step-slider-editor-stage-prototype.css). Ghi chú giới hạn: [step-slider-editor-stage-prototype.md](../../docs/artifacts/editor-ui/step-slider-editor-stage-prototype.md).
2. Decision editor stage ở trên.
3. `.context/CONVENTION.md`: Chỉ mục đọc + mục 0.1–0.5. Hàng định tuyến **Sửa block đã phát hành** và **Thêm InnerBlocks, block cha–con**. Tín hiệu chrome Editor: đọc A5.12. Trước khi kết thúc, hàng **Self-check attribute `undefined`**. Không đọc hết file convention.
4. Source được sửa, đọc trước khi viết:

- `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/editor.css`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/fill-preset.ts`
- `wp-content/plugins/skvn-marine-blocks/src/slide/edit.tsx` chỉ đoạn `editorFocus` / `isInactiveInEditor` (khoảng dòng 133–206). Đó là cơ chế “một slide hiện, các slide khác vẫn mounted”. Không copy file này.
- `wp-content/plugins/skvn-marine-blocks/src/slide/focal.ts` chỉ để biết `focalPointToWrapperStyle` trả `--skvn-slide-bg-pos-x` và `--skvn-slide-bg-pos-y`. Không sửa file này.
- Chiều ngang theo A5.12. Đối chiếu nguồn của repo, chỉ đọc: `src/slider/edit.tsx` đoạn `alignClass`; `docs/testing/slider-editor-align-width-1.3.21.md` mục root cause; `src/responsive-spacer/edit.tsx` class `alignwide`; `src/responsive-spacer/editor/style.css` comment width. Không sửa bốn file đó.

## 1. Artifact là hợp đồng nhìn

Cột phải trong artifact (`aside.playback`, 230px) là bản vẽ sidebar. Plan này không dựng cột đó trong canvas. Năm control Playback ở lại panel Inspector đang có. Bản vẽ và mốc quay lại nằm ở mục 9.

Khung 16:9 là sân biên tập. Nó không phải preview của slide front-end. Front-end vẫn `100svh` hoặc cao theo content, cột chữ căn giữa, `max-width: 46rem`, heading `clamp(2rem, 1.25rem + 3.75vw, 3.9rem)`. Editor không copy các số đó. `heightMode` và `tabHeight` vẫn nằm ở panel Layout và chỉ có hiệu lực trên trang. Đổi hai control đó thì khung editor không đổi kích thước.

| Vùng trong artifact | Việc trong editor |
|---|---|
| Hàng `STEP SLIDER`, badge `Autoplay on` / `Manual`, `1 step` / `4 steps` | Hàng đầu của block `step-slider`. Số bước qua `_n` |
| Khung 16:9 | Một ô bao `InnerBlocks`. Bước đang chọn lấp đầy ô, ở trong flow |
| Heading, paragraph, list, button trên nền | Inner blocks sẵn có của `step-slide`, đặt trong cùng khung với nền, neo theo artifact |
| `Choose image` khi chưa có ảnh; `Replace image` và `Remove image` khi đã có | Toolbar của block `step-slide`. Không đặt lên góc khung |
| Dải `01` + nhãn dưới khung | Chrome của block cha. `tablist`. Bấm ô thì `selectBlock` đúng clientId |
| `Add a step to start editing.` | Ô 16:9 khi chưa có bước nào |
| `Add step` | `createBlock( 'skvn-marine/step-slide' )`. Ẩn nút khi đủ 8, hoặc khi không chèn được |
| `Autoplay on · 8 seconds · Loop on` | Đọc Autoplay, Dwell, Loop. Không chạy autoplay. Pause on hover và Show play button không viết lên dòng này |
| Panel `Playback` | Autoplay, Dwell 5/8/10, Loop, Pause on hover, Show play button |

Tiêu đề trang “Step Slider editor” và câu review ở chân artifact không thuộc block. `max-width: 1180px` của trang review cũng không thuộc block.

### Chiều ngang

Luật chung là A5.12. Áp vào block này:

- Attribute `align` đã có trong `block.json`, default `full`. Lần đổi default sang `wide` ngày 2026-11-20 bị hủy bởi [088](088_VER_1_3_24_STEP_SLIDER_ALIGN_DEFAULT_REPAIR_PLAN.md). `supports.align` là `wide` và `full`. Type `StepSliderAttributes` thêm `align?: 'none' | 'wide' | 'full'`. Root editor gắn `align${ attributes.align }` khi attribute có giá trị, cùng cách `alignClass` của Slider. Block chưa lưu căn lề mang `alignfull`. Toolbar vẫn đổi được sang Wide. Không hardcoded class căn lề trong CSS.
- Header, ô 16:9 và dải step rộng 100% hộp đó. `max-width: 1180px` của trang artifact không thuộc block. Không `max-width: none`, không margin ngang âm, không `100vw`.
- Trong Group hoặc Columns, khung co theo parent. Không thêm class align thứ hai lên ô stage. Default căn lề là `full` ([088](088_VER_1_3_24_STEP_SLIDER_ALIGN_DEFAULT_REPAIR_PLAN.md)). Không sửa `save.tsx`.

## 2. Không làm

- Không copy `src/slider/editor/canvas.tsx`, rail, thumbnail, mũi tên, pagination.
- Không import `SliderEditorFocusContext`. Context của Step Slider là file riêng, chỉ sống trong React, không thành attribute.
- Không import `src/slider/editor/selection.ts`. Các hàm ở đó lọc `skvn-marine/slide` / `skvn-marine/slider` và chặn 5 slide. Gọi nguyên hàm sẽ coi Step Slider là không hỗ trợ.
- Không tạo mảng slide thứ hai, không `contenteditable` tự quản lý heading/paragraph. Heading, paragraph, list, buttons vẫn là InnerBlocks.
- Không sửa `block.json`, `save.tsx`, `frontend.ts`, `style.css`, PHP render, `modules/`.
- Không chạy Swiper, fade, autoplay trong editor.
- Không đổi attribute, không thêm attribute để nhớ bước đang chọn. `fillPreset` và `align` đã có trong `block.json`. Type `StepSliderAttributes` thêm `fillPreset` và `align?: 'none' | 'wide' | 'full'`. Không thêm field nào khác.
- Không xóa control đã có: Layout, Motion, progress color, Pause on hover, Show play button, Background, Step layout. Chúng không xuất hiện trên canvas. Chúng ở lại Inspector.
- Không đưa focal, overlay slider, text position, text surface lên khung 16:9.
- Không đổi ảnh sang `background-image`. `focalPointToWrapperStyle` không trả `background-position`.
- Không đặt `position: absolute; inset: 0` lên root của `step-slide`.
- Không copy scrim hai lớp của `style.css` vào editor. Scrim editor là gradient một lớp của artifact.
- Không sửa HTML/CSS artifact trong lượt implement. Artifact đã khóa ở bản kèm plan này.
- Không đặt chiều ngang riêng cho chrome editor. Cấm `max-width: 1180px`, `max-width: 760px`, `max-width: none`, margin ngang âm, và `100vw`. Không hardcoded `alignwide`. Không bỏ class align của root.

## 3. Cây UI

```text
StepSliderEdit
├ InspectorControls
│  ├ Layout            giữ nguyên, initialOpen như source hiện tại
│  ├ Motion            giữ nguyên
│  ├ Playback          Autoplay, Dwell, Loop, Pause on hover, Show play button
│  └ Progress color    giữ nguyên
└ div.skvn-step-slider--editor
   ├ header            STEP SLIDER · badge · số bước
   ├ div.skvn-step-slider-editor__stage     aspect-ratio 16:9, overflow hidden, container-type inline-size
   │  └ InnerBlocks    chỉ skvn-marine/step-slide, renderAppender = false
   │     └ layout grid, mọi wrapper grid-area 1 / 1, cao 100%
   │        └ step-slide đang chọn, trong flow, cao 100%
   │           ├ root: fill preset, custom, hoặc transparent
   │           ├ media absolute inset 0
   │           │  ├ img.skvn-step-slide__image khi có ảnh
   │           │  └ overlay: gradient artifact, opacity = overlayOpacity
   │           ├ InnerBlocks nội dung, absolute, góc dưới trái
   │           └ (nút ảnh ở BlockControls, không nằm trong khung)
   ├ dải step          tablist
   │  └ mỗi ô
   │     ├ button role=tab, số 01…
   │     └ RichText tabLabel, sibling, không nằm trong tab
   └ chân              dòng trạng thái + Add step
```

Bước không chọn vẫn là block con. `step-slide` nhận context UI `{ rootClientId, activeClientId }`. Nếu parent đúng và id không phải bước đang chọn thì root editor của bước đó `display: none`. Không dùng `opacity: 0`. Không unmount.

Ô stage là containing block của khung, không phải root của bước. Chuỗi cao phải đủ:

- `.skvn-step-slider-editor__stage` có `aspect-ratio: 16 / 9`, `overflow: hidden`, `position: relative`, `container-type: inline-size`.
- Con trực tiếp `.block-editor-inner-blocks`, rồi `.block-editor-block-list__layout`, cao `100%`.
- Layout của ô stage là `display: grid`, `grid-template-rows: minmax(0, 1fr)`, không `gap`. Rule `gap: 1rem` hiện ở `editor.css` cho layout con của slider phải hết hiệu lực với ô này.
- Mỗi `.block-editor-block-list__block` trong ô: `grid-area: 1 / 1`, `height: 100%`, `min-height: 0`.
- Root bước đang chọn: `position: relative`, `height: 100%`, `overflow: hidden`. Không absolute.

`display: none` đặt trên root của bước không chọn. Wrapper Gutenberg của bước đó vẫn nằm trong cùng ô grid. Bước đang chọn ở trong flow nên ô 16:9 không co về 0.

Chuỗi cao này áp khi guard ở bước 2 đủ điều kiện. Khi guard sai, ô stage không có `aspect-ratio` và không có `overflow: hidden`. Các bước xếp dọc, hết chiều cao.

`tabLabel` chỉ có một owner: attribute trên `step-slide`. Dải step đọc và ghi attribute đó. Xóa hàng `Tab` / RichText nhãn khỏi canvas của `step-slide`.

Màu ô step lấy từ resolver đã có, kể cả khi bước có ảnh. Ảnh không tắt màu ô. Ảnh chỉ vẽ trong khung 16:9.

- `backgroundFillMode === 'transparent'`: ô trong suốt.
- `custom`: `resolveCustomFillBackground` của attribute con.
- còn lại: `useStepFillPresets` + `stepFillPresetFillsFor` + `resolveStepFillPresetFill`, slug là `fillPreset` của cha, index là thứ tự con.

Thêm `fillPreset` và `align?: 'none' | 'wide' | 'full'` vào type `StepSliderAttributes`. Cả hai attribute đã có trong `block.json`. Dải step đọc `fillPreset` trên cha và `backgroundFillMode`, `backgroundFillColor`, `backgroundFillGradient` trên từng con qua `getBlockAttributes`.

Màu thanh tiến trình là `var(--skvn-step-slider-progress-color)`. Cha đã gán biến đó trong `blockProps`. Không tính lại `progressColorCss` cho dải step.

## 4. Từng bước

Làm đúng thứ tự. Mỗi bước xong thì đối chiếu artifact trước khi sang bước sau. Dừng bước đó nếu lệch bảng mục 1.

### Bước 1 — Khung cha, chưa đổi bước con

File: `src/step-slider/edit.tsx`, `src/step-slider/editor.css`.

Thêm hàng header, ô stage, chỗ dải step, chân trạng thái. Panel Autoplay đổi tiêu đề thành `Playback`. Trong panel đó, thứ tự là Autoplay, Dwell, Loop, Pause on hover, Show play button. Không thêm control mới. Không xóa hai toggle. Layout giữ `initialOpen`.

`InnerBlocks` chuyển vào trong ô stage. `renderAppender` luôn `false`. Nút Add ở bước 5 là lối thêm duy nhất.

Ô stage có tỷ lệ 16:9, `width: 100%`, và `overflow: hidden` ngay từ bước này. Cao suy ra từ bề rộng của root, không từ viewport. Root `useBlockProps` gắn class align như Slider. Chưa cần giấu bước.

Xong khi: block trong editor có hàng `STEP SLIDER`, một ô tỷ lệ 16:9 rộng bằng root block, và panel tên Playback với đủ năm control. Block default `full` rộng bằng canvas (`alignfull`), không bị kẹp 760px. Block đặt trong Columns không tràn cột. Các thẻ bước cũ có thể vẫn chồng bên trong ô.

### Bước 2 — Một bước trong khung

File mới được phép: `src/step-slider/editor-focus.tsx`. Chỉ export context và type `{ rootClientId: string, activeClientId: string | null }`. Không đưa thuật toán chọn bước vào file này.

Trong `edit.tsx` của cha, trước khi giấu bước:

- Mọi con lấy từ `getBlockOrder` phải có tên `skvn-marine/step-slide`.
- `getBlockMode( clientId )` của cha phải là `visual`.

Hai điều kiện này không đủ thì không bọc provider, không đặt `display: none`, và hiện `Notice`: `Focused editing is unavailable in this context. Native block editing remains available below.` Cùng lúc, ô stage bỏ `aspect-ratio` và `overflow: hidden`. InnerBlocks xếp dọc, hết chiều cao, để bước 2 trở đi không bị cắt. `supports.html: false` chỉ đóng Edit as HTML. Con không phải `skvn-marine/step-slide` vẫn mở nhánh này. Nhánh này có chạy.

Khi đủ điều kiện:

- Bước đang chọn, theo thứ tự: selection hiện tại nếu nó nằm trong một `step-slide` của slider này; không thì id cũ nếu id đó còn trong danh sách; không thì cùng index của id vừa mất, kẹp vào bước cuối còn lại; danh sách rỗng thì không có bước chọn. Không nhảy về bước đầu sau khi xóa bước đang chọn.
- Nhớ id và thứ tự trước đó bằng ref trong `edit.tsx`. Không lưu thành attribute.
- Bọc `InnerBlocks` bằng provider.

File: `src/step-slide/edit.tsx`.

- Đọc context. Đặt `display: none` khi bước không phải bước đang chọn, cùng cách `isInactiveInEditor` của `slide/edit.tsx`.
- Root bước đang chọn lấp ô theo mục 3: trong flow, cao 100%.

Bấm ô gắn ở bước 4. Bước này chỉ cần đúng một bước hiện trong ô 16:9.

Xong khi: insert 4 bước, canvas chỉ thấy một bước, trong ô 16:9. List View vẫn có 4 block con. Xóa bước đang xem thì khung mở bước ở cùng index, hoặc bước cuối nếu index đó không còn.

### Bước 3 — Nền và nội dung cùng một mặt

File: `src/step-slide/edit.tsx`, `src/step-slider/editor.css`.

Root bước đang chọn là khung, `position: relative`, cao 100%. Fill của root giữ cách `edit.tsx` đang tính khi không có ảnh: preset, custom, hoặc không fill khi transparent. Khi có ảnh, fill đó vẫn ở trên root để gỡ ảnh thì còn nền. Focal không gắn thành `background-image`.

Ảnh:

- Giữ `<img class="skvn-step-slide__image">` trong `.skvn-step-slide__media`.
- Media: `position: absolute; inset: 0`. Bỏ `min-height: 96px`, viền đứt, nền xám, và khoảng cách dưới của ô media editor.
- Ảnh: `width: 100%`, `height: 100%`, `max-height: none`, `object-fit: cover`.
- `object-position: var(--skvn-slide-bg-pos-x, 50%) var(--skvn-slide-bg-pos-y, 50%)`.
- Có ảnh thì root vẫn nhận style từ `focalPointToWrapperStyle`, để hai biến đó có giá trị. Hàm này không trả `background-position`. Không viết thêm.

Overlay đã có phủ kín media. Thêm đúng gradient của `.stage-scrim` trong artifact vào `editor.css`:

```css
background: linear-gradient(180deg, rgba(4, 12, 20, 0.08) 20%, rgba(4, 12, 20, 0.62) 100%);
```

`overlayOpacity` vẫn là `opacity` inline của lớp đó, như source hiện tại. Không lấy gradient hai lớp từ `style.css`.

Bỏ hai rule cũ trong `editor.css`. Rule `.skvn-step-slide--editor * { opacity: 1 }` không xóa được scrim vì opacity overlay là inline, nhưng vẫn đè mọi opacity không inline. Rule `.skvn-step-slide__content` đang có `padding: 0.5rem 0` và `gap: 0.5rem`. Artifact `.stage-copy` không có padding. Khoảng cách là margin của heading, paragraph và list.

Inner blocks nằm trong `.skvn-step-slide__content`, bám số đo artifact. Lớp này absolute, không phải root của bước:

- `left: 6%`, `right: 24%`, `bottom: 8%`, `max-width: 560px`
- chữ sáng trên nền
- heading `clamp(26px, 5cqi, 40px)`, weight 500, line-height 1.12
- paragraph 15px, `max-width: 460px`
- list 14px

`5cqi` tính theo ô stage vì ô đó có `container-type: inline-size`. Không dùng `vw`.

Class `is-position-*` và `skvn-step-slide__content--surface` vẫn gắn lên vùng chữ, để front-end nhận attribute đã lưu. `editor.css` không có rule căn lề hay nền mờ cho hai class đó. Khung editor luôn neo góc dưới trái của artifact. Đổi Text position hoặc Text surface trong Inspector không được kéo chữ trong khung editor.

Nút ảnh ở toolbar của block `step-slide`, nhóm `BlockControls`:

- chưa có ảnh: một nút `Choose image`
- có ảnh: `Replace image` và `Remove image`

Không vẽ hai nút đó lên góc khung. Toolbar Gutenberg neo đỉnh block đang chọn, trùng `top: 12px; right: 12px`.

Bỏ `MediaPlaceholder` khỏi canvas. Bỏ hàng chữ `Tab`, RichText nhãn, và `FocalPointPicker` khỏi canvas.

`FocalPointPicker` chuyển vào panel Background đã có, ngay sau control ảnh alt, và chỉ render khi `hasImage` đúng như điều kiện hiện tại. Hết ảnh thì picker không còn. Attribute focal giữ nguyên. Không thiết kế control focal mới.

Xong khi: nhìn một bước thấy heading và đoạn chữ nằm trên nền, cùng một khung 16:9. Có ảnh thì thấy `<img>` phủ khung, focal đổi điểm nhìn của ảnh. Không còn dải xám “Background image” tách khỏi chữ.

### Bước 4 — Dải step

File: `src/step-slider/edit.tsx`, `editor.css`.

Dưới ô 16:9, một hàng `role="tablist"`, `aria-label="Steps"`. Mỗi bước là một ô nhìn. `role="tab"` không bọc RichText. Tab là một control. RichText là `contenteditable`. Nhét RichText vào tab làm AT mất một tab để kích, và mũi tên vừa đổi bước vừa sửa chữ.

- Ô chứa một `<button role="tab">` và một `RichText` đứng cạnh, cùng ô. RichText không nằm trong button.
- Button mang số `01`… lấy từ index, không lưu. `id` ổn định theo clientId. `aria-controls` trỏ id của ô stage. `aria-labelledby` trỏ id của RichText nhãn. Ô stage là `role="tabpanel"` và `aria-labelledby` id của button đang chọn.
- `RichText` ghi `tabLabel` của đúng clientId qua `updateBlockAttributes`. `key` là clientId. `allowedFormats` rỗng. Có `id` để button trỏ tới.
- `mousedown` trên nhãn: `selectBlock( clientId, null )`, rồi `stopPropagation`. Gõ nhãn không kéo selection về block cha. Click button cũng `selectBlock( clientId, null )`.
- Nền ô: resolver mục 3. Có ảnh vẫn tô màu này.
- Button đang chọn: `aria-selected="true"`, `tabIndex={ 0 }`. Button khác `tabIndex={ -1 }`. Ô đang chọn có viền trong trắng 2px. Thanh tiến trình trên đỉnh ô, màu `var(--skvn-step-slider-progress-color)`.
- Phím ArrowRight và ArrowLeft trên button đổi ô và chuyển focus sang button kế. Dừng ở hai đầu, không vòng. Trong RichText hai phím này chỉ sửa chữ.
- Ô cao tối thiểu 64px. Nhãn tối đa hai dòng, uppercase. Hàng `overflow-x: auto` khi nhiều bước.
- Góc dưới khung stage bỏ bo để dải dính vào khung, như artifact (stage bo trên, dải bo dưới).

Xong khi: bốn ô nằm dưới khung. Sửa nhãn ô đang chọn, đổi bước, quay lại, nhãn còn. Bấm ô 03 thì khung đổi sang nội dung bước 03. Mũi tên chuyển ô khi focus ở ô, và không nuốt caret khi đang sửa nhãn.

### Bước 5 — Add, tối đa 8

File: `src/step-slider/edit.tsx`.

Nút `Add step` ở chân, bên phải dòng trạng thái. `onClick` gọi `event.stopPropagation()`, rồi `createBlock( 'skvn-marine/step-slide' )`, `insertBlock` vào cuối, rồi `selectBlock` bước mới với vị trí `null`.

Ẩn nút khi một trong các điều kiện sau đúng:

- `count >= 8`
- `canInsertBlockType( 'skvn-marine/step-slide', clientId )` sai
- `getTemplateLock( clientId )` có giá trị
- `getBlockEditingMode( clientId )` khác `default`

Hết chỗ hoặc không chèn được thì nút không còn trên canvas. Không disable-và-để-đó. Không gọi helper của Hero Slider.

Không thêm UI xóa hay kéo sắp xếp. Hai việc đó vẫn là List View / toolbar Gutenberg của block đang chọn.

0 bước: ô stage hiện câu `Add a step to start editing.` Nút Add ở chân vẫn là lối thêm duy nhất, trừ khi bị ẩn vì khóa.

Xong khi: thêm được bước thứ 5 và khung nhảy sang bước đó. Đủ 8 thì nút biến mất. Bước thứ 9 không xuất hiện. Chưa có bước nào thì câu trống hiện trong khung 16:9.

### Bước 6 — Badge và dòng trạng thái

File: `src/step-slider/edit.tsx`.

Badge header:

- `autoplay` bật: `Autoplay on`
- tắt: `Manual`

Số bước: `_n( '%d step', '%d steps', count, 'skvn-marine-blocks' )`.

Dòng chân, nối bằng ` · `:

- cùng cụm badge
- dwell đang lưu + ` seconds` (`5 seconds`, `8 seconds`, `10 seconds`)
- nếu `loop` bật thì thêm `Loop on`

Pause on hover và Show play button không có mặt trên badge hay dòng chân. Đổi checkbox trong Playback thì badge và dòng chân đổi theo Autoplay, Dwell, Loop. Canvas không tự chuyển bước.

Xong khi: tắt Autoplay thì badge thành `Manual` và dòng chân hết chữ `Autoplay on`. Bật Loop thì dòng có `Loop on`. Một bước thì header ghi `1 step`.

## 5. File được sửa

- `src/step-slider/edit.tsx`
- `src/step-slider/editor.css`
- `src/step-slide/edit.tsx`
- `src/step-slider/editor-focus.tsx` (mới, chỉ context)

CSS editor vẫn vào `build/index.ts.css`, handle `skvn-marine-step-slider-editor`. Không thêm handle. Không import `style.css` vào editor. Gradient scrim viết trong `editor.css`.

## 6. Xong cả plan khi

Đối chiếu trực tiếp với artifact, trong editor Gutenberg sau khi human build:

- Không có cột rail bên trái.
- Một khung 16:9. Chữ nằm trên nền của bước đang chọn, neo góc dưới trái của artifact. Khung không cao `100svh` và không căn giữa như front-end.
- Khung rộng bằng root block trên canvas editor. Default `full` không còn `max-width: 760px`. Trong Columns, khung không tràn parent.
- Ảnh là `<img>` phủ khung. Gỡ ảnh thì còn fill. Ô step vẫn có màu preset khi bước có ảnh.
- Dải step ngay dưới khung. Bấm ô nào, khung mở bước đó. Mũi tên chuyển ô.
- Nhãn sửa trên ô. Đổi bước rồi quay lại, nhãn còn.
- Chưa có ảnh thì toolbar của bước có `Choose image`. Có ảnh thì có `Replace image` và `Remove image`. Khung 16:9 không có hai nút đó ở góc.
- `Add step` mất ở bước thứ 8.
- Playback có Autoplay, Dwell, Loop, Pause on hover, Show play button, trong Inspector. Không vẽ cột 230px cạnh canvas. Không có Navigation, Pagination, Presentation của Hero Slider. Layout và Motion của Step Slider vẫn ở panel riêng.
- Save, đóng, mở lại: block không invalid. Nhãn, heading, ảnh còn đúng bước.
- Editor không chạy Swiper.

## 7. Human build

Agent không chạy build. Khi source xong, đưa human lệnh:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

## 8. Khóa R1–R5

Ngày 2026-11-20. Đối chiếu plan với source. R6 không ghi vào đây.

### R1 — type `align`

`StepSliderAttributes` trong `src/step-slider/edit.tsx` không có `align` và không có `fillPreset`. Câu chiều ngang đòi `align${ attributes.align }`. Viết đúng câu đó khi type chưa có field là lỗi TypeScript.

Quyết định: type thêm `fillPreset` và `align?: 'none' | 'wide' | 'full'`, theo mẫu `slider/edit.tsx`. `supports.align` là `["wide","full"]`. Default giữ `"full"`. Lần ghi default `"wide"` ngày 2026-11-20 (để thẻ editor cùng bề ngang Hero Slider) bị hủy bởi [088](088_VER_1_3_24_STEP_SLIDER_ALIGN_DEFAULT_REPAIR_PLAN.md). Block chưa lưu căn lề mang `alignfull`. Toolbar vẫn có Wide width.

### R2 — fallback không bị cắt

`supports.html: false` trên `step-slider` và `step-slide` chỉ đóng Edit as HTML. Guard còn một cửa: mọi con phải là `skvn-marine/step-slide`. Con sai loại thì nhánh fallback chạy. InnerBlocks nằm trong ô `aspect-ratio: 16 / 9` và `overflow: hidden` thì các bước xếp dọc bị cắt từ bước 2. Câu Notice “below” của Hero đúng vì block native nằm ở vùng dọc riêng trong `src/slider/editor/canvas.tsx`.

Quyết định: khi guard sai, stage bỏ `aspect-ratio` và `overflow: hidden`. Các bước xếp dọc, hết chiều cao. Giữ Notice. Nhánh này có chạy.

### R3 — tab và RichText tách role

`role="tab"` là một control. RichText bên trong là `contenteditable`, nên công nghệ hỗ trợ không còn một tab để kích, và mũi tên vừa đổi bước vừa sửa chữ.

Quyết định: một ô nhìn vẫn là một step. `role="tab"` nằm trên `<button>` mang số thứ tự. Bấm button thì `selectBlock`. RichText `tabLabel` là sibling trong cùng ô, không nằm trong button. `aria-labelledby` của button trỏ tới nhãn. Mũi tên trên button đổi bước. Mũi tên trong RichText chỉ sửa chữ.

### R4 — row grid

`grid-area: 1 / 1` và `height: 100%` dựa vào row giãn theo mặc định. Thêm `align-content` sau này làm row mất chiều cao mà không báo lỗi.

Quyết định: layout của ô stage có `grid-template-rows: minmax(0, 1fr)`.

### R5 — hai rule CSS cũ

`src/step-slider/editor.css` có `.skvn-step-slide--editor * { opacity: 1 }`. Rule này không xóa scrim, vì `overlayOpacity` là inline style trong `src/step-slide/edit.tsx`. Nó vẫn đè opacity không inline. Cùng file, `.skvn-step-slide__content` có `padding: 0.5rem 0` và `gap: 0.5rem`. Artifact `.stage-copy` không có padding. Khoảng cách là margin của heading, paragraph và list.

Quyết định: Bước 3 bỏ rule `* { opacity: 1 }`, bỏ padding và gap cũ của `__content`.

## 9. Sidebar — thiết kế giữ, làm sau 1.4.x

Ngày 2026-11-20. Human: ghi phần thiết kế sidebar để quay lại sau 1.4.x. Không code trong plan này. Không gán SemVer. Không chen trước 1.4.0 Migration, 1.4.1 Setup UI, 1.4.2 Layout/Quote Validation, 1.4.3 Map, hay Inserter SVG.

Nguồn nhìn: [step-slider-editor-stage-prototype.html](../../docs/artifacts/editor-ui/step-slider-editor-stage-prototype.html) (`aside.playback`) và [step-slider-editor-stage-prototype.css](../../docs/artifacts/editor-ui/step-slider-editor-stage-prototype.css) (`.editor-shell`, `.playback`).

Bố cục:

- Canvas và sidebar cùng một hàng. Lưới: `minmax(0, 1fr)` và cột `230px`, `gap: 18px`, `align-items: start`.
- Dưới 860px, sidebar xuống hàng dưới, rộng bằng canvas.
- Thẻ sidebar: nền trắng, viền `1px solid #d9dcef`, `border-radius: 14px`, `padding: 16px`.
- Tiêu đề `Playback`: `13px`, đậm 650, cách nội dung `14px`.
- Mỗi field là hàng ngang, chữ `13px`, khoảng cách ô `8px`, cách field `12px`.
- Thứ tự: Autoplay (checkbox, mặc định bật), Dwell (nhóm radio `5 seconds` / `8 seconds` đang chọn / `10 seconds`, fieldset không viền), Loop (bật), Pause on hover (bật), Show play button (bật).
- Đổi Autoplay, Dwell, Loop thì badge và dòng trạng thái trên canvas đổi theo. Pause on hover và Show play button không đổi badge. Sidebar không chạy autoplay.

Cột này không chứa Layout, Motion, progress color, Navigation, Pagination, Presentation, focal, overlay, text position, text surface.

Lần code plan 086: năm control trên vẫn là `PanelBody` Playback trong Inspector. Không thêm cột 230px vào canvas.
