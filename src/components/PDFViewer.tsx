import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { cn } from '../lib/utils';
import type { Annotation } from '../types';
import { DraggableAnnotation } from './DraggableAnnotation';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
// Set worker source
// Adjust for Electron (file protocol)
pdfjs.GlobalWorkerOptions.workerSrc = window.location.protocol === 'file:'
    ? './pdf.worker.min.mjs'
    : '/pdf.worker.min.mjs';

interface PDFViewerProps {
    file: File | null;
    className?: string;
    annotations: Annotation[];
    onAddAnnotation: (page: number, x: number, y: number) => void;
    onUpdateAnnotation: (id: string, content: string) => void;
    onDeleteAnnotation: (id: string) => void;
    onUpdateAnnotationPosition: (id: string, x: number, y: number, newPage?: number) => void;
    scale?: number;
    mode: 'interact' | 'text';
    onPageChange?: (page: number) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
    file,
    className,
    annotations,
    onAddAnnotation,
    onUpdateAnnotation,
    onDeleteAnnotation,
    onUpdateAnnotationPosition,
    scale = 1.0,
    mode,
    onPageChange // New prop
}) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const pageRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // IntersectionObserver to track regular scrolling
    React.useEffect(() => {
        if (!numPages || !onPageChange) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const pageNum = Number(entry.target.getAttribute('data-page-number'));
                        if (!isNaN(pageNum)) {
                            onPageChange(pageNum);
                        }
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% visible
                root: null,
            }
        );

        pageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [numPages, onPageChange]);

    const handlePageClick = (e: React.MouseEvent, pageNumber: number) => {
        // Update active page on click regardless of mode
        if (onPageChange) onPageChange(pageNumber);

        // Only if clicking purely on the page, not on an existing annotation
        if ((e.target as HTMLElement).closest('.annotation')) return;

        // Only add annotation if in 'text' mode
        if (mode !== 'text') return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        onAddAnnotation(pageNumber, x, y);
    };

    if (!file) {
        return (
            <div className={cn("flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50", className)}>
                <p className="text-gray-500">No PDF selected</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center overflow-auto bg-gray-100 p-8 h-full">
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col gap-4"
            >
                {Array.from(new Array(numPages), (_el, index) => {
                    const pageNumber = index + 1;
                    const pageAnnotations = annotations.filter(a => a.page === pageNumber);

                    return (
                        <div
                            key={`page_${pageNumber}`}
                            data-page-number={pageNumber}
                            ref={el => { pageRefs.current[index] = el; }}
                            className="relative shadow-lg"
                            onClick={(e) => handlePageClick(e, pageNumber)}
                        >
                            <Page
                                pageNumber={pageNumber}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                scale={scale}
                                className="bg-white"
                                width={800}
                            />
                            {pageAnnotations.map(annotation => (
                                <DraggableAnnotation
                                    key={annotation.id}
                                    annotation={annotation}
                                    onUpdate={onUpdateAnnotation}
                                    onDelete={onDeleteAnnotation}
                                    onDragStop={onUpdateAnnotationPosition}
                                    isDraggable={mode === 'interact'}
                                />
                            ))}
                        </div>
                    );
                })}
            </Document>
        </div>
    );
};
