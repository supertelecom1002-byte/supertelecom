import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  fetchAllRepairJobs,
  createRepairJob,
  updateRepairJobStage,
  type RepairJob,
  type RepairStage,
  STAGE_METADATA,
  buildWhatsAppStatusUrl,
} from "@/services/repairJobsService";

const STAGES: RepairStage[] = [
  "received",
  "diagnosing",
  "qc_testing",
  "ready",
  "delivered",
];

export const RepairJobsManager: React.FC = () => {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // New Job Form State
  const [newId, setNewId] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newCost, setNewCost] = useState("1499");
  const [newNotes, setNewNotes] = useState("");

  const loadJobs = async () => {
    setLoading(true);
    const data = await fetchAllRepairJobs();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleAdvanceStage = async (job: RepairJob) => {
    const currentIndex = STAGES.indexOf(job.current_stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      await updateRepairJobStage(job.id, nextStage);
      await loadJobs();
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newPhone || !newModel || !newIssue) return;

    const id = newId.trim() || `ST-${Math.floor(1000 + Math.random() * 9000)}`;
    await createRepairJob({
      id: id.toUpperCase(),
      customer_name: newCustomer,
      customer_phone: newPhone.replace(/\D/g, ""),
      device_model: newModel,
      issue_description: newIssue,
      estimated_cost: Number(newCost) || 0,
      current_stage: "received",
      notes: newNotes,
    });

    // Reset form
    setNewId("");
    setNewCustomer("");
    setNewPhone("");
    setNewModel("");
    setNewIssue("");
    setNewCost("1499");
    setNewNotes("");
    setShowAddForm(false);
    await loadJobs();
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesStage = filterStage === "all" || j.current_stage === filterStage;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      j.id.toLowerCase().includes(q) ||
      j.customer_name.toLowerCase().includes(q) ||
      j.customer_phone.includes(q) ||
      j.device_model.toLowerCase().includes(q);
    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Clock className="h-4 w-4" /> Live Optical Lab Pipeline
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Job Sheet &amp; Repair Pipeline Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track customer devices from intake inspection to delivery. Send 1-click WhatsApp stage updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all flex-none"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? "Cancel New Job" : "Create New Job Sheet"}</span>
        </button>
      </div>

      {/* Add New Job Form Modal / Expansion */}
      {showAddForm && (
        <form
          onSubmit={handleCreateJob}
          className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 animate-in fade-in"
        >
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Plus className="h-4 w-4 text-cyan-400" />
            Intake New Repair Device (Job Sheet)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">Job Sheet ID (Optional)</label>
              <input
                type="text"
                placeholder="Auto e.g. ST-1090"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Mahto"
                value={newCustomer}
                onChange={(e) => setNewCustomer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">10-Digit Mobile Number *</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="e.g. 9876543210"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">Device Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 14 Pro (Deep Purple)"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Issue / Fault Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Broken OLED & Touch Line"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Quoted Price (₹) *</label>
              <input
                type="number"
                required
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-mono block mb-1 text-xs">Technician Internal Diagnosis Notes</label>
            <input
              type="text"
              placeholder="e.g. TrueTone saved, frame dent straightened on left corner"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Register &amp; Save Job Sheet
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Job ID, Customer, Phone, or Model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {["all", ...STAGES].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStage(st)}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                filterStage === st
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st === "all" ? "All Jobs" : STAGE_METADATA[st as RepairStage]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table / Card List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-cyan-400">
            Loading repair pipeline from database...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
            No repair jobs found matching criteria.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const meta = STAGE_METADATA[job.current_stage];
            const currentIndex = STAGES.indexOf(job.current_stage);
            const canAdvance = currentIndex < STAGES.length - 1;
            const nextStage = canAdvance ? STAGES[currentIndex + 1] : null;

            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-black text-cyan-400">
                      {job.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                        job.current_stage === "delivered" || job.current_stage === "ready"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                          : job.current_stage === "diagnosing"
                          ? "bg-amber-950/80 text-amber-400 border-amber-500/40"
                          : "bg-cyan-950/80 text-cyan-400 border-cyan-500/40"
                      }`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Quoted Cost:</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      ₹{job.estimated_cost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Customer</span>
                    <span className="font-bold text-white">{job.customer_name}</span>
                    <span className="text-slate-400 font-mono block">{job.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Device</span>
                    <span className="font-bold text-white">{job.device_model}</span>
                    <span className="text-slate-400 block truncate">{job.issue_description}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Notes</span>
                    <span className="text-slate-300 block truncate">
                      {job.notes || "Standard diagnosis in progress"}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {canAdvance && nextStage && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStage(job)}
                        className="py-2 px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <span>Advance to: {STAGE_METADATA[nextStage].label}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {job.current_stage === "delivered" && (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Warranty Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={buildWhatsAppStatusUrl(job)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Send WhatsApp Status</span>
                    </a>

                    <a
                      href={`tel:${job.customer_phone}`}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                      title="Call Customer"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RepairJobsManager;
