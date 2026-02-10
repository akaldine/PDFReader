import React, { useRef } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import type { Annotation } from '../types';
import { cn } from '../lib/utils';

interface DraggableAnnotationProps {
    annotation: Annotation;
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onDragStop: (id: string, x: number, y: number, newPage?: number) => void;
    isDraggable?: boolean;
}

export const DraggableAnnotation: React.FC<DraggableAnnotationProps> = ({
    annotation,
    onUpdate,
    onDelete,
    onDragStop,
    isDraggable = true,
}) => {
    const nodeRef = useRef<HTMLDivElement>(null);



    // Convert % to pixels for initial placement? 
    // No, we want to leverage the CSS positioning for responsiveness.
    // If we give Draggable `position={{x:0, y:0}}`, it forces usage of CSS for base position.
    // Then the user drags, creating a delta.
    // On stop, we commit that delta to the base CSS and reset delta to 0.

    // But we need to calculate the actual new position.
    // data.x / data.y in onStop are the drag deltas if we use position={0,0}.

    const onStop = (e: DraggableEvent, _data: DraggableData) => {
        // Get client coordinates of the event
        let clientX: number, clientY: number;
        // Handle MouseEvent and TouchEvent safely
        if ('changedTouches' in e) {
            const touch = (e as React.TouchEvent | TouchEvent).changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = (e as React.MouseEvent | MouseEvent).clientX;
            clientY = (e as React.MouseEvent | MouseEvent).clientY;
        }

        // Find the page element under the cursor
        // precise elements detection
        const elements = document.elementsFromPoint(clientX, clientY);
        const pageElement = elements.find(el => el.hasAttribute('data-page-number'));

        if (!pageElement) return;

        const newPage = parseInt(pageElement.getAttribute('data-page-number') || '1', 10);
        const rect = pageElement.getBoundingClientRect();

        // We use the dragged element's bounding rect to calculate center-based position
        // This is more robust than using data.x/y deltas for cross-page
        const draggableRect = nodeRef.current?.getBoundingClientRect();
        if (!draggableRect) return;

        const centerX = draggableRect.left + (draggableRect.width / 2);
        const centerY = draggableRect.top + (draggableRect.height / 2);

        // Calculate new percentage position relative to the NEW page
        const newXPercent = ((centerX - rect.left) / rect.width) * 100;
        const newYPercent = ((centerY - rect.top) / rect.height) * 100;

        // Ensure within bounds (optional, but good)
        // const clampedX = Math.max(0, Math.min(100, newXPercent));
        // const clampedY = Math.max(0, Math.min(100, newYPercent));

        onDragStop(annotation.id, newXPercent, newYPercent, newPage);
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            onStop={onStop}
            position={{ x: 0, y: 0 }} // Force controlled position to 0,0 so we always drag from "current" css point
            disabled={!isDraggable}
        >
            <div
                ref={nodeRef}
                className="absolute group"
                style={{
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`,
                    transform: 'translate(-50%, -50%)', // This might conflict with Draggable's transform?
                    // Draggable applies transform: translate(x,px, ypx).
                    // If we also have our own transform, they might conflict or overwrite.
                    // react-draggable applies the transform style inline.
                    // So we should NOT have our own transform in the style prop if possible, OR use a wrapper.
                    // But we need translate(-50%, -50%) to center the annotation on the point.
                    // Wrappers are safer.
                }}
            >
                {/* We need an inner wrapper for our own styling/centering logic */}
                <div style={{ transform: 'translate(-50%, -50%)' }} className="absolute">
                    <div
                        className="border p-1"
                        style={{
                            borderColor: annotation.type === 'text' ? 'transparent' : 'transparent',
                            // Highlight on hover done via CSS group-hover usually
                        }}
                    >
                        <div className={annotation.type === 'text' ? 'border border-transparent hover:border-blue-500' : 'border border-dashed border-transparent hover:border-blue-500'}>
                            {annotation.type === 'text' ? (
                                <input
                                    autoFocus
                                    value={annotation.content}
                                    onChange={(e) => onUpdate(annotation.id, e.target.value)}
                                    className={cn(
                                        "bg-transparent border-none outline-none text-black font-sans text-sm p-1",
                                        isDraggable ? "pointer-events-none cursor-move" : "cursor-text"
                                    )}
                                    style={{ minWidth: '100px' }}
                                    readOnly={isDraggable}
                                    placeholder="Type here..."
                                />
                            ) : (
                                <img
                                    src={annotation.content}
                                    alt="signature"
                                    className="max-h-20 min-h-12 min-w-24 select-none pointer-events-none"
                                    draggable={false}
                                />
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(annotation.id);
                                }}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-sm z-50 cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};
