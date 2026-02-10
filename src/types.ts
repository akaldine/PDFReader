export interface Annotation {
    id: string;
    type: 'text' | 'signature';
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    content: string; // text content or base64 signature
    width?: number; // percentage
    height?: number; // percentage
    page: number;
}
