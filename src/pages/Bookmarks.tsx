
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PostInteractions } from '@/components/PostInteractions';
import { Heart, Calendar, User, BookOpen } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function Bookmarks() {
  const { user, loading } = useAuth();

  // Sample bookmarked posts data
  const bookmarkedPosts = [
    {
      id: 1,
      title: "Building Modern React Applications with TypeScript",
      author: "Sarah Chen",
      excerpt: "Learn how to build scalable React applications using TypeScript with modern best practices...",
      publishDate: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "TypeScript", "Frontend"],
      reactions: { likes: 42, loves: 18, comments: 12 }
    },
    {
      id: 2,
      title: "Advanced Node.js Performance Optimization",
      author: "Marcus Rodriguez", 
      excerpt: "Discover advanced techniques to optimize your Node.js applications for better performance...",
      publishDate: "2024-01-10",
      readTime: "12 min read",
      tags: ["Node.js", "Performance", "Backend"],
      reactions: { likes: 38, loves: 24, comments: 8 }
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold">Your Bookmarks</h1>
          <p className="text-muted-foreground">Posts you've saved for later</p>
        </div>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-4">
              Start bookmarking posts to save them for later reading
            </p>
            <Button asChild>
              <Link to="/">Explore Posts</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bookmarkedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl hover:text-primary">
                      <Link to={`/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.publishDate}
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <PostInteractions
                  postId={post.id}
                  initialBookmarked={true}
                  initialReactions={post.reactions}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
