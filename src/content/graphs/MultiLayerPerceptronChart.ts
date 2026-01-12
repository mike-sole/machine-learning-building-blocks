import JXG from 'jsxgraph';

export class MultiLayerPerceptronChart {
    board: JXG.Board;
    layerSizes: number[];
    neurons: any[][] = [];
    connections: any[] = [];

    constructor(board: JXG.Board, layerSizes: number[]) {
        this.board = board;
        this.layerSizes = layerSizes;
        this.initVisuals();
    }

    initVisuals() {
        const layerSpacing = 4;
        const neuronSpacing = 1.5;
        const startX = -((this.layerSizes.length - 1) * layerSpacing) / 2;

        // Create Neurons
        const nodeRadius = 0.5; // Logical radius
        this.layerSizes.forEach((size, layerIndex) => {
            const x = startX + layerIndex * layerSpacing;
            const startY = ((size - 1) * neuronSpacing) / 2;
            this.neurons[layerIndex] = [];

            for (let i = 0; i < size; i++) {
                const y = startY - i * neuronSpacing;

                // Determine color/type based on layer
                let color = '#ccc'; // Hidden
                let label = '';
                if (layerIndex === 0) {
                    color = '#a6cee3'; // Input - Light Blue
                    label = `<i>x</i><sub>${i + 1}</sub>`;
                } else if (layerIndex === this.layerSizes.length - 1) {
                    color = '#b2df8a'; // Output - Light Green
                    label = `<i>ŷ</i>`; // Assuming single output for now or y_i
                    if (size > 1) label = `<i>ŷ</i><sub>${i + 1}</sub>`;
                } else {
                    color = '#fdbf6f'; // Hidden - Light Orange
                    label = `<i>h</i><sub>${layerIndex},${i + 1}</sub>`;
                }

                const neuron = this.board.create('point', [x, y], {
                    fillColor: color,
                    strokeColor: '#333',
                    strokeWidth: 2,
                    size: nodeRadius,
                    sizeUnit: 'user', // Use logical units
                    fixed: true,
                    name: label,
                    withLabel: true,
                    label: {
                        offset: [0, 0],
                        anchorX: 'middle',
                        anchorY: 'middle',
                        fontSize: 14,
                        display: 'html', // Use HTML rendering
                        useMathJax: false
                    }
                });
                this.neurons[layerIndex].push(neuron);
            }
        });

        // Helper to get point on circumference
        const getPerimeterPoint = (p1: any, p2: any) => {
            const dx = p2.X() - p1.X();
            const dy = p2.Y() - p1.Y();
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return [p1.X(), p1.Y()];

            // Move radius amount towards the other point
            const ratio = nodeRadius / dist;
            return [
                p1.X() + dx * ratio,
                p1.Y() + dy * ratio
            ];
        };

        // Create Connections
        for (let l = 0; l < this.layerSizes.length - 1; l++) {
            const currentLayer = this.neurons[l];
            const nextLayer = this.neurons[l + 1];

            currentLayer.forEach(source => {
                nextLayer.forEach(target => {
                    // Calculate start and end points on the perimeter of the nodes
                    const startCoords = getPerimeterPoint(source, target);
                    const endCoords = getPerimeterPoint(target, source);

                    this.board.create('arrow', [startCoords, endCoords], {
                        strokeColor: '#999',
                        strokeWidth: 1.5,
                        strokeOpacity: 0.8,
                        layer: 11, // Ensure on top
                        fixed: true,
                        highlightStrokeColor: '#000',
                        highlightStrokeWidth: 2,
                        highlightStrokeOpacity: 1
                    });
                });
            });
        }

        // Add layer labels
        this.layerSizes.forEach((_, layerIndex) => {
            const x = startX + layerIndex * layerSpacing;
            let text = 'Hidden Layer';
            if (layerIndex === 0) text = 'Input Layer';
            else if (layerIndex === this.layerSizes.length - 1) text = 'Output Layer';

            this.board.create('text', [x, -2.5, text], {
                anchorX: 'middle',
                fontSize: 14,
                fontWeight: 'bold',
                fixed: true
            });
        });
    }
}
