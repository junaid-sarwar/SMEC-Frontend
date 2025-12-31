import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Gamepad2, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get Auth State
  const { auth, logout, isAdmin } = useAuth();
  const user = auth?.user;

  const navLinks = [
    { href: '/', label: 'Home' },
    // Show appropriate Dashboard link
    ...(user ? [{ 
        href: isAdmin ? '/admin/dashboard' : '/dashboard', 
        label: isAdmin ? 'Dashboard' : 'My Tickets' 
    }] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          
          {/* --- LOGO (Cyan & White - Matches Lovable) --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Gamepad2 className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_15px_hsl(180_100%_50%_/_0.8)]" />
              <div className="absolute inset-0 blur-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wider">
              <span className="text-primary">SM</span>
              <span className="text-white">EC</span>
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "font-body text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-1",
                  location.pathname === link.href
                    ? "text-primary" // Cyan when active
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {link.label}
                {/* Cyan Glow Underline */}
                {location.pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_hsl(180_100%_50%)]" />
                )}
              </Link>
            ))}
          </div>

          {/* --- AUTH SECTION --- */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // LOGGED IN: Avatar & Info
              <div className="flex items-center gap-4">
                
                {/* User Info (Purple Theme for Identity) */}
                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-white leading-none">{user.fullName}</p>
                        <p className={cn(
                            "text-[10px] uppercase tracking-wider font-bold mt-0.5",
                            isAdmin ? "text-purple-400" : "text-zinc-500"
                        )}>
                            {isAdmin ? 'Administrator' : 'Challenger'}
                        </p>
                    </div>
                    
                    {/* Avatar: Purple Circle (Matches Flyer Vibe) */}
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-display font-bold text-lg border shadow-lg",
                        isAdmin 
                            ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/20" 
                            : "bg-zinc-800 border-zinc-700 text-zinc-300"
                    )}>
                        {user.fullName.charAt(0).toUpperCase()}
                    </div>
                </div>

                <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="icon"
                    className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              // LOGGED OUT: Login / Register Buttons
              <div className="flex gap-4">
                <Link to="/login">
                    <Button variant="ghost" className="font-bold tracking-wide text-zinc-300 hover:text-white hover:bg-white/5">
                        LOGIN
                    </Button>
                </Link>
                
                <Link to="/signup">
                    {/* Solid Cyan Button (Matches Lovable) */}
                    <Button className="bg-primary hover:bg-cyan-400 text-black font-black tracking-widest hover:shadow-[0_0_20px_hsl(180_100%_50%_/_0.4)] transition-all">
                        REGISTER
                    </Button>
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <button
            className="md:hidden text-zinc-300 hover:text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* --- MOBILE DROPDOWN --- */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl absolute left-0 right-0 px-4 shadow-2xl animate-in slide-in-from-top-5">
            
            {/* Mobile User Profile */}
            {user && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-display font-bold text-lg",
                        isAdmin ? "bg-purple-600 text-white" : "bg-zinc-700 text-zinc-300"
                    )}>
                        {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-bold">{user.fullName}</p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg font-body text-sm font-bold uppercase tracking-widest transition-colors",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                {user ? (
                    <Button variant="outline" className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                ) : (
                    <>
                        <Button variant="ghost" className="w-full text-zinc-300 border border-white/10" asChild onClick={() => setIsOpen(false)}>
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button className="w-full bg-primary text-black font-bold hover:bg-cyan-400" asChild onClick={() => setIsOpen(false)}>
                            <Link to="/signup">Register Now</Link>
                        </Button>
                    </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}