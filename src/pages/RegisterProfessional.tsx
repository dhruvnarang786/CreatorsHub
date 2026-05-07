import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createProfessional } from "@/services/supabase-service";

const RegisterProfessional = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "videographer";
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: defaultType, speciality: "", experience_years: "", price_per_hour: "", skills: "", portfolio_url: "", bio: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/signin"); return; }
    setLoading(true); setError("");
    try {
      const { error: dbErr } = await createProfessional({
        profile_id: user.id, type: form.type, speciality: form.speciality,
        experience_years: parseInt(form.experience_years) || 0, price_per_hour: parseFloat(form.price_per_hour) || 0,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean), portfolio_url: form.portfolio_url || null, is_available: true,
      });
      if (dbErr) throw dbErr;
      setSuccess(true);
    } catch (err: any) { setError(err?.message || "Something went wrong."); } finally { setLoading(false); }
  };

  const inputClass = "w-full rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] px-4 py-3 text-sm text-[#0A0A1A] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all";

  return (
    <div className="min-h-screen silver-shimmer-bg relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex">
        {/* Left gradient panel */}
        <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#06B6D4] p-12 flex-col justify-center">
          <button onClick={() => navigate("/")} className="mb-8 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <p className="text-[11px] font-black uppercase tracking-[3px] text-white/70 mb-4">Registration</p>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Newsreader", serif' }}>Join as a Creative Pro</h2>
          <p className="text-white/75 leading-relaxed mb-10">Create your profile as a {defaultType} and get discovered by creators looking for talent.</p>
          <div className="space-y-4">
            {["Get discovered by thousands of creators", "Set your own rates and availability", "Build your portfolio and reputation"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/90"><CheckCircle className="h-5 w-5 flex-shrink-0" /><span className="text-sm">{t}</span></div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full lg:w-[60%] flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-xl">
            <button onClick={() => navigate("/")} className="lg:hidden mb-6 flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0A0A1A]"><ArrowLeft className="h-4 w-4" /> Back</button>

            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle className="h-8 w-8 text-green-500" /></div>
                <h3 className="text-2xl font-bold text-[#0A0A1A]">Profile Submitted!</h3>
                <p className="text-[#6B7280]">We'll review your profile within 24 hours.</p>
                <button onClick={() => navigate("/dashboard/creator")} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all">Go to Dashboard</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-[#0A0A1A] lg:hidden mb-2" style={{ fontFamily: '"Newsreader", serif' }}>Join as a Creative Pro</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Full Name</label><input value={profile?.full_name || ""} disabled className={`${inputClass} bg-[#F8F8FC] text-[#9CA3AF]`} /></div>
                  <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Professional Type</label>
                    <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                      <option value="videographer">Videographer</option><option value="editor">Editor</option><option value="photographer">Photographer</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Speciality</label><input value={form.speciality} onChange={(e) => set("speciality", e.target.value)} placeholder="e.g. Cinematic Reels, Wedding Films" className={inputClass} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Years of Experience</label><input type="number" value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} placeholder="e.g. 3" className={inputClass} /></div>
                  <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Price Per Hour (₹)</label><input type="number" value={form.price_per_hour} onChange={(e) => set("price_per_hour", e.target.value)} placeholder="e.g. 2000" className={inputClass} /></div>
                </div>
                <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Skills (comma-separated)</label><input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Video Editing, Color Grading, Motion Graphics" className={inputClass} /></div>
                <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Portfolio / Website URL</label><input value={form.portfolio_url} onChange={(e) => set("portfolio_url", e.target.value)} placeholder="https://..." className={inputClass} /></div>
                <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Short Bio</label><textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell creators about your style..." className={`${inputClass} min-h-[100px] resize-y`} /></div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50">
                  {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Submitting...</span> : "Submit Profile"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProfessional;
