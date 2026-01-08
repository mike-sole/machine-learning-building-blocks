import { test, expect } from '@playwright/test';

const posts = [
    {
        name: 'post-vector-similarity',
        path: '/post/vector-similarity-measures',
        checks: async (page) => {
            // 1. Verify "Movies ordered by distance" list is flat
            const movieAListItem = page.getByText('Movies ordered by distance from Movie A', { exact: false });
            await expect(movieAListItem).toBeVisible();

            // 2. Verify Paragraphs are NOT code blocks
            const paragraphsToCheck = [
                'Pairwise Euclidean distance between movie vectors:',
                'A pairwise distance matrix using the cosine distance follows for comparison:',
                'From the above, the following statements are true when using either the'
            ];

            for (const text of paragraphsToCheck) {
                const countPre = await page.locator('pre').filter({ hasText: text }).count();
                expect(countPre, `Text "${text}" should not be in a code block`).toBe(0);
            }

            // 3. Verify Bold Text rendering
            await expect(page.locator('strong').filter({ hasText: /^Euclidean distance$/ }).first()).toBeVisible();
            await expect(page.locator('strong').filter({ hasText: /^cosine distance$/ }).first()).toBeVisible();

            // 4. Verify Algebraic/Geometric Representation Hierarchy
            await expect(page.getByText('Algebraic representation:', { exact: false }).first()).toBeVisible();
            await expect(page.getByText('Geometric representation:', { exact: false }).first()).toBeVisible();
        }
    },
    {
        name: 'post-weighted-sum',
        path: '/post/weighted-sum',
        checks: async (page) => {
            // Check for correct list rendering
            await expect(page.getByText('Action: 10 / 10', { exact: false }).first()).toBeVisible();

            // Check for block math presence
            await expect(page.getByRole('heading', { name: 'Maths Notations' })).toBeVisible();

            // Verify bold text
            await expect(page.locator('strong').filter({ hasText: /^weighted sum$/ }).first()).toBeVisible();
            await expect(page.locator('strong').filter({ hasText: /^dot product$/ }).first()).toBeVisible();
        }
    },
    {
        name: 'post-matrix-multiplication',
        path: '/post/matrix-multiplication',
        checks: async (page) => {
            // Check for list items
            await expect(page.getByText('Mike:', { exact: false }).first()).toBeVisible();
            await expect(page.getByText('Sienna:', { exact: false }).first()).toBeVisible();

            // Bold text in lists
            await expect(page.locator('strong').filter({ hasText: /^Weighted sum$/ }).first()).toBeVisible();

            // Check table headers are bold (using strong tag check)
            await expect(page.locator('strong').filter({ hasText: /^Mike$/ }).first()).toBeVisible();
            await expect(page.locator('strong').filter({ hasText: /^Sienna$/ }).first()).toBeVisible();
        }
    },
    {
        name: 'post-perceptron-model',
        path: '/post/the-perceptron-model',
        checks: async (page) => {
            // Check lists
            await expect(page.getByText('Should I watch this movie? (Yes / No)', { exact: false })).toBeVisible();
            // Removed "1." list marker
            await expect(page.getByText('Weighted Sum: Aggregates the inputs.', { exact: false })).toBeVisible();

            // Bold text
            await expect(page.locator('strong').filter({ hasText: /^Perceptron$/ }).first()).toBeVisible();
            await expect(page.locator('strong').filter({ hasText: /^Neural Networks$/ }).first()).toBeVisible();
            await expect(page.locator('strong').filter({ hasText: /^linearly separable$/ }).first()).toBeVisible();

            // Steps list
            await expect(page.getByText('If the Weighted Sum > Threshold', { exact: false })).toBeVisible();
        }
    },
    {
        name: 'post-training-perceptron',
        path: '/post/training-the-perceptron',
        checks: async (page) => {
            // Check lists
            // Removed "1." list marker
            await expect(page.getByText('Initialise:', { exact: false })).toBeVisible();

            // Bold text
            await expect(page.locator('strong').filter({ hasText: /^Perceptron Learning Algorithm$/ }).first()).toBeVisible();

            // REGRESSION CHECK: Ensure list item is not a code block
            const textToCheck = 'If the expected output was 1 but we predicted 0';
            // Playwright might fuzzy match, so we take a substring
            const substring = 'If the expected output';

            // Ensure it exists visible
            await expect(page.getByText(substring, { exact: false }).first()).toBeVisible();

            // Ensure it is NOT inside a <pre> tag (which implies code block)
            const countPre = await page.locator('pre').filter({ hasText: substring }).count();
            expect(countPre, `List item "${substring}..." should not be rendered as a code block`).toBe(0);
        }
    }
];

for (const post of posts) {
    test(`structure check for ${post.name}`, async ({ page }) => {
        await page.goto(post.path);
        await page.waitForLoadState('networkidle');
        await post.checks(page);
    });
}
