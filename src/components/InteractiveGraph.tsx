import React, { Suspense } from 'react';
import { mafsCharts } from '../content/graphs/mafsCharts';

interface InteractiveGraphProps {
    id: string;
}

/** Renders the chart a post names in a ```graph block. */
export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({ id }) => {
    const Chart = mafsCharts[id];
    if (!Chart) {
        console.warn(`No graph implementation found for id: ${id}`);
        return null;
    }
    return (
        <div className="sm:px-4" style={{ width: '100%', margin: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Suspense>
                <Chart id={id} />
            </Suspense>
        </div>
    );
};
