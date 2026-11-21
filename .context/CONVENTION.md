# Convention cho AI Agent làm plugin WordPress

Tài liệu này là bộ quy ước bắt buộc khi AI Agent viết, sửa hoặc review plugin WordPress. Nó tổng hợp thực hành của WordPress Core, các team agency lớn (10up, WordPress VIP, WooCommerce/Automattic) và cộng đồng plugin chuyên nghiệp, rồi chuyển thành luật áp dụng được ngay: mỗi mục ghi rõ **MUST** (bắt buộc), **SHOULD** (nên, lệch phải ghi lý do) và **NEVER** (cấm).

Tài liệu tách thành bốn phần luật chung và một phần bài học dự án, dùng riêng được:

- **Phần A — Giao diện:** frontend, responsive, Admin UI, Editor UI (Gutenberg) và cách UI nối với backend.
- **Phần B — Cơ sở dữ liệu:** chọn nơi lưu dữ liệu, thiết kế schema, migration, truy vấn và cache.
- **Phần C — Backend và API:** kiến trúc PHP, bảo mật, hooks, Settings API, REST API, AJAX, cron và phát hành.
- **Phần D — Design Pattern và Trigger:** khi nào mới được tách, trừu tượng hoá hoặc áp một pattern — và khi nào phải giữ nguyên. Phần này không dạy pattern theo catalogue; nó ra quyết định theo trigger đo được, ví dụ một setting lặp lần thứ 3 ở các tính năng khác nhau thì bắt buộc tách theo DRY.
- **Phần E — Hồ sơ bài học từ dự án thật (skvn-marine):** nơi ghi nguồn gốc, ngày và phạm vi của các bài học rút ra khi chạy trên dự án thật. Văn bản luật có hiệu lực của các bài học này nằm ngay tại mục chuyên môn tương ứng (A5.11 và A9), để Agent đọc đúng một chỗ; Phần E chỉ giữ hồ sơ và bảng đối chiếu, không giữ bản sao thứ hai của checklist.

Cách một bài học dự án đi vào tài liệu này được điều chỉnh bởi mục 0.5: khi chủ dự án yêu cầu digest một PITFALL, Agent phải digest, research và chỉ tạo luật mới khi chưa có luật tương đương. Mục 0.5 là luật có hiệu lực cho việc đó; không yêu cầu digest thì không tự digest.

Đọc tài liệu này theo Chỉ mục đọc ngay dưới đây, không đọc tuyến tính từ đầu tới cuối.

Quy ước đặt tên dùng xuyên suốt tài liệu: `<prefix>` là tiền tố duy nhất của plugin, tối thiểu 4–5 ký tự, không phải từ tiếng Anh thông dụng và không trùng tiền tố của core (`wp_`, `__`, `_`). Ví dụ minh họa dùng prefix `acme`. Mọi tên hàm, class, hằng, option, meta key, hook, REST namespace, CSS class và tên bảng đều bắt đầu bằng prefix này.

# Chỉ mục đọc — Agent không đọc hết tài liệu này

Tài liệu này dài và sẽ còn dài thêm. Không một task code nào cần đọc hết từ đầu tới cuối, và việc cố đọc hết làm loãng chú ý ở đúng chỗ nguy hiểm. Phần này là cổng vào duy nhất: mọi task đều bắt đầu ở đây, đi theo bảng định tuyến tới đúng các mục cần đọc, và dừng lại ở đó.

## Đọc theo giao thức 4 bước

**Bước 1 — Phân loại task.** Đặt task vào một, hoặc tối đa hai, hàng của bảng định tuyến ở mục "Bảng định tuyến theo loại task" dưới đây. Task không khớp hàng nào thì phân loại theo dữ liệu nó chạm vào: nó ghi dữ liệu gì, hiển thị ở đâu, ai được phép làm.

**Bước 2 — Đọc theo tuyến.** Đọc đủ ba lớp: lớp luôn đọc (L0), các mục ở cột "Đọc bắt buộc" của hàng đã chọn, và các mục ở cột "Đọc thêm khi" nếu điều kiện trong cột đó đúng với task. Ngoài ba lớp này, không đọc thêm.

**Bước 3 — Kiểm tra tín hiệu mở rộng.** Quét task và code sắp sửa theo bảng "Tín hiệu mở rộng" dưới đây. Mỗi tín hiệu khớp cộng thêm một mục phải đọc, dù bảng định tuyến không trỏ tới.

**Bước 4 — Ghi lại và chạy gate.** Khi giao code, ghi khối "Đã đọc" theo mẫu ở cuối phần này và chạy đúng checklist gate tương ứng ở Phụ lục 1, cộng gate riêng của recipe nếu task có recipe ở Phụ lục 4. Không ghi được khối "Đã đọc" nghĩa là chưa đọc, và chưa đọc thì chưa giao.

## Các lớp đọc

- **L0 — Luôn đọc, mọi task, không ngoại lệ:** phần này (Chỉ mục đọc) và mục 0.1–0.5. Đây là lớp duy nhất phải thuộc nằm lòng. Nó chứa thứ tự ưu tiên khi xung đột, quy trình năm câu hỏi trước khi viết code, ý nghĩa của MUST / SHOULD / NEVER, kỷ luật phiên bản và điều kiện kích hoạt của luật digest PITFALL ở 0.5 — thân quy trình của 0.5 chỉ phải đọc trọn khi có yêu cầu digest.

- **L1 — Đọc theo tuyến:** các mục bảng định tuyến trỏ tới. Đây là phần thân của mỗi task, thường từ 3 tới 8 mục.

- **L2 — Đọc khi có tín hiệu:** các mục do bảng tín hiệu mở rộng cộng thêm, ví dụ task chạm tới tiền, điểm, đáp án, dữ liệu cá nhân hoặc file tải lên.

- **L3 — Tra cứu, không đọc trước:** Phụ lục 2 (anti-pattern), Phụ lục 3 (mẫu yêu cầu đầu vào), Phụ lục 5 (bảng quyết định nhanh) và phần Nguồn tham khảo. Chỉ mở khi gặp đúng tình huống chúng giải quyết.

## Ngân sách đọc theo cỡ task

- **Task XS** — sửa một control, một câu CSS, một trường setting đơn lẻ: L0 + 1–3 mục L1. Nếu phải đọc quá 3 mục, task đã bị phân loại sai hoặc phạm vi đã phình.

- **Task S** — thêm một setting, một trường meta, một endpoint đơn lẻ: L0 + 3–5 mục L1 + gate tương ứng ở Phụ lục 1.

- **Task M** — một block mới, một màn hình admin mới, một bảng mới: L0 + 5–8 mục L1 + recipe tương ứng ở Phụ lục 4, đọc recipe trước rồi mới đọc các mục recipe trỏ tới.

- **Task L** — tính năng chạm cả UI, DB và API, hoặc thay đổi phá vỡ tương thích: L0 + cả một phần (A, B hoặc C) liên quan + recipe + mục C12 về tương thích. Đây là cỡ task duy nhất được phép đọc trọn một phần.

- Vượt ngân sách là có lý do phải nói ra khi giao: ghi rõ đã đọc thêm mục nào và tín hiệu nào bắt phải đọc thêm. Đọc thừa không bị phạt, đọc thừa mà không nói vì sao mới là dấu hiệu phân loại kém.

## Bảng định tuyến theo loại task

Cột "Đọc bắt buộc" là tối thiểu. Cột "Đọc thêm khi" chỉ đọc khi điều kiện đứng trước dấu hai chấm đúng. Số mục như A5.4 là số mục trong tài liệu này.

| Task | Đọc bắt buộc | Đọc thêm khi | Gate |
|---|---|---|---|
| Tạo block static mới | 0, A5.1–A5.4, A5.7 | Có style riêng: A3, A5.6 · Có media: A7.3 | Phụ lục 1, Giao diện |
| Tạo block dynamic mới | 0, A5.1–A5.2, A5.7, A8.1 | Dữ liệu từ DB: B1, B5 · Có REST riêng: C6 | Phụ lục 1, cả ba |
| Thêm setting màu, chữ, khoảng cách | A5.4, A5.5, A6 | Phần tử con: A6.2–A6.4 · Chữ con: A7.2 · Khoảng cách con: A7.1 | Phụ lục 1, Giao diện |
| Thêm setting không phải style | A5.3, A5.5, A5.6 | Giá trị là ID thực thể: A7.5 · Danh sách lặp: A7.4 | Phụ lục 1, Giao diện |
| Sửa block đã phát hành | A5.2, A5.10 | Đổi attribute: A5.10 · Đổi tên/mô hình: C12 | Phụ lục 1, Giao diện |
| Kiểm tra độc lập theme–plugin, width và deploy | A9, A3 | Live khác local: A9.2 · Bleed của theme/framework: A9.3 | Phụ lục 1, Giao diện + Recipe 15 |
| Self-check attribute `undefined` và pattern của control trước commit | A5.11 | Component lạ từ `wp.components`: A5.11 · Đổi attribute: A5.10 | Phụ lục 1, Giao diện + Recipe 15 |
| Thêm media vào block | A5.5, A7.3 | Upload phía frontend: C3.2 · Lưu ID ở DB: B2 | Phụ lục 1, Giao diện |
| Thêm InnerBlocks, block cha–con | A5.1, A5.3, A7.4 | Cần context chung: A5.1 · Cần template khóa: A7.4 | Phụ lục 1, Giao diện |
| CSS frontend, responsive | A1, A2, A3 | Có bảng dữ liệu: A2.4 · Có ảnh: A2.5 · Có form: A1 | Phụ lục 1, Giao diện |
| Trang Settings cổ điển | A4.1–A4.2, C5, B8 | Có trường bí mật: C5 · Có React: A4.3 | Phụ lục 1, Backend |
| Màn hình admin React, danh sách lớn | A4.3–A4.4, A8.2, C6 | Cần DataViews: A4.4 · Cần phân trang: C6.4 | Phụ lục 1, cả ba |
| Chọn nơi lưu dữ liệu | B1, B2 | Phân vân CPT hay bảng: B10 · Dữ liệu tạm: B7 | Phụ lục 1, DB |
| Tạo CPT, taxonomy, meta | B1, B2, B10, C1 | Cần REST/Editor: B10 · Meta nhạy cảm: C3, B10 | Phụ lục 1, DB |
| Tạo custom table mới | B1, B3, B4, B5 | Có bất biến duy nhất: B3.2 · Multisite: B9 | Phụ lục 1, DB |
| Viết migration, nâng schema | B4, B5 | Migration phá hủy: B4.2, B11 · Chạy nền: C8 | Phụ lục 1, DB |
| Viết query, repository, báo cáo | B5, B6, B7 | Query trên meta: B6, B10 · Tổng hợp lớn: C8 | Phụ lục 1, DB |
| Option, cache, transient | B7, B8, C5 | Cache theo user: B7 · Setting qua REST: C6 | Phụ lục 1, DB |
| Tạo REST CRUD mới | C6.1–C6.4, C3 | Field nhạy cảm: C6.3 · Cần rate limit: C6.5 | Phụ lục 1, Backend |
| Tạo REST action (submit, tính điểm) | C6, C3, A8.2 | Chống trùng: B3.2, C6.5 · Việc nặng: C8 | Phụ lục 1, Backend |
| Thêm AJAX | C7, C3, A8.1 | Cho khách chưa đăng nhập: C7 · Có ghi dữ liệu: B5 | Phụ lục 1, Backend |
| Cron, job nền, hàng đợi | C8, B5 | Dữ liệu lớn, xóa theo lô: B6 · Theo dõi job: C10 | Phụ lục 1, Backend |
| Gọi API ngoài, nhận webhook | C9, B7 | Webhook: C9.2, B3.2 · Có bí mật: C3.1 | Phụ lục 1, Backend |
| Gỡ plugin, riêng tư, multisite | B9, B11 | Có dữ liệu cá nhân: B9 · Bảng toàn mạng: B9 | Phụ lục 1, DB |
| Sửa hook, filter công khai | C4, C12 | Hook đã phát hành: C12 · Trả dữ liệu lạ: C4 | Phụ lục 1, Backend |
| Review bảo mật, sửa lỗ hổng | C3, C6.2, C7 | Có upload: C3.2 · Có webhook: C9.2 | Phụ lục 1, Backend |
| Tối ưu hiệu năng | A3, B6, B7, C13 | Autoload phình: B8 · N+1: B6 · Asset nặng: A3 | Phụ lục 1, cả ba |
| Test, CI, phát hành | C11, C12 | Có thay đổi DB: B4 · Có deprecated: A5.10 | Phụ lục 1, cả ba |
| Thấy code/setting/logic lặp lại, phân vân có tách không | D1, D2, D9 | Lặp là setting/control: D3 · Lặp là query/permission/validate: D4 · Chưa đủ ngưỡng: D9 | Phụ lục 1, Design Pattern |
| Tách setting/control dùng chung (DRY) | D3, A5.5 | Có validate/sanitize riêng: D3.4, C5.1 · Có render PHP: D3.5 | Phụ lục 1, Design Pattern + Giao diện |
| Thêm tính năng giống một tính năng đã có | D2, D5, D9 | Biến thể thứ hai: D5.1 · Biến thể thứ ba: D5.2 · Chỉ giống tình cờ: D9.2 | Phụ lục 1, Design Pattern |
| Thêm biến thể hành vi (loại câu hỏi, cách chấm, nhà cung cấp, shell) | D5, D8 | Cần đăng ký mở rộng qua hook: D5.4, C4 · Cần adapter cho code ngoài: D7 | Phụ lục 1, Design Pattern + Backend |
| Refactor, tách class/component, đổi cấu trúc | D10, D11, C1 | Chạm dữ liệu đã lưu: B4, C12 · Chạm block đã phát hành: A5.10 | Phụ lục 1, Design Pattern + cả ba |
| Review code bị phình, khó sửa, sửa một chỗ phải sửa nhiều nơi | D2, D9, D10 | Có god class/file khổng lồ: D2 (T14–T16) · Có trừu tượng sai trục: D9.3 | Phụ lục 1, Design Pattern |
| Digest một PITFALL theo yêu cầu của chủ dự án | 0.5, Phần E | Pitfall thuộc mảng nào: mục chuyên môn đích của mảng đó · Pitfall đã đính chính: chỉ đọc bản [CORRECTED] | Phụ lục 1, Digest PITFALL + Recipe 16 |

## Bảng tín hiệu mở rộng — gặp là phải đọc thêm

| Tín hiệu trong task hoặc code | Đọc thêm ngay | Vì sao |
|---|---|---|
| Tiền, thanh toán, điểm, xếp hạng | B3.1, B3.2, C6.5 | Cần kiểu số chính xác, bất biến ở DB và chống ghi trùng |
| Đáp án, khóa chấm, nội dung chỉ server biết | A5.2, C6.3 | Thứ này lộ qua attribute hoặc REST là lỗi bảo mật, không phải lỗi UI |
| Dữ liệu cá nhân, email, dữ liệu trẻ em/học sinh | B9, C10 | Phải có exporter, eraser, retention và kỷ luật log |
| File tải lên, import, file đính kèm | C3.2, A7.3 | Kiểm tra loại file và đường lưu trữ là bề mặt tấn công riêng |
| Xóa, reset, ghi đè hàng loạt | A4.2, B6, B11 | Cần xác nhận, xóa theo lô và quyết định giữ hay xóa dữ liệu |
| Đổi tên, đổi kiểu, bỏ field/attribute/hook/route | A5.10, C12 | Đây là thay đổi phá vỡ tương thích, luôn cần deprecated hoặc migrate |
| Trên 10.000 bản ghi, hoặc lọc/sắp xếp thường xuyên | B3.2, B6 | Ngưỡng mà postmeta và query không index bắt đầu vỡ |
| Gọi dịch vụ ngoài, có API key, có tính phí | C9.1, B7, C6.5 | Cần timeout, thử lại, cache và giới hạn tần suất |
| Chạy định kỳ, chạy lâu, gửi hàng loạt | C8 | Việc như vậy không được nằm trong request của người dùng |
| Multisite, network activate, nhiều site | B9 | Prefix bảng, cache key và luồng kích hoạt đều khác site đơn |
| Selector có ở local nhưng không có trong CSS đã tải hoặc computed style trên live | A9.2 | Kết luận đúng là “chưa deploy”, không phải “CSS sai”; hai đường build/deploy của theme và plugin là khác nhau |
| Attribute tuỳ chọn không có `default`, hoặc component lấy từ `wp.components` chưa kiểm chứng ở runtime đích | A5.11 | `undefined` và tên component không tồn tại đều làm Editor gãy theo cách khó thấy; phải kiểm chứng ở runtime thật, không suy từ tài liệu |
| Người dùng cấp thấp cũng thao tác được | C3.1, C6.2 | "Đã đăng nhập" không bao giờ là đủ quyền |
| Cùng một setting, control, validation hoặc đoạn render xuất hiện lần thứ 3 ở tính năng khác | D2, D3 hoặc D4 | Đây là trigger cứng của DRY: không copy lần thứ 4, phải tách hoặc ghi lý do không tách theo D9 |
| Xuất hiện biến thể thứ hai của cùng một hành vi (loại thứ hai, nhà cung cấp thứ hai, shell thứ hai) | D5.1, D9 | Chưa bắt buộc tách hẳn, nhưng phải chuẩn bị ranh giới: không rẽ nhánh thêm bằng `if` rải rác |
| Sửa một thay đổi nhỏ mà phải sửa từ 3 nơi trở lên, hoặc một file/class vượt ngưỡng ở D2 | D2, D10 | Dấu hiệu cấu trúc đã sai trục, không phải dấu hiệu cần viết nhanh hơn |
| Code sắp copy từ tính năng khác sang, chỉ đổi tên biến/label | D2, D9.2 | Copy lần hai được phép có ghi chú; copy y nguyên lần ba là vi phạm nếu không qua D3/D4 |
| Block plugin chỉ đúng khi theme hiện tại đang bật, hoặc CSS của block nằm trong `style.css` của theme | A9.1, A3 | Plugin phải tự đứng được khi chỉ cài plugin; chrome và hộp của block đi cùng zip plugin |
| Block dùng `alignfull` và nghi bleed của khung cha | A9.3, A2, A3 | Phải phân biệt "chưa deploy" với "CSS sai" bằng CSS bytes trên live và `getComputedStyle` trước khi kết luận |
| Sửa hoặc thiết kế chrome trong canvas Editor (khung xem trước, stage, dải nằm trong block) | A5.12 | Chiều ngang thuộc hộp căn lề của block. Bỏ class align thì block hẹp hơn canvas. Ép full-bleed thì tràn cột cha |
| Chủ dự án yêu cầu digest một PITFALL (nêu mã pitfall, file pitfall, hoặc nói rõ "digest PITFALL …") | 0.5, Phần E | Đây là lệnh chạy quy trình ở 0.5, không phải lời mời tóm tắt: phải digest, research và quyết định có tạo luật hay không theo 0.5.3 |

## Bản đồ tài liệu — mỗi mục giải quyết việc gì

Dùng bảng này khi bảng định tuyến chưa đủ rõ, hoặc khi cần biết một mục tồn tại để tra cứu sau.

| Mục | Giải quyết việc gì | Khi nào mở |
|---|---|---|
| 0.1–0.4 | Ưu tiên khi xung đột, quy trình trước khi code, mức luật, phiên bản | Mọi task (L0) |
| 0.5 | Digest PITFALL theo yêu cầu: digest, research, tạo luật chỉ khi chưa có | Điều kiện kích hoạt ở 0.5.1 thuộc L0; thân quy trình chỉ mở khi chủ dự án yêu cầu digest một PITFALL |
| A1 | HTML ngữ nghĩa, WCAG, dịch, escape ở giao diện | Mọi task có UI |
| A2, A2.4–A2.5 | Responsive, breakpoint, bảng và ảnh trên mobile | Mọi task frontend |
| A3 | Kiến trúc CSS, BEM, enqueue, RTL, reduced motion | Mọi task có CSS |
| A4.1–A4.2 | Admin cổ điển, Settings, form, notice, list table | Trang admin không React |
| A4.3–A4.4 | Admin React, `@wordpress/components`, DataViews | Màn hình admin lớn, danh sách |
| A5.1–A5.2 | `block.json`, attribute, nơi dữ liệu block sống | Mọi task block |
| A5.3–A5.6 | Vị trí control, supports trước custom, tra cứu pattern, tổ chức Inspector | Mọi task Editor UI |
| A5.8–A5.10 | Ma trận supports đầy đủ, `block.json` mẫu, deprecated và migrate block | Block mới phức tạp, sửa block cũ |
| A6 | Setting màu trọn gói, ba mức, slug tách custom | Mọi task có setting màu |
| A7 | Media, khoảng cách, typography con, danh sách lặp, liên kết, control phụ thuộc | Theo loại setting |
| A8 | UI nối backend, apiFetch, bốn trạng thái, Interactivity API | Mọi task UI gọi dữ liệu |
| A5.11 | Atomic check cho attribute `undefined`, pattern ternary/boolean/`SelectControl`, kiểm chứng component ở runtime | Trước commit của mọi thay đổi Editor UI |
| A5.12 | Chiều ngang của chrome trong Editor: class căn lề trên root, chrome rộng 100% hộp đó | Khi vẽ hoặc sửa khung, stage, dải nằm trong canvas |
| A9 | Độc lập theme–plugin, hai lớp width, kiểm tra deploy DP-12 và bleed của theme/framework | Block phải chạy khi chỉ cài plugin; khi local và live lệch nhau |
| B1–B2 | Cây quyết định nơi lưu, đặt tên, đăng ký meta | Mọi task có dữ liệu mới |
| B3–B3.5 | Schema, kiểu cột, index, ba mẫu bảng điển hình | Tạo hoặc sửa custom table |
| B4 | `dbDelta`, phiên bản schema, migration idempotent | Tạo bảng, nâng cấp |
| B5–B5.1 | Repository, `prepare`, class truy cập dữ liệu mẫu | Mọi task chạm bảng riêng |
| B6–B8 | Hiệu năng query, cache, transient, autoload | Query lớn, option, cache |
| B9–B11 | Gỡ plugin, riêng tư, multisite, CPT chi tiết, retention | Phát hành, dữ liệu cá nhân, CPT |
| C1–C2 | Cấu trúc thư mục, khởi động, WPCS, PHPStan, ESLint | Plugin mới, refactor |
| C3 | Ma trận bảo mật: quyền, nonce, validate, sanitize, escape | Mọi task có điểm vào dữ liệu |
| C4–C5 | Hook công khai, Settings API, bảng loại trường setting | Mở rộng, trang cài đặt |
| C6–C6.7 | REST: route, permission, args, schema, response, controller mẫu | Mọi task API |
| C7–C8 | AJAX có kỷ luật, cron, Action Scheduler, WP-CLI | Tương tác cũ, việc nền |
| C9–C10 | API ngoài, webhook HMAC, log và quan sát | Tích hợp ngoài, gỡ lỗi |
| C11–C13 | Test, CI, phát hành, tương thích, hiệu năng backend | Trước khi merge và phát hành |
| D1–D2 | Nguyên tắc pattern theo trigger, bảng trigger tổng T01–T18 | Mọi task thấy lặp, thấy biến thể mới, hoặc muốn tách code |
| D3 | DRY cho setting, control, supports, validate của setting, render | Setting/control lặp, nhất là ở Editor UI |
| D4 | DRY cho backend: query, repository, permission, validate, response | Logic backend lặp ở từ hai nơi trở lên |
| D5 | Biến thể hành vi: Strategy, Adapter, Registry, Variation | Có loại/shell/nhà cung cấp/cách chấm thứ hai trở đi |
| D6 | Composition: block con, component, template, presenter | Muốn kế thừa, muốn nhồi thêm vào một block/class |
| D7 | Biên hệ thống: Adapter, Facade, anti-corruption cho API ngoài và code kế thừa | Gọi API ngoài, bọc Sensei/core/bên thứ ba |
| D8 | Catalogue pattern được phép: ý định, hình dạng WP, khi dùng, khi không | Khi D2 trỏ tới một pattern cụ thể |
| D9 | Anti-trigger: khi không được tách dù thấy giống | Trước mọi lần tách, để tự phản biện |
| D10–D11 | Quy trình refactor 7 bước khi trigger nổ, đặt tên và nơi đặt code đã tách | Mọi lần tách thật |
| D12 | Ba ví dụ trọn gói: màu, liên kết, chấm điểm | Khi cần mẫu đi hết một trigger từ đầu tới cuối |
| Phần E | Hồ sơ nguồn gốc của bài học skvn-marine và bảng đối chiếu sang A5.11, A9 | Khi cần biết một luật ở A5.11/A9 đến từ đâu, áp cho dự án nào; khi digest PITFALL theo 0.5 |
| Phụ lục 1 | Gate kiểm tra trước khi giao, theo bốn phần, cộng gate Digest PITFALL | Cuối mọi task |
| Phụ lục 2 | Anti-pattern bị cấm, gặp là sửa | Khi review |
| Phụ lục 3 | Mẫu yêu cầu đầu vào khi giao tính năng | Khi nhận task mới |
| Phụ lục 4 | Recipe đầu–cuối cho 16 việc thường gặp | Task M trở lên, làm theo bước |
| Phụ lục 5 | Bảng quyết định nhanh và thuật ngữ | Khi phân vân giữa hai cách làm |

## Sáu ví dụ đi qua chỉ mục

**Ví dụ 1 — "Thêm màu riêng cho icon trong block thẻ cảnh báo."** Phân loại: hàng "Thêm setting màu, chữ, khoảng cách". Đọc bắt buộc: A5.4, A5.5, A6. Điều kiện "phần tử con" đúng, nên đọc thêm A6.2–A6.4. Không tín hiệu mở rộng nào khớp. Tổng đọc: L0 + 5 mục. Gate: Phụ lục 1, phần Giao diện. Recipe liên quan: Recipe 3 ở Phụ lục 4.

**Ví dụ 2 — "Lưu mỗi lần học sinh nộp bài, chấm điểm ở server, xem lại lịch sử."** Phân loại: hai hàng — "Tạo custom table mới" và "Tạo REST action". Đọc bắt buộc gộp lại: B1, B3, B4, B5, C6, C3, A8.2. Tín hiệu khớp: "điểm" cộng B3.1, B3.2, C6.5; "đáp án" cộng A5.2, C6.3; "dữ liệu học sinh" cộng B9, C10. Tổng đọc: L0 + khoảng 12 mục — đúng cỡ task L, và phải nói rõ lý do vượt ngân sách khi giao. Recipe liên quan: Recipe 6 và Recipe 8.

**Ví dụ 3 — "Đổi attribute `layout` từ string sang object ở block đã có người dùng."** Phân loại: hàng "Sửa block đã phát hành". Đọc bắt buộc: A5.2, A5.10. Tín hiệu "đổi kiểu" cộng C12. Tổng đọc: L0 + 3 mục, nhưng cả ba đều là mục chặn merge: giao code thiếu `deprecated` và `migrate` là giao sai, dù phần còn lại đúng hết.

**Ví dụ 4 — "Thêm setting màu cho icon vào block thứ ba, hai block trước đã có setting y hệt."** Phân loại: hàng "Tách setting/control dùng chung (DRY)" cộng hàng "Thêm setting màu". Đọc bắt buộc: D1, D2 (trigger T01), D3, A5.4, A5.5, A6. Tín hiệu "lặp lần thứ 3" khớp, nên đây không còn là task thêm setting thường: làm đúng là tách định nghĩa setting và control dùng chung theo D3.1–D3.2 trước, rồi block thứ ba chỉ tiêu thụ bản đã tách. Copy đoạn control cũ sang block thứ ba là giao sai, dù giao diện ra đúng hình. Recipe liên quan: Recipe 13 ở Phụ lục 4.

**Ví dụ 5 — "Block slider tràn width trên live nhưng local thì đúng, chuẩn bị commit bản sửa."** Phân loại: hàng "Kiểm tra trước commit một block plugin". Đọc bắt buộc: A9, A3. Tín hiệu `alignfull` và "live khác local" cùng khớp, nên trước khi sửa CSS phải chạy trình tự DP-12 ở A9.2: đối chiếu CSS bytes trên live và `getComputedStyle` để phân biệt chưa deploy với CSS sai. Sửa CSS local khi bản chất là chưa deploy là giao sai, dù sửa xong local vẫn đẹp. Gate: Phụ lục 1, Giao diện; recipe liên quan: Recipe 15 ở Phụ lục 4. Nguồn bài học: Phần E.

**Ví dụ 6 — "Digest PITFALL DP-06 cho tôi."** Phân loại: hàng "Digest một PITFALL theo yêu cầu". Đọc bắt buộc: 0.5, Phần E. Quy trình bắt buộc theo 0.5: digest bản [CORRECTED] của DP-06 (không digest bản quy nhầm ban đầu như sự thật), research đối chiếu chỉ mục và tài liệu gốc, rồi quyết định theo 0.5.3. Kết quả đúng trong trường hợp này là "đã có luật" — nguyên tắc kiểm chứng component ở runtime đã nằm tại A5.11 — nên không tạo luật mới, chỉ báo lại mục đã chứa luật và, nếu thiếu, bổ sung một dòng hồ sơ ở Phần E. Tạo thêm một mục mới trùng A5.11 là giao sai, dù nội dung nghe đúng. Gate: Phụ lục 1, Digest PITFALL; recipe liên quan: Recipe 16 ở Phụ lục 4.

## Mẫu ghi "Đã đọc" khi giao code

Khối này đi kèm mọi lần giao code, đặt ở đầu mô tả công việc hoặc đầu phần trả lời. Nó là bằng chứng của giao thức đọc, không phải trang trí.

```text
Đã đọc: L0 (Chỉ mục + 0.1–0.5), A5.4, A5.5, A6.1–A6.4
Phân loại task: Thêm setting màu cho phần tử con (bảng định tuyến, hàng 3)
Tín hiệu mở rộng: không có
Recipe: Phụ lục 4, Recipe 3
Gate đã chạy: Phụ lục 1 — Giao diện (đạt / chưa đạt ở mục: …)
```

Thiếu một dòng trong khối này, người review có quyền trả lại mà không cần đọc code.

---

## 0. Cách AI Agent phải dùng tài liệu này

### 0.1. Thứ tự ưu tiên khi có xung đột

Khi hai cách làm đều chạy được, Agent chọn theo thứ tự sau và không tự đảo ngược:

1. Bảo mật và toàn vẹn dữ liệu thắng tiện lợi và tốc độ viết code.
2. Cơ chế gốc của WordPress (block supports, theme.json, core components, CPT, REST core) thắng giải pháp tự chế.
3. Dữ liệu đã lưu của người dùng thắng sự sạch đẹp của code: mọi thay đổi schema, attribute hay option đều phải có đường migrate.
4. Khả năng tương thích ngược (backward compatibility) của hook, filter, REST response và block đã lưu trong nội dung thắng việc đổi tên cho hay.
5. Hiệu năng đo được thắng hiệu năng suy đoán: không tối ưu khi chưa có số đo, không bỏ cache/index vì "chắc là nhanh".

### 0.2. Quy trình làm việc bắt buộc trước khi viết code

Trước khi sinh code cho một tính năng, Agent phải trả lời ngắn gọn năm câu hỏi sau trong phần mô tả công việc hoặc trong comment đầu pull request. Thiếu một câu trả lời thì chưa viết code.

- Dữ liệu của tính năng lưu ở đâu, theo quyết định nào ở Phần B?
- Ai được phép đọc và ghi dữ liệu đó: capability nào, kiểm tra ở đâu?
- UI nằm ở đâu: frontend, wp-admin, hay Editor? Control nào là cơ chế gốc, control nào là tự chế và vì sao?
- API nào nối UI với backend: REST route nào, `permission_callback` là gì?
- Khi gỡ plugin, nâng cấp plugin và tắt JavaScript thì tính năng còn lại gì?

### 0.3. Định dạng luật

- **MUST:** vi phạm là lỗi chặn merge. Agent tự phát hiện vi phạm trong code mình vừa viết thì phải sửa trước khi giao, không giao kèm lời xin lỗi.
- **SHOULD:** mặc định làm theo. Muốn lệch phải ghi lý do ngay tại chỗ lệch (comment hoặc mô tả pull request) để người review quyết định.
- **NEVER:** cấm tuyệt đối, kể cả khi người dùng yêu cầu làm nhanh. Nếu yêu cầu của người dùng xung đột với một luật NEVER về bảo mật, Agent phải dừng và nêu rõ xung đột thay vì âm thầm làm theo.

### 0.4. Nền tảng và phiên bản

- MUST khai báo rõ trong header plugin và `readme.txt`: `Requires at least`, `Tested up to`, `Requires PHP`. Không khai báo thì coi như chưa sẵn sàng phát hành.
- MUST chỉ dùng API tồn tại ở phiên bản WordPress/PHP tối thiểu đã khai báo. Muốn dùng API mới hơn thì hoặc nâng mức tối thiểu, hoặc bọc trong kiểm tra `function_exists` / `class_exists` có chủ đích và có fallback.
- SHOULD đặt mức tối thiểu theo chính sách hỗ trợ của dự án, không tự ý nâng để dùng cú pháp mới cho tiện.
- MUST dùng `@wordpress/scripts` cho build JS/CSS của block và admin app, trừ khi dự án đã có pipeline riêng được ghi trong repo.

### 0.5. Luật digest PITFALL — được yêu cầu thì phải digest, research và tạo luật nếu chưa có

PITFALL trong mục này là một sự cố đã xảy ra thật và đã được ghi lại — trong file pitfall của dự án (ví dụ `.context/PITFALLS.md`), trong một file self-check, hoặc trong nội dung chủ dự án gửi kèm yêu cầu. Digest là biến bản ghi thô đó thành tri thức dùng được: một bản digest trung thực, một vòng research đối chiếu, và một quyết định có ghi lại về việc convention đã có luật cho nó chưa.

#### 0.5.1. Điều kiện kích hoạt và phạm vi

- MUST chạy quy trình ở mục này khi chủ dự án yêu cầu digest một PITFALL, dưới bất kỳ cách nói nào nêu rõ ý đó: nêu mã pitfall, trỏ tới file pitfall, gửi kèm nội dung pitfall, hoặc nói rõ "digest PITFALL …". Yêu cầu đó là lệnh, không phải gợi ý để cân nhắc.
- MUST chỉ digest pitfall được nêu trong yêu cầu đó. NEVER tự ý digest thêm pitfall khác gặp trên đường, tự ý quét toàn bộ file pitfall của dự án để "làm luôn một thể", hoặc tự bịa một pitfall từ một lỗi Agent vừa tự gây ra mà chưa ai ghi lại.
- Khi chưa có yêu cầu digest, việc gặp một pitfall trong lúc làm task khác chỉ tạo ra hai việc được phép: ghi pitfall mới vào file pitfall của dự án theo đúng định dạng của file đó (nếu task cho phép ghi), và báo lại trong phần giao việc. Nó không tự kích hoạt quy trình này.
- MUST hoàn thành cả ba bước ở 0.5.2 theo đúng thứ tự: digest, rồi research, rồi mới quyết định tạo luật. Bỏ bước research để nhảy thẳng từ digest sang viết luật là vi phạm, kể cả khi luật viết ra tình cờ đúng.

#### 0.5.2. Ba bước bắt buộc

**Bước 1 — Digest: ghi lại pitfall đúng như nó đã xảy ra.** Bản digest phải có đủ các trường sau, trường nào không có bằng chứng thì ghi "chưa biết" thay vì điền cho đủ:

```text
Mã và nguồn: <mã pitfall, file/nguồn, ngày ghi, ngày đính chính nếu có>
Triệu chứng: <điều nhìn thấy được, ở môi trường nào>
Bước tái hiện: <làm gì thì gặp lại, hoặc ghi "chưa tái hiện được">
Root cause đã kiểm chứng: <nguyên nhân, kèm bằng chứng kiểm chứng là gì>
Bản đính chính: <nếu root cause ban đầu bị quy nhầm, ghi cả bản sai, ngày đính chính và bản đúng>
Cách sửa / cách tránh đã áp: <điều dự án đã làm thật>
Số đo riêng của dự án: <selector, con số, tên attribute, phiên bản — tách riêng khỏi nguyên tắc>
Nguyên tắc ứng viên: <một câu, dạng luật, tách khỏi số đo riêng ở dòng trên>
Nhãn bằng chứng: quan sát / suy luận / chưa biết — gắn cho root cause và cho nguyên tắc ứng viên
```

- MUST lấy root cause đã đính chính khi pitfall có bản đính chính có đánh dấu như [CORRECTED]. Bản quy nhầm ban đầu chỉ được digest như một lỗi chẩn đoán cần tránh, NEVER như nguyên nhân. Đây là bài học của DP-06, đã ghi tại A5.11 và Phần E.
- MUST giữ nhãn bằng chứng trung thực: root cause chưa kiểm chứng ở runtime, ở dữ liệu thật hoặc ở tài liệu gốc thì là suy luận, và suy luận không được đi tiếp sang bước tạo luật như thể nó là quan sát.
- NEVER sửa nội dung file pitfall gốc trong lúc digest, trừ khi chủ dự án yêu cầu riêng việc đó. Đính chính một pitfall là việc của file pitfall, làm theo luật đính chính của dự án đó; digest chỉ đọc và trích dẫn.

**Bước 2 — Research: đối chiếu trước khi kết luận "chưa có luật".** Phải làm đủ ba vòng đối chiếu và ghi lại kết quả của từng vòng trong báo cáo digest:

1. Đối chiếu convention này: tìm trong Chỉ mục đọc, bảng định tuyến, bảng quyết định nhanh ở Phụ lục 5 và toàn văn theo các từ khóa của nguyên tắc ứng viên — tên cơ chế, tên API, triệu chứng, hành động bị cấm. Ghi lại mục gần nhất tìm được, hoặc ghi rõ "đã tìm theo các từ khóa: … — không có mục tương đương".
2. Đối chiếu tài liệu gốc: tài liệu chính thức của WordPress (Plugin Handbook, Block Editor Handbook, REST API Handbook) và, khi root cause liên quan tới hành vi của runtime hoặc API, kiểm chứng trực tiếp ở môi trường đích thay vì chỉ đọc tài liệu. Khi tài liệu gốc và convention này khác nhau, tài liệu gốc thắng và việc cần làm là sửa convention theo tài liệu gốc, ghi rõ đó là sửa sai chứ không phải thêm luật mới.
3. Đối chiếu dự án nguồn: pitfall này đã sinh ra luật, checklist hoặc hợp đồng nào trong chính dự án chưa (file chuẩn của dự án, self-check, `AGENTS.md` của dự án). Nếu dự án đã có luật riêng đúng, phần việc còn lại ở convention chung chỉ là phần nguyên tắc vượt ra ngoài dự án đó.

- MUST trích nguồn cho mọi khẳng định trong phần research: mục số mấy của convention này, link tài liệu gốc, hoặc file:dòng trong repo của dự án. Research không có trích nguồn thì coi như chưa research.
- SHOULD kiểm tra thêm cách các team plugin lớn xử lý cùng loại sự cố khi tài liệu gốc không kết luận được, và ghi rõ đó là thực hành tham khảo, không phải luật của WordPress.

