# Prompt — Step Slider convention repair + palette + text animation (plan 085)

Ngày: **2026-11-19**. Planning đã xong; copy khối `text` sang agent coding.

Human giao prompt này = **CODE_NOW** toàn bộ gói A–F của 085. Không hỏi lại “có implement không?”, không viết plan dài. Không bump metadata, không zip/deploy, không git push, không `npm run build` / lint.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: CODE_NOW implement plan 085 — sửa lệch convention Step Slider, palette progress đúng Inspector WP, và text animation hai preset từ RevSlider. Không viết lại plan. Không chạy build, lint, deploy. Không commit trừ khi human lệnh. Không kết luận runtime PASS.

Plan duy nhất (source of truth):
.context/planning/085_VER_1_3_24_STEP_SLIDER_CONVENTION_REPAIR_PLAN.md

Quyết định text animation (đọc cùng Gói F):
docs/decisions/sliders/step-slider/step-slider-text-animation-1.3.24.md

Đọc AGENTS.md trước; load GLOBAL → MILESTONES → toàn TENSIONS_OPEN → TENSIONS_ACTIVE (SS-DS-01 13:36) → module plugin. Convention: L0 + hàng CSS/responsive + A5.6/A5.10/A5.11/A6.2–A6.4/A7.3/A8.3/A9 khi đụng đúng gói. Ghi khối "Đã đọc" khi giao code. Không đọc hết CONVENTION.md. Không đọc plan 084 (1.3.25 loại trừ Step Slider).

Current: V1 / 1.3.24 — Fullscreen Step Slider. Giữ current/metadata. Không archive tension. Không sửa GeneratePress.

## Thứ tự gói (bắt buộc)

A → F → B → C; rồi D; rồi E.
- A rồi F: cùng edit.tsx parent — không song song.
- F rồi D: cùng style.css — không song song.
- Trần 3–5 file / gói. Một gói xong rồi mới gói sau. Không trộn hunk.

Gói A — default Decision Memo §4 phương án A: progress vào InspectorControls group="color" + __experimentalPanelColorGradientSettings. Không hỏi lại chỗ gắn panel.

## Đã khóa — không chọn lại

SS-DS-01: một attribute progressColor = slug palette HOẶC hex. Default #7ec8e3. Clear → #7ec8e3 (không undefined). Không tách customProgressColor / progressColorSlug. Không migrate bài cũ. Không sửa theme.json color.custom. disableCustomColors={false} CHỈ control progress, không fill.

Palette: một useSetting('color.palette'). Import:
  __experimentalPanelColorGradientSettings as PanelColorGradientSettings
từ @wordpress/block-editor. NEVER import tên không __experimental (DP-06 / WP 7.1). Progress chỉ màu đặc — không onGradientChange.

Text animation (human 2026-11-19) THẮNG 079 §8 / 083 khóa cascade. Không giữ translateY(0.75rem) / 400 ms / delay 0-100-200-300. Fade 800 + wipe 800 KHÔNG đổi. Ken Burns không mở.

Attribute mới textAnimation: enum slide | rise, default slide. Inspector English: "Text animation" / "Slide" / "Fade + Rise". Không nhãn tiếng Việt.

Preset A slide: translateX(56px), 600 ms, delay heading+kicker 0 / paragraph+list 90 / buttons 180.
Preset B rise: translateY(24px), 550 ms, delay 0 / 100 / 200.
Easing cubic-bezier(0.22, 1, 0.36, 1) cho cả opacity và transform.
Chỉ transform + opacity. Text ra: cắt ngay khi mất .swiper-slide-active (hoặc fade ≤200 ms). Last-wins CSS-first; frontend.ts chỉ khi spam tab không restart. Reduced motion tắt text + progress tab. Tab label không animate. Cấm split-char, typewriter, blur, scale, rotate, stagger > 300 ms, raw ms control.

Kicker = .wp-block-paragraph:first-child cùng delay heading.

A5.11: dwellPreset fallback enum; pauseOnHover !== false; SelectControl textAnimation fallback slide.
RangeControl allowReset: tabHeight → 54; overlayOpacity → 100.

Motion thuộc plugin (block-animation-strategy). Không theme animations.js. Không src/shared/ cho fill (Gói E local step-slide). Không copy syncViewportHeight / 100vw / overflow-x hidden trên tổ tiên. Gói D không phóng mũi tên mobile lên 44px (081 khóa hình).

## File được sửa (đúng list gói trong 085)

Gói A: src/step-slider/edit.tsx; editor.css chỉ nếu panel color cần spacing.
Gói F: src/step-slider/block.json, edit.tsx, style.css, modules/step-slider-render/step-slider-render.php; frontend.ts chỉ nếu last-wins CSS fail.
Gói B: src/step-slide/edit.tsx
Gói C: modules/step-slider-render/step-slider-render.php
Gói D: src/step-slider/style.css (và PHP aria-label tab nếu 085 ghi)
Gói E: src/step-slide/save.tsx, edit.tsx hunk fill/overlay; PHP chỉ nếu comment nguồn fill.

Cấm: themes/generatepress/**, src/slider/**, src/slide/fill.ts, src/slide/focal.ts, theme.json, plan 084, block khác 1.3.25.

## Dừng và hỏi human khi

- Import __experimentalPanelColorGradientSettings không tồn tại trên runtime đích (báo đúng tên wp.blockEditor, không đoán ColorGradientSettingsDropdown).
- save.tsx Gói E làm Editor báo invalid content — dừng, deprecated A5.10, không sửa câm save.
- Cần file ngoài list gói đang làm.
- Cần hành vi không có trong 085.

Không dừng để hỏi lại: tách progressColor, default hex, group="color", hai preset text, English UI, fade/wipe 800, Ken Burns.

## Xong lượt thì báo

- Gói nào xong, file đã sửa.
- Checklist acceptance từng gói (085) — source only, không PASS runtime.
- Lệnh để human tự chạy (nguyên văn, agent không chạy):

source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;

- Command treo/timeout: dừng, đưa đúng lệnh, không retry/poll.
- Không git add . / reset / clean. Không commit trừ lệnh human. Không deploy.
```
