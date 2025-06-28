
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { UserPlus, UserMinus } from 'lucide-react';

interface UserFollowButtonProps {
  userId: string;
  userName: string;
  initialFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function UserFollowButton({ 
  userId, 
  userName, 
  initialFollowing = false,
  onFollowChange 
}: UserFollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to follow users.",
        variant: "destructive",
      });
      return;
    }

    if (user.uid === userId) {
      toast({
        title: "Cannot Follow Yourself",
        description: "You cannot follow your own account.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const newFollowing = !isFollowing;
      setIsFollowing(newFollowing);
      
      toast({
        title: newFollowing ? "Following" : "Unfollowed",
        description: newFollowing 
          ? `You are now following ${userName}.` 
          : `You unfollowed ${userName}.`,
      });

      onFollowChange?.(newFollowing);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.uid === userId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  );
}