#### 0.5.3. Quyết định: đúng ba kết quả, không có kết quả thứ tư

Sau research, MUST xếp pitfall vào đúng một trong ba kết quả sau và làm trọn việc của kết quả đó:

| Kết quả | Điều kiện | Việc bắt buộc làm |
|---|---|---|
| Đã có luật | Một mục hiện có đã chứa nguyên tắc của pitfall, dù diễn đạt khác | Không tạo luật mới. Báo lại số mục đã chứa luật. Chỉ bổ sung khi thiếu thật: một dòng hồ sơ ở phần hồ sơ bài học dự án (Phần E hoặc phần tương ứng của dự án mới), hoặc một dòng trỏ chéo từ mục gần nhất — không viết lại nội dung luật |
| Có một phần | Mục hiện có chứa nguyên tắc nhưng thiếu trường hợp, điều kiện hoặc bước kiểm tra mà pitfall này phơi ra | Mở rộng chính mục đó tại chỗ: thêm trường hợp, điều kiện hoặc ô gate còn thiếu, và ghi nguồn pitfall ngay tại chỗ mở rộng. NEVER tạo mục song song cho cùng một nguyên tắc |
| Chưa có luật | Research ở 0.5.2 không tìm được mục tương đương, và nguyên tắc thỏa cả ba điều kiện ở 0.5.4 | Tạo luật mới theo 0.5.5 |

- Kết quả "đã có luật" là một kết quả hoàn thành, không phải thất bại của lần digest. Báo cáo digest vẫn phải giao đủ bản digest và phần research; chỉ phần tạo luật là không làm, vì không cần làm.
- NEVER kết luận "chưa có luật" chỉ vì từ khóa đầu tiên không khớp. Kết luận đó chỉ đứng được khi báo cáo ghi rõ đã tìm theo những từ khóa nào, ở những bảng nào, và mục gần nhất khác nguyên tắc ứng viên ở điểm nào.

#### 0.5.4. Ba điều kiện để một nguyên tắc được lên thành luật chung

Một nguyên tắc rút ra từ pitfall chỉ được tạo thành luật trong convention chung khi thỏa cả ba điều kiện, thiếu một điều kiện thì dừng ở mức dưới nó:

1. Đã xảy ra thật: có pitfall, commit hoặc file chuẩn của dự án làm bằng chứng, và root cause mang nhãn quan sát — đã kiểm chứng, không phải suy luận chưa kiểm chứng.
2. Áp được ngoài dự án nguồn: nguyên tắc đứng được khi bỏ tên dự án, tên block và số đo riêng ra. Phần không bỏ được — selector, specificity, tên attribute, phiên bản, ngưỡng đo riêng — ở lại hồ sơ dự án, ghi rõ là số đo riêng, không đi vào văn bản luật chung.
3. Chưa có luật tương đương: đã qua research ở 0.5.2 và rơi vào kết quả "chưa có luật" hoặc "có một phần" ở 0.5.3.

Nguyên tắc không thỏa điều kiện 2 vẫn có giá trị trong dự án của nó: nó thuộc về file pitfall và `AGENTS.md` của dự án đó, không thuộc về convention chung. Nguyên tắc không thỏa điều kiện 1 thì chưa thuộc về nơi nào cả ngoài báo cáo digest, ở mục chờ kiểm chứng.

#### 0.5.5. Khi tạo luật mới: ghi vào đâu, ghi thế nào

- MUST ghi văn bản luật có hiệu lực vào đúng một mục chuyên môn của Phần A, B, C hoặc D theo mảng của nguyên tắc — không ghi luật vào phần hồ sơ, không ghi vào phụ lục, không tạo một mục "luật từ pitfall" gom mọi thứ vào một chỗ. Nguyên tắc thuộc hai mảng thì chọn mảng của hành động mà luật điều chỉnh, và trỏ chéo từ mảng còn lại.
- MUST viết luật ở định dạng của 0.3 (MUST / SHOULD / NEVER), kèm cách kiểm tra được: một ô gate, một test case, hoặc một bước đo cụ thể. Một luật không kiểm tra được thì chưa xong.
- MUST ghi hồ sơ nguồn gốc vào phần hồ sơ bài học dự án tương ứng (với skvn-marine là Phần E; dự án khác có phần hồ sơ riêng khi bài học đầu tiên của nó được duyệt): một dòng cho mỗi bài học, ghi mã pitfall, ngày, mục giữ luật có hiệu lực, và phần nào là số đo riêng của dự án. Hồ sơ không giữ bản sao thứ hai của checklist.
- MUST nối luật mới vào hệ thống đọc ngay trong cùng lần sửa: thêm hàng vào bảng định tuyến hoặc dòng vào bảng tín hiệu mở rộng khi luật tạo ra một tình huống đọc mới, thêm ô vào gate tương ứng ở Phụ lục 1, thêm hàng anti-pattern ở Phụ lục 2 khi luật cấm một hành vi cụ thể, và thêm hoặc sửa recipe ở Phụ lục 4 khi luật thay đổi cách làm một việc thường gặp. Luật không được nối vào chỉ mục là luật Agent sau sẽ không tìm thấy, và coi như chưa tạo xong.
- MUST ghi rõ xung đột nếu luật mới lệch một luật hiện có: phạm vi của ngoại lệ và phía nào thắng, ngay tại mục giữ luật — theo đúng cách A9.3 đã ghi ngoại lệ của nó với A3. NEVER để hai luật mâu thuẫn nhau cùng tồn tại mà không mục nào nhắc tới mục kia.
- Khi Agent đang làm việc trong một dự án (không phải đang sửa trực tiếp convention chung theo yêu cầu của chủ dự án), việc tạo luật dừng ở mức đề xuất: viết đề xuất theo định dạng hồ sơ ở trên, đưa vào báo cáo để chủ dự án duyệt, và chỉ ghi vào convention chung sau khi được duyệt. Đây là cùng ranh giới đã áp ở Giai đoạn 5 của prompt chuyển giao. Yêu cầu digest nói trong cuộc trao đổi trực tiếp về convention chung này thì là yêu cầu sửa convention chung, và Agent làm trọn các bước trên trong cùng lần chạy.

#### 0.5.6. Sản phẩm phải giao khi một lần digest kết thúc

1. Bản digest theo mẫu ở Bước 1 của 0.5.2, đủ trường, có nhãn bằng chứng.
2. Phần research: ba vòng đối chiếu ở Bước 2, mỗi vòng có trích nguồn hoặc ghi rõ không tìm thấy gì và đã tìm bằng cách nào.
3. Quyết định theo 0.5.3: đã có luật (kèm số mục), có một phần (kèm mục đã mở rộng), hoặc chưa có luật (kèm đối chiếu ba điều kiện ở 0.5.4).
4. Nếu có tạo hoặc mở rộng luật: danh sách mọi nơi đã sửa trong cùng lần chạy — mục chuyên môn, dòng hồ sơ, hàng chỉ mục, ô gate, hàng anti-pattern, recipe — để người duyệt kiểm tra tính nối kết mà không phải tự tìm.
5. Khối "Đã đọc" theo mẫu ở Chỉ mục đọc.

#### 0.5.7. Các hành vi bị cấm riêng trong digest PITFALL

- NEVER chép nguyên văn một pitfall, một checklist của dự án hoặc một đoạn hội thoại thành luật chung. Digest là rút nguyên tắc và tách số đo riêng ra; chép nguyên văn là bỏ qua đúng việc digest phải làm.
- NEVER nâng một pitfall mới xảy ra một lần, root cause chưa kiểm chứng, thành luật MUST. Lần đầu chưa kiểm chứng thì ghi ở mức quan sát chờ kiểm chứng; luật MUST cần root cause đã kiểm chứng theo 0.5.4.
- NEVER tạo luật trùng để báo cáo trông có sản phẩm. Số luật tạo ra không phải thước đo của một lần digest; kết quả "đã có luật" kèm bằng chứng đối chiếu là sản phẩm đầy đủ.
- NEVER dùng một lần digest để sửa code tính năng gây ra pitfall, trừ khi yêu cầu digest nói rõ cả việc sửa đó. Digest xử lý tri thức; sửa code là một task riêng, đi qua bảng định tuyến như mọi task code khác.
- NEVER bỏ qua một pitfall đã đính chính bằng cách digest bản cũ cho nhanh. Không thấy bản đính chính thì ghi "chưa biết có đính chính hay không" và hỏi hoặc tìm tiếp, không kết luận root cause.

---

# Phần A — Giao diện

Phần này gồm bốn lớp giao diện khác nhau, không được trộn lẫn: frontend cho khách thăm site, Admin UI trong wp-admin, Editor UI trong Gutenberg, và lớp kết nối dữ liệu giữa giao diện với backend.

## A1. Nguyên tắc chung cho mọi giao diện

- MUST dùng HTML ngữ nghĩa: heading theo thứ bậc, `button` cho hành động, `a` cho điều hướng, `ul/ol` cho danh sách, `label` gắn với mọi input. NEVER dùng `div` có `onclick` thay cho `button`.
- MUST đạt WCAG 2.2 mức AA cho mọi UI mới: tương phản chữ tối thiểu 4.5:1 (chữ lớn 3:1), điều hướng được hoàn toàn bằng bàn phím, focus luôn nhìn thấy được, không truyền đạt thông tin chỉ bằng màu sắc.
- MUST để UI hoạt động ở mức cơ bản khi JavaScript lỗi hoặc chưa tải: nội dung chính không bị giấu sau trạng thái chờ JS. Đây là nguyên tắc progressive enhancement mà 10up áp dụng cho mọi dự án.
- MUST bọc mọi chuỗi chữ hiển thị bằng hàm dịch có text domain của plugin: `__()`, `esc_html__()`, `_x()` khi cần ngữ cảnh. Trong JS dùng `__()` từ `@wordpress/i18n`. NEVER để chuỗi tiếng Anh cứng trong template hoặc component.
- MUST escape tại điểm xuất dữ liệu (late escaping): `esc_html()` cho text, `esc_attr()` cho attribute, `esc_url()` cho URL, `wp_kses_post()` cho HTML giàu đã được phép. Escape sớm rồi lưu vào biến trung gian là anti-pattern vì dễ bị xuất lại ở ngữ cảnh khác.
- SHOULD dùng design token của theme (màu, cỡ chữ, khoảng cách từ `theme.json`) thay vì giá trị riêng của plugin ở frontend, để plugin hòa vào theme đang chạy thay vì áp đặt phong cách riêng.
- NEVER nạp font, icon font hoặc thư viện UI ngoài (Bootstrap, Tailwind bản đầy đủ) vào wp-admin hoặc Editor chỉ để vẽ vài control. Các lớp này va chạm style của core và của plugin khác.

## A2. Responsive

### A2.1. Cách nghĩ: mobile-first và theo nội dung

- MUST viết CSS theo hướng mobile-first: style gốc là cho màn hình hẹp nhất, `@media (min-width: …)` mở rộng dần lên. NEVER viết desktop trước rồi dùng `max-width` vá xuống, vì cách đó sinh ra override chồng chéo khó gỡ.
- MUST chọn breakpoint theo điểm nội dung bị vỡ (chữ quá dài, cột quá hẹp) chứ không theo tên thiết bị. Một plugin thông thường chỉ cần 2–3 breakpoint.
- SHOULD căn breakpoint với thang của theme đang hỗ trợ. Khi không biết theme, dùng các mốc quen thuộc của hệ WordPress: 600px, 782px (điểm gãy của wp-admin), 960px, 1280px. Admin UI MUST kiểm tra riêng mốc 782px vì đó là nơi thanh admin và sidebar của wp-admin đổi bố cục.

### A2.2. Đơn vị và bố cục

- MUST dùng đơn vị tương đối: `rem` cho cỡ chữ và khoảng cách, `%`/`fr`/`minmax()` cho lưới, `clamp()` cho cỡ chữ và khoảng cách cần co giãn liên tục.
- NEVER đặt chiều rộng cố định bằng `px` cho container chứa nội dung của người dùng. Ngoại lệ duy nhất: đường viền 1px, icon, và kích thước avatar/thumbnail có tỉ lệ cố định qua `aspect-ratio`.
- MUST khai báo `box-sizing: border-box` trong phạm vi CSS của plugin và luôn kèm `max-width: 100%` cho `img`, `video`, `iframe` do plugin xuất ra.
- MUST dùng `aspect-ratio` cho khung media thay vì hack `padding-top` theo phần trăm.
- SHOULD ưu tiên Flexbox cho bố cục một chiều và CSS Grid cho bố cục hai chiều. Dùng container query (`@container`) khi component cần responsive theo chiều rộng của vùng chứa nó, không theo viewport — trường hợp điển hình là block đặt trong cột hẹp của layout nhiều cột.
- NEVER dùng bảng (`table`) để dàn trang. Bảng chỉ dành cho dữ liệu dạng bảng thật, và bảng dữ liệu trên mobile phải có cách xử lý rõ ràng: cuộn ngang trong vùng chứa có `tabindex="0"` và nhãn, hoặc chuyển thành dạng thẻ — chọn một và ghi vào spec của tính năng, không để bảng tự tràn màn hình.

### A2.3. Kiểm tra responsive bắt buộc

Mỗi UI mới phải được kiểm tra ở tối thiểu bốn chiều rộng: 360px, 782px, 1024px và 1440px. Tại mỗi chiều rộng, Agent kiểm tra: không cuộn ngang ngoài ý muốn, vùng chạm của nút và liên kết tối thiểu 44×44px trên giao diện cảm ứng (24×24px là mức sàn WCAG 2.2 AA, 44px là mức nên đạt theo hướng dẫn nền tảng), chữ không nhỏ hơn 16px ở input trên mobile (tránh iOS tự phóng to khi focus), và focus bằng bàn phím vẫn nhìn thấy được.

### A2.4. Responsive cho từng loại nội dung khó

- **Bảng dữ liệu:** chọn một trong ba cách và ghi vào spec, không để mặc định. Cách 1, cuộn ngang có kiểm soát: bọc bảng trong vùng `overflow-x: auto`, đặt `tabindex="0"` và `aria-label` cho vùng cuộn, giữ cột đầu cố định bằng `position: sticky` chỉ khi cột đầu là định danh. Cách 2, thẻ xếp chồng: dưới breakpoint đã chọn, mỗi hàng thành một thẻ, nhãn cột lặp lại bằng `data-label` và `::before` — chỉ dùng khi số cột không quá 5 và không cần so sánh ngang. Cách 3, ẩn cột phụ: cột ít quan trọng ẩn dần theo breakpoint, dữ liệu đầy đủ vẫn tới được qua hàng chi tiết hoặc trang chi tiết. NEVER dùng cách 2 cho bảng cần sắp xếp, lọc hoặc chọn hàng loạt.
- **Form dài:** một cột trên mobile, nhãn luôn ở trên trường, không dùng placeholder thay nhãn. Nhóm trường liên quan bằng `fieldset` và `legend`. Lỗi hiển thị ngay dưới trường gây lỗi, gắn `aria-describedby`, và khi gửi thất bại focus chuyển tới khối tóm tắt lỗi ở đầu form.
- **Điều hướng và tab:** khi tab tràn chiều ngang, cho cuộn ngang trong thanh tab kèm mờ dần ở mép, hoặc gập thành select — chọn một. NEVER để tab xuống hai hàng làm nội dung nhảy.
- **Modal và popover:** trên màn hình hẹp modal chiếm gần toàn màn hình, có nút đóng nhìn thấy được, đóng bằng phím Escape, focus bị giữ trong modal và trả về phần tử đã mở nó khi đóng. Popover không được tràn ra ngoài viewport: dùng cơ chế định vị của component core thay vì tự tính tọa độ.
- **Chữ trong nút và thẻ:** nút không bọc chữ xuống hai dòng trên mobile trừ khi đã thiết kế cho việc đó; chữ dài phải có đường xử lý rõ: rút gọn bằng ellipsis kèm `title` chỉ là phương án cuối, ưu tiên cho chữ bọc có kiểm soát hoặc giảm cỡ chữ theo `clamp()`.

### A2.5. Ảnh và media responsive

- MUST xuất ảnh nội dung qua cơ chế kích thước của WordPress (`wp_get_attachment_image()` hoặc markup có `srcset` và `sizes` đúng với chiều rộng thật mà ảnh sẽ hiển thị). `sizes` sai làm trình duyệt tải ảnh quá lớn hoặc quá mờ, và đây là lỗi hiệu năng hay gặp nhất ở plugin tự in thẻ `img`.
- MUST khai báo `width` và `height` hoặc `aspect-ratio` cho mọi ảnh do plugin xuất, để trình duyệt giữ chỗ trước khi ảnh tải và không gây nhảy bố cục (CLS).
- MUST tải lười (`loading="lazy"`) cho ảnh dưới màn hình đầu tiên, và NEVER tải lười ảnh hero hoặc ảnh lớn nhất của màn hình đầu tiên — ảnh đó nên cân nhắc `fetchpriority="high"`.
- SHOULD dùng định dạng hiện đại qua pipeline của WordPress hoặc máy chủ (WebP, AVIF) khi nguồn cho phép, luôn giữ fallback. Plugin không tự chuyển đổi định dạng bằng thư viện riêng nếu chưa đo được lợi ích.
- Ảnh trang trí để `alt=""` và, khi nằm trong SVG inline, thêm `aria-hidden="true"`. Icon có chức năng phải có nhãn truy cập được: chữ nhìn thấy đi kèm, hoặc `aria-label` trên nút chứa icon.

## A3. CSS: kiến trúc và phạm vi

- MUST tiền tố mọi class bằng prefix của plugin theo kiểu BEM rút gọn: `.acme-card`, `.acme-card__title`, `.acme-card--featured`. NEVER dùng class chung như `.container`, `.title`, `.active` ở phạm vi toàn cục.
- MUST giới hạn độ đặc hiệu (specificity): tối đa một class cộng một pseudo-class trong một selector cho CSS của plugin. NEVER dùng ID selector cho style, và NEVER dùng `!important` trừ khi đè style inline của bên thứ ba — trường hợp đó phải có comment ghi rõ đè cái gì và vì sao.
- MUST nạp CSS bằng `wp_enqueue_style()` / `wp_enqueue_script()` với handle có prefix, khai báo đúng dependency và version. Version lấy từ hằng phiên bản của plugin hoặc `filemtime()` khi phát triển, để phá cache đúng cách. NEVER in thẻ `<link>` hoặc `<script>` trực tiếp trong template.
- MUST chỉ nạp asset ở nơi dùng: frontend asset chỉ nạp khi trang có nội dung cần nó (kiểm tra `has_block()` với block, kiểm tra điều kiện trang với shortcode/widget), admin asset chỉ nạp trên đúng hook của màn hình (`admin_enqueue_scripts` nhận `$hook_suffix` và phải so sánh trước khi nạp).
- MUST tách ba file CSS khi plugin có cả ba lớp: `frontend.css`, `admin.css`, `editor.css`. Block dùng cơ chế riêng: `style` (cả hai phía), `editorStyle` và `viewScript` khai báo trong `block.json`, không nạp thủ công.
- SHOULD dùng CSS custom properties cho token riêng của plugin, đặt tên `--acme-*`, và map sang token của theme khi có: ví dụ `--acme-surface: var(--wp--preset--color--base, #ffffff)`. Giá trị sau dấu phẩy là fallback cho theme không có token đó.
- MUST hỗ trợ RTL: dùng thuộc tính logic (`margin-inline-start`, `padding-inline`, `inset-inline-start`, `text-align: start`) thay cho `left/right` vật lý. Chỉ dùng `left/right` khi vị trí vật lý thật sự có ý nghĩa (ví dụ tọa độ trên bản đồ) và phải ghi lý do.
- SHOULD tôn trọng `prefers-reduced-motion`: tắt hoặc giảm animation không thiết yếu trong media query này. Mọi animation của plugin phải có thời lượng ngắn, không nhấp nháy quá 3 lần/giây.
- NEVER sửa CSS của core, theme hoặc plugin khác bằng selector toàn cục. Muốn can thiệp phải qua hook, filter hoặc API mà phía đó cung cấp.

## A4. Admin UI trong wp-admin

Nguyên tắc bao trùm: wp-admin là nhà của WordPress, plugin là khách. Giao diện quản trị phải trông và vận hành như một phần của core, không phải một web app lạ nhúng vào.

### A4.1. Dùng gì của core trước khi tự vẽ

- MUST dùng Settings API cho trang cài đặt (xem Phần C6), `WP_List_Table` hoặc bảng HTML theo class của core (`.wp-list-table widefat striped`) cho danh sách, và các class nút của core (`.button`, `.button-primary`, `.button-link-delete`).
- MUST dùng notice của core cho thông báo kết quả: `add_settings_error()` cho trang settings, admin notice với class `notice notice-success|warning|error is-dismissible` cho các màn hình khác. Thông báo phải nói rõ chuyện gì đã xảy ra và bước tiếp theo, không chỉ ghi "Thành công".
- MUST dùng component của `@wordpress/components` khi xây màn hình quản trị bằng React (màn hình lớn, nhiều tương tác): `Card`, `TextControl`, `SelectControl`, `ToggleControl`, `Notice`, `Spinner`, `__experimentalHStack` chỉ khi dự án chấp nhận rủi ro API experimental. NEVER tự dựng lại modal, dropdown hay date-picker bằng div tự chế khi core đã có.
- NEVER thay đổi menu, toolbar hay style toàn cục của wp-admin ngoài phần của plugin. Không thêm top-level menu nếu tính năng chỉ cần một trang con dưới menu có sẵn (Settings, Tools, hoặc menu của CPT liên quan). Top-level menu chỉ dành cho plugin mà quản trị viên vào hằng ngày như một ứng dụng riêng.
- MUST đặt capability rõ ràng cho từng menu và từng hành động, mặc định `manage_options` cho cài đặt toàn site, capability của CPT cho màn hình gắn với CPT. Kiểm tra lại capability ở phía server khi xử lý, không tin vào việc menu đã ẩn.

### A4.2. Form trong wp-admin

- MUST có `label` nhìn thấy được cho mọi trường, `description` dưới trường khi định dạng nhập không hiển nhiên, và thông báo lỗi gắn với đúng trường gây lỗi.
- MUST giữ lại dữ liệu người dùng vừa nhập khi validate thất bại, kèm lỗi cụ thể. NEVER bắt nhập lại toàn bộ form vì một trường sai.
- MUST hỏi xác nhận cho hành động phá hủy (xóa, reset) bằng hộp thoại xác nhận hoặc trang xác nhận, và hành động phá hủy không bao giờ nằm trên GET request.
- SHOULD nhóm trường dài thành các section có heading, dùng `PanelBody`-tương-đương trong HTML là các khối `h2` + bảng `form-table` theo đúng markup của core.
- MUST hiển thị trạng thái đang lưu, đã lưu và lưu thất bại trên các màn hình React. Người dùng không bao giờ phải đoán dữ liệu đã được ghi hay chưa.

### A4.3. Admin React: khi nào dựng app, khi nào dừng ở HTML cổ điển

- Màn hình chỉ gồm form cài đặt, vài nút hành động và bảng tĩnh: MUST dừng ở HTML cổ điển + Settings API (A4.1, C5). Dựng React cho màn hình như vậy là nợ bảo trì không đổi lại được gì.
- Màn hình có một trong các dấu hiệu sau mới dựng React: trạng thái thay đổi liên tục khi thao tác (kéo thả, xem trước trực tiếp), danh sách cần lọc, sắp xếp, chọn hàng loạt ngay tại chỗ, hoặc quy trình nhiều bước có giữ trạng thái giữa các bước.
- Khi dựng React trong admin: MUST dùng `@wordpress/components`, `@wordpress/data` và `apiFetch` của core, build bằng `@wordpress/scripts`, và nạp asset chỉ trên đúng màn hình của plugin qua kiểm tra `$hook_suffix`. NEVER nạp một framework UI thứ hai, một thư viện quản lý trạng thái thứ hai, hoặc một router riêng cho một màn hình đơn.
- MUST giữ URL và nút Back của trình duyệt có nghĩa: màn hình nhiều bước dùng query string hoặc history của WordPress một cách có chủ đích, không dựng SPA nuốt mất điều hướng của wp-admin.
- MUST có trạng thái lỗi toàn cục cho app: request lỗi không được để app trắng trang. Lỗi được bắt ở biên, hiển thị bằng `Notice` của core kèm nút thử lại, và chi tiết kỹ thuật chỉ vào console hoặc log.

### A4.4. Danh sách lớn trong admin: DataViews và WP_List_Table

Hai cơ chế, chọn theo tính chất màn hình, không trộn trong cùng một danh sách.

- **`WP_List_Table` hoặc bảng core:** chọn khi danh sách là dữ liệu server-render, thao tác chủ yếu là xem, xóa, hành động hàng loạt qua form gửi lên. Bắt buộc có: cột checkbox và bulk action có nonce riêng, sắp xếp chỉ theo cột trong danh sách cho phép, tìm kiếm qua tham số đã sanitize, phân trang ở server, và thông báo kết quả sau hành động.
- **DataViews (`@wordpress/dataviews`):** chọn khi danh sách cần đổi kiểu hiển thị (bảng, lưới, danh sách), lọc nhiều trường tại chỗ, và chọn hành động theo từng hàng ngay trong giao diện. Khi dùng DataViews, Agent phải khai báo đủ bốn thành phần: `fields` (mỗi field có `id`, `label`, và hàm render hoặc `elements` khi là danh sách đóng), `data` đã phân trang ở server, `paginationInfo` lấy từ tổng thật của server chứ không từ độ dài trang hiện tại, và `actions` mà mỗi action kiểm tra lại quyền ở server khi thực thi.
- Với cả hai cơ chế: NEVER tải toàn bộ bản ghi xuống client rồi phân trang bằng JS. Trần `per_page` ở server là chốt cuối, client xin quá trần thì server cắt về trần.
- Trạng thái lọc, sắp xếp và trang hiện tại SHOULD phản ánh lên URL (query string) để quản trị viên gửi liên kết cho nhau và tải lại trang không mất ngữ cảnh.
- Hành động phá hủy trong danh sách luôn cần xác nhận và luôn kiểm tra capability theo từng đối tượng khi hành động áp lên nhiều đối tượng cùng lúc: được quyền trên 9 trong 10 mục không có nghĩa là được xóa cả 10.

## A5. Editor UI — Gutenberg

Đây là lớp có nhiều luật nhất, vì Editor là nơi các team nghiệp dư hay tự chế nhất trong khi core đã cung cấp sẵn phần lớn.

### A5.1. `block.json` là nguồn chân lý duy nhất

- MUST khai báo block bằng `block.json` và đăng ký bằng `register_block_type()` trỏ tới thư mục block. NEVER đăng ký block chỉ bằng JS `registerBlockType()` mà không có `block.json`, trừ block hoàn toàn động được tài liệu hóa lý do.
- MUST đặt `apiVersion: 3` cho block mới (theo phiên bản WordPress tối thiểu đã khai báo; nếu mức tối thiểu cũ hơn thì dùng apiVersion cao nhất mà mức đó hỗ trợ và ghi rõ).
- MUST khai báo trong `block.json`: `name` dạng `prefix/block-name`, `title`, `description`, `category`, `icon`, `keywords`, `textdomain`, `attributes`, `supports`, và các trường asset (`editorScript`, `script`, `viewScript`, `style`, `editorStyle`, `render` khi là dynamic block).
- MUST khai báo `usesContext` / `providesContext` khi block cha-con cần chia sẻ dữ liệu, thay vì truy vấn DOM hoặc biến toàn cục.
- NEVER đổi `name` của block sau khi đã phát hành. Đổi tên block làm hỏng mọi nội dung đã lưu. Muốn đổi phải giữ block cũ dưới dạng deprecated alias.

### A5.2. Attributes: dữ liệu của block sống ở đâu

- MUST khai báo mọi attribute trong `block.json` với `type` cụ thể (`string`, `number`, `integer`, `boolean`, `array`, `object`) và `default` khi giá trị rỗng là hợp lệ.
- MUST chọn `source` có chủ đích: không có `source` nghĩa là dữ liệu lưu trong comment delimiter của block (phù hợp dữ liệu cấu hình); `source: "html" | "text" | "attribute"` kèm `selector` nghĩa là dữ liệu lấy từ markup đã lưu (phù hợp nội dung người dùng nhìn thấy và sửa trực tiếp).
- NEVER lưu vào attribute thứ có thể suy ra từ dữ liệu khác, thứ thuộc về post (lấy qua `useEntityProp` / context), hoặc bí mật và đáp án đúng. Dữ liệu bí mật (đáp án, khóa chấm điểm, ghi chú nội bộ) MUST nằm ở postmeta chỉ server đọc hoặc bảng riêng, không nằm trong attribute vì attribute bị lộ trong markup bài viết và qua REST cho bất kỳ ai đọc được nội dung.
- MUST coi attribute đã phát hành là hợp đồng: đổi kiểu, đổi tên hoặc đổi ý nghĩa của attribute phải qua cơ chế `deprecated` (mảng `deprecated` trong định nghĩa block, mỗi phần tử giữ attributes/supports/save cũ và `migrate` khi cần). NEVER sửa thẳng hàm `save` của block đã có người dùng mà không thêm bản deprecated tương ứng, vì làm vậy mọi block đã lưu sẽ báo "nội dung không hợp lệ".
- SHOULD giữ số attribute của một block dưới khoảng 20. Vượt quá thường là dấu hiệu block đang làm hai việc: tách thành block con dùng `InnerBlocks` hoặc chuyển dữ liệu lặp lại thành block con.

### A5.3. Phân chia: cái gì ở đâu trong Editor

Block Editor có bốn vị trí hiển thị control. Đặt sai vị trí là lỗi UX bị chặn khi review.

| Vị trí | Dùng cho | Không dùng cho |
|---|---|---|
| Toolbar (`BlockControls`) | Hành động thường xuyên, tác động lên nội dung đang chọn: căn lề, mức heading, đậm/nghiêng qua `RichText` | Cài đặt hiếm dùng, trường nhập dài |
| Inspector — tab Settings (`InspectorControls` mặc định) | Cấu hình hành vi và nội dung: số lượng, chế độ hiển thị, liên kết, nguồn dữ liệu | Màu, chữ, khoảng cách thuần túy |
| Inspector — tab Styles (`InspectorControls` với group `styles`, `color`, `typography`, `dimensions`) | Control style tự chế mà supports không có | Logic nghiệp vụ |
| Thân block (`RichText`, `InnerBlocks`, `MediaPlaceholder`) | Nội dung chính người dùng sửa trực tiếp tại chỗ | Form cấu hình xếp chồng trong canvas |

- MUST sửa nội dung tại chỗ bằng `RichText` cho text giàu và `InnerBlocks` cho cấu trúc lồng nhau. NEVER bắt người dùng sửa nội dung chính trong một textarea ở sidebar.
- MUST dùng `useBlockProps()` cho phần tử bao ngoài cùng trong `edit` và trong `save`, để class, style và thuộc tính do supports sinh ra được gắn đúng chỗ. Với block con dùng `useInnerBlocksProps()`. Chiều ngang của chrome trong canvas không đặt tại đây: owner là hộp căn lề, xem A5.12.
- MUST truyền `...useBlockProps.save()` tương ứng ở phía `save`. Thiếu bước này làm style từ supports biến mất ở frontend.

### A5.4. Luật số một của Editor UI: supports trước, custom control sau

Trước khi viết bất kỳ control tùy chỉnh nào cho màu, chữ, khoảng cách, viền, bóng đổ hay bố cục, Agent MUST kiểm tra block supports. Supports cho UI giống hệt core, tôn trọng theme.json, tự sinh class/CSS đúng chuẩn và tự tương thích với Global Styles — bốn thứ mà control tự chế gần như không bao giờ đạt đủ.

Khai báo supports chuẩn cho một block nội dung điển hình:

```json
{
  "supports": {
    "anchor": true,
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "link": true,
      "gradients": true,
      "__experimentalDefaultControls": { "background": true, "text": true }
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "__experimentalFontFamily": true,
      "__experimentalDefaultControls": { "fontSize": true }
    },
    "spacing": {
      "padding": true,
      "margin": true,
      "blockGap": true,
      "__experimentalDefaultControls": { "padding": true }
    },
    "__experimentalBorder": { "color": true, "radius": true, "style": true, "width": true },
    "dimensions": { "minHeight": true }
  }
}
```

Quy tắc khi khai báo supports:

- MUST chỉ bật support mà block thật sự dùng và hiển thị đúng. Bật `color.link` khi block không có liên kết nào là lỗi.
- MUST đặt `__experimentalDefaultControls` cho các control quan trọng nhất để chúng hiện sẵn thay vì bị giấu sau nút menu ba chấm (⋯) của panel. Control bị giấu mặc định coi như không tồn tại với đa số người dùng.
- MUST cân nhắc đặt `"html": false` cho block mà markup tùy biến sẽ phá vỡ cấu trúc (block dữ liệu, block tương tác), để người dùng không sửa HTML làm hỏng block.
- SHOULD bật `anchor` cho block cấp cao nhất của section để biên tập viên tạo liên kết neo được.
- NEVER tự viết lại panel màu/chữ/khoảng cách bằng `PanelBody` tự chế khi supports đã đáp ứng. Đây là anti-pattern phổ biến nhất của plugin nghiệp dư.
- Lưu ý các key bắt đầu bằng `__experimental` có thể đổi ở bản Gutenberg tương lai: dùng chúng là chấp nhận được theo chuẩn core, nhưng Agent phải ghi chúng vào danh sách cần kiểm tra lại mỗi lần nâng phiên bản WordPress tối thiểu.

### A5.5. Bảng tra cứu pattern cho từng loại setting

Khi supports không đủ, dùng đúng component dưới đây. Cột "Lưu vào" là bắt buộc: chọn sai nơi lưu làm dữ liệu không qua được Global Styles, không migrate được hoặc bị lộ.

| Nhu cầu | Pattern chuẩn | Component / cơ chế | Lưu vào |
|---|---|---|---|
| Màu nền / màu chữ theo palette theme | Block supports | `supports.color` | Attribute do supports quản (`backgroundColor`, `textColor` = slug) + `style` |
| Màu cho phần tử con riêng (icon, viền nhấn) | Custom color control | `ColorGradientSettingsDropdown` hoặc `PanelColorSettings` (bản cũ) | Attribute slug riêng, xem A6 |
| Màu tự do ngoài palette | Chỉ khi spec yêu cầu | `ColorPalette` với `enableAlpha` có chủ đích | Hex trong `style.color.*` hoặc attribute `custom*` |
| Gradient | Supports trước | `supports.color.gradients` | Slug gradient hoặc `style.color.gradient` |
| Cỡ chữ, font, line-height | Block supports | `supports.typography` | Slug `fontSize` / `style.typography.*` |
| Padding, margin, khoảng cách block con | Block supports | `supports.spacing` | `style.spacing.*` |
| Kích thước (rộng, cao tối thiểu) | Supports / Dimensions | `supports.dimensions`, `InspectorControls` group `dimensions` | `style.dimensions.*` |
| Bật/tắt một hành vi | Toggle trong tab Settings | `ToggleControl` | Attribute `boolean` |
| Chọn một trong ít lựa chọn rời rạc | Radio / segmented | `RadioControl` hoặc `ToggleGroupControl` | Attribute `string` theo enum |
| Chọn một trong nhiều lựa chọn | Select | `SelectControl` | Attribute `string` theo enum |
| Số trong một khoảng | Slider + ô nhập | `RangeControl` (luôn kèm `allowReset`) | Attribute `number`/`integer` |
| Số chính xác | Ô nhập số | `NumberControl` hoặc `TextControl` type number | Attribute `number` |
| Ảnh / media | Placeholder + thư viện media | `MediaPlaceholder`, `MediaUploadCheck` + `MediaUpload` | Attribute `id` (integer) và `url` suy ra, xem A7.3 |
| Liên kết | URL picker của core | `__experimentalLinkControl` hoặc pattern URL + toggle mở tab mới | Attribute `url`, `opensInNewTab`, `rel` |
| Danh sách mục lặp lại có cấu trúc | Block con | `InnerBlocks` với `allowedBlocks` + template | Nội dung block con, không phải attribute array |
| Danh sách ngắn, phẳng, không cần style riêng từng mục | Array attribute + UI lặp | Component lặp với nút thêm/xóa/sắp xếp | Attribute `array` có `default: []` |
| Văn bản ngắn một dòng | Ô nhập trong Inspector hoặc tại chỗ | `TextControl` / `PlainText` | Attribute `string` |
| Văn bản giàu sửa tại chỗ | Rich text tại chỗ | `RichText` với `allowedFormats` tối thiểu cần thiết | Attribute `source: "html"` |
| Ngày giờ | Date/time picker của core | `DateTimePicker` trong `Popover`/`Dropdown` | Attribute ISO 8601 string |
| Chọn bài viết / term / người dùng | Entity search | `ComboboxControl` tự nối REST, hoặc `FormTokenField` | Attribute ID (không lưu cả object) |
| Nguồn dữ liệu động | Dynamic block | `render_callback` PHP hoặc file `render.php` | Không lưu kết quả render vào attribute |

### A5.6. Tổ chức Inspector cho dễ dùng

- MUST sắp xếp panel theo thứ tự người dùng nghĩ, không theo thứ tự code: nội dung và hành vi trước (tab Settings), trình bày sau (tab Styles). Panel quan trọng nhất mở mặc định (`initialOpen: true` chỉ cho tối đa một panel tự chế).
- MUST dùng `PanelBody` có tiêu đề là danh từ ngắn ("Nội dung", "Hiển thị", "Nâng cao"), không dùng câu dài. Control trong panel phải có `label` và, khi ý nghĩa không hiển nhiên, `help` giải thích hệ quả của lựa chọn.
- MUST dùng đúng group khi gắn control tự chế vào khu vực style: `<InspectorControls group="styles">` cho panel style tổng, hoặc các group chuyên biệt `color`, `typography`, `dimensions`, `border` khi control thuộc đúng nhóm đó. Nhét control màu vào tab Settings là lỗi tổ chức.
- MUST vô hiệu hóa hoặc ẩn control khi điều kiện tiên quyết chưa thỏa (ví dụ tắt toggle cha thì các control con bị `disabled`), và giải thích bằng `help` khi lý do không rõ.
- MUST có nút reset/đặt lại mặc định cho control style tự chế (`allowReset` ở `RangeControl`, hành động xóa giá trị ở color dropdown). Người dùng phải luôn quay về được trạng thái "theo theme".
- NEVER để Inspector dài vô hạn mà không nhóm. Quá khoảng 8 control tự chế trong một block là tín hiệu phải nhóm lại bằng panel hoặc tách block.
- SHOULD cung cấp block style variation (`styles` trong `registerBlockStyle` hoặc `block.json`) cho các biến thể trình bày đóng gói sẵn, tối đa khoảng 4 variation cho một block. Variation thay đổi được bằng class `is-style-*` và CSS, không nhân bản block.

