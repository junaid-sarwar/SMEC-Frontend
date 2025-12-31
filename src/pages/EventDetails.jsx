import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, MapPin, Users, Ticket, Tag, Loader2, Sparkles } from 'lucide-react';
// Check your folder structure: usually components/layout/Navbar or components/Navbar
import { Navbar } from '@/components/Navbar'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// Import Sound
import coinSoundFile from '@/assets/sounds/cash-coin-sound.mp3';

export default function EventDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Sound
  const coinSound = new Audio(coinSoundFile);

  // 1. Fetch Event Details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get('https://smec-backend.onrender.com/api/events/all');
        if (data.success) {
          const foundEvent = data.events.find((e) => e._id === id);
          if (foundEvent) {
            setEvent(foundEvent);
            
            // ✅ CRITICAL FIX: Use Array.from to create UNIQUE objects for each member
            // Array(5).fill({...}) creates 5 references to the SAME object (buggy)
            const initialMembers = Array.from({ length: foundEvent.teamSize }, () => ({
                fullName: '',
                universityName: ''
            }));
            
            setTeamMembers(initialMembers);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // 2. Handle Input Change for Team Members
  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  // 3. Handle Ticket Purchase
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth) {
        toast.error("Please login to register!");
        navigate('/login');
        return;
    }
    
    // Validate fields
    const isValid = teamMembers.every(
      (member) => member.fullName.trim() && member.universityName.trim()
    );

    if (!isValid) {
      toast.error('Please fill in details for all team members.');
      return;
    }

    // Play Sound
    try {
        coinSound.currentTime = 0;
        await coinSound.play();
    } catch (e) {
        console.log("Audio play failed:", e);
    }

    setIsSubmitting(true);
    
    try {
        const token = localStorage.getItem('token');
        
        const payload = {
            eventId: event._id,
            discountCode: discountCode ? discountCode.toUpperCase() : null, // Fix Case Sensitivity
            teamMembers: teamMembers
        };

        const response = await axios.post('http://localhost:8080/api/events/buy-ticket', payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(response.data.success) {
            toast.success(`Registered Successfully!`);
            navigate('/dashboard'); 
        }

    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="font-display text-4xl font-bold mb-4">Event Not Found</h1>
        <Button variant="outline" asChild>
            <Link to="/"> <ArrowLeft className="mr-2 h-4 w-4"/> Back to Home </Link>
        </Button>
      </div>
    );
  }

  const ticketsAvailable = event.totalTickets - event.soldTickets;

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      {/* --- HERO IMAGE (Responsive Height) --- */}
      <div className="relative h-[40vh] md:h-[50vh] mt-20 group overflow-hidden">
        {event.image ? (
            <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-zinc-700 font-display text-4xl">NO IMAGE</span>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <Button variant="outline" size="sm" asChild className="bg-black/50 backdrop-blur-md border-white/20 hover:bg-black/70 text-white">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
        </div>
      </div>

      {/* --- MAIN CONTENT (Negative Margin Logic) --- */}
      {/* Mobile: -mt-12 to pull up slightly | Desktop: -mt-32 for large overlap */}
      <div className="container mx-auto px-4 -mt-12 md:-mt-32 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-cyber p-6 md:p-8 bg-zinc-900/80 backdrop-blur-xl border border-white/10">
              <Badge className="font-display text-xs uppercase tracking-wider mb-4 bg-primary/20 text-primary border-primary/50">
                {event.category}
              </Badge>
              
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {event.title}
              </h1>
              
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed border-l-4 border-primary/50 pl-4">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                <InfoCard icon={Calendar} label="Date & Time" value={`${new Date(event.date).toLocaleDateString()} at ${event.time}`} />
                <InfoCard icon={MapPin} label="Location" value={event.location} />
                <InfoCard icon={Users} label="Format" value={event.teamSize === 1 ? 'Solo Competition' : `Team of ${event.teamSize}`} />
                <InfoCard 
                    icon={Ticket} 
                    label="Availability" 
                    value={`${ticketsAvailable} Slots Remaining`} 
                    highlight={ticketsAvailable < 5} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Registration Form */}
          <div className="lg:col-span-1">
            <div className="card-cyber p-6 sticky top-24 bg-zinc-900/90 border border-primary/30 shadow-2xl shadow-primary/10">
              <div className="text-center mb-8 pb-6 border-b border-white/10">
                <div className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-2">Registration Fee</div>
                <div className="font-display text-4xl md:text-5xl font-bold text-white flex justify-center items-start gap-1">
                  <span className="text-2xl mt-2 text-primary">₨</span>
                  {event.price}
                </div>
                {event.teamSize > 1 && <div className="text-xs text-zinc-500 mt-2">PER TEAM ENTRY</div>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <h3 className="font-display text-sm uppercase tracking-wider text-primary flex items-center gap-2 sticky top-0 bg-zinc-900 z-10 py-2">
                    <Users className="h-4 w-4" /> 
                    {event.teamSize === 1 ? 'Player Details' : 'Team Roster'}
                  </h3>
                  
                  {teamMembers.map((member, index) => (
                    <div key={index} className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                        {index === 0 ? 'Captain (You)' : `Player ${index + 1}`}
                      </div>
                      <Input
                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary text-sm h-10"
                        placeholder="Full Name"
                        value={member.fullName}
                        onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)}
                        required
                      />
                      <Input
                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary text-sm h-10"
                        placeholder="University Name"
                        value={member.universityName}
                        onChange={(e) => handleMemberChange(index, 'universityName', e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Discount Code
                  </label>
                  <Input
                    className="bg-black/40 border-dashed border-white/20 text-center uppercase tracking-widest font-mono text-primary placeholder:text-zinc-700 focus:border-primary"
                    placeholder="SMEC2026"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  variant="cyber"
                  size="xl"
                  className="w-full h-12 md:h-14 text-base md:text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                  disabled={isSubmitting || ticketsAvailable === 0}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> 
                  ) : ticketsAvailable === 0 ? (
                    'SOLD OUT'
                  ) : (
                    <>Pay & Register</>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-Component for Clean Code
function InfoCard({ icon: Icon, label, value, highlight }) {
    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-xl border transition-colors group hover:bg-white/5",
            highlight ? "bg-red-500/10 border-red-500/30" : "bg-black/20 border-white/5"
        )}>
            <div className={cn("p-3 rounded-full", highlight ? "bg-red-500/20 text-red-500" : "bg-primary/10 text-primary")}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">{label}</div>
                <div className={cn("font-body text-sm font-semibold mt-0.5", highlight ? "text-red-400" : "text-white")}>
                    {value}
                </div>
            </div>
        </div>
    )
}