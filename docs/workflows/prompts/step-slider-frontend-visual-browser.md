# Prompt — browser đo Step Slider frontend so với artifact

Copy từ dòng `Bạn làm việc` đến hết. Có browser. Không sửa source plugin, theme, CSS, JS, PHP, hay plan.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: đo giao diện frontend của block Step Slider trên trang đang chạy, đối chiếu artifact, rồi ghi số vào đúng một file:

docs/testing/step-slider-frontend-visual-delta.md

Thêm một mục mới ở cuối file, tiêu đề:

## [ngày giờ] | browser

Không sửa các mục đã có. Không commit. Không đề xuất sửa code trong file đó. Không kết luận PASS.

## Đọc trước

docs/testing/step-slider-frontend-visual-delta.md

Đó là premise. State A là artifact. State B là source. State C là khóa. Không đọc thêm source trừ khi một số đo dưới đây mâu thuẫn premise.

Artifact mở bằng hai file. Cả hai cần Internet để tải Tailwind và Swiper. Nếu CDN lỗi, ghi lại và vẫn đo trang live.

docs/ideations/sliders/from-soil-to-harvest/artifacts/step-slider-prototype.html
docs/ideations/sliders/from-soil-to-harvest/artifacts/step-slider-prototype-manual.html

Mũi tên chỉ có trong bản manual. Vị trí là việc phải đo, không chỉ hình nút. Premise trong file delta, mục “Vị trí — human 2026-11-17”.

## Trang

Dùng trang public human đang mở nếu đó là trang có Step Slider. Không có thì mở:

https://minhhaifishery.com/test-page-2/

Không vào wp-admin. Không bấm Save, Update, Preview. Không gõ vào nội dung.

## Test

Làm đúng thứ tự. Dừng và ghi nếu không thấy block.

1. Ghi URL. Đếm `.skvn-step-slider`. Ghi class của root: có `.is-ready` hay không. Đếm `.skvn-step-slide`, nút tab, nút mũi tên, nút Play.

2. Với một bước CÓ ảnh và một bước KHÔNG ảnh (nếu cả bốn bước đều có hoặc đều không, ghi điều đó và đo bước 1): chụp ảnh viewport desktop. Rồi trong trang, chạy và ghi nguyên kết quả:

const slide = document.querySelector('.skvn-step-slide--has-background') || document.querySelector('.skvn-step-slide');
const cs = getComputedStyle(slide);
const content = slide.querySelector('.skvn-step-slide__content');
const overlay = slide.querySelector('.skvn-step-slide__overlay');
const h = content.querySelector('h1,h2,h3,h4,h5,h6');
const p = content.querySelector('p');
({
  slideBg: cs.backgroundColor,
  slideW: Math.round(slide.getBoundingClientRect().width),
  contentMax: getComputedStyle(content).maxWidth,
  contentPad: getComputedStyle(content).padding,
  contentAlign: getComputedStyle(content).textAlign,
  overlay: overlay ? getComputedStyle(overlay).backgroundImage.slice(0, 180) : 'none',
  headingSize: h ? getComputedStyle(h).fontSize : 'no-heading',
  headingSheet: h ? (getComputedStyle(h).fontSize && '') : '',
  paraColor: p ? getComputedStyle(p).color : 'no-p'
})

Với heading, trong DevTools hoặc bằng cách đọc document.styleSheets không cần. Chỉ ghi font-size và color đã computed. Nếu nhìn thấy rule WindPress hoặc theme đè, ghi selector và file, tối đa một dòng.

3. Thanh tab. Ghi computed của `.skvn-step-slider__tabs` (display, position, bottom, backgroundColor, width so với slider) và của tab `[aria-current="true"]` (borderRadius, backgroundColor, color, fontSize). Ghi text nội dung nút tab: có số `01` hay chỉ nhãn. Ghi computed của `.skvn-step-slider__tab-progress` trên tab đang mở: height, top, bottom, width, backgroundColor. Đợi khoảng 2 giây khi autoplay chạy rồi ghi lại width một lần nữa. Không đổi bước bằng cách kéo thanh.

4. Play và mũi tên — đo hộp, không chỉ cỡ nút. Ghi `hidden` của `.skvn-step-slider__play`, chữ nhìn thấy, và `getBoundingClientRect` của Play so với slider (top, right). Với prev và next, ghi text trong nút và:

const root = document.querySelector('.skvn-step-slider');
const rb = root.getBoundingClientRect();
[...root.querySelectorAll('.skvn-step-slider__arrow')].map(el => {
  const b = el.getBoundingClientRect();
  return { t: el.className, x: Math.round(b.left - rb.left), y: Math.round(b.top - rb.top), w: Math.round(b.width), h: Math.round(b.height) };
})

Làm lại đúng câu đó sau khi viewport rộng khoảng 390px. Kỳ vọng source, chưa phải số live: desktop hai nút giữa hai cạnh; mobile artifact manual gom cả cặp lên góc trên trái. Ghi live có gom hay vẫn giữa cạnh.

5. Kéo viewport khoảng 390px rộng, chụp thanh tab. Ghi: bốn nhãn còn đọc được hay bị cắt; thanh có scroll ngang không; cuộn thanh có làm đổi bước không. Cuộn nhẹ một lần rồi trả lại. Không bấm tab.

6. Mở bản manual cùng chiều ngang desktop, chụp một bước, rồi kéo còn khoảng 390px và chụp góc trên trái nơi hai mũi tên đứng. Một câu vị trí: mũi tên, thanh tab, progress, cột chữ, góc trên phải — live đứng chỗ nào so với bản manual. Không chép màu `#3ddc84`.

## Ghi vào file

Mục mới gồm:

- URL, số block, class root
- Bước có ảnh / không ảnh: object computed ở bước 2
- Tab, progress lúc đầu và sau khoảng 2 giây
- Play hidden hay hiện, mũi tên text và kích thước
- Mobile 390: nhãn, scroll, có đổi bước không
- Một câu khớp hoặc lệch từng mục Paint
- Ảnh: nói đã chụp desktop live, mobile tab, artifact. Không nhúng ảnh vào file markdown nếu đường dẫn nằm ngoài repo.

Không sửa source. Không kết luận PASS. Không chọn màu mới. Không bảo nên dùng max-width 46rem.
```