### A5.7. Static block, dynamic block và pattern

- MUST mặc định chọn static block (lưu markup bằng `save`) cho nội dung trình bày. Chọn dynamic block (`save` trả về `null`, render bằng PHP) chỉ khi nội dung phải mới tại thời điểm xem: dữ liệu từ DB, từ API ngoài, nội dung cá nhân hóa, hoặc danh sách tự cập nhật.
- Với dynamic block, MUST khai báo `render` trong `block.json` trỏ tới file `render.php` hoặc dùng `render_callback` khi đăng ký. File render nhận `$attributes`, `$content`, `$block` và phải escape mọi dữ liệu như template PHP thường.
- NEVER dùng `ServerSideRender` trong Editor như bản render chính nếu có thể render bằng JS: nó chậm, nhấp nháy và giấu lỗi. Chỉ dùng khi bản render PHP quá phức tạp để tái tạo ở JS, và phải kèm trạng thái loading tử tế.
- SHOULD cung cấp block pattern (`register_block_pattern` hoặc thư mục `patterns/`) cho các bố cục mẫu dùng block của plugin, thay vì bắt người dùng tự lắp từ đầu.
- MUST cho xem trước đúng: những gì thấy trong Editor (màu, khoảng cách, thứ tự) phải khớp frontend trong giới hạn của theme. Lệch do CSS chỉ nạp ở một phía là lỗi, phải sửa bằng cách khai báo đúng `style`/`editorStyle` trong `block.json`.

### A5.8. Ma trận supports đầy đủ — tra trước khi viết bất kỳ control nào

Mỗi hàng là một nhu cầu. Nếu hàng đó có supports, viết control tay cho cùng nhu cầu là lỗi, trừ khi ghi được supports thiếu chính xác điều gì.

| Nhu cầu | Supports key | Attribute / style sinh ra | Ghi chú bắt buộc |
|---|---|---|---|
| Màu nền, màu chữ, màu liên kết | `color.background`, `color.text`, `color.link` | `backgroundColor`, `textColor` (slug); `style.color.*` (tự do) | Bật `link` chỉ khi block thật có liên kết |
| Gradient nền | `color.gradients` | `gradient` (slug); `style.color.gradient` | Theme có thể tắt gradient riêng |
| Lọc hai tông (duotone) | `filter.duotone` | `style.filter.duotone` | Chỉ hợp cho block chứa ảnh hoặc SVG |
| Cỡ chữ, họ chữ, độ đậm, giãn dòng, giãn chữ | `typography.*` | `fontSize` (slug); `style.typography.*` | Nhiều key con còn `__experimental`, kiểm lại mỗi lần nâng WP |
| Padding, margin, khoảng cách con | `spacing.padding`, `spacing.margin`, `spacing.blockGap` | `style.spacing.*` | Giá trị preset dạng `var:preset\|spacing\|…`, không tự parse |
| Viền: màu, rộng, kiểu, bo góc | `__experimentalBorder.*` | `style.border.*` | Bo góc riêng từng góc cần bật chi tiết |
| Bóng đổ | `shadow` | `style.shadow` | Preset bóng lấy từ theme, không tự đặt giá trị cứng |
| Kích thước: rộng, cao, cao tối thiểu | `dimensions.minHeight`, `dimensions.aspectRatio` | `style.dimensions.*` | Tỉ lệ khung cho media là nhu cầu riêng, xem A2.5 |
| Ảnh nền | `background.backgroundImage`, `background.backgroundSize` | `style.background.*` | Vẫn phải qua kiểm soát media ở A7.3 |
| Căn và bố cục trong block cha | `layout` (ở block cha) | Class và CSS của layout cha | Block con không tự khai báo layout của chính nó |
| Vị trí cố định, tự căn | `position.sticky`, `align`, `alignWide` | Class `align*` | `alignWide` chỉ có nghĩa khi theme bật |
| Neo (anchor), class thêm, khóa block | `anchor`, `customClassName`, `lock` | `id`, `className` | `html: false` khi markup không được sửa tay |

Quy tắc đọc ma trận: tìm nhu cầu trong cột đầu tiên trước, khai báo đúng key ở cột hai, rồi kiểm tra tên attribute sinh ra ở cột ba trong `block.json` — attribute do supports quản không khai báo lại thủ công, core tự biết. Khai báo trùng làm lệch nguồn chân lý.

### A5.9. Một `block.json` trọn gói để đối chiếu

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "acme/notice-card",
  "title": "Notice Card",
  "description": "Thẻ cảnh báo có icon, tiêu đề và nội dung ngắn.",
  "category": "widgets",
  "icon": "warning",
  "keywords": ["notice", "alert", "cảnh báo"],
  "textdomain": "acme",
  "attributes": {
    "heading": { "type": "string", "source": "html", "selector": "h3" },
    "level": { "type": "integer", "default": 3 },
    "iconColor": { "type": "string" },
    "customIconColor": { "type": "string" },
    "mediaId": { "type": "integer", "default": 0 }
  },
  "supports": {
    "anchor": true,
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true,
      "__experimentalDefaultControls": { "background": true, "text": true }
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "__experimentalDefaultControls": { "fontSize": true }
    },
    "spacing": {
      "padding": true,
      "margin": true,
      "__experimentalDefaultControls": { "padding": true }
    }
  },
  "style": "file:./style.css",
  "editorStyle": "file:./editor.css",
  "editorScript": "file:./index.js"
}
```

Đối chiếu khi viết block thật: `heading` có `source: "html"` vì nó là nội dung người dùng nhìn thấy và sửa tại chỗ; `iconColor` và `customIconColor` không có `source` vì chúng là cấu hình, lưu trong comment delimiter; `mediaId` chỉ lưu ID, không lưu URL (A7.3); không attribute nào tên `backgroundColor` xuất hiện ở đây vì supports đã quản nó.

### A5.10. Sửa block đã phát hành: deprecated và migrate, làm từng bước

Đây là quy trình bắt buộc mỗi khi đổi `save`, đổi attribute hoặc đổi markup của block đã có nội dung ngoài đời.

1. Chép nguyên định nghĩa cũ — `attributes`, `supports` liên quan và hàm `save` cũ — vào phần tử đầu tiên của mảng `deprecated` trong định nghĩa block. Không sửa một ký tự nào trong bản chép: bản chép này là cách Editor nhận ra và giữ được nội dung cũ.
2. Nếu ý nghĩa hoặc cấu trúc attribute thay đổi, viết hàm `migrate( attributes, innerBlocks )` trong chính phần tử deprecated đó, biến attribute cũ thành attribute mới. `migrate` phải là hàm thuần, chạy được nhiều lần, và không gọi API.
3. Nếu chỉ markup thay đổi mà attribute giữ nguyên, thêm hàm `isEligible` khi cần để giới hạn deprecated chỉ áp cho đúng đời nội dung bị ảnh hưởng, tránh migrate nhầm nội dung vốn đã đúng.
4. Viết `save` mới và, nếu cần, attribute mới ở định nghĩa chính. Thứ tự trong mảng `deprecated` là mới nhất trước, cũ nhất sau.
5. Kiểm thử bằng nội dung thật của đời cũ: dán markup đã lưu ở bản trước vào một bài, mở bằng Editor của bản mới, xác nhận block không báo "nội dung không hợp lệ", bấm thử khôi phục nếu có cảnh báo, và kiểm tra frontend trước và sau khi Editor lưu lại là giống nhau ở phần người đọc nhìn thấy.
6. Giữ các bản deprecated tối thiểu qua hai bản phát hành lớn, hoặc tới khi có bằng chứng nội dung cũ đã được migrate hết. Xóa deprecated là một quyết định phá vỡ tương thích, đi qua C12.

Ví dụ rút gọn, đổi attribute `headingLevel` (string) thành `level` (integer):

```js
deprecated: [
  {
    attributes: {
      heading: { type: 'string', source: 'html', selector: 'h3' },
      headingLevel: { type: 'string', default: '3' },
    },
    migrate( attributes ) {
      return {
        ...attributes,
        level: parseInt( attributes.headingLevel, 10 ) || 3,
        headingLevel: undefined,
      };
    },
    save( { attributes } ) {
      // Nguyên văn save của đời trước, không sửa.
    },
  },
]
```

Lỗi hay gặp nhất ở quy trình này: sửa luôn bản chép trong `deprecated` cho "sạch", làm Editor không còn nhận ra nội dung cũ — lỗi đó chỉ lộ ra trên site của người dùng, không lộ ra trên site thử của Agent. Vì vậy bước 5 là bắt buộc, không thay bằng việc đọc code.

### A5.11. Atomic check cho attribute `undefined`, pattern của control, và kiểm chứng component ở runtime

Mục này rút ra từ self-check trước commit của dự án skvn-marine (ghi 2026-11-19, nguồn: file self-check của dự án và pitfall DP-06 đã đính chính). Nó là hygiene bắt buộc cho mọi thay đổi Editor UI, đặc biệt với các attribute tuỳ chọn không có `default` — trong dự án nguồn là các attribute như `actionGapPx`, `actionWidthPercent`.

**Atomic check — chạy đủ bốn việc, không gộp:**

- [ ] Liệt kê mọi `attributes.X` được đọc trong `edit`, `save` và `render`, đối chiếu từng cái với khai báo trong `block.json`: attribute nào không có `default` phải được ghi ra danh sách riêng, không kết luận chung chung là “đã kiểm tra attributes”.
- [ ] Test case 1 — nội dung đã lưu bị mất attribute: block nạp với attribute đó là `undefined` và không gãy, không hiện giá trị rác, không báo nội dung không hợp lệ.
- [ ] Test case 2 — nội dung đã lưu có attribute với giá trị hợp lệ: block hiển thị và lưu lại đúng giá trị đó.
- [ ] Test case 3 — nội dung đã lưu có attribute với giá trị không mong đợi (sai kiểu, ngoài khoảng, chuỗi lạ): block rơi về hành vi mặc định đã định, không suy đoán giá trị thay người dùng.

**Pattern check — ba họ control phải qua đúng mẫu:**

- [ ] Ternary: mọi biểu thức điều kiện đọc attribute đều có nhánh `else` tường minh cho trường hợp `undefined` và trường hợp không mong đợi. NEVER để nhánh còn lại rơi ngầm vào giá trị của nhánh đầu.
- [ ] Boolean toggle: kiểm tra bằng `!== false` khi ý nghĩa là “bật trừ khi tắt hẳn”, hoặc `=== true` khi ý nghĩa là “chỉ bật khi bật hẳn” — chọn một ý nghĩa, ghi ra, và dùng nhất quán. NEVER dựa vào truthy/falsy ngầm với attribute có thể `undefined`, vì `undefined` và `false` là hai trạng thái khác nhau trong nội dung đã lưu.
- [ ] `SelectControl`: luôn có value fallback — giá trị truyền vào control là giá trị hiện tại nếu nó nằm trong danh sách `options`, ngược lại là option mặc định đã khai báo. NEVER truyền thẳng attribute có thể `undefined` hoặc ngoài danh sách vào `value`.

**Kiểm chứng component ở runtime — bài học DP-06 đã đính chính:**

- MUST kiểm chứng mọi tên component lấy từ `wp.components` / `@wordpress/components` có thật tồn tại trong bản phân phối đang chạy ở môi trường đích, trước khi quy lỗi cho dữ liệu. Trong dự án nguồn, bản phân phối WordPress 7.1 chỉ có các tên dạng `__experimental*` cho một số component; tên không có tiền tố đó không tồn tại ở runtime.
- Pitfall DP-06 bản đầu quy nhầm root cause là attribute `undefined`. Root cause đúng, đã đính chính ngày 2026-11-10 trong `.context/PITFALLS.md` của dự án: tên component không tồn tại trong runtime `wp.components`. Checklist attribute ở trên giữ nguyên giá trị như hygiene chung, nhưng nó không phải bằng chứng của DP-06 và không được trích dẫn như vậy.
- Hệ quả bắt buộc: khi Editor gãy, thứ tự chẩn đoán là (1) tên component và API có tồn tại ở runtime đích không, (2) attribute và dữ liệu, (3) logic của block. Đảo thứ tự này là cách DP-06 bị quy nhầm lần đầu.

## A6. Ví dụ trọn gói: setting bảng màu cho block

Đây là ví dụ chuẩn được hỏi nhiều nhất. Có ba mức nhu cầu, và Agent MUST đi từ mức thấp nhất lên, dừng ở mức đầu tiên đáp ứng được spec.

### A6.1. Mức 1 — Màu nền và màu chữ của chính block: chỉ dùng supports

Không viết một dòng control nào. Khai báo `supports.color` như ở A5.4. WordPress tự sinh:

- Hai attribute `backgroundColor` và `textColor`, lưu **slug** của preset (ví dụ `"primary"`), không lưu hex.
- Thuộc tính `style.color.background` / `style.color.text` khi người dùng chọn màu tự do ngoài palette (nếu theme cho phép custom color).
- Class ở phần tử bao ngoài qua `useBlockProps()`: `has-primary-background-color`, `has-primary-color`, `has-background`, `has-text-color`.
- CSS tương ứng do hệ Global Styles sinh từ `theme.json` của theme: `.has-primary-background-color { background-color: var(--wp--preset--color--primary) }`.

Nhiệm vụ duy nhất của Agent ở mức này: đảm bảo `useBlockProps()` được dùng ở cả `edit` và `save`, và không tự cộng thêm class màu thủ công. Nếu Agent viết thêm `ColorPalette` cho đúng nhu cầu này thì đó là code thừa phải xóa khi review.

### A6.2. Mức 2 — Màu cho một phần tử con mà supports không quản

Ví dụ: block "thẻ cảnh báo" cần màu riêng cho icon, tách khỏi màu nền và màu chữ của cả block. Đây là lúc custom control được phép xuất hiện, với các luật sau:

- MUST lưu **slug preset** vào attribute riêng, ví dụ `iconColor` (string), và lưu màu tự do — chỉ khi cho phép — vào `customIconColor`. Hai attribute tách bạch giống cách core tách `backgroundColor` khỏi `style.color.background`. NEVER lưu một attribute lúc là slug, lúc là hex tùy người dùng bấm gì.
- MUST lấy palette từ theme, không tự định nghĩa palette riêng trong plugin: dùng `useSelect` đọc `core/block-editor` settings hoặc hook `useSettings( 'color.palette' )` theo phiên bản hỗ trợ. Plugin tự khai một bảng màu riêng sẽ xung đột thị giác với theme và vỡ khi người dùng đổi theme.
- MUST dùng `ColorGradientSettingsDropdown` (pattern hiện hành của core cho control màu trong Inspector, hỗ trợ cả màu đặc và gradient, có sẵn nút xóa về mặc định) gắn trong `<InspectorControls group="color">`, hoặc `PanelColorSettings` ở các dự án đang khóa ở phiên bản cũ. Dùng `ColorPalette` trần chỉ chấp nhận được bên trong một control tự dựng lớn hơn, không dùng một mình làm setting hoàn chỉnh.
- MUST giải slug thành giá trị hiển thị qua hàm của core ở phía JS (`getColorObjectByColorSlug` từ `@wordpress/block-editor`) và ở phía PHP/CSS qua class preset hoặc biến CSS. NEVER tự tra bảng màu bằng mảng cứng trong code của plugin.

Mẫu khai báo attribute trong `block.json`:

```json
{
  "attributes": {
    "iconColor": { "type": "string" },
    "customIconColor": { "type": "string" }
  }
}
```

Mẫu control rút gọn trong `edit`:

```jsx
import { __ } from '@wordpress/i18n';
import {
  InspectorControls,
  useSettings,
  getColorObjectByColorSlug,
  ColorGradientSettingsDropdown,
} from '@wordpress/block-editor';

function Edit( { attributes, setAttributes, clientId } ) {
  const { iconColor, customIconColor } = attributes;
  const [ palette ] = useSettings( 'color.palette' );
  const colorObject = getColorObjectByColorSlug( palette, iconColor );
  const value = customIconColor || colorObject?.color;

  const onColorChange = ( newValue ) => {
    if ( ! newValue ) {
      setAttributes( { iconColor: undefined, customIconColor: undefined } );
      return;
    }
    const matched = ( palette || [] ).find(
      ( entry ) => entry.color.toLowerCase() === newValue.toLowerCase()
    );
    setAttributes( {
      iconColor: matched?.slug,
      customIconColor: matched ? undefined : newValue,
    } );
  };

  return (
    <>
      <InspectorControls group="color">
        <ColorGradientSettingsDropdown
          panelId={ clientId }
          settings={ [ {
            label: __( 'Icon', 'acme' ),
            colorValue: value,
            onColorChange,
            clearable: true,
          } ] }
        />
      </InspectorControls>
      {/* phần render của block */}
    </>
  );
}
```

Điểm kiểm tra của mẫu trên, Agent phải tự đối chiếu khi viết bản thật: khi người dùng chọn màu thuộc palette thì ghi slug và xóa custom; khi chọn màu tự do thì xóa slug và ghi custom; khi bấm xóa (clear) thì cả hai về `undefined` để block quay về màu kế thừa từ theme. Prop của `ColorGradientSettingsDropdown` thay đổi giữa các đời Gutenberg, nên trước khi dùng Agent phải đối chiếu chữ ký component với phiên bản `@wordpress/block-editor` mà dự án đang target, thay vì chép nguyên mẫu này.

### A6.3. Cách áp màu ra frontend

- Khi lưu slug: cộng class preset `has-{slug}-color` (cho chữ/icon dùng `color`) hoặc dùng biến `var(--wp--preset--color--{slug})` trong CSS của plugin. Cách dùng biến CSS là cách nên chọn cho phần tử con, vì nó sống sót khi theme đổi giá trị của preset.
- Khi lưu custom: in style inline đã escape ở phía render, hoặc ghi vào thuộc tính `style` của block nếu đi qua cơ chế supports. Giá trị màu đưa ra HTML phải qua validate dạng màu hợp lệ (hex/rgb/hsl theo danh sách cho phép) ở cả JS khi lưu và PHP khi render — không tin dữ liệu trong nội dung đã lưu là sạch, vì nội dung có thể bị sửa tay hoặc nhập từ nguồn khác.
- MUST kiểm tra tương phản khi cặp màu chữ/nền do người dùng chọn có thể đọc không được: tối thiểu cảnh báo trong Editor khi tỉ lệ tương phản dưới 4.5:1 đối với chữ thường. Cảnh báo, không chặn lưu, vì người dùng có thể đang cố ý dùng cho phần tử trang trí — nhưng phần tử trang trí phải được đánh dấu `aria-hidden` nếu chứa chữ không có nghĩa đọc.

### A6.4. Những lỗi bị chặn khi review ở setting màu

- Tự định nghĩa mảng màu riêng trong plugin thay vì đọc palette của theme.
- Lưu hex vào attribute có ý nghĩa là slug, hoặc ngược lại.
- Dùng `PanelColorSettings`/`ColorPalette` cho màu nền và màu chữ chính của block trong khi supports làm được.
- Cộng class màu bằng tay trong `save` trong khi `useBlockProps()` đã sinh.
- Đổi slug preset đã phát hành (kể cả trong theme.json do plugin cung cấp qua filter) mà không có bước migrate cho nội dung cũ.
- Cho chọn màu nhưng không có đường xóa về mặc định.

### A6.5. Setting màu khi theme siết hoặc nới palette

Palette không phải hằng số. Cùng một block phải chạy đúng trên các theme có chính sách màu khác nhau, và Agent phải xử lý đủ bốn tình huống sau thay vì chỉ thử trên theme đang phát triển.

- **Theme tắt màu tự do** (`color.custom: false` trong `theme.json`, hoặc tắt qua Global Styles): control màu chỉ còn preset. Code của plugin MUST đọc cờ này từ settings của editor và không tự mở lại đường chọn màu tự do. Attribute `custom*` đã lưu từ trước vẫn phải render đúng, chỉ là không tạo thêm được bằng UI.
- **Theme tắt gradient hoặc duotone:** ẩn hoặc vô hiệu hóa phần tương ứng trong control. `ColorGradientSettingsDropdown` tự tôn trọng settings khi được truyền đúng ngữ cảnh; tự dựng control thì Agent phải tự kiểm tra cờ `color.gradients` và `color.customGradient`.
- **Theme đổi giá trị của một slug:** slug giữ nguyên, hex thay đổi. Đây là lý do A6 cấm lưu hex thay slug: nội dung lưu slug tự đi theo theme mới, nội dung lưu hex đứng yên và lệch tông với toàn site.
- **Theme bỏ hẳn một slug:** nội dung cũ trỏ tới preset không còn tồn tại. Render MUST có fallback: class preset không sinh CSS thì phần tử kế thừa màu của ngữ cảnh cha, không được mất chữ hoặc mất nền tới mức không đọc được. Plugin không tự định nghĩa lại slug đã mất bằng hex đoán mò.
- **Site dùng plugin này cùng một plugin khác cũng can thiệp palette:** thứ tự filter quyết định palette cuối. Plugin không được khẳng định palette trong tài liệu hoặc test của mình ngoài palette mà theme và Global Styles của người dùng thật sự cung cấp lúc chạy.

### A6.6. Render màu ở PHP và kiểm tra tương phản

Render phía PHP cho màu của phần tử con, theo đúng hai attribute đã tách ở A6.2:

```php
$icon_style = '';
if ( ! empty( $attributes['customIconColor'] ) ) {
    $custom = sanitize_hex_color( $attributes['customIconColor'] );
    if ( $custom ) {
        $icon_style = ' style="color:' . esc_attr( $custom ) . '"';
    }
}
$icon_class = '';
if ( ! empty( $attributes['iconColor'] ) ) {
    $icon_class = ' has-' . sanitize_html_class( $attributes['iconColor'] ) . '-color has-text-color';
}
// In ra: <span class="acme-notice-card__icon<?php echo esc_attr( $icon_class ); ?>"<?php echo $icon_style; ?>>
```

Ba điểm kiểm tra của mẫu trên: màu tự do đi qua `sanitize_hex_color()` và bị bỏ nếu không hợp lệ, không in nguyên văn; slug đi qua `sanitize_html_class()` trước khi thành tên class; khi cả hai attribute đều rỗng, phần tử không nhận class màu nào và kế thừa theo theme — đó là trạng thái mặc định đúng, không phải thiếu sót.

Kiểm tra tương phản trong Editor, ở mức cảnh báo theo A6.3: tính tỉ lệ tương phản từ hai giá trị màu thật đang áp dụng (sau khi đã giải slug thành hex qua palette), chỉ cảnh báo khi cặp đó áp lên chữ thật. Không cảnh báo cho màu của phần tử trang trí không chứa chữ, và không cảnh báo khi một trong hai màu kế thừa từ ngữ cảnh mà Editor không biết chắc — cảnh báo sai làm người dùng tắt cảnh báo thật.

### A5.12. Chiều ngang của chrome trong Editor

Chrome vẽ trong canvas — khung xem trước, stage, dải điều khiển, mọi lớp nằm trong block — lấy chiều ngang từ hộp căn lề mà Editor đã tính cho block đó. Không có chiều ngang thứ hai cho riêng chrome.

- MUST, khi block khai báo `supports.align`, gắn class căn lề khớp attribute `align` đã lưu lên root mà `useBlockProps()` trả về: `alignwide`, `alignfull`, hoặc không thêm class khi căn thường. `useBlockProps()` không thay cho class này nếu class không có trên đúng root đang nhận CSS editor. Thiếu class thì Editor áp content width mặc định của canvas và block hẹp hơn vùng soạn.
- MUST để chrome bên trong rộng `width: 100%` của root đó. `max-width` và margin ngang của root thuộc về Editor và về parent (Group, Columns). NEVER ghi đè chúng bằng `max-width: none`, margin ngang âm, hoặc `100vw`.
- NEVER lấy chiều rộng pixel của trang mockup, artifact review, hoặc cửa sổ trình duyệt làm width của block.
- SHOULD coi là xong chỉ sau khi đo trong đúng document hoặc iframe của Editor: hai mép của root trùng một block cùng chế độ căn lề trong cùng parent; trong parent hẹp, rect của chrome nằm trong rect của parent và `scrollWidth` của document không lớn hơn `clientWidth`.
- A9.3 là luật frontend: reset bleed của khung theme trên trang đã xuất bản. Nó không áp cho CSS editor và không cho phép chrome editor thoát content width của canvas. Chiều ngang trong Editor là mục này.

## A7. Các pattern Editor UI thường gặp khác

### A7.1. Khoảng cách và kích thước

- MUST dùng `supports.spacing` cho padding/margin/blockGap của chính block. Giá trị lưu trong `style.spacing.*` dưới dạng preset slug (`var:preset|spacing|50`) hoặc giá trị tự do — Agent không tự parse chuỗi này, chỉ để core xử lý qua `useBlockProps`.
- Control tự chế cho kích thước của phần tử con dùng `UnitControl` từ `@wordpress/components` (hỗ trợ px, %, rem, vw kèm đổi đơn vị đúng chuẩn) — NEVER dùng `TextControl` bắt người dùng tự gõ cả đơn vị.
- MUST khóa các phía khi người dùng chưa tách riêng: pattern chuẩn là control một giá trị cho mọi phía, tách chi tiết chỉ khi người dùng chủ động bấm nút unlink. Không bày sẵn bốn ô padding ngay từ đầu.

### A7.2. Typography cho phần tử con

- Ưu tiên supports như màu. Khi cần cỡ chữ riêng cho một phần tử con, dùng `FontSizePicker` của `@wordpress/block-editor`, lấy danh sách cỡ từ settings của editor (`useSettings( 'typography.fontSizes' )`), lưu slug vào attribute `…FontSize` và giá trị tự do vào `style`-tương-đương của phần tử đó. Cùng một kỷ luật slug/custom như màu ở A6.

### A7.3. Media

- MUST lưu `id` của attachment là dữ kiện chính, `url` chỉ là bản suy ra để tiện render. Khi render ở PHP, lấy lại URL từ `wp_get_attachment_image()` / `wp_get_attachment_url()` theo ID, để việc đổi kích thước ảnh, CDN hoặc di chuyển thư viện không làm hỏng nội dung.
- MUST dùng `MediaPlaceholder` khi block chưa có media, và nút thay thế media nằm trong toolbar hoặc Inspector sau khi đã chọn. `MediaUpload` luôn bọc trong `MediaUploadCheck` để tôn trọng capability tải lên của người dùng hiện tại.
- MUST cho phép nhập `alt` cho ảnh có nội dung, lấy mặc định từ alt của attachment nhưng cho sửa ở cấp block khi ngữ cảnh khác. Ảnh trang trí thuần túy để `alt=""`.
- MUST khai báo `allowedTypes` hẹp nhất có thể (`image`, hoặc cụ thể hơn khi cần) trong control chọn media.

### A7.4. Danh sách lặp lại: InnerBlocks thắng attribute array

- Khi mỗi mục trong danh sách có style riêng, có thể lồng cấp, hoặc cần được chọn/kéo thả/sắp xếp như nội dung thật: MUST dùng block con + `InnerBlocks` với `allowedBlocks`, `template` và `templateLock` có chủ đích.
- Khi danh sách chỉ là dữ liệu phẳng cấu hình (ví dụ vài cặp nhãn–giá trị không định dạng): được dùng attribute `array`, với UI gồm nút thêm, xóa có xác nhận khi mục đã có dữ liệu, và kéo sắp xếp hoặc nút lên/xuống dùng được bằng bàn phím.
- NEVER lưu danh sách nội dung trình bày thành một chuỗi JSON trong một attribute string. Dữ liệu như vậy không tìm kiếm được, không migrate từng mục được và vỡ validation khi đổi cấu trúc.

### A7.5. Dữ liệu từ post và từ site trong Editor

- Đọc dữ liệu thực thể bằng `@wordpress/data` với store `core` / `core-data`: `useEntityProp` cho meta của post đang sửa, `useEntityRecords` cho danh sách. NEVER gọi `fetch` thẳng tới `/wp-json` từ component khi store của core đã có dữ liệu đó, vì sẽ trùng request và lệch cache.
- Ghi meta của post qua `useEntityProp( 'postType', postType, 'meta' )` để Editor tự quản lý trạng thái dirty và lưu cùng nút Update. NEVER gọi REST riêng để lưu meta song song với luồng lưu của Editor.
- Dữ liệu cấu hình riêng của plugin (không thuộc post) mới đi qua REST route riêng của plugin bằng `apiFetch`, xem A8.

### A7.6. Liên kết: pattern đầy đủ, không chỉ là một ô URL

- Một setting liên kết hoàn chỉnh gồm bốn dữ kiện: `url`, mở tab mới hay không (`opensInNewTab`), `rel` suy ra từ lựa chọn đó, và nhãn của liên kết vốn là nội dung sửa tại chỗ chứ không nằm trong setting. Lưu thiếu dữ kiện thứ hai là lỗi hay gặp nhất: người dùng không cách nào đặt mở tab mới.
- Khi `opensInNewTab` bật, render MUST tự cộng `rel="noreferrer noopener"` trừ khi spec ghi rõ lý do khác. Người dùng không phải tự biết tới `rel`.
- URL nhập vào phải qua validate ở cả Editor (cảnh báo khi sai định dạng) và server khi render (`esc_url()`), vì nội dung đã lưu có thể chứa URL bị sửa tay.
- Liên kết tới nội dung trong site nên dùng picker chọn bài viết của core khi có thể, và lưu ID kèm URL suy ra, cùng kỷ luật như media ở A7.3: đổi slug bài viết không làm hỏng liên kết đã lưu.

### A7.7. Control phụ thuộc và hiển thị có điều kiện

- Control con chỉ xuất hiện, hoặc chỉ bật, khi control cha ở trạng thái cần nó. Ẩn hẳn khi ngữ cảnh chưa tới (ví dụ chưa chọn nguồn dữ liệu thì chưa hiện trường chọn số lượng), vô hiệu hóa kèm `help` giải thích khi người dùng cần biết control tồn tại nhưng đang bị khóa bởi lựa chọn khác.
- NEVER ẩn control đang chứa giá trị khác mặc định mà không báo: người dùng đổi control cha, control con biến mất cùng giá trị đã đặt, và họ không hiểu dữ liệu đi đâu. Khi ẩn một control có giá trị, hoặc giữ giá trị và báo rõ trong `help` của control cha, hoặc đặt lại giá trị một cách có chủ đích và ghi vào changelog của tính năng.
- Điều kiện hiển thị phải suy ra từ attribute, không từ trạng thái UI tạm thời, để mở lại bài viết thì Inspector dựng lại đúng hình dạng.

### A7.8. Block variation, style variation và pattern — chọn đúng công cụ đóng gói

- **Style variation:** cùng một block, khác trình bày, khác nhau chỉ bằng class `is-style-*` và CSS. Dùng cho biến thể nhìn thấy được như "nổi bật", "tối", "viền mảnh".
- **Block variation:** cùng một block, khác attribute mặc định, tiêu đề và icon trong ô chèn. Dùng khi một "loại nội dung" thật ra là block có sẵn đặt sẵn cấu hình, ví dụ thẻ cảnh báo nguy hiểm so với thẻ cảnh báo thông tin.
- **Block pattern:** nhiều block lắp sẵn thành một bố cục. Dùng khi giá trị nằm ở cách lắp, không ở một block đơn lẻ.
- Chọn sai tầng là lỗi thiết kế: tạo block mới cho thứ đáng lẽ là variation làm phình ô chèn và nhân đôi bảo trì; nhồi một bố cục nhiều block vào một block đơn làm mất khả năng sửa từng phần của người dùng.

## A8. UI nối với backend (backend connect)

### A8.1. Kênh giao tiếp được phép, theo thứ tự ưu tiên

1. **Cơ chế có sẵn của Editor/core:** entity store, block binding, `ServerSideRender` có kiểm soát — dùng khi dữ liệu là nội dung WordPress chuẩn.
2. **REST API của plugin:** route riêng dưới namespace của plugin cho dữ liệu và hành động riêng (xem Phần C7). Đây là kênh mặc định cho mọi màn hình React của plugin, cả trong Editor lẫn wp-admin.
3. **`admin-ajax.php`:** chỉ cho tính năng kế thừa hoặc tương tác nhỏ trong admin cổ điển không dùng React. Tính năng mới viết bằng REST trước; dùng AJAX phải ghi lý do.
4. **`wp_localize_script()` / `wp_add_inline_script()`:** chỉ để truyền cấu hình khởi tạo nhỏ (nonce, REST root, cờ tính năng, chuỗi dịch) xuống JS. NEVER dùng làm kênh truyền dữ liệu nghiệp vụ lớn hoặc dữ liệu thay đổi theo tương tác.

### A8.2. Luật cho mọi lời gọi từ UI xuống backend

- MUST gửi kèm nonce đúng cơ chế: REST trong admin/Editor dùng header `X-WP-Nonce` với `wp_create_nonce( 'wp_rest' )` (apiFetch của core tự làm khi dùng middleware mặc định); AJAX dùng nonce riêng của plugin và kiểm tra bằng `check_ajax_referer()` ở server.
- MUST hiển thị đủ bốn trạng thái cho mọi vùng dữ liệu tải từ server: đang tải (skeleton hoặc `Spinner`, không để trang trắng), rỗng (thông điệp nói rõ vì sao rỗng và hành động tiếp theo), lỗi (thông điệp đọc hiểu được kèm nút thử lại), và có dữ liệu. Thiếu trạng thái lỗi hoặc rỗng là lỗi chặn review.
- MUST xử lý lỗi theo cấu trúc lỗi chuẩn của REST (`code`, `message`, `data.status`): hiển thị `message` cho người dùng khi nó an toàn, ánh xạ `code` sang thông điệp riêng khi cần dịch. NEVER hiển thị stack trace, câu SQL hoặc thông điệp lỗi thô của PHP cho người dùng.
- MUST vô hiệu hóa nút gửi trong lúc request đang chạy và chống gửi trùng ở cả client lẫn server (server là nơi quyết định cuối cùng: thao tác ghi phải idempotent hoặc có khóa chống trùng khi hậu quả của việc trùng là thật, ví dụ trừ điểm hai lần).
- SHOULD hủy request đang bay khi component unmount hoặc khi người dùng đổi ngữ cảnh (AbortController qua apiFetch khi hỗ trợ), và bỏ qua response đến muộn của request cũ để không ghi đè trạng thái mới.
- MUST không tin dữ liệu trả về: validate hình dạng response ở client trước khi render (kiểm tra field bắt buộc tồn tại và đúng kiểu), vì plugin khác hoặc filter có thể thay đổi response.
- NEVER nhúng bí mật (API key, token của bên thứ ba) xuống JS. JS chỉ nhận dữ liệu đã được server lọc cho đúng người dùng hiện tại.
- SHOULD phân trang mọi danh sách tải từ server và tôn trọng header phân trang của REST (`X-WP-Total`, `X-WP-TotalPages`) thay vì tải toàn bộ rồi cắt ở client.

### A8.3. Frontend tương tác (ngoài Editor)

- Ưu tiên render phía server bằng PHP cho nội dung chính; JavaScript ở frontend chỉ tăng cường tương tác. Nội dung quan trọng cho SEO và cho người tắt JS phải có mặt trong HTML ban đầu.
- Với tương tác phía frontend cần cập nhật từng phần (lọc, sắp xếp, thêm vào danh sách), SHOULD cân nhắc Interactivity API của WordPress cho block (`viewScriptModule`, directive `data-wp-*`, store phía client) trước khi tự dựng một app JS riêng, vì nó giữ render phía server và hydrate nhẹ đúng triết lý của core.
- Mọi endpoint mà JS frontend gọi phải là REST route công khai có chủ đích (dữ liệu vốn công khai) hoặc yêu cầu đăng nhập + capability phù hợp. NEVER để lộ dữ liệu nội bộ qua route công khai chỉ vì frontend cần nó cho tiện.

---

### A8.4. Mẫu gọi REST từ admin và Editor bằng `apiFetch`

```js
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

// Đọc danh sách, tôn trọng phân trang của server.
const { data, totalPages } = await apiFetch( {
  path: '/acme/v1/attempts?per_page=20&page=1',
  parse: false, // tự đọc header X-WP-Total / X-WP-TotalPages khi cần
} ).then( async ( response ) => ( {
  data: await response.json(),
  totalPages: parseInt( response.headers.get( 'X-WP-TotalPages' ), 10 ) || 1,
} ) );

