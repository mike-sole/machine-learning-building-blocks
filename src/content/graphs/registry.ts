import JXG from 'jsxgraph';
import { UnitCircleChart } from './UnitCircleCharts';
import { PerceptronChart } from './PerceptronChart';
import { PerceptronTrainingChart } from './PerceptronTrainingChart';
import * as h from './helpers';

export type GraphInitializer = (
    board: JXG.Board,
    onLogUpdate?: (logs: string[]) => void,
    onRegisterActions?: (actions: Record<string, () => void>) => void
) => void;

export type MultiGraphInitializer = (
    boards: JXG.Board[],
    onLogUpdate?: (logs: string[]) => void,
    onRegisterActions?: (actions: Record<string, () => void>) => void
) => void;

export interface GraphConfig {
    initializer: GraphInitializer | MultiGraphInitializer;
    isMultiBoard?: boolean;
    boardAttributes?: Record<string, any>;
    boardAttributes2?: Record<string, any>;
    containerStyle?: React.CSSProperties;
}

const registry: Record<string, GraphInitializer | GraphConfig> = {
    'vector-similarity-intro': (board) => {
        const o = h.createOrigin(board);
        const p1 = h.createVectorPoint(board, [3.5, 1], h.formatVectorName('a'));
        const p2 = h.createVectorPoint(board, [2, 4], h.formatVectorName('b'));

        h.createVector(board, o, p1, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-a');
        h.createVector(board, o, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-b');
        h.createMeasurementLine(board, p1, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-ab');
        h.createAngleLabel(board, p1, o, p2);
    },
    // 2. Cosine Function
    'cosine-function': {
        containerStyle: { maxWidth: '525px', aspectRatio: 'auto', height: '300px' },
        boardAttributes: { keepaspectratio: false },
        initializer: (board: JXG.Board) => {
            board.setBoundingBox([-1, 1.5, 7, -1.5]);

            const xAxis = board.defaultAxes.x as any;
            const xTicks = xAxis.ticks[0] as any;
            xTicks.setAttribute({
                scale: Math.PI,
                scaleSymbol: '°',
                ticksDistance: 0.5,
                insertTicks: false,
                minorTicks: 0
            });
            xTicks.generateLabelText = function (tick: any) {
                const tickValue = (180 / Math.PI) * tick.usrCoords[1];
                return this.formatLabelText(tickValue.toFixed(1));
            };

            const yAxis = board.defaultAxes.y as any;
            const yTicks = yAxis.ticks[0] as any;
            yTicks.setAttribute({
                ticksDistance: 0.5
            });

            board.create('functiongraph', [Math.cos, 0, 2 * Math.PI], { strokeWidth: 2, strokeColor: '#1a73e8' });
        }
    },

    // 3. Dot Product Geometric
    'dot-product-geometric': {
        boardAttributes: {
            boundingbox: [-6, 6, 6, -6],
            axis: true,
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const o = h.createOrigin(board);
            const p1 = h.createVectorPoint(board, [3.5, 1], h.formatVectorName('a'));
            const p2 = h.createVectorPoint(board, [2, 4], h.formatVectorName('b'));

            h.createVector(board, o, p1, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-a');
            h.createVector(board, o, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-b');
            h.createMeasurementLine(board, p1, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-ab');
            h.createAngleLabel(board, p1, o, p2);

            // Similarity Measures Display
            const textX = -5.5;
            let textY = 5.5;
            const lineSpacing = 0.6;
            const c = h.SIMILARITY_COLORS;

            const createCalcText = (content: () => string, useMathJax: boolean = false) => {
                board.create('text', [textX, textY, content], {
                    color: '#000',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fixed: true,
                    useMathJax
                });
                textY -= lineSpacing;
            };

            createCalcText(() => `${h.formatVectorName('a')}&nbsp; length = ${h.formatValue((p1 as any).Dist(o).toFixed(2), c.aMag)}`);
            createCalcText(() => `${h.formatVectorName('b')}&nbsp; length = ${h.formatValue((p2 as any).Dist(o).toFixed(2), c.ay)}`);
            createCalcText(() => `Euclidean distance = ${h.formatValue((p1 as any).Dist(p2).toFixed(2), c.by)}`);

            createCalcText(() => {
                const dot = (p1 as any).X() * (p2 as any).X() + (p1 as any).Y() * (p2 as any).Y();
                const mags = (p1 as any).Dist(o) * (p2 as any).Dist(o);
                const cosine = mags !== 0 ? dot / mags : 0;
                const angle = JXG.Math.Geometry.trueAngle(p1 as any, [0, 0], p2 as any);
                return `Cosine similarity = ${h.formatValue(cosine.toFixed(2), c.cos)} = cos(${angle.toFixed(1)}°)`;
            });

            createCalcText(() => {
                const dot = (p1 as any).X() * (p2 as any).X() + (p1 as any).Y() * (p2 as any).Y();
                const aLen = (p1 as any).Dist(o);
                const bLen = (p2 as any).Dist(o);
                const mags = aLen * bLen;
                const cosine = mags !== 0 ? dot / mags : 0;
                return `Dot product = ${h.formatValue(dot.toFixed(2), c.bx)} = ${h.formatValue(aLen.toFixed(2), c.aMag)} &sdot; ${h.formatValue(bLen.toFixed(2), c.ay)} &sdot; ${h.formatValue(cosine.toFixed(2), c.cos)}`;
            });
        }
    } as GraphConfig,

    // 4. Dot Product Comparison (Algebraic vs Geometric)
    'dot-product-comparison': {
        boardAttributes: {
            boundingbox: [-6, 6, 6, -6],
            axis: true,
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const o = h.createOrigin(board);
            const p1 = h.createVectorPoint(board, [3.5, 1], `\\( \\vec{a} \\)`);
            const p2 = h.createVectorPoint(board, [2, 4], `\\( \\vec{b} \\)`);

            h.createVector(board, o, p1, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-a');
            h.createVector(board, o, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-b');
            h.createMeasurementLine(board, p1, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-ab');
            h.createAngleLabel(board, p1, o, p2);

            const textX = -5.5;
            let textY = 5.5;
            const lineSpacing = 0.6;


            const createCalcText = (content: () => string, useMathJax: boolean = false) => {
                board.create('text', [textX, textY, content], {
                    color: '#000',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fixed: true,
                    useMathJax
                });
                textY -= lineSpacing;
            };

            createCalcText(() => `${h.formatVectorName('a')} = [${h.formatValue((p1 as any).X().toFixed(1), '#ff7f0e')}, ${h.formatValue((p1 as any).Y().toFixed(1), '#e377c2')}]`);
            createCalcText(() => `${h.formatVectorName('b')} = [${h.formatValue((p2 as any).X().toFixed(1), '#2ca02c')}, ${h.formatValue((p2 as any).Y().toFixed(1), '#17becf')}]`);
            createCalcText(() => `${h.formatVectorName('a')}&nbsp; length = ${h.formatValue((p1 as any).Dist(o).toFixed(2), '#d62728')}`);
            createCalcText(() => `${h.formatVectorName('b')}&nbsp; length = ${h.formatValue((p2 as any).Dist(o).toFixed(2), '#9467bd')}`);

            createCalcText(() => {
                const dot = (p1 as any).X() * (p2 as any).X() + (p1 as any).Y() * (p2 as any).Y();
                const mags = (p1 as any).Dist(o) * (p2 as any).Dist(o);
                const cosine = mags !== 0 ? dot / mags : 0;
                const angle = JXG.Math.Geometry.trueAngle(p1 as any, [0, 0], p2 as any);
                return `Cosine = ${h.formatValue(cosine.toFixed(2), '#8c564b')} = cos(${angle.toFixed(1)}°)`;
            });

            createCalcText(() => {
                const ax = (p1 as any).X();
                const ay = (p1 as any).Y();
                const bx = (p2 as any).X();
                const by = (p2 as any).Y();
                const dot = ax * bx + ay * by;
                return `${h.formatVectorName('a')} &sdot; ${h.formatVectorName('b')} = ${h.formatValue(ax.toFixed(1), '#ff7f0e')} &sdot; ${h.formatValue(bx.toFixed(1), '#2ca02c')} + ${h.formatValue(ay.toFixed(1), '#e377c2')} &sdot; ${h.formatValue(by.toFixed(1), '#17becf')} = ${h.formatValue(dot.toFixed(2), '#1f77b4')}`;
            });

            createCalcText(() => {
                const dot = (p1 as any).X() * (p2 as any).X() + (p1 as any).Y() * (p2 as any).Y();
                const aLen = (p1 as any).Dist(o);
                const bLen = (p2 as any).Dist(o);
                const mags = aLen * bLen;
                const cosine = mags !== 0 ? dot / mags : 0;
                return `${h.formatVectorName('a')} &sdot; ${h.formatVectorName('b')} = ${h.formatValue(aLen.toFixed(1), '#d62728')} &sdot; ${h.formatValue(bLen.toFixed(1), '#9467bd')} &sdot; ${h.formatValue(cosine.toFixed(2), '#8c564b')} = ${h.formatValue(dot.toFixed(2), '#1f77b4')}`;
            });
        }
    } as GraphConfig,

    // 5. Cosine Normalized (Unit Circle)
    'cosine-normalized': {
        isMultiBoard: true,
        boardAttributes: {
            boundingbox: [-1.2, 1.2, 1.2, -1.2],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            }
        },
        boardAttributes2: {
            boundingbox: [-1, 2.5, 7, -2.5],
            keepaspectratio: false
        },
        initializer: (boards: JXG.Board[]) => {
            new UnitCircleChart(boards[0], boards[1]).withCosineSimilarityMeasure(false);
        }
    } as GraphConfig,

    // 6. Cosine Distance
    'cosine-distance': {
        isMultiBoard: true,
        boardAttributes: {
            boundingbox: [-1.2, 1.2, 1.2, -1.2],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            }
        },
        boardAttributes2: {
            boundingbox: [-1, 2.5, 7, -2.5],
            keepaspectratio: false
        },
        initializer: (boards: JXG.Board[]) => {
            new UnitCircleChart(boards[0], boards[1]).withCosineSimilarityMeasure(true);
        }
    } as GraphConfig,

    // 7. Distance Comparison (Graph)
    'distance-comparison': {
        isMultiBoard: true,
        boardAttributes: {
            boundingbox: [-1.2, 1.2, 1.2, -1.2],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            }
        },
        boardAttributes2: {
            boundingbox: [-1, 2.5, 7, -2.5],
            keepaspectratio: false
        },
        initializer: (boards: JXG.Board[]) => {
            new UnitCircleChart(boards[0], boards[1])
                .withEuclideanDistanceMetric()
                .withCosineSimilarityMeasure(true);
        }
    } as GraphConfig,

    // 8. Movie Vectors (Normalized)
    'movie-vectors-normalized': {
        boardAttributes: {
            boundingbox: [-1.4, 1.4, 1.4, -1.4],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            },
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const coordsA = [5, 1];
            const coordsB = [4, 4];
            const coordsC = [0.5, 3];

            const normalize = (v: number[]) => {
                const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
                return [v[0] / mag, v[1] / mag];
            };

            const nA = normalize(coordsA);
            const nB = normalize(coordsB);
            const nC = normalize(coordsC);

            board.create('circle', [[0, 0], [1, 0]], { dash: 2, fixed: true, strokeColor: '#ccc' });
            const o = h.createOrigin(board);

            const pA = h.createVector(board, o, board.create('point', nA, { visible: false }), '#1a73e8', 'smart-label-circle-vector-a');
            pA.point2.setAttribute({ name: `<span class="vector-label" style="color:#1a73e8">a</span>`, visible: true, size: 0, withLabel: true, useMathJax: false });

            const pB = h.createVector(board, o, board.create('point', nB, { visible: false }), '#ea4335', 'smart-label-circle-vector-b');
            pB.point2.setAttribute({ name: `<span class="vector-label" style="color:#ea4335">b</span>`, visible: true, size: 0, withLabel: true, useMathJax: false });

            const pC = h.createVector(board, o, board.create('point', nC, { visible: false }), '#157845', 'smart-label-circle-vector-c');
            pC.point2.setAttribute({ name: `<span class="vector-label" style="color:#157845">c</span>`, visible: true, size: 0, withLabel: true, useMathJax: false });

            h.createAngleLabel(board, pA.point2, o, pB.point2, '#feae02', 0.5);
            h.createAngleLabel(board, pB.point2, o, pC.point2, '#feae02', 0.4);
        }
    } as GraphConfig,

    // 9. Movie Vectors (Popularity/Magnitude)
    'movie-vectors-popularity': {
        boardAttributes: {
            boundingbox: [-1, 10, 10, -1],
            axis: true,
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const o = h.createOrigin(board);

            const pA = h.createVector(board, o, board.create('point', [5, 1], { visible: false }), '#1a73e8', 'smart-label-circle-vector-a');
            pA.point2.setAttribute({ name: `<span class="vector-label" style="color:#1a73e8">a</span>`, visible: true, size: 0, withLabel: true });

            const pB = h.createVector(board, o, board.create('point', [9, 9], { visible: false }), '#ea4335', 'smart-label-circle-vector-b');
            pB.point2.setAttribute({ name: `<span class="vector-label" style="color:#ea4335">b</span>`, visible: true, size: 0, withLabel: true });

            const pC = h.createVector(board, o, board.create('point', [0.5, 3], { visible: false }), '#157845', 'smart-label-circle-vector-c');
            pC.point2.setAttribute({ name: `<span class="vector-label" style="color:#157845">c</span>`, visible: true, size: 0, withLabel: true });

            h.createAngleLabel(board, pA.point2, o, pB.point2, '#feae02', 1);
            h.createAngleLabel(board, pB.point2, o, pC.point2, '#feae02', 0.75);

            h.createMeasurementLine(board, pA.point2, pB.point2);
            h.createMeasurementLine(board, pA.point2, pC.point2);
            h.createMeasurementLine(board, pB.point2, pC.point2);
        }
    } as GraphConfig,

    'math-notations': {
        boardAttributes: {
            boundingbox: [-9, 5, 6, -4],
            axis: true,
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const o = h.createOrigin(board);
            const p1 = h.createVectorPoint(board, [3.5, 1], `\\( \\vec{a} \\)`, h.SIMILARITY_COLORS.aMag);
            const p2 = h.createVectorPoint(board, [2, 4], `\\( \\vec{b} \\)`, h.SIMILARITY_COLORS.aMag);

            h.createVector(board, o, p1, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-a');
            h.createVector(board, o, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-b');
            h.createMeasurementLine(board, p1, p2, h.SIMILARITY_COLORS.vector, 'smart-label-circle-vector-ab');
            h.createAngleLabel(board, p1, o, p2);

            const textX = -8.5;
            let textY = 6.5;
            const lineSpacing = 0.6;
            const c = h.SIMILARITY_COLORS;

            const createCalcText = (content: () => string) => {
                board.create('text', [textX, textY, content], {
                    fontSize: 12,
                    fontWeight: 'bold',
                    fixed: true,
                    useMathJax: false
                });
                textY -= lineSpacing;
            };

            // 1. Vector a coordinates
            createCalcText(() => `${h.formatVectorName('a')} = (${h.formatValue((p1 as any).X().toFixed(2), c.ax)}, ${h.formatValue((p1 as any).Y().toFixed(2), c.ay)})`);

            // 2. Vector b coordinates
            createCalcText(() => `${h.formatVectorName('b')} = (${h.formatValue((p2 as any).X().toFixed(2), c.bx)}, ${h.formatValue((p2 as any).Y().toFixed(2), c.by)})`);

            // 3. Euclidean Distance
            createCalcText(() => {
                const ax = (p1 as any).X().toFixed(2);
                const ay = (p1 as any).Y().toFixed(2);
                const bx = (p2 as any).X().toFixed(2);
                const by = (p2 as any).Y().toFixed(2);
                const dist = (p1 as any).Dist(p2).toFixed(2);
                return `||${h.formatVectorName('a')} - ${h.formatVectorName('b')}|| = ${dist} = &radic;((${h.formatValue(ax, c.ax)} - ${h.formatValue(bx, c.bx)})<sup>2</sup> + (${h.formatValue(ay, c.ay)} - ${h.formatValue(by, c.by)})<sup>2</sup>)`;
            });

            // 4. Magnitude a
            createCalcText(() => {
                const ax = (p1 as any).X().toFixed(2);
                const ay = (p1 as any).Y().toFixed(2);
                const mag = (p1 as any).Dist(o).toFixed(2);
                return `||${h.formatVectorName('a')}|| = ${h.formatValue(mag, c.aMag)} = &radic;(${h.formatValue(ax, c.ax)}<sup>2</sup> + ${h.formatValue(ay, c.ay)}<sup>2</sup>)`;
            });

            // 5. Magnitude b
            createCalcText(() => {
                const bx = (p2 as any).X().toFixed(2);
                const by = (p2 as any).Y().toFixed(2);
                const mag = (p2 as any).Dist(o).toFixed(2);
                return `||${h.formatVectorName('b')}|| = ${h.formatValue(mag, c.bMag)} = &radic;(${h.formatValue(bx, c.bx)}<sup>2</sup> + ${h.formatValue(by, c.by)}<sup>2</sup>)`;
            });

            // 6. Dot Product (Component)
            createCalcText(() => {
                const ax = (p1 as any).X();
                const ay = (p1 as any).Y();
                const bx = (p2 as any).X();
                const by = (p2 as any).Y();
                const dot = (ax * bx + ay * by).toFixed(2);
                return `${h.formatVectorName('a')} &sdot; ${h.formatVectorName('b')} = ${h.formatValue(dot, c.dot)} = ${h.formatValue(ax.toFixed(2), c.ax)} &sdot; ${h.formatValue(bx.toFixed(2), c.bx)} + ${h.formatValue(ay.toFixed(2), c.ay)} &sdot; ${h.formatValue(by.toFixed(2), c.by)}`;
            });

            // 7. Dot Product (Geometric)
            createCalcText(() => {
                const dot = (p1 as any).X() * (p2 as any).X() + (p1 as any).Y() * (p2 as any).Y();
                const aLen = (p1 as any).Dist(o);
                const bLen = (p2 as any).Dist(o);
                const mags = aLen * bLen;
                const cosine = mags !== 0 ? dot / mags : 0;
                return `${h.formatVectorName('a')} &sdot; ${h.formatVectorName('b')} = ${h.formatValue(dot.toFixed(2), c.dot)} = ||${h.formatVectorName('a')}|| ||${h.formatVectorName('b')}|| cos &theta; = ${h.formatValue(aLen.toFixed(2), c.aMag)} &sdot; ${h.formatValue(bLen.toFixed(2), c.bMag)} &sdot; ${h.formatValue(cosine.toFixed(2), c.cos)}`;
            });
            textY -= lineSpacing * 0.2; // Extra gap for fraction

            // 8. Cosine Similarity (Fraction)
            createCalcText(() => {
                const dot = (p1 as any).X() * (p2 as any).X() + (p1 as any).Y() * (p2 as any).Y();
                const aLen = (p1 as any).Dist(o);
                const bLen = (p2 as any).Dist(o);
                const mags = aLen * bLen;
                const cosine = mags !== 0 ? dot / mags : 0;

                return `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>cos &theta; = ${h.formatValue(cosine.toFixed(2), c.cos)} = </span>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="border-bottom: 1.5px solid black; padding: 0 4px;">
                            ${h.formatVectorName('a')} &sdot; ${h.formatVectorName('b')}
                        </div>
                        <div style="padding: 0 4px;">
                            ||${h.formatVectorName('a')}|| ||${h.formatVectorName('b')}||
                        </div>
                    </div>
                    <span> = </span>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="border-bottom: 1.5px solid black; padding: 0 4px; color:${c.dot};">
                            ${dot.toFixed(2)}
                        </div>
                        <div style="padding: 0 4px;">
                            ${h.formatValue(aLen.toFixed(2), c.aMag)} &sdot; ${h.formatValue(bLen.toFixed(2), c.bMag)}
                        </div>
                    </div>
                </div>
            `;
            });
        }
    } as GraphConfig,

    'perceptron-classification': {
        boardAttributes: {
            boundingbox: [-6, 6, 6, -6],
            axis: true,
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const classOnePoints = [
                { x: 4, y: 5, label: "spam" },
                { x: 2, y: 4, label: "spam" },
                { x: 0, y: 3, label: "spam" },
                { x: -4, y: 1, label: "spam" },
                { x: -1, y: 4, label: "spam" },
            ];

            const classTwoPoints = [
                { x: 4, y: 3, label: "not spam" },
                { x: 2, y: 2, label: "not spam" },
                { x: 0, y: 1, label: "not spam" },
                { x: -2, y: 0, label: "not spam" },
                { x: -4, y: -1, label: "not spam" },
                { x: 1, y: -1, label: "not spam" },
            ];

            new PerceptronChart(board, 1, classOnePoints, classTwoPoints, true);
        }
    } as GraphConfig,

    'perceptron-training': {
        boardAttributes: {
            boundingbox: [-6, 6, 6, -6],
            axis: true,
            showCopyright: false,
            navigation: {
                button: false // Disable the default zoom/pan buttons to keep it clean
            }
        },
        initializer: (
            board: JXG.Board,
            onLogUpdate?: (logs: string[]) => void,
            onRegisterActions?: (actions: Record<string, () => void>) => void
        ) => {
            const data = [
                { x: 4.0, y: 5.0, label: "spam", class: 1 },
                { x: 5.0, y: 4.0, label: "spam", class: 1 },
                { x: 3.0, y: 5.5, label: "spam", class: 1 },

                { x: 2.0, y: 1.0, label: "not spam", class: 0 },
                { x: 3.0, y: 0.5, label: "not spam", class: 0 },
                { x: 1.0, y: 2.0, label: "not spam", class: 0 },
            ];

            new PerceptronTrainingChart(board, data, onLogUpdate, onRegisterActions);
        }
    } as GraphConfig
};

export default registry;
