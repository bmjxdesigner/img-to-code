export type ImageType = 'bitmap' | 'vector';

export type ConversionFormat = 'base64' | 'svg' | 'dataurl';

export interface ImageInfo {
    file: File;
    type: ImageType;
    preview: string;
    width?: number;
    height?: number;
}

export interface ConversionResult {
    format: ConversionFormat;
    code: string;
    language: string;
}