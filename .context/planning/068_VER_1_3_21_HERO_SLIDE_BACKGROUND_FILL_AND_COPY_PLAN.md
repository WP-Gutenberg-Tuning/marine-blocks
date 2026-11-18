# V1 / 1.3.21 — Hero Slide background fill + copy/apply (planning)

2026-11-12. Human chốt **bổ sung scope 1.3.21** (sau Q&A): cho phép chỉnh **nền fill từng Slide** trên **Hero** (v1), gồm solid, gradient, transparent; lớp fill **dưới** ảnh nền slide; modal **Apply background to other slides** với tách channel Fill vs Image. **Chưa coding/start** cho tới lệnh implement; đây là planning đã human duyệt nội dung.

## 1. Liên kết và phạm vi

| Tài liệu | Quan hệ |
|---|---|
| [044](044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md) | Text/CTA contrast — **không** mô tả fill slide chỉnh được; **không đổi** acceptance HERO-* vì thêm feature này |
| [063](063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) | Inspector Slide / Background; không trùng rail Content Actions |
| `src/slider/style.css` | Gradient Hero mặc định `.skvn-slider--hero .skvn-slide` — custom fill phải **thắng** khi editor chọn custom |
| Runbook | `docs/testing/hero-slide-background-fill-1.3.21.md` |

**V1 surface:** preset **Hero** only (UI + renderer guard). **Schema/attrs** thiết kế để sau mở Showcase/Card; không bật UI các preset khác trong v1.

**Ngoài v1:** copy sang Slider khác, pattern library, đổi semantics `skvn-slide--has-background` (= ảnh), sửa GeneratePress.

## 2. Quyết định human (2026-11-12)

| Chủ đề | Quyết định |
|---|---|
| Chỉnh được | Màu phẳng, gradient, **transparent** (không lớp fill) |
| Mặc định khi không custom | **Default** = gradient Navy như CSS hiện tại (khác **transparent**) |
| Cấp độ | **Per slide**; tiết kiệm công bằng **Apply to other slides** (không clipboard OS) |
| Layering | Fill **dưới** `backgroundImage*`; ảnh + overlay opacity giữ trên |
| Milestone | **1.3.21 addon** — acceptance riêng HSB-* |

### 2.1. Ba mode fill (lưu attribute)

| Mode | Ý nghĩa | Frontend |
|---|---|---|
| `default` | Chưa chọn / reset | Gradient CSS hiện tại khi không override |
| `custom` | Palette solid hoặc gradient WP | Inline/classes/core preset trên `.skvn-slide` hoặc media layer |
| `transparent` | Không lớp fill | Không gradient plugin trên slide; nền trang/ảnh lộ ra |

**Rủi ro transparent:** default text Hero (carrier trắng từ 044) có thể **mất đọc** trên nền trang sáng — cần HSB-UI-03 (cảnh báo editor + kiểm contrast khi transparent không kèm ảnh/tối).

## 3. Phản biện đã ghi (giữ làm rationale)

- **Hero-only v1:** Showcase/Card có Image block vs slide background (063) — mở tất cả preset nhân QA và hai chỗ chỉnh nền.
- **Apply all vs ảnh từng slide:** copy channel **Fill** không đụng `backgroundImageId/Url/Alt` trừ khi human bật **Background image**.
- **Transparent vs default:** phải là hai giá trị lưu khác nhau; transparent không được coi là “quay về gradient”.

## 4. Data model (đề xuất — chỉnh tên attr khi review block.json lúc implement)

Slide block (`skvn-marine/slide`), Hero-enabled:

| Attribute | Mô tả |
|---|---|
| `backgroundFillMode` | `default` \| `custom` \| `transparent` |
| `backgroundFillColor` | Optional slug / custom (theo WP color support) |
| `backgroundFillGradient` | Optional gradient string hoặc preset ref |
| Giữ hiện có | `backgroundImageId`, `backgroundImageUrl`, `backgroundImageAlt`, overlay opacity (tên attr đúng source hiện tại) |

**Saved content:** attrs trên slide; renderer PHP + editor đồng bộ. Content cũ thiếu attr → `backgroundFillMode: default`.

**Tension với 044 §“ngoài repair slice”:** contrast repair **cố ý** không schema; feature này **có** schema — ghi riêng commit/acceptance, không gộp PASS HERO-*.

## 5. Layering (frontend + editor)

```text
.skvn-slide
├─ fill layer (default CSS | custom | none if transparent)
├─ .skvn-slide__media — background image (nếu có)
│    └─ overlay opacity
└─ .skvn-slide__content — text (044 carrier + inherit)
```

