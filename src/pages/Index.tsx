import { useEffect, useState } from 'react';
import { Clock, Star, Search, Filter, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  difficulty: 'Low' | 'Medium' | 'High';
  publishDate: string;
  tags: string[];
  featureImage: string;
  bookmarks: number;
  views: number;
}

const Index = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('views', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setFeaturedPosts(data);
      } catch (err) {
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
     
     {/* Featured Articles */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Featured Articles</h3>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        {featuredPosts.length === 0 ? (
          <p className="text-gray-500">No featured posts found.</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {featuredPosts.map(post => (
              <Link to={`/blog/${post.id}`} key={post.id}>
                <Card className="hover:shadow-lg transition">
                  {post.featureImage ? (
                    <img src={post.featureImage} alt={post.title} className="rounded-t-lg h-48 w-full object-cover" />
                  ) : (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className={`${getDifficultyColor(post.readingLevel)} border`}>
                        {post.readingLevel}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" /> {post.readTime} 8min to read
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{post.title}</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                      {post.content.slice(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.authorAvatar || '/placeholder.svg'}
                          alt={post.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Star className="w-4 h-4" /> {post.bookmarks ?? 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

  {/* Recent Posts */}
  <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Latest Posts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-800 cursor-pointer">
                
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge className={`${getDifficultyColor(post.readingLevel)} border`}>
                        {post.readingLevel}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" /> {post.readTime} 8min to read
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{post.title}</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                      {post.content.slice(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.authorAvatar || '/placeholder.svg'}
                          alt={post.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Star className="w-4 h-4" /> {post.bookmarks ?? 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>



       {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">DevBlog</h3>
              </div>
              <p className="text-gray-400">
                A platform for developers to share knowledge and learn from each other.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Frontend</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Backend</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DevOps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DevBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
