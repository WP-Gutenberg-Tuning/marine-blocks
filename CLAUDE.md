# CLAUDE.md — SKVN Marine

⚠️ Do NOT read `docs/standards/ai-rules.md` automatically.
Only read it if I explicitly say "check full rules".

## Project Names

- Theme: `skvn-marine`
- Plugin: `skvn-marine-blocks`
- Block namespace: `skvn-marine`
- Theme PHP prefix: `skvn_marine_`
- Plugin PHP prefix: `skvn_marine_blocks_`
- CSS prefix: `skvn-`

### Marine Blocks — human decision 2026-11-04

- Định vị: bộ block chuyên dụng và patterns giúp dựng, chỉnh sửa, bàn giao website nhanh; không hướng tới supercharge toàn bộ FSE. Ưu tiên core blocks/patterns, custom block khi cần dữ liệu/tương tác/UX biên tập chuyên dụng. Không tự mở lại query ownership của Collection.
- Plugin có styling/runtime riêng, hoạt động độc lập với WindPress và theme SKVN. Website được dùng WindPress/Tailwind enhance core blocks/patterns; không coi đây là hai lựa chọn loại trừ nhau. Layout/style trên mỗi surface phải có owner rõ ràng.
- Độc lập kiểm được (2026-11-19): CSS block cần để đúng hình/đúng width đi cùng zip plugin. Không đặt neutralize GeneratePress `.alignfull` chỉ trong theme. Plugin không phụ thuộc `body.skvn-full-width-canvas`. Chi tiết: AGENTS.md Marine Blocks, GLOBAL A13, DP-12.
- Identity đích: Marine Blocks; slug/text domain `marine-blocks`, block namespace `marine-blocks/*`, PHP functions `marine_blocks_*`, constants `MARINE_BLOCKS_*`, plugin CSS `marine-blocks-*`, variables `--marine-blocks-*`.
- Theme giữ identity `skvn-marine`, PHP `skvn_marine_`, CSS/tokens theme. Có thể cập nhật điểm gọi API plugin khi migrate, không đổi thương hiệu theme.
- Human xác nhận 2026-11-04: **1.4.0 — Marine Blocks Migration**; Setup UI cũ 1.4.0 → 1.4.1, Layout/Quote Validation cũ 1.4.1 → 1.4.2, giữ acceptance. Version đã chốt, chưa start; current vẫn 1.3.18. Trước migration giữ naming source hiện hành.
- Replace hàng loạt chỉ theo inventory plugin/theme/shared. Hàm nội bộ có thể đổi đồng bộ; wrapper chỉ cần cho consumer chưa chuyển. Saved blocks/markup, option/meta keys phải có compatibility hoặc migration riêng; không global replace `skvn` trong repo/DB.
- Identity GU Supercharger và mục tiêu full-FSE bị thay thế. Migration sớm hơn không tự thay public-launch gate sau 1.5.x, reset version về 0.0.1, hoặc hủy acceptance/milestone cũ.
- Source of truth: `.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md`.

## Rules

- Only read files I explicitly mention
- Do NOT explore project structure unless asked
- Keep responses concise, no explanation unless asked

## Non-Negotiable Rules

- Read `AGENTS.md` for additional context
- Do not edit `wp-content/themes/generatepress/`.
- Do not create custom Gutenberg blocks inside the theme.
- Put custom blocks in `skvn-marine-blocks`.
- Use `block.json` for custom block metadata.
- Use `theme.json` for design tokens.
- Use `editor.css` for Gutenberg preview.
- Use frontend CSS/JS for frontend animation.
- Do not add dependencies without writing rationale.
- Do not rename namespace/prefix without explicit approval.
- Do not use shortcodes for primary layout, except CF7 shortcode usage in quote form patterns.
- Do not overwrite manually entered image ALT text.
- Do not auto-generate captions in V1.

## Work Plan Rule

Follow `AGENTS.md` → **Agent response routing**:

- **`CODE_NOW`** (human đã chọn hướng: `theo E`, `làm A+C1`, `implement`, `fix`): implement ngay; plan ngắn trong reply là đủ.
- **`ASK_ARCHITECTURE`** / scope mơ hồ: plan chi tiết → chờ explicit approval → rồi mới implement.
- **`EXPLAIN`**: chỉ giải thích; không code cho đến khi human bảo làm tiếp.

Do NOT block `CODE_NOW` tasks with a full plan + wait-for-approval loop.

## Task Format

Every task should include: Context, Goal, Files allowed to change, Files forbidden to change, Acceptance checklist, Tension/conflict section.

## Scope Rule

Do not modify more than 3–5 files per task by default.

## Tension Rule

If a requested change conflicts with the rules above, record the tension instead of silently breaking the architecture.

## Local Environment

Local environment details are in `.local/` (gitignored, never commit).

- `.local/ENVIRONMENT.md` — source of truth for WSL distro, paths, credentials, CLI commands, WP server URL, build tool versions.
- `.local/` may also contain test scripts, artifacts, and logs.

If `.local/ENVIRONMENT.md` does not exist, ask the user to create it or run `.local/write-env.sh` before attempting any runtime, WP-CLI, PHP, or build commands.

Key lookup rules:
- All WP-CLI, PHP, MariaDB, and Node commands run inside WSL — check `WSL_DISTRO` and command patterns in `.local/ENVIRONMENT.md` before running.
- WordPress runtime root is outside this repo — check `WP_RUNTIME_ROOT_WSL` / `WP_RUNTIME_ROOT_WINDOWS` in `.local/ENVIRONMENT.md`.
- Plugin build runs from `wp-content/plugins/skvn-marine-blocks/`, not from repo root.
- `context-gen` consistency check command is in `.local/ENVIRONMENT.md` under `CONTEXT_GEN_CHECK_CMD`.

## Ideation Scratchpad

`docs/ideations/` là scratchpad cho phiên chat (gitignored). **Đầu mỗi phiên**, đọc `docs/ideations/README-claude.md` để biết topic nào đang open — tránh lặp lại reasoning đã có hoặc đã bị bác bỏ.

Workflow:
- Brainstorm / hypothesis mới → ghi vào `docs/ideations/<topic>.md` với status `open`.
- User xác nhận / bác bỏ bằng data → update status ngay (`confirmed` / `rejected + lý do`).
- Thành quyết định → promote sang `docs/decisions/` (git). Ideation file giữ nguyên đến hết phiên.
- **Không ghi** transcript, code snippet, hay thứ đã có trong file source — chỉ ghi diagnosis, rejected-why, open-question.

## Blocked / Timeout Rule

If a step requires runtime access (WP server, database, browser, onsite QA) and cannot proceed, stop and ask the user (Dev) instead of guessing or fabricating output.
