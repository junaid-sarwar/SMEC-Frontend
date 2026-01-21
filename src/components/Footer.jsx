import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import SmecLogo from '@/assets/logo-bg.png'; // Import your logo

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur-xl relative z-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* 1. Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src={SmecLogo} 
                alt="SMEC Logo" 
                className="h-28 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform hover:scale-105" 
              />
            </Link>
            <p className="text-sm text-white font-body leading-relaxed max-w-xs">
              The ultimate university competition platform. <br />
              Speed, Mind, Execution, Competition. <br />
              All in one arena.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Events', path: '/events' },
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'About Team', path: '/about' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-white hover:text-primary transition-colors font-body font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Categories */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-6 text-white">
              Arenas
            </h4>
            <ul className="space-y-3">
              {['E-Games', 'Geeks', 'General Games'].map((item) => (
                <li key={item}>
                  <Link
                    to="/events"
                    className="text-sm text-white hover:text-primary transition-colors font-body font-semibold"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Social & Connect */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-6 text-white">
              Connect
            </h4>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-3 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs text-purple-500 font-mono">
              Organized by Dept of CS & IT
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white font-body">
            © 2026 SMEC. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-zinc-600 font-mono uppercase tracking-wider">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}