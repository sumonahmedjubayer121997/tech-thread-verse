
import { useState } from 'react';
import { BookOpen, Clock, Star, Search, Filter, Code, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPosts = [
    {
      id: 1,
      title: "Building Modern React Applications with TypeScript",
      excerpt: "Learn how to create scalable React applications using TypeScript, covering best practices for component architecture, state management, and testing strategies.",
      author: "Sarah Chen",
      authorAvatar: "/placeholder.svg",
      readTime: "8 min read",
      difficulty: "Medium",
      publishDate: "2024-01-15",
      tags: ["React", "TypeScript", "JavaScript"],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
      bookmarks: 142,
      views: 2840
    },
    {
      id: 2,
      title: "Advanced Node.js Performance Optimization Techniques",
      excerpt: "Dive deep into Node.js performance optimization, covering memory management, clustering, profiling, and advanced debugging techniques for production applications.",
      author: "Marcus Rodriguez",
      authorAvatar: "/placeholder.svg",
      readTime: "12 min read",
      difficulty: "High",
      publishDate: "2024-01-10",
      tags: ["Node.js", "Performance", "Backend"],
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
      bookmarks: 89,
      views: 1920
    },
    {
      id: 3,
      title: "Getting Started with MongoDB Atlas and Express.js",
      excerpt: "A beginner-friendly guide to setting up MongoDB Atlas, connecting it with Express.js, and building your first REST API with proper error handling.",
      author: "Emily Johnson",
      authorAvatar: "/placeholder.svg",
      readTime: "6 min read",
      difficulty: "Low",
      publishDate: "2024-01-08",
      tags: ["MongoDB", "Express.js", "Database"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
      bookmarks: 203,
      views: 3120
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Docker Containerization for Full-Stack Applications",
      excerpt: "Learn how to containerize your MERN stack applications using Docker, including multi-stage builds and docker-compose for development.",
      author: "Alex Kim",
      authorAvatar: "/placeholder.svg",
      readTime: "10 min read",
      difficulty: "Medium",
      publishDate: "2024-01-12",
      tags: ["Docker", "DevOps", "Containerization"],
      bookmarks: 67,
      views: 1540
    },
    {
      id: 5,
      title: "Implementing JWT Authentication in React and Node.js",
      excerpt: "Step-by-step guide to implementing secure JWT authentication with refresh tokens, protecting routes, and handling user sessions.",
      author: "David Park",
      authorAvatar: "/placeholder.svg",
      readTime: "15 min read",
      difficulty: "Medium",
      publishDate: "2024-01-05",
      tags: ["JWT", "Authentication", "Security"],
      bookmarks: 134,
      views: 2680
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DevBlog
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-900 hover:text-purple-600 transition-colors">Home</Link>
              <Link to="/blogs" className="text-gray-500 hover:text-purple-600 transition-colors">All Blogs</Link>
              <Link to="/categories" className="text-gray-500 hover:text-purple-600 transition-colors">Categories</Link>
              <Link to="/about" className="text-gray-500 hover:text-purple-600 transition-colors">About</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Developers
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Share Knowledge
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the latest in web development, programming tutorials, and technical insights from experienced developers around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search articles, tutorials, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full"
              />
            </div>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Search
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Technical Articles</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-gray-600">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">Expert Authors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900">Featured Articles</h3>
            <Link to="/blogs">
              <Button variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
                View All Posts
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getDifficultyColor(post.difficulty)} border`}>
                      {post.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {post.bookmarks}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getDifficultyColor(post.difficulty)} border`}>
                      {post.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h4>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {post.bookmarks}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
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
