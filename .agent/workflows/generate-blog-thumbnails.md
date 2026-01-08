---
description: How to generate consistent, educational blog post thumbnails
---

# Blog Post Thumbnail Generation Guide

Follow these steps to generate high-fidelity, consistent thumbnails for Machine Learning blog posts.

## 1. Visual Style Guide
The "Premium Dark Mode" aesthetic is established to match the site's theme. All thumbnails must follow these constraints:

*   **Background**: Deep Navy / Midnight Blue (#0a0e1a or similar).
*   **Palette**: Glowing Neon accents (Cyan, Magenta, Lime Green, Vibrant Orange).
*   **Perspective**: High-end 3D tech explainer schematic (isometric or 3/4 perspective).
*   **Aesthetic**: Accurate geometric representations, glowing data paths, 3D spheres/cubes, and precise vector lines.
*   **Clutter Control**: **NO LARGE TITLES OR HEADERS** within the image (e.g., don't include "Matrix Multiplication"). Small functional labels (x1, w1, Σ, Row, Col) are permitted if they aid educational clarity.

## 2. Prompting Framework
When using the `generate_image` tool, use the following template:

> "A clean, educational 3D schematic of '[Concept Name]'. [Detailed description of the mechanical operation, e.g., 'Row of cubes from Matrix A and Column of cubes from Matrix B merging into a result cell']. Style: High-fidelity tech explainer graphic, premium dark blue background, glowing neon geometry. NO TITLE TEXT. NO LARGE HEADERS. Focus purely on the spatial and mechanical relationship of the data."

## 3. Deployment Steps
1.  **Generate**: Call `generate_image` with a "Detailed" prompt.
2.  **Verify**: Ensure the image has no overlapping titles and the concepts match the blog content.
3.  **Deploy**: 
    - Copy the generated file to `public/thumbnails/`.
    - Rename it to a readable dash-case name (e.g., `weighted-sum-detailed.png`).
    - Update `src/content/posts.ts` to reference the new path.

## 4. Handling Quotas
The image generator has a strict usage quota (often a 3-hour lockout after 10-15 generations). 
*   **Batch your work**: Finalize prompts for all posts locally before starting generation.
*   **One-Shot Focus**: Aim for a prompt that requires no refinement to avoid wasting quota.
