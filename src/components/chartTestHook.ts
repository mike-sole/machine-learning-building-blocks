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

/** Register a chart's boards for the tests; returns the matching unregister function. No-op in production builds. */
export function registerChartForTests(id: string, boards: ChartBoardHandle[]): () => void {
    if (!import.meta.env.DEV) return () => {};
    const w = window as ChartsWindow;
    w.__charts = { ...w.__charts, [id]: boards };
    return () => {
        delete w.__charts?.[id];
    };
}

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
        plots() {
            return b.objectsList
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((el: any) => el.elType === 'curve' && el.visProp.curvetype === 'functiongraph')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((el: any) => ({
                    name: stripHtml(el.name),
                    from: el.minX(),
                    to: el.maxX(),
                    y: (x: number) => el.Y(x),
                }));
        },
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
