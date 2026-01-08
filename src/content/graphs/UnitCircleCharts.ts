import JXG from 'jsxgraph';

/*
 * Create a board where the x-axis has Math.PI scale.
 * x-axis ticks are labelled as degrees from 0 to 360.
 */
export class AngleDegreesMetricsGraph {
    board: JXG.Board;

    curve: any;

    constructor(board: JXG.Board) {
        this.board = board;
    }

    getBoard() {
        return this.board;
    }

    withCosineSimilarityMeasure(invert: boolean) {
        // cosine function graph
        const minValue = 0;
        const maxValue = Math.PI * 2;
        this.curve = this.board.create("functiongraph", [
            (x: number) => {
                const value = Math.cos(x);
                return invert ? 1 - value : value;
            },
            minValue,
            maxValue,
        ]);

        return this;
    }

    withEuclideanDistanceMetric() {
        // euclidean distance function graph
        const minAngleValue = 0;
        const maxAngleValue = Math.PI * 2;
        this.board.create(
            "functiongraph",
            [
                (x: number) => {
                    const cx = Math.cos(x);
                    const cy = Math.sin(x);
                    return (JXG.Math.Geometry as any).distance([1, 0], [cx, cy]);
                },
                minAngleValue,
                maxAngleValue,
            ],
            { strokeColor: "red" }
        );

        return this;
    }
}

export class UnitCircleSimilarityMeasuresChart {
    unitCirclePoint: any;
    graph: AngleDegreesMetricsGraph;
    board: JXG.Board;

    constructor(board: JXG.Board, unitCirclePoint: any) {
        this.unitCirclePoint = unitCirclePoint;
        this.board = board;
        this.graph = new AngleDegreesMetricsGraph(board);
    }

    private getAngle(): number {
        const x = this.unitCirclePoint.X();
        const y = this.unitCirclePoint.Y();
        let angle = Math.atan2(y, x);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }

    getBoard() {
        return this.board;
    }

    withCosineSimilarityMeasure(invert: boolean) {
        // cosine function graph
        this.graph.withCosineSimilarityMeasure(invert);

        const similarityName = invert ? '1 - Cosine Similarity' : 'Cosine Similarity';

        // point on the cosine function graph that corresponds to the point on the unit circle
        this.board.create(
            "point",
            [
                () => {
                    return this.getAngle();
                },
                () => {
                    const value = this.unitCirclePoint.X();
                    return invert ? 1 - value : value;
                },
            ],
            {
                fixed: true,
                color: "#1a73e8",
                name: similarityName,
                withLabel: true,
                label: {
                    position: 'rt',
                    offset: [0, 15]
                }
            }
        );

        return this;
    }

    withEuclideanDistanceMetric() {
        // euclidean distance function graph
        this.graph.withEuclideanDistanceMetric();

        // point on the distance function graph that corresponds to the point on the unit circle
        this.board.create(
            "point",
            [
                () => {
                    return this.getAngle();
                },
                () => {
                    const distance = (JXG.Math.Geometry as any).distance(
                        [1, 0],
                        [this.unitCirclePoint.X(), this.unitCirclePoint.Y()]
                    );

                    return distance;
                },
            ],
            {
                fixed: true,
                color: "#ff33ff",
                name: "Euclidean Distance"
            }
        );

        return this;
    }
}

export class UnitCircleChart {
    board: JXG.Board;
    metricsBoard: JXG.Board;
    unitCirclePoint: any;
    vectorB: any;
    similarityMetricsChart: UnitCircleSimilarityMeasuresChart;
    distAB: any;

    constructor(board: JXG.Board, metricsBoard: JXG.Board) {
        this.board = board;
        this.metricsBoard = metricsBoard;
        this.board.addChild(this.metricsBoard);

        const unitCircle = this.board.create(
            "circle",
            [
                [0, 0],
                [1, 0],
            ],
            { dash: 2, fixed: true }
        );

        // point on the unit circle which can be dragged around the radius
        this.unitCirclePoint = this.board.create("point", [0.707, 0.707], {
            slideObject: unitCircle,
            name: '<span class="vector-label">a</span>',
            useMathJax: false
        });

        this.board.create(
            "perpendicular",
            [this.board.defaultAxes.x, this.unitCirclePoint],
            [{ strokeColor: "#ff0000", visible: true }, { visible: false }] as any
        );

        this.board.create(
            "perpendicular",
            [this.board.defaultAxes.y, this.unitCirclePoint],
            [{ strokeColor: "#0000ff", visible: true }, { visible: false }] as any
        );

        const arrowA = this.board.create("arrow", [[0, 0], this.unitCirclePoint], {
            fixed: true,
        });
        this.board.create("smartlabel", [arrowA], {
            measure: "length",
            cssClass: "smart-label-pure smart-label-circle-vector-a",
        });

        this.vectorB = this.board.create("point", [1, 0], {
            face: "o",
            size: 0,
            name: '<span class="vector-label">b</span>',
            fixed: true,
            useMathJax: false
        });

        const origin = this.board.create("point", [0, 0], {
            face: "o",
            size: 0,
            name: "",
            fixed: true,
        });

        const arrowB = this.board.create("arrow", [[0, 0], this.vectorB], {
            fixed: true,
        });
        this.board.create("smartlabel", [arrowB], {
            measure: "length",
            cssClass: "smart-label-pure smart-label-circle-vector-b",
        });

        this.board.create("angle", [this.vectorB, origin, this.unitCirclePoint], {
            radius: 1,
            fixed: true,
            name: () => {
                return `${(JXG.Math.Geometry as any).trueAngle(
                    this.vectorB,
                    [0, 0],
                    this.unitCirclePoint
                ).toFixed(1)}°`;
            },
            useMathJax: false
        });

        this.similarityMetricsChart = new UnitCircleSimilarityMeasuresChart(
            this.metricsBoard,
            this.unitCirclePoint
        );
    }

    withCosineSimilarityMeasure(invert: boolean) {
        this.similarityMetricsChart.withCosineSimilarityMeasure(invert);
        return this;
    }

    withEuclideanDistanceMetric() {

        const distLine = this.board.create('line', [this.unitCirclePoint, this.vectorB], {
            dash: 2,
            strokeWidth: 2,
            straightFirst: false,
            straightLast: false,
            fixed: true
        });
        this.board.create('smartlabel', [distLine], {
            measure: 'length',
            cssClass: 'smart-label-pure smart-label-circle-vector-ab tex2jax_ignore',
            unit: ' ',
            useMathJax: false,
            parse: false
        });

        this.similarityMetricsChart.withEuclideanDistanceMetric();

        return this;
    }
}
