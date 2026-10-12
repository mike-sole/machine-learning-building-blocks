import React, { useEffect, useRef, useState } from 'react';
import { Mafs, Coordinates, Plot, useTransformContext, vec } from 'mafs';
import 'mafs/core.css';
import './mafs-theme.css';
import { registerChartBoardForTests, mafsBoardHandle, type ChartPoint, type ChartPlot } from './chartTestHook';

/** Grid line spacing and label text for one axis */
interface AxisStyle {
    lines?: number;
    labels?: (value: number) => string;
}

/** A function y = f(x) drawn on the board (and reported to the chart tests) */
export type BoardPlot = ChartPlot & { color: string; weight?: number };

interface MafsBoardProps {
    /** Chart id, as used in the blog post (registers the board for the chart tests) */
    chartId: string;
    /** The board's points, as reported to the chart tests */
    points?: ChartPoint[];
    /** Functions to plot */
    plots?: BoardPlot[];
    /** Fixed height in pixels, stretching the axes to fill it; square when left out */
    height?: number;
    /** Stretch the axes to fill a square board instead of keeping x and y units equal */
    stretch?: boolean;
    /** Width / height of the board when it has no fixed height (1: square) */
    aspect?: number;
    /** Draw the grid and axes (on by default) */
    grid?: boolean;
    /** For charts with several boards: this board's position, and how many there are */
    boardIndex?: number;
    boardCount?: number;
    /** Lay the board out as one of several side by side, wrapping onto new rows on narrow screens */
    sideBySide?: boolean;
    xAxis?: AxisStyle;
    yAxis?: AxisStyle;
    /** Visible range of the axes */
    x?: [number, number];
    y?: [number, number];
    /** Visible range on phones, when the panel sits below the board instead of over it */
    narrow?: { x: [number, number]; y: [number, number] };
    maxWidth?: number;
    /** Live calculations: over the board's top-left corner on wider screens, below it on phones */
    panel?: React.ReactNode;
    children: React.ReactNode;
}

/** A responsive Mafs board (square unless given a height or aspect) with a grid and labelled axes, styled like the site's charts. */
export const MafsBoard: React.FC<MafsBoardProps> = ({ chartId, points = NO_POINTS, plots = NO_PLOTS, height, stretch, aspect = 1, grid = true, boardIndex = 0, boardCount = 1, sideBySide, xAxis, yAxis, x = [-5, 5], y = [-5, 5], maxWidth = 700, narrow, panel, children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState(0);

    // Mafs needs a height in pixels: unless given one, keep the board square at whatever width the page allows
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setSize(Math.floor(entry.contentRect.width)));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Matches the 640px breakpoint in mafs-theme.css, where the panel moves below the board
    const range = narrow && size > 0 && size < 600 ? narrow : { x, y };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: `${maxWidth}px`, ...(sideBySide && { flex: '1 1 0', minWidth: 'min(300px, 100%)' }) }}>
            <div
                ref={containerRef}
                data-chart-board
                style={{ width: '100%', ...(height ? { height } : { aspectRatio: `${aspect}` }), border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}
            >
                {/* A figure, not a div: the chart tests read each HTML label that is a direct div child of a board */}
                <figure style={{ margin: 0 }}>
                    {size > 0 && (
                        <Mafs height={height ?? Math.round(size / aspect)} pan={false} zoom={false} viewBox={{ ...range, padding: 0 }} preserveAspectRatio={height || stretch ? false : 'contain'}>
                            {grid && (
                                <Coordinates.Cartesian
                                    xAxis={{ lines: xAxis?.lines ?? 1, labels: edgeless(range.x, xAxis?.labels) }}
                                    yAxis={{ lines: yAxis?.lines ?? 1, labels: edgeless(range.y, yAxis?.labels) }}
                                />
                            )}
                            {plots.map((p, i) => <Plot.OfX key={i} y={p.y} domain={[p.from, p.to]} color={p.color} weight={p.weight ?? 2} />)}
                            {children}
                            <TestHook chartId={chartId} boardIndex={boardIndex} boardCount={boardCount} points={points} plots={plots} container={containerRef} />
                        </Mafs>
                    )}
                </figure>
            </div>
            {panel && <div className="mafs-panel">{panel}</div>}
        </div>
    );
};

const NO_POINTS: ChartPoint[] = [];
const NO_PLOTS: BoardPlot[] = [];

/** Axis labels, leaving out the two at the very edges of the board (they would be cut in half). */
const edgeless = ([min, max]: [number, number], label: (n: number) => string = String) =>
    (n: number) => (n <= min + 1e-9 || n >= max - 1e-9 ? '' : label(n));

/** Registers the board with the dev-only chart test hook (see chartTestHook.ts). */
interface TestHookProps {
    chartId: string;
    boardIndex: number;
    boardCount: number;
    points: ChartPoint[];
    plots: ChartPlot[];
    container: React.RefObject<HTMLDivElement | null>;
}

const TestHook: React.FC<TestHookProps> = ({ chartId, boardIndex, boardCount, points, plots, container }) => {
    const { viewTransform } = useTransformContext();
    const pointsRef = useRef(points);
    const plotsRef = useRef(plots);
    useEffect(() => {
        pointsRef.current = points;
        plotsRef.current = plots;
    }, [points, plots]);

    useEffect(() => {
        const svg = container.current?.querySelector('svg');
        if (!svg) return;
        return registerChartBoardForTests(chartId, boardIndex, boardCount,
            mafsBoardHandle(svg, (px, py) => vec.transform([px, py], viewTransform), () => pointsRef.current, () => plotsRef.current));
    }, [chartId, boardIndex, boardCount, container, viewTransform]);

    return null;
};
