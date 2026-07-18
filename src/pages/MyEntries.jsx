import { useEffect, useState } from "react";
import { api } from "../api";
import { Download, Loader2, FileText } from "lucide-react";

export default function MyEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloading, setDownloading] = useState(false);

  const fetchEntries = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    api.get(`/entries?${params}`)
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const blob = await api.get(`/entries/download?${params}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "my-entries.xlsx"; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const fmt = (n) => new Intl.NumberFormat().format(n || 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Entries</h1>
        <button onClick={handleDownload} disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-dark disabled:opacity-60">
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <button onClick={fetchEntries}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-orange-700">
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <FileText className="w-12 h-12 mb-3" />
          <p className="text-sm">No entries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800">{entry.date}</span>
                <span className="text-sm font-bold text-primary">₹{fmt(entry.totalValue)}</span>
              </div>
              {entry.entryItems?.length > 0 && (
                <div className="space-y-1">
                  {entry.entryItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-500">
                      <span>{item.itemName} × {item.quantity} {item.unit}</span>
                      <span>₹{fmt(item.value)}</span>
                    </div>
                  ))}
                </div>
              )}
              {Object.keys(entry.customFields || {}).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-50 flex flex-wrap gap-2">
                  {Object.entries(entry.customFields).map(([k, v]) => (
                    <span key={k} className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-500">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
