import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Ensure you have this component or use a standard <button>
import axios from 'axios';

export function HeroSection() {
  const [stats, setStats] = useState([
    { value: '0', label: 'Competitors' },
    { value: '0', label: 'Events' },
    { value: 'Rs600K+', label: 'Prize Pool' }, // Hardcoded based on your Flyer
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Adjust the URL if your backend runs on a different port (e.g., 8080 or 3001)
        const { data } = await axios.get('http://localhost:8080/api/events/all');
        
        if (data.success) {
          const events = data.events;

          // 1. Calculate Total Events
          const totalEvents = events.length;

          // 2. Calculate Total Competitors (Sum of soldTickets)
          // Note: If you want to count individual team members, logic might differ based on teamSize
          // For now, soldTickets is a good proxy for registrations.
          const totalCompetitors = events.reduce((acc, curr) => acc + (curr.soldTickets || 0), 0);

          setStats([
            { value: `${totalCompetitors}+`, label: 'Competitors' },
            { value: `${totalEvents}+`, label: 'Events' },
            { value: 'Rs600K+', label: 'Prize Pool' },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch hero stats:", error);
        // Fallback to defaults if API fails
        setStats([
            { value: '500+', label: 'Competitors' },
            { value: '25+', label: 'Events' },
            { value: 'Rs600K+', label: 'Prize Pool' },
        ]);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            {/* <Sparkles className="h-4 w-4 text-primary" /> */}
            <span className="text-sm font-body font-semibold text-primary uppercase tracking-wider">
              Season 2026 Now Live
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="block text-foreground">COMPETE.</span>
            <span className="block text-gradient">CONQUER.</span>
            <span className="block text-foreground">CHAMPION.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body leading-relaxed">
            The ultimate university competition platform. From intense E-Sports battles to 
            mind-bending coding challenges — prove your skills and claim glory.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="cyber" size="xl" asChild>
              <Link to="/events">
                Explore Events
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/sign-up"> {/* Changed from /signup to match your backend logic usually */}
                Register Now
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-lg mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary glow-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-body uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}