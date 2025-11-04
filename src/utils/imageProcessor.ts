import type { ImageType, ImageInfo } from "../types";

export const detectImageType = (file: File): ImageType => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if(extension === 'svg') {
        return 'vector';
    }

    return 'bitmap';
};

export const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string')
                resolve(reader.result);
            else
                reject(new Error('Failed to convert to base64'));
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

export const readSVGAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string')
                resolve(reader.result);
            else
                reject(new Error('Failed to read SVG'));
        };

        reader.onerror = () => {
             reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
    });
};

export const optimizeSVG = (svgContent: string): string => {
    let optimized = svgContent.replace(/<!--[\s\S]*?-->/g, '');
    optimized = optimized.replace(/\s+/g, ' ').trim();
    optimized = optimized.replace(/\s*(data-name|id)="[^"]*"/g, '');
    return optimized;
};

export const getImageDimensions = (file: File): Promise<{width: number; height: number}> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
            
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
};

export const validateImageFile = (file:File): {valid: boolean; error?: string} => {
    const maxSize = 10 * 1024 * 1024;
    const allowdTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowdTypes.includes(file.type)) {
        return { valid: false, error: '不支持的文件类型。请上传 PNG, JPG 或 SVG 格式的图片。' };
    }   
    if (file.size > maxSize) {
        return { valid: false, error: '文件大小超出限制。请上传小于 10MB 的图片。' };
    }
    return { valid: true };
}

export const processImageFile = async (file: File): Promise<ImageInfo> => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    const type = detectImageType(file);
    const preview = await convertToBase64(file);

    let width: number | undefined = undefined;
    let height: number | undefined = undefined;

    try{
        const dims = await getImageDimensions(file);
        width = dims.width;
        height = dims.height;

    }catch(error) {
        console.error('Failed to get image dimensions:', error);
    }

    return { file, type, preview, width, height };
    
}