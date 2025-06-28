
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Heart, Bookmark, Share2, MessageCircle, ThumbsUp } from 'lucide-react';

interface PostInteractionsProps {
  postId: number;
  initialLikes?: number;
  initialBookmarked?: boolean;
  initialReactions?: {
    likes: number;
    loves: number;
    comments: number;
  };
  onInteraction?: (type: string, value: any) => void;
}

export function PostInteractions({ 
  postId, 
  initialLikes = 0, 
  initialBookmarked = false,
  initialReactions = { likes: 0, loves: 0, comments: 0 },
  onInteraction 
}: PostInteractionsProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [reactions, setReactions] = useState(initialReactions);

  const handleBookmark = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to bookmark posts.",
        variant: "destructive",
      });
      return;
    }

    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    
    toast({
      title: newBookmarked ? "Post Bookmarked" : "Bookmark Removed",
      description: newBookmarked 
        ? "Post added to your bookmarks." 
        : "Post removed from your bookmarks.",
    });

    onInteraction?.('bookmark', newBookmarked);
  };

  const handleReaction = (type: 'like' | 'love') => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to react to posts.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'like') {
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      setReactions(prev => ({
        ...prev,
        likes: prev.likes + (newLiked ? 1 : -1)
      }));
      
      if (newLiked && isLoved) {
        setIsLoved(false);
        setReactions(prev => ({
          ...prev,
          loves: prev.loves - 1
        }));
      }
    } else if (type === 'love') {
      const newLoved = !isLoved;
      setIsLoved(newLoved);
      setReactions(prev => ({
        ...prev,
        loves: prev.loves + (newLoved ? 1 : -1)
      }));
      
      if (newLoved && isLiked) {
        setIsLiked(false);
        setReactions(prev => ({
          ...prev,
          likes: prev.likes - 1
        }));
      }
    }

    onInteraction?.(type, true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Post link copied to clipboard!",
      });
    }
  };

  return (
    <div className="flex items-center justify-between border-t pt-4 mt-6">
      <div className="flex items-center space-x-2">
        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          onClick={() => handleReaction('like')}
          className="flex items-center gap-1"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{reactions.likes}</span>
        </Button>
        
        <Button
          variant={isLoved ? "default" : "outline"}
          size="sm"
          onClick={() => handleReaction('love')}
          className="flex items-center gap-1 text-red-500 hover:text-red-600"
        >
          <Heart className={`w-4 h-4 ${isLoved ? 'fill-current' : ''}`} />
          <span>{reactions.loves}</span>
        </Button>

        <Badge variant="secondary" className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          {reactions.comments} comments
        </Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={isBookmarked ? "default" : "outline"}
          size="sm"
          onClick={handleBookmark}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
