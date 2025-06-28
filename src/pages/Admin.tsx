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
import { db } from '../lib/firebase';
import { collection, addDoc, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

interface Post {
  id: string;
  title: string;
  author: string;
  status: 'draft' | 'published';
  content: string;
  views: number;
  publishDate: string;
  featureImage: string;
  postImages: string[];
  tags: string[];
  readingLevel: 'low' | 'medium' | 'high';
}

const Admin = () => {
  const { user, logout, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalUsers: 1240,
    publishedPosts: 0,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setStats({
      totalPosts: posts.length,
      publishedPosts: posts.filter((p) => p.status === 'published').length,
      totalViews: posts.reduce((sum, p) => sum + p.views, 0),
      totalUsers: 1240,
    });
  }, [posts]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Logged out', description: 'You have been logged out successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to log out', variant: 'destructive' });
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

  const handleDeletePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    if (!window.confirm(`Delete "${post.title}"? This action cannot be undone.`)) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast({ title: 'Deleted', description: `"${post.title}" has been deleted.` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
    }
  };

  const handleSavePost = async (savedPost: Omit<Post, 'id'> & Partial<Pick<Post, 'id'>>) => {
    try {
      if (editingPost) {
        const ref = doc(db, 'posts', editingPost.id);
        await setDoc(ref, savedPost);
        setPosts(prev =>
          prev.map(p => p.id === editingPost.id ? { ...savedPost, id: editingPost.id } as Post : p)
        );
      } else {
        const ref = await addDoc(collection(db, 'posts'), savedPost);
        setPosts(prev => [...prev, { ...savedPost, id: ref.id } as Post]);
      }
      toast({ title: 'Success', description: 'Post saved successfully!' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save post', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <Badge variant="secondary">DevBlog</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-sm">Welcome, {user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<BookOpen className="w-6 h-6 text-blue-600" />} label="Total Posts" value={stats.totalPosts} />
          <StatCard icon={<Users className="w-6 h-6 text-green-600" />} label="Total Users" value={stats.totalUsers} />
          <StatCard icon={<span className="font-bold text-purple-600">V</span>} label="Total Views" value={stats.totalViews.toLocaleString()} />
          <StatCard icon={<span className="font-bold text-yellow-600">P</span>} label="Published" value={stats.publishedPosts} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between flex-wrap gap-2">
              <CardTitle>Blog Posts</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <Button onClick={handleAddPost}><Plus className="w-4 h-4 mr-2" /> New Post</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredPosts.length === 0 ? (
              <p className="text-center text-muted-foreground">No posts found.</p>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="p-3 border rounded bg-card flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    {post.featureImage && (
                      <img src={post.featureImage} alt="Feature" className="mt-2 w-full max-w-xs rounded" />
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags?.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                      <Badge variant="outline">{post.readingLevel}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex gap-4 flex-wrap">
                      <span>By {post.author}</span>
                      <span>{post.views.toLocaleString()} views</span>
                      <span>{post.publishDate}</span>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditPost(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <PostEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        post={editingPost}
        onSave={handleSavePost}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <Card>
    <CardContent className="p-4 flex items-center">
      {icon}
      <div className="ml-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default Admin;
