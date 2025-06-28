
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bold, Italic, List, Heading1, Heading2, Heading3, Image, Undo, Redo, Code } from 'lucide-react';
import { EditorToolbarProps } from './types';

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onFormatText,
  onInsertHeading,
  onInsertCodeBlock,
  onImageUpload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isPreview,
  onTogglePreview,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('bold')}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('italic')}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onInsertHeading(1)}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onInsertHeading(2)}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onInsertHeading(3)}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('insertUnorderedList')}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onInsertCodeBlock}
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
          onChange={onImageUpload}
          className="hidden"
        />
      </label>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant={isPreview ? "default" : "ghost"}
        size="sm"
        onClick={onTogglePreview}
        title="Toggle Preview"
      >
        {isPreview ? "Edit" : "Preview"}
      </Button>
    </div>
  );
};
