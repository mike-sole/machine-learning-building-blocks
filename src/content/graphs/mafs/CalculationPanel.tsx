import React from 'react';

/**
 * Lines of live calculations shown with a chart: over the board's top-left corner on wider
 * screens, below the board on phones (see .mafs-panel in mafs-theme.css).
 */
export const CalculationPanel: React.FC<{ lines: React.ReactNode[] }> = ({ lines }) => (
    <>
        {lines.map((line, i) => (
            <div key={i} data-chart-label className="mafs-panel-line">{line}</div>
        ))}
    </>
);

/** A vector's name, italic with an arrow above it. */
export const V: React.FC<{ name: string }> = ({ name }) => <span className="vector-label">{name}</span>;

/** A number in the colour used for its quantity throughout the chart. */
export const Value: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
    <span style={{ color }}>{children}</span>
);
