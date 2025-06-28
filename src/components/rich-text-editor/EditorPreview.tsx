
import React from 'react';
import { EditorPreviewProps } from './types';

export const EditorPreview: React.FC<EditorPreviewProps> = ({
  value,
  onCopyCode,
}) => {
  const renderPreviewContent = (html: string) => {
    // Parse HTML and render code blocks with syntax highlighting
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const codeBlocks = doc.querySelectorAll('pre[data-language]');
    
    let processedHtml = html;
    
    codeBlocks.forEach((block, index) => {
      const language = block.getAttribute('data-language') || 'text';
      const code = block.querySelector('code')?.textContent || '';
      
      const codeBlockHtml = `
        <div class="code-block-container bg-gray-900 rounded-lg overflow-hidden my-4">
          <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span class="text-sm font-medium text-gray-300">${language}</span>
            <button 
              class="copy-btn text-gray-300 hover:text-white hover:bg-gray-700 p-1 rounded"
              data-code="${encodeURIComponent(code)}"
              title="Copy code"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </button>
          </div>
          <pre class="p-4 overflow-x-auto text-sm text-gray-100 font-mono"><code class="language-${language}">${code}</code></pre>
        </div>
      `;
      
      processedHtml = processedHtml.replace(block.outerHTML, codeBlockHtml);
    });
    
    return processedHtml;
  };

  return (
    <div 
      className="p-4 prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: renderPreviewContent(value) }}
      onClick={onCopyCode}
    />
  );
};
