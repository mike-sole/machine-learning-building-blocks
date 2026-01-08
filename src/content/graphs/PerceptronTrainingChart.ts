import JXG from 'jsxgraph';
import { SIMILARITY_COLORS } from './helpers';

export interface PointData {
    x: number;
    y: number;
    label: string;
    class: number; // 0 or 1
}

export class PerceptronTrainingChart {
    board: JXG.Board;
    points: any[] = [];
    data: PointData[];

    // Model State
    weights: { x: number; y: number };
    bias: number;
    learningRate: number = 0.05;
    currentIndex: number = 0;
    epoch: number = 0;
    isConverged: boolean = false;

    // Visual Elements
    weightVectorArrow: any;
    decisionLine: any;
    biasGlider: any;
    currentPointHighlight: any;

    // Debug Visuals (Multiline support)
    debugLines: any[] = [];
    debugInfo: string[] = ["Ready to train."];

    // Callbacks for external interaction
    onLogUpdate?: (logs: string[]) => void;
    onRegisterActions?: (actions: Record<string, () => void>) => void;

    constructor(
        board: JXG.Board,
        data: PointData[],
        onLogUpdate?: (logs: string[]) => void,
        onRegisterActions?: (actions: Record<string, () => void>) => void
    ) {
        this.board = board;
        this.data = data;
        this.onLogUpdate = onLogUpdate;
        this.onRegisterActions = onRegisterActions;

        // Initialize with weights and bias that place the anchor at (0.5, -0.5)
        this.weights = { x: 1, y: -1 };
        this.bias = -1;

        this.initVisuals();

        // Register Actions
        if (this.onRegisterActions) {
            this.onRegisterActions({
                'Train Step': () => this.trainStep(),
                'Reset': () => this.reset()
            });
        }

        // Initial log update
        if (this.onLogUpdate) {
            this.onLogUpdate(this.debugInfo);
        }
    }

    initVisuals() {
        // 1. Draw Data Points
        this.data.forEach((d) => {
            const p = this.board.create('point', [d.x, d.y], {
                face: d.class === 1 ? 'x' : 'o',
                size: 3,
                color: d.class === 1 ? 'red' : 'green',
                fixed: true,
                name: d.label,
                withLabel: true,
                label: {
                    offset: [5, 5],
                    fontSize: 10,
                    color: 'black'
                },
                useMathJax: false
            });
            this.points.push(p);
        });

        // 2. Draw Decision Boundary Line
        this.decisionLine = this.board.create('line', [() => this.bias, () => this.weights.x, () => this.weights.y], {
            strokeColor: 'black',
            strokeWidth: 2,
            dash: 2,
            useMathJax: false
        });

        // 3. Draw Weight Vector
        // 3. Draw Weight Vector from Decision Boundary (Bias Point)

        // Calculate the anchor point on the line closest to origin: P = (-b / |w|^2) * w
        const getAnchor = () => {
            const wMagSq = (this.weights.x ** 2) + (this.weights.y ** 2);
            if (wMagSq === 0) return [0, 0];
            const k = -this.bias / wMagSq;
            return [k * this.weights.x, k * this.weights.y];
        };

        const anchor = this.board.create('point', [
            () => getAnchor()[0],
            () => getAnchor()[1]
        ], {
            name: 'b',
            size: 3,
            color: 'purple', // Bias: Purple
            fixed: true,
            label: { offset: [5, 5] },
            useMathJax: false
        });

        // 3. Draw Weight Vector from Decision Boundary (Bias Point)
        const weightTip = this.board.create('point', [
            () => {
                const a = getAnchor();
                return a[0] + this.weights.x;
            },
            () => {
                const a = getAnchor();
                return a[1] + this.weights.y;
            }
        ], { visible: false });

        this.weightVectorArrow = this.board.create('arrow', [anchor, weightTip], {
            strokeColor: SIMILARITY_COLORS.vector,
            strokeWidth: 3,
            fixed: true,
            useMathJax: false
        });

        // X and Y component lines starting from the bias anchor
        const compPoint = this.board.create('point', [
            () => (weightTip as any).X(),
            () => (anchor as any).Y()
        ], { visible: false });

        this.board.create('segment', [anchor, compPoint], {
            strokeColor: '#1A5276', // Weight New X: Navy
            dash: 2,
            strokeWidth: 1,
            fixed: true
        });

        this.board.create('segment', [compPoint, weightTip], {
            strokeColor: '#196F3D', // Weight New Y: Dark Green
            dash: 2,
            strokeWidth: 1,
            fixed: true
        });

        // Component Labels relative to anchor
        this.board.create('text', [
            () => ((anchor as any).X() + (compPoint as any).X()) / 2,
            () => (anchor as any).Y() - 0.2,
            () => this.weights.x.toFixed(2)
        ], {
            fontSize: 10,
            fontWeight: 'bold',
            color: '#1A5276', // Weight New X: Navy
            fixed: true,
            anchorX: 'middle',
            useMathJax: false
        });

        this.board.create('text', [
            () => (compPoint as any).X() + 0.1,
            () => ((compPoint as any).Y() + (weightTip as any).Y()) / 2,
            () => this.weights.y.toFixed(2)
        ], {
            fontSize: 10,
            fontWeight: 'bold',
            color: '#196F3D', // Weight New Y: Dark Green
            fixed: true,
            useMathJax: false
        });

        // 4. Bias Distance Visualization (Origin to Anchor)
        const origin = this.board.create('point', [0, 0], { visible: false, fixed: true });

        // 4. Bias Distance Visualization (Origin to Anchor)
        this.board.create('segment', [origin, anchor], {
            strokeColor: '#B22222', // Distance: Firebrick Red
            dash: 2,
            strokeWidth: 1,
            fixed: true
        });

        this.board.create('text', [
            () => (anchor as any).X() / 2 - 0.2, // Offset slightly to avoid overlapping the line
            () => (anchor as any).Y() / 2,
            () => {
                const dist = Math.abs(this.bias) / Math.sqrt(this.weights.x ** 2 + this.weights.y ** 2);
                return dist.toFixed(2);
            }
        ], {
            fontSize: 10,
            color: '#B22222', // Distance: Firebrick Red
            fixed: true,
            anchorX: 'left', // Switched to left to avoid overlapping the line now that it's shorter
            useMathJax: false,
            display: 'html'
        });

        // 5. Combined Label: \vec{w} (x, y) - Using HTML for component colors
        this.board.create('text', [
            () => (weightTip as any).X() + 0.15,
            () => (weightTip as any).Y() + 0.15,
            () => {
                const cWX = `<span style="color:#1A5276; font-weight:bold">${this.weights.x.toFixed(2)}</span>`;
                const cWY = `<span style="color:#196F3D; font-weight:bold">${this.weights.y.toFixed(2)}</span>`;
                return `<span class="vector-label">w</span> (${cWX}, ${cWY})`;
            }
        ], {
            fontSize: 12,
            cssClass: 'smart-label-pure',
            color: SIMILARITY_COLORS.vector,
            fixed: true,
            useMathJax: false,
            display: 'html'
        });

        // 6. Highlight Circle with Color-Coded Coordinate Label
        this.currentPointHighlight = this.board.create('point', [0, 0], {
            face: 'o',
            size: 8,
            strokeColor: 'orange',
            fillColor: 'none',
            strokeWidth: 2,
            visible: false,
            name: '',
            label: {
                visible: true,
                offset: [10, 10],
                useMathJax: false,
                display: 'html',
                text: () => {
                    const idx = this.debugInfo[0].match(/\((.*)\)/);
                    if (!idx) return '';
                    const parts = idx[1].split(', ');
                    const cXP = `<span style="color:#E67E22; font-weight:bold">${parts[0].replace(/<[^>]*>?/gm, '')}</span>`;
                    const cYP = `<span style="color:#8E44AD; font-weight:bold">${parts[1].replace(/<[^>]*>?/gm, '')}</span>`;
                    return `(${cXP}, ${cYP})`;
                },
            },
            useMathJax: false
        });


    }

