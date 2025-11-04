import React, {useCallback, useState} from "react";
import {Upload, FileImage} from "lucide-react";

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({onImageUpload, disabled = false}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onImageUpload(files[0]);
        }
    }, [disabled, onImageUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onImageUpload(files[0]);
        }

        e.target.value = '';
    }, [onImageUpload]);

    return (
        <div className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-all 
            ${isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }` }
            onDragEnter = {handleDragEnter}
            onDragLeave = {handleDragLeave}
            onDragOver = {handleDragOver}
            onDrop = {handleDrop}
            onClick={() => !disabled && document.getElementById('image-upload-input')?.click()}
            >
            <input
                type="file"
                id="file-input"
                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                className="hidden"
                onChange={handleFileSelect}
                disabled={disabled}
            />

            <div className="flex flex-col items-center gap-4">
                {isDragging ? (
                    <FileImage className="w-16 h-16 text-blue-500" />
                ) : (
                    <Upload className="w-16 h-16 text-gray-400" />)}
                
                <div>
                    <p className="text-lg font-medium text-gray-700">
                        {isDragging ? '释放以上传图片' : '拖放图片到此处，或点击选择文件'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        支持 PNG, JPG, SVG 格式，最大 10MB。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;