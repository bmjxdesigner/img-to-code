import React from "react";
import {Image, Info} from "lucide-react";
import type {ImageInfo} from "../types";
import {formatFileSize} from "../utils/helpers";

interface ImagePreviewProps {
    imageInfo: ImageInfo;
    onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({imageInfo, onRemove}) => {
    const {file, type, preview, width, height} = imageInfo;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Image className="w-5 h-5" /> 图片预览
                </h3>
                <button
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
                >
                    移除
                </button>
            </div>

            <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[200px] max-h-[400px]">
                    <img
                        src={preview}
                        alt="Image Preview"
                        className="max-w-full max-h-[400px] object-contain"         
                    /> 
            </div>

            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">文件名:</span>
                            <span className="font-medium text-gray-800 truncate ml-2">{file.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">文件大小:</span>
                            <span className="font-medium text-gray-800">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">图片类型:</span>
                        <span className="font-medium text-gray-800">{type === 'vector'?'矢量图(SVG)':'位图(PNG/JPG)'}</span>                     
                    </div>
                    {width && height && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">尺寸:</span>
                            <span className="font-medium text-gray-800">{width} x {height} px</span>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ImagePreview;