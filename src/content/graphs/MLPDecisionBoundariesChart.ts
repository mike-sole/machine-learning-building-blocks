import JXG from 'jsxgraph';
import * as h from './helpers';
import {
    calculateDotProduct,
    relu,
    calculateDecisionBoundaryAnchor,
    calculateBiasFromAnchorAndWeight
} from './utils/mlpMath';
import type { Vector2, WeightState } from './utils/mlpMath';

export interface MLPChartConfig {
    initialWeights?: {
        h1: WeightState;
        h2: WeightState;
        out: WeightState;
    };
    data?: Array<{ x: number; y: number; label: string; class: number }>;
}

export class MLPDecisionBoundariesChart {
    board: JXG.Board;
    config: MLPChartConfig;

    // Default XOR Data (Unique corners)
    defaultData = [
        { x: 2.0, y: 2.0, label: "spam", class: 1 },
        { x: -2.0, y: -2.0, label: "spam", class: 1 },
        { x: -2.0, y: 2.0, label: "not spam", class: 0 },
        { x: 2.0, y: -2.0, label: "not spam", class: 0 },
    ];

    constructor(board: JXG.Board, config: MLPChartConfig = {}) {
        this.board = board;
        this.config = config;
        this.board.setBoundingBox([0, 36, 21, 0], true);
        this.initVisuals();
    }

    getInitialWeights() {
        if (this.config.initialWeights) {
            return this.config.initialWeights;
        }
        return {
            h1: { w: { x: 1.0, y: 1.0 }, b: 0.3 },
            h2: { w: { x: -0.95, y: -1.05 }, b: 0.56 },
            out: { w: { x: 0.84, y: 0.86 }, b: -2.41 }
        };
    }

    getData() {
        return this.config.data || this.defaultData;
    }

    initVisuals() {
        const rInput = 1.5;
        const rNeuron = 4;
        const connectOffset = 0.5;

        // Node Centers
        const cI0 = { x: 4.5, y: 32 };
        const cI1 = { x: 10.5, y: 32 };
        const cI2 = { x: 16.5, y: 32 };
        const cH1 = { x: 5.5, y: 20 };
        const cH2 = { x: 15.5, y: 20 };
        const cOut = { x: 10.5, y: 5.5 };

        // --- Draw Arrows ---
        // Input -> Hidden
        const cI0H1 = this.drawExplicitConnection(cI0, rInput, cH1, rNeuron, -connectOffset, -2.5, 'purple');
        const cI0H2 = this.drawExplicitConnection(cI0, rInput, cH2, rNeuron, connectOffset, -2.5, 'purple');

        const cI1H1 = this.drawExplicitConnection(cI1, rInput, cH1, rNeuron, -connectOffset, 0, '#1A5276');
        const cI1H2 = this.drawExplicitConnection(cI1, rInput, cH2, rNeuron, connectOffset, 0, '#1A5276');

        const cI2H1 = this.drawExplicitConnection(cI2, rInput, cH1, rNeuron, -connectOffset, 2.5, '#196F3D');
        const cI2H2 = this.drawExplicitConnection(cI2, rInput, cH2, rNeuron, connectOffset, 2.5, '#196F3D');

        // Hidden -> Output
        const cBiasOut = { x: 3.5, y: 13 };
        const cBiasOutConnection = this.drawExplicitConnection(cBiasOut, rInput, cOut, rNeuron, 1.5, -2.5, 'purple', 1.5);

        const cH1Out = this.drawExplicitConnection(cH1, rNeuron, cOut, rNeuron, 0, 0, '#1A5276');
        const cH2Out = this.drawExplicitConnection(cH2, rNeuron, cOut, rNeuron, 0, 2.5, '#196F3D');

        // --- Nodes ---
        this.createInputNode(cI0.x, cI0.y, rInput, "Bias Input (x₀)");
        this.createInputNode(cI1.x, cI1.y, rInput, "Input Node 1 (x₁)");
        this.createInputNode(cI2.x, cI2.y, rInput, "Input Node 2 (x₂)");
        this.createInputNode(cBiasOut.x, cBiasOut.y, rInput, "Bias Input");

        // --- Hidden Layer Graphs ---
        const hiddenBounds = [-3, 3, 3, -3];
        const initialWeights = this.getInitialWeights();
        const data = this.getData();

        const mapH1 = this.createNeuronView(cH1.x, cH1.y, rNeuron, "Hidden Node 1 (h₁)", hiddenBounds, 1);
        const ptsH1 = this.plotDataPoints(mapH1, data);
        let h1State = { ...initialWeights.h1 };

        const mapH2 = this.createNeuronView(cH2.x, cH2.y, rNeuron, "Hidden Node 2 (h₂)", hiddenBounds, 1);
        const ptsH2 = this.plotDataPoints(mapH2, data);
        let h2State = { ...initialWeights.h2 };

        // --- Output Layer Graph ---
        const hBounds = [-5, 5, 5, -5];
        const mapOut = this.createNeuronView(cOut.x, cOut.y, rNeuron, "Output Node", hBounds, 1);

        // Output Points
        const outputPoints = data.map(d => {
            const [ix, iy] = mapOut.map(0, 0);
            return this.board.create('point', [ix, iy], {
                name: d.class === 1 ? 'Spam' : 'Not Spam',
                size: 3,
                fillColor: d.class === 1 ? '#ef4444' : '#22c55e',
                strokeColor: '#374151',
                strokeWidth: 1,
                fixed: true,
                withLabel: true,
                label: {
                    fontSize: 10,
                    offset: [0, 10],
                    anchorX: 'middle',
                    anchorY: 'bottom'
                }
            });
        });

        const updateOutputPoints = () => {
            data.forEach((d, i) => {
                // Calculate activations using extracted math
                const z1 = calculateDotProduct({ x: d.x, y: d.y }, h1State);
                const a1 = relu(z1);

                const z2 = calculateDotProduct({ x: d.x, y: d.y }, h2State);
                const a2 = relu(z2);

                const [bx, by] = mapOut.map(a1, a2);
                outputPoints[i].setPosition(JXG.COORDS_BY_USER, [bx, by]);
            });
            this.board.update();
        };

        // Setup Interactive Neurons
        this.setupInteractiveNeuron(mapH1, h1State, 3, ptsH1, [cI1H1.label, cI2H1.label], cI0H1.label, (w, b) => {
            h1State = { w, b };
            updateOutputPoints();
        });

        this.setupInteractiveNeuron(mapH2, h2State, 3, ptsH2, [cI1H2.label, cI2H2.label], cI0H2.label, (w, b) => {
            h2State = { w, b };
            updateOutputPoints();
        });

        this.setupInteractiveNeuron(mapOut, initialWeights.out, 1.2, [], [cH1Out.label, cH2Out.label], cBiasOutConnection.label);

        updateOutputPoints();
    }

