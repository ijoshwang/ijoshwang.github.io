# ijoshwang.github.io

Public personal portfolio and StarLab showcase deployed as a static Next.js export to GitHub Pages.

## Runtime & Verification

- Requires **Node 24+** and **pnpm 10+**.
- Run `pnpm check` before committing: runs Prettier (`format:check`), TypeScript (`typecheck`), Oxlint (`lint`), Vitest (`test`), and static export (`build` -> `out/`).

## Content Ownership & Privacy

- `src/domain/profile-data.ts` is the single typed source driving Human UI, Agent mode, `/llms.txt`, and `/profile.json`.
- Keep career dates, roles, and metrics aligned with upstream `~/workspace/citizen/cv.md` (private CV repo). Omit industry-sensitive bullets (such as `Telegram/TON`) from this public site.
- Public privacy boundary (enforced by Vitest): never commit phone numbers, `app.notion.com` links, or local filesystem paths under `src/`.

## Branching & Deploy

- Develop on feature branches (`feat/*`) and merge into `master` via PR.
- `.github/workflows/deploy.yml` runs `pnpm check` on PRs and deploys `./out` to GitHub Pages on pushes to `master` (requires GitHub Pages source set to **GitHub Actions**).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
