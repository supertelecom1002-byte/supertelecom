import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Sparkles,
  Calculator,
  ShieldCheck,
  Clock,
} from "lucide-react";
import {
  fetchServicePricing,
  upsertServicePricingItem,
  deleteServicePricingItem,
  type ServicePricingItem,
} from "@/services/pricingService";

export const PricingMatrixManager: React.FC = () => {
  const [items, setItems] = useState<ServicePricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New item state
  const [newBrand, setNewBrand] = useState("Apple");
  const [newModel, setNewModel] = useState("");
  const [newRepairType, setNewRepairType] = useState("");
  const [newPriceMin, setNewPriceMin] = useState("1499");
  const [newPriceMax, setNewPriceMax] = useState("3999");
  const [newTurnaround, setNewTurnaround] = useState("45 Mins");
  const [newWarranty, setNewWarranty] = useState("90");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchServicePricing();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveEdit = async (item: ServicePricingItem) => {
    await upsertServicePricingItem(item);
    setEditingId(null);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this pricing tier?")) {
      await deleteServicePricingItem(id);
      await loadData();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel || !newRepairType) return;

    const newItem: ServicePricingItem = {
      id: `sp-${Date.now()}`,
      brand: newBrand,
      model: newModel,
      repair_type: newRepairType,
      price_min: Number(newPriceMin) || 0,
      price_max: Number(newPriceMax) || 0,
      turnaround_time: newTurnaround || "45 Mins",
      warranty_days: Number(newWarranty) || 90,
    };

    await upsertServicePricingItem(newItem);
    setNewModel("");
    setNewRepairType("");
    setShowAddForm(false);
    await loadData();
  };

  const brands = ["All", ...Array.from(new Set(items.map((i) => i.brand)))];

  const filtered = items.filter((item) => {
    const matchesBrand = selectedBrand === "All" || item.brand === selectedBrand;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      item.model.toLowerCase().includes(q) ||
      item.repair_type.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q);
    return matchesBrand && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Calculator className="h-4 w-4" /> Live Public Pricing Matrix
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Smartphone Repair Rates &amp; Tier Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update transparent price ranges, turnaround times and warranties displayed to customers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all flex-none"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? "Cancel" : "Add New Price Tier"}</span>
        </button>
      </div>

      {/* Add New Price Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 animate-in fade-in text-xs"
        >
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
            Create Pricing Matrix Entry
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-mono block mb-1">Manufacturer / Brand</label>
              <select
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                {["Apple", "Samsung", "OnePlus", "Xiaomi", "Vivo", "Realme", "Universal / All Brands"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Device Model Series *</label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 15 / 15 Plus"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Repair Service Type *</label>
              <input
                type="text"
                required
                placeholder="e.g. Full Combo OLED Display"
                value={newRepairType}
                onChange={(e) => setNewRepairType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-400 font-mono block mb-1">Min Price (₹)</label>
              <input
                type="number"
                required
                value={newPriceMin}
                onChange={(e) => setNewPriceMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Max Price (₹)</label>
              <input
                type="number"
                required
                value={newPriceMax}
                onChange={(e) => setNewPriceMax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Turnaround Time</label>
              <input
                type="text"
                value={newTurnaround}
                onChange={(e) => setNewTurnaround(e.target.value)}
                placeholder="e.g. 45 Mins"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-mono block mb-1">Warranty (Days)</label>
              <input
                type="number"
                value={newWarranty}
                onChange={(e) => setNewWarranty(e.target.value)}
                placeholder="e.g. 90"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
            >
              Save Price Row
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search models or repair types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedBrand === b
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400 uppercase">
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Model Range</th>
                <th className="py-3 px-4">Repair Service</th>
                <th className="py-3 px-4">Price Range (₹)</th>
                <th className="py-3 px-4">Turnaround</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-cyan-400">{item.brand}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{item.model}</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.repair_type}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      ₹{item.price_min.toLocaleString()} – ₹{item.price_max.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-300">{item.turnaround_time}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{item.warranty_days} Days</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingMatrixManager;
