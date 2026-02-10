import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { cn } from '../lib/utils';
import { X, Check, Trash2, Type } from 'lucide-react';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (signatureData: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'saved'>('draw');
    const [typedName, setTypedName] = useState('');
    const [savedSignature, setSavedSignature] = useState<string | null>(null);
    const [saveForFuture, setSaveForFuture] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('savedSignature');
            setSavedSignature(saved);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const clear = () => sigCanvas.current?.clear();

    const handleSave = () => {
        let signatureToSave: string | null = null;

        if (activeTab === 'draw') {
            if (sigCanvas.current) {
                // ... (existing draw logic)
                try {
                    const trimmed = sigCanvas.current.getTrimmedCanvas();
                    if (trimmed.width === 0 || trimmed.height === 0) throw new Error("Empty");
                    signatureToSave = trimmed.toDataURL('image/png');
                } catch (e) {
                    signatureToSave = sigCanvas.current.getCanvas().toDataURL('image/png');
                }
            }
        } else if (activeTab === 'type') {
            if (!typedName.trim()) {
                alert("Please type your name.");
                return;
            }
            // ... (existing type logic)
            // Duplicate logic needs refactoring or just copy-paste for now to get the dataURL
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = 400;
                canvas.height = 100;
                ctx.font = 'italic 48px "Dancing Script", cursive';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(typedName, 200, 50);
                signatureToSave = canvas.toDataURL('image/png');
            }
        } else if (activeTab === 'saved' && savedSignature) {
            signatureToSave = savedSignature;
        }

        if (signatureToSave) {
            if (saveForFuture) {
                localStorage.setItem('savedSignature', signatureToSave);
            }
            onSave(signatureToSave);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Create Signature</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex border-b mb-4">
                        <button
                            className={cn("flex items-center gap-2 px-4 py-2 text-sm font-medium", activeTab === 'draw' ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500")}
                            onClick={() => setActiveTab('draw')}
                        >
                            Draw
                        </button>
                        <button
                            className={cn("flex items-center gap-2 px-4 py-2 text-sm font-medium", activeTab === 'type' ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500")}
                            onClick={() => setActiveTab('type')}
                        >
                            <Type size={16} />
                            Type
                        </button>
                        {savedSignature && (
                            <button
                                className={cn("flex items-center gap-2 px-4 py-2 text-sm font-medium", activeTab === 'saved' ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500")}
                                onClick={() => setActiveTab('saved')}
                            >
                                <Check size={16} />
                                Saved
                            </button>
                        )}
                    </div>

                    <div className="border rounded-lg bg-gray-50 h-[200px] flex items-center justify-center relative overflow-hidden">
                        {activeTab === 'draw' && (
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor="black"
                                canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
                            />
                        )}
                        {activeTab === 'type' && (
                            <input
                                type="text"
                                placeholder="Type your name"
                                className="w-full text-center text-4xl italic p-4 bg-transparent outline-none font-serif"
                                value={typedName}
                                onChange={(e) => setTypedName(e.target.value)}
                                style={{ fontFamily: '"Dancing Script", cursive' }}
                            />
                        )}
                        {activeTab === 'saved' && savedSignature && (
                            <img src={savedSignature} alt="Saved Signature" className="max-h-full max-w-full" />
                        )}

                        {activeTab === 'draw' && (
                            <button
                                onClick={clear}
                                className="absolute bottom-2 right-2 p-2 text-gray-500 hover:text-red-500 bg-white/80 rounded-full shadow-sm"
                                title="Clear"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
                    <div className="flex-1">
                        {activeTab !== 'saved' && (
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={saveForFuture}
                                    onChange={(e) => setSaveForFuture(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                Save for future
                            </label>
                        )}
                    </div>
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        disabled={activeTab === 'type' && !typedName}
                    >
                        <Check size={16} />
                        Add Signature
                    </button>
                </div>
            </div>
        </div>
    );
};
