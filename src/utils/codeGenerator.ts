import type { ConversionFormat , ImageInfo, ConversionResult } from "../types";
import { convertToBase64, readSVGAsText, optimizeSVG } from "./imageProcessor";

const generateBase64HTML = (base64: string, alt: string = 'image', width?: number, height?: number): string => {
    return `<!DOCTYPE html>
    <html lang='zh-CN'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Image Display</title>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: linear-gradient( #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                }
            .container{
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                padding: 30px;
                max-width: 90%;
                text-align: center;
                }
            .image-wrapper{
                margin:20px 0;
                display: inline-block;
                position: relative;
            }
            img{
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition transform 0.3s ease;
            }
            img:hover{
                transform: scale(1.02);
            }
            h1{
                color: #333;
                margin-bottom: 10px;
                font-size: 24px;
            }
            .info{
                color: #666;
                font-size: 14px;
                margin-top: 15px;
            }

        </style>
    </head>
    <body>
        <div class="container"> 
            <h1>Image Display</h1>
            <div class="image-wrapper"> 
                <img src="${base64}" alt="${alt}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''}>
            </div>
            <div class="info">
                ${width && height ? `尺寸: ${width} x ${height} px` : ''}
            </div>
        </div>
    </body>
 </html>`;       
};

const generateBase64React = (base64: string, alt: string = 'image'): string => { 
    return `import React from 'react';

    const ImageComponent = () => {
        return (
            <img
            src="${base64}"
            alt="${alt}"
            />>
        );
    };
    export default ImageComponent;`;
};

const generateBase64Vue = (base64: string, alt: string = 'image'): string => { 
    return `<template>
        <div class="image-container">
            <img 
                :src="imageSrc"
                :alt="imageAlt"
                class="image"
            />            
        </div>
    </template>
    <script>
    export default {
        name: 'ImageComponent',
        data() {
            return {
                imageSrc: '${base64}',
                imageAlt: '${alt}'
            };
        }
    };
    </script>

    <style scoped>
        .image-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    </style>
    `;
};

const generateBase64CSS = (base64: string): string => {
    return `.image-background {
    background-image: url(${base64});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
    }
}`
};

const generateSVGHTML = (svgContent: string): string => {
    return `<!DOCTYPE html>
    <html lang='zh-CN'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>SVG Display</title>
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: linear-gradient( #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .container{
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                padding: 30px;
                max-width: 90%;
                text-align: center;
            }
            .svg-wrapper{
                margin:20px 0;
                display: inline-block;
            }
            svg:hover{
                transform: scale(1.05);
            }
            h1{
                color: #333;
                margin-bottom: 20px;
                font-size: 24px;
            }
        </style>      
    </head>
    <body>
        <div class="container"> 
            <h1>SVG Display</h1>
            <div class="svg-wrapper"> 
                ${svgContent}
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateSVGReact = (svgContent: string): string => { 
    const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);  
    const svgAttributes = svgContent.match(/<svg([^>]*)>/i)?.[1] || '';
    const svgBody = svgMatch?.[1] || '';

    const reactAttrs = svgAttributes
    .replace(/(\w+)-(\w+)/g, (_match, p1, p2) => `${p1}${p2.charAt(0).toUpperCase()}${p2.slice(1)}`)
    .replace(/class=/g, 'className=');

    return `import React from 'react';

    const SvgComponent = () => {
        return (
            <svg ${reactAttrs}>
                ${svgBody}
            </svg>
        );
    };
    export default SvgComponent;`;
}


const generateSVGVue = (svgContent: string): string => { 
    return `<template>
        <div class="svg-container">
            ${svgContent}
        </div>
        </template>

        <script>
        export default {
            name: 'SvgComponent',
        };
        </script>

        <style scoped>
            .svg-container {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            svg {
                max-width: 100%;
                height: auto;
            }
        </style>
        `;
}

export const convertImage = async (
    ImageInfo : ImageInfo,
    format: ConversionFormat,
    codeStyle: 'html' | 'react' | 'vue' | 'css' = 'html'
): Promise<ConversionResult> => { 
    const {file, type, width, height} = ImageInfo;

    if (format === 'base64' || format === 'dataurl'){
        const base64 = await convertToBase64(file);
        const fileName = file.name.replace(/\.[^/.]+$/, '')

        let code = ''
        let language = 'html';

        if (codeStyle === 'html'){
            code = generateBase64HTML(base64, fileName, width, height);
            language = 'html';
        } else if (codeStyle === 'react'){
            code = generateBase64React(base64, fileName);
            language = 'typescript';
        } else if (codeStyle === 'vue'){
            code = generateBase64Vue(base64, fileName);
            language = 'vue';
        } else if (codeStyle === 'css'){
            code = generateBase64CSS(base64);
            language = 'css';
        }
        return {format:'base64', code, language};
    }

    if (format === 'svg'){ 
        if (type !== 'vector'){
            throw new Error('只有 SVG 格式的图片可以使用 SVG 转换');
        }

        const svgContent = await readSVGAsText(file);
        const optimizedSVG = optimizeSVG(svgContent);

        let code = '';
        let language = 'html';

        if (codeStyle === 'html'){ 
            code = generateSVGHTML(optimizedSVG);
            language = 'html';
        } else if (codeStyle === 'react'){ 
            code = generateSVGReact(optimizedSVG);
            language = 'typescript';
        } else if (codeStyle === 'vue'){ 
            code = generateSVGVue(optimizedSVG);
            language = 'vue';
        } else {
            code = generateSVGHTML(optimizedSVG);
            language = 'html';
        }

        return {
            format: 'svg',
            code,
            language
        };
    }
    throw new Error('不支持的转换格式');
};