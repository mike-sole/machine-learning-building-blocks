import type JXG from 'jsxgraph';

/**
 * Dev-only hook used by the Playwright chart driver (tests/charts/driver.ts).
 *
 * Each chart registers one handle per board under `window.__charts[id]`. The handle is
 * library-neutral, so a chart built with another library (e.g. Mafs) only has to provide
 * the same two functions for every chart test to run against it unchanged.
 */
export interface ChartPoint {
    /** Visible name, HTML stripped (e.g. "a", "Spam (4.00)") */
    name: string;
    x: number;
    y: number;
    visible: boolean;
    /** Whether the reader can drag the point */
    draggable: boolean;
    /** Fill colour as set on the point (lower case), if any */
    color?: string;
}

export interface ChartBoardHandle {
    /** Chart coordinates → viewport (client) pixel coordinates */
    toScreen(x: number, y: number): { x: number; y: number };
    /** Every point on the board, in creation order */
    points(): ChartPoint[];
}

type ChartsWindow = Window & { __charts?: Record<string, ChartBoardHandle[]> };

/** Register a chart's boards for the tests; returns the matching unregister function. No-op in production builds. */
export function registerChartForTests(id: string, boards: ChartBoardHandle[]): () => void {
    if (!import.meta.env.DEV) return () => {};
    const w = window as ChartsWindow;
    w.__charts = { ...w.__charts, [id]: boards };
    return () => {
        delete w.__charts?.[id];
    };
}

const stripHtml = (s: unknown) =>
    String(typeof s === 'function' ? s() : s ?? '').replace(/<[^>]*>/g, '').trim();

/** Test handle for a JSXGraph board. */
export function jsxGraphBoardHandle(board: JXG.Board): ChartBoardHandle {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b = board as any;
    return {
        toScreen(x, y) {
            const container = b.containerObj as HTMLElement;
            const rect = container.getBoundingClientRect();
            return {
                x: rect.left + container.clientLeft + b.origin.scrCoords[1] + x * b.unitX,
                y: rect.top + container.clientTop + b.origin.scrCoords[2] - y * b.unitY,
            };
        },
        points() {
            return b.objectsList
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((el: any) => el.elType === 'point' || el.elType === 'glider')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((el: any) => ({
                    name: stripHtml(el.name),
                    x: el.X(),
                    y: el.Y(),
                    visible: el.visProp.visible !== false,
                    draggable: !el.visProp.fixed,
                    color: el.visProp.fillcolor == null ? undefined : String(el.visProp.fillcolor).toLowerCase(),
                }));
        },
    };
}
