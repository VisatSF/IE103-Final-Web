
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu.jsx';
import JobilleeLogo from './JobilleeLogo.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const displayName = user?.fullName || user?.name || 'U';

  const navItems = [
    { label: 'TRANG CHỦ', path: '/' },
    { label: 'VỀ JOBILLEE', path: '/about' },
    { label: 'THỰC ĐƠN', path: '/menu' },
    { label: 'KHUYẾN MÃI', path: '/promotions' },
    { label: 'DỊCH VỤ', path: '/services' },
    { label: 'TIN TỨC', path: '/news' },
    { label: 'CỬA HÀNG', path: '/stores' },
    { label: 'LIÊN HỆ', path: '/contact' },
    { label: 'TUYỂN DỤNG', path: '/careers' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          
          {/* Logo Section - Seamlessly integrated */}
          <Link to="/" className="flex items-center justify-center shrink-0">
            <JobilleeLogo className="h-20 md:h-24 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-white/20 text-primary-foreground'
                    : 'text-primary-foreground hover:bg-[hsl(var(--primary-hover))] active:bg-[hsl(var(--primary-active))]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Auth & Cart Section */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Cart Icon */}
            <Link to="/cart" className="relative group p-2 text-primary-foreground hover:bg-[hsl(var(--primary-hover))] rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[rgb(var(--jobillee-yellow))] text-[rgb(var(--jobillee-dark))] text-[10px] font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {!user ? (
              <Link to="/login">
                <Button 
                  className="bg-[rgb(var(--jobillee-yellow))] hover:bg-[rgb(var(--jobillee-yellow))]/90 text-[rgb(var(--jobillee-dark))] font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm"
                >
                  ĐĂNG NHẬP
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary-foreground hover:opacity-90 transition-opacity">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user.avatar} alt={displayName} className="object-cover" />
                      <AvatarFallback className="bg-[rgb(var(--jobillee-yellow))] text-[rgb(var(--jobillee-dark))] font-bold">
                        {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-1">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer py-2 font-medium">
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2 text-destructive font-medium focus:text-destructive focus:bg-destructive/10">
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden ml-auto">
            <Link to="/cart" className="relative p-2 text-primary-foreground">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(var(--jobillee-yellow))] text-[rgb(var(--jobillee-dark))] text-[9px] font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-primary-foreground hover:bg-[hsl(var(--primary-hover))] rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-white/20 text-primary-foreground'
                    : 'text-primary-foreground hover:bg-[hsl(var(--primary-hover))] active:bg-[hsl(var(--primary-active))]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 px-4 border-t border-white/20 mt-4">
              {!user ? (
                <Button 
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="w-full bg-[rgb(var(--jobillee-yellow))] hover:bg-[rgb(var(--jobillee-yellow))]/90 text-[rgb(var(--jobillee-dark))] font-bold"
                >
                  ĐĂNG NHẬP
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10 border-2 border-primary-foreground">
                      <AvatarImage src={user.avatar} alt={displayName} />
                      <AvatarFallback className="bg-[rgb(var(--jobillee-yellow))] text-[rgb(var(--jobillee-dark))] font-bold">
                        {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-primary-foreground">
                      <p className="font-bold text-sm">{displayName}</p>
                      <p className="text-xs opacity-80">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                    className="w-full justify-start bg-transparent text-primary-foreground border-white/30 hover:bg-white/10"
                  >
                    Thông tin cá nhân
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full justify-start bg-transparent text-primary-foreground border-white/30 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                  >
                    Đăng xuất
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
