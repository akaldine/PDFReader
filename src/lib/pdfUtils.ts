import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Annotation } from '../types';

export async function savePdf(file: File, annotations: Annotation[]) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    for (const annotation of annotations) {
        const pageIndex = annotation.page - 1;
        if (pageIndex < 0 || pageIndex >= pages.length) continue;

        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        // Convert percentage coordinates to PDF points
        const x = (annotation.x / 100) * width;
        // PDF y-axis starts from bottom
        const y = height - ((annotation.y / 100) * height);

        if (annotation.type === 'text') {
            page.drawText(annotation.content, {
                x,
                y: y - 12, // Adjust for font height (approx)
                size: 14, // Match UI font size
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });
        } else if (annotation.type === 'signature') {
            const pngImage = await pdfDoc.embedPng(annotation.content);
            const pngDims = pngImage.scale(1);

            // Define max dimensions for the signature on the PDF (e.g., 200x60 points)
            const maxWidth = 150;
            const maxHeight = 50;

            // Calculate scale to fit
            const scaleWidth = maxWidth / pngDims.width;
            const scaleHeight = maxHeight / pngDims.height;
            const scale = Math.min(scaleWidth, scaleHeight, 1); // Don't scale up, only down

            const scaledWidth = pngDims.width * scale;
            const scaledHeight = pngDims.height * scale;

            page.drawImage(pngImage, {
                x: x - (scaledWidth / 2), // Center the image horizontally
                y: y - (scaledHeight / 2), // Center the image vertically
                width: scaledWidth,
                height: scaledHeight,
            });
        }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `signed-${file.name}`;
    link.click();
}
