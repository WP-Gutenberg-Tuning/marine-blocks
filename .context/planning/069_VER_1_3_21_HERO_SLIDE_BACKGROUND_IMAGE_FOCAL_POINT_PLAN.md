# V1 / 1.3.21 — Hero Slide background image focal point (planning)

2026-11-12 (human test fill xong, yêu cầu thêm **focus** cho ảnh nền từng slide). **Planning only** — chưa implement tới lệnh human.

## 1. Vấn đề & mục tiêu

**Hiện trạng (research source):**

- Ảnh slide dùng `object-fit: cover`; `object-position` **cố định `center`** trên `.skvn-slide__bg img` (`src/slider/style.css`).
- `.skvn-slide__background-image` (absolute, cover) **không** khai báo `object-position` → trình duyệt mặc định ~ center.
- Parallax dịch chuyển `.skvn-slide__bg` (`view.ts` + `--skvn-parallax-inset`), không đổi crop anchor — focal trên `<img>` vẫn hợp lệ.
- Không có attr focal trên `slide/block.json`; modal Apply (068) copy `backgroundImage*` + overlay, **không** có kênh focal.
- Repo **không** có `FocalPointPicker` / focal attr pattern sẵn; `core/image` trong project dùng Image block riêng (Showcase/Card), không dùng cho Hero slide background.

**Mục tiêu:** Cho editor chọn **điểm neo crop** (focal) **per slide, per background image**, preview trong editor ≈ frontend, lưu trong block attrs, tương thích slide cũ (thiếu attr = center).

## 2. Liên kết phạm vi

| Tài liệu | Quan hệ |
|---|---|
| [068](068_VER_1_3_21_HERO_SLIDE_BACKGROUND_FILL_AND_COPY_PLAN.md) | Cùng Inspector **Background**; mở rộng modal Apply |
| [063](063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) | Inspector Slide; không đụng rail/stage |
| [044](044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md) | Focal không đổi contrast rules |
| `docs/decisions/single-post-layout-and-mobile-surfaces.md` A1 | Theme đã ghi `object-position` future — **không** gộp post featured image vào slice này |
| Runbook | `docs/testing/hero-slide-background-focal-1.3.21.md` |

## 3. Phương án (research)

| Phương án | Mô tả | Trade-off |
|---|---|---|
| **A — FocalPointPicker (khuyến nghị)** | Attr `backgroundImageFocalPoint: { x, y }` 0–1; UI `@wordpress/components` **FocalPointPicker** + preview trên ảnh slide; output `object-position: X% Y%` trên `<img>` | Giống mental model **core/image**; marketing drag trực quan; thêm ~1 object attr |
| **B — Lưới 9 vị trí** | Enum `center`, `top`, `bottom-left`, … | Dễ QA, khó fine-tune (ví dụ mặt người lệch) |
| **C — Đọc focal từ Media Library attachment** | Khi chọn ảnh, lấy meta WP | WP không lưu focal attachment cho mọi media; hành vi không ổn định → **loại v1** |

### 3.1. So sánh khả năng code — A vs B (human hỏi research)

| Hạng mục | **A — FocalPointPicker** | **B — Lưới 9 vị trí** |
|---|---|---|
| Attr | 1 object `{x,y}` hoặc 2 float | 1 enum string |
| Inspector | `FocalPointPicker` + `url` ảnh (pattern WP quen) | `RadioControl` / `SelectControl` 9 label |
| Editor preview | Picker + img — đồng bộ 1:1 | Chỉ đổi khi chọn preset; không fine-tune |
| CSS output | `object-position: calc(x*100%) calc(y*100%)` | Map 9 giá trị → 9 cặp % cố định |
| PHP sanitize | Clamp 0..1 | Whitelist enum |
| Apply modal | Copy object focal | Copy enum |
| Content Actions | Object hoặc 2 float trong allowlist | Enum trong allowlist |
| Rủi ro | Dependency `@wordpress/components` FocalPointPicker (đã dùng trong WP packages qua block-editor) | Marketing hỏi “chỉnh nhẹ” → scope creep sang A |
| Effort ước lượng | **~1 slice** (picker + normalize + render) | **~0.7 slice** UI, nhưng **đổi spec** nếu sau này cần free drag |