// Ghi dữ liệu: method và body rõ ràng, lỗi đọc theo code, không theo message.
try {
  await apiFetch( {
    path: `/acme/v1/attempts/${ id }/submit`,
    method: 'POST',
    data: { answers },
  } );
} catch ( error ) {
  // error.code là mã ổn định phía server (C6.4), error.message chỉ để hiển thị.
  showNotice( error.message || __( 'Không gửi được. Hãy thử lại.', 'acme' ) );
}
```

Điểm kiểm tra: đường dẫn dùng `path` tương đối dưới namespace của plugin, không tự ghép REST root; nonce do middleware mặc định của `apiFetch` trong admin và Editor lo, component không tự quản nonce; nhánh lỗi luôn tồn tại và luôn có hành động thử lại cho người dùng.

### A8.5. Frontend tương tác bằng Interactivity API — khi nào dùng, khi nào không

- Dùng Interactivity API khi tương tác nằm trong một block đã render ở server, trạng thái nhỏ và cục bộ (mở–đóng, lọc tại chỗ, đếm, chuyển tab), và nội dung phải có sẵn trong HTML cho SEO và cho người tắt JavaScript.
- Không dùng khi tương tác là một ứng dụng thật với định tuyến, trạng thái lớn hoặc nhiều màn hình — đó là việc của một admin app hoặc một trang riêng, không phải của một block.
- Khi dùng: khai báo `viewScriptModule` trong `block.json`, khởi tạo store bằng `store()` với namespace của plugin, truyền dữ liệu khởi tạo từ PHP qua `wp_interactivity_state()` hoặc context của directive, và không đưa dữ liệu nhạy cảm vào state vì state in ra HTML của trang.
- Mọi hành động làm thay đổi dữ liệu thật ở server vẫn phải qua REST route có `permission_callback` như C6. Interactivity API là lớp hiển thị, không phải lớp phân quyền.

## A9. Độc lập theme–plugin, hai lớp width và kiểm tra deploy (DP-12)

Mục này rút ra từ dự án skvn-marine (pitfall DP-12 và hợp đồng `docs/standards/css-layout-safety-contract.md` của dự án, ghi vào convention 2026-11-19). Nó áp cho mọi block plugin được phân phối độc lập với theme, không chỉ cho dự án nguồn.

### A9.1. Hai chủ sở hữu khác nhau: theme là canvas, plugin là hộp của chính block

- MUST: block plugin phải hiển thị đúng khi chỉ cài plugin, không cài theme đi kèm. Mọi style mà block cần để đứng vững — chrome của block gồm tab, mũi tên điều hướng, overlay, heading và runtime của nó — MUST đi cùng gói plugin. NEVER để một phần chrome của block sống trong `style.css` của theme rồi coi theme là điều kiện ngầm.
- MUST phân biệt hai lớp width, hai chủ sở hữu: theme sở hữu canvas cho mọi `.alignfull` trên site của nó; plugin chỉ sở hữu hộp của chính block của nó. Theme adapter cho `.alignfull` là hợp lệ trên site của theme đó và không được xoá, nhưng NEVER coi nó là đủ để kết luận plugin độc lập.
- Hệ quả khi review: chrome của block hiện lên đúng không chứng minh width đã đúng, và width đúng trên site có theme đi kèm không chứng minh block đúng khi chỉ cài plugin. Hai việc kiểm tra riêng, ghi kết quả riêng.

### A9.2. Kiểm tra deploy: local có, live không có thì là “chưa deploy”

- MUST coi build và deploy của plugin và của theme là hai đường khác nhau: build và đóng gói plugin (`npm run build` rồi zip plugin) không phải là tải `style.css` của theme lên, và ngược lại.
- MUST không giả định theme trên server đã là bản local mới nhất khi tham số phiên bản (`?ver=`) của theme được lấy từ `filemtime` trên chính server đang chạy: con số đó chỉ nói file trên server được sửa lúc nào, không nói nó là bản nào ở local.
- Khi một selector có ở local nhưng không có trong CSS bytes đã tải về từ live, hoặc không khớp computed style trên live: kết luận bắt buộc là **chưa deploy**, không ghi “CSS sai”. Ghi “CSS sai” trong tình huống này làm người sau sửa code vốn đã đúng.
- MUST đo bằng `getComputedStyle` và danh sách matched styles trước khi kết luận về width hoặc specificity trên live. Style inline hoặc style do framework/theme in ra có thể thắng selector của theme — trong dự án nguồn, style của GeneratePress thắng ở mức đặc hiệu `(0,3,0)` — nên đọc file CSS thôi là chưa đủ bằng chứng.

### A9.3. Reset bleed cho block `alignfull` nằm trong CSS của plugin

- Với block dùng căn lề `alignfull` của Gutenberg: đoạn reset bleed của khung cha (trong dự án nguồn là GeneratePress) MUST nằm trong CSS của plugin, dạng cốt lõi là `width: 100%; margin: 0`, với độ đặc hiệu ít nhất bằng selector khung cha đang bleed — trong dự án nguồn là `body:not(.no-sidebar) .entry-content .alignfull`, đặc hiệu `(0,3,1)`.
- Đây là ngoại lệ có phạm vi hẹp của luật giới hạn đặc hiệu ở A3 (tối đa một class cộng một pseudo-class): ngoại lệ chỉ áp cho đúng selector reset `alignfull` này, chỉ để thắng bleed đã đo được của khung cha, và phải có comment ghi bleed của ai, đo ở đâu. Mọi selector khác vẫn theo A3. NEVER dùng ngoại lệ này làm tiền lệ nới đặc hiệu cho style thường.
- NEVER đòi hỏi một class canvas riêng trên `body` (trong dự án nguồn là dạng `body.skvn-full-width-canvas`) như điều kiện để block đúng width: block phải tự đúng trong hộp của nó.
- NEVER che overflow bằng `overflow-x: hidden` hoặc `overflow-x: clip` trên tổ tiên, bằng `100vw`, bằng lề âm dạng `-50vw`, hoặc bằng cách trừ chiều cao header. Các cách đó giấu triệu chứng và làm vỡ sticky, focus outline và cuộn ngang thật ở nơi khác; cách đúng là sửa hộp gây tràn ở đúng chủ sở hữu của nó (A9.1).
- Reset ở mục này không áp cho CSS của Editor. Chrome trong canvas theo A5.12.

# Phần B — Tiêu chuẩn xây dựng cơ sở dữ liệu

Nguyên tắc bao trùm của WordPress, và là điểm các team giỏi thống nhất: **dùng cấu trúc có sẵn của WordPress càng lâu càng tốt, chỉ tự tạo bảng khi đã chứng minh được cấu trúc có sẵn không đáp ứng.** Custom Post Type (CPT) và postmeta cho sẵn miễn phí giao diện quản trị, revisions, REST API, tìm kiếm, phân quyền và tương thích với mọi plugin backup/cache — những thứ mà bảng tự tạo phải tự xây lại toàn bộ.

## B1. Cây quyết định chọn nơi lưu dữ liệu

Agent MUST đi qua cây này theo thứ tự và ghi lại điểm dừng trong mô tả công việc. Không được nhảy thẳng xuống bước 5.

1. **Cấu hình toàn site, ít, ít thay đổi cấu trúc?** → Options API (`get_option` / `update_option`). Ví dụ: bật/tắt tính năng, ngưỡng số, khóa cấu hình. Xem thêm luật autoload ở B8.
2. **Nội dung có vòng đời như một bài viết** (có tiêu đề, trạng thái nháp/đã đăng, tác giả, ngày đăng, cần hiện trong admin, cần REST)? → CPT + postmeta cho trường phụ. Ví dụ: bài học, sản phẩm, hồ sơ.
3. **Quan hệ phân loại nhiều-nhiều với nội dung** (lọc theo nhóm, một mục thuộc nhiều nhóm, nhóm có thứ bậc hoặc không)? → Taxonomy (kèm termmeta khi cần trường phụ cho nhóm). NEVER lưu danh sách ID phân loại thành chuỗi phẩy trong một cột meta.
4. **Dữ liệu của người dùng** (tùy chọn cá nhân, tiến độ, trạng thái theo tài khoản)? → Usermeta nếu ít và nhẹ; bảng riêng nếu là bản ghi có cấu trúc, nhiều dòng mỗi người dùng và cần truy vấn lọc/sắp xếp (ví dụ từng lần làm bài, từng sự kiện).
5. **Bảng riêng (custom table)** — chỉ khi thỏa ít nhất một điều kiện cứng dưới đây, và Agent phải nêu đúng điều kiện đó:
   - Khối lượng lớn: dự kiến trên khoảng 10.000–50.000 bản ghi và phải truy vấn lọc/sắp xếp/tổng hợp thường xuyên trên các cột không phải nội dung bài viết.
   - Tốc độ ghi cao hoặc ghi liên tục (log sự kiện, lượt thử, giao dịch) mà postmeta sẽ phình không kiểm soát.
   - Cần kiểu dữ liệu và index chính xác cho truy vấn nghiệp vụ (tổng điểm theo khoảng ngày, xếp hạng, thống kê) mà meta query không đáp ứng ở mức hiệu năng chấp nhận được.
   - Dữ liệu không có vòng đời của bài viết và việc thành CPT sẽ tạo rác trong admin, REST và tìm kiếm.
6. **Dữ liệu tạm, tính lại được?** → Transient hoặc object cache, không lưu lâu dài (xem B8). NEVER tạo bảng để lưu thứ tính lại được trong vài giây.

Hệ quả bắt buộc khi chọn bảng riêng: plugin phải tự chịu trách nhiệm về giao diện quản trị (nếu cần), REST exposure (nếu cần), dọn dẹp khi gỡ, xuất/xóa dữ liệu cá nhân, và migration — liệt kê đủ các việc này trong kế hoạch trước khi viết schema.

## B2. Đặt tên và quy ước chung

- MUST đặt tên bảng là `{$wpdb->prefix}<prefix>_<tên_số_nhiều_snake_case>`, ví dụ `wp_acme_attempts`. Luôn xây tên từ `$wpdb->prefix`, NEVER ghi cứng `wp_`.
- MUST truy cập tên bảng qua một hàm hoặc hằng duy nhất của plugin (ví dụ `acme_table( 'attempts' )`), để multisite và đổi prefix không phải sửa nhiều nơi.
- MUST đặt tên cột bằng `snake_case`, số ít, tự mô tả: `user_id`, `lesson_id`, `score`, `created_at`. Tránh tên mơ hồ như `data`, `value`, `type` đứng một mình.
- MUST đặt tên meta key, option name có prefix và bắt đầu bằng `_` đối với postmeta cần ẩn khỏi giao diện Custom Fields mặc định (ví dụ `_acme_answer_key`). Option name tối đa 191 ký tự, meta key tối đa 255 ký tự — giữ ngắn hơn nhiều so với trần này.
- MUST đăng ký meta bằng `register_post_meta()` / `register_term_meta()` / `register_meta()` với đầy đủ `type`, `single`, `default`, `show_in_rest` (và `auth_callback` khi meta nhạy cảm). Đây là điều kiện để meta xuất hiện đúng trong Editor, REST và validation của core.
- NEVER dùng tên cột là từ khóa dành riêng của MySQL (`order`, `group`, `key` đứng một mình). Đặt tên khác (`sort_order`, `group_slug`) thay vì dựa vào backtick để thoát.

## B3. Thiết kế schema cho bảng riêng

### B3.1. Cột và kiểu dữ liệu

- MUST có khóa chính surrogate `id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT`. Không dùng khóa chính tự nhiên (email, slug, mã ngoài) làm khóa chính.
- MUST chọn kiểu hẹp nhất đúng nghĩa: `TINYINT(1)` hoặc `TINYINT UNSIGNED` cho cờ/trạng thái nhỏ, `INT UNSIGNED` / `BIGINT UNSIGNED` cho ID và số đếm, `DECIMAL(p,s)` cho tiền và điểm cần chính xác — NEVER dùng `FLOAT`/`DOUBLE` cho tiền.
- MUST dùng `VARCHAR` có độ dài suy từ nghiệp vụ (slug/mã: 100–191; tiêu đề ngắn: 255), `TEXT`/`MEDIUMTEXT` cho nội dung dài thật sự. Cột nào sẽ nằm trong index thì độ dài tối đa 191 ký tự để tương thích utf8mb4 với giới hạn index của MySQL/MariaDB phổ biến.
- MUST khai báo `NOT NULL` kèm `DEFAULT` hợp lệ cho mọi cột không có lý do nghiệp vụ để rỗng. Dùng `NULL` có chủ đích (ví dụ `completed_at` chưa xảy ra) và phân biệt rõ "chưa có" với "bằng 0/rỗng" trong code.
- MUST lưu thời gian bằng `DATETIME` theo UTC, ghi bằng `gmdate()` / `current_time( 'mysql', true )`, và cột chuẩn đặt tên `created_at`, `updated_at`. NEVER lưu timestamp dạng chuỗi địa phương mơ hồ hoặc trộn múi giờ trong cùng một cột. Nếu cần mốc theo giờ site để hiển thị lịch, lưu thêm cột riêng có tên nói rõ.
- SHOULD lưu trạng thái dạng chuỗi ngắn có danh sách đóng (ví dụ `pending`, `passed`, `failed`) thay vì số ma thuật, khi số trạng thái ít và cần đọc log bằng mắt. Danh sách trạng thái phải được định nghĩa một nơi duy nhất trong code (hằng hoặc enum) và validate ở mọi điểm ghi.
- SHOULD tránh cột JSON cho dữ liệu cần lọc, sắp xếp hoặc join. JSON chỉ dành cho payload phụ, ít truy vấn (ví dụ ảnh chụp cấu trúc bài nộp, dữ liệu thô từ API ngoài) và phải có cột trích xuất riêng cho mọi trường cần truy vấn thường xuyên.
- NEVER lưu dữ liệu đã tuần tự hóa của PHP (`serialize`) vào cột tự thiết kế. Cần cấu trúc thì dùng cột riêng hoặc JSON có `wp_json_encode()` và đọc bằng `json_decode()`. Hàng của core (options, meta) là ngoại lệ do core quản lý.
- SHOULD có cột `schema` phụ trợ khi cần truy vết: khóa ngoại dạng mềm — cột `<entity>_id BIGINT UNSIGNED` trỏ tới ID của post/user/term tương ứng. WordPress không dùng ràng buộc khóa ngoại thật ở cấp DB; tính toàn vẹn do code đảm bảo (xem B3.3).

Ví dụ schema chuẩn cho bảng ghi nhận lượt làm bài:

```sql
CREATE TABLE {$table} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL DEFAULT 0,
  lesson_id bigint(20) unsigned NOT NULL DEFAULT 0,
  status varchar(20) NOT NULL DEFAULT 'started',
  score decimal(6,2) NULL DEFAULT NULL,
  payload longtext NULL,
  created_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  updated_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY  (id),
  KEY user_lesson (user_id, lesson_id),
  KEY lesson_status_created (lesson_id, status, created_at)
) {$charset_collate};
```

### B3.2. Index: thiết kế từ truy vấn, không đoán

- MUST liệt kê các truy vấn chính của tính năng trước khi đặt index. Mỗi index phải trả lời được câu hỏi "nó phục vụ truy vấn nào". Index không có truy vấn tương ứng là chi phí ghi vô ích.
- MUST đặt index cho mọi cột dùng trong `WHERE`, `JOIN`, `ORDER BY` thường xuyên, và ưu tiên index hợp (composite) theo đúng thứ tự cột của truy vấn hay nhất: cột lọc đẳng thức trước, cột khoảng/sắp xếp sau.
- MUST đặt `UNIQUE` ở cấp DB cho mọi bất biến nghiệp vụ thật (ví dụ một người dùng chỉ có một bản ghi tiến độ cho một bài học: `UNIQUE KEY user_lesson (user_id, lesson_id)`). Kiểm tra trùng bằng code trước khi ghi là chưa đủ vì hai request đồng thời vẫn lọt; DB là chốt cuối.
- SHOULD giữ tổng số index của một bảng ở mức cần thiết (thường không quá 5–7). Mỗi index thêm làm chậm ghi.
- NEVER đặt index trên cột `TEXT`/`LONGTEXT` và không dựa vào tìm kiếm chuỗi con (`LIKE '%…%'`) trên cột lớn làm tính năng chính; nhu cầu tìm kiếm toàn văn phải được giải quyết bằng cơ chế tìm kiếm phù hợp và ghi vào spec.

### B3.3. Toàn vẹn tham chiếu không có khóa ngoại

- MUST kiểm tra sự tồn tại của thực thể cha khi ghi (post/user còn tồn tại và đúng loại) ở lớp nghiệp vụ.
- MUST định nghĩa hành vi khi cha bị xóa cho từng quan hệ: xóa theo (cascade bằng code qua hook `before_delete_post` / `delete_user`), giữ lại làm dữ liệu lịch sử, hoặc vô hiệu hóa. Quyết định này phải có trong spec của tính năng, không để mặc định mơ hồ.
- MUST có job hoặc lệnh WP-CLI dọn bản ghi mồ côi định kỳ cho bảng lớn, thay vì giả định code xóa theo không bao giờ lỗi.

### B3.4. Bảng chọn kiểu cột theo loại dữ liệu

| Dữ liệu | Kiểu cột | Độ dài / ghi chú |
|---|---|---|
| ID của post, user, term, attachment | `bigint(20) unsigned` | Cùng kiểu với ID của core để join không ép kiểu |
| Khóa chính surrogate | `bigint(20) unsigned auto_increment` | Xem B3.1 |
| Trạng thái trong danh sách đóng | `varchar(20)` | Danh sách định nghĩa một nơi trong code, validate khi ghi |
| Cờ đúng/sai | `tinyint(1)` | Chỉ hai giá trị 0 và 1, có `DEFAULT` |
| Số đếm, số lượng | `int(10) unsigned` hoặc `bigint` khi có thể rất lớn | Không âm thì `unsigned`, ghi rõ trong DocBlock |
| Điểm, tỉ lệ cần chính xác | `decimal(6,2)` hoặc theo thang điểm thật | Trần của thang điểm quyết định phần nguyên |
| Tiền | `decimal(19,4)` hoặc số nguyên theo đơn vị nhỏ nhất | Chọn một cách cho cả plugin, ghi vào spec; NEVER `float` |
| Slug, mã ngoài, khóa sự kiện | `varchar(100)` tới `varchar(191)` | Nằm trong index thì không quá 191 ký tự |
| Tiêu đề, tên hiển thị | `varchar(255)` | Dài hơn thì đó là nội dung, chuyển `text` |
| Nội dung dài, payload JSON | `text`, `mediumtext`, `longtext` theo độ lớn thật | Không index, không lọc trực tiếp, xem B3.1 |
| Thời gian xảy ra | `datetime` UTC | Hai cột chuẩn `created_at`, `updated_at` |
| Thời gian chỉ có ngày | `date` | Chỉ khi giờ thật sự không có nghĩa nghiệp vụ |
| Địa chỉ IP khi thật cần lưu | `varchar(45)` | Đủ cho IPv6; cân nhắc riêng tư ở B9 trước khi lưu |

### B3.5. Ba mẫu bảng điển hình và điểm khác nhau của chúng

Ba loại bảng dưới đây chiếm phần lớn nhu cầu tạo bảng riêng. Nhận ra bảng sắp tạo thuộc loại nào giúp chọn đúng index, retention và cách xóa ngay từ đầu.

- **Bảng sự kiện / log** (mỗi lần nộp bài, mỗi lượt xem, mỗi lần đồng bộ): chỉ ghi thêm, không sửa, lớn nhanh. Index bám theo chiều đọc báo cáo, thường là `(đối tượng, thời gian)`. Bắt buộc có retention ở B11 và xóa theo lô ở B6 ngay từ bản đầu tiên, vì bảng này chắc chắn phình. Cột `payload` chứa chi tiết sự kiện dạng JSON, các trường cần lọc phải tách thành cột riêng.
- **Bảng tiến độ / trạng thái hiện tại** (một người dùng với một bài học có đúng một trạng thái): ít dòng hơn, sửa thường xuyên, bất biến duy nhất là trung tâm — `UNIQUE KEY (user_id, lesson_id)`. Ghi bằng mẫu chèn-hoặc-cập-nhật có chủ đích, và đọc phải nhanh theo từng người dùng. Bảng này không có retention: nó là trạng thái sống, xóa nó là xóa tiến độ của người dùng.
- **Bảng hàng đợi / công việc** (việc cần xử lý nền, email chờ gửi, tác vụ đồng bộ): có cột trạng thái công việc, số lần thử, thời điểm thử lại và thời điểm khóa. Index bám theo `(status, next_run_at)`. Mọi chuyển trạng thái đi qua một hàm duy nhất để hai worker không giành cùng một việc, và việc kẹt ở trạng thái đang xử lý quá lâu phải có đường tự giải phóng.

## B4. Tạo bảng và migration

### B4.1. `dbDelta()` và những giới hạn phải biết

- MUST tạo và cập nhật bảng bằng `dbDelta()` (nạp từ `wp-admin/includes/upgrade.php`), với charset collate lấy từ `$wpdb->get_charset_collate()`. NEVER tự chạy `CREATE TABLE` thô ngoài `dbDelta` trong luồng cài đặt chuẩn.
- MUST tuân thủ định dạng khắt khe của `dbDelta`, vì nó phân tích SQL bằng biểu thức chính quy chứ không phải bộ phân tích SQL thật: mỗi cột và mỗi key nằm trên một dòng riêng; hai dấu cách giữa `PRIMARY KEY` và danh sách cột; dùng từ khóa `KEY` thay cho `INDEX` và mọi key phải có tên; không dùng backtick quanh tên cột; từ khóa SQL viết hoa; khai báo độ dài cho kiểu có độ dài.
- MUST biết `dbDelta` không làm được gì: nó không xóa cột, không đổi tên cột, không xóa index. Ba việc này phải viết migration `ALTER TABLE` thủ công, có kiểm tra tồn tại trước khi chạy.
- MUST giữ toàn bộ schema hiện hành ở một nơi duy nhất (một hàm trả về SQL đầy đủ của mọi bảng). Migration từng bước chỉ chứa phần thay đổi tăng thêm so với schema đó.

### B4.2. Phiên bản schema và luồng nâng cấp

- MUST lưu phiên bản schema riêng trong option (ví dụ `acme_db_version`), tách khỏi phiên bản plugin, vì đa số bản phát hành không đụng tới DB.
- MUST kiểm tra nâng cấp ở mỗi lần tải (hook sớm như `plugins_loaded` / `admin_init` với so sánh phiên bản rẻ) chứ không chỉ trong `register_activation_hook`, vì hook kích hoạt **không chạy khi plugin được cập nhật**. Đây là lỗi kinh điển làm site đang chạy vỡ "unknown column" sau khi cập nhật.
- MUST viết migration idempotent: chạy lại hai lần cho cùng một kết quả, không lỗi, không nhân đôi dữ liệu. Kiểm tra điều kiện tồn tại trước mỗi thay đổi cấu trúc và dữ liệu.
- MUST chạy migration theo thứ tự phiên bản tăng dần, mỗi bước là một hàm riêng đặt tên theo phiên bản đích (ví dụ `acme_upgrade_to_120()`), và chỉ cập nhật option phiên bản sau khi bước đó thành công.
- MUST có khóa chống chạy đồng thời khi migration nặng (option khóa có thời hạn hoặc cơ chế tương đương), để hai request đồng thời không cùng chạy một migration.
- SHOULD đẩy migration dài (đổi dữ liệu hàng loạt) ra hàng đợi nền (Action Scheduler, xem C9) thay vì chạy trong request của người dùng. Request kích hoạt/nâng cấp chỉ làm việc nhẹ.
- MUST sao lưu có nghĩa là: trước migration phá hủy (xóa cột, đổi kiểu hẹp lại, xóa dữ liệu), ghi rõ trong changelog và tài liệu nâng cấp rằng cần sao lưu DB. Agent không tự chạy migration phá hủy lên dữ liệu thật khi chưa được người phụ trách xác nhận.
- NEVER sửa schema đã phát hành bằng cách âm thầm đổi hàm cài đặt ban đầu mà không tăng phiên bản schema. Site đã cài sẽ không bao giờ nhận được thay đổi đó.

## B5. Lớp truy cập dữ liệu (repository)

- MUST gom mọi truy vấn tới bảng riêng vào một lớp repository/service duy nhất cho mỗi bảng hoặc mỗi khái niệm nghiệp vụ. NEVER rải `$wpdb` khắp template, block render và REST controller.
- MUST dùng `$wpdb->insert()`, `$wpdb->update()`, `$wpdb->delete()` kèm định dạng (`%d`, `%s`, `%f`) cho ghi dữ liệu đơn giản, và `$wpdb->prepare()` cho mọi truy vấn tự viết. NEVER nối chuỗi input của người dùng, tham số request hoặc biến chưa kiểm chứng vào SQL.
- Với danh sách placeholder động (ví dụ `IN (…)`), MUST xây placeholder bằng `implode` trên mảng đã ép kiểu (ví dụ `array_map( 'absint', $ids )`) rồi mới `prepare`. NEVER nội suy mảng trực tiếp.
- MUST ép kiểu tại biên: ID qua `absint()`, số qua `intval`/`floatval`, chuỗi qua `sanitize_text_field( wp_unslash( … ) )` trước khi dữ liệu tới repository. Repository được quyền tin dữ liệu đầu vào của nó đã sạch vì kỷ luật này, và phải ghi rõ điều đó trong DocBlock.
- MUST kiểm tra kết quả ghi: `$wpdb->insert()` trả `false` là lỗi phải xử lý (trả `WP_Error` lên lớp trên), không bỏ qua. Khi cần, ghi log kèm `$wpdb->last_error` ở mức debug, không lộ ra UI.
- SHOULD đặt giới hạn mặc định cho mọi hàm lấy danh sách (`limit` mặc định, trần cứng ví dụ 100) và bắt buộc phân trang ở tầng gọi. NEVER viết hàm "lấy tất cả" không giới hạn cho bảng sẽ lớn dần.
- MUST dùng `WP_Query` / `get_posts()` đúng chuẩn cho dữ liệu post thay vì tự query bảng posts: không dùng `posts_per_page => -1`, dùng `no_found_rows => true` khi không cần phân trang, dùng `update_post_meta_cache` / `update_post_term_cache` tắt khi không cần, và tránh `post__not_in` trên tập lớn. Tự query `$wpdb` lên bảng của core chỉ khi có lý do đo được và phải ghi lý do.

### B5.1. Class repository mẫu — hình dạng chuẩn để bắt đầu

```php
<?php
namespace Acme\Plugin\Data;

use WP_Error;

/**
 * Lớp duy nhất được chạm vào bảng attempts.
 *
 * Đầu vào của mọi phương thức phải đã qua validate và sanitize
 * ở lớp gọi (REST controller hoặc service). Lớp này chỉ ép kiểu
 * lần cuối cho ID và số, không đọc superglobal.
 */
class Attempts_Repository {

    private function table(): string {
        global $wpdb;
        return $wpdb->prefix . 'acme_attempts';
    }

    /**
     * @return int|WP_Error ID của bản ghi mới, hoặc lỗi khi ghi thất bại.
     */
    public function create( int $user_id, int $lesson_id, string $status ) {
        global $wpdb;
        $now = current_time( 'mysql', true ); // UTC, xem B3.1.

        $inserted = $wpdb->insert(
            $this->table(),
            array(
                'user_id'    => $user_id,
                'lesson_id'  => $lesson_id,
                'status'     => $status,
                'created_at' => $now,
                'updated_at' => $now,
            ),
            array( '%d', '%d', '%s', '%s', '%s' )
        );

        if ( false === $inserted ) {
            return new WP_Error( 'acme_attempt_create_failed', 'Could not create attempt.' );
        }
        return (int) $wpdb->insert_id;
    }

