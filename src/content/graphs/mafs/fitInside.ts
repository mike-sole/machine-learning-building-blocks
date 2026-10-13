import { useLayoutEffect, useRef, useState } from 'react';

/** A text element's size, and the edges of its board less a small margin, all in the board's pixels. */
export interface TextMetrics {
    width: number;
    /** Height above and below the baseline */
    ascent: number;
    descent: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
}

const MARGIN = 2;

/**
 * Measures a text element after each render, so a label can work out where it fits on its board
 * (null until it has been drawn once). Only changes in what is measured cause another render.
 */
export function useTextMetrics() {
    const ref = useRef<SVGTextElement>(null);
    const [metrics, setMetrics] = useState<TextMetrics | null>(null);
    // After every render, as any prop can move or change the text; it settles once the measurement stops changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        const text = ref.current;
        const view = text?.ownerSVGElement?.viewBox.baseVal;
        if (!text || !view || view.width === 0) return;
        const box = text.getBBox();
        const baseline = text.y.baseVal[0]?.value ?? box.y + box.height;
        const next: TextMetrics = {
            width: box.width,
            ascent: baseline - box.y,
            descent: box.y + box.height - baseline,
            left: view.x + MARGIN,
            right: view.x + view.width - MARGIN,
            top: view.y + MARGIN,
            bottom: view.y + view.height - MARGIN,
        };
        const same = metrics !== null && (Object.keys(next) as (keyof TextMetrics)[]).every(k => Math.abs(next[k] - metrics[k]) < 0.5);
        if (!same) setMetrics(next);
    });
    return { ref, metrics };
}

/**
 * Where to draw text placed at (x, y) so it stays on the board: slid back just far enough past any edge it
 * would run off. Unchanged until the text has been measured.
 */
export function keepInside(m: TextMetrics | null, x: number, y: number, anchor: 'start' | 'middle' | 'end'): [number, number] {
    if (!m) return [x, y];
    const left = anchor === 'start' ? x : anchor === 'middle' ? x - m.width / 2 : x - m.width;
    const dx = Math.max(0, m.left - left) - Math.max(0, left + m.width - m.right);
    const dy = Math.max(0, m.top - (y - m.ascent)) - Math.max(0, y + m.descent - m.bottom);
    return [x + dx, y + dy];
}
