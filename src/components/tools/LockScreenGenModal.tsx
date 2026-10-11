import React, { useState, useEffect, useRef } from "react";
import { Download, Shield, HeartPulse, Phone, User, X, Sparkles, RefreshCw } from "lucide-react";

interface LockScreenGenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LockScreenGenModal: React.FC<LockScreenGenModalProps> = ({ isOpen, onClose }) => {
  const [ownerName, setOwnerName] = useState("Aman Kumar");
  const [contact1Name, setContact1Name] = useState("Father (Suresh)");
  const [contact1Phone, setContact1Phone] = useState("+91 98765 43210");
  const [contact2Name, setContact2Name] = useState("Emergency Alternate");
  const [contact2Phone, setContact2Phone] = useState("+91 91234 56789");
  const [bloodGroup, setBloodGroup] = useState("O+ Positive");
  const [medicalNote, setMedicalNote] = useState("No Allergies • Organ Donor");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawWallpaper = () => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1080;
    const height = 2400;
    canvas.width = width;
    canvas.height = height;

    // 1. Deep AMOLED Pure Black Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Subtle dark ambient gradient in bottom third
    const grad = ctx.createRadialGradient(width / 2, height / 2 + 300, 100, width / 2, height / 2 + 300, 700);
    grad.addColorStop(0, "rgba(6, 182, 212, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Neon Cyber Frame Border
    ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 100, width - 100, height - 200);

    // Corner accents
    const accentLen = 80;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 8;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(50, 100 + accentLen);
    ctx.lineTo(50, 100);
    ctx.lineTo(50 + accentLen, 100);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - 50 - accentLen, 100);
    ctx.lineTo(width - 50, 100);
    ctx.lineTo(width - 50, 100 + accentLen);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(50, height - 100 - accentLen);
    ctx.lineTo(50, height - 100);
    ctx.lineTo(50 + accentLen, height - 100);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - 50 - accentLen, height - 100);
    ctx.lineTo(width - 50, height - 100);
    ctx.lineTo(width - 50, height - 100 - accentLen);
    ctx.stroke();

    // 3. Header Section (Centered for Lockscreen Clear View below clock)
    // Emergency Cross Icon
    const iconY = 820;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(width / 2, iconY, 70, 0, Math.PI * 2);
    ctx.fill();

    // White Cross inside Red Circle
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(width / 2 - 14, iconY - 45, 28, 90);
    ctx.fillRect(width / 2 - 45, iconY - 14, 90, 28);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("IN CASE OF EMERGENCY", width / 2, iconY + 140);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "34px sans-serif";
    ctx.fillText("If this phone is found or in medical distress, please contact:", width / 2, iconY + 200);

    // 4. Emergency Card Box
    const cardY = iconY + 260;
    const cardW = width - 180;
    const cardH = 750;
    const cardX = 90;

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "rgba(51, 65, 85, 0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 40);
    ctx.fill();
    ctx.stroke();

    // Field 1: Device Owner
    let lineY = cardY + 90;
    ctx.textAlign = "left";
    ctx.fillStyle = "#06b6d4";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("DEVICE OWNER", cardX + 60, lineY);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 46px sans-serif";
    ctx.fillText(ownerName || "Phone Owner", cardX + 60, lineY + 55);

    // Separator line
    lineY += 105;
    ctx.strokeStyle = "rgba(51, 65, 85, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 60, lineY);
    ctx.lineTo(cardX + cardW - 60, lineY);
    ctx.stroke();

    // Field 2: Emergency Contact 1
    lineY += 55;
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(`PRIMARY CONTACT (${contact1Name || "Relative"})`, cardX + 60, lineY);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 52px monospace";
    ctx.fillText(contact1Phone || "Contact Phone", cardX + 60, lineY + 60);

    // Field 3: Emergency Contact 2
    lineY += 135;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(`SECONDARY CONTACT (${contact2Name || "Relative"})`, cardX + 60, lineY);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 52px monospace";
    ctx.fillText(contact2Phone || "Contact Phone", cardX + 60, lineY + 60);

    // Separator line
    lineY += 105;
    ctx.beginPath();
    ctx.moveTo(cardX + 60, lineY);
    ctx.lineTo(cardX + cardW - 60, lineY);
    ctx.stroke();

    // Field 4: Blood Group & Medical Note
    lineY += 60;
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(`BLOOD GROUP: ${bloodGroup || "Not Specified"}`, cardX + 60, lineY);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "30px sans-serif";
    ctx.fillText(`Medical Info: ${medicalNote || "No active notes"}`, cardX + 60, lineY + 55);

    // 5. Watermark / Safe Return Prompt at Bottom
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("SUPER TELECOM SAFE PHONE PROTOCOL", width / 2, height - 260);

    ctx.fillStyle = "#06b6d4";
    ctx.font = "28px sans-serif";
    ctx.fillText("Return to nearest Super Telecom Lab, Barganda Road, Giridih", width / 2, height - 200);
  };

  useEffect(() => {
    drawWallpaper();
  }, [ownerName, contact1Name, contact1Phone, contact2Name, contact2Phone, bloodGroup, medicalNote]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Emergency_LockScreen_${ownerName.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Emergency Lockscreen Wallpaper Generator</h3>
              <p className="text-xs text-slate-400">AMOLED Black Medical &amp; Lost-Phone Recovery Card</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Two-Column Editor Layout: Inputs on Left, Canvas Preview on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Form Inputs */}
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 font-mono block mb-1">Contact 1 Tag</label>
                <input
                  type="text"
                  value={contact1Name}
                  onChange={(e) => setContact1Name(e.target.value)}
                  placeholder="Father / Spouse"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-mono block mb-1">Contact 1 Phone</label>
                <input
                  type="tel"
                  value={contact1Phone}
                  onChange={(e) => setContact1Phone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 font-mono block mb-1">Contact 2 Tag</label>
                <input
                  type="text"
                  value={contact2Name}
                  onChange={(e) => setContact2Name(e.target.value)}
                  placeholder="Brother / Friend"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-mono block mb-1">Contact 2 Phone</label>
                <input
                  type="tel"
                  value={contact2Phone}
                  onChange={(e) => setContact2Phone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 font-mono block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  {["A+ Positive", "A- Negative", "B+ Positive", "B- Negative", "O+ Positive", "O- Negative", "AB+ Positive", "AB- Negative"].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">Medical Allergies/Notes</label>
                <input
                  type="text"
                  value={medicalNote}
                  onChange={(e) => setMedicalNote(e.target.value)}
                  placeholder="e.g. Diabetic, Asthma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download Wallpaper (HD PNG)</span>
              </button>
            </div>
          </div>

          {/* Live Phone Aspect Ratio Preview */}
          <div className="flex flex-col items-center justify-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 mb-2">Live 9:20 AMOLED Preview:</span>
            <div className="w-[180px] h-[400px] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-black relative">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-2">
              Set as lockscreen wallpaper via phone Gallery.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreenGenModal;