    /**
     * Danh sách luôn có giới hạn và phân trang. Không tồn tại bản "lấy tất cả".
     *
     * @return object[] Tối đa $per_page bản ghi.
     */
    public function list_for_lesson( int $lesson_id, int $page = 1, int $per_page = 20 ): array {
        global $wpdb;
        $per_page = min( max( $per_page, 1 ), 100 );
        $offset   = ( max( $page, 1 ) - 1 ) * $per_page;

        return $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . $this->table() . ' WHERE lesson_id = %d ORDER BY created_at DESC LIMIT %d OFFSET %d',
                $lesson_id,
                $per_page,
                $offset
            )
        );
    }
}
```

Điểm kiểm tra của mẫu trên: tên bảng chỉ xây ở một hàm; định dạng `%d` và `%s` đi kèm mọi lần ghi; lỗi ghi thành `WP_Error` có mã ổn định chứ không nuốt thành `false`; trần phân trang đặt ở repository để lớp gọi nào cũng bị chặn như nhau.

## B6. Hiệu năng truy vấn

- MUST tránh N+1: lấy danh sách rồi vòng lặp gọi query cho từng phần tử là lỗi chặn review. Gom ID rồi query một lần, hoặc dùng cơ chế prime cache của core (`_prime_post_caches()`, `update_object_term_cache()` khi phù hợp).
- MUST tránh meta query lồng sâu và query trên `meta_value` không có index cho tính năng chạy thường xuyên. Nếu tính năng sống bằng việc lọc theo meta, đó là dấu hiệu phải chuyển trường đó thành cột của bảng riêng hoặc taxonomy.
- SHOULD dùng `EXPLAIN` cho truy vấn chính của bảng lớn trong quá trình phát triển và đính kèm nhận định vào pull request khi thêm index mới.
- MUST không chạy truy vấn nặng trong luồng render trang thông thường: thống kê, tổng hợp lớn phải được tính trước (lưu tổng chạy — running total — khi ghi), tính trong nền, hoặc cache có kỳ hạn.
- MUST xóa theo lô có giới hạn (batch, ví dụ 500 dòng/lượt kèm nghỉ giữa các lượt trong job nền) khi dọn dữ liệu lớn. NEVER chạy một câu `DELETE` không giới hạn trên bảng lớn trong request web.

## B7. Cache và dữ liệu tạm

Chọn tầng cache theo vòng đời dữ liệu, không chọn theo thói quen:

| Tầng | Dùng khi | Không dùng khi |
|---|---|---|
| Object cache (`wp_cache_get/set`, group có prefix) | Dữ liệu tính tốn kém, dùng lại trong cùng request hoặc qua persistent cache (Redis/Memcached) nếu host có | Dữ liệu bắt buộc đúng tuyệt đối từng mili-giây |
| Transient (`get/set_transient`) | Kết quả API ngoài, tổng hợp tốn kém, chấp nhận cũ vài phút | Dữ liệu nghiệp vụ không được mất, khóa chống trùng |
| Option không autoload | Cấu hình và mốc trạng thái ít đọc | Dữ liệu lớn, dữ liệu đọc mọi request |

- MUST đặt tên cache key/transient có prefix và có thành phần phiên bản khi cần vô hiệu hóa hàng loạt (ví dụ `acme_stats_v3_{$lesson_id}`). Đổi cấu trúc dữ liệu đã cache thì tăng thành phần phiên bản.
- MUST luôn có thời hạn (`expiration`) cho transient và cache tự tính, và có đường vô hiệu hóa rõ ràng khi dữ liệu nguồn thay đổi (xóa cache trong cùng hàm ghi dữ liệu, không trông chờ hết hạn).
- MUST cân nhắc điều kiện đua khi nhiều request cùng tính lại một cache đã hết hạn: với tính toán đắt, dùng khóa mềm hoặc chấp nhận tính trùng có giới hạn — quyết định phải có chủ đích.
- NEVER lưu object chứa dữ liệu nhạy cảm của người dùng vào transient dùng chung mà không gắn key theo người dùng và kiểm tra quyền ở điểm đọc.

## B8. Options: kỷ luật autoload

- MUST đặt `autoload` là `false` (tham số của `add_option` / `update_option` khi tạo mới, hoặc cơ chế tương đương) cho mọi option không cần ở mọi request: dữ liệu lớn, mốc migration, cache tự lưu, log. Tổng lượng dữ liệu autoload của toàn site là tài nguyên chung; plugin phình autoload làm chậm mọi trang của mọi người.
- SHOULD giữ mỗi option autoload nhỏ (mục tiêu dưới vài KB) và tổng đóng góp của plugin ở mức tối thiểu. Option chứa mảng cấu hình lớn phải tách: phần đọc mọi request để autoload, phần còn lại không.
- MUST lưu cấu hình của plugin trong một option mảng duy nhất có prefix (ví dụ `acme_settings`) thay vì rải hàng chục option rời, trừ các mốc kỹ thuật cần độc lập (phiên bản schema, khóa migration).
- MUST khai báo `sanitize_callback` khi đăng ký setting (xem C6) để mọi đường ghi option đều qua cùng một hàm làm sạch.

## B9. Gỡ cài đặt, riêng tư và multisite

- MUST có `uninstall.php` (hoặc hook uninstall) dọn sạch theo một công tắc rõ ràng: mặc định SHOULD giữ dữ liệu nội dung khi người dùng tắt/gỡ nhầm, và chỉ xóa hẳn khi có tùy chọn "xóa toàn bộ dữ liệu khi gỡ" được chủ site bật có ý thức — hoặc chính sách của plugin ghi rõ xóa toàn bộ. Dù chọn chính sách nào cũng phải ghi trong readme.
- MUST đăng ký exporter và eraser cho dữ liệu cá nhân lưu trong bảng riêng/meta riêng qua bộ lọc `wp_privacy_personal_data_exporters` / `erasers`, để công cụ Privacy của core xuất và xóa được dữ liệu của plugin theo email người dùng.
- MUST xử lý multisite có chủ đích: bảng theo từng site dùng `$wpdb->prefix` (đã gồm blog prefix), bảng toàn mạng dùng `$wpdb->base_prefix` và phải là quyết định có ghi lý do. Luồng kích hoạt trên network (`network_wide`) phải lặp qua các site bằng `switch_to_blog()` và khôi phục bằng `restore_current_blog()`, kèm hook tạo bảng khi có site mới (`wp_initialize_site`).
- NEVER lưu dữ liệu của site này trong bảng của site khác trên multisite, và cache key phải phân biệt theo blog khi dữ liệu khác nhau giữa các site.

---

## B10. CPT, taxonomy và meta: thiết kế chi tiết khi không tạo bảng riêng

Phần lớn plugin dừng ở đây là đúng. Mục này làm rõ các quyết định mà B1 mới trỏ tới.

### B10.1. Đăng ký CPT

- MUST đăng ký CPT trên `init` bằng `register_post_type()` với tên tối đa 20 ký tự gồm prefix, ví dụ `acme_lesson`. Tên dài hơn bị core cắt và gây lỗi khó thấy.
- MUST khai báo có chủ đích các tham số sau, không để mặc định trôi: `public` (hiển thị frontend hay không), `show_ui`, `show_in_rest` (bật khi block, Editor hoặc client cần — đa số trường hợp nên bật), `has_archive`, `rewrite` (slug công khai là hợp đồng URL, đổi slug là đổi URL đã công bố), `supports` (chỉ liệt kê thứ màn hình sửa thật dùng: `title`, `editor`, `thumbnail`, `excerpt`, `revisions`, `author`, `custom-fields` khi cần), `capability_type` và `map_meta_cap` khi cần phân quyền riêng, `menu_icon` và `menu_position` không giành vị trí của core.
- MUST đặt `show_in_rest` kèm `rest_base` và `rest_controller_class` chỉ khi thật cần tùy biến; mặc định của core đáp ứng phần lớn nhu cầu.
- CPT chỉ dùng nội bộ (không URL công khai, không archive) đặt `public: false`, `show_ui` theo nhu cầu quản trị, `exclude_from_search: true` và cân nhắc `show_in_rest` riêng theo nhu cầu của Editor. Đừng để một CPT nội bộ vô tình có archive công khai.
- Taxonomy đăng ký bằng `register_taxonomy()` gắn với đúng CPT, `hierarchical` chọn theo bản chất (có cây cha–con hay phẳng như thẻ), `show_in_rest` bật khi cần chọn trong Editor, và slug rewrite cũng là hợp đồng URL như CPT.

### B10.2. Meta: đăng ký, kiểu và kỷ luật ghi

- Mọi meta cần xuất hiện trong Editor, REST hoặc cần validate đều MUST đăng ký bằng `register_post_meta()` (hoặc `register_meta()` cho term và user) với `type` đúng (`string`, `integer`, `number`, `boolean`, `array`, `object`), `single` đúng bản chất, `default` khi giá trị rỗng có nghĩa, và `sanitize_callback` khi định dạng cần chuẩn hóa.
- Meta là mảng hoặc object phải khai báo `show_in_rest` kèm `schema` mô tả cấu trúc con, nếu không REST và Editor sẽ từ chối hoặc làm phẳng sai.
- Meta nhạy cảm — đáp án, khóa chấm, ghi chú nội bộ, dữ liệu chỉ server đọc — MUST đặt `show_in_rest: false`, hoặc `show_in_rest: true` kèm `auth_callback` kiểm tra capability hẹp, và tên meta bắt đầu bằng `_` theo B2. Kiểm tra quyết định này bằng một request REST thật của người dùng cấp thấp trong test, không bằng đọc code.
- Ghi meta qua `update_post_meta()` sau khi đã validate ở lớp gọi; đọc meta ở template và render vẫn phải escape như mọi dữ liệu khác (B5, C3.2), vì meta có thể được ghi bởi plugin khác hoặc nhập từ nguồn ngoài.
- Meta dùng làm khóa lọc chính cho danh sách lớn là tín hiệu sai chỗ lưu: xem lại B1 bước 5 và B6. Nếu vẫn giữ meta, phải ghi rõ trần quy mô chấp nhận được vào spec của tính năng.

### B10.3. Query trên CPT đúng cách

- Lọc danh sách bằng `WP_Query` với `post_type`, `post_status` có chủ đích (không mặc định kéo cả nháp vào frontend), `posts_per_page` có trần, và `fields => 'ids'` khi chỉ cần ID để xử lý tiếp.
- Thứ tự mặc định phải xác định: ngày, tiêu đề, hoặc `menu_order` khi biên tập viên sắp xếp tay. Không để thứ tự phụ thuộc vào mặc định của DB.
- Khi trang cần nhiều vòng query trên cùng một tập post, prime cache một lần thay vì để từng vòng tự nạp meta và term (B6).

## B11. Vòng đời dữ liệu: retention, lưu trữ và xóa có lịch

- Mọi bảng sự kiện và log MUST có chính sách retention ghi thành số ngày cụ thể trong spec, kèm job nền xóa theo lô (B6, C8) thực thi chính sách đó. "Giữ mãi mãi" là một quyết định phải được nói ra và duyệt, không phải mặc định im lặng.
- Dữ liệu tiến độ và nội dung của người dùng không có retention tự động: chỉ xóa khi người dùng, quản trị viên hoặc luồng eraser riêng tư (B9) yêu cầu, và việc xóa phải đi qua cùng một hàm service để audit và hook chạy đủ.
- Dữ liệu tạm và cache có vòng đời riêng ở B7, không trộn vào retention của dữ liệu nghiệp vụ.
- Trước mỗi bản phát hành có thay đổi DB, Agent phải trả lời được ba câu: bản này tạo thêm dữ liệu gì, dữ liệu nào từ nay không còn được ghi nữa, và dữ liệu cũ thuộc hai nhóm đó được migrate, giữ nguyên hay xóa theo lịch nào. Trả lời thiếu một câu thì changelog chưa xong (C11).

# Phần C — Tiêu chuẩn backend và API

## C1. Kiến trúc và tổ chức code

### C1.1. Cấu trúc thư mục chuẩn

```text
acme-plugin/
├── acme-plugin.php          # Header plugin + bootstrap mỏng, không chứa logic nghiệp vụ
├── uninstall.php
├── composer.json            # Autoload PSR-4, công cụ dev: phpcs, phpstan, phpunit
├── readme.txt
├── inc/
│   ├── class-plugin.php     # Điểm khởi động: đăng ký các service/hook
│   ├── admin/               # Màn hình wp-admin, Settings API
│   ├── blocks/              # Đăng ký block, render callback
│   ├── rest/                # Controller REST, mỗi resource một class
│   ├── data/                # Repository cho bảng riêng, lớp truy cập meta/option
│   ├── services/            # Logic nghiệp vụ thuần, không phụ thuộc $_GET/$_POST
│   └── integrations/        # Kết nối API bên ngoài, webhook
├── src/                     # Nguồn JS/CSS cho block và admin app (build bằng @wordpress/scripts)
├── build/                   # Sản phẩm build đã biên dịch, nạp qua asset file .asset.php
├── languages/               # File dịch, text domain = slug plugin
└── tests/                   # php/ và js/ tách riêng
```

- MUST giữ file chính của plugin mỏng: header, hằng đường dẫn/phiên bản, nạp autoloader, đăng ký hook kích hoạt/hủy kích hoạt, và gọi điểm khởi động. Logic nghiệp vụ nằm trong class ở `inc/`.
- MUST dùng Composer autoload PSR-4 với namespace duy nhất (ví dụ `Acme\Plugin\...`) cho plugin vừa và lớn. Plugin nhỏ dùng quy ước file `class-{slug}.php` và nạp có thứ tự rõ ràng cũng chấp nhận được, nhưng không trộn hai kiểu trong cùng plugin.
- MUST tiền tố mọi thứ ở không gian toàn cục mà PHP không namespace được: tên hàm thường, hằng, hook, option, meta key, handle script/style, tên bảng, shortcode. Tiền tố tối thiểu 4–5 ký tự và nhất quán tuyệt đối.
- MUST chặn truy cập trực tiếp vào mọi file PHP: kiểm tra `defined( 'ABSPATH' )` ở đầu file có khả năng bị gọi thẳng.
- MUST tách lớp nghiệp vụ (service) khỏi lớp gắn với WordPress (hook handler, REST controller, template): service nhận dữ liệu đã sạch qua tham số và trả kết quả hoặc `WP_Error`, không đọc superglobal, không `echo`, không `wp_die()`. Kỷ luật này là điều kiện để viết unit test được.
- NEVER nhúng thư viện ngoài bằng cách copy cả thư mục vào plugin khi nó có trên Composer/Packagist. Khai báo dependency trong `composer.json`, khóa phiên bản bằng `composer.lock` trong repo phát triển, và tiền tố hóa (scoped) thư viện khi có nguy cơ trùng phiên bản với plugin khác trên cùng site.

### C1.2. Khởi động và vòng đời

- MUST chỉ khởi động phần cần cho ngữ cảnh hiện tại: code frontend không nạp trên admin và ngược lại; code REST chỉ đăng ký trên `rest_api_init`; code block chỉ đăng ký trên `init`. Kiểm tra ngữ cảnh bằng `is_admin()`, hằng của request và hook tương ứng — không nạp tất cả rồi mới rẽ nhánh bên trong.
- MUST đăng ký hook ở một nơi truy vết được (class khởi động hoặc từng module tự đăng ký trong hàm `register()` riêng). NEVER rải `add_action` ở đầu file tùy tiện khắp nơi không theo module.
- `register_activation_hook` chỉ làm việc nhẹ và idempotent: tạo bảng qua luồng migration (Phần B4), đặt option mặc định không ghi đè giá trị đã có, đăng ký capability/role nếu cần, lên lịch cron, và `flush_rewrite_rules()` khi plugin có rewrite riêng.
- `register_deactivation_hook` gỡ lịch cron của plugin và flush rewrite, nhưng NEVER xóa dữ liệu ở đây. Xóa dữ liệu thuộc về `uninstall.php` (xem B9).
- MUST kiểm tra điều kiện môi trường khi khởi động (phiên bản PHP/WP tối thiểu, plugin phụ thuộc như WooCommerce) và hiển thị admin notice rõ ràng kèm tự vô hiệu hóa phần phụ thuộc khi không đạt, thay vì để site lỗi trắng.

## C2. Chuẩn code và công cụ bắt buộc

- MUST tuân thủ WordPress Coding Standards (WPCS) cho PHP, JS, CSS: kiểm tra tự động bằng PHPCS với bộ quy tắc `WordPress` (tối thiểu `WordPress-Core`, `WordPress-Extra`, `WordPress-Docs`; dự án enterprise thêm `WordPress-VIP-Go`). Code không qua PHPCS không được merge, và việc tắt sniff (`phpcs:ignore`) phải kèm lý do ngay trên dòng đó.
- Các quy tắc WPCS hay bị Agent vi phạm nhất, phải tự kiểm tra trước khi giao: thụt lề bằng tab trong PHP; Yoda condition (`if ( 'value' === $var )`); dấu ngoặc có khoảng trắng bên trong (`if ( $a )`); so sánh chặt `===`/`!==`; tên hàm và biến `snake_case`, tên class `Capitalized_Words` (hoặc PascalCase khi dùng namespace PSR-4 — chọn một chuẩn cho cả plugin và ghi vào `phpcs.xml`); mỗi file một class chính; DocBlock cho file, class, hàm và hook.
- MUST chạy phân tích tĩnh: PHPStan (kèm bản mở rộng cho WordPress khi có thể) ở mức đã thỏa thuận của dự án, tối thiểu không lỗi ở mức cơ bản cho code mới. ESLint với `@wordpress/eslint-plugin` và Prettier cấu hình của WordPress cho JS.
- MUST viết DocBlock có `@since` cho mọi hàm, class, hook và filter công khai. API công khai không có DocBlock coi như chưa xong.
- SHOULD dùng kiểu dữ liệu chặt chẽ trong PHP hiện đại khi phiên bản PHP tối thiểu cho phép (khai báo kiểu tham số và kiểu trả về ở code nội bộ), nhưng không đánh đổi khả năng tương thích với hook của core vốn không có kiểu chặt.
- MUST định dạng ngày giờ qua API của WordPress khi hiển thị (`wp_date()`, `date_i18n()`), lưu trữ theo UTC (xem B3.1), và không tự cộng trừ giờ theo múi giờ bằng số giây cứng.

## C3. Bảo mật: ma trận bắt buộc

Bảo mật không phải một mục kiểm tra cuối quy trình; nó là điều kiện ở từng điểm vào dữ liệu. Mọi điểm vào (form, AJAX, REST, webhook, import, WP-CLI nhận tham số ngoài) đều phải qua đủ bốn lớp: **đúng người — đúng quyền — dữ liệu hợp lệ — xuất an toàn**.

### C3.1. Quyền và ý định

- MUST kiểm tra capability trước khi làm bất cứ việc gì có tác dụng phụ: `current_user_can( '...' )` với capability hẹp nhất đúng việc (dùng capability của CPT như `edit_post` kèm ID khi tác vụ gắn với một post cụ thể, thay vì `manage_options` cho mọi thứ).
- MUST kiểm tra nonce cho mọi form và hành động thay đổi trạng thái qua giao diện cổ điển/AJAX: tạo bằng `wp_nonce_field()` / `wp_create_nonce()`, kiểm tra bằng `check_admin_referer()` / `check_ajax_referer()` / `wp_verify_nonce()`. Nonce chứng minh ý định, capability chứng minh quyền — phải có cả hai, không cái nào thay cái nào.
- Trong REST, xác thực đi qua cơ chế của core (cookie + `X-WP-Nonce` cho request cùng site, Application Passwords hoặc OAuth cho client ngoài) và phân quyền nằm trong `permission_callback` (xem C7). NEVER tự phát minh cơ chế token riêng thay cho cơ chế của core khi chưa có lý do bảo mật được ghi thành văn bản.
- NEVER tin vai trò (role) thay cho capability: kiểm tra capability, vì role có thể bị plugin khác thay đổi.
- MUST áp dụng nguyên tắc ít đặc quyền nhất cho tài khoản và khóa API mà plugin dùng khi gọi ra ngoài, và không bao giờ ghi khóa bí mật vào option không bảo vệ rồi lộ xuống JS hay log.

### C3.2. Validate, sanitize, escape — ba việc khác nhau

| Việc | Khi nào | Công cụ chuẩn |
|---|---|---|
| Validate (kiểm tra hợp lệ, từ chối nếu sai) | Ngay tại biên nhận dữ liệu | Kiểm tra kiểu, khoảng, danh sách cho phép (allowlist), `rest_validate_request_arg()`, hàm `is_*`/`wp_validate_*` |
| Sanitize (làm sạch về dạng an toàn) | Trước khi lưu hoặc dùng dữ liệu đã hợp lệ | `sanitize_text_field( wp_unslash() )`, `sanitize_email()`, `sanitize_key()`, `absint()`, `wp_kses()` với danh sách thẻ cho phép, `sanitize_file_name()` |
| Escape (mã hóa theo ngữ cảnh xuất) | Tại điểm xuất ra HTML/JS/URL | `esc_html()`, `esc_attr()`, `esc_url()`, `esc_js()`, `wp_json_encode()` khi nhúng dữ liệu vào script |

- MUST luôn `wp_unslash()` trước khi sanitize dữ liệu từ `$_GET`/`$_POST`/`$_REQUEST`, và NEVER đọc superglobal trực tiếp ngoài lớp xử lý request — controller/handler là nơi duy nhất chạm vào chúng.
- MUST ưu tiên validate theo allowlist: giá trị phải thuộc danh sách đã biết thì mới qua; giá trị lạ thì từ chối bằng lỗi rõ ràng, không cố "làm sạch" thành giá trị khác một cách âm thầm.
- MUST escape muộn (late escaping) tại điểm xuất, kể cả dữ liệu lấy từ DB của chính plugin — dữ liệu đã lưu không mặc định là sạch.
- NEVER dùng `$_REQUEST` (không rõ nguồn GET hay POST), không tắt kiểm tra nonce vì "đây là trang nội bộ", và không dựa vào việc ẩn nút/ẩn trường để bảo vệ hành động.
- MUST dùng `$wpdb->prepare()` cho SQL tự viết (xem B5) và coi mọi chuỗi từ bên ngoài là không đáng tin, kể cả phản hồi từ API của bên thứ ba và nội dung file được tải lên.
- File tải lên: MUST kiểm tra loại file bằng `wp_check_filetype_and_ext()` / cơ chế media của core, giới hạn theo danh sách loại cho phép hẹp nhất, và để core xử lý lưu trữ qua `media_handle_upload()` khi có thể. NEVER tự ghi file từ dữ liệu request vào thư mục uploads theo tên người dùng đặt.

## C4. Hooks và khả năng mở rộng

Plugin tốt phải mở được mà không cần sửa code gốc của nó — đây là cách các plugin lớn (WooCommerce, Sensei, Yoast) giữ hệ sinh thái.

- MUST cung cấp filter cho mọi giá trị mà site khác có lý do chính đáng để thay: ngưỡng, kích thước lô, danh sách cho phép, thời hạn cache, template arguments. MUST cung cấp action ở các mốc vòng đời quan trọng: trước/sau khi tạo, cập nhật, xóa thực thể chính và sau khi hoàn tất một quy trình nền.
- MUST đặt tên hook theo mẫu `{prefix}_{đối_tượng}_{sự_kiện}` dạng snake_case, ví dụ `acme_attempt_saved`, `acme_min_pass_score`. Tên hook đã phát hành là hợp đồng công khai: NEVER đổi tên hoặc đổi tham số của hook đã phát hành mà không giữ tương thích và ghi deprecation.
- MUST viết DocBlock ngay trên mỗi `do_action()` / `apply_filters()` với đủ `@param` và `@since`, để công cụ tra cứu hook hoạt động.
- MUST kiểm tra kiểu của giá trị mà filter trả về trước khi dùng (filter của bên thứ ba có thể trả bất cứ thứ gì), và có giá trị mặc định an toàn khi filter trả dữ liệu không hợp lệ.
- NEVER dùng hook của core sai mục đích để lách kiểm tra quyền hoặc vòng đời (ví dụ ghi dữ liệu trong `shutdown` để tránh validate). Mọi ghi dữ liệu đi qua cùng một đường service đã validate.
- SHOULD tránh thực thi nặng trên các hook chạy rất thường xuyên (`init`, `wp_loaded`, `plugins_loaded` trên mọi request): trên các hook này chỉ đăng ký và kiểm tra rẻ; việc nặng hoãn tới đúng ngữ cảnh hoặc job nền.

## C5. Settings API và cấu hình

- MUST dùng Settings API (`register_setting()`, `add_settings_section()`, `add_settings_field()`, `settings_fields()`, `do_settings_sections()`) cho trang cài đặt cổ điển, với `sanitize_callback` bắt buộc cho từng setting. Trang React trong admin thì ghi qua REST route riêng nhưng vẫn phải qua cùng hàm sanitize/validate ở server — một nguồn chân lý cho việc làm sạch.
- MUST gom cài đặt vào option mảng duy nhất (xem B8), validate từng khóa con trong `sanitize_callback`, giữ lại giá trị cũ cho khóa không được gửi lên, và trả lỗi bằng `add_settings_error()` gắn với đúng trường khi giá trị sai.
- MUST đặt capability cho nhóm setting (`option_page_capability` hoặc kiểm tra trong callback) và không dựa vào capability mặc định nếu trang không dành cho quản trị viên toàn site.
- NEVER lưu bí mật (API key, mật khẩu dịch vụ) ở dạng mà trang cài đặt in lại nguyên văn cho mọi người có quyền xem trang thấp hơn quyền cần thiết; hiển thị dạng che và chỉ ghi khi có giá trị mới được gửi.

### C5.1. Bảng loại trường setting — validate và sanitize theo từng loại

Trang cài đặt sai nhiều nhất ở khâu làm sạch: một hàm sanitize dùng cho mọi loại trường là không đủ. Mỗi loại có cặp validate và sanitize riêng, khai báo trong cùng `sanitize_callback` của setting (C5) và dùng lại cho đường ghi qua REST.

| Loại trường | Validate | Sanitize / lưu | Lỗi hay gặp |
|---|---|---|---|
| Đúng/sai | Có mặt hay không, không tin giá trị gửi lên | Lưu `0` hoặc `1` dạng số nguyên | Lưu chuỗi `"false"` rồi so sánh lỏng |
| Số nguyên trong khoảng | Là số, nằm trong khoảng đóng đã khai báo | `absint()` hoặc `intval()`, kẹp về khoảng | Chỉ kẹp mà không báo lỗi khi vượt xa |
| Số thực, tỉ lệ, ngưỡng | Là số, đúng số chữ số thập phân cho phép | `floatval()`, làm tròn theo quy tắc đã ghi | Lưu qua `sanitize_text_field()` làm mất dạng số |
| Chuỗi ngắn một dòng | Độ dài tối đa, ký tự cấm nếu có | `sanitize_text_field( wp_unslash() )` | Quên `wp_unslash()` làm hỏng dấu thoát |
| Chuỗi nhiều dòng không HTML | Độ dài tối đa | `sanitize_textarea_field()` | Dùng hàm một dòng làm mất xuống dòng |
| HTML giàu được phép | Danh sách thẻ cho phép đã khai báo | `wp_kses()` với danh sách đó | Dùng `wp_kses_post()` cho trường đáng lẽ hẹp hơn |
| Email | `is_email()` | `sanitize_email()` | Chỉ sanitize mà không từ chối email sai |
| URL | Giao thức thuộc danh sách cho phép | `esc_url_raw()` | Cho `javascript:` và giao thức lạ đi qua |
| Slug, khóa, mã | Khớp mẫu ký tự cho phép | `sanitize_key()` hoặc `sanitize_title()` theo nghĩa | Nhầm hai hàm này: key cho định danh nội bộ, title cho slug hiển thị |
| Lựa chọn trong danh sách đóng | Thuộc `enum` đã khai báo | Lưu nguyên giá trị đã khớp danh sách | Không khớp thì vẫn lưu thay vì giữ giá trị cũ và báo lỗi |
| Danh sách ID | Mọi phần tử là số nguyên dương, không trùng | `array_map( 'absint' )`, loại trùng, giữ thứ tự | Lưu chuỗi phẩy thay vì mảng đã ép kiểu |
| Màu | Là màu hợp lệ hoặc rỗng | `sanitize_hex_color()` | Nhận chuỗi CSS tự do vào trường màu |
| Ngày, giờ | Parse được và nằm trong khoảng cho phép | Lưu ISO 8601 hoặc `datetime` UTC theo B3.1 | Lưu chuỗi ngày theo định dạng hiển thị của địa phương |
| Bí mật, khóa API | Độ dài và tiền tố theo nhà cung cấp nếu có | Lưu nguyên, không in lại, chỉ ghi khi có giá trị mới (C5) | Ghi bí mật vào log khi validate thất bại |

Quy tắc chung cho bảng này: validate thất bại thì giữ giá trị cũ và trả lỗi gắn với đúng trường bằng `add_settings_error()`. Sanitize không bao giờ là nơi âm thầm biến một giá trị sai thành một giá trị khác có nghĩa khác.

## C6. REST API

REST là API chính của plugin: Editor, admin app, frontend tương tác và client bên ngoài đều dùng chung một bề mặt này, để phân quyền và validate chỉ phải đúng ở một nơi.

### C6.1. Đặt tên và đăng ký route

- MUST đăng ký route trong callback của `rest_api_init` bằng `register_rest_route()`, namespace dạng `{prefix}/v1`. NEVER dùng namespace của core (`wp/v2`) cho route riêng và không đăng ký route ngoài hook này.
- MUST tăng số phiên bản namespace (`v2`) khi có thay đổi phá vỡ hợp đồng (đổi kiểu field, bỏ field, đổi ý nghĩa), và giữ `v1` hoạt động trong thời gian chuyển đổi đã công bố. Thay đổi cộng thêm (thêm field mới, thêm route mới) không cần tăng phiên bản.
- MUST dùng danh từ số nhiều cho resource (`/attempts`, `/attempts/(?P<id>[\d]+)`), tham số đường dẫn có regex chặt (ID số chỉ nhận `\d+`), và phương thức HTTP đúng nghĩa: `GET` chỉ đọc và không tác dụng phụ, `POST` tạo/xử lý, `PUT`/`PATCH` cập nhật, `DELETE` xóa.
- SHOULD mở rộng controller từ `WP_REST_Controller` khi resource có đủ bộ CRUD và cần schema chuẩn; dùng `register_rest_route()` trực tiếp cho endpoint hành động đơn lẻ (ví dụ `/attempts/{id}/submit`).
- SHOULD cân nhắc `show_in_rest` trên CPT/taxonomy/meta trước khi viết route riêng cho dữ liệu nội dung chuẩn — rất nhiều nhu cầu "API cho block" đã được core đáp ứng sẵn.

### C6.2. `permission_callback`: không có ngoại lệ

- MUST khai báo `permission_callback` cho mọi endpoint, không trừ một route nào. Route công khai thật sự dùng `'__return_true'` một cách có ý thức, kèm comment vì sao dữ liệu này công khai được.
- `permission_callback` trả `true` khi được phép, `false` hoặc `WP_Error` kèm mã lỗi và `status` (401 khi chưa xác thực, 403 khi đã xác thực nhưng không đủ quyền) khi bị từ chối. Kiểm tra phải gắn với đối tượng cụ thể khi route có ID: `current_user_can( 'edit_post', $id )` chứ không chỉ kiểm tra capability chung chung.
- NEVER coi "đã đăng nhập" là đủ quyền cho thao tác ghi hoặc đọc dữ liệu riêng tư. Đăng nhập chỉ là điều kiện cần, capability mới là điều kiện đủ.
- MUST nhớ `permission_callback` cũng quyết định những gì API index tiết lộ cho client để hiển thị/khóa UI — viết nó đúng giúp Editor tự khóa control mà người dùng không có quyền dùng.

### C6.3. Tham số: khai báo, validate, sanitize

- MUST khai báo mọi tham số trong `args` của endpoint với đủ `type`, `required` (khi bắt buộc), `default` (khi có mặc định), `enum` (khi là danh sách đóng), `validate_callback` và `sanitize_callback`. Tham số không khai báo là tham số không được tin.
- MUST dựa vào cơ chế của core: `validate_callback` trả `true` hoặc `WP_Error`; `sanitize_callback` đưa giá trị về dạng chuẩn trước khi vào callback chính. Callback chính nhận dữ liệu đã sạch qua `$request->get_param()` / `$request['name']` và không sanitize lại tùy tiện ở nhiều nơi khác nhau.
- MUST khai báo `schema` cho resource (qua `get_item_schema()` khi dùng controller) mô tả đúng field sẽ trả về, gồm `type`, `context` (`view`, `edit`, `embed`) và `readonly` cho field chỉ đọc. Field nhạy cảm (đáp án đúng, dữ liệu nội bộ) MUST chỉ xuất hiện ở context `edit` với capability phù hợp, hoặc không xuất hiện trong REST chút nào nếu frontend không cần.
- MUST tôn trọng tham số `_fields` và `context` mà core cung cấp thay vì tự cắt response theo tham số riêng.

### C6.4. Response và lỗi

- MUST trả dữ liệu qua `WP_REST_Response` hoặc `rest_ensure_response()`, và trả lỗi qua `WP_Error` có `code` dạng `{prefix}_{lỗi}` dạng snake_case ổn định, `message` đọc hiểu được và dịch được, `data.status` là mã HTTP đúng. Client (kể cả UI của chính plugin) được phép dựa vào `code` và `status`, không dựa vào nội dung `message` để rẽ nhánh logic.
- NEVER trả HTTP 200 kèm cờ lỗi trong body, không `echo` rồi `die` trong REST callback, và không dùng họ hàm `wp_send_json_*()` trong luồng REST (core phát cảnh báo `_doing_it_wrong` cho việc này từ WordPress 5.5).
- MUST đặt mã trạng thái đúng nghĩa: 200 thành công, 201 khi tạo mới thành công (kèm header `Location` khi có), 400 dữ liệu sai định dạng, 401 chưa xác thực, 403 không đủ quyền, 404 không tồn tại (hoặc không được phép biết là tồn tại — chọn nhất quán cho dữ liệu riêng tư), 409 xung đột trạng thái, 429 quá tần suất.
- MUST phân trang cho mọi endpoint danh sách theo quy ước của core: tham số `per_page` (mặc định hợp lý, trần 100) và `page`, trả header `X-WP-Total` và `X-WP-TotalPages` qua `WP_REST_Response`. NEVER trả toàn bộ bảng trong một response.
- SHOULD hỗ trợ sắp xếp có kiểm soát: `orderby` chỉ nhận giá trị trong allowlist ánh xạ sang cột thật, `order` chỉ `asc`/`desc`. NEVER truyền thẳng tên cột từ request vào câu SQL kể cả khi đã qua `prepare`, vì placeholder không bảo vệ được định danh cột.
- SHOULD đặt header cache đúng cho GET công khai (`Cache-Control` qua `WP_REST_Response` và cân nhắc ETag khi dữ liệu lớn, ít đổi) và cấm cache đối với response chứa dữ liệu theo người dùng.

Ví dụ route tối thiểu đạt chuẩn:

```php
register_rest_route( 'acme/v1', '/attempts/(?P<id>[\d]+)/submit', array(
    'methods'             => WP_REST_Server::CREATABLE,
    'callback'            => array( $controller, 'submit_attempt' ),
    'permission_callback' => array( $controller, 'submit_permissions_check' ),
    'args'                => array(
        'id'      => array(
            'type'              => 'integer',
            'required'          => true,
            'sanitize_callback' => 'absint',
        ),
        'answers' => array(
            'type'              => 'array',
            'required'          => true,
            'validate_callback' => array( $controller, 'validate_answers' ),
            'sanitize_callback' => array( $controller, 'sanitize_answers' ),
        ),
    ),
) );
```

### C6.5. Bảo vệ API ở mức vận hành

- MUST cân nhắc giới hạn tần suất cho endpoint đắt hoặc nhạy cảm (đăng nhập phụ trợ, gửi mã, tính toán nặng, gọi API ngoài có tính phí): đếm theo người dùng/IP bằng transient/object cache và trả 429 kèm `Retry-After` khi vượt. WordPress không có rate limit sẵn — không làm thì phải ghi rõ là chấp nhận rủi ro.
- MUST không để endpoint ghi dữ liệu thiếu chống trùng khi việc trùng gây hậu quả: dùng khóa idempotency do client gửi hoặc bất biến `UNIQUE` ở DB (xem B3.2) làm chốt cuối.
- SHOULD ghi log có cấu trúc cho lỗi 5xx và cho hành động nhạy cảm (ai, làm gì, lên đối tượng nào, kết quả), không ghi dữ liệu nhạy cảm vào log (xem C10).

### C6.6. Controller REST trọn gói — hình dạng chuẩn

Mẫu dưới đây là khung tối thiểu cho một resource có đọc một mục và ghi một hành động. Nó gom các luật C6.1–C6.5 vào một chỗ để đối chiếu khi viết controller thật.

```php
<?php
namespace Acme\Plugin\Rest;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class Attempts_Controller {

    public function register_routes(): void {
        register_rest_route( 'acme/v1', '/attempts/(?P<id>[\d]+)', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_item' ),
            'permission_callback' => array( $this, 'get_item_permissions_check' ),
            'args'                => array(
                'id' => array(
                    'type'              => 'integer',
                    'required'          => true,
                    'sanitize_callback' => 'absint',
                ),
            ),
        ) );
    }

    /**
     * Quyền gắn với đối tượng cụ thể, không chỉ capability chung.
     *
     * @return bool|WP_Error
     */
    public function get_item_permissions_check( WP_REST_Request $request ) {
        $id = (int) $request['id'];
        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error(
                'acme_rest_not_logged_in',
                'You must be logged in.',
                array( 'status' => 401 )
            );
        }
        if ( ! $this->user_may_view_attempt( get_current_user_id(), $id ) ) {
            return new WP_Error(
                'acme_rest_forbidden',
                'You cannot view this attempt.',
                array( 'status' => 403 )
            );
        }
        return true;
    }

    /**
     * @return WP_REST_Response|WP_Error
     */
    public function get_item( WP_REST_Request $request ) {
        $attempt = $this->service->get_attempt( (int) $request['id'] );
        if ( ! $attempt ) {
            return new WP_Error(
                'acme_attempt_not_found',
                'Attempt not found.',
                array( 'status' => 404 )
            );
        }
        // Chỉ field trong schema và đúng context mới ra khỏi server (C6.3).
        return rest_ensure_response( $this->prepare_item( $attempt, $request ) );
    }
}
```

Điểm kiểm tra của mẫu trên: callback chính không sanitize lại, không kiểm tra quyền lại — hai việc đó đã xong ở `args` và `permission_callback`; service được gọi bằng ID đã ép kiểu; mọi đường lỗi đều là `WP_Error` có mã của plugin và `status` đúng; `prepare_item()` là nơi duy nhất quyết định field nào ra khỏi server, và field nhạy cảm không có mặt trong nó ở context công khai.

### C6.7. Schema, context và field nhạy cảm — làm rõ thêm

- Ba context chuẩn có nghĩa cố định: `view` cho hiển thị công khai trong quyền của người đọc, `embed` cho bản rút gọn nhúng vào nội dung khác, `edit` cho người có quyền sửa đối tượng. Một field xuất hiện ở context nào là quyết định phân quyền, phải liệt kê trong test.
- Field chỉ đọc (`readonly: true` trong schema) là field server tính ra: điểm tổng, trạng thái suy ra, thời gian tạo. Client gửi field này lên khi ghi thì server bỏ qua một cách có chủ đích, không lấy nó làm dữ liệu thật.
- Đáp án đúng, khóa chấm và mọi field mà việc lộ ra làm mất ý nghĩa của tính năng: không khai báo trong schema công khai chút nào. Nếu Editor cần hiển thị trạng thái "đã có đáp án" thì trả một field boolean suy ra, không trả đáp án.
- Khi thêm field mới vào response: đó là thay đổi cộng thêm, không phá vỡ tương thích, nhưng vẫn phải khai báo trong schema, đặt đúng context, và ghi vào changelog. Khi đổi kiểu hoặc bỏ field: đó là thay đổi phá vỡ, đi qua C12.

## C7. AJAX: ngoại lệ có kỷ luật

- Tính năng mới MUST cân nhắc REST trước. `admin-ajax.php` chỉ dùng khi tính năng nằm trong màn hình admin cổ điển không có React và việc dựng REST tốn kém không tương xứng — lý do phải được ghi lại.
- Khi dùng AJAX: đăng ký action có prefix (`wp_ajax_{prefix}_...`), cân nhắc riêng `wp_ajax_nopriv_` và mặc định **không** đăng ký `nopriv` — mọi action cho khách chưa đăng nhập là một quyết định bảo mật riêng phải được duyệt.
- Handler MUST mở đầu bằng `check_ajax_referer()` và kiểm tra capability, xử lý xong trả kết quả bằng `wp_send_json_success()` / `wp_send_json_error()` kèm mã trạng thái đúng. NEVER `echo` tay JSON rồi quên `wp_die()`.
- Mỗi action AJAX là một bề mặt tấn công riêng: validate và sanitize đầu vào đúng như REST, không nới lỏng vì "chỉ admin mới thấy nút bấm".

## C8. Cron và xử lý nền

- Việc chạy lâu, chạy lặp hoặc không cần kết quả ngay MUST đi ra nền: email hàng loạt, gọi API ngoài chậm, tổng hợp thống kê, dọn dẹp, đồng bộ. Request của người dùng chỉ ghi nhận việc và trả về.
- SHOULD dùng Action Scheduler (thư viện của Automattic/WooCommerce, thiết kế để nhúng vào plugin) cho hàng đợi cần độ tin cậy: có lưu trữ, theo dõi, thử lại và xử lý theo lô ở quy mô lớn. WP-Cron thuần chỉ đủ cho việc nhẹ, ít, trễ một chút cũng không sao.
- Khi dùng WP-Cron: đăng ký sự kiện bằng `wp_schedule_event()` / `wp_schedule_single_event()` trên hook kích hoạt hoặc `init` có kiểm tra `wp_next_scheduled()`, định nghĩa khoảng lặp tùy chỉnh qua filter `cron_schedules` khi cần, và gỡ lịch ở deactivation. NEVER chạy việc nặng trực tiếp trong callback cron của request người dùng mà không giới hạn lô và thời gian.
- Mọi job nền MUST idempotent và chịu được việc chạy lại sau lỗi giữa chừng: xử lý theo lô có con trỏ tiến độ, đánh dấu trạng thái ở từng bản ghi, và thử lại có giới hạn kèm backoff thay vì lặp vô hạn.
- MUST ghi trạng thái job để quản trị viên nhìn thấy được (màn hình trạng thái, WP-CLI hoặc log), vì job nền chết âm thầm là dạng lỗi khó phát hiện nhất trên site thật, nhất là khi WP-Cron của host không chạy đều.
- WP-CLI: SHOULD cung cấp lệnh `{prefix} ...` cho các việc vận hành lặp lại (migrate, dọn dẹp, tính lại thống kê, kiểm tra sức khỏe dữ liệu), có `--dry-run` cho lệnh phá hủy và xác nhận tương tác trước khi xóa hàng loạt.

## C9. Gọi API bên ngoài và webhook

### C9.1. Gọi ra ngoài

- MUST dùng WordPress HTTP API (`wp_remote_get()`, `wp_remote_post()`, `wp_remote_request()`) thay cho cURL trực tiếp, để tôn trọng cấu hình proxy, chứng chỉ và filter của site.
- MUST đặt `timeout` rõ ràng (không để mặc định mơ hồ cho tác vụ quan trọng), kiểm tra `is_wp_error()` trước khi đọc body, kiểm tra mã HTTP, và `json_decode` có kiểm tra lỗi trước khi dùng dữ liệu.
- MUST có chính sách thử lại có giới hạn cho lỗi tạm thời (mạng, 5xx) với backoff, và không thử lại lỗi 4xx do dữ liệu sai. Việc thử lại tốn thời gian chạy trong nền (xem C8), không trong request của người dùng, trừ lời gọi thật ngắn và thật cần cho nội dung trang.
- MUST cache kết quả gọi ngoài tốn kém hoặc bị giới hạn tần suất bằng transient (xem B7) và tôn trọng giới hạn của nhà cung cấp.
- NEVER ghi API key vào code, vào repo hoặc vào log. Khóa lấy từ hằng cấu hình hoặc option được bảo vệ, và được che khi hiển thị trong admin.

### C9.2. Nhận webhook

- Webhook là điểm vào không qua đăng nhập WordPress, nên MUST xác thực bằng chữ ký HMAC hoặc bí mật dùng chung do nhà cung cấp định nghĩa, so sánh bằng `hash_equals()` (so sánh chống dò thời gian), trước khi chạm vào bất kỳ dữ liệu nào trong payload.
- MUST trả 200 nhanh sau khi đã ghi nhận payload tối thiểu, rồi xử lý thật trong nền. Xử lý lâu trong request webhook làm nhà cung cấp gửi lại và tạo trùng.
- MUST chống xử lý trùng bằng khóa sự kiện (ID sự kiện của nhà cung cấp) lưu kèm ràng buộc `UNIQUE`, vì webhook chuẩn mực là "gửi ít nhất một lần", không phải "đúng một lần".
- MUST ghi log lần nhận webhook (thời gian, loại sự kiện, ID sự kiện, kết quả) nhưng che hoặc bỏ trường nhạy cảm trong payload.

## C10. Ghi log và quan sát

- MUST dùng `error_log()` có kỷ luật hoặc một logger của dự án, gắn prefix và ngữ cảnh tối thiểu (ID đối tượng, hành động). Khi `WP_DEBUG` tắt, plugin không được ồn ào trong log vì các sự kiện bình thường.
- NEVER ghi vào log: mật khẩu, token, khóa API, dữ liệu cá nhân đầy đủ, toàn bộ payload chứa đáp án hoặc thông tin thanh toán. Cần truy vết thì ghi ID và mã lỗi.
- SHOULD bọc các thao tác có thể ném lỗi của thư viện ngoài trong `try/catch` và biến ngoại lệ thành `WP_Error` ở biên của plugin, để lỗi của plugin không làm sập trang của người dùng. Không bắt ngoại lệ rỗng rồi nuốt mất dấu vết — bắt thì phải log hoặc trả lỗi lên trên.
- MUST trả `WP_Error` thay vì `false`/mảng rỗng mơ hồ ở API nội bộ khi có nhiều hơn một nguyên nhân thất bại mà lớp gọi cần phân biệt.

## C11. Kiểm thử, CI và phát hành

- MUST có kiểm thử tự động tương xứng rủi ro: unit test cho service thuần (PHPUnit), integration test trên môi trường WordPress thật (bộ test của core hoặc `wp-env`) cho hook, REST và DB, và kiểm thử trình duyệt (Playwright) cho luồng Editor/admin quan trọng. Tính năng chạm tới tiền, điểm hoặc quyền mà không có test là chưa xong.
- MUST kiểm thử riêng các trường hợp biên đã nêu trong tài liệu này: block đã lưu ở phiên bản cũ vẫn mở được sau khi sửa `save` (có deprecated đúng), migration chạy hai lần liên tiếp không đổi kết quả, REST từ chối đúng 401/403 cho người không có quyền, và gỡ plugin không để lại lỗi ở site.
- CI MUST chạy tối thiểu: PHPCS, PHPStan, unit test PHP, lint/build JS. Merge khi CI đỏ phải là quyết định có người chịu trách nhiệm ghi lại, không phải thói quen.
- MUST dùng đánh số phiên bản ngữ nghĩa (SemVer) cho plugin và ghi changelog ở cả `CHANGELOG.md` (cho lập trình viên) lẫn `readme.txt` (cho người dùng) với mục riêng cho thay đổi DB, thay đổi hook/REST phá vỡ tương thích, và yêu cầu nâng cấp thủ công nếu có.
- MUST build bản phát hành từ pipeline: biên dịch asset bằng `@wordpress/scripts`, cài Composer ở chế độ không dev, loại file phát triển khỏi gói phân phối bằng `.distignore` hoặc tương đương. NEVER đóng gói thư mục chứa `node_modules`, test, hoặc file cấu hình môi trường thật.
- MUST kiểm tra gói phát hành trên một site WordPress sạch trước khi công bố: cài mới, nâng cấp từ bản trước, tắt rồi bật lại, và gỡ — bốn luồng này đều phải sạch lỗi PHP và không mất dữ liệu ngoài ý muốn.

---

## C12. Tương thích ngược và chính sách ngừng hỗ trợ

Mọi thứ plugin đã công bố đều là hợp đồng: tên block, attribute, hook, filter, REST route và field, meta key công khai, shortcode, slug URL của CPT và taxonomy, và cấu trúc option. Mục này là luật chung cho mọi hợp đồng đó; A5.10 là áp dụng riêng của nó cho block.

- MUST phân loại mọi thay đổi trước khi viết code: cộng thêm (an toàn), đổi hành vi mặc định (có rủi ro, phải ghi changelog và cân nhắc filter để giữ hành vi cũ), hay phá vỡ (chỉ được làm kèm đường chuyển đổi).
- Thay đổi phá vỡ MUST đi đủ ba bước: công bố trước trong changelog của bản liền trước, giữ đường cũ hoạt động song song ít nhất một bản phát hành lớn kèm cảnh báo ngừng hỗ trợ (`_deprecated_hook()`, `_doing_it_wrong()` hoặc log có kiểm soát cho REST), và cung cấp đường migrate tự động hoặc lệnh WP-CLI chuyển đổi cho dữ liệu đã lưu.
- Hook và filter ngừng hỗ trợ dùng `apply_filters_deprecated()` / `do_action_deprecated()` khi core hỗ trợ, để site đang dùng hook cũ nhận cảnh báo rõ thay vì im lặng mất tác dụng.
- REST phá vỡ đi theo tăng phiên bản namespace ở C6.1, không theo việc đổi lén response của phiên bản đang chạy.
- Option và meta đổi cấu trúc đi theo cùng kỷ luật phiên bản và migration như DB ở B4, kể cả khi không có bảng riêng nào thay đổi.
- NEVER gỡ một hợp đồng trong cùng bản phát hành mà nó được công bố ngừng hỗ trợ. Công bố và gỡ là hai bản khác nhau.

## C13. Hiệu năng phía backend — các điểm kiểm tra có số đo

- Mỗi request thông thường của site không được chậm đi vì plugin: kiểm tra bằng công cụ profiling hoặc query monitor trong lúc phát triển, và ghi lại số truy vấn cộng thêm mà plugin gây ra trên trang chủ, trang nội dung và một màn hình admin điển hình. Không có số đo thì không khẳng định "nhanh".
- Trên các hook chạy mọi request, plugin chỉ được làm việc rẻ: so sánh phiên bản, đăng ký, rẽ nhánh theo ngữ cảnh (C1.2, C4). Một truy vấn DB, một lời gọi HTTP hoặc một vòng lặp trên tập dữ liệu ở các hook này là lỗi.
- Autoload là ngân sách chung của site: đo tổng kích thước option autoload mà plugin đóng góp sau khi cài và sau một tháng dữ liệu mẫu, theo kỷ luật B8.
- Lời gọi HTTP ra ngoài trong luồng render trang là ngoại lệ phải biện minh từng trường hợp (C9.1); mặc định của nó là cache hoặc nền.
- Việc tối ưu phải nhắm vào số đo lớn nhất trước. Tối ưu một truy vấn chạy một lần khi cài đặt trong khi truy vấn ở trang chủ chưa được xem xét là thứ tự sai, và phải nói rõ khi review.

# Phần D — Design Pattern và Trigger tái cấu trúc

Phần A, B, C trả lời câu hỏi "làm đúng chuẩn là làm thế nào". Phần D trả lời câu hỏi khác, và là câu hỏi Agent hay trả lời sai nhất: **khi nào thì được — và khi nào thì bắt buộc phải — tách code ra thành một pattern dùng chung, và khi nào tách là sai.**

Nguyên tắc bao trùm của phần này: **pattern là phản ứng với một trigger đo được, không phải trang trí kiến trúc.** Không trigger, không pattern. Agent không áp dụng Repository, Strategy, Factory hay một component dùng chung nào chỉ vì "thấy hay", "thấy chuyên nghiệp" hay "đề phòng sau này cần". Ngược lại, khi trigger đã đủ ngưỡng, Agent cũng không được lảng tránh bằng cách copy thêm một lần nữa cho nhanh.

Mọi trigger trong phần này đều có bốn thành phần, thiếu một thành phần thì trigger chưa hoàn chỉnh: **dấu hiệu đếm được** (lặp mấy lần, ở mấy nơi, file dài bao nhiêu), **ngưỡng** (con số tại đó quyết định đổi), **hành động bắt buộc** (tách theo pattern nào, tách tới đâu), và **điều kiện hủy** (trường hợp nhìn giống trigger nhưng không được tách, xem D9).

## D1. Nguyên tắc chung: Rule of Three, WET trước DRY, và giá của trừu tượng

### D1.1. Rule of Three — luật gốc cho mọi quyết định DRY

- **Lần 1 — viết thẳng.** Một setting, một đoạn validate, một câu query, một đoạn render chỉ xuất hiện ở một nơi: MUST viết thẳng tại nơi đó, rõ ràng và đầy đủ. NEVER tạo abstraction, helper dùng chung, trait, base class hay component "để sau này dùng lại" cho một lần xuất hiện duy nhất. Đây là vi phạm YAGNI (You Aren't Gonna Need It) và bị chặn khi review.
- **Lần 2 — copy có chủ đích, và ghi dấu.** Cùng nhu cầu xuất hiện lần thứ hai ở một tính năng khác: SHOULD copy có chủ đích (nguyên tắc WET — Write Everything Twice — thắng DRY ở giai đoạn này), nhưng MUST để lại dấu nối ở cả hai nơi: một comment ngắn ở mỗi nơi ghi rõ nơi còn lại đang có bản tương tự, ví dụ `// Bản tương tự: blocks/notice/edit.js — nếu xuất hiện lần 3, tách theo D3.` Không ghi dấu thì lần thứ ba không ai nhận ra, và đó là cách trùng lặp sinh sôi âm thầm.
- **Lần 3 — bắt buộc quyết định, mặc định là tách.** Cùng nhu cầu xuất hiện lần thứ ba, ở tính năng thứ ba khác nhau: MUST dừng lại và quyết định theo D3 hoặc D4 trước khi viết tiếp. Mặc định là tách thành bản dùng chung. Muốn không tách ở lần thứ ba, Agent phải ghi lý do thuộc một điều kiện hủy ở D9 ngay trong mô tả công việc — im lặng copy lần thứ ba là vi phạm.
- "Cùng một nhu cầu" được tính theo **cùng lý do thay đổi**, không theo giống nhau về hình dạng. Hai đoạn code trông giống hệt nhau nhưng thay đổi vì hai lý do nghiệp vụ khác nhau (một cái theo luật hiển thị của theme, một cái theo luật chấm điểm) là hai nhu cầu khác nhau — xem D9.2. Ngược lại, hai đoạn trông khác nhau (một ở Editor bằng JS, một ở render bằng PHP) nhưng cùng thực thi một quy tắc (cùng một validate, cùng một bảng màu, cùng một cách tính) vẫn tính là một nhu cầu lặp lại.

