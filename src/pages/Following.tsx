
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserFollowButton } from '@/components/UserFollowButton';
import { Users, User, Calendar, BookOpen } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function Following() {
  const { user, loading } = useAuth();

  // Sample following data
  const followingUsers = [
    {
      id: 'user1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      bio: 'Frontend Developer & React enthusiast',
      posts: 24,
      followers: 1520,
      joined: '2023-06-15'
    },
    {
      id: 'user2', 
      name: 'Marcus Rodriguez',
      email: 'marcus@example.com',
      bio: 'Full-stack developer & Node.js expert',
      posts: 18,
      followers: 980,
      joined: '2023-08-22'
    }
  ];

  // Sample posts from followed users
  const recentPosts = [
    {
      id: 1,
      title: "Building Modern React Applications with TypeScript",
      author: "Sarah Chen",
      publishDate: "2024-01-15",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Advanced Node.js Performance Optimization", 
      author: "Marcus Rodriguez",
      publishDate: "2024-01-10",
      readTime: "12 min read"
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Following</h1>
          <p className="text-muted-foreground">People you follow and their latest posts</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Following List */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Following ({followingUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {followingUsers.length === 0 ? (
                <div className="text-center py-4">
                  <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    You're not following anyone yet
                  </p>
                </div>
              ) : (
                followingUsers.map((followedUser) => (
                  <div key={followedUser.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarFallback>
                        {followedUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{followedUser.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{followedUser.bio}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{followedUser.posts} posts</span>
                        <span>{followedUser.followers} followers</span>
                      </div>
                      <div className="mt-2">
                        <UserFollowButton
                          userId={followedUser.id}
                          userName={followedUser.name}
                          initialFollowing={true}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts Feed */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recent posts</h3>
                  <p className="text-muted-foreground mb-4">
                    Posts from people you follow will appear here
                  </p>
                  <Button asChild>
                    <Link to="/">Discover Posts</Link>
                  </Button>
                </div>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 hover:text-primary">
                          <Link to={`/blog/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
