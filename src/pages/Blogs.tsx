import { useEffect, useState } from 'react';
import {
  Clock, Calendar, BookOpen, Copy, Check, ArrowLeft, Share2, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  featureImage: string;
  postImages?: string[];
  publishDate: string;
  readingLevel: string;
  tags: string[];
  views: number;
  bookmarks?: number;
  likes?: number;
  readTime?: string;
  codeBlocks?: { id: number; language: string; code: string }[];
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const q = query(collection(db, 'posts'), where('id', '==', Number(id)));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const docData = querySnap.docs[0].data();
          setPost({ id: querySnap.docs[0].id, ...docData } as Post);
        } else {
          toast({
            title: 'Post not found',
            description: 'No blog post matches this ID.',
            variant: 'destructive'
          });
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        toast({
          title: 'Error',
          description: 'Failed to load blog post.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const copyToClipboard = async (code: string, codeId: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(codeId);
      toast({
        title: 'Code copied!',
        description: 'The code block has been copied to your clipboard.'
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy code to clipboard.',
        variant: 'destructive'
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading blog post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center h-16 px-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" /> <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" /> Share</Button>
            <Button variant="outline" size="sm"><Bookmark className="w-4 h-4 mr-1" /> Save</Button>
          </div>
        </div>
      </header>

      <article className="max-w-5xl mx-auto">
        {post.featureImage && (
          <div className="relative">
            <img
              src={post.featureImage}
              alt="Feature"
              className="w-full h-80 object-cover rounded-b-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Photo
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className={`${getLevelColor(post.readingLevel)} border`}>
              {post.readingLevel.charAt(0).toUpperCase() + post.readingLevel.slice(1)}
            </Badge>
            {post.readTime && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" /> {post.readTime}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <BookOpen className="w-4 h-4 mr-1" /> {post.views} views
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" /> {post.publishDate}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.postImages?.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.postImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Post image ${idx + 1}`}
                  className="rounded shadow"
                />
              ))}
            </div>
          )}

          {post.codeBlocks?.length > 0 && (
            <div className="mt-8 space-y-4">
              {post.codeBlocks.map(block => (
                <Card key={block.id}>
                  <CardContent className="p-0">
                    <div className="bg-gray-900 text-gray-100 rounded">
                      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <span className="text-sm">{block.language}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(block.code, block.id)}
                        >
                          {copiedCode === block.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <pre className="p-4 overflow-x-auto"><code>{block.code}</code></pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {post.likes ?? 0} likes • {post.bookmarks ?? 0} bookmarks
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
