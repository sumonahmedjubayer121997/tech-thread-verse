
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Plus, Edit, Trash2, LogOut, Users, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, logout, loading } = useAuth();
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Building Modern React Applications with TypeScript",
      author: "Sarah Chen",
      status: "published",
      views: 2840,
      publishDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Advanced Node.js Performance Optimization",
      author: "Marcus Rodriguez",
      status: "draft",
      views: 1920,
      publishDate: "2024-01-10"
    }
  ]);

  const [stats] = useState({
    totalPosts: 15,
    totalViews: 25680,
    totalUsers: 1240,
    publishedPosts: 12
  });

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
            <div className="flex justify-between items-center">
              <CardTitle>Blog Posts</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>{post.views} views</span>
                      <span>{post.publishDate}</span>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
