import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Mail, Lock, User, Phone, ArrowRight, Loader2, AlertCircle, Trophy, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: 'buyer'
      };

      const response = await axios.post('https://smec-backend.onrender.com/api/user/sign-up', payload);

      if (response.data.success) {
        navigate('/login');
      }

    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-body text-foreground overflow-hidden">
      
      {/* --- LEFT SIDE: VISUALS (Hidden on mobile) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden border-r border-zinc-800">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Content Content */}
        <div className="relative z-10 p-12 max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Registrations Open
          </div>
          
          <h1 className="font-display text-6xl font-bold leading-tight mb-6">
            Dominating the <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Arena.</span>
          </h1>
          
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            Join the ultimate university e-sports and tech olympiad. 
            Compete in CS2, Tekken, Coding, and Engineering challenges.
          </p>

          {/* Mini Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold text-white">600K+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Prize Pool</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
                <Users className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Competitions</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Header */}
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 group mb-6">
              <Gamepad2 className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
              <span className="font-display text-2xl font-bold">
                <span className="text-primary">SM</span>EC
              </span>
            </Link>
            <h2 className="text-3xl font-display font-bold tracking-tight">Create Account</h2>
            <p className="text-muted-foreground mt-2">
              Enter your details to generate your player profile.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                            name="fullName"
                            placeholder="John Doe"
                            className="pl-9 bg-zinc-900/50 border-zinc-800 focus:border-primary transition-colors h-11"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                            type="email"
                            name="email"
                            placeholder="student@university.edu"
                            className="pl-9 bg-zinc-900/50 border-zinc-800 focus:border-primary transition-colors h-11"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                            type="tel"
                            name="phoneNumber"
                            placeholder="0300 1234567"
                            className="pl-9 bg-zinc-900/50 border-zinc-800 focus:border-primary transition-colors h-11"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none">Password</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="••••••"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-primary transition-colors h-11"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none">Confirm</label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-primary transition-colors h-11"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <Button
              type="submit"
              variant="cyber" // Uses your neon style
              size="lg"
              className="w-full h-12 text-base mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Register
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}