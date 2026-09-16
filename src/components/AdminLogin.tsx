import React, { useEffect } from "react";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { BrandLogo } from "@/components/BrandLogo";

export const AdminLogin: React.FC = () => {
  const { user, isAdmin, loading, error, signInWithGoogle } = useAdminAuth();

  useEffect(() => {
    if (isAdmin && typeof window !== "undefined") {
      window.location.href = "/admin";
    }
  }, [isAdmin]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Failed to initiate Google sign in:", err);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 overflow-hidden">
      {/* Cyber Ambient Lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 blur-[130px] rounded-full" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="lg" to="/" />

          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Shield className="h-7 w-7 text-cyan-400" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Super Telecom Admin CMS
          </h1>
          <p className="mt-2 text-xs text-slate-400 max-w-xs leading-relaxed">
            Restricted access for verified staff only. Sign in with your registered Google administrator account.
          </p>

          {/* Error Banner for Unauthorized Accounts */}
          {error && (
            <div className="mt-6 w-full rounded-xl border border-rose-500/40 bg-rose-950/50 p-3.5 text-left text-xs text-rose-200 flex items-start gap-3 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-fade-up">
              <AlertTriangle className="h-5 w-5 text-rose-400 flex-none mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Access Denied</p>
                <p className="mt-0.5 text-rose-200/90">{error}</p>
              </div>
            </div>
          )}

          {/* User Already Signed In as Non-Admin */}
          {user && !isAdmin && !error && (
            <div className="mt-6 w-full rounded-xl border border-amber-500/40 bg-amber-950/50 p-3.5 text-left text-xs text-amber-200 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-none mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Unauthorized Email</p>
                <p className="mt-0.5 text-amber-200/90">
                  {user.email} is not listed in active administrator accounts.
                </p>
              </div>
            </div>
          )}

          {/* Single Action Button: Continue with Google */}
          <div className="mt-8 w-full">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-cyan-400/40 bg-white hover:bg-slate-100 text-slate-900 px-6 py-3.5 text-sm font-semibold shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Super Telecom
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
