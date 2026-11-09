# Header / Footer và Mega Menu — định hướng module Marine Blocks

Ngày tổng hợp: **2026-11-09**.

Trạng thái: **đã thống nhất định hướng, chưa promote thành execution plan**.

Thời điểm: **sau khi theme đã độc lập khỏi GeneratePress**; chưa gán SemVer, chưa bắt đầu implementation module mới.

## 1. Quyết định và lý do

Human quyết định dựng module header vì đường tích hợp prototype hiện tại còn nhiều bước rời rạc, khó dùng và khó bàn giao. Sau phản biện, định hướng được thống nhất: header/footer có thể được cung cấp qua Marine Blocks, có styling/runtime riêng và dùng được khi đổi theme; theme giữ trách nhiệm đặt chúng vào cấu trúc trang.

Module mới được dựng sau khi độc lập khỏi GeneratePress. Không suy thời điểm này thành lệnh start ở 2.0.0: roadmap hiện tại coi 2.0.0 là bắt đầu migration, 3.0.0 là gate hoàn tất standalone. Chưa tự gán version hoặc thay roadmap/current milestone.

Hiện site đang có hai header cùng tồn tại theo human report. Điều đó cho thấy hai đường render đang cùng hoạt động, chưa chứng minh GeneratePress không thể tắt header trong mọi cấu hình. Scope module tương lai không lấy việc sửa adapter GeneratePress làm prerequisite.

Giá trị cần đạt: thêm/chọn header → assets tự nạp → chỉnh nội dung trong Gutenberg → frontend hoạt động đầy đủ. Chuyển prototype vào một thư mục module nhưng vẫn yêu cầu tự ghép CSS/JS/cache không đáp ứng mục tiêu này.

## 2. Phản biện được giữ lại

- **Lỗi tích hợp có thật, nhưng mỗi lỗi cần có nguyên nhân riêng.** Prototype từng thiếu controller mobile trên site, gặp conflict CSS layer/theme và có CSS cache WindPress thiếu style ở response đầu. Module mới không tự giải quyết những lỗi đó nếu không sở hữu asset delivery và kiểm first load.
- **Module header khác full Header/Footer Builder.** Navigation, vị trí render và quản lý template/display rules là ba trách nhiệm khác nhau. Không tự mở toàn bộ builder chỉ để làm menu tốt hơn.
- **Tự làm navigation là nhận trách nhiệm bảo trì.** Desktop dropdown, keyboard, focus, Escape/outside click, drawer, scroll lock, resize và reduced motion cần kiểm riêng; giao diện đẹp không thay thế các acceptance này.
- **Editor phải dễ bàn giao.** Nếu phải nhớ class, sửa HTML hoặc giữ cấu trúc Group thủ công thì mục tiêu dùng nhanh chưa đạt. Khung có kiểm soát, nội dung editable và preview phản ánh đúng hiệu lực setting là hướng đề xuất.
- **Không tạo thêm owner settings cạnh tranh.** Phải inventory Header Actions, Footer Page Settings, template/builder đang dùng trước khi chọn dữ liệu và migration.

Ba phương án đã cân nhắc:

| Phương án | Đánh đổi | Kết luận ở mức định hướng |
|---|---|---|
| Hoàn thiện prototype ghép thủ công | Ít source mới; còn nhiều bước vận hành/tích hợp | Giữ làm reference và xử lý defect riêng, không lấy làm kiến trúc module đích |
| Module header/navigation có giới hạn, footer dùng core khi đủ | Kiểm soát assets, hành vi và editor; có chi phí QA/bảo trì rõ | Hướng khuyến nghị được human đồng ý tổng hợp |
| Full Header/Footer Builder, nhiều template và display rules | Linh hoạt hơn; phạm vi và ma trận tương thích lớn | Chưa được chốt thành scope triển khai |

## 3. Độc lập với theme nghĩa là gì?

**Độc lập về tính năng/thiết kế:** plugin cung cấp blocks, editor, styling mặc định và runtime; dữ liệu/layout cần tái sử dụng có đường lưu và truy xuất không bị mất chỉ vì đổi theme. Không phụ thuộc bắt buộc vào WindPress, token riêng SKVN hay file JS của theme để chạy các hành vi cơ bản.

**Tự động thay header/footer của mọi theme:** đây là phạm vi khác, cần cơ chế tích hợp theo host. Không cam kết module tự gỡ được mọi header/footer hiện hữu hoặc tự biết vị trí render đúng của mọi theme.

