/**
 * Dev-only hook used by the Playwright chart driver (tests/charts/driver.ts).
 *
 * Each chart registers one handle per board under `window.__charts[id]`. The handle is
 * library-neutral: the chart tests were written against the earlier JSXGraph versions of the
 * charts and run unchanged against the Mafs ones.
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

export interface ChartPlot {
    /** Visible name, if any */
    name: string;
    /** The x range the function is drawn over */
    from: number;
    to: number;
    /** The plotted value at x */
    y(x: number): number;
}

export interface ChartBoardHandle {
    /** Chart coordinates → viewport (client) pixel coordinates */
    toScreen(x: number, y: number): { x: number; y: number };
    /** Every point on the board, in creation order */
    points(): ChartPoint[];
    /** Every plotted function y = f(x) on the board, in creation order */
    plots(): ChartPlot[];
}

type ChartsWindow = Window & { __charts?: Record<string, ChartBoardHandle[]> };

const pendingBoards: Record<string, ChartBoardHandle[]> = {};

/**
 * Register board `index` of a chart with `count` boards. The chart appears in `window.__charts`
 * only once all its boards have registered, so tests never see half a chart. No-op in production builds.
 */
export function registerChartBoardForTests(id: string, index: number, count: number, board: ChartBoardHandle): () => void {
    if (!import.meta.env.DEV) return () => {};
    const w = window as ChartsWindow;
    const boards = (pendingBoards[id] = [...(pendingBoards[id] ?? [])]);
    boards[index] = board;
    const complete = boards.filter(Boolean).length === count;
    if (complete) w.__charts = { ...w.__charts, [id]: boards };
    return () => {
        const remaining = [...(pendingBoards[id] ?? [])];
        delete remaining[index];
        pendingBoards[id] = remaining;
        delete w.__charts?.[id];
    };
}

/**
 * Test handle for a Mafs board. `viewTransform` maps chart coordinates to the SVG's own
 * pixel space (Mafs' useTransformContext); the SVG's screen matrix then maps that to the viewport.
 */
export function mafsBoardHandle(
    svg: SVGSVGElement,
    toSvg: (x: number, y: number) => [number, number],
    points: () => ChartPoint[],
    plots: () => ChartPlot[] = () => [],
): ChartBoardHandle {
    return {
        plots,
        toScreen(x, y) {
            const [px, py] = toSvg(x, y);
            const p = new DOMPoint(px, py).matrixTransform(svg.getScreenCTM() ?? undefined);
            return { x: p.x, y: p.y };
        },
        points,
    };
}