**Human chốt2026-11-12:** **A — FocalPointPicker**; default `{ x: 0.5, y: 0.5 }` khi thiếu attr.

## 4. Quyết định đề xuất (chờ human chốt §10)

### 4.1. Surface

| Chủ đề | Đề xuất |
|---|---|
| UI editor v1 | **Mọi preset có slide background image** (`supportsBackgroundImage`, trừ showcase/card-carousel) — human chốt2026-11-12 |
| Schema | Attr trên mọi slide (forward-compatible Showcase) |
| Frontend renderer | Áp focal khi preset hỗ trợ slide `backgroundImage*` **và** có ảnh |

#### 4.1.1. Phân tích Hero-only vs mọi slider có slide background (human)

**Cùng kiến trúc ảnh:** Hero, standard slider, step/fullscreen (1.3.24), và preset “2-side” (nếu dùng cùng `skvn-slide__bg` + `backgroundImage*`) đều **crop bằng `object-fit: cover` + `object-position`**. Focal **không** phụ thuộc Hero fill (068).

| Lựa chọn UI v1 | Ưu điểm | Nhược điểm |
|---|---|---|
| **Hero-only** | QA hẹp; khớp 068; ín inspector noise | Step / 2-side phải chờ v2 hoặc mở tay trong CSS |
| **Mọi preset có slide bg** (`supportsBackgroundImage` = không showcase/card) | **Một lần code**, Step + carousel + Hero cùng UX; human đã test fill có thể muốn focal ngay trên cùng ảnh nền | QA thêm vài preset; Apply modal dùng chung nhưng cần test slider nhiều slide/step |

**Đề xuất kỹ thuật (implementation):** `supportsBackgroundImage` trong `edit.tsx` (đã có) + điều kiện `hasImage` → hiện FocalPointPicker — **không** hardcode `preset === 'hero'`. Chênh effort Hero-only vs all-supporting: **chỉ bỏ 1 guard**, renderer PHP **đã** preset-aware cho ảnh.

**Human chốt2026-11-12 (product v1):** UI focal trên **mọi preset có slide background image** (trừ product-showcase / card-carousel). Fill 068 vẫn Hero-only; focal acceptance **HSF-*** tách HSB.

**Step Slider 1.3.24:** Chưa start milestone — focal attrs **sẵn** khi Step dùng cùng Slide block; test Step ghi **defer** trong runbook tới khi Step in scope.

### 4.2. Data model

Slide `skvn-marine/slide`:

| Attribute | Type | Default / ghi chú |
|---|---|---|
| `backgroundImageFocalPoint` | `object` `{ x: number, y: number }` | Omitted → normalize **0.5 / 0.5** |
| Giữ | `backgroundImageId`, `Url`, `Alt`, `overlayOpacity`, fill attrs 068 | |

**Output CSS (một owner):**

```text
object-position: calc(x * 100%) calc(y * 100%);
```

Trên **cả** `.skvn-slide__bg img` và `.skvn-slide__background-image` (editor + PHP render đồng bộ).

Tùy chọn kỹ thuật: inline `style` trên `<img>` **hoặc** CSS var trên `.skvn-slide--has-background`:

`--skvn-slide-bg-pos-x`, `--skvn-slide-bg-pos-y` → rule chung trong `style.css` (dễ parallax, tránh duplicate inline).

**Sanitize PHP:** `x`,`y` float clamp `0..1`, `round` 3–4 decimal; reject non-finite.

### 4.3. Hành vi khi đổi ảnh

| Hành vi | Đề xuất |
|---|---|
| Chọn / Replace image | **Giữ** focal đã chỉnh — **human chốt2026-11-12** (ảnh mới có thể cần chỉnh lại — editor thấy ngay) |
| Remove image | Không cần xóa attr focal (ẩn control khi không có ảnh) |
| Reset focal | Nút **Reset to center** cạnh picker |

