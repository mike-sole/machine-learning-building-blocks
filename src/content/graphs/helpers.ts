import JXG from 'jsxgraph';

/**
 * Consistent color palette for similarity measures and vector components.
 */
export const SIMILARITY_COLORS = {
    ax: '#d62728', // Red
    ay: '#2ca02c', // Green
    bx: '#1f77b4', // Blue
    by: '#9467bd', // Purple
    aMag: '#feae02', // Orange
    bMag: '#95fe02', // Lime
    dot: '#17becf', // Teal
    cos: '#8c564b', // Brown
    vector: '#1f77b4', // Standard vector blue
    angle: '#feae02',  // Standard angle orange
    origin: '#000000'
};

/**
 * Creates a standard origin point.
 * @param board The JSXGraph board.
 * @param visible Whether the point is visible.
 * @returns The created point.
 */
export const createOrigin = (board: JXG.Board, visible: boolean = false): any => {
    return board.create('point', [0, 0], {
        face: 'o',
        size: visible ? 3 : 0,
        fixed: true,
        name: '',
        visible,
        color: SIMILARITY_COLORS.origin
    });
};

/**
 * Creates a vector endpoint point with standard styling.
 * @param board The JSXGraph board.
 * @param coords Initial [x, y] coordinates.
 * @param name LaTeX name for the point.
 * @param color Point color.
 * @returns The created point.
 */
export const createVectorPoint = (board: JXG.Board, coords: [number, number], name: string, color: string = SIMILARITY_COLORS.aMag): any => {
    return board.create('point', coords, {
        name,
        size: 4,
        face: 'o',
        color,
        useMathJax: false
    });
};

/**
 * Creates a vector (arrow) with an attached smartlabel.
 * @param board The JSXGraph board.
 * @param start Point to start the arrow.
 * @param end Point to end the arrow.
 * @param color Arrow color.
 * @param labelClass CSS class for the smartlabel.
 * @returns The created arrow.
 */
export const createVector = (
    board: JXG.Board,
    start: any,
    end: any,
    color: string = SIMILARITY_COLORS.vector,
    labelClass: string = ''
): any => {
    const arrow = board.create('arrow', [start, end], {
        strokeWidth: 3,
        strokeColor: color,
        fixed: true
    });

    if (labelClass) {
        board.create('smartlabel', [arrow], {
            measure: 'length',
            cssClass: `smart-label-pure ${labelClass} tex2jax_ignore`,
            unit: ' ',
            useMathJax: false,
            parse: false
        });
    }

    return arrow;
};

/**
 * Creates a dashed measurement line with an attached smartlabel.
 * @param board The JSXGraph board.
 * @param p1 Start point.
 * @param p2 End point.
 * @param color Line color.
 * @param labelClass CSS class for the smartlabel.
 * @returns The created line.
 */
export const createMeasurementLine = (
    board: JXG.Board,
    p1: any,
    p2: any,
    color: string = SIMILARITY_COLORS.vector,
    labelClass: string = 'smart-label-circle-vector-ab'
): any => {
    const line = board.create('line', [p1, p2], {
        dash: 2,
        strokeWidth: 2,
        strokeColor: color,
        straightFirst: false,
        straightLast: false,
        fixed: true
    });

    board.create('smartlabel', [line], {
        measure: 'length',
        cssClass: `smart-label-pure ${labelClass} tex2jax_ignore`,
        unit: ' ',
        useMathJax: false,
        parse: false
    });

    return line;
};

/**
 * Creates an angle sector with a dynamic label.
 * @param board The JSXGraph board.
 * @param p1 Point on the first leg.
 * @param origin The vertex of the angle.
 * @param p2 Point on the second leg.
 * @param color Fill and stroke color.
 * @param radius Radius of the angle sector.
 * @returns The created angle.
 */
export const createAngleLabel = (
    board: JXG.Board,
    p1: any,
    origin: any,
    p2: any,
    color: string = SIMILARITY_COLORS.angle,
    radius: number = 1
): any => {
    return board.create('angle', [p1, origin, p2], {
        radius,
        fixed: true,
        fillColor: color,
        fillOpacity: 0.3,
        strokeColor: color,
        name: () => {
            const a = JXG.Math.Geometry.trueAngle(p1 as any, (origin as any), p2 as any);
            return `<span style="color:${SIMILARITY_COLORS.vector}">${a.toFixed(1)}°</span>`;
        }
    });
};

/**
 * Formats a vector name with standard styling for HTML text.
 * @param name Vector name (e.g., 'a').
 * @returns Formatted HTML string.
 */
export const formatVectorName = (name: string) => {
    return `<span class="vector-label">${name}</span>`;
};

/**
 * Formats a value with a specific color.
 * @param value The value to display.
 * @param color The hex/css color.
 * @returns Formatted HTML string.
 */
export const formatValue = (value: string | number, color: string) => {
    return `<span style="color:${color}">${value}</span>`;
};
