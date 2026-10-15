# Machine Learning Building Blocks

A blog about Machine Learning building blocks for developers who aren't mathematicians!

View the live site [here](https://mike-sole.github.io/machine-learning-building-blocks/).

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Math Rendering**: [KaTeX](https://katex.org/), at build time (`src/content/math/`), so readers only download its CSS and fonts
- **Interactive Graphs**: [Mafs](https://mafs.dev/)
- **Testing**: [Playwright](https://playwright.dev/)

## Local Development

### Prerequisites

- Node.js (v24 recommended; CI uses 24)
- npm

### Setup

```bash
# Install dependencies
npm install
```

`npm install` also turns on the Git hooks in `.githooks/`:
- `pre-commit` scans the staged changes for secrets (API keys, tokens, private keys) with [gitleaks](https://github.com/gitleaks/gitleaks#installing), if it's installed. For a false positive, add a `gitleaks:allow` comment to the line.
- `pre-push` runs the linter and unit tests before each push (about 10 seconds). Skip it once with `git push --no-verify`.

### Running the Dev Server

```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Linting

```bash
npm run lint
```

### Testing

```bash
# Run unit tests (Vitest) then end-to-end tests (Playwright)
npm run test

# Run only the unit tests
npm run test:unit

# Run only the end-to-end tests
npm run test:e2e

# Run Playwright tests with UI
npm run test:ui
```

Screenshots are taken in two places: `tests/charts/all-charts.spec.ts` screenshots each chart on desktop and phone, and `tests/visual-regression.spec.ts` screenshots the home page and each post with its charts masked, so a chart change only changes that chart's screenshots.

Visual regression screenshots are platform specific. Only the `*-linux.png` baselines are committed: CI compares against them, and they are generated inside the official Playwright Docker image. On another platform, Playwright writes local baselines on the first run; don't commit them. To regenerate the Linux baselines:

1. Open **Actions → CI → Run workflow** and pick the pull request's branch.
2. Tick **Regenerate the Linux visual snapshots**. Also tick **rewrite every snapshot** if the change might fall within the 1% comparison tolerance; otherwise only the screenshots that fail the comparison are rewritten, and the rest keep their old content.
3. Once the build and the whole suite pass, the run commits the new images to the branch as `github-actions[bot]`. The push is refused if the branch moved during the run; run it again in that case.
4. **Approve the held run.** GitHub doesn't run CI by itself on commits pushed by a workflow, so the pull request's run for the bot's commit waits with **Approve and run**, and the pull request shows as blocked until then. Open the pull request's **Checks** tab (or the waiting run under **Actions**) and approve it.

## Continuous Integration

The `.github/workflows/ci.yml` workflow runs on every pull request and on pushes to `main`:
1. Lint, type check, build and unit tests.
2. A secret scan of the whole Git history with gitleaks.
3. Playwright tests (including visual regression) inside the `mcr.microsoft.com/playwright` image. The HTML report is uploaded as a build artifact.

The workflows' token is read-only unless a job needs more, and third-party actions and the Playwright image are pinned to a commit or digest; Dependabot keeps them, and the npm packages, up to date. `@playwright/test` is left out of Dependabot: update it together with the image in `ci.yml`, then regenerate the snapshots.

## Deployment

The blog is deployed to **GitHub Pages** by the `.github/workflows/deploy.yml` workflow on every push to `main`: one job builds the site with a read-only token, and a second publishes it with `actions/deploy-pages`. In **Settings → Pages**, **Source** must be **GitHub Actions**. To redeploy without a change, run the workflow from **Actions → Deploy to GitHub Pages → Run workflow**.