    trainStep() {
        if (this.isConverged) return;

        const p = this.data[this.currentIndex];

        // Highlight current point
        this.currentPointHighlight.setPosition(JXG.COORDS_BY_USER, [p.x, p.y]);
        this.currentPointHighlight.setAttribute({ visible: true });

        // Predict
        const z = (this.weights.x * p.x) + (this.weights.y * p.y) + this.bias;
        const prediction = z > 0 ? 1 : 0;
        const error = p.class - prediction;

        if (error !== 0) {
            // Capture old state
            const oldWx = this.weights.x;
            const oldWy = this.weights.y;
            const oldBias = this.bias;

            // Update Rule
            const dx = this.learningRate * error * p.x;
            const dy = this.learningRate * error * p.y;
            const db = this.learningRate * error;

            this.weights.x += dx;
            this.weights.y += dy;
            this.bias += db;

            // 11-Color Scheme for perfect component identity
            const cXP = (t: string) => `<span style="color:#E67E22; font-weight:bold">${t}</span>`; // Point X: Orange
            const cYP = (t: string) => `<span style="color:#8E44AD; font-weight:bold">${t}</span>`; // Point Y: Purple
            const cWXold = (t: string) => `<span style="color:#2980B9; font-weight:bold">${t}</span>`; // Weight Old X: Blue
            const cWYold = (t: string) => `<span style="color:#27AE60; font-weight:bold">${t}</span>`; // Weight Old Y: Green
            const cWXup = (t: string) => `<span style="color:#E91E63; font-weight:bold">${t}</span>`; // Weight Update X: Pink
            const cWYup = (t: string) => `<span style="color:#795548; font-weight:bold">${t}</span>`; // Weight Update Y: Brown
            const cWXnew = (t: string) => `<span style="color:#1A5276; font-weight:bold">${t}</span>`; // Weight New X: Navy
            const cWYnew = (t: string) => `<span style="color:#196F3D; font-weight:bold">${t}</span>`; // Weight New Y: Dark Green
            const cBold = (t: string) => `<span style="color:#D4AC0D; font-weight:bold">${t}</span>`;  // Bias Old: Gold
            const cBup = (t: string) => `<span style="color:#A93226; font-weight:bold">${t}</span>`;   // Bias Update: Red-Brown
            const cBnew = (t: string) => `<span style="color:#17202A; font-weight:bold">${t}</span>`;  // Bias New: Black
            const cD = (t: string) => `<span style="color:#B22222; font-weight:bold">${t}</span>`;      // Distance: Firebrick Red
            const cE = (t: string) => `<span style="color:orange; font-weight:bold">${t}</span>`;       // Error highlight

            this.debugInfo = [
                `Randomly selected data point: (${cXP(p.x.toFixed(2))}, ${cYP(p.y.toFixed(2))})`,
                `Actual = ${p.class.toString()}, Expected = ${prediction.toString()}`,
                `Error = (Actual - Expected) = ${cE(error.toString())}`,
                ``,
                `Weights old: [${cWXold(oldWx.toFixed(2))}, ${cWYold(oldWy.toFixed(2))}]`,
                `Weights Update (Δw) = learning rate * error * selected data point`,
                `Weights Update (Δw) = 0.05 * ${cE(error.toString())} * [${cXP(p.x.toFixed(2))}, ${cYP(p.y.toFixed(2))}] = [${cWXup(dx.toFixed(2))}, ${cWYup(dy.toFixed(2))}]`,
                `Weights new = weights old + Δw = [${cWXold(oldWx.toFixed(2))}, ${cWYold(oldWy.toFixed(2))}] + [${cWXup(dx.toFixed(2))}, ${cWYup(dy.toFixed(2))}]`,
                `Weights new = [${cWXnew(this.weights.x.toFixed(2))}, ${cWYnew(this.weights.y.toFixed(2))}]`,
                ``,
                `Bias old: ${cBold(oldBias.toFixed(2))}`,
                `Bias Update (Δb) = learning rate * error = 0.05 * ${cE(error.toString())} = ${cBup(db.toFixed(2))}`,
                `Bias new = bias old + Δb = ${cBold(oldBias.toFixed(2))} + ${cBup(db.toFixed(2))} = ${cBnew(this.bias.toFixed(2))}`,
                ``,
                `Boundary Distance = |bias| / ||weights||`,
                `Boundary Distance = ${cBnew('abs(' + this.bias.toFixed(2) + ')')} / √(${cWXnew(this.weights.x.toFixed(2))}² + ${cWYnew(this.weights.y.toFixed(2))}²) = ${cD((Math.abs(this.bias) / Math.sqrt(this.weights.x ** 2 + this.weights.y ** 2)).toFixed(2))}`
            ];

            console.log(`Update: Error=${error}, Point=(${p.x},${p.y})`);
        } else {
            // Re-define help constants for parity even in no-change case
            const cXP = (t: string) => `<span style="color:#E67E22; font-weight:bold">${t}</span>`; // Point X: Orange
            const cYP = (t: string) => `<span style="color:#8E44AD; font-weight:bold">${t}</span>`; // Point Y: Purple
            const cWXnew = (t: string) => `<span style="color:#1A5276; font-weight:bold">${t}</span>`; // Weight New X: Navy
            const cWYnew = (t: string) => `<span style="color:#196F3D; font-weight:bold">${t}</span>`; // Weight New Y: Dark Green
            const cBnew = (t: string) => `<span style="color:#17202A; font-weight:bold">${t}</span>`;  // Bias New: Black
            const cD = (t: string) => `<span style="color:#B22222; font-weight:bold">${t}</span>`;      // Distance: Firebrick Red

            this.debugInfo = [
                `Randomly selected data point: (${cXP(p.x.toFixed(2))}, ${cYP(p.y.toFixed(2))})`,
                `Actual = ${p.class.toString()}, Expected = ${prediction.toString()}`,
                `Error = 0 (Correct prediction!)`,
                `No update required.`,
                ``,
                `Current Weights: [${cWXnew(this.weights.x.toFixed(2))}, ${cWYnew(this.weights.y.toFixed(2))}]`,
                `Current Bias: ${cBnew(this.bias.toFixed(2))}`,
                ``,
                `Boundary Distance = |bias| / ||weights||`,
                `Boundary Distance = ${cBnew('abs(' + this.bias.toFixed(2) + ')')} / √(${cWXnew(this.weights.x.toFixed(2))}² + ${cWYnew(this.weights.y.toFixed(2))}²) = ${cD((Math.abs(this.bias) / Math.sqrt(this.weights.x ** 2 + this.weights.y ** 2)).toFixed(2))}`,
            ];
        }

        // Notify via callback
        if (this.onLogUpdate) {
            this.onLogUpdate(this.debugInfo);
        }

        // Move to next point
        this.currentIndex = (this.currentIndex + 1) % this.data.length;

        this.board.update();
    }

    reset() {
        this.weights = { x: 1, y: -1 };
        this.bias = -1;
        this.currentIndex = 0;
        this.isConverged = false;
        this.currentPointHighlight.setAttribute({ visible: false });
        this.debugInfo = ["Reset. Ready to train."];

        if (this.onLogUpdate) {
            this.onLogUpdate(this.debugInfo);
        }

        this.board.update();
    }
}