### D1.2. Ngoại lệ của Rule of Three — ngưỡng thấp hơn và cao hơn

Rule of Three là mặc định, không phải hằng số vật lý. Ba nhóm sau lệch khỏi nó có chủ đích:

- **Ngưỡng 2 cho an toàn và tiền:** validate, sanitize, kiểm tra capability, kiểm tra chữ ký, logic liên quan tới tiền, điểm và đáp án đúng — lặp lần thứ hai đã phải tách hoặc ít nhất gom về một nguồn duy nhất (D4.3). Lý do: hai bản sao của một kiểm tra bảo mật sẽ lệch nhau theo thời gian, và bản lệch chính là lỗ hổng.
- **Ngưỡng 2 cho biến thể hành vi:** xuất hiện loại thứ hai của cùng một hành vi (loại câu hỏi thứ hai, shell thứ hai, nhà cung cấp thứ hai) chưa bắt buộc tách hẳn, nhưng MUST chuẩn bị ranh giới theo D5.1: không rẽ nhánh thêm bằng `if/else` rải rác ở nhiều file. Tới biến thể thứ ba thì tách là bắt buộc (D5.2).
- **Không có ngưỡng cho thứ WordPress đã trừu tượng sẵn:** nếu core đã có cơ chế (block supports, Settings API, `WP_Error`, hook/filter), Agent MUST dùng cơ chế đó ngay từ lần đầu, không chờ lặp. "Tự chế rồi chờ trigger mới tách" không áp dụng cho việc thay thế cơ chế gốc — xem thứ tự ưu tiên ở 0.1.

### D1.3. Giá của trừu tượng — phải nói được trước khi tách

Mỗi lần tách đều mua một lợi ích bằng một chi phí cụ thể. Trước khi tách, Agent MUST nói được cả hai vế trong mô tả công việc, một câu mỗi vế:

- **Lợi ích:** thay đổi nào trong tương lai sẽ chỉ phải sửa ở một nơi, và nơi đó là nơi nào.
- **Chi phí:** người đọc code từ nay phải nhảy qua mấy lớp mới hiểu được một hành vi, và lớp nào là lớp mới thêm vào.

Không nói được vế lợi ích bằng một thay đổi cụ thể, có tên, có khả năng xảy ra thật — mà chỉ nói được "linh hoạt hơn", "dễ mở rộng hơn", "sạch hơn" — thì chưa đủ điều kiện tách. Ba cụm từ đó bị cấm dùng làm lý do tách trong tài liệu này.

- MUST ưu tiên trừu tượng **nông và rõ** hơn trừu tượng sâu và tổng quát: một hàm dùng chung có tên cụ thể (`acme_color_setting_attributes()`) thắng một framework setting tổng quát có cấu hình; một component nhận props rõ ràng thắng một component đọc cấu hình toàn cục.
- NEVER tạo một lớp trừu tượng mà tham số cấu hình của nó gần bằng chính đoạn code nó thay thế. Nếu gọi bản đã tách cần truyền vào gần như mọi chi tiết khác nhau của từng nơi dùng, thì bản tách đó không giảm được gì — nó chỉ dời độ phức tạp từ nơi dễ đọc sang nơi khó đọc.
- SHOULD giữ bản đã tách **nhỏ hơn tổng các bản sao nó thay thế, tính cả phần cấu hình ở nơi dùng**. Sau khi tách mà tổng số dòng tăng lên đáng kể và số nơi dùng vẫn dưới 3, đó là bằng chứng tách sai hoặc tách sớm.

## D2. Bảng trigger tổng — gặp trigger là phải dừng và quyết định

Bảng này là trung tâm của Phần D. Khi làm bất kỳ task nào, Agent quét code sắp viết và code xung quanh theo 18 trigger dưới đây. Khớp một trigger thì hành động ở cột cuối là bắt buộc, không phải gợi ý. Cột "Mục" là nơi đọc tiếp để biết cách làm đúng trigger đó.

| Mã | Dấu hiệu đếm được | Ngưỡng | Hành động bắt buộc | Mục |
|---|---|---|---|---|
| T01 | Cùng một setting (cùng attribute, cùng control, cùng validate) xuất hiện ở các block/tính năng khác nhau | Lần thứ 3 | Tách định nghĩa setting và control thành bản dùng chung; các nơi dùng chỉ khai báo tiêu thụ | D3.1, D3.2 |
| T02 | Cùng một cấu hình `supports` (màu, spacing, typography) khai báo lặp trong nhiều `block.json` | Lần thứ 3 | Gom thành tài liệu mẫu + hàm/kiểm tra đối chiếu khi review; `block.json` vẫn khai báo tường minh từng block, không sinh động bằng code | D3.3 |
| T03 | Cùng một cặp validate + sanitize cho cùng một loại giá trị (màu, URL, số trong khoảng, enum) | Lần thứ 2 nếu là bảo mật/tiền/điểm, lần thứ 3 còn lại | Tách thành một field schema / một hàm sanitize duy nhất có tên theo loại giá trị | D3.4, D4.3 |
| T04 | Cùng một logic render một giá trị ra frontend (slug màu → class, ID → ảnh, trạng thái → nhãn) ở nhiều template/`render.php` | Lần thứ 3 | Tách thành một hàm render/presenter duy nhất; template chỉ gọi và escape theo ngữ cảnh | D3.5, D6.3 |
| T05 | Cùng một câu query hoặc cùng một phép lọc/sắp xếp trên cùng một nguồn dữ liệu | Lần thứ 3, hoặc lần thứ 2 nếu query có `prepare` phức tạp | Thêm method vào repository tương ứng; cấm query rải rác thêm một nơi nữa | D4.1 |
| T06 | Cùng một kiểm tra capability + kiểm tra đối tượng trước một hành động | Lần thứ 2 | Gom thành một hàm kiểm tra quyền duy nhất cho hành động đó; mọi điểm vào (REST, AJAX, admin) đều gọi hàm này | D4.2 |
| T07 | Cùng một hình dạng response lỗi, cùng một mã lỗi, cùng một cách đóng gói dữ liệu trả về | Lần thứ 3 | Tách hàm đóng gói response / đăng ký mã lỗi dùng chung; không phát minh định dạng lỗi thứ hai | D4.4 |
| T08 | Xuất hiện biến thể thứ hai của cùng một hành vi (loại câu hỏi, cách chấm, định dạng xuất, shell, nhà cung cấp) | Lần thứ 2 | Chuẩn bị ranh giới theo D5.1: một điểm rẽ nhánh duy nhất, đặt tên cho biến thể, cấm `if` rải rác thêm | D5.1 |
| T09 | Biến thể ở T08 xuất hiện thêm, hoặc điểm rẽ nhánh của T08 đã có từ 3 nhánh trở lên | Lần thứ 3 / nhánh thứ 3 | Tách hẳn theo Strategy hoặc Registry theo D5.2–D5.3 | D5.2 |
| T10 | Plugin cần làm việc qua một lớp ngoài có thể thay thế (LMS shell, API của bên thứ ba, API của core đang đổi) | Ngay lần đầu, nếu việc thay thế đã nằm trong kế hoạch đã chốt | Dựng Adapter theo D7.1 ngay từ đầu; đây là ngoại lệ có kế hoạch, không phải tách sớm | D7.1 |
| T11 | Nhiều nơi cần phản ứng khi một việc xảy ra (lưu bài, nộp bài, đổi trạng thái) | Nơi thứ 2 cần phản ứng | Dùng hook (`do_action` / `apply_filters`) theo C4 thay cho gọi trực tiếp dây chuyền; không tự chế event bus | D5.4 |
| T12 | Một block phình ra: quá ~20 attribute, quá ~8 control tự chế, hoặc làm hai việc độc lập | Vượt một ngưỡng bất kỳ ở A5.2/A5.6 | Tách theo Composition: block con + `InnerBlocks`, hoặc block variation — không thêm attribute/control vào block cũ nữa | D6.1 |
| T13 | Cùng một cụm giao diện (thẻ, hàng, khối trạng thái tải/rỗng/lỗi) lặp ở các màn hình/block khác nhau | Lần thứ 3 | Tách thành component dùng chung (JS) hoặc template part (PHP); bốn trạng thái ở A8.2 đi theo component, không chép lại | D6.2 |
| T14 | Một file hoặc một class phải sửa vì nhiều lý do không liên quan (vừa render, vừa query, vừa gọi API ngoài, vừa kiểm tra quyền) | Từ 3 lý do thay đổi trở lên | Tách theo trách nhiệm theo D10: repository cho dữ liệu, service cho nghiệp vụ, controller/template chỉ cho trình bày và điểm vào | D10 |
| T15 | Một thay đổi nhỏ về nghiệp vụ buộc phải sửa từ 3 file/nơi trở lên cho cùng một khái niệm | Lần đầu tiên quan sát được | Ghi lại khái niệm đó vào mô tả công việc và lên kế hoạch gom khái niệm về một nơi sở hữu duy nhất (D11) trước lần thay đổi tiếp theo | D11 |
| T16 | Một hàm vượt ~80 dòng, lồng nhau quá 3 cấp, hoặc một file vượt ~600 dòng mà vẫn đang lớn thêm | Vượt một ngưỡng bất kỳ | Dừng thêm tính năng vào hàm/file đó; tách theo đường nối tự nhiên (bước validate, bước tính, bước ghi, bước trả) theo D10, không tách theo số dòng cơ học | D10 |
| T17 | Cùng một hằng số, slug, mã trạng thái, tên option/meta/hook được gõ tay ở nhiều nơi | Lần thứ 2 | Đưa về một nơi định nghĩa duy nhất (hằng, enum-like class, hoặc registry ở D11) và mọi nơi dùng tham chiếu tới đó | D11 |
| T18 | Code phải bọc một API ngoài hoặc API kế thừa mà hình dạng dữ liệu của nó khác hẳn hình dạng plugin đang dùng | Ngay lần đầu chạm tới | Dựng lớp anti-corruption mỏng theo D7.2: chuyển đổi diễn ra ở biên, không để hình dạng lạ lan vào trong plugin | D7.2 |

Cách đọc bảng này cho đúng:

- Ngưỡng đếm theo **số tính năng/nơi dùng khác nhau**, không đếm theo số dòng giống nhau. Ba dòng giống nhau trong cùng một file không phải trigger; một setting giống nhau ở ba block khác nhau là trigger.
- Trigger đã nổ thì **không được trì hoãn bằng cách ghi TODO suông**. Hoặc tách ngay trong task hiện tại, hoặc ghi quyết định không tách kèm lý do thuộc D9 và phạm vi sẽ quay lại xử lý. TODO không có hai thứ đó coi như chưa quyết định.
- Nhiều trigger nổ cùng lúc trong một task lớn: xử lý theo thứ tự an toàn trước (T03, T06 — bảo mật), dữ liệu trước (T05, T17), rồi mới tới trình bày (T01, T04, T13). Không tách trình bày trong khi nguồn dữ liệu bên dưới còn đang bị nhân bản.

## D3. Trigger nhóm Setting và Editor UI — DRY cho setting là trường hợp điển hình nhất

Đây là nhóm trigger người dùng nêu làm ví dụ gốc: một setting lặp lại ở các tính năng khác nhau. Setting là nơi trùng lặp sinh ra nhanh nhất trong plugin WordPress, vì thêm một block mới gần như luôn cần lại màu, khoảng cách, liên kết, toggle hiển thị và giới hạn số lượng. Nhóm này quy định tách setting theo bốn lớp riêng biệt — **định nghĩa, control, validate, render** — và cấm tách gộp cả bốn thành một "siêu component" cấu hình được mọi thứ.

### D3.1. Lớp định nghĩa: tách attribute và schema của setting (trigger T01)

Một "định nghĩa setting" gồm: tên attribute, `type`, `default`, `enum` nếu có, và — khi setting đi qua REST hoặc Settings API — `validate_callback` và `sanitize_callback` tương ứng. Đây là lớp phải tách đầu tiên khi T01 nổ, trước cả lớp control.

- Khi T01 nổ ở phía PHP (meta, option, REST arg): MUST gom định nghĩa về một hàm hoặc một hằng cấu trúc duy nhất có tên theo khái niệm, không theo nơi dùng đầu tiên. Ví dụ đúng: `acme_color_setting_schema( 'iconColor' )` hoặc một mảng schema đặt trong file dùng chung của nhóm tính năng. Ví dụ sai: để block đầu tiên "sở hữu" định nghĩa rồi hai block sau `require` file của block đầu tiên — nơi dùng ngang hàng không được phụ thuộc lẫn nhau; bản dùng chung sống ở tầng dùng chung theo D11.
- Khi T01 nổ ở phía block: `block.json` của từng block vẫn khai báo attribute tường minh trong chính file của nó. NEVER sinh `block.json` bằng code, và NEVER giấu attribute của một block sau một cơ chế nạp động mà người đọc mở `block.json` ra không thấy. Cách tách đúng ở lớp này là: một **mẫu định nghĩa chuẩn** được ghi trong tài liệu nội bộ hoặc comment trỏ tới (theo đúng tinh thần A5.9), các `block.json` chép theo mẫu đó từng chữ ở các khóa liên quan, và một kiểm tra khi review đối chiếu ba bản với nhau. Dữ liệu đã lưu trong nội dung là hợp đồng (A5.2) — sự tường minh của `block.json` thắng sự gọn gàng của DRY ở riêng lớp này.
- Tên attribute của cùng một setting MUST giống hệt nhau ở mọi block dùng chung nó (cùng tên, cùng kiểu, cùng default). Ba block dùng ba tên khác nhau cho cùng một khái niệm (`iconColor`, `colorIcon`, `accent`) là lỗi đặt tên phải sửa khi T01 nổ, kèm `deprecated`/`migrate` theo A5.10 cho block nào đã phát hành với tên sai.
- Default của setting dùng chung MUST giống nhau ở mọi nơi dùng. Một nơi cần default khác là dấu hiệu hoặc (a) đó là hai setting khác nhau bị tưởng là một — quay về D9.2 — hoặc (b) default phải trở thành tham số tường minh khi tiêu thụ, ghi rõ ở nơi dùng, không giấu trong bản tách.

### D3.2. Lớp control: tách component Inspector dùng chung (trigger T01, tiếp nối D3.1)

Chỉ sau khi lớp định nghĩa đã thống nhất, mới tách lớp control — component vẽ control trong Inspector.

- Hình dạng chuẩn của một control dùng chung: một component JS nhận vào đúng bốn thứ — giá trị hiện tại, hàm `onChange`, nhãn, và các ghi đè thật sự khác nhau giữa nơi dùng (ví dụ danh sách màu bị cấm, cờ cho phép xóa) — và không nhận thêm gì khác. Component dùng chung NEVER tự đọc attribute bằng hook của block, NEVER tự biết nó đang ở trong block nào, và NEVER tự ghi dữ liệu. Nó là control thuần: vào là giá trị, ra là `onChange`.
- Ví dụ hình dạng đúng cho setting màu phần tử con đã tách (đối chiếu A6.2 — bản chưa tách nằm ở đó; đây là hình dạng sau khi T01 nổ):

```js
// shared/controls/element-color-control.js — dùng chung, không thuộc block nào.
export function AcmeElementColorControl( { label, slugValue, customValue, onChange } ) {
	// Dựng ColorGradientSettingsDropdown theo A6.2, đọc palette bằng useSettings
	// như A6.2 đã quy định, xử lý đủ chọn preset / chọn tự do / xóa về mặc định,
	// rồi báo ra ngoài qua onChange( { slug, custom } ) — không tự setAttributes.
}
```

```js
// Trong edit của từng block — nơi dùng chỉ còn phần nối dây:
<AcmeElementColorControl
	label={ __( 'Icon color', 'acme' ) }
	slugValue={ iconColor }
	customValue={ customIconColor }
	onChange={ ( { slug, custom } ) =>
		setAttributes( { iconColor: slug, customIconColor: custom } ) }
/>
```

- Số props ghi đè là thước đo sức khỏe của lần tách: 1–3 props ghi đè là bình thường; 4–6 props là dấu hiệu các nơi dùng đã bắt đầu khác nhau thật, phải xem lại D9; trên 6 props, hoặc xuất hiện prop dạng `mode`/`variant` rẽ nhánh toàn bộ cách vẽ bên trong, là bằng chứng đây không còn là một control nữa — MUST tách lại thành hai control riêng hoặc trả về dạng chưa tách.
- Control dùng chung vẫn phải tuân toàn bộ luật của lớp nó thuộc về: màu thì theo A6 (hai attribute tách bạch slug/custom, đọc palette từ theme, có đường xóa), liên kết thì theo A7.6, media thì theo A7.3. Tách dùng chung không phải là đường vòng để né luật gốc; khi luật gốc thay đổi, chỉ bản dùng chung thay đổi và mọi nơi dùng được hưởng theo — đó chính là lợi ích phải nói được theo D1.3.

### D3.3. Cấu hình supports lặp lại (trigger T02)

- `supports` không tách được bằng code dùng chung, vì `block.json` là file tĩnh và là nguồn chân lý (A5.1). Cách xử lý đúng khi T02 nổ gồm ba việc: (1) chốt một **bộ supports chuẩn theo loại block** (block nội dung, block chứa, block tương tác) ghi thành mẫu đối chiếu như A5.8–A5.9; (2) khi review block mới, đối chiếu `supports` của nó với mẫu cùng loại và mọi lệch khỏi mẫu phải có lý do ghi ra; (3) phần **hệ quả** của supports ở phía CSS và render — class, biến, cách áp style — thì tách dùng chung bình thường theo D3.5, vì đó mới là nơi trùng lặp gây lỗi thật.
- NEVER bật một supports ở block này rồi quên ở block kia cho cùng một trải nghiệm người dùng. Hai block cùng loại mà một cái cho đổi màu nền, một cái không, không có lý do nghiệp vụ, là lỗi nhất quán phải sửa khi T02 được quét tới.

### D3.4. Validate và sanitize của setting (trigger T03)

- Mỗi loại giá trị chỉ có **một** cặp validate/sanitize trong toàn plugin: một cho màu (theo A6.6), một cho URL và cờ mở tab mới (theo A7.6), một cho số trong khoảng, một cho enum, một cho danh sách ID. Nơi định nghĩa duy nhất đó được cả ba lớp cùng gọi: sanitize của Settings API (C5.1), `args` của REST (C6.3), và kiểm tra ở phía render PHP khi giá trị tới từ nội dung đã lưu.
- Khi T03 nổ, việc tách gồm: đặt tên hàm theo loại giá trị (`acme_sanitize_hex_color()`, không đặt theo tính năng đầu tiên dùng nó), dời toàn bộ logic về hàm đó, và thay mọi bản sao bằng lời gọi. Bản sao nào có thêm một kiểm tra riêng thì kiểm tra riêng đó hoặc được đưa vào hàm chung kèm tham số có tên rõ, hoặc được ghi nhận là bằng chứng hai nhu cầu này thực ra khác nhau (D9.2).
- Phía JS cũng vậy: một hàm validate/normalize cho một loại giá trị, dùng chung giữa các control. NEVER để mỗi component tự parse cùng một định dạng theo cách hơi khác nhau — lệch parse giữa Editor và PHP cho cùng một giá trị là nguồn lỗi "lưu được nhưng render sai" kinh điển.

### D3.5. Render giá trị setting ra frontend (trigger T04)

- Cách một setting biến thành markup/CSS chỉ được định nghĩa ở một nơi: slug màu thành class preset và biến CSS (A6.3, A6.6), ID media thành thẻ ảnh có `srcset` (A7.3), trạng thái thành nhãn đã dịch. Với dynamic block, nơi đó là một hàm presenter/template dùng chung được các `render.php` gọi; với static block, nơi đó là hàm `save` dùng chung ở phía JS cộng hàm đối chiếu ở phía PHP khi cần validate lại.
- Template và `render.php` sau khi tách chỉ làm hai việc: gọi hàm render dùng chung để lấy giá trị đã xử lý, và escape theo đúng ngữ cảnh xuất (A1). Logic quyết định "giá trị này thì hiện thế nào" không nằm lại trong template.
- Kiểm tra sau tách bắt buộc: render cùng một bộ giá trị mẫu qua mọi nơi dùng cũ và so sánh kết quả với trước khi tách. Lệch một nơi là tách sai, phải sửa ngay trong cùng task, không để lại ghi chú "sẽ kiểm tra sau".

## D4. Trigger nhóm Backend — DRY cho query, quyền, validate và response

Backend trùng lặp nguy hiểm hơn giao diện trùng lặp, vì bản sao ở backend thường mang theo quyền, tiền, điểm hoặc toàn vẹn dữ liệu. Ngưỡng của nhóm này vì thế thấp hơn nhóm giao diện ở đúng những chỗ đó (D1.2).

### D4.1. Query và repository (trigger T05)

- Repository đã có kỷ luật riêng ở B5: một bảng, một nguồn dữ liệu — một nơi chạm vào nó. Trigger T05 là lúc kỷ luật đó bị phá lần thứ ba: cùng một phép lọc, cùng một phép nối bảng, cùng một điều kiện "chỉ lấy bản ghi đang hoạt động của người dùng hiện tại" xuất hiện rải rác.
- Hành động khi T05 nổ: thêm một method có tên theo **ý định nghiệp vụ** vào repository (`find_active_attempts_for_user()`), không đặt tên theo hình dạng SQL (`get_rows_where_status_1()`). Mọi nơi dùng chuyển sang gọi method đó. Tham số của method là các đại lượng nghiệp vụ thật sự thay đổi giữa nơi dùng (ID người dùng, giới hạn, thứ tự); điều kiện cố định của khái niệm thì nằm chết trong method, không truyền vào.
- NEVER tách query thành một "query builder tổng quát" tự chế của plugin. WordPress đã có `WP_Query`, `$wpdb` và repository theo B5; một builder tổng quát là trừu tượng sai trục kinh điển — nó tổng quát hóa thứ ít thay đổi (cú pháp SQL) và để nguyên thứ hay thay đổi (ý định nghiệp vụ).
- Sau khi tách, các method của repository là nơi duy nhất được viết kiểm thử truy vấn tập trung. Nơi dùng không viết lại test cho cùng một phép lọc.

### D4.2. Kiểm tra quyền cho một hành động (trigger T06, ngưỡng 2)

- Một hành động có hậu quả (nộp bài, xóa, chấm lại, đổi trạng thái) chỉ có **một** hàm trả lời câu hỏi "người này có được làm việc này với đối tượng này không". Hàm đó nhận người dùng (hoặc dùng người dùng hiện tại), ID đối tượng, và trả `bool` hoặc `WP_Error` — theo đúng kỷ luật capability gắn đối tượng ở C3.1 và C6.2.
- Mọi điểm vào của cùng một hành động — REST route, AJAX handler, admin post, WP-CLI — MUST gọi cùng hàm đó. Điểm vào chỉ khác nhau ở cách lấy tham số và cách trả lỗi, không khác nhau ở luật quyền. Hai điểm vào kiểm tra quyền theo hai cách hơi khác nhau cho cùng một hành động là lỗi bảo mật, không phải lỗi phong cách.
- Hàm kiểm tra quyền dùng chung NEVER tự xuất response, tự redirect hay tự `wp_die()`. Nó trả kết quả; điểm vào quyết định cách trình bày kết quả đó. Trộn hai việc này là lý do phổ biến nhất khiến một hàm quyền "dùng chung" cuối cùng không dùng chung được cho REST.

### D4.3. Validate nghiệp vụ (trigger T03 ở phía backend)

- Validate có hai tầng và chỉ tầng thứ hai mới thuộc nhóm này: tầng hình dạng (kiểu, khoảng, enum — do `args` của REST và sanitize của Settings API lo, xem C5.1, C6.3) và tầng nghiệp vụ (bài này còn nộp được không, lượt này còn không, trạng thái này chuyển sang trạng thái kia được không). Tầng nghiệp vụ lặp lần thứ hai là phải gom về service sở hữu khái niệm đó (D8, Service) — không để controller thứ hai tự suy lại luật nghiệp vụ từ dữ liệu thô.
- Luật nghiệp vụ đã gom thì chỉ service đó mới được sửa. Controller, template và job nền muốn biết kết quả thì hỏi service. Sửa luật ở một nơi ngoài service là vi phạm quyền sở hữu khái niệm ở D11.

### D4.4. Response, lỗi và mã lỗi (trigger T07)

- Một resource chỉ có một hàm đóng gói response (field nào, context nào, định dạng ngày giờ nào — theo C6.4, C6.7), và một hành động chỉ có một tập mã lỗi đã đăng ký. Lần thứ ba một nơi khác tự đóng gói cùng resource theo cách riêng, T07 nổ và nơi đó phải chuyển sang hàm chung.
- Mã lỗi là hợp đồng công khai ngang hook và route (C12): đã phát hành thì không đổi nghĩa, không tái sử dụng cho lỗi khác. Nơi đăng ký mã lỗi dùng chung là một file/bảng duy nhất của plugin (D11), để người review nhìn một chỗ là thấy toàn bộ bề mặt lỗi.

## D5. Trigger nhóm Biến thể — khi hành vi bắt đầu có nhiều loại

Nhóm này xử lý tình huống khác hẳn DRY: code chưa lặp, nhưng **hành vi đã bắt đầu phân nhánh**. Đây là nơi Agent hoặc rẽ nhánh bằng `if` rải rác cho tới khi không sửa nổi, hoặc dựng Strategy/Factory quá sớm cho một loại duy nhất. Cả hai đều sai, và trigger dưới đây phân định ranh giới.

### D5.1. Biến thể thứ hai xuất hiện (trigger T08) — chuẩn bị ranh giới, chưa tách hẳn

Khi loại thứ hai xuất hiện (ví dụ: sau câu hỏi trắc nghiệm là câu hỏi kéo thả; sau shell mặc định là một shell LMS khác; sau cách chấm theo đáp án đúng/sai là cách chấm theo mốc):

- MUST gom toàn bộ quyết định "đang là loại nào" về **một điểm rẽ nhánh duy nhất** trong mỗi luồng. Từ thời điểm này, cấm thêm điều kiện kiểm tra loại rải rác ở file khác: nơi khác muốn biết khác biệt theo loại thì hỏi qua điểm rẽ nhánh đó hoặc qua khả năng của đối tượng loại, không tự kiểm tra lại chuỗi loại.
- MUST đặt tên cho biến thể bằng một định danh ổn định (slug loại) đăng ký ở một nơi (D11), và lưu định danh đó cùng dữ liệu — không suy ra loại từ hình dạng dữ liệu mỗi lần cần.
- SHOULD giữ hai biến thể trong cùng một cấu trúc code ở giai đoạn này (một hàm có một điểm rẽ nhánh rõ ràng vẫn đọc được). Hai biến thể chưa đủ bằng chứng để biết trục phân chia đúng là trục nào — tách hẳn ở giai đoạn này có xác suất cao tách sai trục (D9.3).
- MUST ghi dấu theo tinh thần D1.1: tại điểm rẽ nhánh, ghi rõ biến thể thứ ba xuất hiện thì chuyển sang D5.2.

### D5.2. Biến thể thứ ba, hoặc điểm rẽ nhánh có ba nhánh (trigger T09) — tách hẳn

- Khi biến thể thứ ba xuất hiện, hoặc điểm rẽ nhánh ở D5.1 đã có ba nhánh mà mỗi nhánh dài hơn vài dòng: MUST tách theo một trong hai hình dạng sau, chọn theo cách biến thể được phát hiện:
  - **Strategy:** các biến thể được chọn ngay trong code của plugin theo một khóa đã biết (loại câu hỏi → một class chấm cho mỗi loại, cùng một interface `grade( attempt, answer ): result`). Nơi gọi chỉ giữ khóa và interface, không giữ chi tiết từng loại.
  - **Registry:** các biến thể cần được đăng ký thêm từ nơi khác (từ module khác của plugin, hoặc từ plugin ngoài qua filter theo C4). Registry là một danh sách đăng ký có khóa, có thứ tự, có kiểm tra trùng khóa; tra cứu theo khóa là thao tác duy nhất nơi gọi được làm.
- Interface của Strategy/Registry MUST nhỏ: chỉ gồm những thao tác mà **mọi** biến thể đều làm được thật. Một interface có method mà một nửa biến thể phải để trống, ném lỗi "không hỗ trợ" hoặc trả giá trị giả là interface sai trục — phải thu hẹp interface hoặc tách biến thể đó ra khỏi nhóm.
- Mỗi biến thể sau khi tách là một đơn vị độc lập: thêm biến thể mới là thêm một đơn vị và một đăng ký, không sửa các biến thể cũ và không sửa nơi gọi. Nếu thêm biến thể thứ tư vẫn phải sửa nơi gọi, lần tách đã thất bại và phải nói rõ khi review.
- Dữ liệu đã lưu của biến thể cũ không đổi hình dạng vì lần tách này. Tách hành vi không phải dịp để đổi schema; cần đổi schema thì đi đường B4 và C12 riêng.

### D5.3. Factory — pattern bị lạm dụng nhất, ngưỡng cao nhất

- Factory (một nơi duy nhất tạo đối tượng theo khóa) chỉ được dựng khi **cả ba** điều kiện cùng đúng: (1) việc tạo đối tượng có logic thật (chọn class theo khóa, nạp cấu hình, kiểm tra điều kiện) chứ không chỉ là `new`; (2) logic tạo đó đã lặp ở từ hai nơi gọi trở lên; (3) tập hợp loại có thể tạo ra thay đổi độc lập với nơi gọi.
- Thiếu một điều kiện: dùng thẳng `new` hoặc một hàm tạo nhỏ có tên cụ thể. Một Factory cho một loại duy nhất, hoặc Factory chỉ bọc một câu `new`, là trừu tượng rỗng và bị chặn khi review.
- NEVER dựng Abstract Factory, Factory kết hợp Registry kết hợp cấu hình XML/mảng lồng nhau cho bài toán mà Strategy đơn giản ở D5.2 đã giải quyết được. Độ phức tạp của cơ chế tạo không được vượt độ phức tạp của thứ nó tạo.

### D5.4. Observer trong WordPress là hook — không tự chế hệ thống sự kiện (trigger T11)

- Khi nơi thứ hai cần phản ứng với cùng một sự việc (sau khi nộp bài: nơi chấm điểm, nơi ghi log, nơi cập nhật tiến độ), cơ chế đúng là hook của WordPress theo C4: nơi phát việc chỉ `do_action( 'acme_attempt_submitted', ... )`, các nơi phản ứng tự đăng ký. Đây là pattern Observer bản địa của WordPress.
- NEVER tự chế event bus, event dispatcher, hàng đợi sự kiện trong bộ nhớ, hoặc cơ chế pub/sub riêng bên trong một plugin. Nó trùng với hook, không ai ngoài Agent biết nó tồn tại, và nó chết theo request trong khi người đọc tưởng nó bền.
- Payload của action là hợp đồng (C4, C12): thứ tự và ý nghĩa tham số đã phát hành thì giữ nguyên; cần thêm dữ liệu thì thêm tham số ở cuối hoặc chuyển sang một action mới có tên rõ hơn.

## D6. Trigger nhóm Composition — tách bằng cách ghép, không bằng kế thừa

Luật gốc của nhóm này: **composition thắng inheritance ở mọi tầng của plugin** — block, component JS và class PHP. Kế thừa tạo ra một cây cứng mà WordPress (vốn chạy bằng hook, filter và ghép block) không tưởng thưởng; ghép các đơn vị nhỏ tạo ra đúng thứ hệ sinh thái này vận hành.

### D6.1. Block phình (trigger T12) — tách bằng block con, không bằng thêm setting

- Khi một block vượt ngưỡng ở A5.2 (khoảng 20 attribute) hoặc A5.6 (khoảng 8 control tự chế), hoặc bắt đầu chứa một cụm nội dung có thể sống độc lập: MUST dừng thêm setting vào block đó và tách theo một trong ba đường ở A7.8 — block con qua `InnerBlocks` khi cụm đó là nội dung trình bày lặp lại, block variation khi khác biệt chỉ là cấu hình sẵn của cùng một block, hoặc block pattern khi khác biệt chỉ là cách lắp sẵn.
- Dấu hiệu nhận biết tách đúng đường: nếu phần sắp tách cần style riêng từng mục, sửa tại chỗ riêng, hoặc thứ tự kéo thả riêng — đó là block con. Nếu phần sắp tách chỉ khác block cũ ở giá trị attribute đặt sẵn — đó là variation, tách thành block con ở đây là quá tay.
- Setting của cụm đã tách đi theo block con, không ở lại block cha dưới dạng setting ủy quyền. Block cha chỉ còn setting về hành vi của cả cụm (số cột, khoảng cách giữa các mục) qua context theo A5.1.

### D6.2. Cụm giao diện lặp (trigger T13) — component và template part

- Phía JS: cụm lặp được tách thành component thuần theo cùng kỷ luật props ở D3.2 — nhận dữ liệu và callback, không tự gọi API, không tự đọc store toàn cục ngoài thứ được truyền vào hoặc thứ mọi màn hình đều dùng giống hệt nhau.
- Phía PHP: cụm lặp được tách thành một template part của plugin (một file template nhỏ nhận biến đã chuẩn bị, chỉ làm nhiệm vụ xuất và escape). Template part NEVER tự query, tự kiểm tra quyền hay tự gọi API ngoài — dữ liệu phải được chuẩn bị xong trước khi tới nó (xem D6.3).
- Bốn trạng thái tải/rỗng/lỗi/có dữ liệu (A8.2) là một cụm giao diện theo nghĩa của mục này: xuất hiện lần thứ ba thì tách thành một component trạng thái dùng chung, để cách người dùng được báo lỗi nhất quán trong toàn plugin.

### D6.3. Presenter — lớp mỏng giữa dữ liệu và template (trigger T04, dạng backend)

- Khi cùng một dữ liệu thô phải được biến đổi trước khi hiển thị ở từ hai nơi trở lên (định dạng điểm, nhãn trạng thái, ngày giờ theo múi giờ của site, slug thành class), tách một presenter: một hàm hoặc class nhỏ chỉ làm việc biến đổi dữ liệu thành dạng sẵn sàng hiển thị, không query, không kiểm tra quyền, không xuất HTML.
- Presenter là pattern rẻ nhất trong catalogue này và nên là lần tách đầu tiên Agent nghĩ tới khi thấy logic hiển thị lặp: nó không đổi cấu trúc, không đổi nơi gọi ngoài việc thay đoạn biến đổi bằng một lời gọi.
- NEVER để presenter tự quyết định quyền hiển thị ("người này có được thấy trường này không") — đó là việc của lớp quyền (D4.2) và context của REST (C6.7). Presenter chỉ định dạng thứ đã được phép thấy.

## D7. Trigger nhóm Biên hệ thống — Adapter, Facade và lớp chống lan truyền

### D7.1. Adapter cho lớp có thể thay thế (trigger T10) — ngoại lệ được tách ngay từ lần đầu

- Adapter là pattern duy nhất trong tài liệu này được phép dựng **trước** khi có lần lặp nào, và chỉ khi việc thay thế đã nằm trong kế hoạch đã chốt thành văn bản — không phải khi Agent "thấy có thể sau này thay". Ví dụ chuẩn trong hệ dự án này: lớp `whym_shell_*` bọc một LMS dùng làm shell ở MVP, với lộ trình tách dần đã ghi rõ từng giai đoạn. Kế hoạch thay thế có tên, có giai đoạn, có điều kiện gỡ — đó là thứ phân biệt Adapter có kỷ luật với trừu tượng đầu cơ.
- Hình dạng bắt buộc của Adapter: (1) toàn bộ lời gọi tới hệ được bọc đi qua một họ hàm/class adapter có tiền tố riêng (`<prefix>_shell_*`), không một nơi nào khác trong plugin gọi thẳng API của hệ đó; (2) adapter nói bằng khái niệm của plugin (bài học, khóa học, tiến độ), không nói bằng khái niệm của hệ được bọc; (3) adapter không chứa nghiệp vụ của plugin — nó chỉ dịch qua lại; nghiệp vụ sống ở service phía trên adapter.
- Kiểm tra sức khỏe của Adapter, chạy mỗi lần sửa gần nó: tìm trong toàn plugin các lời gọi thẳng tới API của hệ được bọc ngoài thư mục adapter. Tìm thấy một lời gọi là adapter đã thủng, và sửa lời gọi đó quan trọng hơn thêm tính năng mới qua adapter.
- Khi việc thay thế thật sự diễn ra, chỉ adapter thay đổi. Nếu thay shell mà phải sửa cả service, template và block, thì adapter ban đầu đã để lọt khái niệm của hệ cũ lên trên — ghi nhận đó là nợ kiến trúc phải trả trong cùng đợt thay thế, không để âm thầm.

