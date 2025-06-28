
import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { EditorToolbar } from './rich-text-editor/EditorToolbar';
import { EditorContent } from './rich-text-editor/EditorContent';
import { EditorPreview } from './rich-text-editor/EditorPreview';
import { RichTextEditorProps } from './rich-text-editor/types';

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
      <EditorToolbar
        onFormatText={formatText}
        onInsertHeading={insertHeading}
        onInsertCodeBlock={insertCodeBlock}
        onImageUpload={handleImageUpload}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
      />

      <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
        {isPreview ? (
          <EditorPreview
            value={value}
            onCopyCode={handleCopyCode}
          />
        ) : (
          <EditorContent
            editorRef={editorRef}
            onContentChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onDrop={handleDrop}
            value={value}
            placeholder={placeholder}
          />
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
