import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, Crown, Zap, Shield, Star, UploadCloud, X as XIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createStudio, createProfessional, createEquipment, uploadStudioPhotos } from "@/services/supabase-service";
import { sendAdminNotification } from "@/services/email-service";
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
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [listingTier, setListingTier] = useState<"free" | "premium">("free");
  const [paymentPending, setPaymentPending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const getPremiumPrice = () => {
    if (mode === "list-studio") {
      const hourlyRate = parseFloat(formData["Base Price (Hourly)"] || "0");
      return hourlyRate > 2000 ? 12000 : 8000;
    }
    if (mode === "register-videographer") return 5000;
    if (mode === "register-editor") return 2000;
    return 2000;
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  if (!config) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setFilePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user) { navigate("/signin"); return; }

      if (mode === "list-studio") {
        let uploadedUrls: string[] = [];
        if (selectedFiles.length > 0) {
          const { urls, error: uploadError } = await uploadStudioPhotos(selectedFiles, user.id);
          if (uploadError) throw new Error("Failed to upload images. Please try again.");
          uploadedUrls = urls;
        }

        const { error: dbError } = await createStudio({
          owner_id: user.id,
          name: formData["Studio Name / Business Name"] || formData["Full Name"] || "",
          type: "Studio",
          description: formData["Description"] || "",
          address: formData["Full Address"] || "",
          area: formData["Full Address"] || "",
          city: "Various", // Could be extracted or added as field
          price_per_hour: parseFloat(formData["Base Price (Hourly)"]) || 0,
          features: selectedFeatures,
          available_days: [],
          photos: uploadedUrls,
          space_details: `Contact: ${formData["Contact Number"]}\nEmail: ${formData["Email ID"]}\nMap: ${formData["Google Map Pin Link"]}\nGov ID: ${formData["Government ID (Aadhar/PAN)"]}`,
          agreed_to_terms: true,
          is_approved: false,
          is_active: true,
        });
        if (dbError) throw dbError;
        
        // Notify Admin
        await sendAdminNotification(
          formData["Studio Name / Business Name"] || "New Studio",
          user.email || "Unknown",
          "Various"
        );
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
        let uploadedUrls: string[] = [];
        if (selectedFiles.length > 0) {
          const { urls, error: uploadError } = await uploadStudioPhotos(selectedFiles, user.id);
          if (uploadError) throw new Error("Failed to upload images. Please try again.");
          uploadedUrls = urls;
        }

        const { error: dbError } = await createEquipment({
          owner_id: user.id, name: formData["Equipment Name"] || "", category: "General",
          description: formData["Description"] || "", price_per_day: parseFloat(formData["Price Per Day"]) || 0, is_available: true,
          photos: uploadedUrls
        });
        if (dbError) throw dbError;
      }

      // If premium, mark payment as pending
      if (listingTier === "premium") {
        setPaymentPending(true);
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
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>

        {!submitted ? (
          <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-8 md:p-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#999] mb-4">Registration</p>
            <h2 className="text-3xl md:text-[36px] font-bold text-[#000] mb-4" style={{ fontFamily: '"Newsreader", serif' }}>{config.heading}</h2>
            <p className="text-[#555] text-[16px] leading-[1.6] mb-8">{config.description}</p>

            <form onSubmit={handleSubmit}>

              {/* ═══ FREE vs PREMIUM TIER SELECTION ═══ */}
              {(mode === "list-studio" || mode === "register-videographer" || mode === "register-editor") && (
                <div className="mb-6">
                  <label className="mb-3 block text-[14px] font-bold text-[#000]">Choose Your Listing Plan</label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Free Tier */}
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
                        {["Basic listing on marketplace", "Standard visibility", "Email support"].map((f) => (
                          <li key={f} className="flex items-center gap-2 text-[12px] font-semibold text-[#6B7280]">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Premium Tier */}
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
                          {mode === "list-studio" ? (
                            <p className="text-[20px] font-black text-[#7C3AED] leading-none">₹8,000 <span className="text-[14px]">/ ₹12,000</span><span className="text-[11px] font-bold text-[#9CA3AF] ml-1">/year</span></p>
                          ) : (
                            <p className="text-[20px] font-black text-[#7C3AED] leading-none">₹{getPremiumPrice().toLocaleString()}<span className="text-[11px] font-bold text-[#9CA3AF] ml-1">/year</span></p>
                          )}
                        </div>
                      </div>
                      {mode === "list-studio" && (
                        <div className="flex flex-col gap-1.5 mb-3 p-3 rounded-[10px] bg-white/60 border border-[#E5E7EB]">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#6B7280]">Studio ≤ ₹2,000/hr</span>
                            <span className="text-[13px] font-black text-[#0A0A1A]">₹8,000/yr</span>
                          </div>
                          <div className="w-full h-[1px] bg-[#E5E7EB]"></div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#6B7280]">Studio &gt; ₹2,000/hr</span>
                            <span className="text-[13px] font-black text-[#0A0A1A]">₹12,000/yr</span>
                          </div>
                        </div>
                      )}
                      <ul className="space-y-2 mt-3">
                        {[
                          "Priority listing & top visibility",
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
              )}
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
                        required
                      />
                    </div>
                  ))}
                </div>
              ))}

              {/* Description — full width */}
              <div className="mt-6">
                <label className="mb-2 block text-[14px] font-bold text-[#000]">Details about the place</label>
                <textarea
                  placeholder={config.textarea}
                  value={formData["Description"] || ""}
                  onChange={(e) => handleChange("Description", e.target.value)}
                  className={`${inputClass} min-h-[150px] resize-y`}
                  required
                />
              </div>

              {/* Portfolio Link — hide for equipment */}
              {mode !== "list-equipment" && (
                <div className="mt-4">
                  <label className="mb-2 block text-[14px] font-bold text-[#000]">Portfolio / Website Link</label>
                  <input
                    placeholder="Paste link"
                    value={formData["Portfolio Link"] || ""}
                    onChange={(e) => handleChange("Portfolio Link", e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              {/* Features Checklist for Studios */}
              {mode === "list-studio" && (
                <div className="mt-8">
                  <label className="mb-4 block text-[14px] font-bold text-[#000]">Features & Amenities (Select all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      "Professional Lighting",
                      "Soundproofing",
                      "Air Conditioning",
                      "Makeup Room",
                      "High-speed WiFi",
                      "Parking Available",
                      "Backdrop System",
                      "Green Screen",
                      "Camera Gear",
                      "Monitor / TV",
                      "Changing Room",
                      "Restroom"
                    ].map((feature) => (
                      <label 
                        key={feature} 
                        className={`flex items-center gap-2 p-3 rounded-[12px] border-[1.5px] cursor-pointer transition-all ${
                          selectedFeatures.includes(feature) 
                            ? "bg-violet-50 border-[#7C3AED] text-[#7C3AED]" 
                            : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedFeatures.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                        />
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedFeatures.includes(feature) ? "bg-[#7C3AED] border-[#7C3AED]" : "bg-white border-gray-300"}`}>
                          {selectedFeatures.includes(feature) && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-[13px] font-bold">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Section */}
              <div className="mt-6">
                <label className="mb-2 block text-[14px] font-bold text-[#000]">
                  {mode === "list-equipment" ? "Upload Equipment Photos (HD)" : mode === "list-studio" ? "Upload Studio Images (HD)" : "Upload Images / Work Samples"}
                  <span className="ml-2 text-[12px] font-medium text-[#7C3AED] italic">
                    (High quality HD photos are necessary)
                  </span>
                </label>
                
                {mode === "list-studio" || mode === "list-equipment" ? (
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#E5E7EB] border-dashed rounded-[12px] cursor-pointer bg-gray-50 hover:bg-violet-50 hover:border-[#7C3AED] transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 text-[#9CA3AF] mb-2" />
                        <p className="text-sm text-[#6B7280] font-medium"><span className="text-[#7C3AED] font-bold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                    </label>

                    {filePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {filePreviews.map((preview, index) => (
                          <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    placeholder="Add drive or folder link"
                    value={formData["Samples Link"] || ""}
                    onChange={(e) => handleChange("Samples Link", e.target.value)}
                    className={inputClass}
                    required
                  />
                )}
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
                  <strong>Declaration:</strong> I agree to CreatorsBNB Terms and conditions. I understand that all bookings must be made via the platform only.
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
                  <><Crown className="h-4 w-4" />Pay ₹{getPremiumPrice().toLocaleString()} & Submit</>
                ) : (
                  "Submit Registration — Free Listing"
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
            {paymentPending ? (
              <>
                <div className="mx-auto mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">Premium — Payment Pending Approval</span>
                </div>
                <p className="mx-auto mt-3 max-w-sm text-[#6B7280]">Your premium listing request has been sent to our team. Once we verify your payment, your listing will go live with all premium benefits.</p>
              </>
            ) : (
              <p className="mx-auto mt-3 max-w-sm text-[#6B7280]">Your details have been saved. We'll review and get back to you soon.</p>
            )}
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
