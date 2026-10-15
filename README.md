# Machine Learning Building Blocks

A blog about Machine Learning building blocks for developers who aren't mathematicians!

View the live site [here](https://mike-sole.github.io/machine-learning-building-blocks/).

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Interactive Graphs**: [Mafs](https://mafs.dev/)
- **Testing**: [Playwright](https://playwright.dev/)

## Local Development

### Prerequisites

- Node.js (v20+ recommended)
- npm

### Setup

```bash
# Install dependencies
npm install
```

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
2. Playwright tests (including visual regression) inside the `mcr.microsoft.com/playwright` image. The HTML report is uploaded as a build artifact.

## Deployment

The blog is deployed to **GitHub Pages** using **GitHub Actions**.

### Automated Deployment (Recommended)

Deployment is handled automatically by the `.github/workflows/deploy.yml` workflow.
1. Push changes to the `main` branch.
2. The Action builds the project and deploys the `dist` folder to the `gh-pages` branch.
3. GitHub Pages serves the content from `gh-pages`.

### Manual Deployment (Backup)

You can manually deploy from your local machine if needed:

```bash
npm run deploy
```
This runs the build and uses the `gh-pages` npm package to push the `dist` folder to the `gh-pages` branch.
