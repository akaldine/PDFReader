import React, { useState } from 'react';
import { PDFViewer } from './components/PDFViewer';
import { Toolbar } from './components/Toolbar';
import { SignatureModal } from './components/SignatureModal';
import type { Annotation } from './types';
import { v4 as uuidv4 } from 'uuid';
import { savePdf } from './lib/pdfUtils';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'signature' | 'interact'>('text');
  const [currentPage, setCurrentPage] = useState(1);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  const handleSign = () => {
    setIsSignatureModalOpen(true);
  };

  const handleSaveSignature = (signatureData: string) => {
    // Add signature to the CURRENT page center
    const newAnnotation: Annotation = {
      id: uuidv4(),
      type: 'signature',
      x: 50,
      y: 50,
      content: signatureData,
      page: currentPage,
    };
    setAnnotations(prev => [...prev, newAnnotation]);
    setMode('interact'); // Auto-switch to interact mode
  };

  const handleSave = async () => {
    if (!file) return;
    try {
      await savePdf(file, annotations);
    } catch (e) {
      console.error("Failed to save PDF", e);
      alert("Failed to save PDF");
    }
  };

  const handleAddAnnotation = (page: number, x: number, y: number) => {
    if (mode === 'text') {
      const newAnnotation: Annotation = {
        id: uuidv4(),
        type: 'text',
        x,
        y,
        content: '',
        page,
      };
      setAnnotations(prev => [...prev, newAnnotation]);
    }
  };

  const handleUpdateAnnotation = (id: string, content: string) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, content } : a));
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateAnnotationPosition = (id: string, x: number, y: number, newPage?: number) => {
    setAnnotations(prev => prev.map(a =>
      a.id === id ? { ...a, x, y, page: newPage ?? a.page } : a
    ));
  };


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Toolbar
        onUpload={handleUpload}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSign={handleSign}
        onSave={handleSave}
        scale={scale}
        mode={mode as 'interact' | 'text'}
        onModeChange={(m) => setMode(m)}
      />
      <div className="flex-1 overflow-hidden relative">
        <PDFViewer
          file={file}
          className="h-full"
          scale={scale}
          annotations={annotations}
          onAddAnnotation={handleAddAnnotation}
          onUpdateAnnotation={handleUpdateAnnotation}
          onDeleteAnnotation={handleDeleteAnnotation}
          onUpdateAnnotationPosition={handleUpdateAnnotationPosition}
          mode={mode as 'interact' | 'text'}
          onPageChange={setCurrentPage}
        />
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  );
}

export default App;
