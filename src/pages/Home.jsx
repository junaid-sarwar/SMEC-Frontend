import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/HeroSection'; // This is the API-enabled one we just made
import { EventCard } from '@/components/EventCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Loader2 } from 'lucide-react'; // Optional: for loading state

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch Events from Backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('https://smec-backend.onrender.com/api/events/all');
        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter Logic
  // Note: Backend returns event.category as an object { _id, name } due to .populate()
  const filteredEvents = selectedCategory
    ? events.filter((event) => event.category === selectedCategory)
    : events;

  // Extract unique categories dynamically from fetched events (Optional helper for your Filter component)
  // You might pass this to CategoryFilter if it accepts a 'categories' prop
  const uniqueCategories = [...new Set(events.map(e => e.category?.name))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <HeroSection />

      {/* Events Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming <span className="text-gradient">Events</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Browse through our exciting lineup of competitions. Find your arena and register today.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-10">
{/*             
              Ensure your CategoryFilter component sends back the string name (e.g., "E-Games") 
              via onSelect. If your Filter component needs the list of available categories, 
              you can pass `categories={uniqueCategories}` prop here.
            */}
            <CategoryFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            /* Events Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event._id} // MongoDB uses _id, not id
                  event={event} 
                />
              ))}
            </div>
          )}

          {/* No Events Found State */}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-body text-lg">
                No events found {selectedCategory ? `in ${selectedCategory}` : ''}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;