### D7.2. Anti-corruption và Facade cho API ngoài (trigger T18)

- Mọi API ngoài (dịch vụ chấm, cổng thanh toán, API của plugin khác, kể cả API của core ở phần đang thay đổi nhanh) đều được chạm qua một lớp biên mỏng: lớp này chuyển hình dạng dữ liệu ngoài thành hình dạng của plugin ngay tại điểm chạm, validate theo C9.1, và là nơi duy nhất biết URL, khóa và định dạng lạ của phía ngoài.
- Facade ở đây hiểu theo nghĩa hẹp và rẻ: một họ hàm có tên theo việc cần làm (`acme_fetch_grading_result()`), giấu sau nó là HTTP, chữ ký, thử lại và chuyển đổi. NEVER dựng một SDK nội bộ tổng quát cho một nhà cung cấp duy nhất với tham vọng "sau này dùng cho nhiều nhà cung cấp" — đó là T10 không có kế hoạch, quay về D9.
- Lỗi của phía ngoài được dịch thành `WP_Error` với mã của plugin ngay tại lớp biên (C9, D4.4). Mã lỗi, thông điệp và hình dạng dữ liệu của nhà cung cấp không được lan qua lớp biên vào trong plugin.

## D8. Catalogue pattern được phép dùng — tra cứu nhanh

Bảng này không phải thực đơn để chọn trước. Nó chỉ được mở **sau** khi một trigger ở D2 đã nổ và đã chỉ tới một pattern. Mỗi hàng ghi: ý định trong một câu, hình dạng đúng trong WordPress, trigger sở hữu nó, và hình dạng lạm dụng bị cấm.

| Pattern | Ý định | Hình dạng đúng trong plugin WP | Trigger | Lạm dụng bị cấm |
|---|---|---|---|---|
| Shared Definition | Một khái niệm, một định nghĩa | Hàm/hằng schema duy nhất cho setting, field, mã lỗi, slug (D3.1, D4.4) | T01, T03, T17 | Sinh `block.json` hoặc markup bằng code để "dùng chung" |
| Shared Control / Component | Một cách nhập liệu, một cách vẽ | Component thuần nhận giá trị + `onChange` + tối đa vài props ghi đè (D3.2) | T01, T13 | Component cấu hình bằng `mode` và 10 props, tự đọc store và tự ghi dữ liệu |
| Composition | Ghép đơn vị nhỏ thay vì phình một đơn vị | Block con + `InnerBlocks`, component con, template part (D6) | T12, T13 | Kế thừa cây class/block sâu để "tái sử dụng" |
| Presenter | Một cách biến dữ liệu thành dạng hiển thị | Hàm/class nhỏ, không query, không quyền, không HTML (D6.3) | T04 | Presenter tự query và tự quyết quyền hiển thị |
| Repository | Một nguồn dữ liệu, một nơi chạm vào | Class theo B5/B5.1, method đặt tên theo ý định nghiệp vụ (D4.1) | T05 | Query builder tổng quát tự chế; repository cho dữ liệu chỉ là postmeta đơn giản |
| Service | Một khái niệm nghiệp vụ, một chủ sở hữu luật | Class/họ hàm giữ validate nghiệp vụ và điều phối ghi (D4.3) | T03 (nghiệp vụ), T14 | "Service" là thùng chứa mọi thứ không biết đặt đâu; service gọi thẳng template |
| Strategy | Một hành vi, nhiều cách làm, chọn theo khóa | Một interface nhỏ + một class cho mỗi biến thể (D5.2) | T09 | Strategy cho một biến thể duy nhất; interface có method bị để trống |
| Registry | Tập hợp biến thể mở được từ nơi khác | Đăng ký theo khóa qua hàm đăng ký hoặc filter, tra cứu theo khóa (D5.2) | T09 khi cần mở rộng ngoài | Registry cho tập hợp đóng, cố định, chỉ code trong plugin dùng |
| Factory | Một logic tạo đối tượng thật, dùng ở nhiều nơi | Một hàm/class tạo, chỉ khi đủ cả ba điều kiện ở D5.3 | T09 + điều kiện D5.3 | Factory bọc một câu `new`; Abstract Factory cho vài loại |
| Adapter | Dịch giữa plugin và một hệ có thể thay thế | Họ `*_shell_*` / lớp biên nói bằng khái niệm của plugin (D7.1) | T10 (có kế hoạch đã chốt) | Adapter "đề phòng" không có kế hoạch thay thế; adapter chứa nghiệp vụ |
| Facade / lớp biên | Giấu chi tiết xấu của API ngoài sau vài hàm có tên theo việc | Họ hàm mỏng + dịch lỗi thành `WP_Error` tại biên (D7.2) | T18 | SDK nội bộ tổng quát cho một nhà cung cấp |
| Observer (Hook) | Nhiều nơi phản ứng với một sự việc | `do_action` / `apply_filters` theo C4 (D5.4) | T11 | Event bus tự chế; action có payload đổi nghĩa theo thời gian |
| Template Method (dạng WordPress) | Một quy trình cố định, vài bước thay đổi theo loại | Hàm quy trình ở lớp trên gọi các bước qua filter hoặc qua method của Strategy — không dựng cây kế thừa để có nó | T09 khi quy trình chung đã ổn định ở 3 biến thể | Cây kế thừa PHP sâu chỉ để chia sẻ một quy trình |
| Variation / Preset | Cùng một thứ, khác cấu hình đặt sẵn | Block variation, block style variation, pattern theo A7.8 | T12 khi khác biệt chỉ là cấu hình | Nhân bản block/class chỉ để đổi vài giá trị mặc định |
| Shim / lớp tương thích | Đường cũ và đường mới chạy song song có thời hạn | Giữ API cũ, dịch sang đường mới, phát cảnh báo ngừng hỗ trợ theo C12 và A5.10 | Mọi lần đổi thứ đã phát hành (C12) | Shim không có ngày gỡ và không có cảnh báo — nó sẽ thành API thứ hai vĩnh viễn |
| Value Object / DTO | Một cụm giá trị luôn đi cùng nhau và có luật riêng | Class nhỏ không phụ thuộc WordPress, có validate ở constructor hoặc hàm tạo tĩnh; dùng cho kết quả chấm, khoảng giá trị, khóa idempotency | Khi cùng một cụm 3+ trường được truyền qua từ 3 hàm trở lên và đã từng lệch nhau một lần | DTO cho mọi mảng hai trường; DTO có method gọi DB hoặc HTTP |

Hai pattern **không có trong catalogue** và mặc định bị cấm, muốn dùng phải biện minh riêng khi review: **Singleton** (WordPress đã quản lý vòng đời; singleton tự chế giấu phụ thuộc và phá kiểm thử — dùng hàm khởi tạo một lần theo C1.2 thay thế) và **Inheritance sâu quá một cấp** cho class nghiệp vụ (cấp thứ hai xuất hiện là tín hiệu phải xem lại bằng Composition theo D6).

## D9. Anti-trigger — khi nào KHÔNG được tách dù bề ngoài rất giống trigger

Mục này là phanh của Phần D, và nó có quyền thắng mọi trigger ở D2. Trước mỗi lần tách, Agent MUST tự kiểm tra bốn điều kiện hủy dưới đây và ghi kết quả kiểm tra vào mô tả công việc. Một điều kiện hủy đúng thì không tách, và quyết định không tách đó phải được ghi lại kèm dấu nối như kỷ luật lần-2 ở D1.1, để lần sau không phải tranh luận lại từ đầu.

### D9.1. Tách quá sớm — chưa đủ bằng chứng về trục thay đổi

- Chỉ có một nơi dùng, hoặc hai nơi dùng mà cả hai đều mới và chưa từng thay đổi độc lập lần nào: chưa biết trục nào sẽ thay đổi thật. Tách lúc này là đoán trục, và đoán sai trục tốn hơn trùng lặp nhiều lần (D9.3).
- Nhu cầu "sau này chắc sẽ cần ở nhiều nơi" không phải bằng chứng. Bằng chứng duy nhất được chấp nhận là: nơi dùng thứ hai/thứ ba đã tồn tại trong code, hoặc một kế hoạch đã chốt thành văn bản nêu tên nơi dùng tiếp theo (trường hợp Adapter ở D7.1 là ngoại lệ duy nhất, và nó cũng phải có văn bản).

### D9.2. Giống nhau tình cờ — cùng hình dạng, khác lý do thay đổi

Đây là điều kiện hủy quan trọng nhất, và là lỗi DRY kinh điển: hai đoạn code giống nhau **hôm nay** nhưng thuộc về hai khái niệm sẽ thay đổi vì hai lý do khác nhau **ngày mai**.

- Cách kiểm tra bắt buộc, hỏi thành tiếng cho từng ứng viên tách: "Nếu nghiệp vụ của nơi A đổi, nơi B có **buộc** phải đổi theo không?" Trả lời "không" hoặc "chưa chắc" thì đây là giống nhau tình cờ — MUST giữ riêng, dù chúng giống nhau tới từng dòng.
- Ví dụ điển hình trong plugin học liệu: validate "điểm phải từ 0 tới 10" ở form nhập điểm thủ công và ở hàm chấm tự động trông giống hệt nhau, nhưng một cái theo thang điểm nhà trường công bố, một cái theo thang nội bộ của thuật toán chấm. Gom chúng lại là tạo ra một lỗi chờ ngày xảy ra: đổi thang công bố sẽ âm thầm đổi cả thuật toán.
- Ví dụ ở giao diện: hai block cùng có setting "số mục hiển thị" với cùng control trượt — nhưng một cái giới hạn bởi bố cục, một cái giới hạn bởi giấy phép nội dung. Lý do đổi giới hạn khác nhau thì giữ hai định nghĩa riêng; phần duy nhất được dùng chung là component trượt thuần ở lớp control (D3.2), không phải định nghĩa setting (D3.1). **Tách theo lớp là cách giải quyết đúng cho trường hợp nửa giống nửa khác này: lớp nào cùng lý do thay đổi thì tách, lớp nào khác lý do thì giữ riêng.**

### D9.3. Trừu tượng sai trục — đã tách nhưng tách nhầm, và cách nhận ra

Một lần tách đã sai trục khi có từ hai dấu hiệu sau:

- Nơi dùng phải truyền vào ngày càng nhiều cờ và tham số để "uốn" bản dùng chung theo ý mình, tới mức lời gọi khó đọc hơn đoạn code gốc.
- Một thay đổi nghiệp vụ nhỏ ở một nơi dùng buộc phải sửa bản dùng chung **và** kiểm tra lại mọi nơi dùng còn lại, dù chúng không liên quan.
- Người đọc phải mở ba file trở lên mới hiểu được một hành vi đơn giản vốn trước đây đọc trong một file.
- Xuất hiện các tên vô nghĩa ở bản dùng chung: `data2`, `options`, `config`, `type` rẽ nhánh toàn bộ thân hàm — dấu hiệu bản dùng chung đang chứa hai khái niệm bị ép vào một.

Khi nhận ra tách sai trục: MUST NOT cố cứu bằng thêm tham số. Đường đúng là **gỡ tách có kiểm soát** theo D10 — tách bản dùng chung trở lại thành các bản riêng theo đúng trục thay đổi thật, giữ lại duy nhất lớp nào đã chứng minh được là dùng chung đúng (thường là lớp thấp nhất: validate hình dạng, render nguyên tử). Gỡ một trừu tượng sai là công việc kiến trúc bình thường, không phải thất bại phải giấu.

### D9.4. Các trường hợp giữ nguyên khác

- **Thứ sắp bị xóa hoặc sắp thay thế toàn bộ:** tính năng đang trong lộ trình gỡ bỏ hoặc viết lại đã chốt thì không tách, không refactor — chỉ sửa lỗi chặn. Đầu tư cấu trúc vào thứ sắp chết là lãng phí theo định nghĩa.
- **Code sinh ra (generated) và code của bên thứ ba đã đóng gói:** không DRY hóa bằng tay; muốn thay đổi thì thay ở nguồn sinh hoặc qua lớp biên ở D7.
- **Bản sao là bản dự phòng có chủ đích:** ví dụ một đường render tối giản dùng khi đường chính lỗi, hoặc một bản kiểm tra độc lập đối chiếu kết quả của bản chính (chấm lại ở server đối chiếu chấm ở client). Tính độc lập của chúng là giá trị của chúng — gom lại là phá mất giá trị đó. Trường hợp này phải có comment ghi rõ tính độc lập là có chủ đích, để lần quét trigger sau không "sửa" nhầm.

## D10. Quy trình khi một trigger nổ — refactor 7 bước, không bước nào được nhảy

Tách code là thay đổi có rủi ro ngang thay đổi dữ liệu: nó chạm vào nhiều nơi cùng lúc và lỗi của nó thường im lặng. Mọi lần tách theo Phần D đều đi đủ bảy bước sau, theo đúng thứ tự.

1. **Chụp lại hành vi hiện tại.** Trước khi đụng vào, ghi lại hành vi của mọi nơi dùng sắp bị chạm: giá trị mẫu đầu vào và kết quả đầu ra (markup, response, dữ liệu đã ghi), hoặc test hiện có bao phủ chúng. Không có bản chụp này thì sau bước 5 không có gì để đối chiếu, và "chắc là vẫn chạy" không phải đối chiếu.
2. **Đặt tên khái niệm và chủ sở hữu.** Khái niệm được tách tên là gì, sống ở file/class nào, ai (lớp nào) được sửa nó. Tên và nơi sống phải xong ở bước này, theo D11, trước khi viết code tách.
3. **Tách về một nơi, giữ nguyên hành vi.** Dời logic về nơi dùng chung, không kèm bất kỳ thay đổi hành vi, đổi tên biến hàng loạt hay "tiện thể sửa luôn" nào khác. Thay đổi hành vi đi trong commit/task riêng, sau khi lần tách đã được xác nhận là tương đương. Trộn tách cấu trúc với đổi hành vi trong cùng một lần sửa là cách nhanh nhất để không truy được lỗi thuộc về việc nào.
4. **Chuyển từng nơi dùng, mỗi lần một nơi.** Chuyển nơi dùng thứ nhất sang bản dùng chung, kiểm tra, rồi mới chuyển nơi tiếp theo. NEVER chuyển mọi nơi dùng trong một lần sửa lớn rồi kiểm tra một thể ở cuối.
5. **Đối chiếu với bản chụp ở bước 1.** Từng nơi dùng phải cho kết quả như trước, trừ lệch đã được ghi rõ là chủ đích. Lệch không ghi rõ là lỗi của lần tách.
6. **Xóa bản sao cũ thật sự.** Sau khi mọi nơi dùng đã chuyển, tìm lại toàn plugin theo khái niệm vừa tách và xóa mọi bản sao còn sót, kể cả bản sao trong comment, trong code đã tắt và trong test fixture. Để lại một bản sao "phòng khi cần" là giữ lại đúng căn bệnh vừa chữa.
7. **Ghi lại quyết định.** Trong mô tả công việc hoặc tài liệu nội bộ của plugin: trigger nào đã nổ (mã T ở D2), pattern đã áp (D8), điều kiện hủy nào ở D9 đã được kiểm tra và vì sao không áp dụng, và lợi ích + chi phí theo D1.3. Thiếu ghi chép này, người sau sẽ không phân biệt được bản dùng chung là hợp đồng hay là tình cờ.

Với trigger T14–T16 (file/class phình, nhiều lý do thay đổi): đường tách đi theo đường nối tự nhiên của dữ liệu, theo thứ tự ưu tiên — tách phần truy cập dữ liệu ra repository trước, tách kiểm tra quyền ra hàm quyền dùng chung, tách gọi API ngoài ra lớp biên, và phần còn lại mới là lõi nghiệp vụ. Không tách bằng cách cắt file ở giữa theo số dòng.

## D11. Đặt tên, nơi đặt code đã tách, và quyền sở hữu khái niệm

Một lần tách chỉ hoàn chỉnh khi người sau **tìm thấy** được bản dùng chung. Code dùng chung mà không ai tìm thấy sẽ bị viết lại lần nữa ở nơi khác — đó là cách một plugin kết thúc với ba bản "dùng chung" của cùng một khái niệm.

- **Nơi sống theo tầng, không theo tính năng đầu tiên:** code dùng chung sống ở tầng dùng chung của cấu trúc thư mục ở C1.1 (ví dụ `inc/shared/`, `inc/services/`, `src/shared/` cho JS), không sống trong thư mục của block/tính năng đầu tiên dùng nó. Tính năng ngang hàng không `require`/import lẫn nhau.
- **Tên theo khái niệm, có tiền tố, không có chữ vô nghĩa:** tên file, class, hàm và component đã tách mang tên khái niệm nó sở hữu (`color-setting`, `attempt-grader`, `link-control`), kèm prefix của plugin theo kỷ luật chung. Cấm các tên `common`, `utils`, `helpers`, `misc`, `shared-stuff` làm tên nơi chứa — một file tên `utils` là một file không có chủ sở hữu khái niệm, và nó sẽ thành bãi chứa mọi thứ. Nếu không đặt được tên khái niệm cho thứ sắp tách, đó là bằng chứng chưa hiểu trục của nó: dừng lại, quay về D9.
- **Một khái niệm, một chủ sở hữu:** mỗi khái niệm dùng chung (một setting, một luật chấm, một mã lỗi, một slug loại) có đúng một nơi được sửa. Nơi khác cần thay đổi khái niệm thì sửa qua chủ sở hữu đó, hoặc đề xuất đổi chủ sở hữu một cách tường minh — không sửa vòng qua bằng bản sao cục bộ "chỉ khác một chút". Khác một chút hôm nay là lệch hẳn sau ba lần sửa.
- **Đăng ký khám phá:** khi số đơn vị dùng chung vượt khoảng mười, plugin MUST có một danh mục ngắn (một mục trong tài liệu nội bộ của plugin, hoặc comment chỉ mục ở đầu thư mục dùng chung) liệt kê: tên khái niệm, nơi sống, trigger đã sinh ra nó. Danh mục này là thứ Agent đọc trước khi viết một helper mới, để kiểm tra khái niệm đó đã có chủ chưa. Viết helper mới mà chưa kiểm tra danh mục này là vi phạm quy trình ở 0.2 áp cho Phần D.
- Hằng số, slug, mã trạng thái và tên khóa (T17) sống cùng chủ sở hữu của khái niệm chúng thuộc về, không gom vào một file hằng toàn cục khổng lồ tách rời ngữ cảnh.

## D12. Ba ví dụ trọn gói — đi hết một trigger từ dấu hiệu tới gate

### D12.1. Ví dụ gốc: setting màu cho phần tử con lặp ở block thứ ba

**Dấu hiệu.** Block thẻ cảnh báo đã có setting màu cho icon theo A6.2 (hai attribute `iconColor`/`customIconColor`, một control `ColorGradientSettingsDropdown`, một validate màu ở PHP). Block trích dẫn thêm setting y hệt cho dấu ngoặc trang trí — lần 2: copy có chủ đích, ghi dấu nối ở cả hai nơi theo D1.1. Nay block thẻ thông tin cần màu cho biểu tượng trạng thái — lần 3, ở tính năng thứ ba.

**Quyết định.** Trigger T01 nổ, cộng T03 cho phần validate màu. Kiểm tra D9: hỏi "đổi cách chọn màu ở một block, các block kia có buộc đổi theo không?" — có, vì đây là cùng một trải nghiệm chọn màu và cùng một luật palette của theme (A6.5). Không phải giống nhau tình cờ. Tách.

**Cách tách, theo lớp (D3).** Lớp định nghĩa: ba `block.json` cùng khai báo hai attribute từng chữ như nhau theo mẫu A6.2 (không sinh động — D3.1). Lớp control: tách component `AcmeElementColorControl` theo hình dạng ở D3.2, ba nơi dùng chỉ còn phần nối `setAttributes`. Lớp validate: hàm validate màu ở PHP vốn đã là một (theo A6.6) — xác nhận không còn bản sao nào khác rồi thôi, không tách thừa. Lớp render: hàm biến slug/custom thành class/biến CSS vốn nằm trong `render.php` của block đầu tiên được dời về tầng dùng chung theo D3.5, hai block còn lại gọi chung.

**Kiểm tra sau tách.** Ba thao tác ở Recipe 3 (chọn preset, chọn tự do, xóa về mặc định) chạy lại trên cả ba block; nội dung đã lưu bằng hai block cũ mở lại không báo không hợp lệ; render một bài mẫu chứa cả ba block cho markup như bản chụp trước tách (bước 1 và 5 của D10).

### D12.2. Ví dụ: setting liên kết — tách nửa chừng mới là đúng

**Dấu hiệu.** Bốn block cùng cần setting liên kết: URL, mở tab mới, `rel`. Bề ngoài là T01 rất rõ.

**Quyết định sau khi kiểm tra D9.2.** Lớp control (ô URL + toggle mở tab mới + pattern ở A7.6): cùng lý do thay đổi — cách người dùng nhập liên kết trong Editor. Tách thành control dùng chung. Lớp định nghĩa: ba block lưu `url`/`opensInNewTab`/`rel` giống nhau, nhưng block thứ tư là block nút kêu gọi hành động, có thêm luật riêng về `rel` theo chính sách liên kết ngoài của site và một trường đích nội bộ thay cho URL tự do. Định nghĩa của block thứ tư giữ riêng; ba block còn lại thống nhất theo D3.1. Lớp render: cách sinh `rel` khi mở tab mới là luật an toàn chung — một hàm duy nhất cho cả bốn (T03, ngưỡng bảo mật).

**Bài học của ví dụ.** Trigger không bắt tách nguyên khối. Đơn vị tách là **lớp**, và mỗi lớp trả lời riêng câu hỏi lý do thay đổi ở D9.2. Tách nguyên khối ở ví dụ này sẽ hoặc ép block nút dùng định nghĩa thiếu trường của nó, hoặc ép control chung mang theo cờ rẽ nhánh của riêng block nút — cả hai đều là tách sai trục ở D9.3.

### D12.3. Ví dụ: cách chấm điểm — từ một loại tới Strategy

**Diễn biến theo thời gian.** Đợt 1 chỉ có câu hỏi trắc nghiệm: hàm chấm viết thẳng trong service nộp bài — lần 1, viết thẳng, đúng D1.1. Đợt 2 thêm câu hỏi điền số: trigger T08 nổ — gom điểm rẽ nhánh "loại nào" về một chỗ duy nhất trong service, đặt slug loại cho câu hỏi, ghi dấu tại điểm rẽ nhánh. Chưa tách class. Đợt 3 thêm câu hỏi sắp xếp thứ tự (dạng bài mind-map chỉ chấm ở mốc theo thiết kế của plugin): biến thể thứ ba — T09 nổ.

**Cách tách.** Strategy theo D5.2: một interface chấm nhỏ — nhận lần nộp và đáp án đã chuẩn bị, trả kết quả gồm điểm và chi tiết theo field — và một class cho mỗi loại. Service nộp bài chỉ giữ: kiểm tra quyền (hàm chung ở D4.2), tra slug loại, lấy đúng strategy, ghi kết quả qua repository. Đáp án và khóa chấm vẫn ở postmeta chỉ server đọc theo A5.2 và C6.7 — strategy nhận chúng ở phía server, không có đường nào cho chúng đi qua client.

**Điều kiện hủy đã kiểm tra.** Ba loại có thật sự cùng một interface không? Cả ba đều chấm một lần nộp thành một kết quả có điểm — đúng. Nếu đợt 3 là loại bài chỉ hiển thị, không chấm, nó đã không được ép vào interface này: nó thuộc nhóm khác, và ép vào sẽ sinh method để trống — dấu hiệu interface sai trục ở D5.2.

**Kiểm tra sau tách.** Thêm thử loại thứ tư bằng một class giả trong môi trường kiểm thử: nếu phải sửa service nộp bài ngoài việc đăng ký loại mới, lần tách chưa đạt và phải ghi rõ.

# Phần E — Hồ sơ bài học từ dự án thật: skvn-marine

Phần này là hồ sơ, không phải một bộ checklist thứ hai. Các bài học dưới đây được rút ra khi Agent chạy trên dự án thật `skvn-marine` (theme GeneratePress child và plugin Gutenberg blocks `skvn-marine-blocks`), từ file self-check trước commit do chủ dự án gửi ngày 2026-11-19. Văn bản luật có hiệu lực của từng bài học nằm tại mục chuyên môn tương ứng trong Phần A, để Agent chỉ phải đọc và chạy đúng một bản. Phần E giữ ba việc mà mục chuyên môn không giữ: nguồn gốc, phạm vi dự án, và cách trích dẫn cho đúng.

| Bài học của dự án | Luật có hiệu lực tại | Gate / recipe |
|---|---|---|
| Theme vs Plugin independence: block phải đúng khi chỉ cài plugin; theme là canvas cho mọi `.alignfull`, plugin sở hữu hộp và chrome của chính block đó | A9.1 | Phụ lục 1, Giao diện; Recipe 15 |
| Width / deploy check DP-12: phân biệt chưa deploy với CSS sai, đo bằng `getComputedStyle`, reset GP bleed nằm ở CSS plugin với specificity `(0,3,1)` | A9.2, A9.3 | Phụ lục 1, Giao diện; Recipe 15 |
| Atomic check cho attributes undefined: từng attribute một, ba test case mất attribute / có giá trị / giá trị không mong đợi; áp đặc biệt cho attribute optional không `default` (nhóm P2 của dự án: `actionGapPx`, `actionWidthPercent`) | A5.11 | Phụ lục 1, Giao diện; Recipe 15 |
| Pattern check: ternary có `else` explicit cho `undefined`, boolean toggle kiểm tra `!== false` / `=== true`, `SelectControl` có value fallback | A5.11 | Phụ lục 1, Giao diện; Recipe 15 |
| Pitfall DP-06 đã sửa root cause (ghi chú 2026-11-10): root cause đúng là tên component không tồn tại trong runtime `wp.components` (bản dist core WordPress 7.1 chỉ có tên dạng `__experimental*`), không phải attribute `undefined` như bản đầu quy nhầm | A5.11 | Thứ tự chẩn đoán ở A5.11 |
| Chiều ngang chrome Editor (2026-11-20): Slider thiếu class align nên canvas áp content width mặc định; Responsive Spacer ép `alignfull` cùng `max-width: none` và `margin-inline: 0` nên tràn cột Wide | A5.12 | Phụ lục 1, Giao diện; Recipe 15 |

Ba quy tắc khi dùng hồ sơ này:

- **Phạm vi:** các con số và selector của dự án (specificity `(0,3,1)`, selector `body:not(.no-sidebar) .entry-content .alignfull`, tên attribute nhóm P2, content width mặc định 760px của canvas Editor, `max-width: 1180px` của trang artifact, default `align` `full` của step-slider) là số đo của skvn-marine. Dự án khác lấy nguyên tắc — plugin tự đứng được, phân biệt trạng thái deploy trước khi kết luận code sai, kiểm tra từng attribute độc lập, kiểm chứng component trong runtime — và tự đo lại con số theo repo của mình.
- **Xung đột phải ghi rõ:** reset ở A9.3 là ngoại lệ hẹp của luật specificity ở A3, và A9.3 đã ghi phạm vi của ngoại lệ đó. Không mục nào của hồ sơ này lặng lẽ ghi đè luật chung.
- **Trích dẫn pitfall đã sửa:** khi nhắc DP-06, chỉ trích root cause đã đính chính tại A5.11 và mục DP-06 [CORRECTED] trong `.context/PITFALLS.md` của dự án. Bản quy nhầm ban đầu chỉ được nhắc như một lỗi chẩn đoán cần tránh, không bao giờ như nguyên nhân.

Đối chiếu trong dự án nguồn: GLOBAL A13, `docs/standards/css-layout-safety-contract.md`, pitfall DP-12 và DP-06 [CORRECTED].

Hồ sơ này lớn lên bằng một đường duy nhất: một lần digest PITFALL theo 0.5 mà kết quả là "chưa có luật" hoặc "có một phần" thì cộng một dòng vào bảng trên — mã pitfall, mục giữ luật có hiệu lực, gate hoặc recipe tương ứng — trong cùng lần sửa đã ghi luật vào mục chuyên môn. Kết quả "đã có luật" không cộng dòng mới, trừ khi pitfall đó là bằng chứng độc lập mà hồ sơ chưa từng ghi. Bài học của dự án khác không ghi vào bảng của skvn-marine; dự án đó mở phần hồ sơ riêng của nó theo cùng định dạng khi bài học đầu tiên của nó được duyệt.

# Phụ lục 1 — Cổng kiểm tra trước khi giao code

Agent tự chạy qua cổng này cho mọi thay đổi và báo lại mục nào chưa đạt thay vì giao im lặng.

## Giao diện

- [ ] Mọi control style chuẩn đã đi qua block supports trước khi có control tự chế; control tự chế nào cũng nêu được supports thiếu gì.
- [ ] Setting màu lưu slug preset tách khỏi giá trị custom, đọc palette của theme, có đường xóa về mặc định.
- [ ] `useBlockProps()` có ở cả `edit` và `save`; sửa `save` đã kèm `deprecated` tương ứng.
- [ ] UI kiểm tra ở 360px, 782px, 1024px, 1440px; dùng được bằng bàn phím; đạt tương phản AA; tôn trọng `prefers-reduced-motion` và RTL.
- [ ] Mọi vùng dữ liệu từ server có đủ bốn trạng thái: đang tải, rỗng, lỗi, có dữ liệu.
- [ ] Asset chỉ nạp ở trang/màn hình dùng nó, handle có prefix, nạp qua enqueue hoặc `block.json`.
- [ ] Độc lập theme–plugin (A9): block đã kiểm tra khi chỉ cài plugin; chrome của block nằm trong gói plugin; width canvas của theme và hộp của block ghi kết quả riêng.
- [ ] Deploy (A9.2): đã phân biệt đường build/deploy của plugin và của theme; selector thiếu trên live ghi là “chưa deploy”, không ghi “CSS sai”; kết luận width dựa trên `getComputedStyle`, không chỉ đọc file CSS.
- [ ] Atomic check (A5.11): mọi `attributes.X` đã đối chiếu `default` trong `block.json`; đã chạy ba test case mất attribute / có giá trị / giá trị không mong đợi; ternary có `else` tường minh, toggle dùng `!== false` hoặc `=== true` theo ý nghĩa đã ghi, `SelectControl` có value fallback.
- [ ] Component runtime (A5.11): mọi tên component từ `wp.components` đã kiểm chứng tồn tại trong bản phân phối ở môi trường đích trước khi quy lỗi cho attribute hoặc dữ liệu.
- [ ] Chrome Editor (A5.12): root có class căn lề khớp `align`; chrome bên trong rộng 100% root; không `max-width: none`, margin ngang âm, `100vw`, hoặc px lấy từ mockup.

## Cơ sở dữ liệu

- [ ] Nơi lưu dữ liệu đã qua cây quyết định B1 và điểm dừng được ghi lại.
- [ ] Meta/option có prefix, đăng ký bằng `register_*_meta()` khi cần REST/Editor, option nặng đặt không autoload.
- [ ] Bảng riêng có index bám theo truy vấn thật, `UNIQUE` cho bất biến nghiệp vụ, cột thời gian UTC.
- [ ] Schema có phiên bản riêng; migration idempotent, chạy được từ luồng nâng cấp chứ không chỉ khi kích hoạt, và chạy hai lần cho cùng kết quả.
- [ ] Mọi SQL qua repository, có `prepare`/hàm ghi của `$wpdb`, không truy vấn không giới hạn và không N+1.
- [ ] `uninstall.php`, exporter/eraser riêng tư và hành vi multisite đã được quyết định và ghi rõ.

## Backend và API

- [ ] Mọi thao tác ghi có capability check và nonce/`permission_callback`; không endpoint nào thiếu `permission_callback`.
- [ ] Mọi tham số REST khai báo trong `args` với validate và sanitize; response lỗi dùng `WP_Error` kèm mã HTTP đúng; danh sách có phân trang và header tổng.
- [ ] Dữ liệu nhạy cảm không xuất hiện trong REST context công khai, trong JS phía client, trong log và trong block attribute.
- [ ] Việc nặng và việc gọi API ngoài chậm đã ra nền (Action Scheduler/WP-Cron), job idempotent và có trạng thái nhìn thấy được.
- [ ] PHPCS, PHPStan, lint JS và test liên quan đều xanh; changelog ghi rõ thay đổi DB và thay đổi phá vỡ tương thích nếu có.

## Design Pattern (Phần D)

- [ ] Code sắp giao đã quét qua bảng trigger D2: trigger nào khớp đã ghi mã T, trigger nào không khớp không cần khai.
- [ ] Mọi thứ xuất hiện lần thứ nhất được viết thẳng, không abstraction đầu cơ; mọi bản sao lần thứ hai đều có dấu nối ghi nơi tương tự còn lại.
- [ ] Mọi lần tách đều nêu được lợi ích bằng một thay đổi cụ thể và chi phí bằng số lớp mới thêm (D1.3); không dùng "linh hoạt hơn / sạch hơn" làm lý do.
- [ ] Trước khi tách đã kiểm tra bốn điều kiện hủy ở D9 và ghi kết quả; tách theo từng lớp (định nghĩa / control / validate / render), không tách nguyên khối khi các lớp khác lý do thay đổi.
- [ ] Lần tách đi đủ 7 bước ở D10: có bản chụp hành vi trước, chuyển từng nơi dùng một, đối chiếu sau, xóa sạch bản sao cũ, ghi lại quyết định.
- [ ] Bản dùng chung có tên theo khái niệm, sống ở tầng dùng chung, có một chủ sở hữu duy nhất, và tìm thấy được qua danh mục ở D11 — không file `utils`/`helpers` vô danh.
- [ ] Biến thể: điểm rẽ nhánh chỉ có một (T08) hoặc đã tách Strategy/Registry khi tới biến thể thứ ba (T09); thêm biến thể mới không phải sửa nơi gọi.
- [ ] Không Singleton tự chế, không kế thừa sâu quá một cấp cho class nghiệp vụ, không event bus tự chế thay hook.

## Bài học dự án skvn-marine (luật tại A5.11, A5.12 và A9, hồ sơ tại Phần E)

- [ ] Block đã kiểm tra ở trạng thái chỉ cài plugin và qua DP-12 theo A9; gate atomic check và component runtime nằm trong danh sách Giao diện ở trên theo A5.11.
- [ ] Recipe 15 đã chạy đủ năm bước trước commit.

## Digest PITFALL (mục 0.5)

- [ ] Chỉ digest đúng pitfall được nêu trong yêu cầu; không digest lan sang pitfall khác và không sửa file pitfall gốc khi chưa được yêu cầu riêng.
- [ ] Bản digest đủ trường theo mẫu ở 0.5.2: triệu chứng, tái hiện, root cause đã kiểm chứng, bản đính chính nếu có, số đo riêng tách khỏi nguyên tắc, nhãn bằng chứng cho từng phần.
- [ ] Pitfall có bản đính chính thì root cause lấy từ bản [CORRECTED]; bản quy nhầm ban đầu chỉ xuất hiện như lỗi chẩn đoán cần tránh.
- [ ] Research đủ ba vòng có trích nguồn: convention này (ghi từ khóa đã tìm và mục gần nhất), tài liệu gốc của WordPress hoặc kiểm chứng ở runtime đích, và luật/checklist đã có trong chính dự án nguồn.
- [ ] Quyết định ghi đúng một trong ba kết quả ở 0.5.3; kết luận "chưa có luật" ghi rõ đã tìm ở đâu và mục gần nhất khác ở điểm nào.
- [ ] Nếu tạo luật mới: luật nằm ở đúng một mục chuyên môn theo định dạng MUST / SHOULD / NEVER kèm cách kiểm tra, hồ sơ nguồn gốc đã ghi ở phần hồ sơ dự án, và luật đã nối vào chỉ mục đọc, gate, anti-pattern và recipe liên quan trong cùng lần sửa.
- [ ] Số đo riêng của dự án không nằm trong văn bản luật chung; xung đột với luật hiện có, nếu có, đã ghi phạm vi ngoại lệ ngay tại mục giữ luật.

# Phụ lục 2 — Bảng anti-pattern bị cấm gặp là phải sửa

