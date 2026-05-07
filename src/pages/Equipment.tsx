import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getEquipment } from "@/services/supabase-service";

/* eslint-disable @typescript-eslint/no-explicit-any */
const Equipment = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEquipment().then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen silver-shimmer-bg relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <nav className="sticky top-0 z-50 bg-[rgba(226,226,228,0.92)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] px-6 md:px-12 h-[72px] flex items-center justify-between">
        <a href="/" className="font-newsreader italic text-2xl font-bold text-[#0A0A1A]">CreatorsBNB</a>
        <div className="flex gap-4">
          <button onClick={() => navigate("/signin")} className="text-sm font-bold text-[#0A0A1A] hover:text-[#7C3AED] transition-colors">Sign In</button>
          <button onClick={() => navigate("/signup")} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-sm font-bold">Sign Up</button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/")} className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#0A0A1A] transition-colors"><ArrowLeft className="h-4 w-4" /> Back to Home</button>

        <div className="mb-10">
          <p className="text-[11px] font-black uppercase tracking-[2px] text-[#7C3AED] mb-2">Marketplace</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Rent <span className="italic">Equipment</span></h1>
          <p className="text-[#6B7280] mt-2">Cameras, lighting, audio gear — rent what you need for your next shoot.</p>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" /></div>}

        {!loading && items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <span className="text-5xl block mb-4">📷</span>
            <h3 className="text-xl font-bold text-[#0A0A1A] mb-2">No equipment listed yet</h3>
            <p className="text-[#9CA3AF] mb-6">Be the first to list your gear for rent!</p>
            <button onClick={() => navigate("/register/list-equipment")} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm">List Equipment</button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((eq) => (
              <div key={eq.id} className="rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] transition-all">
                <div className="h-48 relative overflow-hidden">
                  {eq.photos?.[0] ? (
                    <img src={eq.photos[0]} alt={eq.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#06B6D4]/10 to-[#7C3AED]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-[#7C3AED]/20">photo_camera</span>
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[rgba(124,58,237,0.08)] text-[#7C3AED] text-[10px] font-bold backdrop-blur-sm">{eq.category || "Gear"}</span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>{eq.name}</h3>
                  {eq.description && <p className="text-[#9CA3AF] text-sm line-clamp-2">{eq.description}</p>}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                    <span className="text-xl font-bold text-[#7C3AED]">₹{(eq.price_per_day || 0).toLocaleString()}<span className="text-xs text-[#9CA3AF] font-normal">/day</span></span>
                    <button className="px-4 py-2 rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors">Enquire</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipment;
