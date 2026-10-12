import React, { useEffect, useRef, useState } from 'react';
import { Mafs, Coordinates, useTransformContext, vec } from 'mafs';
import 'mafs/core.css';
import './mafs-theme.css';
import { registerChartForTests, mafsBoardHandle, type ChartPoint } from './chartTestHook';

interface MafsBoardProps {
    /** Chart id, as used in the blog post (registers the board for the chart tests) */
    chartId: string;
    /** The board's points, as reported to the chart tests */
    points: ChartPoint[];
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

/** A square, responsive Mafs board with a grid and labelled axes, styled like the site's charts. */
export const MafsBoard: React.FC<MafsBoardProps> = ({ chartId, points, x = [-5, 5], y = [-5, 5], maxWidth = 700, narrow, panel, children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState(0);

    // Mafs needs a height in pixels: keep the board square at whatever width the page allows
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
        <div style={{ position: 'relative', width: '100%', maxWidth: `${maxWidth}px` }}>
            <div
                ref={containerRef}
                data-chart-board
                style={{ width: '100%', aspectRatio: '1 / 1', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}
            >
                {/* A figure, not a div: the chart tests read each HTML label that is a direct div child of a board */}
                <figure style={{ margin: 0 }}>
                    {size > 0 && (
                        <Mafs height={size} pan={false} zoom={false} viewBox={{ ...range, padding: 0 }}>
                            <Coordinates.Cartesian xAxis={{ labels: edgeless(range.x) }} yAxis={{ labels: edgeless(range.y) }} />
                            {children}
                            <TestHook chartId={chartId} points={points} container={containerRef} />
                        </Mafs>
                    )}
                </figure>
            </div>
            {panel && <div className="mafs-panel">{panel}</div>}
        </div>
    );
};

/** Axis labels, leaving out the two at the very edges of the board (they would be cut in half). */
const edgeless = ([min, max]: [number, number]) => (n: number) => (n <= min || n >= max ? '' : String(n));

/** Registers the board with the dev-only chart test hook (see chartTestHook.ts). */
const TestHook: React.FC<{ chartId: string; points: ChartPoint[]; container: React.RefObject<HTMLDivElement | null> }> = ({ chartId, points, container }) => {
    const { viewTransform } = useTransformContext();
    const pointsRef = useRef(points);
    useEffect(() => {
        pointsRef.current = points;
    }, [points]);

    useEffect(() => {
        const svg = container.current?.querySelector('svg');
        if (!svg) return;
        return registerChartForTests(chartId, [
            mafsBoardHandle(svg, (px, py) => vec.transform([px, py], viewTransform), () => pointsRef.current),
        ]);
    }, [chartId, container, viewTransform]);

    return null;
};
