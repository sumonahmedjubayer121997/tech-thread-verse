
import React from 'react';
import { EditorContentProps } from './types';

export const EditorContent: React.FC<EditorContentProps> = ({
  editorRef,
  onContentChange,
  onKeyDown,
  onDrop,
  value,
  placeholder,
}) => {
  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[300px] outline-none focus:ring-0"
        onInput={onContentChange}
        onKeyDown={onKeyDown}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ lineHeight: '1.6' }}
        role="textbox"
        aria-label="Rich text editor"
        tabIndex={0}
        suppressContentEditableWarning={true}
      />
      
      {!value && (
        <div className="absolute top-4 left-4 pointer-events-none text-muted-foreground">
          {placeholder}
        </div>
      )}
    </div>
  );
};