Custom fill không thay thế ảnh; transparent tắt fill plugin, ảnh vẫn có thể có.

## 6. Editor UX — Inspector

**Slide → Sidebar → Background** (English UI, text domain `skvn-marine-blocks`):

```text
Background
├── Fill
│   ○ Use preset default (Hero navy gradient)
│   ○ Custom — Color | Gradient (core controls)
│   ○ Transparent (no fill layer)
├── Background image          … existing
├── Overlay opacity           … enable when image present
└── ─────────────────
    [ Apply to other slides… ]
```

**v1:** một nút primary **Apply to other slides…** (modal). Không v1: Copy/Paste hai bước, rail duplicate.

### 6.1. Modal: “Apply background to other slides”

| Bước | Nội dung |
|---|---|
| Source slide | Dropdown/list (default = slide đang chọn); thumb rail nếu P3 có |
| Channels | ☐ **Fill style** (default **on**) — `backgroundFillMode` + color/gradient |
| | ☐ **Background image** (default **off**) — `backgroundImageId/Url/Alt` |
| | ☐ **Overlay opacity** (default **on** khi Image on; **disabled** khi Image off) |
| Targets | Checkbox list Slide 1…N (exclude source); **Select all** |
| Confirm | **Apply** / **Cancel**; warning nếu Image on và đích có ảnh: “N slides will have their background images replaced.” |

**Helper (Fill on):** `Does not change background images on other slides unless you include image below.`

**Một lần Apply = một batch attribute update = một Undo step.**

### 6.2. Hành vi apply (spec)

| Source | Fill only | Fill + Image |
|---|---|---|
| `default` | Đích default; ảnh đích **giữ** | Ảnh + overlay từ source; fill default trên đích |
| `custom` | Đích custom giống source; ảnh đích **giữ** | Ảnh + fill copy từ source |
| `transparent` | Đích transparent; ảnh đích **giữ** | Ảnh đích = source; fill transparent theo source |

## 7. CSS / renderer

- Khi `custom`: output class/inline/`--*` trên `.skvn-slide` đủ specificity ≥ rule default `.skvn-slider--hero .skvn-slide { background: … }`.
- Khi `transparent`: rule scoped tắt gradient default (không `display:none` slide).
- Khi `default` + không attr: giữ CSS hiện tại.
- Không dùng `skvn-slide--has-background` cho fill màu — class đó vẫn = **có ảnh** (044 §4.1).

## 8. Acceptance HSB-*

| ID | Nhóm | Mong đợi |
|---|---|---|
| HSB-UI-01 | Block UI | Hero slide: đổi default / custom solid / custom gradient / transparent; frontend khớp editor |
| HSB-UI-02 | Block UI | Slide có ảnh: custom fill vẫn dưới ảnh; overlay độc lập |
| HSB-UX-01 | Editor UX | Modal Apply: Fill-only không đổi image attrs đích; Image tick thay ảnh; warning khi replace |
| HSB-UX-02 | Editor UX | Undo một bước sau Apply; save/reopen giữ attrs |
| HSB-TECH-01 | Technical | Slide cũ không attr → default; không invalid block |
| HSB-TECH-02 | Technical | Showcase/Card Carousel regression: không đổi presentation khi UI fill Hero-only tắt |
| HSB-UI-03 | Block UI | Transparent: document/warning + kiểm đọc được (với 044 text rules) hoặc ghi FAIL có chủ đích |

**044 HERO-UI-01/02** vẫn chạy trên fixture có fill custom/transparent — không đóng 1.3.21 chỉ vì HSB pass.

## 9. Implementation slice (khi human “implement”)

1. `block.json` + types slide attrs  
2. `slide/edit.tsx` — Fill UI + modal Apply  
3. `slide/save.tsx` + `slider-render.php` — output layer  
4. `src/slider/style.css` — override default + transparent  
5. Tests doc human onsite — runbook §cases  

Không bump version / build trong lượt planning-only.

## 10. Tension register

| Tension | Severity | Ghi chú |
|---|---|---|
| 044 nói không schema; 068 thêm schema | low | Scope amendment human2026-11-12; commits tách hoặc prefix rõ feature |
| 063 nói không schema cho editor chrome | low | 068 attrs là **slide product data**, không phải UI-only active index |
| Transparent + text trắng | low | HSB-UI-03 + editor notice |

**Status:** IMPLEMENT_IN_PROGRESS (human “Tiến hành” 2026-11-12) — source attrs, Inspector, Apply modal, PHP renderer, CSS.