    createInputNode(cx: number, cy: number, r: number, title: string) {
        this.board.create('circle', [[cx, cy], r], {
            fillColor: '#f3f4f6',
            fillOpacity: 1,
            strokeColor: '#374151',
            strokeWidth: 2,
            fixed: true,
            highlight: false
        });
        this.board.create('text', [cx, cy + r + 0.7, title], {
            anchorX: 'middle', fontSize: 13, fontWeight: 'bold', fixed: true
        });
    }

    drawExplicitConnection(c1: { x: number, y: number }, r1: number, c2: { x: number, y: number }, r2: number, xOffsetStart: number, xOffsetEnd: number, labelColor: string = '#374151', yOffsetStart: number = 0) {
        const startX = c1.x + xOffsetStart;
        const startY = c1.y - r1 + yOffsetStart;
        const endX = c2.x + xOffsetEnd;
        const endY = c2.y + r2 + 2.5;

        const arrow = this.board.create('arrow', [[startX, startY], [endX, endY]], {
            strokeColor: '#9ca3af',
            strokeWidth: 2,
            fixed: true,
            highlight: false
        });

        const ratio = 1.0;
        const lblX = startX + (endX - startX) * ratio;
        const lblY = startY + (endY - startY) * ratio;

        const label = this.board.create('text', [lblX, lblY, ''], {
            anchorX: 'left', anchorY: 'top', fontSize: 13, fontWeight: 'bold',
            strokeColor: labelColor, fixed: true,
            offset: [5, -5]
        });

        return { arrow, label };
    }

    createNeuronView(cx: number, cy: number, r: number, title: string, logicalBounds: number[], step: number) {
        const circle = this.board.create('circle', [[cx, cy], r], {
            fillColor: '#ffffff',
            fillOpacity: 1,
            highlightFillColor: '#ffffff',
            strokeColor: '#374151',
            strokeWidth: 2,
            fixed: true,
            highlight: false
        });

        this.board.create('text', [cx, cy + r + 0.7, title], {
            anchorX: 'middle', fontSize: 13, fontWeight: 'bold', fixed: true
        });

        const [minX, maxX, maxY, minY] = logicalBounds;
        const width = maxX - minX;
        const height = maxY - minY;

        const scaleX = (2 * r) / width;
        const scaleY = (2 * r) / height;

        const map = (x: number, y: number) => {
            return [
                cx + (x - (minX + maxX) / 2) * scaleX,
                cy + (y - (minY + maxY) / 2) * scaleY
            ];
        };

        const unmap = (bx: number, by: number) => {
            const x = ((bx - cx) / scaleX) + (minX + maxX) / 2;
            const y = ((by - cy) / scaleY) + (minY + maxY) / 2;
            return { x, y };
        };

        // Grid Lines
        for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += step) {
            if (x === 0) continue;
            const [vx] = map(x, (minY + maxY) / 2);
            const dx = Math.abs(vx - cx);
            if (dx < r) {
                const dy = Math.sqrt(r * r - dx * dx);
                this.board.create('segment', [[vx, cy - dy], [vx, cy + dy]], {
                    strokeColor: '#e5e7eb', strokeWidth: 1, fixed: true, highlight: false
                });
            }
        }

