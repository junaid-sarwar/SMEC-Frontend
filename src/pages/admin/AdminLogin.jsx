import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. API Call to Backend
      const response = await axios.post(
        "https://smec-backend.onrender.com/api/user/admin-login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success) {
        // 3. USE CONTEXT instead of localStorage manually
        login({
            token: response.data.token,
            user: response.data.user
        });

        // 3. Redirect to Admin Dashboard
        // Note: You haven't built this page yet, but the route should be ready
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      // Handle specific errors (e.g. "Access Denied" from your backend)
      setError(
        err.response?.data?.message ||
          "Invalid credentials or unauthorized access."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden font-body">
      {/* Background Effects (Purple/Accent Theme for Admins) */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <Shield className="h-12 w-12 text-secondary drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
            <span className="font-display text-3xl font-bold text-foreground">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="card-cyber p-8 border-secondary/30 bg-zinc-900/80 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              System Access
            </h1>
            <p className="text-zinc-400 text-sm">
              Authorized personnel only. All attempts are logged.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/50 flex items-center gap-2 text-destructive text-sm animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">
                Admin Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-secondary transition-colors" />
                <Input
                  type="email"
                  placeholder="admin@smec2026.com"
                  className="pl-10 bg-black/40 border-zinc-700 focus:border-secondary focus:ring-secondary/20 text-white placeholder:text-zinc-600 h-11"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-secondary transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-black/40 border-zinc-700 focus:border-secondary focus:ring-secondary/20 text-white placeholder:text-zinc-600 h-11"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary" // Pink/Magenta for Admin to distinguish from Student (Cyan)
              size="lg"
              className="w-full h-12 text-base font-bold shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Access Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-800 pt-4">
            <Link
              to="/login"
              className="text-sm text-zinc-500 hover:text-secondary font-body transition-colors flex items-center justify-center gap-2"
            >
              ← Back to Student Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
