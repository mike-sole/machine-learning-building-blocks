import React from 'react';

/** Buttons above a chart (e.g. "Train Step", "Reset"). */
export const ChartButtons: React.FC<{ actions: Record<string, () => void> }> = ({ actions }) => (
    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(actions).map(([label, action]) => (
            <button key={label} onClick={action} className="chart-button">{label}</button>
        ))}
    </div>
);

/** A chart's log: one line per entry, an empty string for a blank line. */
export const ChartLog: React.FC<{ lines: React.ReactNode[] }> = ({ lines }) => (
    <div data-chart-log style={{
        width: '100%',
        maxWidth: '700px',
        marginBottom: '32px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontFamily: 'monospace',
        overflowX: 'auto',
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
    }}>
        {lines.map((line, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>{line === '' ? ' ' : line}</div>
        ))}
    </div>
);
