import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, Crown, Zap, Shield, Star, BadgeCheck } from "lucide-react";
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
  
  const [listingTier, setListingTier] = useState<"free" | "premium">("free");
  const [paymentPending, setPaymentPending] = useState(false);

  const getPremiumPrice = () => {
    if (form.type === "editor") return 2000;
    if (form.type === "videographer") return 5000;
    if (form.type === "photographer") return 5000;
    return 2000;
  };

  const [form, setForm] = useState({
    type: defaultType, 
    fullName: profile?.full_name || "",
    email: user?.email || "",
    contactNumber: "",
    govId: "",
    speciality: "", 
    experience_years: "", 
    basicPrice: "", 
    advancedPrice: "", 
    skills: "", 
    portfolio_url: "", 
    samples_url: "",
    bio: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/signin"); return; }
    
    setLoading(true); 
    setError("");
    
    try {
      const { error: dbErr } = await createProfessional({
        profile_id: user.id, 
        type: form.type, 
        speciality: form.speciality,
        experience_years: parseInt(form.experience_years) || 0, 
        price_per_hour: parseFloat(form.basicPrice) || 0,
        price_advanced: parseFloat(form.advancedPrice) || 0,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean), 
        portfolio_url: form.portfolio_url || null, 
        is_available: true,
        listing_tier: listingTier,
      });
      if (dbErr) throw dbErr;

      // If premium, mark payment as pending (placeholder for actual payment gateway)
      if (listingTier === "premium") {
        setPaymentPending(true);
      }
      setSuccess(true);
    } catch (err: any) { 
      setError(err?.message || "Something went wrong."); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] px-4 py-3 text-sm text-[#0A0A1A] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all";

  const getHeading = () => {
    if (form.type === "videographer") return "Join as Videographer";
    if (form.type === "photographer") return "Join as Photographer";
    if (form.type === "editor") return "Join as Editor";
    return "Join as a Creative Pro";
  };

  const getTypeLabel = () => {
    if (form.type === "videographer") return "Videographer";
    if (form.type === "photographer") return "Photographer";
    if (form.type === "editor") return "Editor";
    return "Professional";
  };

  const getBasicPriceLabel = () => {
    if (form.type === "videographer") return "Standard Video Price (₹)";
    if (form.type === "photographer") return "Standard Shoot Price (₹)";
    if (form.type === "editor") return "Standard Edit Price per Video (₹)";
    return "Standard Price (₹)";
  };

  const getAdvancedPriceLabel = () => {
    if (form.type === "videographer") return "Premium Video Price (₹)";
    if (form.type === "photographer") return "Premium Shoot Price (₹)";
    if (form.type === "editor") return "Premium Edit Price per Video (₹)";
    return "Premium Price (₹)";
  };

  const getBioLabel = () => {
    if (form.type === "videographer") return "Tell us about your specialties (e.g. reels, events, etc.)";
    if (form.type === "photographer") return "Tell us about your specialties (e.g. fashion, food, etc.)";
    if (form.type === "editor") return "Tell us about your editing style and software";
    return "Short Bio";
  };

  const getUploadNote = () => {
    if (form.type === "videographer") return "(High quality HD videos are necessary)";
    if (form.type === "photographer") return "(High quality HD images are necessary)";
    if (form.type === "editor") return "(Show your HD quality edits here)";
    return "";
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen silver-shimmer-bg relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="relative z-10 max-w-[700px] mx-auto px-6 py-10">
        
        {/* Back link */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-bold text-[#0A0A1A] hover:text-[#7C3AED] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>

        {!success ? (
          <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-8 md:p-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#999] mb-4">Registration</p>
            <h2 className="text-3xl md:text-[36px] font-bold text-[#000] mb-4" style={{ fontFamily: '"Newsreader", serif' }}>{getHeading()}</h2>
            <p className="text-[#555] text-[16px] leading-[1.6] mb-8">
              Create your profile to get discovered by creators looking for top-tier {form.type} talent.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ═══ FREE vs PREMIUM TIER SELECTION ═══ */}
              <div className="mb-2">
                <label className="text-sm font-semibold text-[#374151] mb-3 block">Choose Your Listing Plan</label>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Free Tier Card */}
                  <div
                    onClick={() => setListingTier("free")}
                    className={`relative cursor-pointer rounded-[16px] p-5 border-[2px] transition-all duration-300 ${
                      listingTier === "free"
                        ? "border-[#7C3AED] bg-[#FAF5FF] shadow-[0_0_0_3px_rgba(124,58,237,0.10)]"
                        : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                    }`}
                  >
                    {listingTier === "free" && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-[10px] bg-gray-100 flex items-center justify-center">
                        <Zap className="w-4.5 h-4.5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-[#0A0A1A]">Free</h4>
                        <p className="text-[20px] font-black text-[#0A0A1A] leading-none">₹0</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mt-3">
                      {["Basic profile listing", "Visible on marketplace", "Standard support"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[12px] font-semibold text-[#6B7280]">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Premium Tier Card */}
                  <div
                    onClick={() => setListingTier("premium")}
                    className={`relative cursor-pointer rounded-[16px] p-5 border-[2px] transition-all duration-300 ${
                      listingTier === "premium"
                        ? "border-[#7C3AED] bg-gradient-to-br from-[#FAF5FF] to-[#EDE9FE] shadow-[0_0_0_3px_rgba(124,58,237,0.10)]"
                        : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                    }`}
                  >
                    {listingTier === "premium" && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-full">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Recommended</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-[10px] bg-[#EBE4FF] flex items-center justify-center">
                        <Crown className="w-4.5 h-4.5 text-[#7C3AED]" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-[#0A0A1A]">Premium</h4>
                        <p className="text-[20px] font-black text-[#7C3AED] leading-none">₹{getPremiumPrice().toLocaleString()}<span className="text-[11px] font-bold text-[#9CA3AF] ml-1">/year</span></p>
                      </div>
                    </div>
                    <ul className="space-y-2 mt-3">
                      {[
                        "Priority listing & visibility",
                        "Verified badge on profile",
                        "Featured in trending section",
                        "Money-back guarantee if no ROI in 1 year",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[12px] font-semibold text-[#6B7280]">
                          <Star className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Full Name</label>
                  <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Enter full name" className={inputClass} required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Email ID</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Enter email" className={inputClass} required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Contact Number</label>
                  <input value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} placeholder="Enter phone number" className={inputClass} required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Government ID (Aadhar/PAN)</label>
                  <input value={form.govId} onChange={(e) => set("govId", e.target.value)} placeholder="Enter ID number" className={inputClass} required />
                </div>
              </div>
              
              {/* Professional Type — dropdown for videographer/photographer, badge for editor */}
              <div>
                <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Professional Type</label>
                {form.type === "editor" ? (
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-[#EBE4FF] border-[1.5px] border-[#7C3AED]/20">
                    <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
                    <span className="text-sm font-bold text-[#7C3AED]">Editor</span>
                  </div>
                ) : (
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                    <option value="videographer">Videographer</option>
                    <option value="photographer">Photographer</option>
                  </select>
                )}
              </div>

              {/* Pricing Tier */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">{getBasicPriceLabel()}</label>
                  <input type="number" value={form.basicPrice} onChange={(e) => set("basicPrice", e.target.value)} placeholder="e.g. 3000" className={inputClass} required />
                  <p className="text-[11px] text-[#9CA3AF] mt-1 font-medium">Standard editing with cuts, transitions & color grading</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">{getAdvancedPriceLabel()}</label>
                  <input type="number" value={form.advancedPrice} onChange={(e) => set("advancedPrice", e.target.value)} placeholder="e.g. 8000" className={inputClass} required />
                  <p className="text-[11px] text-[#9CA3AF] mt-1 font-medium">Premium editing with VFX, motion graphics & sound design</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Years of Experience</label>
                  <input type="number" value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} placeholder="e.g. 3" className={inputClass} required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Top Skills</label>
                  <input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="e.g. Premiere Pro, Lighting" className={inputClass} />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#374151] mb-1.5 block">{getBioLabel()}</label>
                <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell creators about your unique style..." className={`${inputClass} min-h-[100px] resize-y`} required />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#374151] mb-1.5 block">Portfolio / Website Link</label>
                <input value={form.portfolio_url} onChange={(e) => set("portfolio_url", e.target.value)} placeholder="https://instagram.com/yourwork" className={inputClass} />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#374151] mb-1.5 block">
                  Upload Work Samples 
                  <span className="ml-2 text-[12px] font-medium text-[#7C3AED] italic">{getUploadNote()}</span>
                </label>
                <input value={form.samples_url} onChange={(e) => set("samples_url", e.target.value)} placeholder="Add drive or folder link" className={inputClass} required />
              </div>

              {/* Declaration */}
              <div className="mt-6 flex items-start gap-3 bg-violet-50/50 p-4 rounded-[12px] border border-violet-100">
                <input 
                  type="checkbox" 
                  id="declaration" 
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" 
                  required 
                />
                <label htmlFor="declaration" className="text-[13px] text-[#333] leading-relaxed font-medium">
                  <strong>Declaration:</strong> I agree to CreatorsHub Terms and conditions. I understand that all bookings must be made via the platform only.
                </label>
              </div>

              {error && <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>}
              
              <button 
                type="submit" 
                disabled={loading}
                className="mt-8 w-full py-4 rounded-[8px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-[15px] hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Submitting...</>
                ) : listingTier === "premium" ? (
                  <><Crown className="h-4 w-4" />Pay ₹{getPremiumPrice().toLocaleString()} & Submit Profile</>
                ) : (
                  "Submit Profile — Free Listing"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#000]">Profile Submitted!</h3>
            {paymentPending ? (
              <>
                <div className="mx-auto mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">Premium — Payment Pending Approval</span>
                </div>
                <p className="mx-auto mt-3 max-w-sm text-[#6B7280]">Your premium listing request has been sent to our team. Once we verify your payment, your profile will go live with all premium benefits.</p>
              </>
            ) : (
              <p className="mx-auto mt-3 max-w-sm text-[#6B7280]">We'll review your profile and get back to you within 24 hours.</p>
            )}
            <button 
              onClick={() => navigate("/dashboard/creator")} 
              className="mt-6 px-8 py-3 rounded-full border-[1.5px] border-[#E5E7EB] text-[#0A0A1A] font-bold hover:border-[#7C3AED] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterProfessional;
