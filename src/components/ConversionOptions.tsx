import React from "react";
import {Settings} from "lucide-react";
import type { ConversionFormat, ImageType } from "../types";

interface ConversionOptionsProps {
    imageType: ImageType;
    selectedFormat: ConversionFormat;
    selectedStyle: 'html' | 'react' | 'vue' | 'css';
    onFormatChange: (format: ConversionFormat) => void;
    onStyleChange: (style: 'html' | 'react' | 'vue' | 'css') => void;
    onConvert: () => void;
    isConverting: boolean;
}

const ConversionOptions: React.FC<ConversionOptionsProps> = ({
    imageType,
    selectedFormat,
    selectedStyle,
    onFormatChange,
    onStyleChange,
    onConvert,
    isConverting = false,
}) => {
    const formatOptions: { value: ConversionFormat; label: string; disabled:boolean }[] = [
        { value: 'base64', label: 'Base64', disabled: false },
        { value: 'svg', label: 'SVG', disabled: imageType !== 'vector' },
    ];

    const styleOptions: { value: 'html' | 'react' | 'vue' | 'css'; label: string; disabled:boolean }[] = [
        { value: 'html', label: 'HTML', disabled: false },
        { value: 'react', label: 'React', disabled: false },
        { value: 'vue', label: 'Vue' , disabled: false },
        { value: 'css', label: 'CSS' , disabled:selectedFormat === 'svg' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
           <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" /> 转换选项
           </h3>
        
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">选择格式</label>
                    <div className="space-y-2">
                        {formatOptions.map((option) => (
                            <label 
                                key={option.value} className={`flex items-center p-3 border rounder-lg cursor-pointer transition-all 
                                ${option.disabled 
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                                    : 'hover: border-blue-400 hover: bg-blue-50'}
                                ${selectedFormat === option.value && !option.disabled 
                                    ? 'border-blue-600 bg-blue-50' 
                                    : 'border-gray-300 bg-white'
                                }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="format"
                                    value={option.value}
                                    checked={selectedFormat === option.value}
                                    onChange={(e) => onFormatChange(e.target.value as ConversionFormat)}
                                    disabled={option.disabled}
                                    className="w-4 h-4 text-blur-600"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    {option.label}
                                    {option.disabled && imageType === 'bitmap' && (
                                        <span className="ml-2 text-xs text-gray-500">(仅限SVG)</span>
                                    )}
                                </span>
                            </label>
                        ))}                  
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">代码风格</label>
                <div className="space-y-2">
                    {styleOptions.map((option) => (
                        <label 
                            key={option.value} className={`flex items-center p-3 border rounder-lg cursor-pointer transition-all 
                            ${option.disabled 
                                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                                : 'hover: border-blue-400 hover: bg-blue-50'}
                            ${selectedStyle === option.value && !option.disabled 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200'
                            }
                            `}
                        >
                            <input
                                type="radio"
                                name="style"
                                value={option.value}
                                checked={selectedStyle === option.value}
                                onChange={(e) => onStyleChange(e.target.value as 'html' | 'react' | 'vue' | 'css')}
                                disabled={option.disabled}
                                className="w-4 h-4 text-blur-600"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700">
                                {option.label}
                                {option.disabled && (
                                    <span className="ml-2 text-xs text-gray-500">(不可用)</span>
                                )}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={onConvert}
                disabled={isConverting}
                className={`w-full px-4 py-3 text-white rounded-lg transition-colors font-medium 
                ${isConverting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
                `}
                >
                {isConverting ? '转换中...' : '生成代码'}   
            </button>
        </div>
        </div>
    );
};

export default ConversionOptions;