### 4.4. Editor UX

Trong panel **Background** (sau Fill, khi có ảnh):

```text
Background image focal point
├── FocalPointPicker (url = resolvedImageUrl)
├── [ Reset to center ]
└── (optional) read-only "Position: 62% · 28%"
```

**Không** bắt buộc click-to-set trên stage slide v1 (picker đủ); stage drag = v2 nếu human muốn.

### 4.5. Modal Apply (068) — mở rộng

| Kênh | Human chốt2026-11-12 |
|---|---|
| **Image focal point** | Checkbox riêng, default **off** — **Focal only** |
| Khi **Background image** on | **Luôn copy** `backgroundImageFocalPoint` cùng patch (ảnh + focal + overlay theo tick overlay) |

**Cả hai:** (1) Focal-only → chỉ `backgroundImageFocalPoint`; (2) Image on → kèm focal bắt buộc.

**Case Focal-only:** Source A → targets B,C (ảnh khác): chỉ anchor crop, không đụng `backgroundImage*`.

Helper text: `Does not replace images unless Background image is included.`

### 4.6. Parallax & responsive

- Focal cố định trên img; parallax translate wrapper — **không** đổi math parallax v1.
- Acceptance: focal ổn với/không parallax; mobile height clamp Hero vẫn crop quanh focal.
- `prefers-reduced-motion`: không đổi focal.

### 4.7. Content Actions (057)

- Nếu copy slide content giữ attrs: thêm `backgroundImageFocalPoint` vào `SLIDE_FIELDS` (`fields.ts`) kind object hoặc pair floats — **cùng commit** implement để paste không strip focal.

## 5. Implementation slice (khi human “implement”)

1. `block.json` + TS types  
2. `fill.ts` hoặc `background-image.ts` — `focalPointToObjectPosition()`, normalize  
3. `edit.tsx` — FocalPointPicker; preview img style  
4. `save.tsx` + `slider-render.php` — var hoặc inline trên img  
5. `style.css` — rule `object-position` từ var; bỏ hardcode `center` chỉ khi var set  
6. `apply-background-modal.tsx` — channel Focal / gộp Image  
7. Runbook cases; optional unit test normalize  

Không bump version trong lượt planning-only.

## 6. Acceptance HSF-* (Hero Slide Focal)

| ID | Nhóm | Mong đợi |
|---|---|---|
| HSF-UI-01 | Block UI | Hero + ảnh: kéo focal → editor và frontend cùng vùng nhìn (so cùng viewport) |
| HSF-UI-02 | Block UI | Reset → center; slide cũ không attr → center |
| HSF-UX-01 | Editor UX | Replace ảnh giữ focal; Remove ảnh ẩn control |
| HSF-UX-02 | Editor UX | Apply: focal-only không đổi image url; image channel copy kèm focal theo spec §4.5 |
| HSF-TECH-01 | Technical | Sanitize clamp; invalid saved → center, không fatal |
| HSF-TECH-02 | Technical | Parallax on/off không drift focal; Showcase/Card regression không đổi khi không ảnh slide bg |

## 7. Tension

| Tension | Severity | Ghi chú |
|---|---|---|
| Thêm schema sau 044 “no schema” | low | Cùng nhóm 068 slide product data |
| Hai selector img (.bg img vs .background-image) | low | Một helper output, một CSS rule |
| Milestone 1.3.21 đã nặng | low | Slice nhỏ, chung Background panel |

## 8. Human chốt trước implement (§10 checklist)

- [x] Phương án **A — FocalPointPicker** — human2026-11-12  
- [x] UI **mọi preset có slide background** — human2026-11-12  
- [x] Apply: **cả hai** (Focal-only checkbox + focal kèm khi Background image on) — human2026-11-12  
- [x] Đổi ảnh: **giữ** focal — human2026-11-12  

**Status:** IMPLEMENTED source2026-11-13 — runtime HSF-* Chờ kiểm chứng.
