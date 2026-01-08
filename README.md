# Machine Learning Building Blocks

A blog about Machine Learning building blocks for developers who aren't mathematicians!

View the live site [here](https://mike-sole.github.io/machine-learning-building-blocks/).

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Interactive Graphs**: [JSXGraph](https://jsxgraph.org/)
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

### Testing

```bash
# Run e2e tests
npm run test

# Run tests with UI
npm run test:ui
```

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
