import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Helper to map backend category names to style keys
// Backend names: "E-Games", "Geeks", "General Games"
const getCategoryStyle = (categoryName) => {
  const normalized = categoryName?.toLowerCase().replace(' ', '-') || 'default';
  
  const styles = {
    'e-games': {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/30',
    },
    'geeks': { // Tech/Coding events
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    'general-games': { // Physical sports
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
    },
    'default': {
      bg: 'bg-zinc-800',
      text: 'text-zinc-400',
      border: 'border-zinc-700',
    }
  };

  return styles[normalized] || styles['default'];
};

export function EventCard({ event }) {
  // 1. Calculate real-time stock from Backend Data
  const ticketsAvailable = event.totalTickets - event.soldTickets;
  const isLowStock = ticketsAvailable > 0 && ticketsAvailable < 5;
  const isSoldOut = ticketsAvailable <= 0;

  // 2. Handle Category Styling safely
  // event.category is an object { _id, name } from .populate()
  const categoryName = event.category || 'General'; 
  const style = getCategoryStyle(categoryName);

  return (
    <Link to={`/events/${event._id}`} className="group block">
      <div className="card-cyber overflow-hidden border border-zinc-800 bg-zinc-900/50 rounded-xl transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(180_100%_50%_/_0.15)]">
        
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-zinc-800">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Category Badge */}
          <Badge
            className={cn(
              "absolute top-3 left-3 font-display text-xs uppercase tracking-wider",
              style.bg,
              style.text,
              style.border,
              "border backdrop-blur-md"
            )}
          >
            {categoryName}
          </Badge>

          {/* Stock Warning Badge */}
          {(isLowStock || isSoldOut) && (
            <Badge
              className={cn(
                "absolute top-3 right-3 font-body text-xs uppercase shadow-lg",
                isSoldOut
                  ? "bg-red-500/90 text-white border-red-500"
                  : "bg-yellow-500/90 text-black animate-pulse border-yellow-500"
              )}
            >
              {isSoldOut ? 'Sold Out' : `Only ${ticketsAvailable} left!`}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {event.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground font-body line-clamp-2 min-h-[40px]">
              {event.description || "No description provided."}
            </p>
          </div>

          {/* Meta Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-body">
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })} at {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-body line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-body text-muted-foreground">
                  {event.teamSize > 1 ? `${event.teamSize} Player Team` : 'Solo Entry'}
                </span>
              </div>
            </div>
            <span className="font-display text-lg font-bold text-primary">
              ₨{event.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}