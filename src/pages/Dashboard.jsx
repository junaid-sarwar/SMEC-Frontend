import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { jsPDF } from "jspdf";
import { 
    Ticket, Calendar, Users, QrCode, ArrowRight, Loader2, 
    Download, Wallet, Trophy, Plus 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar'; 
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTickets: 0,
    totalSpent: 0,
    totalMembers: 0
  });

  // 1. FETCH REAL DATA
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) {
            navigate('/login');
            return;
        }

        const { data } = await axios.get('https://smec-backend.onrender.com/api/events/my-tickets', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (data.success) {
          // 🔴 CRITICAL FIX: Filter out tickets where the Event has been deleted
          const validTickets = data.tickets.filter(ticket => ticket.event !== null);
          
          setTickets(validTickets);
          
          // Calculate Stats dynamically
          const spent = validTickets.reduce((acc, t) => acc + (t.pricePaid || 0), 0);
          const members = validTickets.reduce((acc, t) => acc + (t.teamMembers?.length || 0), 0);
          
          // Check if event date is in the future
          const active = validTickets.filter(t => new Date(t.event.date) > new Date()).length;

          setStats({
            activeTickets: active,
            totalSpent: spent,
            totalMembers: members
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        if (error.response?.status === 401) {
             navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, [navigate]);

  // 2. PDF DOWNLOAD LOGIC
  const downloadTicket = (ticket) => {
    if (!ticket.event) {
        toast.error("Cannot download ticket for deleted event.");
        return;
    }

    try {
        const doc = new jsPDF();
        doc.setFillColor(10, 10, 20); doc.rect(0, 0, 210, 297, 'F'); // Dark BG
        doc.setTextColor(0, 255, 255); doc.setFontSize(22);
        doc.text("SMEC '26 OFFICIAL PASS", 105, 20, null, null, "center");
        
        doc.setTextColor(255, 255, 255); doc.setFontSize(14);
        doc.text(`Event: ${ticket.event.title}`, 20, 50);
        doc.text(`Ticket ID: ${ticket.serialNumber}`, 20, 60);
        doc.text(`Date: ${new Date(ticket.event.date).toLocaleDateString()}`, 20, 70);
        doc.text(`Location: ${ticket.event.location}`, 20, 80);
        
        if(ticket.teamMembers && ticket.teamMembers.length > 0) {
            doc.setTextColor(255, 0, 255); doc.text("Team Members:", 20, 100);
            ticket.teamMembers.forEach((m, i) => {
                doc.setTextColor(200, 200, 200);
                doc.text(`${i+1}. ${m.fullName} (${m.universityName})`, 25, 110 + (i*10));
            });
        }
        doc.save(`Ticket-${ticket.serialNumber}.pdf`);
        toast.success("Ticket Downloaded!");
    } catch (e) {
        console.error("PDF Error", e);
        toast.error("Could not download PDF");
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-20">
        
        {/* --- HEADER --- */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dashboard</span>
            </h1>
            <p className="text-zinc-400 font-body">
              Manage your tournament registrations and download passes.
            </p>
          </div>
          <Button variant="default" className="shadow-lg shadow-primary/20" asChild>
            <Link to="/"> <Plus className="w-4 h-4 mr-2"/> Browse Events</Link>
          </Button>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
           <StatCard icon={Ticket} label="Active Tickets" value={stats.activeTickets} color="text-primary" bg="bg-primary/10" border="border-primary/30" />
           <StatCard icon={Wallet} label="Total Spent" value={`₨ ${stats.totalSpent}`} color="text-secondary" bg="bg-secondary/10" border="border-secondary/30" />
           <StatCard icon={Users} label="Total Team Members" value={stats.totalMembers} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/30" />
        </div>

        {/* --- TICKETS SECTION --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Trophy className="text-yellow-500 w-6 h-6" /> Your Events
            </h2>
          </div>

          {tickets.length === 0 ? (
            <div className="card-cyber p-16 text-center border-dashed border-2 border-zinc-800 bg-zinc-900/30 rounded-xl">
              <Ticket className="h-16 w-16 text-zinc-600 mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-2xl font-bold text-white mb-2">No Tickets Found</h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                You haven't registered for any competitions yet. The arena awaits!
              </p>
              <Button variant="cyber" size="lg" asChild>
                <Link to="/">Explore Events</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {tickets.map((ticket) => {
                // Determine Status based on Date
                const isPast = ticket.event ? new Date(ticket.event.date) < new Date() : false;
                
                return (
                  <div key={ticket._id} className="card-cyber overflow-hidden group hover:border-primary/50 transition-all duration-300 relative">
                    <div className="flex flex-col lg:flex-row">
                      
                      {/* 1. Left: Cyber Ticket Stub */}
                      <div className="lg:w-72 p-6 bg-zinc-950 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                        <div className="relative z-10">
                            <QrCode className="h-20 w-20 text-primary mb-4" />
                            <div className="font-mono text-sm text-zinc-500 tracking-[0.2em] mb-1">SERIAL ID</div>
                            <div className="font-display text-xl font-bold text-white tracking-widest">{ticket.serialNumber}</div>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-r border-white/10" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-l border-white/10" />
                      </div>

                      {/* 2. Right: Event Details */}
                      <div className="flex-1 p-6 md:p-8 relative">
                        {/* Background Image Blur */}
                        {ticket.event?.image && (
                             <div 
                                className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
                                style={{ backgroundImage: `url(${ticket.event.image})` }}
                             />
                        )}

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <Badge className="mb-2 bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-800">
                                    {ticket.event?.category || 'Event'}
                                </Badge>
                                <h3 className="font-display text-3xl font-bold text-white group-hover:text-primary transition-colors">
                                {ticket.event?.title || 'Unknown Event'}
                                </h3>
                            </div>
                            <Badge
                                className={cn(
                                "font-display text-xs uppercase tracking-wider px-3 py-1",
                                isPast
                                    ? "bg-zinc-800 text-zinc-500 border-zinc-700"
                                    : "bg-primary/20 text-primary border-primary/50 shadow-lg shadow-primary/20"
                                )}
                            >
                                {isPast ? 'COMPLETED' : 'ACTIVE PASS'}
                            </Badge>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase font-bold">Date</div>
                                        {ticket.event ? `${new Date(ticket.event.date).toLocaleDateString()} at ${ticket.event.time}` : 'N/A'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <Users className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase font-bold">Team Size</div>
                                        {ticket.teamMembers?.length > 0 ? `${ticket.teamMembers.length} Members` : 'Solo'}
                                    </div>
                                </div>
                            </div>

                            {/* Team Roster (Collapsible-ish look) */}
                            {ticket.teamMembers && ticket.teamMembers.length > 0 && (
                                <div className="mb-6">
                                    <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Team Roster</div>
                                    <div className="flex flex-wrap gap-2">
                                        {ticket.teamMembers.map((member, i) => (
                                        <div key={i} className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-sm flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">{i+1}</span>
                                            <span className="text-zinc-200">{member.fullName}</span>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                                <div className="text-sm text-zinc-500 font-mono">
                                    Paid: <span className="text-white font-bold">₨{ticket.pricePaid}</span>
                                </div>
                                <div className="flex gap-3">
                                    {ticket.event && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link to={`/events/${ticket.event._id}`}>
                                                View Event <ArrowRight className="ml-2 h-4 w-4"/>
                                            </Link>
                                        </Button>
                                    )}
                                    <Button onClick={() => downloadTicket(ticket)} variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 hover:text-primary text-zinc-300">
                                        <Download className="mr-2 h-4 w-4" /> Download Ticket
                                    </Button>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: STAT CARD ---
function StatCard({ icon: Icon, label, value, color, bg, border }) {
    return (
        <div className={cn("card-cyber p-6 flex items-center gap-4 border transition-transform hover:scale-[1.02]", border)}>
            <div className={cn("p-4 rounded-xl", bg)}>
                <Icon className={cn("h-8 w-8", color)} />
            </div>
            <div>
                <div className={cn("font-display text-3xl font-bold", color)}>{value}</div>
                <div className="text-sm text-zinc-400 font-body uppercase tracking-wider">{label}</div>
            </div>
        </div>
    )
}

// Helper Icon
function PlusIcon({className}) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}