Đổi theme có thể cần đặt/chọn lại module trong template của theme mới. Đó là thao tác tích hợp; không được buộc dựng lại nội dung hoặc viết lại runtime. Cách bảo toàn/tham chiếu layout qua theme switch còn phải thiết kế và kiểm chứng, chưa chốt storage schema.

| Thành phần | Owner đích |
|---|---|
| Custom blocks và editor của module | Marine Blocks |
| Cấu hình và layout dùng lại của module | Plugin, tái sử dụng dữ liệu native WordPress khi phù hợp; storage cụ thể chưa chọn |
| CSS mặc định, responsive, mega-menu, drawer, animation thuộc module | Plugin; tự nạp assets cần thiết |
| Vị trí render và số lần render Header/Footer trong trang | Template/theme integration |
| Brand toàn website | Theme; có thể tùy chỉnh component qua contract được công bố |
| Nội dung footer thông thường | Ưu tiên core blocks/patterns; chưa mặc định cần custom Footer block |

```text
Template của theme
├── Vùng Header → nội dung/blocks của Marine Blocks
├── Nội dung trang
└── Vùng Footer → nội dung/blocks của Marine Blocks
```

Mỗi vùng có đúng một owner render. Theme không xuất header mặc định đồng thời với module thay thế. Nếu theme đích là block theme, Template Part có thể làm vùng chứa; nếu là classic/hybrid standalone, cần render contract phù hợp. Chưa dùng quyết định này để chốt loại theme.

CSS của component chuyên dụng có thể thuộc plugin, với defaults/fallback đủ dùng. Theme giữ global branding; không chuyển toàn bộ visual của component sang theme khiến plugin mất khả năng hoạt động độc lập. Tính độc lập vẫn cần kiểm conflict với host CSS, không đồng nghĩa miễn nhiễm mọi stylesheet.

## 4. Kế thừa prototype và giới hạn evidence

- [Prototype Gutenberg + CSS + drawer](../../examples/mega-menu-gutenberg-tailwind/README.md): nguồn tham khảo cấu trúc editable và hành vi đã thử; không phải module plugin hoàn chỉnh.
- [Runbook và audit onsite](../../testing/mega-menu-gutenberg-tailwind-prototype.md): tách CSS conflict, thiếu JS mobile và first-load cache. Audit 2026-11-09 thấy CSS server ban đầu 21.218 ký tự chưa có menu rules; sau browser compile thành 27.212 ký tự có rules. Độ dài chỉ là evidence của lần kiểm đó, không phải tiêu chí cache đúng trong tương lai.
- Controller hiện tại nằm trong shared runtime của theme; có 9 test mô hình PASS. Không suy thành native browser focus/motion, editor save/reopen hoặc cross-theme PASS. Đưa hành vi này vào plugin tương lai cần chuyển owner có kiểm soát, tránh hai controller chạy đồng thời.
- Human đã chọn **hamburger + drawer toàn menu** cho prototype. Đây là baseline tham khảo cho module; không tự chốt breakpoint, timing hoặc toàn bộ bộ controls tương lai.
- [Báo cáo sóng menu Trident](bao-cao-tong-hop-song-menu-trident.md) và [artifact sóng](Vạch%20sóng%20menu%20thử%20nghiệm.html) là tài liệu hiệu ứng tham khảo. Sóng/clip-path của reference khác drawer trượt của prototype; không tuyên bố prototype đã tái tạo animation Trident hoặc tự đưa sóng vào scope.

## 5. Quan hệ với các quyết định trước

- [Header Actions 0.12.0](../../decisions/header-actions-search-0.12.0.md) giữ contract/source của hệ hiện tại. Hướng module sau standalone mở lại phạm vi tương lai; không âm thầm xóa settings, search hoặc acceptance cũ.
- [SKVN Element CPT Foundation](../../../.context/planning/014_VERSION_1_X_SKVN_ELEMENT_CPT_PLANNING.md) dự kiến reusable site elements và footer bridge trong 1.x. Quyết định mới về thời điểm module header/footer không tự hủy toàn bộ foundation/bridge đó; khi lập execution plan phải đối chiếu và cập nhật phần lịch trình/ownership có xung đột.
- [Standalone theme roadmap](../../../.context/planning/013_VERSION_2_0_0_TO_3_0_0_STANDALONE_BLOCK_THEME_PLANNING.md) giữ theme sở hữu cấu trúc trang. Module plugin sở hữu component không đồng nghĩa plugin tiếp quản toàn bộ templates hoặc migration khỏi GeneratePress.
- Identity/module naming khi triển khai phải theo trạng thái migration Marine Blocks thực tế; không rename prefix hoặc saved data trong lượt ideation này.

