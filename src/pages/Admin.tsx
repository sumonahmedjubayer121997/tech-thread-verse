
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { PostEditor } from '@/components/PostEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Plus, Edit, Trash2, LogOut, Users, BookOpen, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Post {
  id: number;
  title: string;
  author: string;
  status: 'draft' | 'published';
  content: string;
  views: number;
  publishDate: string;
}

const Admin = () => {
  const { user, logout, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Building Modern React Applications with TypeScript",
      author: "Sarah Chen",
      status: "published",
      content: "<h1>Introduction</h1><p>This is a comprehensive guide to building modern React applications...</p>",
      views: 2840,
      publishDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Advanced Node.js Performance Optimization",
      author: "Marcus Rodriguez",
      status: "draft",
      content: "<h1>Performance Tips</h1><p>Learn how to optimize your Node.js applications...</p>",
      views: 1920,
      publishDate: "2024-01-10"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 15,
    totalViews: 25680,
    totalUsers: 1240,
    publishedPosts: 12
  });

  // Update stats when posts change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalPosts: posts.length,
      publishedPosts: posts.filter(post => post.status === 'published').length,
      totalViews: posts.reduce((sum, post) => sum + post.views, 0)
    }));
  }, [posts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDeletePost = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast({
        title: "Post deleted",
        description: `"${post.title}" has been deleted successfully.`,
      });
    }
  };

  const handleSavePost = (savedPost: Post) => {
    if (editingPost) {
      // Update existing post
      setPosts(prev => prev.map(p => p.id === savedPost.id ? savedPost : p));
    } else {
      // Add new post
      setPosts(prev => [...prev, savedPost]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <Badge variant="secondary">DevBlog</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">V</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">P</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-foreground">{stats.publishedPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Blog Posts</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-[250px]"
                  />
                </div>
                <Button onClick={handleAddPost}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No posts found matching your search.' : 'No posts yet. Create your first post!'}
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>By {post.author}</span>
                        <span>{post.views.toLocaleString()} views</span>
                        <span>{post.publishDate}</span>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPost(post)}
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        title="Delete post"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post Editor Dialog */}
      <PostEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        post={editingPost}
        onSave={handleSavePost}
      />
    </div>
  );
};

export default Admin;
