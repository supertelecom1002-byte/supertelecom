import React, { useState } from "react";
import {
  X,
  Award,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Wrench,
  Clock,
  Sparkles,
  LogOut,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export const VipPerksModal: React.FC = () => {
  const {
    user,
    isVip,
    loading,
    isVipModalOpen,
    closeVipModal,
    signInWithGoogle,
    signOut,
  } = useCustomerAuth();

  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);

  if (!isVipModalOpen) return null;

  const displayName =
    (user as any)?.name ||
    (user as any)?.user_metadata?.full_name ||
    (user as any)?.email?.split("@")[0] ||
    "VIP Member";

  const displayEmail = (user as any)?.email || "Google Verified";
  const avatarUrl =
    (user as any)?.avatarUrl ||
    (user as any)?.user_metadata?.avatar_url ||
    null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Super Telecom VIP Priority Member Portal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
      onClick={closeVipModal}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#030712] border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-slate-900 dark:text-white max-h-[92dvh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40">
                {isVip ? "Active VIP Pass" : "VIP Member Access"}
              </span>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight mt-0.5">
                {isVip ? "VIP Lab Account" : "1-Click VIP Google Pass"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={closeVipModal}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STATE A: SIGNED IN AS VIP */}
        {isVip && user ? (
          <div className="py-4 space-y-4 animate-in fade-in">
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-50 dark:via-slate-950 to-amber-500/5 border border-amber-500/40 flex items-center gap-3.5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-slate-900 dark:text-white truncate">
                    {displayName}
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                  {displayEmail}
                </p>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 mt-1 inline-block">
                  ⭐ VIP #ST-GOLD PASS HOLDER
                </span>
              </div>
            </div>

            {/* VIP Perks Active Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Active Member Privileges:
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    Zero-Wait Queue
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    90-Day Lab Warranty
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-cyan-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    16+ Tools Cloud Pass
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    Cloud Job Sheet Log
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp VIP line */}
            <a
              href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20am%20a%20VIP%20Pass%20Member%20and%20need%20priority%20repair%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Priority WhatsApp VIP Line</span>
            </a>

            {/* Sign Out Action */}
            <button
              type="button"
              onClick={signOut}
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of VIP Account</span>
            </button>
          </div>
        ) : (
          /* STATE B: GUEST / SIGN-IN REQUIRED */
          <div className="py-4 space-y-4 animate-in fade-in">
            {/* VIP Pitch Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-50 dark:via-slate-950 to-cyan-500/10 border border-amber-500/30 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold block">
                Exclusive Lab Privilege
              </span>
              <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Connect Google for Instant VIP Status
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                No passwords to remember. 1-click Google OAuth binds your job sheets, warranties, and bypasses lab waiting queues.
              </p>
            </div>

            {/* Perks Matrix */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Zero-Wait Queue:</strong> Priority bench at Barganda Road Lab
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>90-Day Digital Warranty:</strong> Linked directly to your Google ID
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Diagnostic Cloud Sync:</strong> Save battery &amp; screen health logs
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Direct Engineer Line:</strong> Instant WhatsApp quote channel
                </span>
              </div>
            </div>

            {/* 1-Click Google OAuth Button */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.97] transition-all text-slate-900 border-2 border-slate-200 dark:border-slate-300 shadow-md font-bold text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>{loading ? "Authenticating..." : "1-Click Sign In with Google"}</span>
            </button>

            {/* Privacy note */}
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              Zero spam. Used exclusively for job sheet lookups &amp; warranty verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VipPerksModal;
