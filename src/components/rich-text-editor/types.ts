
export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface EditorToolbarProps {
  onFormatText: (command: string, value?: string) => void;
  onInsertHeading: (level: number) => void;
  onInsertCodeBlock: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPreview: boolean;
  onTogglePreview: () => void;
}

export interface EditorContentProps {
  editorRef: React.RefObject<HTMLDivElement>;
  onContentChange: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  value: string;
  placeholder: string;
}

export interface EditorPreviewProps {
  value: string;
  onCopyCode: (event: React.MouseEvent) => void;
}
