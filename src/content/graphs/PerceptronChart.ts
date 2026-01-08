import JXG from 'jsxgraph';
import * as h from './helpers';

export interface PointData {
    x: number;
    y: number;
    label: string;
}

export class PerceptronChart {
    board: JXG.Board;
    showLabelOption: number;
    classOnePoints: any[] = [];
    classTwoPoints: any[] = [];
    bias: any;
    weightVector: any;
    weightUnitVector: any;
    weightVectorX: number;
    weightVectorY: number;

    constructor(board: JXG.Board, showLabelOption: number, classOnePointsData: PointData[], classTwoPointsData: PointData[], showBias: boolean) {
        this.board = board;
        this.showLabelOption = showLabelOption;

        // Initial weight vector position
        this.weightVectorX = -2;
        this.weightVectorY = 2;

        this.weightVector = this.board.create(
            "point",
            [this.weightVectorX, this.weightVectorY],
            {
                face: "o",
                color: "purple",
                size: 2,
                name: h.formatVectorName('w'),
                useMathJax: false
            }
        );

        this.weightUnitVector = this.board.create(
            "point",
            [
                () => this.getUnitVector(this.weightVector).X(),
                () => this.getUnitVector(this.weightVector).Y(),
            ],
            {
                face: "o",
                size: 2,
                name: h.formatVectorName('w'),
                visible: false,
                useMathJax: false
            }
        );

        const invisibleWeightVectorLine = this.board.create(
            "line",
            [this.weightUnitVector, [0, 0]],
            {
                visible: false,
            }
        );

        classOnePointsData.forEach((pt) => this.addPoint(0, pt.x, pt.y, `\\text{${pt.label}}`));
        classTwoPointsData.forEach((pt) => this.addPoint(1, pt.x, pt.y, `\\text{${pt.label}}`));

        this.bias = this.board.create("glider", [-0.5, 0.5, invisibleWeightVectorLine], {
            size: 2,
            visible: showBias,
            name: 'b',
            withLabel: true,
            label: {
                offset: [5, 5],
                color: 'purple',
                fontWeight: 'bold'
            },
            color: 'purple',
            useMathJax: false
        });

        if (showBias) {
            this.bias.on("drag", () => this.updateBias());
        }

        this.weightVector.on("drag", () => this.updateWeightVec());

        this.board.create("perpendicular", [invisibleWeightVectorLine, this.bias],
            {
                strokeWidth: 3,
                dash: 2
            }
        );

        this.board.create("arrow", [this.bias, this.weightVector], {
            fixed: true,
        });

        this.updatePointClassifications();
    }

    getUnitVector(point: any) {
        const x = point.X();
        const y = point.Y();
        const mag = Math.sqrt(x * x + y * y);
        // Return a mock object with X() and Y() methods to match JXG Point interface usage
        return {
            X: () => (mag === 0 ? 0 : x / mag),
            Y: () => (mag === 0 ? 0 : y / mag)
        };
    }

    updateBias() {
        // move the weight vector with the bias
        this.weightVector.setPositionDirectly(JXG.COORDS_BY_USER, [
            this.weightVectorX + this.bias.X(),
            this.weightVectorY + this.bias.Y(),
        ]);

        this.updatePointClassifications();
    }

    updateWeightVec() {
        // keep track of when the user adjusts the weight vector
        this.weightVectorX = this.weightVector.X() - this.bias.X();
        this.weightVectorY = this.weightVector.Y() - this.bias.Y();

        this.updatePointClassifications();
    }

    updatePointClassifications() {
        this.classOnePoints.forEach((pt) => {
            const dotProduct =
                this.weightVector.X() * (pt.X() - this.bias.X()) +
                this.weightVector.Y() * (pt.Y() - this.bias.Y());

            // Class 1 is "Spam". Pred >= 0 means Spam.
            // Correct if Pred >= 0.
            const isCorrect = dotProduct >= 0;

            pt.setAttribute({ color: isCorrect ? "green" : "red" });
            pt.setAttribute({ name: `Spam (${dotProduct.toFixed(2)})` });
        });

        this.classTwoPoints.forEach((pt) => {
            const dotProduct =
                this.weightVector.X() * (pt.X() - this.bias.X()) +
                this.weightVector.Y() * (pt.Y() - this.bias.Y());

            // Class 2 is "Not Spam". Pred < 0 means Not Spam.
            // Correct if Pred < 0.
            const isCorrect = dotProduct < 0;

            pt.setAttribute({ color: isCorrect ? "green" : "red" });
            pt.setAttribute({ name: `Not Spam (${dotProduct.toFixed(2)})` });
        });
    }

    addPoint(classLbl: number, x: number, y: number, name: string) {
        const pt = this.board.create("point", [x, y], {
            face: "o",
            size: 2,
            name: name,
            useMathJax: false,
            withLabel: true,
            label: {
                offset: [10, 10],
                cssClass: 'tex2jax_ignore'
            }
        });

        (pt as any).on("drag", () => this.updatePointClassifications());

        if (classLbl === 0) {
            this.classOnePoints.push(pt);
        } else {
            this.classTwoPoints.push(pt);
        }
    }
}
