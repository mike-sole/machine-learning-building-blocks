---
description: Standard for rendering vector labels using HTML/CSS instead of MathJax for performance
---

# Vector Label Rendering Standard

To ensure optimal performance and avoid MathJax rendering delays, always prefer HTML/CSS rendering for vector labels and simple mathematical symbols in JSXGraph.

## The Standard

1. **Disable MathJax**: Set `useMathJax: false` in the JSXGraph element attributes.
2. **Use HTML Helpers**: Use the `formatVectorName` helper function to generate the HTML string.
3. **CSS Styling**: Rely on the `.vector-label` CSS class (defined in `jsxgraph.css`) to render the vector arrow using `::after` pseudo-elements.

## Code Example

**Do NOT use:**
```typescript
// Avoid LaTeX for simple labels
board.create('point', [1, 1], {
    name: '\\( \\vec{a} \\)',
    useMathJax: true
});
```

**DO use:**
```typescript
import * as h from './helpers';

// Use strict HTML/CSS rendering
board.create('point', [1, 1], {
    name: h.formatVectorName('a'),
    useMathJax: false // CRITICAL: Must be explicitly false
});
```

## Helper Implementation (Reference)

```typescript
// src/content/graphs/helpers.ts
export const formatVectorName = (name: string) => {
    return `<span class="vector-label">${name}</span>`;
};
```
