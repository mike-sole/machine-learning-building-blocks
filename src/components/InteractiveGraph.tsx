import React, { useEffect, useRef } from 'react';
import JXG from 'jsxgraph';
import registry from '../content/graphs/registry';
import type { GraphConfig } from '../content/graphs/registry';

// Import JSXGraph CSS
import '../jsxgraph.css';

interface InteractiveGraphProps {
    id: string;
    height?: number;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({ id }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const container2Ref = useRef<HTMLDivElement>(null);
    const boardRef = useRef<JXG.Board | null>(null);
    const board2Ref = useRef<JXG.Board | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Enable MathJax
        JXG.Options.text.useMathJax = true;

        // Get graph config
        const graphEntry = registry[id];
        if (!graphEntry) {
            console.warn(`No graph implementation found for id: ${id}`);
            return;
        }

        // Check if it's a multi-board graph
        const isMultiBoard = typeof graphEntry === 'object' && 'isMultiBoard' in graphEntry && graphEntry.isMultiBoard;
        const initGraph = typeof graphEntry === 'function' ? graphEntry : (graphEntry as GraphConfig).initializer;

        if (isMultiBoard && !container2Ref.current) {
            console.error('Multi-board graph requires second container');
            return;
        }

        // Initialize board(s)
        const containerId = `jxgbox-${id}`;
        containerRef.current.id = containerId;

        const customAttributes = typeof graphEntry === 'object' && 'boardAttributes' in graphEntry ? graphEntry.boardAttributes : {};

        const boardConfig = {
            boundingbox: [-5, 5, 5, -5],
            axis: true,
            showCopyright: false,
            pan: { enabled: false } as any,
            zoom: { enabled: false } as any,
            keepaspectratio: true,
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 1 } as any },
                y: { ticks: { insertTicks: false, ticksDistance: 1 } as any }
            },
            ...customAttributes
        };

        const board = JXG.JSXGraph.initBoard(containerId, boardConfig as any);
        boardRef.current = board;

        if (isMultiBoard && container2Ref.current) {
            const containerId2 = `jxgbox-${id}-2`;
            container2Ref.current.id = containerId2;

            const customAttributes2 = typeof graphEntry === 'object' && 'boardAttributes2' in graphEntry ? graphEntry.boardAttributes2 : {};

            // Second board config for metrics graph
            const board2Config = {
                boundingbox: [-1, 2.5, 7, -2.5],
                axis: true,
                showCopyright: false,
                pan: { enabled: false } as any,
                zoom: { enabled: false } as any,
                keepaspectratio: true,
                defaultAxes: {
                    x: {
                        ticks: {
                            scale: Math.PI,
                            scaleSymbol: '°',
                            ticksDistance: 0.5,
                            insertTicks: false,
                            minorTicks: 0
                        } as any
                    },
                    y: {
                        ticks: {
                            ticksDistance: 0.5
                        } as any
                    }
                },
                ...customAttributes2
            };

            const board2 = JXG.JSXGraph.initBoard(containerId2, board2Config as any);
            board2Ref.current = board2;

            // Configure x-axis label formatting for degrees
            const xAxis = board2.defaultAxes.x as any;
            const xTicks = xAxis.ticks[0] as any;
            xTicks.generateLabelText = function (tick: any) {
                const tickValue = (180 / Math.PI) * tick.usrCoords[1];
                return this.formatLabelText(tickValue.toFixed(1));
            };

            // Call multi-board initializer
            (initGraph as any)([board, board2]);

            // Re-run MathJax for both boards, with a small delay to ensuring DOM is ready
            const MathJax = (window as any).MathJax;
            if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
                setTimeout(() => {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, containerId]);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, containerId2]);
                }, 10);
            }

            // Re-typeset after interaction
            board.on('up', () => {
                if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
                    setTimeout(() => {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, containerId]);
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, containerId2]);
                    }, 10);
                }
            });
        } else {
            // Single board initialization
            (initGraph as any)(board);

            // Re-run MathJax
            const MathJax = (window as any).MathJax;
            if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, containerId]);
            }

            // Re-typeset after interaction
            board.on('up', () => {
                if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
                    setTimeout(() => {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, containerId]);
                    }, 10);
                }
            });
        }

        return () => {
            if (boardRef.current) {
                JXG.JSXGraph.freeBoard(boardRef.current);
            }
            if (board2Ref.current) {
                JXG.JSXGraph.freeBoard(board2Ref.current);
            }
        };
    }, [id]);

    // Check if multi-board
    const graphEntry = registry[id];
    const isMultiBoard = graphEntry && typeof graphEntry === 'object' && 'isMultiBoard' in graphEntry && graphEntry.isMultiBoard;


    const containerStyle = (graphEntry && typeof graphEntry === 'object' && 'containerStyle' in graphEntry) ? graphEntry.containerStyle : {};

    if (isMultiBoard) {
        return (
            <div className="w-full my-8 px-4" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '1040px',
                    justifyContent: 'center',
                    ...containerStyle
                }}>
                    <div
                        ref={containerRef}
                        className="jxgbox"
                        style={{ flex: '1 1 0', minWidth: '300px', maxWidth: '500px', aspectRatio: '1 / 1', border: '1px solid #eee', borderRadius: '8px' }}
                    />
                    <div
                        ref={container2Ref}
                        className="jxgbox"
                        style={{ flex: '1 1 0', minWidth: '300px', maxWidth: '500px', aspectRatio: '1 / 1', border: '1px solid #eee', borderRadius: '8px' }}
                    />
                </div>
            </div>
        );
    }




    return (
        <div className="w-full my-8 flex justify-center px-4 sm:px-0" style={{ display: 'flex', justifyContent: 'center' }}>
            <div
                ref={containerRef}
                className="jxgbox"
                style={{ width: '100%', maxWidth: '700px', aspectRatio: '1 / 1', border: '1px solid #eee', borderRadius: '8px', ...containerStyle }}
            />
        </div>
    );
};