## 6. Những điểm còn mở trước execution plan

1. **Host đích và điều kiện bắt đầu:** standalone classic, hybrid hay block theme; bằng chứng đã thoát phụ thuộc GeneratePress; SemVer và thứ tự milestone.
2. **Đơn vị sản phẩm:** Header block riêng hay tổ hợp blocks/navigation + patterns; Footer cần custom behavior nào ngoài core; nội dung mega panel cho phép chỉnh đến mức nào.
3. **Dữ liệu và layout dùng lại:** dùng nguồn menu nào, layout lưu ở đâu, tham chiếu qua theme switch, quan hệ với plan Element CPT; chưa chốt tạo CPT mới hay hệ settings mới.
4. **Brand/style contract:** defaults của plugin, lựa chọn kế thừa theme, mức tùy chỉnh an toàn và parity editor/frontend.
5. **CTA mobile:** contract cũ yêu cầu Request Quote luôn visible, còn prototype đưa CTA vào drawer. Cần quyết rõ trước khi coi prototype là spec sản phẩm.
6. **Kế thừa và fallback:** mapping Header Actions/Footer Page cũ, xử lý plugin inactive, layout thiếu/không hợp lệ, rollback; không tự rewrite dữ liệu hoặc xóa nội dung cũ.
7. **Phạm vi đầu tiên:** search, sticky/transparent header, display rules, nhiều header theo trang và sóng animation đều chưa mặc định thuộc scope. Chọn thêm phải có nhu cầu và acceptance riêng.

Định hướng đề xuất là khung header có cấu trúc được kiểm soát, ưu tiên core blocks cho nội dung phù hợp, custom behavior cho navigation/mega-menu/drawer. Chưa phê duyệt danh sách controls hoặc full builder.

## 7. Acceptance cần mang sang plan tương lai

Đây là yêu cầu đề xuất, **chưa có implementation/evidence của module mới**. Khi promote, giữ ba nhóm theo [review contract](../../standards/block-ui-editor-ux-technical-review-contract.md), bổ sung states/fixtures và runbook cụ thể.

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc tiếp theo | Cách kiểm / evidence cần có |
|---|---|---|---|---|---|
| HF-UI01 | Block UI | Desktop/mobile đủ navigation, CTA và focus rõ; không hai header/footer | Chưa làm ở module mới | Chốt interaction và CTA; thiết kế render owner | Browser thao tác pointer/keyboard, resize; ảnh/video và DOM count theo fixture |
| HF-UI02 | Block UI / Technical | First load đủ style, không chờ browser compile mới có bố cục đúng | Chưa làm ở module mới | Thiết kế asset delivery của plugin | Raw response/network + cold-load filmstrip, có/không WindPress; không dùng loader che defect |
| HF-ED01 | Editor UX | Chỉnh logo/links/CTA/panel rõ ràng; save/reopen giữ dữ liệu và hiệu lực settings | Chưa làm | Chọn block/content contract và controls | Editor thực, title/link dài, empty/missing media; screenshot và saved/reopened state |
| HF-TECH01 | Technical | Component dùng trên SKVN standalone và ít nhất một theme khác; nội dung có đường tái sử dụng | Chưa làm | Thiết kế ownership, persistence và host integration | Cross-theme fixtures, asset/style/runtime audit; không chỉ kiểm trên SKVN |
| HF-TECH02 | Technical | Drawer/mega-menu an toàn với focus, scroll, resize, reduced motion và thiếu JS | Chưa làm; prototype có source/model tests riêng | Audit phần tái sử dụng; xác định fallback, tránh init trùng | Native browser tests, console, focus/scroll evidence; model tests ghi riêng |
| HF-TECH03 | Technical | Chuyển hệ có mapping/fallback/rollback, không mất settings hoặc site navigation | Chưa làm | Inventory hệ cũ và migration contract | Staging có dữ liệu cũ, plugin active/inactive, backup/rollback evidence trước cutover |

## 8. Nguồn kỹ thuật

- [WordPress — Block metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/): block có thể khai báo assets riêng, làm nền cho CSS/runtime của component plugin.
- [WordPress — Template Parts](https://developer.wordpress.org/themes/templates/template-parts/): part phải được template gọi; tạo part không tự đặt nó vào trang. Đây là cơ sở phân biệt component với vị trí render của theme.

Tài liệu này lưu rationale, quyết định và câu hỏi còn mở. Không thay thế execution plan, không đánh dấu runtime PASS, không chuyển current milestone và không là lệnh build/deploy/commit.
