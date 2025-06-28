
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { toast } from '@/hooks/use-toast';

interface Post {
  id?: number;
  title: string;
  author: string;
  status: 'draft' | 'published';
  content: string;
  views: number;
  publishDate: string;
}

interface PostEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | null;
  onSave: (post: Post) => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  open,
  onOpenChange,
  post,
  onSave,
}) => {
  const [formData, setFormData] = useState<Post>({
    title: '',
    author: '',
    status: 'draft',
    content: '',
    views: 0,
    publishDate: new Date().toISOString().split('T')[0],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData({
        title: '',
        author: '',
        status: 'draft',
        content: '',
        views: 0,
        publishDate: new Date().toISOString().split('T')[0],
      });
    }
    setHasUnsavedChanges(false);
  }, [post, open]);

  const handleInputChange = (field: keyof Post, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.author.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an author name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const postToSave = {
        ...formData,
        id: post?.id || Date.now(), // Simple ID generation for demo
        publishDate: formData.status === 'published' ? new Date().toISOString().split('T')[0] : formData.publishDate,
      };

      onSave(postToSave);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Success",
        description: `Post ${post ? 'updated' : 'created'} successfully!`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving?"
      );
      if (!confirmed) return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {post ? 'Edit Post' : 'Create New Post'}
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter post title..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Author name..."
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published') => 
                  handleInputChange('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={(e) => handleInputChange('publishDate', e.target.value)}
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Start writing your post..."
              className="min-h-[400px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {hasUnsavedChanges ? "You have unsaved changes" : "All changes saved"}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              
              <Button
                type="button"
                onClick={() => handleInputChange('status', 'draft')}
                variant="secondary"
                disabled={isSaving}
                className="hidden md:inline-flex"
              >
                Save as Draft
              </Button>
              
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
