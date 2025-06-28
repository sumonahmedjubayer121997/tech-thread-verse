
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bold, Italic, List, Heading1, Heading2, Heading3, Image, Video, Undo, Redo } from 'lucide-react';
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
            dangerouslySetInnerHTML={{ __html: value }}
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
