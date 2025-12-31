import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, Terminal } from "lucide-react";
import gsap from "gsap";

const NotFound = () => {
  const location = useLocation();
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Log the error
    console.error("404 Error: Route not found:", location.pathname);

    // GSAP Context for cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Glitch/Scale In Effect for 404
      tl.fromTo(
        ".error-code",
        { scale: 0.8, opacity: 0, textShadow: "0px 0px 0px rgba(0,255,255,0)" },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.8, 
          ease: "elastic.out(1, 0.5)",
          textShadow: "0px 0px 20px rgba(0,255,255,0.8), -4px 0px #ff00ff, 4px 0px #00ffff"
        }
      );

      // 2. Shake effect slightly to simulate instability
      gsap.to(".error-code", {
        x: "+=2",
        y: "-=2",
        repeat: -1,
        yoyo: true,
        duration: 0.1,
        ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})"
      });

      // 3. Fade in rest of content
      tl.fromTo(
        ".content-fade",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.2 }
      );

    }, containerRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden text-foreground"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="scanline opacity-10" />

      {/* Main Content Card */}
      <div className="relative z-10 p-8 md:p-12 text-center max-w-2xl mx-auto">
        
        {/* Warning Icon */}
        <div className="content-fade mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full animate-pulse-slow" />
            <AlertTriangle className="w-16 h-16 text-destructive relative z-10" />
          </div>
        </div>

        {/* 404 Glitch Text */}
        <h1 
          ref={textRef}
          className="error-code text-8xl md:text-9xl font-display font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-secondary mb-2 select-none"
        >
          404
        </h1>

        <div className="content-fade space-y-2 mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary uppercase tracking-wider">
            System Failure
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Signal lost at coordinates: <span className="font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded">{location.pathname}</span>
          </p>
          <p className="text-zinc-500 font-mono text-sm">
            The requested sector has been corrupted or does not exist.
          </p>
        </div>

        {/* Actions */}
        <div className="content-fade flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button variant="cyber" size="xl" className="group">
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Return to Base
            </Button>
          </Link>
          
          <Button variant="outline" size="xl" onClick={() => window.history.back()}>
            <Terminal className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

      </div>

      {/* Decorative Footer */}
      <div className="absolute bottom-8 text-center content-fade">
        <p className="text-xs text-zinc-600 font-mono uppercase tracking-[0.2em]">
          SMEC SECURITY PROTOCOL
        </p>
      </div>
    </div>
  );
};

export default NotFound;