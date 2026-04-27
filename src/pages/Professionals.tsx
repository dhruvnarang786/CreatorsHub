import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { getProfessionals } from "@/services/supabase-service";

/* eslint-disable @typescript-eslint/no-explicit-any */
const typeLabels: Record<string, string> = { videographer: "Find Videographers", editor: "Find Editors", photographer: "Find Photographers" };

const Professionals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "videographer";
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProfessionals(type).then(({ data }) => { setPros(data || []); setLoading(false); });
  }, [type]);

  return (
    <div className="min-h-screen bg-[#F8F8FC] relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[rgba(124,58,237,0.08)] px-6 md:px-12 h-[72px] flex items-center justify-between">
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
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>{typeLabels[type] || "Find Professionals"}</h1>
          <p className="text-[#6B7280] mt-2">Discover talented {type}s ready to bring your creative vision to life.</p>
          <div className="flex gap-3 mt-6">
            {["videographer", "editor", "photographer"].map((t) => (
              <button key={t} onClick={() => navigate(`/professionals?type=${t}`)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${type === t ? "bg-[#7C3AED] text-white shadow-[0_4px_15px_rgba(124,58,237,0.3)]" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#7C3AED] hover:text-[#7C3AED]"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}s
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" /></div>}

        {!loading && pros.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <span className="text-5xl block mb-4">🎬</span>
            <h3 className="text-xl font-bold text-[#0A0A1A] mb-2">No {type}s listed yet</h3>
            <p className="text-[#9CA3AF] mb-6">Be the first to join as a {type}!</p>
            <button onClick={() => navigate(`/professionals/register?type=${type}`)} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm">Register as {type.charAt(0).toUpperCase() + type.slice(1)}</button>
          </div>
        )}

        {!loading && pros.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pros.map((p) => (
              <div key={p.id} className="rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white font-bold text-xl">{(p.profiles?.full_name || "P").charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-[#0A0A1A]">{p.profiles?.full_name || "Professional"}</h3>
                    <p className="text-[#9CA3AF] text-sm flex items-center gap-1"><MapPin className="h-3 w-3" />{p.profiles?.location || "Remote"}</p>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-[rgba(124,58,237,0.08)] text-[#7C3AED] text-xs font-bold mb-3 capitalize">{p.type}</span>
                {p.speciality && <p className="text-[#6B7280] text-sm mb-3">{p.speciality}</p>}
                {p.experience_years && <p className="text-[#9CA3AF] text-xs mb-3">{p.experience_years} years experience</p>}
                {p.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.skills.slice(0, 4).map((s: string) => (<span key={s} className="px-2 py-1 rounded-full bg-[#F8F8FC] border border-[#E5E7EB] text-[#6B7280] text-[10px]">{s}</span>))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                  <span className="text-lg font-bold text-[#7C3AED]">₹{(p.price_per_hour || 0).toLocaleString()}<span className="text-xs text-[#9CA3AF] font-normal">/hr</span></span>
                  <button className="px-4 py-2 rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors">Contact</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Professionals;
