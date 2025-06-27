import { useState } from 'react';
import { Clock, User, Calendar, BookOpen, Copy, Check, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const BlogPost = () => {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();

  const post = {
    id: 1,
    title: "Building Modern React Applications with TypeScript",
    content: `
TypeScript has become an essential tool for building robust React applications. In this comprehensive guide, we'll explore how to set up, configure, and leverage TypeScript to create maintainable and scalable React applications.

## Why TypeScript with React?

TypeScript brings static typing to JavaScript, which provides several benefits when building React applications:

- **Better Developer Experience**: Enhanced IntelliSense, auto-completion, and error detection
- **Improved Code Quality**: Catch errors at compile-time rather than runtime
- **Better Refactoring**: Safe and confident code refactoring
- **Enhanced Collaboration**: Self-documenting code through type definitions

## Setting Up the Project

Let's start by creating a new React application with TypeScript support:

\`\`\`bash
# Create a new React app with TypeScript template
npx create-react-app my-app --template typescript

# Navigate to the project directory
cd my-app

# Install additional type definitions
npm install --save-dev @types/node @types/react @types/react-dom
\`\`\`

## Component Props with TypeScript

One of the most important aspects of TypeScript in React is properly typing your component props:

\`\`\`tsx
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  name,
  email,
  avatar,
  isOnline,
  onClick
}) => {
  return (
    <div className="user-card" onClick={onClick}>
      {avatar && <img src={avatar} alt={name} />}
      <div>
        <h3>{name}</h3>
        <p>{email}</p>
        <span className={isOnline ? 'online' : 'offline'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};
\`\`\`

## State Management with TypeScript

Managing state in TypeScript requires careful consideration of types:

\`\`\`tsx
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const UserList: React.FC = () => {
  const [state, setState] = useState<UserState>({
    users: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const users: User[] = await response.json();
        
        setState(prev => ({
          ...prev,
          users,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to fetch users',
          loading: false
        }));
      }
    };

    fetchUsers();
  }, []);

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error}</div>;

  return (
    <div>
      {state.users.map(user => (
        <UserCard
          key={user.id}
          name={user.name}
          email={user.email}
          isOnline={true}
          onClick={() => console.log('User clicked:', user.name)}
        />
      ))}
    </div>
  );
};
\`\`\`

## Best Practices

Here are some key best practices when working with TypeScript and React:

1. **Use Interfaces for Props**: Define clear interfaces for your component props
2. **Leverage Union Types**: Use union types for props that can have multiple values
3. **Generic Components**: Create reusable components with generic types
4. **Strict Mode**: Enable strict mode in your TypeScript configuration
5. **Type Guards**: Use type guards for runtime type checking

## Conclusion

TypeScript significantly improves the React development experience by providing better tooling, catching errors early, and making code more maintainable. While there's a learning curve, the benefits far outweigh the initial investment in learning TypeScript.

Start small by adding TypeScript to existing components gradually, and you'll quickly see the benefits in your development workflow.
    `,
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      bio: "Senior Frontend Developer with 8+ years of experience in React and TypeScript"
    },
    readTime: "8 min read",
    difficulty: "Medium",
    publishDate: "January 15, 2024",
    tags: ["React", "TypeScript", "JavaScript", "Frontend"],
    views: 2840,
    bookmarks: 142,
    likes: 89
  };

  const codeBlocks = [
    {
      id: 1,
      language: "bash",
      code: `# Create a new React app with TypeScript template
npx create-react-app my-app --template typescript

# Navigate to the project directory
cd my-app

# Install additional type definitions
npm install --save-dev @types/node @types/react @types/react-dom`
    },
    {
      id: 2,
      language: "tsx",
      code: `interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  name,
  email,
  avatar,
  isOnline,
  onClick
}) => {
  return (
    <div className="user-card" onClick={onClick}>
      {avatar && <img src={avatar} alt={name} />}
      <div>
        <h3>{name}</h3>
        <p>{email}</p>
        <span className={isOnline ? 'online' : 'offline'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};`
    }
  ];

  const copyToClipboard = async (code: string, id: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      toast({
        title: "Code copied!",
        description: "The code block has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
      case 'High': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Badge className={`${getDifficultyColor(post.difficulty)} border`}>
              {post.difficulty}
            </Badge>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <BookOpen className="w-4 h-4 mr-1" />
              {post.views} views
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.author.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.bio}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                {post.publishDate}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.likes} likes • {post.bookmarks} bookmarks
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border dark:border-gray-700">
            {/* Content sections */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                TypeScript has become an essential tool for building robust React applications. In this comprehensive guide, we'll explore how to set up, configure, and leverage TypeScript to create maintainable and scalable React applications.
              </p>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why TypeScript with React?</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  TypeScript brings static typing to JavaScript, which provides several benefits when building React applications:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                  <li><strong>Better Developer Experience</strong>: Enhanced IntelliSense, auto-completion, and error detection</li>
                  <li><strong>Improved Code Quality</strong>: Catch errors at compile-time rather than runtime</li>
                  <li><strong>Better Refactoring</strong>: Safe and confident code refactoring</li>
                  <li><strong>Enhanced Collaboration</strong>: Self-documenting code through type definitions</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Setting Up the Project</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Let's start by creating a new React application with TypeScript support:
                </p>
                
                <Card className="mb-6">
                  <CardContent className="p-0">
                    <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <span className="text-sm font-medium text-gray-300">bash</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(codeBlocks[0].code, codeBlocks[0].id)}
                          className="text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                          {copiedCode === codeBlocks[0].id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm">{codeBlocks[0].code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Component Props with TypeScript</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  One of the most important aspects of TypeScript in React is properly typing your component props:
                </p>
                
                <Card className="mb-6">
                  <CardContent className="p-0">
                    <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <span className="text-sm font-medium text-gray-300">tsx</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(codeBlocks[1].code, codeBlocks[1].id)}
                          className="text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                          {copiedCode === codeBlocks[1].id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm">{codeBlocks[1].code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Best Practices</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Here are some key best practices when working with TypeScript and React:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                  <li><strong>Use Interfaces for Props</strong>: Define clear interfaces for your component props</li>
                  <li><strong>Leverage Union Types</strong>: Use union types for props that can have multiple values</li>
                  <li><strong>Generic Components</strong>: Create reusable components with generic types</li>
                  <li><strong>Strict Mode</strong>: Enable strict mode in your TypeScript configuration</li>
                  <li><strong>Type Guards</strong>: Use type guards for runtime type checking</li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Conclusion</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  TypeScript significantly improves the React development experience by providing better tooling, catching errors early, and making code more maintainable. While there's a learning curve, the benefits far outweigh the initial investment in learning TypeScript.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  Start small by adding TypeScript to existing components gradually, and you'll quickly see the benefits in your development workflow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">About {post.author.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{post.author.bio}</p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">Follow</Button>
                <Button variant="outline" size="sm">More Articles</Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
