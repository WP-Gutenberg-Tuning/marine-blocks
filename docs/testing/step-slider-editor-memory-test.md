# Test — Step Slider editor: bộ nhớ & áp lực nhiều tab

**Mục tiêu:** đo footprint của một tab editor WordPress có Step Slider, phát hiện tăng trưởng bất thường (DOM nodes / JSEventListeners / JSHeap) khi thao tác lặp lại, và cung cấp giao thức cho kịch bản "nhiều tab → thiếu RAM" mà human gặp ngoài đời.

**Trạng thái:** runbook + baseline đã chạy một phần qua Brave CDP (16:42–16:46). Kịch bản nhiều-tab **chưa chạy** — cần human mở nhiều tab thật trên máy của human (không chiếm production site; không mở thêm editor thật trên live để tránh tải server).

**Liên quan:** `docs/testing/step-slider-editor-lag-ledger.md` (các lượt đo 16:31 / 16:39 / 16:42).

---

## Kết quả CDP đã đo được (tab `post.php?post=74&action=edit`, page "Test page 2" Published, Brave)

Baseline lúc bắt đầu đo (sau nhiều lượt thao tác trước đó):

| Metric | Giá trị |
|---|---|
| Documents | 14 |
| Frames | 11 |
| Nodes | ~5262 |
| LayoutObjects | ~779 |
| JSEventListeners | ~2259 |
| Resources | 434 |
| JSHeapUsedSize | ~125 → 255 MB (dao động theo thời gian) |
| RecalcStyleCount | 905 (tích lũy) |
| ScriptDuration | ~31 s (tích lũy) |

### Vòng lặp 25× (click `.skvn-step-slider` ↔ click tab label), sample mỗi 5 vòng

| Mốc | JSHeap MB | Nodes | JSEventListeners | RecalcStyleCount |
|---|---|---|---|---|
| 0 | 166 | 5262 | 2256 | 906 |
| 5 | 205 | 5254 | 2251 | 1106 |
| 10 | **653** | 5275 | **8635** | 1318 |
| 15 | 186 | 5266 | 6782 | 1533 |
| 20 | 182 | 5253 | 5302 | 1736 |
| 25 | 184 | 5232 | 2430 | 1941 |

Nhận xét:

- Có **spike thoáng qua** rất lớn khi selection churn (heap 653 MB, listeners 8635), sau đó hồi về gần baseline → bộ nhớ được thu hồi, không thấy tăng đơn điệu.
- Nodes ổn định (5232–5275), Documents ổn định (14) → không thấy DOM leak trong 25 vòng.
- `RecalcStyleCount` tăng liên tục (+1035 sau 25 vòng, ≈41 lần recalc mỗi cặp click) và `ScriptDuration` +8,5 s → chi phí CPU/style recalc cao, khớp với hiện tượng lag khi thao tác.
- **Không phải bằng chứng "không rò rỉ"**: relay CDP cho tab Brave không có `HeapProfiler.*` / `Memory.getDOMCounters` / `SystemInfo.getProcessInfo` (tất cả đều trả "wasn't found"), và không ép được GC. Chỉ dùng được `Performance.getMetrics` (đối xứng, khá đầy đủ).

## Dụng cụ đo

Qua CDP session của tab (Playwright `context.newCDPSession(page)`):

```js
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
const m = await cdp.send('Performance.getMetrics');
// Chú ý các metric: JSHeapUsedSize, Nodes, JSEventListeners, Documents,
// LayoutObjects, RecalcStyleCount, ScriptDuration, TaskDuration, ProcessTime
```

Không dùng `performance.memory` của page (trên Brave/Chromium hiện tại trả về tĩnh, `used == total` mọi lần đọc) và không có `HeapProfiler` qua relay này.

## Giao thức test nhiều tab (human chạy trên máy của human)

**Cảnh báo trước:** KHÔNG mở nhiều tab editor trên production site `minhhaifishery.com` để stress — đó là tải thật lên server live + nhân session admin. Stress bằng tab nhẹ.

### A. Baseline nhiều tab nhẹ (không chạm production)
1. Đóng hết tab không cần thiết. Mở đúng 1 tab editor `post.php?post=74&action=edit` (đã có Step Slider) → ghi `ProcessTime`/`JSHeapUsedSize`/`Nodes` bằng snippet CDP ở trên (agent chạy nếu human cho phép) hoặc Task Manager của Brave (Shift+Esc) đọc riêng dòng tab đó.
2. Mở thêm K tab (test K = 10, 20, 30) tab nhẹ: `about:blank` hoặc trang tĩnh, **không** production editor. Ghi lại tổng RAM Brave (Task Manager) ở mỗi mốc K.
3. Quay lại tab editor: gõ Telex một cụm có dấu → ghi nhận độ trễ chủ quan (mượt / khựng / đứng bao nhiêu giây).
4. Đóng dần các tab K → so sánh.

**Tiêu chí quan sát:** tab editor chiếm riêng bao nhiêu MB trong Task Manager browser; RAM tổng tăng theo K ra sao; editor có khựng rõ rệt khi hệ thống gần cạn RAM không.

### B. Lặp selection churn dưới áp lực tab (tùy chọn, chỉ tab local/dev)
Nếu có bản local chạy được (port 8080 đang 502 — khởi động theo AGENTS.md nếu human muốn):
1. Mở editor local có Step Slider.
2. Chạy 50 vòng click chọn block ↔ chọn tab label (snippet tương đương lượt 16:46), sample metric mỗi 10 vòng.
3. Kỳ vọng: heap spike thoáng qua rồi hồi; Nodes/Documents phẳng. Nếu JSHeapUsedSize/Nodes tăng đơn điệu qua các mốc → flag nghi ngờ rò rỉ, quay video Task Manager + report số.

### C. So sánh với tab thường
Mở thêm 1 tab admin KHÁC không có Step Slider (ví dụ Posts list) → chạy cùng phép đo mục B/D nếu có → so sánh `JSHeapUsedSize`, `Nodes`, `JSEventListeners` của hai loại tab. Mục đích: tách chi phí riêng của editor-có-Step-Slider khỏi chi phí chung của wp-admin.

## Evidence cần human report
- Screenshot/số liệu Task Manager Brave ở các mốc K = 10/20/30.
- Cảm giác lag khi gần cạn RAM (1 câu).
- Nếu chạy được mục B local: bảng metric mỗi 10 vòng.

## Giới hạn
- Relay CDP của Brave tab không chụp heap snapshot / ép GC → không phát hiện retained-DOM leakdứt điểm.
- Production site chỉ được phép thao tác nhẹ (tab editor đơn lẻ, không Save/Preview/Update ngoài các lệnh human chỉ định).
