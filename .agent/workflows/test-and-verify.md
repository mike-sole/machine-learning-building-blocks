---
description: Standard workflow for adding regression tests and verifying changes to prevent regressions
---

# Test and Verify Workflow

To ensure high quality and prevent regressions, strictly follow this workflow whenever making code changes, especially to UI or content.

## 1. Identify Verification Scope
Before or during implementation, determine what needs testing:
- **Visual Changes**: Does the layout, typography, or graph rendering change? (Requires Visual Regression)
- **Structural Changes**: Did you add important text, lists, or math equations? (Requires Structural Regression)
- **Logic**: Did you change calculation logic? (Requires Console/Output check or Unit Test)

## 2. Add or Update Tests
**Never rely solely on manual verification.**

### Structural Tests (`tests/structure.spec.ts`)
Add explicit assertions for new content.
```typescript
// Example: Verifying a new list item exists and is correct
await expect(page.getByText('New feature description')).toBeVisible();
expect(await page.locator('pre').filter({ hasText: 'New feature' }).count()).toBe(0); // Ensure not a code block
```

### Visual Regression (`tests/visual-regression.spec.ts`)
Ensure the page is included in the `pages` array.
```typescript
{ name: 'new-post-name', path: '/post/new-post-slug' },
```

## 3. Run Verification
**CRITICAL: Always run the FULL test suite.**
Even if you only edited one page, you must run all tests to ensure no shared components or global styles broke other pages.

```bash
# Runs all 11+ tests (Visual + Structural)
npm test

# OR for interactive mode
npm run test:ui
```

*Do not use flags to limit the run to a single file unless debugging a specific failure.*

## 4. Handle Visual Changes
If (and only if) the visual changes are **intentional-and-correct**:
1. Run the update command:
   ```bash
   npx playwright test --update-snapshots
   ```
2. Verify the new snapshots are correct in the report.

## 5. Final Confirmation
- **All tests must pass** (Green) before marking a task as complete.
- **No unhandled console errors** should be present.
