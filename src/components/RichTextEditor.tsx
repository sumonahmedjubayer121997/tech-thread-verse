import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bold, Italic, List, Heading1, Heading2, Heading3, Image, Video, Undo, Redo, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Initialize editor content only once when component mounts or value changes externally
  useEffect(() => {
    if (editorRef.current && !isPreview) {
      // Only update if the content is significantly different (not just from user typing)
      const currentContent = editorRef.current.innerHTML;
      if (value !== currentContent && value !== history[historyIndex]) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, isPreview]);

  // Autosave functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value && value !== history[historyIndex]) {
        toast({
          title: "Auto-saved",
          description: "Your changes have been automatically saved as a draft.",
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [value, history, historyIndex]);

  const saveToHistory = (newValue: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const content = editorRef.current?.innerHTML || '';
    onChange(content);
    saveToHistory(content);
  };

  const insertHeading = (level: number) => {
    formatText('formatBlock', `h${level}`);
  };

  const insertCodeBlock = () => {
    const language = prompt('Enter language (e.g., javascript, bash, python):') || 'text';
    const codeContent = prompt('Enter your code:') || '';
    
    if (codeContent) {
      const codeBlock = `<pre data-language="${language}"><code>${codeContent}</code></pre><p><br></p>`;
      document.execCommand('insertHTML', false, codeBlock);
      const content = editorRef.current?.innerHTML || '';
      onChange(content);
      saveToHistory(content);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target?.result}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
        document.execCommand('insertHTML', false, img);
        const content = editorRef.current?.innerHTML || '';
        onChange(content);
        saveToHistory(content);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = `<img src="${event.target?.result}" alt="Dropped image" style="max-width: 100%; height: auto;" />`;
        document.execCommand('insertHTML', false, img);
        const content = editorRef.current?.innerHTML || '';
        onChange(content);
        saveToHistory(content);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleContentChange = () => {
    const content = editorRef.current?.innerHTML || '';
    onChange(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            redo();
          } else {
            e.preventDefault();
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
      }
    }
  };

  const renderPreviewContent = (html: string) => {
    // Parse HTML and render code blocks with syntax highlighting
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const codeBlocks = doc.querySelectorAll('pre[data-language]');
    
    let processedHtml = html;
    
    codeBlocks.forEach((block, index) => {
      const language = block.getAttribute('data-language') || 'text';
      const code = block.querySelector('code')?.textContent || '';
      const blockId = `code-block-${index}`;
      
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

  const handleCopyCode = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const button = target.closest('.copy-btn') as HTMLButtonElement;
    if (button) {
      const code = decodeURIComponent(button.getAttribute('data-code') || '');
      navigator.clipboard.writeText(code).then(() => {
        toast({
          title: "Code copied!",
          description: "The code block has been copied to your clipboard.",
        });
      }).catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy code to clipboard.",
          variant: "destructive",
        });
      });
    }
  };

  return (
    <div className={`border rounded-lg bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(1)}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(2)}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(3)}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertCodeBlock}
          title="Insert Code Block"
        >
          <Code className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            title="Insert Image"
            asChild
          >
            <span>
              <Image className="w-4 h-4" />
            </span>
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant={isPreview ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          title="Toggle Preview"
        >
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
        {isPreview ? (
          <div 
            className="p-4 prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderPreviewContent(value) }}
            onClick={handleCopyCode}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 min-h-[300px] outline-none focus:ring-0"
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ lineHeight: '1.6' }}
            role="textbox"
            aria-label="Rich text editor"
            tabIndex={0}
            suppressContentEditableWarning={true}
          />
        )}
        
        {!isPreview && !value && (
          <div className="absolute top-[60px] left-4 pointer-events-none text-muted-foreground">
            {placeholder}
          </div>
        )}
      </div>

      {!isPreview && (
        <div className="p-2 text-xs text-muted-foreground border-t">
          Tip: Drag and drop images directly into the editor, or use Ctrl+Z/Y for undo/redo
        </div>
      )}
    </div>
  );
};
