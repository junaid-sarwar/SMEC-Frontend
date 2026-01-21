import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard, Calendar, Plus, AlertTriangle, DollarSign, Ticket,
  TrendingUp, LogOut, Gamepad2, Image as ImageIcon, Loader2, Trash2, 
  Users, Percent, Check, X, Menu, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import SmecLogo from '../../assets/logo-bg.png'

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Menu State
  const [events, setEvents] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Analytics State
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalEvents: 0,
    lowStockEvents: []
  });

  // 1. FETCH DATA
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/admin/login');
          return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Stats (Real Revenue), Events, and Discounts in parallel
      const [statsRes, eventRes, discountRes] = await Promise.all([
        axios.get('https://smec-backend.onrender.com/api/events/admin/stats', { headers }),
        axios.get('https://smec-backend.onrender.com/api/events/all'),
        axios.get('https://smec-backend.onrender.com/api/events/discounts', { headers })
      ]);
      
      if (statsRes.data.success) {
        setAnalytics(statsRes.data.stats);
      }

      if (eventRes.data.success) {
        setEvents(eventRes.data.events);
      }

      if (discountRes.data.success) {
        setDiscounts(discountRes.data.discounts);
      }

    } catch (error) {
      console.error("Dashboard Load Error:", error);
      if(error.response && error.response.status === 401) {
          navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. CUSTOM DELETE CONFIRMATION (NO JS ALERT)
  const confirmDeleteAction = (title, onConfirm) => {
    toast.custom((t) => (
      <div className="bg-zinc-950 border border-red-500/30 p-4 rounded-xl shadow-2xl w-[320px] backdrop-blur-md">
        <div className="flex gap-3">
          <div className="bg-red-500/10 p-2 rounded-full h-fit">
            <AlertTriangle className="text-red-500 h-5 w-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{title}</h3>
            <p className="text-zinc-400 text-xs mt-1 mb-3">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button 
                onClick={() => toast.dismiss(t)} 
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { toast.dismiss(t); onConfirm(); }} 
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // 3. ACTIONS
  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading("Deleting Event...");
    try {
        await axios.delete(`https://smec-backend.onrender.com/api/events/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.dismiss(loadingToast);
        toast.success("Event Deleted Successfully!");
        fetchData(); 
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete event");
    }
  };

  const handleDeleteDiscount = async (id) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`https://smec-backend.onrender.com/api/events/discount/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success("Discount Code Deleted!");
        fetchData();
    } catch (error) {
        toast.error("Failed to delete discount");
    }
  };

  const handleToggleDiscount = async (id) => {
    const token = localStorage.getItem('token');
    try {
        await axios.patch(`https://smec-backend.onrender.com/api/events/discount/${id}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success("Status Updated!");
        fetchData(); 
    } catch (error) {
        toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare Chart Data
  const chartData = events.map(e => ({
    name: e.title.length > 10 ? e.title.substring(0, 10) + '...' : e.title,
    revenue: (e.soldTickets || 0) * e.price // Note: This graph still shows Projected Revenue per event. Total Revenue card uses Real Data.
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex font-body text-zinc-100">
      
      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
             {/* Fixed height to prevent layout shift */}
             <img src={SmecLogo} className="h-10 w-auto object-contain" alt="SMEC Logo" />
             <span className="font-display text-lg font-bold text-white">ADMIN</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
        </Button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={cn(
          "fixed inset-y-0 left-0 w-64 bg-zinc-900/95 backdrop-blur-xl border-r border-white/10 p-6 z-40 transition-transform duration-300 lg:translate-x-0 lg:static pt-20 lg:pt-6",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* LOGO SECTION */}
        <div className="flex items-center justify-center mb-10 hidden lg:flex">
          <img 
            src={SmecLogo} 
            className="h-40 w-auto object-contain" 
            alt="SMEC Logo" 
          />
        </div>

        <nav className="space-y-2">
          <NavItem id="overview" label="Overview" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} />
          <NavItem id="events" label="Events List" icon={Calendar} activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} />
          <NavItem id="create" label="Create Event" icon={Plus} activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} />
          <NavItem id="discount" label="Discounts" icon={Percent} activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} />
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-zinc-400 border-zinc-700 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto min-h-screen relative pt-20 lg:pt-10">
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] pointer-events-none" />

        {/* --- VIEW: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="font-display text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-zinc-400">Welcome back, Administrator.</p>
              </div>
              <Button onClick={() => setActiveTab('create')} variant="cyber" className="hidden sm:flex shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" /> New Event
              </Button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={DollarSign} label="Total Revenue" value={`₨ ${analytics.totalRevenue.toLocaleString()}`} color="text-primary" />
              <StatCard icon={Ticket} label="Tickets Sold" value={analytics.totalTicketsSold} color="text-secondary" />
              <StatCard icon={Calendar} label="Total Events" value={analytics.totalEvents} color="text-purple-400" />
              <StatCard icon={AlertTriangle} label="Low Stock" value={analytics.lowStockEvents.length} color="text-red-400" />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
              {/* Chart */}
              <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" /> Revenue Analytics
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₨${value}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#3f3f46', color: '#fff', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#d946ef' : '#2dd4bf'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Alerts Panel */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm overflow-hidden flex flex-col min-h-[300px]">
                <h3 className="font-display text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Low Stock
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {analytics.lowStockEvents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
                        <Ticket className="h-10 w-10 opacity-20" />
                        <p className="text-sm">Inventory good.</p>
                    </div>
                  ) : (
                    analytics.lowStockEvents.map((event) => (
                      <div key={event._id} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-sm text-white line-clamp-1">{event.title}</div>
                          <div className="text-xs text-red-400">{(event.totalTickets - event.soldTickets)} left</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: EVENTS LIST --- */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-in fade-in">
            <h1 className="font-display text-3xl font-bold text-white">Event Inventory</h1>
            <div className="grid gap-4">
              {events.map((event) => (
                <div key={event._id} className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 hover:border-primary/50 transition-all hover:bg-zinc-900/60">
                  <div className="w-full sm:w-40 h-32 sm:h-24 rounded-xl overflow-hidden bg-black shrink-0 relative">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon size={24}/></div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-[10px] uppercase font-bold px-2 py-1 rounded text-white border border-white/10">
                        {event.category}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="text-sm text-zinc-400 flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-1">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(event.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Users size={14}/> {event.teamSize > 1 ? `Team of ${event.teamSize}` : 'Solo'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 min-w-[180px] justify-end">
                    <div className="text-right">
                        <div className="font-display text-2xl font-bold text-white">₨{event.price}</div>
                        <div className={cn("text-xs font-bold uppercase", (event.totalTickets - event.soldTickets) < 5 ? "text-red-500" : "text-green-500")}>
                            {(event.totalTickets - event.soldTickets)} / {event.totalTickets} Left
                        </div>
                    </div>
                    
                    <Button 
                        onClick={() => confirmDeleteAction('Delete Event?', () => handleDeleteEvent(event._id))}
                        variant="outline" 
                        size="icon" 
                        className="border-zinc-700 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: CREATE EVENT --- */}
        {activeTab === 'create' && (
          <CreateEventForm onSuccess={() => { fetchData(); setActiveTab('events'); }} onBack={() => setActiveTab('overview')} />
        )}

        {/* --- VIEW: DISCOUNTS --- */}
        {activeTab === 'discount' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
             <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-secondary">Active Codes</h2>
                <div className="grid gap-3">
                    {discounts.map((discount) => (
                        <div key={discount._id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all">
                            <div>
                                <div className="font-display text-xl font-bold text-white tracking-wider flex items-center gap-2">
                                    {discount.code}
                                    <span className={cn("text-[10px] px-2 py-0.5 rounded border uppercase", discount.isActive ? "border-green-500/30 text-green-500 bg-green-500/10" : "border-red-500/30 text-red-500 bg-red-500/10")}>
                                        {discount.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-400 mt-1">{discount.percentage}% Discount</div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* TOGGLE SWITCH */}
                                <button 
                                    onClick={() => handleToggleDiscount(discount._id)}
                                    className={cn("w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none", discount.isActive ? "bg-green-500/20 border border-green-500" : "bg-zinc-800 border border-zinc-600")}
                                    title="Toggle Status"
                                >
                                    <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-300 bg-white", discount.isActive ? "translate-x-6" : "")} />
                                </button>

                                {/* DELETE BUTTON */}
                                <Button 
                                    onClick={() => confirmDeleteAction('Revoke Code?', () => handleDeleteDiscount(discount._id))}
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
             <div className="h-fit"><CreateDiscountForm onSuccess={() => fetchData()} /></div>
          </div>
        )}

      </main>
    </div>
  );
}

// -------------------------------------------
// SUB COMPONENTS
// -------------------------------------------

function NavItem({ id, label, icon: Icon, activeTab, setActiveTab }) {
    const isActive = activeTab === id;
    return (
        <button onClick={() => setActiveTab(id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-semibold transition-all duration-300 group", isActive ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]" : "text-zinc-400 hover:text-white hover:bg-white/5")}>
            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-zinc-500")} />
            {label}
        </button>
    )
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl bg-black/40 border border-white/5", color)}><Icon className="h-6 w-6" /></div>
            </div>
            <div className="font-display text-3xl font-bold text-white">{value}</div>
            <div className="text-sm text-zinc-500 mt-1">{label}</div>
        </div>
    )
}

function CreateEventForm({ onSuccess, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'E-Games', date: '', time: '',
    location: '', price: '', totalTickets: '', teamSize: '1'
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      const response = await axios.post('https://smec-backend.onrender.com/api/events/create', data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) { 
          toast.success("Event Launched!"); 
          onSuccess(); 
      }
    } catch (error) { 
        console.error(error);
        toast.error("Failed to create event"); 
    } 
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white">← Back</Button>
        <h1 className="font-display text-3xl font-bold text-white">Initialize New Event</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="grid gap-6">
            <input name="title" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="Event Title" required />
            <textarea name="description" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none h-24" placeholder="Description" required />
            <div className="grid grid-cols-2 gap-4">
                <select name="category" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary">
                    <option value="E-Games">E-Games</option>
                    <option value="Geeks">Geeks</option>
                    <option value="General Games">General Games</option>
                </select>
                <input name="teamSize" type="number" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="Team Size" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input name="date" type="date" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" required />
                <input name="time" type="text" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="Time" required />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <input name="location" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="Location" required />
                <input name="price" type="number" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="Price" required />
                <input name="totalTickets" type="number" onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" placeholder="Total Tickets" required />
            </div>
            
            <div className="border-2 border-dashed border-white/10 rounded-xl h-48 flex items-center justify-center relative hover:border-primary cursor-pointer overflow-hidden group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" required />
                {previewUrl ? (
                    <div className="relative w-full h-full">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold bg-black/50 px-3 py-1 rounded">Click to Change</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-primary">
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span className="text-sm font-bold">Upload Cover</span>
                        <span className="text-xs opacity-50">JPG, PNG (Max 5MB)</span>
                    </div>
                )}
            </div>
        </div>
        <Button type="submit" variant="cyber" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Launch Event"}
        </Button>
      </form>
    </div>
  );
}

function CreateDiscountForm({ onSuccess }) {
    const [code, setCode] = useState('');
    const [percent, setPercent] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://smec-backend.onrender.com/api/events/discount', 
                { code, percentage: percent, isActive },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success("Discount Code Created!");
            setCode(''); setPercent(''); setIsActive(true);
            onSuccess();
        } catch (error) {
            toast.error("Failed to create discount");
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-8 backdrop-blur-xl shadow-2xl h-fit">
            <h1 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Percent className="text-secondary" /> Add New Code
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-xs text-zinc-400 font-bold uppercase">Code Name</label>
                    <input value={code} onChange={e => setCode(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-secondary outline-none uppercase" placeholder="SMEC2026" required />
                </div>
                <div>
                    <label className="text-xs text-zinc-400 font-bold uppercase">Percentage Off</label>
                    <input type="number" value={percent} onChange={e => setPercent(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-secondary outline-none" placeholder="20" required />
                </div>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                    <label className="text-sm text-zinc-300 font-medium">Active Status</label>
                    <label className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                </div>
                <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Generate Code"}
                </Button>
            </form>
        </div>
    )
}