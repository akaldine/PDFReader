import React from 'react';
import { Upload, PenTool, Save, ZoomIn, ZoomOut, Type } from 'lucide-react';
import { cn } from '../lib/utils';

interface ToolbarProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onSign: () => void;
    onSave: () => void;
    scale: number;
    mode: 'interact' | 'text';
    onModeChange: (mode: 'interact' | 'text') => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onUpload, onZoomIn, onZoomOut, onSign, onSave, scale, mode, onModeChange }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
            <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
                    <Upload size={18} />
                    Open PDF
                    <input type="file" accept="application/pdf" onChange={onUpload} className="hidden" />
                </label>
                <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                    <Save size={18} />
                    Save PDF
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onModeChange('interact')}
                    className={cn("p-2 rounded-md transition-colors", mode === 'interact' ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100")}
                    title="Interact / Move"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M15 19l-3 3-3-3M2 12h20M12 2v20" /></svg>
                </button>
                <button
                    onClick={() => onModeChange('text')}
                    className={cn("p-2 rounded-md transition-colors", mode === 'text' ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100")}
                    title="Add Text"
                >
                    <Type size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={onZoomOut} className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
                    <ZoomOut size={20} />
                </button>
                <span className="text-sm font-medium w-16 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={onZoomIn} className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
                    <ZoomIn size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={onSign} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <PenTool size={18} />
                    Sign
                </button>
            </div>
        </div>
    );
};
