import React, { useState } from "react";
import {
  Gift,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Wrench,
  Clock,
  Award,
  Tag,
  ChevronRight,
  BatteryCharging,
} from "lucide-react";
import { safeVibrate } from "@/utils/safeVibrate";
import { toast } from "sonner";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface CustomerRewardsHubProps {
  onOpenTrack?: () => void;
  className?: string;
}

export const CustomerRewardsHub: React.FC<CustomerRewardsHubProps> = ({
  onOpenTrack,
  className = "",
}) => {
  const { isVip, openVipModal } = useCustomerAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const VOUCHER_CODE = "ST-LAB-150";

  const handleCopyVoucher = async () => {
    safeVibrate([15, 20]);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(VOUCHER_CODE);
      }
      setCopiedCode(VOUCHER_CODE);
      toast.success(`Voucher code "${VOUCHER_CODE}" copied! Present at Super Telecom Barganda Road.`);
      setTimeout(() => setCopiedCode(null), 3000);
    } catch {
      toast.info(`Voucher code: ${VOUCHER_CODE} (Save for checkout)`);
    }
  };

  return (
    <div
      className={`p-4 rounded-3xl bg-white dark:bg-[#030712]/95 border border-amber-500/30 dark:border-amber-500/30 shadow-xl shadow-amber-950/10 backdrop-blur-2xl transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/30">
                Customer Vault
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Giridih Exclusive
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              Super Telecom Perks &amp; Rewards
            </h3>
          </div>
        </div>

        {!isVip && (
          <button
            type="button"
            onClick={() => {
              safeVibrate(15);
              openVipModal();
            }}
            className="px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
          >
            <Award className="h-3 w-3 text-amber-500" />
            <span>VIP Pass</span>
          </button>
        )}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
        Exclusive customer privileges redeemable at our Barganda Road physical repair laboratory.
      </p>

      {/* Perks Grid */}
      <div className="mt-3.5 space-y-2.5">
        {/* Perk 1: Monthly Free Port Micro-Cleaning */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Monthly Free Port Micro-Cleaning
                </h4>
                <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                  FREE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                Anti-static precision lint &amp; debris removal for Type-C or Lightning charging ports using ESD safe tools.
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <MapPin className="h-3 w-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Barganda Road, Giridih &bull; Walk-in anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Perk 2: ₹150 Repair Voucher */}
        <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-gradient-to-r dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200 dark:border-amber-500/40 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Tag className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  ₹150 Lab Repair Voucher
                </h4>
                <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/90 px-1.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
                Flat ₹150 off on display replacement, IC micro-soldering, or original battery swap.
              </p>

              {/* Coupon Bar */}
              <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Code:</span>
                  <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 tracking-wider">
                    {VOUCHER_CODE}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVoucher}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] font-mono flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  {copiedCode === VOUCHER_CODE ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Tap to Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Perk 3: Digital Warranty & Job Sheet Verification */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  90-Day Lab Warranty &amp; Receipt Lookup
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                All repairs carry up to 90 days warranty with instant digital job sheet tracking.
              </p>
              {onOpenTrack && (
                <button
                  type="button"
                  onClick={() => {
                    safeVibrate(15);
                    onOpenTrack();
                  }}
                  className="mt-2 text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Track Your Repair Job Status</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRewardsHub;
