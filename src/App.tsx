import { useState } from 'react'
import { FileCode2 , AlertCircle } from 'lucide-react'
import ImageUploader from './components/ImageUploader'
import ImagePreview from './components/ImagePreview'
import ConversionOptions from './components/ConversionOptions'
import CodePreview from './components/CodePreview'
import type { ImageInfo, ConversionFormat, ConversionResult } from './types'
import { processImageFile } from './utils/imageProcessor'
import { convertImage } from './utils/codeGenerator'


function App() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>('base64');
  const [selectedStyle, setSelectedStyle] = useState<'html' | 'react' | 'vue' | 'css'>('html');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => { 
    try {
      setError(null);
      setConversionResult(null);
      const info = await processImageFile(file);
      setImageInfo(info);

      if(info.type === 'vector'){
        setSelectedFormat('svg');
        setSelectedStyle('html');        
      }else{
        setSelectedFormat('base64');    
      }
    }catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
      setImageInfo(null);
    }

  };

  const handleRemoveImage = () => {
    setImageInfo(null);
    setConversionResult(null);
    setError(null);
  };  

  const handleConvert = async () => { 
    if(!imageInfo) return;

    try {
      setIsConverting(true);
      setError(null);
      const result = await convertImage(imageInfo, selectedFormat, selectedStyle);
      setConversionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsConverting(false);
    }
  }; 
  

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center gap-3'>
            <FileCode2 className='h-8 w-8 text-blue-600' />
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Image Converter</h1>
              <p className='text-sm text-gray-600 mt-1'>将图片转换为可嵌入的代码格式</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3'>
            <AlertCircle className='h-5 w-5 text-red-600 mt-0.5 flex-shrink-0' />
            <div>
              <h3 className='font-semibold text-red-800'>Error</h3>
              <p className='text-sm text-red-700'>{error}</p>
            </div>

          </div>
        )}

        {!imageInfo && (
          <div className='mb-8'>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        )}

        {imageInfo && ( 
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'> 
            <div className='lg:col-span-2 space-y-6'>
              <ImagePreview imageInfo={imageInfo} onRemove={handleRemoveImage} />
              {conversionResult && (
                <CodePreview result={conversionResult} />
                )}
            </div>

            <div>
              <ConversionOptions
                imageType={imageInfo.type}
                selectedFormat={selectedFormat}
                selectedStyle={selectedStyle}
                onFormatChange={setSelectedFormat}
                onStyleChange={setSelectedStyle}
                onConvert={handleConvert}
                isConverting={isConverting}
              />

            </div>
          </div>
        )}

        {!imageInfo && (
          <div className='mt-12 bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-xl font-bold text-gray-900 mb-6'>
              使用说明
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                  支持的格式
                </h3>
                <ul className='space-y-2 text-gray-600'>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>·</span>
                    <span><strong>PNG / JPG</strong> - 位图格式，支持 Base64 编码</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>·</span>
                    <span><strong>SVG</strong> - 矢量图格式，支持优化和内联</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='font-semibold text-lg text-gray-800 mb-3'>转换选项</h3>
                <ul className='space-y-2 text-gray-600'>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>·</span>
                    <span><strong>Base64</strong> - 适用于所有图片格式</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>·</span>
                    <span><strong>SVG</strong> - 仅适用于 SVG 格式</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>·</span>
                    <span><strong>HTML / React / Vue / CSS</strong> - 多种代码风格</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className='mt-8 pt-6 border-t border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                使用场景
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                将图片转换为代码格式可以避免额外的 HTTP 请求，提高页面加载速度，
                同时保持图像清晰度。适用于图标、小型图片 SVG 矢量图等场景。
              </p>

            </div>
          </div>
        )}
      </main>

      <footer className='mt-12 bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'> 
          <p className='text-center text-gray-600 text-sm'>
          © 2025 图片代码转换器 - Image Converter. 
          </p>
        </div> 

      </footer>
    </div>
  )
}

export default App
