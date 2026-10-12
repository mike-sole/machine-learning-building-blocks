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
    maxWidth?: number;
    children: React.ReactNode;
}

/** A square, responsive Mafs board with a grid and labelled axes, styled like the site's charts. */
export const MafsBoard: React.FC<MafsBoardProps> = ({ chartId, points, x = [-5, 5], y = [-5, 5], maxWidth = 700, children }) => {
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

    return (
        <div
            ref={containerRef}
            data-chart-board
            style={{ width: '100%', maxWidth: `${maxWidth}px`, aspectRatio: '1 / 1', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}
        >
            {size > 0 && (
                <Mafs height={size} pan={false} zoom={false} viewBox={{ x, y, padding: 0 }}>
                    <Coordinates.Cartesian />
                    {children}
                    <TestHook chartId={chartId} points={points} container={containerRef} />
                </Mafs>
            )}
        </div>
    );
};

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
