import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createStudio, createProfessional, createEquipment } from "@/services/supabase-service";
import { registrationConfig } from "@/lib/data";

interface RegistrationPageProps {
  mode: string;
  onBack: () => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const RegistrationPage = ({ mode, onBack }: RegistrationPageProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const config = registrationConfig[mode];

  if (!config) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user) { navigate("/signin"); return; }

      if (mode === "list-studio") {
        const { error: dbError } = await createStudio({
          owner_id: user.id,
          name: formData["Studio Name"] || "",
          type: formData["Studio Type"] || "Studio",
          description: formData["Description"] || "",
          address: formData["Area / Address"] || "",
          area: formData["Area / Address"] || "",
          city: formData["City"] || "",
          price_per_hour: parseFloat(formData["Price Per Hour"]) || 0,
          features: (formData["Equipment Included"] || "").split(",").map((s) => s.trim()).filter(Boolean),
          available_days: (formData["Available Days"] || "").split(",").map((s) => s.trim()).filter(Boolean),
          space_details: formData["Capacity"] || "",
          agreed_to_terms: true,
          is_approved: false,
          is_active: true,
        });
        if (dbError) throw dbError;
      } else if (mode === "register-videographer") {
        const { error: dbError } = await createProfessional({
          profile_id: user.id, type: "videographer",
          speciality: formData["Specialization"] || "", experience_years: parseInt(formData["Years of Experience"]) || 0,
          price_per_hour: parseFloat(formData["Starting Price"]) || 0, portfolio_url: formData["Instagram / Portfolio Link"] || "",
          skills: [], is_available: true,
        });
        if (dbError) throw dbError;
      } else if (mode === "register-editor") {
        const { error: dbError } = await createProfessional({
          profile_id: user.id, type: "editor",
          speciality: formData["Editing Type"] || "", price_per_hour: parseFloat(formData["Starting Price"]) || 0,
          portfolio_url: formData["Instagram / Portfolio Link"] || "",
          skills: (formData["Software Used"] || "").split(",").map((s) => s.trim()).filter(Boolean), is_available: true,
        });
        if (dbError) throw dbError;
      } else if (mode === "list-equipment") {
        const { error: dbError } = await createEquipment({
          owner_id: user.id, name: formData["Equipment Name"] || "", category: "General",
          description: formData["Description"] || "", price_per_day: parseFloat(formData["Price Per Day"]) || 0, is_available: true,
        });
        if (dbError) throw dbError;
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] px-4 py-3 text-sm text-[#0A0A1A] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      {/* Background blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex">
        {/* Left side — gradient */}
        <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#06B6D4] p-12 flex-col justify-center">
          <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <p className="text-[11px] font-black uppercase tracking-[3px] text-white/70 mb-4">Registration</p>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Newsreader", serif' }}>{config.heading}</h2>
          <p className="text-white/75 leading-relaxed mb-10">{config.description}</p>
          <div className="space-y-4">
            {["Simple onboarding for service providers", "Add pricing, location, and portfolio details", "Start receiving bookings immediately"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/90">
                <CheckCircle className="h-5 w-5 flex-shrink-0" /><span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — form */}
        <div className="w-full lg:w-[60%] flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-xl">
            {/* Mobile back button */}
            <button onClick={onBack} className="lg:hidden mb-6 flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0A0A1A] transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-[#0A0A1A] mb-6 lg:hidden" style={{ fontFamily: '"Newsreader", serif' }}>{config.heading}</h2>
                {config.fields.map((pair: string[], i: number) => (
                  <div key={i} className="mt-4 grid gap-4 sm:grid-cols-2">
                    {pair.map((label: string) => (
                      <div key={label}>
                        <label className="mb-1.5 block text-sm font-semibold text-[#374151]">{label}</label>
                        <input placeholder={`Enter ${label.toLowerCase()}`} value={formData[label] || ""} onChange={(e) => handleChange(label, e.target.value)} className={inputClass} />
                      </div>
                    ))}
                  </div>
                ))}
                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-semibold text-[#374151]">Description</label>
                  <textarea placeholder={config.textarea} value={formData["Description"] || ""} onChange={(e) => handleChange("Description", e.target.value)} className={`${inputClass} min-h-[120px] resize-y`} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#374151]">Portfolio / Website Link</label>
                    <input placeholder="Paste link" value={formData["Portfolio Link"] || ""} onChange={(e) => handleChange("Portfolio Link", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#374151]">Upload Images / Work Samples</label>
                    <input placeholder="Add drive or folder link" value={formData["Samples Link"] || ""} onChange={(e) => handleChange("Samples Link", e.target.value)} className={inputClass} />
                  </div>
                </div>
                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading}
                  className="mt-6 w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50">
                  {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Submitting...</span> : "Submit Registration"}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A0A1A]">Registration Submitted</h3>
                <p className="mx-auto mt-3 max-w-sm text-[#6B7280]">Your details have been saved. We'll review and get back to you soon.</p>
                <button onClick={onBack} className="mt-6 px-8 py-3 rounded-full border-[1.5px] border-[#E5E7EB] text-[#0A0A1A] font-bold hover:border-[#7C3AED] transition-colors">Return Home</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
