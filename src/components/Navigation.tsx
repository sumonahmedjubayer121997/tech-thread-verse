import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, Clock, Star, Search, Filter, Code, Zap, Users, Menu, User, LogOut, Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, 
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Link as RouterLink } from 'react-router-dom';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const NavItems = () => (
    <>
      <Link 
        to="/" 
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
          isActive('/') ? 'bg-accent text-accent-foreground' : ''
        }`}
        onClick={() => setIsOpen(false)}
      >
        Home
      </Link>
      {user && (
        <>
          <Link 
            to="/bookmarks" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              isActive('/bookmarks') ? 'bg-accent text-accent-foreground' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Heart className="w-4 h-4" />
            Bookmarks
          </Link>
          <Link 
            to="/following" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              isActive('/following') ? 'bg-accent text-accent-foreground' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Users className="w-4 h-4" />
            Following
          </Link>
          <Link 
            to="/admin" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              isActive('/admin') ? 'bg-accent text-accent-foreground' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            <BookOpen className="w-4 h-4" />
            My Posts
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DevBlog
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavItems />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {user.email?.split('@')[0]}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItems />
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {user.email?.split('@')[0]}
                          </Badge>
                        </div>
                        <Button variant="outline" onClick={handleLogout} className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
