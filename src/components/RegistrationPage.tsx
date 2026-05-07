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
    <div className="min-h-screen silver-shimmer-bg relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="relative z-10 max-w-[700px] mx-auto px-6 py-10">
        {/* Back link */}
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-bold text-[#0A0A1A] hover:text-[#7C3AED] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        {!submitted ? (
          <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-8 md:p-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#999] mb-4">Registration</p>
            <h2 className="text-3xl md:text-[36px] font-bold text-[#000] mb-4" style={{ fontFamily: '"Newsreader", serif' }}>{config.heading}</h2>
            <p className="text-[#555] text-[16px] leading-[1.6] mb-8">{config.description}</p>

            <form onSubmit={handleSubmit}>
              {/* 2-column grid fields */}
              {config.fields.map((pair: string[], i: number) => (
                <div key={i} className="mt-4 grid gap-4 sm:grid-cols-2">
                  {pair.map((label: string) => (
                    <div key={label}>
                      <label className="mb-2 block text-[14px] font-bold text-[#000]">{label}</label>
                      <input
                        placeholder={`Enter ${label.toLowerCase()}`}
                        value={formData[label] || ""}
                        onChange={(e) => handleChange(label, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              ))}

              {/* Description — full width */}
              <div className="mt-6">
                <label className="mb-2 block text-[14px] font-bold text-[#000]">Description</label>
                <textarea
                  placeholder={config.textarea}
                  value={formData["Description"] || ""}
                  onChange={(e) => handleChange("Description", e.target.value)}
                  className={`${inputClass} min-h-[150px] resize-y`}
                />
              </div>

              {/* Portfolio & Upload — full width */}
              <div className="mt-4">
                <label className="mb-2 block text-[14px] font-bold text-[#000]">Portfolio / Website Link</label>
                <input
                  placeholder="Paste link"
                  value={formData["Portfolio Link"] || ""}
                  onChange={(e) => handleChange("Portfolio Link", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-[14px] font-bold text-[#000]">Upload Images / Work Samples</label>
                <input
                  placeholder="Add drive or folder link"
                  value={formData["Samples Link"] || ""}
                  onChange={(e) => handleChange("Samples Link", e.target.value)}
                  className={inputClass}
                />
              </div>

              {error && <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full py-4 rounded-[8px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-[15px] hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />Submitting...
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#000]">Registration Submitted</h3>
            <p className="mx-auto mt-3 max-w-sm text-[#6B7280]">Your details have been saved. We'll review and get back to you soon.</p>
            <button onClick={onBack} className="mt-6 px-8 py-3 rounded-full border-[1.5px] border-[#E5E7EB] text-[#0A0A1A] font-bold hover:border-[#7C3AED] transition-colors">
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
