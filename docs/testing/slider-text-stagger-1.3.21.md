# Slider text stagger (1.3.21)

Plan: `.context/planning/075_VER_1_3_21_SLIDER_TEXT_STAGGER_PLAN.md`

## Target

Slider Hero, một slide mỗi view, ít nhất hai slide. Mỗi slide có heading, paragraph, và buttons đặt thẳng trong slide (không bọc Group). Frontend sau build plan 075.

## Preconditions

- Plugin build từ source có `contentMotion`.
- `prefers-reduced-motion` tắt, trừ STA-07.
- Text motion mặc định Off.

## Steps

1. Editor, Presentation: xác nhận **Text motion** có Off và Stagger. Đổi sang card carousel, hoặc slides per view > 1: control biến mất. Chữ trong editor không mờ và không trượt.
2. Hero, Text motion **Off**, Transition **Fade**. Frontend, bấm next. Chữ không có entrance riêng.
3. Off, Transition **Directional wipe**. Frontend, bấm next. Heading trượt ngang trước, paragraph sau, buttons cuối.
4. Text motion **Stagger**. Thử Fade, rồi Slide, rồi Directional wipe. Mỗi lần bấm next: heading hiện từ dưới trước, paragraph sau, buttons cuối. Ảnh không phóng thêm vì control này.
5. Thêm heading thứ hai thẳng trong slide. Cả hai heading vào cùng lúc. Hai nút trong một block Buttons vào cùng lúc.
6. Bọc heading trong Group. Cả group vào một nhịp, heading bên trong không trễ riêng.
7. DevTools: `data-skvn-slider` chứa `"contentMotion":"stagger"`. Root có `skvn-slider--content-stagger` sau khi slider init. Canvas editor không có class đó.
8. Bật `prefers-reduced-motion: reduce`, reload. Không còn class stagger. Chữ hiện ngay. Tắt lại. Slider một slide, và card carousel: không có class stagger.
9. Tab qua slider. Ghi nút của slide không đang xem có nhận focus hay không.

## Expected

| ID | Pass |
|---|---|
| STA-01 | Control Off / Stagger khi một slide hiện. Ẩn khi nhiều slide một view. Editor không animate chữ. |
| STA-02 | Off + Fade/Slide: không entrance chữ. Off + wipe: stagger ngang cũ còn. |
| STA-03 | Stagger: heading, rồi paragraph, rồi buttons. Ảnh không scale vì control này. |
| STA-04 | Hai heading cùng nhịp. Cả block buttons một nhịp. |
| STA-05 | Group vào như một khối. |
| STA-06 | JSON `contentMotion` là `stagger`. Class có trên frontend sau init, không có trong editor. |
| STA-07 | Reduced motion, một slide, carousel nhiều card: không class stagger, chữ hiện. |
| STA-08 | Ghi focus của nút trên slide không active. Không cần sửa trong đợt này. |

## Evidence

Transition đang chọn, thứ tự chữ lúc bấm next (heading / paragraph / buttons), và class trên root slider ở frontend. STA-08: có hoặc không focus được nút slide kia.

## Fade theo cụm

Cùng slider. Text motion **Fade**. Không có control hướng.

1. Editor: Text motion có Off, Stagger, Fade. Không có ô hướng hay delay. Chữ trong editor không animate.
2. Frontend, bấm next. Cụm đầu vào từ phải. Cụm thứ hai vào sau khoảng 0.2s. Hai heading đặt thẳng trong slide không vào cùng lúc.
3. Bấm previous. Các cụm vào từ trái, cùng bước 0.2s.
4. Bọc một heading trong Group. Group là một bước. Cả block Buttons là một bước; hai nút bên trong không tách.
5. Đổi lại Stagger. Mọi heading vào cùng lúc, từ dưới lên.
6. `prefers-reduced-motion: reduce`, slider một slide, và card carousel: root không có `skvn-slider--content-fade`.
7. DevTools: `data-skvn-slider` chứa `"contentMotion":"fade"`.

| ID | Pass |
|---|---|
| FAD-01 | Off, Stagger, Fade. Không control hướng. Editor không animate. |
| FAD-02 | Next: cụm 1 từ phải, cụm 2 trễ 200 ms. Hai heading thẳng không cùng nhịp. |
| FAD-03 | Previous: từ trái, bước 200 ms. |
| FAD-04 | Group một bước. Cả block buttons một bước. |
| FAD-05 | Stagger vẫn mọi heading cùng nhịp, từ dưới lên. |
| FAD-06 | Reduced-motion, một slide, carousel: không class `skvn-slider--content-fade`. |
| FAD-07 | JSON `contentMotion` là `fade`. |