        for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += step) {
            if (y === 0) continue;
            const [, vy] = map((minX + maxX) / 2, y);
            const dy = Math.abs(vy - cy);
            if (dy < r) {
                const dx = Math.sqrt(r * r - dy * dy);
                this.board.create('segment', [[cx - dx, vy], [cx + dx, vy]], {
                    strokeColor: '#e5e7eb', strokeWidth: 1, fixed: true, highlight: false
                });
            }
        }

        // Axes
        this.board.create('segment', [[cx - r, cy], [cx + r, cy]], {
            strokeColor: '#9ca3af', strokeWidth: 1.5, fixed: true, highlight: false
        });
        this.board.create('segment', [[cx, cy - r], [cx, cy + r]], {
            strokeColor: '#9ca3af', strokeWidth: 1.5, fixed: true, highlight: false
        });

        // Ticks
        const tickSize = 0.05;
        const rTick = tickSize * r;

        for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += step) {
            if (x === 0) continue;
            const [vx, vy] = map(x, (minY + maxY) / 2);
            if (Math.abs(vx - cx) < r) {
                this.board.create('segment', [[vx, vy - rTick], [vx, vy + rTick]], {
                    strokeColor: '#6b7280', strokeWidth: 1.5, fixed: true, highlight: false
                });
                this.board.create('text', [vx, vy - rTick - 0.2, x.toString()], {
                    anchorX: 'middle', anchorY: 'top',
                    fontSize: 9, strokeColor: '#6b7280', fixed: true, highlight: false
                });
            }
        }

        for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += step) {
            if (y === 0) continue;
            const [vx_center, vy] = map((minX + maxX) / 2, y);
            if (Math.abs(vy - cy) < r) {
                this.board.create('segment', [[vx_center - rTick, vy], [vx_center + rTick, vy]], {
                    strokeColor: '#6b7280', strokeWidth: 1.5, fixed: true, highlight: false
                });
                this.board.create('text', [vx_center - rTick - 0.2, vy, y.toString()], {
                    anchorX: 'right', anchorY: 'middle',
                    fontSize: 9, strokeColor: '#6b7280', fixed: true, highlight: false
                });
            }
        }

        return { map, unmap, cx, cy, scaleX, scaleY, circle, r };
    }

    setupInteractiveNeuron(view: any, initialState: WeightState, _clipRadius: number, dataPoints?: any[], incomingWeightLabels?: any[], biasLabel?: any, onUpdate?: (w: Vector2, b: number) => void) {
        let weights = { ...initialState.w };
        let bias = initialState.b;

        const { map, unmap } = view;

        const getAnchor = () => calculateDecisionBoundaryAnchor({ w: weights, b: bias });

        // Initial Positions
        const p0 = getAnchor();
        const [ax, ay] = map(p0.x, p0.y);
        const [tx, ty] = map(p0.x + weights.x, p0.y + weights.y);
        const [ox, oy] = map(0, 0);

        const guideLine = this.board.create('line', [[ox, oy], [tx, ty]], { visible: false });

        const biasAnchor = this.board.create('glider', [ax, ay, guideLine], {
            name: 'b',
            size: 2,
            face: 'o',
            color: '#D35400',
            fixed: false,
            withLabel: false,
            highlight: { size: 4, strokeWidth: 2, strokeColor: '#D35400', fillOpacity: 0.5 }
        });

        const weightTip = this.board.create('point', [tx, ty], {
            name: h.formatVectorName('w'),
            size: 2,
            face: 'o',
            color: '#D35400',
            fixed: false,
            withLabel: false,
            highlight: { size: 4, strokeWidth: 2, strokeColor: '#D35400', fillOpacity: 0.5 }
        });

        this.board.create('arrow', [biasAnchor, weightTip], {
            strokeColor: 'black', strokeWidth: 2
        });

        const boundaryLine = this.board.create('perpendicular', [guideLine, biasAnchor], {
            visible: false
        });

        const i1 = this.board.create('intersection', [boundaryLine, view.circle, 0], { visible: false });
        const i2 = this.board.create('intersection', [boundaryLine, view.circle, 1], { visible: false });

        this.board.create('segment', [i1, i2], {
            strokeColor: 'black',
            dash: 2,
            strokeWidth: 2,
            fixed: true
        });

        const distanceLabel: any = this.board.create('text', [0, 0, ''], {
            anchorX: 'right', anchorY: 'bottom', fontSize: 10, strokeColor: 'purple', fontWeight: 'bold', fixed: true
        });

        const weightLabel: any = this.board.create('text', [0, 0, ''], {
            fontSize: 10, useMathJax: false, display: 'html', fixed: true
        });

        const updateLabels = () => {
            const pAnchor = unmap(biasAnchor.X(), biasAnchor.Y());
            const pTip = unmap(weightTip.X(), weightTip.Y());

            const wCurrent = { x: pTip.x - pAnchor.x, y: pTip.y - pAnchor.y };

            // Use extracted math for bias calculation
            const bCurrent = calculateBiasFromAnchorAndWeight(pAnchor, wCurrent);

            const cWX = `<span style="color:#1A5276; font-weight:bold">w₁ ${wCurrent.x.toFixed(2)}</span>`;
            const cWY = `<span style="color:#196F3D; font-weight:bold">w₂ ${wCurrent.y.toFixed(2)}</span>`;
            const labelHtml = `${cWX}, ${cWY}`;

            weightLabel.setText(labelHtml);
            weightLabel.setPosition(JXG.COORDS_BY_USER, [weightTip.X() + 0.2, weightTip.Y() + 0.2]);

            distanceLabel.setText(`w₀ ${bCurrent.toFixed(2)}`);
            distanceLabel.setPosition(JXG.COORDS_BY_USER, [biasAnchor.X(), biasAnchor.Y()]);

            guideLine.point2.setPosition(JXG.COORDS_BY_USER, [weightTip.X(), weightTip.Y()]);

            if (dataPoints) {
                dataPoints.forEach((item: any) => {
                    const z = calculateDotProduct(item.data, { w: wCurrent, b: bCurrent });
                    const val = Math.max(0, z); // ReLU
                    const type = item.data.class === 1 ? 'Spam' : 'Not Spam';
                    item.label.setText(`<div style="text-align: center; font-size: 10px; line-height: 1.2;">${type}<br/>(${val.toFixed(2)})</div>`);
                });
            }

            if (incomingWeightLabels && incomingWeightLabels.length === 2) {
                incomingWeightLabels[0].setText(`w₁ ${wCurrent.x.toFixed(2)}`);
                incomingWeightLabels[1].setText(`w₂ ${wCurrent.y.toFixed(2)}`);
            }

            if (biasLabel) {
                biasLabel.setText(`w₀ ${bCurrent.toFixed(2)}`);
            }

            if (onUpdate) {
                onUpdate(wCurrent, bCurrent);
            }
        };

        let lastAnchorPos = { x: biasAnchor.X(), y: biasAnchor.Y() };

        biasAnchor.on('drag', () => {
            const currentX = biasAnchor.X();
            const currentY = biasAnchor.Y();

            const dx = currentX - lastAnchorPos.x;
            const dy = currentY - lastAnchorPos.y;

            weightTip.setPosition(JXG.COORDS_BY_USER, [weightTip.X() + dx, weightTip.Y() + dy]);

            lastAnchorPos = { x: currentX, y: currentY };

            updateLabels();
            this.board.update();
        });

        biasAnchor.on('down', () => {
            lastAnchorPos = { x: biasAnchor.X(), y: biasAnchor.Y() };
        });

        weightTip.on('drag', () => {
            updateLabels();
        });

        updateLabels();
    }

    plotDataPoints(view: any, data: any[]) {
        const { map, cx, cy } = view;
        return data.map(p => {
            const [bx, by] = map(p.x, p.y);
            const dx = bx - cx;
            const dy = by - cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const dirX = dx / dist;
            const dirY = dy / dist;

            const offset = 0.5;
            const lblX = bx + dirX * offset;
            const lblY = by + dirY * offset;

            const anchorX = dirX > 0 ? 'left' : 'right';
            const anchorY = dirY > 0 ? 'bottom' : 'top';

            const point = this.board.create('point', [bx, by], {
                size: 3,
                fillColor: p.class === 1 ? '#ef4444' : '#22c55e',
                strokeColor: p.class === 1 ? '#ef4444' : '#22c55e',
                withLabel: false,
                fixed: true
            });

            const label = this.board.create('text', [lblX, lblY, ''], {
                fontSize: 10,
                strokeColor: 'black',
                anchorX: anchorX,
                anchorY: anchorY,
                fixed: true,
                display: 'html'
            });

            return { point, label, data: p };
        });
    }
}
