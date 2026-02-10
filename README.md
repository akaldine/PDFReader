# PDF Editor & Reader

A modern, lightweight, and secure PDF editor built for the desktop. This application allows you to view, annotate, and sign PDF documents with ease, running entirely locally on your machine.

## Key Features

### 📄 PDF Viewing & Navigation
-   **High-Fidelity Rendering**: powered by `react-pdf` for accurate document display.
-   **Zoom Controls**: Easily zoom in and out to closely inspect documents.
-   **Page Navigation**: Smooth scrolling and page tracking.

### ✍️ Annotation Tools
-   **Add Text**: Click anywhere to type text directly onto the PDF.
-   **Interactive Mode**: Switch to "Interact" mode to drag and reposition text or signatures without accidental editing.
-   **Cross-Page Support**: Drag annotations seamlessly from one page to another.

### ✒️ Advanced Signature System
-   **Multiple Input Methods**:
    -   **Draw**: Use your mouse or trackpad to draw your signature.
    -   **Type**: Type your name and have it converted to a stylized cursive signature.
-   **Saved Signatures**: Save your signature for future use. Instantly apply your saved signature to new documents from the "Saved" tab.
-   **Smart Placement**: Signatures are automatically added to the center of the page you are currently viewing.
-   **Resizing**: Signatures are automatically scaled to professional dimensions.

### 💾 Save & Export
-   **Local Processing**: All modifications happen locally. No files are uploaded to external servers.
-   **PDF Re-assembly**: Uses `pdf-lib` to embed your annotations and signatures as native PDF elements, ensuring compatibility with any PDF reader.

---

## Technical Stack

This project is built using modern web technologies wrapped in Electron for a native desktop experience.

-   **Core Framework**: [React](https://react.dev/) (v18)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Desktop Runtime**: [Electron](https://www.electronjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Build Tool**: [Vite](https://vitejs.dev/)

### Key Libraries
-   **`react-pdf`**: For rendering PDF pages in the DOM.
-   **`pdf-lib`**: For modifying the underlying PDF binary (adding annotations/images) and saving the file.
-   **`react-draggable`**: Enabling smooth drag-and-drop functionality for annotations.
-   **`react-signature-canvas`**: Providing the drawing pad interface for signatures.
-   **`lucide-react`**: For the beautiful and consistent icon set.

## Getting Started

### Prerequisites
-   Node.js (v16 or higher)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/akaldine/PDFReader.git
    cd PDFReader
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

To run the application in development mode (with Hot Module Replacement):

```bash
npm run electron:dev
```

This will launch both the Vite dev server and the Electron window.

### Building for Production

To create a distributable executable (e.g., .exe for Windows):

```bash
npm run electron:build
```
The output will be in the `dist-electron` directory.