| Anti-pattern | Vì sao hỏng | Cách đúng |
|---|---|---|
| Tự vẽ `ColorPalette` cho màu nền/màu chữ của block | Lệch UI core, không tôn trọng Global Styles, lưu sai định dạng | `supports.color`, xem A6.1 |
| Lưu hex và slug lẫn trong một attribute | Không migrate được, CSS lúc có lúc không | Hai attribute tách bạch, xem A6.2 |
| Đổi hàm `save` không thêm `deprecated` | Toàn bộ nội dung cũ báo không hợp lệ | Giữ bản cũ trong `deprecated` kèm `migrate` |
| Tạo custom table cho dữ liệu vài trăm dòng có vòng đời bài viết | Mất miễn phí admin, REST, revisions; thêm nợ migration | CPT + postmeta, xem B1 |
| Chỉ tạo bảng trong `register_activation_hook` | Cập nhật plugin làm vỡ site đang chạy | Kiểm tra phiên bản schema mỗi lần tải, xem B4.2 |
| Nối chuỗi biến vào SQL | SQL injection | `$wpdb->prepare()` và ép kiểu tại biên |
| Option lớn để autoload mặc định | Làm chậm mọi request của toàn site | `autoload: false`, xem B8 |
| REST route thiếu `permission_callback` | Lộ dữ liệu hoặc bị core cảnh báo | Khai báo luôn, công khai thì `__return_true` có chủ đích |
| Kiểm tra "đã đăng nhập" thay cho capability | Người dùng cấp thấp ghi được dữ liệu không thuộc quyền | `current_user_can()` gắn với đối tượng |
| Lưu đáp án/bí mật trong block attribute | Lộ qua markup và REST cho người chỉ có quyền đọc | Postmeta chỉ server đọc hoặc bảng riêng, xem A5.2 |
| Xử lý webhook lâu trong request, không chống trùng | Nhà cung cấp gửi lại, dữ liệu nhân đôi | Trả 200 nhanh, xử lý nền, khóa ID sự kiện |
| Nạp toàn bộ asset ở mọi trang | Chậm site, tăng xung đột | Enqueue có điều kiện theo trang/màn hình/block |
| Dựng helper/component/Factory "để sau này dùng lại" cho một nơi dùng duy nhất | Trừu tượng đầu cơ, đoán sai trục, người đọc phải nhảy lớp vô ích | Viết thẳng lần 1, ghi dấu lần 2, tách ở lần 3 — xem D1.1 |
| Copy lần thứ ba một setting/validate/query mà không quyết định | Ba bản sao lệch nhau theo thời gian; bản lệch ở bảo mật thành lỗ hổng | Trigger T01/T03/T05 ở D2: tách, hoặc ghi lý do không tách theo D9 |
| DRY hóa hai đoạn chỉ giống nhau tình cờ | Đổi nghiệp vụ nơi này âm thầm đổi nơi kia | Kiểm tra lý do thay đổi ở D9.2; tách theo lớp, không tách nguyên khối |
| Component dùng chung phình props và cờ `mode` | Bản tách chứa hai khái niệm bị ép vào một, khó đọc hơn bản chưa tách | Ngưỡng props ở D3.2; tách lại hoặc gỡ tách theo D9.3 |
| Rẽ nhánh theo loại bằng `if` rải rác ở nhiều file | Thêm loại mới phải săn mọi điểm rẽ nhánh, sót một điểm là lỗi | Một điểm rẽ nhánh duy nhất (D5.1), rồi Strategy/Registry ở biến thể thứ ba (D5.2) |
| Gọi thẳng API của shell/LMS/bên thứ ba ngoài lớp adapter | Thay thế lớp đó phải sửa toàn plugin; khái niệm lạ lan khắp nơi | Mọi lời gọi qua adapter/lớp biên — xem D7 |
| File `utils.php` / `helpers.js` chứa mọi thứ không biết đặt đâu | Không chủ sở hữu khái niệm, không ai tìm thấy đúng bản dùng chung | Tên theo khái niệm, một chủ sở hữu — xem D11 |
| Để chrome hoặc width của block phụ thuộc vào `style.css` của theme đi kèm | Block gãy hoặc sai width ngay khi cài trên theme khác; lỗi bị quy nhầm cho plugin hoặc cho CSS | Chrome và reset bleed của block nằm trong gói plugin; theme chỉ sở hữu canvas chung — xem A9 |
| Thấy selector thiếu trên live liền kết luận “CSS sai” và sửa code local vốn đã đúng | Sửa vòng vòng một lỗi không tồn tại, bản đúng bị sửa thành bản sai | Đối chiếu CSS bytes và computed style trên live trước; thiếu selector là “chưa deploy” — xem A9.2 |
| Che overflow bằng `overflow-x: hidden/clip`, `100vw` hoặc lề âm toàn cục | Giấu nguyên nhân tràn, vỡ sticky/focus/cuộn ngang ở nơi khác | Sửa hộp gây tràn ở đúng chủ sở hữu theme/plugin — xem A9.3 |
| Truyền thẳng attribute có thể `undefined` vào ternary ngầm, truthy/falsy của toggle, hoặc `value` của `SelectControl` | `undefined`, `false` và giá trị ngoài danh sách cho ba hành vi khác nhau không kiểm soát được | `else` tường minh, `!== false`/`=== true` theo ý nghĩa, value fallback trong danh sách options — xem A5.11 |
| Quy lỗi Editor gãy cho attribute `undefined` khi chưa kiểm chứng tên component có tồn tại ở runtime đích | Sửa dữ liệu trong khi root cause là API không tồn tại — đúng lỗi DP-06 bản đầu đã mắc | Kiểm chứng component/API ở runtime đích trước, theo thứ tự chẩn đoán ở A5.11 |
| Chrome Editor thiếu class align, hoặc ép `max-width: none`, margin ngang âm, `100vw`, hay px của mockup | Block hẹp hơn canvas hoặc tràn khỏi cột cha | Class align trên root, chrome `width: 100%`, parent giữ max-width và margin — xem A5.12 |
| Tự chế event bus, query builder tổng quát, hoặc SDK nội bộ cho một nhà cung cấp | Trùng cơ chế gốc của WordPress, không ai ngoài tác giả biết nó tồn tại | Hook của WP (D5.4), `WP_Query`/repository (D4.1), lớp biên mỏng (D7.2) |
| Kết luận "CSS sai" khi selector chỉ thiếu trên live | Sửa code đúng thành code khác trong khi bản chất là chưa deploy | Đối chiếu CSS bytes và `getComputedStyle` trên live; ghi "chưa deploy" — xem A9.2 |
| Dùng `overflow-x: hidden`, `100vw` hoặc `-50vw` để che overflow | Giấu triệu chứng, phá layout ở ngữ cảnh khác, lỗi thật không bao giờ lộ ra | Tìm và sửa owner thật của width theo A9.1–A9.3 |
| Được yêu cầu digest PITFALL nhưng chỉ tóm tắt lại pitfall rồi dừng | Bản tóm tắt không trả lời được câu hỏi duy nhất có giá trị: convention đã có luật cho việc này chưa | Chạy đủ ba bước ở 0.5.2 và kết luận đúng một trong ba kết quả ở 0.5.3 |
| Tạo luật mới cho một pitfall mà chưa research đối chiếu convention hiện có | Sinh luật trùng hoặc luật song song cho cùng một nguyên tắc; hai bản lệch nhau theo thời gian | Research ba vòng ở 0.5.2 trước; đã có thì trỏ về mục cũ, thiếu một phần thì mở rộng tại chỗ — xem 0.5.3 |
| Nâng pitfall một lần, root cause chưa kiểm chứng, hoặc số đo riêng của một dự án thành luật chung | Luật chung khóa mọi dự án theo một sự cố chưa chắc đúng, hoặc theo con số chỉ đúng ở dự án nguồn | Ba điều kiện ở 0.5.4: kiểm chứng trước, tách số đo riêng ra, chưa có luật tương đương mới tạo |

# Phụ lục 3 — Mẫu yêu cầu đầu vào cho AI Agent khi giao tính năng mới

Khi giao một tính năng, điền đủ mẫu này thì Agent mới bắt đầu viết code. Thiếu mục nào, Agent phải hỏi lại thay vì tự đoán ở các mục có dấu *.

```text
Tính năng*:
Người dùng cuối và capability cần thiết*:
Dữ liệu: tạo mới / đọc / sửa / xóa — lưu ở đâu theo cây B1*:
UI: frontend / wp-admin / Editor — block nào, control nào là supports, control nào tự chế và vì sao:
API: REST route dự kiến, permission_callback, tham số chính:
Trùng lặp và biến thể: nhu cầu này đã xuất hiện ở đâu khác chưa (lần thứ mấy), có biến thể nào của cùng hành vi chưa, trigger nào ở D2 khớp:
Dữ liệu nhạy cảm liên quan (đáp án, cá nhân, thanh toán):
Hiệu năng: khối lượng dữ liệu dự kiến, truy vấn chính:
Tương thích: phiên bản WP/PHP tối thiểu, nội dung/schema cũ cần migrate:
Khi gỡ plugin: giữ dữ liệu hay xóa:
```

# Phụ lục 4 — Recipe: làm từng việc thường gặp theo từng bước

Mỗi recipe là một tuyến đọc đã đóng gói: làm theo bước, mở các mục recipe trỏ tới khi tới bước cần chúng, và dừng ở gate cuối recipe. Recipe không thay luật trong các mục nó trỏ tới — khi recipe và mục gốc khác nhau, mục gốc thắng và recipe phải được sửa.

## Recipe 1 — Tạo một block static mới

Đọc: A5.1–A5.4, A5.8–A5.9. File chạm: thư mục block mới (`block.json`, `index.js`, `edit`, `save`, `style.css`, `editor.css`), file đăng ký block.

1. Trả lời năm câu hỏi ở 0.2, đặc biệt: block này có cần dynamic không — mặc định là không (A5.7).
2. Viết `block.json` trước mọi code khác, đối chiếu A5.9: attribute có `source` cho nội dung nhìn thấy, không `source` cho cấu hình.
3. Khai báo supports theo ma trận A5.8, chỉ bật thứ block thật dùng, đặt `__experimentalDefaultControls` cho control quan trọng nhất.
4. Viết `edit` với `useBlockProps()`, nội dung sửa tại chỗ bằng `RichText` hoặc `InnerBlocks`, control tự chế chỉ cho thứ supports không có và đặt đúng vị trí theo A5.3.
5. Viết `save` với `useBlockProps.save()` khớp từng class và style mà `edit` sinh ra.
6. Kiểm tra ở Editor và frontend trên theme đang hỗ trợ: màu, khoảng cách và thứ tự khớp nhau; kiểm tra responsive theo A2.3. Block có chrome trong canvas thì chiều ngang theo A5.12.

Gate: Phụ lục 1 — Giao diện, cộng bước 5 của A5.10 áp dụng ngược — lưu bài bằng block này, sửa `save` thử trong đầu và tự hỏi bản deprecated sẽ trông thế nào.

## Recipe 2 — Tạo một block dynamic

Đọc: A5.7, A8.1, B1, C6 nếu cần route riêng. File chạm: `block.json` (có `render`), `render.php`, đăng ký block, service cung cấp dữ liệu.

1. Ghi rõ vì sao static không đủ: dữ liệu phải mới lúc xem, cá nhân hóa, hay lấy từ DB và API ngoài. Không ghi được thì quay về Recipe 1.
2. `save` trả `null`; dữ liệu động không lưu vào attribute, attribute chỉ giữ cấu hình truy vấn (ID, số lượng, chế độ).
3. Viết `render.php` như một template PHP thường: dữ liệu qua service đã validate, mọi giá trị xuất ra đều escape, không query thẳng trong file render.
4. Dựng bản xem trong Editor: render bằng JS khi làm được, `ServerSideRender` chỉ khi không làm được và kèm trạng thái tải (A5.7).
5. Kiểm tra khi dữ liệu rỗng, khi service lỗi và khi người xem không có quyền thấy dữ liệu — cả ba đều phải có hình dạng hiển thị tử tế.

Gate: Phụ lục 1 — Giao diện và Backend.

## Recipe 3 — Thêm một setting màu cho phần tử con

Đọc: A5.4, A5.5, A6.2–A6.6. File chạm: `block.json`, `edit`, CSS của block, render ở `save` hoặc PHP.

1. Xác nhận mức 1 của A6 không đủ: màu này không phải nền hoặc chữ của chính block. Ghi câu xác nhận đó vào mô tả công việc.
2. Khai báo hai attribute tách bạch theo A6.2, không mặc định nào là hex.
3. Dựng control theo mẫu A6.2, lấy palette và cờ chính sách màu từ settings của editor, xử lý đủ bốn tình huống theme ở A6.5.
4. Áp màu ra frontend theo A6.3 và A6.6: slug thành class preset hoặc biến CSS, custom qua validate màu ở cả JS và PHP.
5. Kiểm tra ba thao tác của người dùng: chọn preset, chọn màu tự do trên theme cho phép, và bấm xóa về mặc định. Cả ba phải cho kết quả lưu đúng attribute đã tách.

Gate: sáu lỗi bị chặn ở A6.4, đối chiếu từng lỗi một.

## Recipe 4 — Thêm một trang Settings cổ điển

Đọc: A4.1–A4.2, C5, C5.1, B8. File chạm: class admin, template trang, hàm đăng ký setting và sanitize.

1. Liệt kê mọi trường kèm loại của nó theo bảng C5.1 trước khi viết markup; mỗi loại đã có cặp validate và sanitize ở đó.
2. Đăng ký một option mảng duy nhất, một `sanitize_callback` xử lý từng khóa theo loại, giữ giá trị cũ cho khóa không gửi lên, báo lỗi đúng trường.
3. Dựng trang bằng markup của core: `form-table`, section có heading, `settings_fields()`, nút của core, notice của core.
4. Đặt capability cho trang và kiểm tra lại ở server khi lưu; trường bí mật theo luật riêng ở C5.
5. Kiểm tra ba lần lưu: dữ liệu đúng, một trường sai (giá trị cũ của trường khác còn nguyên, lỗi gắn đúng trường), và lưu bởi người dùng thiếu capability (bị từ chối).

Gate: Phụ lục 1 — Backend, mục Settings và bảo mật.

## Recipe 5 — Tạo một CPT kèm meta cho Editor và REST

Đọc: B1, B2, B10, C1. File chạm: đăng ký CPT và taxonomy, đăng ký meta, quyền và menu.

1. Đi qua cây B1 và ghi điểm dừng: vì sao là CPT, trường nào là meta, trường nào là taxonomy.
2. Đăng ký CPT theo B10.1, quyết định rõ `public`, `show_in_rest`, `supports` và slug rewrite như một hợp đồng URL.
3. Đăng ký từng meta theo B10.2: kiểu, `single`, `show_in_rest`, và quyết định riêng cho từng meta nhạy cảm.
4. Kiểm tra bằng người dùng cấp thấp thật: đọc CPT qua REST, thử đọc meta nhạy cảm qua REST, mở Editor và xác nhận chỉ field được phép mới hiện.
5. Quyết định hành vi khi xóa post cha cho dữ liệu liên quan, theo B3.3, và ghi vào spec.

Gate: Phụ lục 1 — DB, mục meta và đăng ký.

## Recipe 6 — Tạo một custom table kèm migration và repository

Đọc: B1, B3–B3.5, B4, B5–B5.1, B9, B11. File chạm: hàm schema, luồng nâng cấp, class repository, `uninstall.php`.

1. Ghi đúng điều kiện cứng ở B1 bước 5 cho phép tạo bảng. Không ghi được thì dừng, quay về Recipe 5.
2. Phân loại bảng theo B3.5 (sự kiện, tiến độ hay hàng đợi), rồi thiết kế schema theo B3.1, B3.4: liệt kê truy vấn chính trước, đặt index theo B3.2, đặt `UNIQUE` cho bất biến thật.
3. Viết schema đầy đủ ở một nơi duy nhất, tạo bằng `dbDelta()` đúng định dạng khắt khe ở B4.1.
4. Đặt phiên bản schema riêng, nối kiểm tra nâng cấp vào luồng tải thường, viết bước migration đầu tiên idempotent theo B4.2 và kiểm tra bằng cách chạy hai lần.
5. Viết repository theo hình B5.1 trước khi bất kỳ nơi nào khác chạm vào bảng.
6. Quyết định và viết: hành vi khi cha bị xóa (B3.3), retention (B11), exporter và eraser (B9), hành vi multisite (B9), và phần của `uninstall.php`.

Gate: Phụ lục 1 — DB, đầy đủ, không bỏ mục nào.

## Recipe 7 — Tạo một REST CRUD cho một resource

Đọc: C6.1–C6.4, C6.6–C6.7, C3. File chạm: class controller, đăng ký route, service và repository bên dưới.

1. Kiểm tra trước xem `show_in_rest` của CPT hoặc meta có sẵn đã đủ chưa (C6.1). Đủ thì dừng, không viết route riêng.
2. Khai báo schema của resource trước: field, kiểu, context, `readonly`. Field nhạy cảm xử lý theo C6.7.
3. Viết controller theo khung C6.6: route, `permission_callback` gắn đối tượng, `args` có validate và sanitize cho mọi tham số.
4. Callback chính chỉ gọi service bằng dữ liệu đã sạch; lỗi trả `WP_Error` có mã của plugin và `status` đúng; danh sách có phân trang và header tổng.
5. Viết test cho bốn người gọi: khách chưa đăng nhập, người dùng cấp thấp, người có quyền trên đối tượng khác, người có quyền đúng đối tượng. Bốn kết quả phải khác nhau đúng như thiết kế.

Gate: Phụ lục 1 — Backend, mục REST.

## Recipe 8 — Tạo một REST action có hậu quả thật (nộp bài, tính điểm, trừ lượt)

Đọc: Recipe 7 cộng C6.5, B3.2, C8, C10. File chạm: controller, service chấm hoặc xử lý, repository, job nền nếu có phần nặng.

1. Xác định hậu quả khi request chạy hai lần: vô hại, hay nhân đôi kết quả. Nhân đôi được thì phải có chốt chống trùng ở DB hoặc khóa idempotency trước khi viết tiếp.
2. Tách phần phải trả ngay (ghi nhận, trạng thái ban đầu) khỏi phần nặng (chấm chi tiết, gửi thông báo, tổng hợp) — phần nặng ra nền theo C8.
3. Đáp án và khóa chấm ở server đọc từ postmeta chỉ server hoặc bảng riêng, không qua client ở bất kỳ chiều nào (A5.2, C6.7).
4. Ghi log hành động theo C10 bằng ID và mã kết quả, không ghi đáp án hay payload nhạy cảm.
5. Kiểm tra: gửi trùng cùng một request hai lần liên tiếp, gửi khi thiếu quyền, gửi dữ liệu sai định dạng, và job nền chết giữa chừng rồi chạy lại.

Gate: Phụ lục 1 — Backend và DB, cộng năm kiểm tra ở bước 5.

## Recipe 9 — Thêm một job nền bằng Action Scheduler hoặc WP-Cron

Đọc: C8, B6, C10. File chạm: đăng ký lịch, hàm xử lý job, màn hình hoặc lệnh theo dõi trạng thái.

1. Ghi rõ việc này vì sao không nằm trong request: lâu, lặp, hay không cần kết quả ngay.
2. Chọn cơ chế theo C8: cần tin cậy và theo dõi thì Action Scheduler, việc nhẹ và trễ được thì WP-Cron.
3. Viết hàm xử lý idempotent, theo lô có con trỏ, đánh dấu trạng thái từng bản ghi, thử lại có giới hạn kèm backoff.
4. Đăng ký và gỡ lịch đúng vòng đời: lên lịch khi kích hoạt hoặc khi cần, gỡ ở deactivation, không nhân đôi lịch khi plugin tải lại.
5. Cho quản trị viên một nơi nhìn thấy job: trạng thái, lần chạy cuối, lỗi cuối. Job chết âm thầm là trạng thái không được chấp nhận.

Gate: Phụ lục 1 — Backend, mục việc nền.

## Recipe 10 — Nhận một webhook từ dịch vụ ngoài

Đọc: C9.2, B3.2, C8, C10. File chạm: route nhận webhook, hàm xác thực chữ ký, job xử lý, bảng hoặc option lưu khóa sự kiện.

1. Đọc tài liệu của nhà cung cấp về cách ký payload và lấy đúng bí mật dùng chung vào cấu hình, không vào code.
2. Viết route công khai có chủ đích, xác thực chữ ký bằng `hash_equals()` trước khi đọc bất kỳ trường nghiệp vụ nào. Sai chữ ký thì từ chối và log ở mức tối thiểu.
3. Lưu khóa sự kiện kèm ràng buộc `UNIQUE`, ghi nhận payload tối thiểu, trả 200 ngay.
4. Xử lý thật trong job nền, idempotent theo khóa sự kiện.
5. Kiểm tra: payload sai chữ ký, cùng một sự kiện gửi hai lần, payload đúng nhưng dữ liệu nghiệp vụ sai, và nhà cung cấp gửi lại sau khi job đầu lỗi.

Gate: Phụ lục 1 — Backend, mục webhook ở Phụ lục 2 đối chiếu thêm.

## Recipe 11 — Dựng một màn hình danh sách trong admin

Đọc: A4.3–A4.4, A8.2, C6.4. File chạm: màn hình admin, route danh sách, component hoặc class list table.

1. Chọn cơ chế theo A4.4: server-render thì `WP_List_Table`, tương tác tại chỗ thì DataViews. Ghi lý do chọn.
2. Dựng route danh sách trước, có phân trang ở server, sắp xếp theo danh sách cột cho phép, và tổng thật cho phân trang.
3. Dựng đủ bốn trạng thái ở A8.2 cho danh sách: đang tải, rỗng, lỗi, có dữ liệu.
4. Hành động hàng loạt và hành động phá hủy: nonce hoặc `permission_callback` theo cơ chế đã chọn, xác nhận trước khi xóa, kiểm tra quyền theo từng đối tượng.
5. Kiểm tra ở 782px và trên bàn phím: lọc, sắp xếp, chuyển trang và chọn hàng đều làm được không cần chuột.

Gate: Phụ lục 1 — Giao diện và Backend.

## Recipe 12 — Sửa một block, hook hoặc route đã phát hành mà không làm vỡ site đang chạy

Đọc: A5.10 nếu là block, C12 cho mọi trường hợp, B4 nếu chạm dữ liệu. File chạm: tùy đối tượng sửa, cộng changelog.

1. Phân loại thay đổi theo C12: cộng thêm, đổi mặc định, hay phá vỡ. Phá vỡ thì làm đủ ba bước của C12, không rút gọn.
2. Với block: đi trọn quy trình A5.10, gồm kiểm thử bằng nội dung thật của đời cũ.
3. Với hook hoặc route: giữ đường cũ chạy song song, phát cảnh báo ngừng hỗ trợ đúng cơ chế, và ghi bản phát hành sẽ gỡ đường cũ.
4. Với dữ liệu: viết migration idempotent theo B4.2 và kiểm tra chạy hai lần trên bản sao dữ liệu.
5. Ghi changelog đủ ba mục: thay đổi gì, ai bị ảnh hưởng, đường chuyển đổi là gì.

Gate: Phụ lục 1 — các phần liên quan trong bốn phần, cộng C11 cho khâu phát hành.

## Recipe 13 — Tách một setting hoặc một logic đã lặp lần thứ ba thành bản dùng chung

Đọc: D1, D2, D9 trước mọi bước; rồi D3 nếu là setting/control, D4 nếu là backend. File chạm: nơi sống mới ở tầng dùng chung (D11), mọi nơi dùng cũ, danh mục dùng chung nếu có.

1. Xác nhận trigger bằng số đếm thật: liệt kê đủ các nơi dùng hiện có kèm file của chúng. Không liệt kê được từ 3 nơi khác nhau (hoặc 2 nơi với nhóm ngưỡng-2 ở D1.2) thì dừng — chưa phải recipe này.
2. Kiểm tra bốn điều kiện hủy ở D9, đặc biệt câu hỏi lý do thay đổi ở D9.2 cho từng lớp sắp tách: định nghĩa, control, validate, render tách riêng từng lớp.
3. Chụp hành vi hiện tại của mọi nơi dùng theo bước 1 của D10, và đặt tên khái niệm + chủ sở hữu + nơi sống mới theo D11.
4. Tách về nơi mới giữ nguyên hành vi, chuyển từng nơi dùng một theo bước 3–5 của D10, đối chiếu với bản chụp sau mỗi nơi.
5. Xóa mọi bản sao cũ, bỏ các dấu nối "lần 2" đã hết tác dụng, và cập nhật danh mục dùng chung ở D11.

Gate: Phụ lục 1 — Design Pattern, đầy đủ; cộng gate của lớp bị chạm (setting màu thì cộng A6.4).

## Recipe 14 — Thêm một biến thể hành vi mới (loại mới, shell mới, cách chấm mới)

Đọc: D5, D8, D9.1. File chạm: điểm rẽ nhánh hiện có hoặc strategy/registry, đơn vị biến thể mới, đăng ký loại ở D11.

1. Đếm biến thể hiện có. Đây là biến thể thứ nhất: viết thẳng, không cơ chế. Thứ hai: đi bước 2. Thứ ba trở đi: đi bước 3.
2. Biến thể thứ hai: gom quyết định loại về một điểm rẽ nhánh duy nhất, đặt slug loại và lưu slug cùng dữ liệu, ghi dấu tại điểm rẽ nhánh theo D5.1. Không dựng interface/class riêng ở bước này.
3. Biến thể thứ ba: tách Strategy hoặc Registry theo D5.2 trước khi thêm biến thể mới — chuyển hai biến thể cũ vào hình dạng mới, đối chiếu hành vi, rồi mới thêm biến thể thứ ba như một đơn vị độc lập.
4. Kiểm tra interface: mọi biến thể đều thực thi được mọi method mà không để trống hay trả giá trị giả. Có method bị để trống là dừng và thu hẹp interface theo D5.2.
5. Kiểm tra bằng biến thể giả: thêm một đăng ký giả trong môi trường kiểm thử và xác nhận nơi gọi không phải sửa gì ngoài đăng ký.

Gate: Phụ lục 1 — Design Pattern, mục biến thể; cộng Phụ lục 1 — Backend nếu biến thể chạm REST hoặc dữ liệu đã lưu.

## Recipe 15 — Self-check trước commit cho một block plugin (độc lập theme, width/deploy, attribute)

Đọc: A5.11, A5.12, A9, A3. File chạm: không sửa file nào ở bước kiểm tra; chỉ sửa khi một mục kiểm tra thất bại và mục đó chỉ rõ file phải sửa. Recipe này rút ra từ self-check trước commit của dự án skvn-marine.

1. Kiểm tra độc lập: tắt hoặc đổi theme đi kèm, để lại chỉ plugin, mở trang có block. Chrome của block và width của hộp block phải đúng. Ghi kết quả tách khỏi kết quả trên theme đi kèm (A9.1).
2. Kiểm tra deploy: build và đóng gói plugin theo đường của plugin; nếu đối chiếu live, lấy CSS bytes thật và `getComputedStyle` trên live. Selector thiếu trên live ghi “chưa deploy”, dừng ở đó, không sửa CSS (A9.2).
3. Kiểm tra width: xác nhận reset bleed `alignfull` nằm trong CSS plugin ở đặc hiệu đã đo (A9.3), và trang không có `overflow-x: hidden/clip`, `100vw` hay lề âm dùng để che tràn.
4. Chạy atomic check ở A5.11: đối chiếu `default` cho mọi `attributes.X`, rồi ba test case mất attribute, có giá trị, giá trị không mong đợi.
5. Chạy pattern check ở A5.11: ternary có `else` tường minh, toggle theo `!== false` hoặc `=== true` đúng ý nghĩa đã ghi, `SelectControl` có value fallback; và kiểm chứng mọi tên component `wp.components` tồn tại ở runtime đích.
6. Khi diff chạm CSS editor hoặc class căn lề của root editor: đo theo A5.12. Root có class khớp `align`. Chrome rộng 100% root. Không `max-width: none`, margin ngang âm, `100vw`, hoặc px lấy từ mockup.

Gate: Phụ lục 1 — Giao diện, gồm các mục bổ sung về độc lập theme–plugin, deploy, atomic check, component runtime và chrome Editor.

## Recipe 16 — Digest một PITFALL theo yêu cầu

Đọc: 0.5 trọn mục, Phần E. File chạm: không file nào ở bước digest và research; chỉ sửa convention ở bước tạo luật khi kết quả cho phép, cộng hồ sơ dự án và các nơi nối chỉ mục/gate/anti-pattern/recipe mà 0.5.5 liệt kê.

1. Xác nhận kích hoạt: yêu cầu nêu pitfall nào, ở nguồn nào. Ngoài pitfall đó ra không digest thêm; không thấy bản đính chính của một pitfall từng có dấu hiệu đã sửa thì ghi "chưa biết" và tìm tiếp trước khi kết luận root cause.
2. Viết bản digest theo mẫu ở 0.5.2: đủ trường, root cause lấy từ bản [CORRECTED] nếu có, số đo riêng tách khỏi nguyên tắc ứng viên, nhãn bằng chứng gắn cho root cause và cho nguyên tắc.
3. Research ba vòng theo 0.5.2: tìm trong convention này theo nhiều từ khóa và ghi mục gần nhất; đối chiếu tài liệu gốc của WordPress hoặc kiểm chứng ở runtime đích; kiểm tra luật, checklist, hợp đồng đã có trong chính dự án nguồn. Mọi vòng đều có trích nguồn hoặc ghi rõ cách đã tìm.
4. Quyết định theo 0.5.3: đã có luật thì dừng ở báo cáo kèm số mục; có một phần thì mở rộng mục đó tại chỗ; chưa có luật thì đối chiếu ba điều kiện ở 0.5.4 trước khi viết bất kỳ dòng luật nào.
5. Nếu tạo luật: ghi vào đúng một mục chuyên môn của Phần A, B, C hoặc D, ghi hồ sơ một dòng ở phần hồ sơ của dự án nguồn, và nối vào bảng định tuyến hoặc bảng tín hiệu, gate ở Phụ lục 1, anti-pattern ở Phụ lục 2 và recipe liên quan — tất cả trong cùng lần sửa. Đang làm trong một dự án thì dừng ở đề xuất chờ duyệt theo 0.5.5.
6. Giao đủ năm sản phẩm ở 0.5.6, gồm khối "Đã đọc".

Gate: Phụ lục 1 — Digest PITFALL, đầy đủ, không bỏ mục nào.

# Phụ lục 5 — Bảng quyết định nhanh và thuật ngữ

## Bảng quyết định nhanh

| Phân vân | Quyết định mặc định | Khi nào đảo ngược |
|---|---|---|
| Supports hay control tay | Supports (A5.4) | Supports thiếu đúng phần tử con hoặc hành vi cần, ghi rõ thiếu gì |
| Static hay dynamic block | Static (A5.7) | Dữ liệu phải mới lúc xem hoặc cá nhân hóa |
| InnerBlocks hay attribute array | InnerBlocks cho nội dung trình bày (A7.4) | Danh sách phẳng, ngắn, không style riêng từng mục |
| CPT hay custom table | CPT (B1) | Thỏa một điều kiện cứng ở B1 bước 5, ghi rõ điều kiện |
| Option hay bảng riêng | Option cho cấu hình ít và nhẹ (B8) | Nhiều dòng mỗi đối tượng và cần lọc, sắp xếp |
| REST hay AJAX | REST (A8.1, C7) | Màn hình cổ điển không React và chi phí REST không tương xứng, ghi lý do |
| WP-Cron hay Action Scheduler | Action Scheduler khi cần tin cậy (C8) | Việc nhẹ, ít, trễ được và không cần theo dõi |
| Lưu slug hay lưu hex | Slug (A6) | Giá trị tự do ngoài palette, và khi đó lưu ở attribute `custom*` riêng |
| Lưu ID hay lưu cả object/URL | ID (A7.3, A7.6) | Không bao giờ cho dữ liệu WordPress quản lý; URL chỉ là bản suy ra |
| Xóa dữ liệu khi gỡ hay giữ | Giữ, trừ khi có công tắc xóa rõ ràng (B9) | Chính sách plugin đã công bố là xóa, hoặc chủ site bật công tắc |
| Tăng phiên bản REST hay sửa tại chỗ | Sửa tại chỗ cho thay đổi cộng thêm (C6.1) | Đổi kiểu, bỏ field, đổi ý nghĩa: tăng phiên bản |
| Cảnh báo hay chặn khi tương phản thấp | Cảnh báo, không chặn (A6.3) | Không đảo ngược cho chữ thật; phần tử trang trí phải `aria-hidden` |
| Tách dùng chung hay viết thẳng / copy | Viết thẳng lần 1, copy có ghi dấu lần 2, tách lần 3 (D1.1) | Ngưỡng 2 cho bảo mật/tiền/điểm (D1.2); không tách khi giống nhau tình cờ (D9.2) |
| Tách nguyên khối setting hay tách theo lớp | Tách theo lớp: định nghĩa, control, validate, render quyết định riêng (D3, D12.2) | Chỉ tách nguyên khối khi cả bốn lớp cùng một lý do thay đổi |
| `if` theo loại hay Strategy/Registry | Một điểm `if` duy nhất ở biến thể thứ hai (D5.1) | Biến thể thứ ba hoặc nhánh thứ ba: Strategy/Registry (D5.2) |
| Dựng Factory hay dùng thẳng `new` | Dùng thẳng `new` / hàm tạo nhỏ | Chỉ dựng Factory khi đủ cả ba điều kiện ở D5.3 |
| Kế thừa hay composition | Composition ở mọi tầng (D6) | Kế thừa tối đa một cấp và phải ghi lý do; quá một cấp là xem lại theo D6 |
| Adapter ngay từ đầu hay chờ lặp | Chờ trigger như mọi pattern khác | Dựng ngay chỉ khi việc thay thế đã chốt thành văn bản có giai đoạn (D7.1) |
| Block đúng trên site có theme đi kèm, vậy đã độc lập chưa | Chưa — phải kiểm tra khi chỉ cài plugin (A9.1) | Chỉ kết luận độc lập khi chrome và width của block đều đúng mà không có CSS của theme |
| Selector có ở local, không có trên live | Ghi “chưa deploy” (A9.2) | Chỉ ghi “CSS sai” khi selector đã có trong CSS bytes trên live mà computed style vẫn sai |
| Cứu trừu tượng phình props bằng thêm tham số hay gỡ tách | Gỡ tách có kiểm soát theo D9.3 và D10 | Chỉ giữ lại lớp thấp nhất đã chứng minh dùng chung đúng (validate hình dạng, render nguyên tử) |
| Pitfall này đã có luật chưa, có tạo luật mới không | Chưa kết luận gì cho tới khi research đủ ba vòng ở 0.5.2; mặc định là tìm luật cũ trước, tạo mới sau | Chỉ tạo luật mới khi rơi vào kết quả "chưa có luật" ở 0.5.3 và thỏa cả ba điều kiện ở 0.5.4 |
| Nguyên tắc của pitfall giữ ở dự án hay lên convention chung | Giữ ở dự án khi nguyên tắc không đứng được nếu bỏ số đo riêng của dự án ra | Lên convention chung khi nguyên tắc đứng độc lập, root cause đã kiểm chứng và chưa có luật tương đương (0.5.4) |

## Thuật ngữ dùng trong tài liệu này

- **Supports:** cơ chế khai báo trong `block.json` để core sinh control, attribute, class và CSS cho các tính năng trình bày chuẩn của block.
- **Slug:** định danh dạng chữ thường có gạch nối của một preset (màu, cỡ chữ, khoảng cách) do theme cung cấp qua `theme.json`.
- **Preset:** giá trị trình bày có tên do theme định nghĩa, được tham chiếu bằng slug và sinh ra biến CSS `--wp--preset--*`.
- **Deprecated (block):** bản định nghĩa cũ được giữ trong mảng `deprecated` để Editor nhận ra, giữ và migrate nội dung đã lưu bằng đời block đó.
- **Idempotent:** chạy một lần hay nhiều lần liên tiếp cho cùng một kết quả cuối, không lỗi và không nhân đôi dữ liệu. Áp cho migration, job nền và webhook.
- **Repository:** lớp code duy nhất được chạm vào một bảng riêng hoặc một nguồn dữ liệu, để validate, `prepare` và giới hạn truy vấn nằm ở một nơi.
- **Permission callback:** hàm quyết định ai được gọi một REST route, kiểm tra capability gắn với đối tượng cụ thể, không chỉ trạng thái đăng nhập.
- **Late escaping:** escape dữ liệu tại đúng điểm xuất ra theo ngữ cảnh xuất, thay vì escape sớm rồi lưu vào biến trung gian.
- **Gate:** checklist ở Phụ lục 1 và ở cuối mỗi recipe; chưa qua gate thì công việc chưa xong, dù code đã chạy.
- **Trigger:** một dấu hiệu đếm được (số lần lặp, số biến thể, số nơi phải sửa) kèm ngưỡng; chạm ngưỡng thì quyết định kiến trúc tương ứng là bắt buộc, không phải gợi ý. Bảng trigger của tài liệu này là D2, mã T01–T18.
- **Rule of Three:** lần xuất hiện thứ nhất viết thẳng, thứ hai copy có chủ đích và ghi dấu, thứ ba bắt buộc quyết định tách hay không tách kèm lý do — luật gốc của DRY trong tài liệu này (D1.1).
- **WET (Write Everything Twice):** chấp nhận trùng lặp có kiểm soát ở lần xuất hiện thứ hai, vì chưa đủ bằng chứng về trục thay đổi để tách đúng.
- **Giống nhau tình cờ:** hai đoạn code có hình dạng giống nhau nhưng thay đổi vì hai lý do nghiệp vụ khác nhau; DRY hóa chúng là lỗi, xem D9.2.
- **Trừu tượng sai trục:** một bản dùng chung được tách theo trục không phải trục thay đổi thật, nhận ra bằng props/cờ phình ra và thay đổi nhỏ buộc phải sửa mọi nơi dùng — xem D9.3.
- **Chủ sở hữu khái niệm:** lớp/file duy nhất được sửa một khái niệm dùng chung (một setting, một luật, một mã lỗi); xem D11.
- **Digest PITFALL:** quy trình ở 0.5, chỉ chạy khi được yêu cầu: ghi lại pitfall đúng như nó đã xảy ra kèm nhãn bằng chứng, research đối chiếu convention này, tài liệu gốc và dự án nguồn, rồi quyết định theo đúng ba kết quả — đã có luật, có một phần, chưa có luật. Digest không phải là tóm tắt, và không phải là chép pitfall thành luật.

# Nguồn tham khảo

Các nguồn dưới đây là nền của tài liệu. Khi một luật trong tài liệu này và tài liệu gốc của WordPress khác nhau, tài liệu gốc của WordPress thắng và convention phải được sửa theo.

- [Best Practices — Plugin Handbook](https://developer--wordpress--org.proxy.hfzk.net.cn/plugins/plugin-basics/best-practices/) — tiền tố, tổ chức file, tránh xung đột tên.
- [Creating Tables with Plugins — Plugin Handbook](https://developer.wordpress.org/plugins/creating-tables-with-plugins/) — ưu tiên postmeta trước custom table, quy tắc định dạng của `dbDelta()`, luồng kích hoạt và nâng cấp.
- [The block in the Editor — Block Editor Handbook](https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-in-the-editor/) — `InspectorControls`, `BlockControls`, vị trí của control và việc dùng block supports thay cho giải pháp tự chế.
- [Blocks — Theme Handbook, Global Settings and Styles](https://developer.wordpress.org/themes/global-settings-and-styles/settings/blocks/) — cấu hình `theme.json` ở cấp block, palette riêng cho từng block.
- [Theme.json Version 3 Reference — Block Editor Handbook](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/) — đặc tả settings/styles, preset màu và biến CSS `--wp--preset--*`.
- [Adding Custom Endpoints — REST API Handbook](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/) — `register_rest_route()`, `permission_callback` bắt buộc, `args` validate/sanitize và controller pattern.
- [10up Engineering Best Practices — Structure](http://10up.github.io/Engineering-Best-Practices/structure/) — tổ chức thư mục theme/plugin và quản lý dependency bằng Composer/npm.
- [10up Engineering Best Practices — Markup](https://10up.github.io/Engineering-Best-Practices/markup/) — HTML ngữ nghĩa, progressive enhancement và kiểm thử accessibility.
- [10up Engineering Best Practices — PHP](https://10up.github.io/Engineering-Best-Practices/php/) — hiệu năng truy vấn, caching, namespacing và late escaping ở quy mô enterprise.
- Martin Fowler, *Refactoring* (2nd ed.) và mục "Rule of Three" trong hệ khái niệm refactoring — nguồn của luật lần 1 viết thẳng, lần 2 ghi nhận, lần 3 mới tách, và của kỷ luật refactor không đổi hành vi ở D10.
- Kent Beck và cộng sự, nguyên tắc DRY / YAGNI trong thực hành Extreme Programming — nền của D1: trùng lặp là triệu chứng cần đếm, trừu tượng đầu cơ là chi phí thật.
- Nguồn dự án (không công khai, tra trong repo của dự án): file self-check trước commit của skvn-marine do chủ dự án gửi 2026-11-19 — nguồn của A5.11, A9, Recipe 15 và hồ sơ Phần E; đối chiếu với GLOBAL A13, `docs/standards/css-layout-safety-contract.md`, pitfall DP-12 và mục DP-06 [CORRECTED] (đính chính 2026-11-10) trong `.context/PITFALLS.md` của dự án.
