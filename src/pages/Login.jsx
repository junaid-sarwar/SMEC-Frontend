import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      // 1. Call your Backend API
      const response = await axios.post('https://smec-backend.onrender.com/api/user/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // 3. USE CONTEXT instead of localStorage manually
        login({
            token: response.data.token,
            user: response.data.user
        });
        toast.success(`Welcome Back ${response.data.user.fullName}!`);
        // 3. Redirect (You can change this path to '/' or '/dashboard')
        // alert(`Welcome back ${response.data.user.fullName}!`);
        navigate('/'); 
      }

    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong. Please try again!");
      // Handle API errors (e.g., "Incorrect email or password")
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden font-body text-foreground">
      
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-md mx-4">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <Gamepad2 className="h-10 w-10 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_10px_hsl(180_100%_50%/0.8)]" />
            <span className="font-display text-3xl font-bold tracking-tight">
              <span className="text-primary">SM</span>
              <span className="text-white">EC</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="card-cyber p-8 border border-primary/20 bg-card/50 backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-2 tracking-wide">
              Welcome Back
            </h1>
            <p className="text-zinc-400 text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/50 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="you@university.edu"
                  className="pl-10 bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20 text-white placeholder:text-zinc-600"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-zinc-300">
                  Password
                </label>
                {/* Optional: Add Forgot Password route later */}
                {/* <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline">
                  Forgot password?
                </Link> */}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20 text-white placeholder:text-zinc-600"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="cyber" // Using your new Cyber variant
              size="lg"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-all">
                Register now
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-6 text-center">
          <Link
            to="/admin/login" 
            className="text-sm text-zinc-500 hover:text-primary transition-colors"
          >
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}