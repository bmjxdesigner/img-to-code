import React, {useState} from 'react';
import {Code, Copy, Download, Check} from 'lucide-react';
import type {ConversionResult} from '../types';
import {copyToClipboard, downloadAsFile} from '../utils/helpers';

interface CodePreviewProps {
    result: ConversionResult;
}

const CodePreview: React.FC<CodePreviewProps> = ({result}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async() => {
        const success = await copyToClipboard(result.code);
        if (success) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        let extension = 'txt';
        let mimeType = 'text/plain';
        
        if(result.language === 'html') {
            extension = 'html';
            mimeType = 'text/html';
        } else if(result.language === 'typescript') {
            extension = 'tsx';
            mimeType = 'text/plain';
        } else if(result.language === 'vue') {
            extension = 'vue';
            mimeType = 'text/plain';
        } else if(result.language === 'css') {
            extension = 'css';
            mimeType = 'text/css';
        }

        const filename = `converted-code.${extension}`;
        downloadAsFile(result.code, filename, mimeType);
    };

    return (
        <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                    <Code className='w-5 h-5' /> Code Preview
                </h3>
                <div className='flex gap-2'>
                    <button
                    onClick={handleCopy}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium' 
                    >
                        {isCopied ? (
                            <>
                                <Check className='w-4 h-4' /> Copied!
                            </>
                        ) : (
                            <>
                                <Copy className='w-4 h-4' /> Copy
                            </>
                        )}
                    </button>
                    <button
                    onClick={handleDownload}
                    className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
                    >
                        <Download className='w-4 h-4' /> Download
                    </button>

                </div>
            </div>

            <div className='relative'>
                <div className='absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded'>
                    {result.language}
                    
                </div>
                <pre className='bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto max-h-[500px] overflow-y-auto'>
                    <code className='text-sm font-mono'>
                        {result.code}
                    </code>
                </pre>
            </div>

            <div className='mt-4 text-sm text-gray-600'>
                <p>提示：您可以直接复制代码并粘贴到您的项目中使用</p>
            </div>
        </div>
    );
};

export default CodePreview;