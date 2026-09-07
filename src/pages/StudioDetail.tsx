import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CheckCircle } from "lucide-react";
import { getStudioById } from "@/services/supabase-service";
import BookingDialog from "@/components/BookingDialog";
import Logo from "@/components/Logo";

/* eslint-disable @typescript-eslint/no-explicit-any */
const StudioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (id.startsWith("p")) {
      // Dummy data for preview
      const dummy = {
        id,
        name: id === "p1" ? "Noir Podcast Studio" : id === "p2" ? "Daylight Creator Loft" : "Reel Factory Set",
        city: id === "p1" ? "Mumbai" : id === "p2" ? "Delhi" : "Bengaluru",
        area: id === "p1" ? "Bandra" : id === "p2" ? "Hauz Khas" : "Indiranagar",
        type: id === "p1" ? "Podcast Studio" : id === "p2" ? "Photo + Video" : "Short-form Studio",
        price_per_hour: id === "p1" ? 1800 : id === "p2" ? 3200 : 2500,
        description: "This is a premium creative space designed for high-quality production. It features professional acoustics, modern aesthetics, and all the equipment needed for a successful shoot.",
        vibe: "Moody, professional, and inspiring with deep wood textures and customizable lighting.",
        ideal_use_cases: "Podcasts, Interviews, Branded Content, Product Shoots, and Creative Workshops.",
        features: ["Professional Lighting", "Soundproofing", "Air Conditioning", "Makeup Room", "High-speed WiFi", "Parking Available"],
        available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        available_from: "09:00",
        available_to: "21:00",
        photos: [
          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop"
        ]
      };
      setStudio(dummy);
      setLoading(false);
    } else {
      getStudioById(id).then(({ data }) => { setStudio(data); setLoading(false); });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen silver-shimmer-bg" style={{ fontFamily: '"Manrope", sans-serif' }}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="h-6 w-32 rounded bg-[#E5E7EB] animate-pulse mb-8" />
          <div className="h-80 rounded-3xl bg-[#E5E7EB] animate-pulse mb-8" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 rounded bg-[#E5E7EB] animate-pulse" />
            <div className="h-6 w-1/3 rounded bg-[#E5E7EB] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen silver-shimmer-bg flex items-center justify-center" style={{ fontFamily: '"Manrope", sans-serif' }}>
        <div className="text-center space-y-4">
          <span className="text-4xl">🏠</span>
          <h1 className="text-2xl font-bold text-[#0A0A1A]">Studio Not Found</h1>
          <p className="text-[#6B7280]">This studio may have been removed or doesn't exist.</p>
          <button onClick={() => navigate("/studios")} className="px-6 py-2.5 rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] font-bold text-sm hover:bg-[#7C3AED] hover:text-white transition-colors">Browse Studios</button>
        </div>
      </div>
    );
  }

  const photos = studio.photos || [];
  const features = studio.features || [];
  const ownerName = studio.profiles?.full_name || "Studio Owner";

  return (
    <div className="min-h-screen silver-shimmer-bg relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <nav className="sticky top-0 z-50 bg-[rgba(226,226,228,0.92)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] px-6 md:px-12 h-[72px] flex items-center justify-between">
        <Logo />
        <button onClick={() => setBookingOpen(true)} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-sm font-bold hover:shadow-[0_8px_20px_rgba(124,58,237,0.3)] transition-all">Book This Studio</button>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-bold text-[#0A0A1A] hover:text-[#7C3AED] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>

        {/* 1. Listing Identity & Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#EBE4FF] text-[#6B46C1] text-[10px] font-black uppercase tracking-[1.5px] border border-violet-100">{studio.type || "Studio"} in {studio.city}</span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-[1.5px] border border-green-100">Verified Listing</span>
          </div>
          <h1 className="text-[42px] md:text-[52px] font-bold text-[#0A0A1A] leading-tight mb-2" style={{ fontFamily: '"Newsreader", serif' }}>{studio.name}</h1>
          <p className="text-[16px] text-[#6B7280] flex items-center gap-1.5 font-medium"><MapPin className="h-4 w-4 text-[#7C3AED]" /> {studio.area}, {studio.city}</p>
        </div>

        {/* 2. Photo & Video Gallery */}
        <div className="rounded-[24px] overflow-hidden mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-[450px]">
              <div className="md:col-span-8 h-full relative group overflow-hidden">
                <img src={photos[0]} alt={studio.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="md:col-span-4 grid grid-rows-2 gap-2 h-full">
                {photos.slice(1, 3).map((p: string, i: number) => (
                  <div key={i} className="h-full relative group overflow-hidden">
                    <img src={p} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    {i === 1 && photos.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl backdrop-blur-[2px]">
                        +{photos.length - 3} More
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[400px] bg-gradient-to-br from-[#7C3AED]/5 to-[#06B6D4]/5 flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E5E7EB]">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4"><span className="text-3xl">🎬</span></div>
              <p className="text-[#9CA3AF] font-bold">No gallery images uploaded yet</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description & Vibe */}
            <div className="space-y-6">
              <h3 className="text-[24px] font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Description & Vibe</h3>
              <div className="prose prose-violet max-w-none">
                <p className="text-[#555] text-[16px] leading-[1.7]">{studio.description || "No description provided."}</p>
                {studio.vibe && (
                  <div className="mt-6 p-5 rounded-[20px] bg-violet-50/50 border border-violet-100/50">
                    <h4 className="text-[14px] font-black text-[#7C3AED] uppercase tracking-wider mb-2">The Vibe</h4>
                    <p className="text-[#6B7280] italic leading-relaxed text-[15px]">"{studio.vibe}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ideal For */}
            {studio.ideal_use_cases && (
              <div className="space-y-6">
                <h3 className="text-[24px] font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Ideal Use Cases</h3>
                <div className="flex flex-wrap gap-4">
                  {studio.ideal_use_cases.replace(/\band\b/g, ',').split(',').map((s: string) => s.trim()).filter(Boolean).map((use: string) => (
                    <div key={use} className="px-6 py-4 rounded-[20px] bg-white border border-[#F3F4F6] shadow-sm text-[15px] font-bold text-[#374151] hover:border-[#7C3AED]/30 hover:shadow-md transition-all flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED]/40"></span>
                      {use.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <h3 className="text-[24px] font-bold text-[#0A0A1A] mb-6" style={{ fontFamily: '"Newsreader", serif' }}>Features & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5">
                {features.length > 0 ? features.map((f: string) => (
                  <div key={f} className="flex flex-col items-center text-center gap-4 p-6 rounded-[24px] bg-white border border-[#F3F4F6] shadow-sm hover:border-[#7C3AED]/30 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-[14px] font-bold text-[#374151] leading-tight">{f}</span>
                  </div>
                )) : (
                  <p className="text-[#9CA3AF] text-sm col-span-full">General studio amenities included.</p>
                )}
              </div>
            </div>

            {/* Availability / Calendar Placeholder */}
            <div>
              <h3 className="text-[24px] font-bold text-[#0A0A1A] mb-6" style={{ fontFamily: '"Newsreader", serif' }}>Availability</h3>
              <div className="p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-sm">
                <div className="flex flex-wrap gap-3">
                  {studio.available_days?.length > 0 ? studio.available_days.map((d: string) => (
                    <span key={d} className="px-4 py-2 rounded-xl bg-violet-50 text-[#7C3AED] text-sm font-bold border border-violet-100">{d}</span>
                  )) : (
                    <span className="text-[#6B7280] text-sm">Flexible availability. Contact for specific dates.</span>
                  )}
                </div>
                {(studio.available_from || studio.available_to) && (
                  <div className="mt-6 flex items-center gap-3 text-[#0A0A1A] font-bold bg-[#F8F8FC] p-4 rounded-xl">
                    <Clock className="h-5 w-5 text-[#7C3AED]" />
                    <span>{studio.available_from || "09:00"} — {studio.available_to || "21:00"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="relative">
            <div className="sticky top-28 rounded-[28px] bg-white border border-[#E5E7EB] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.06)] space-y-8">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[36px] font-bold text-[#0A0A1A]">₹{(studio.price_per_hour || 0).toLocaleString()}</span>
                  <span className="text-[#9CA3AF] font-medium text-[15px]">/ hour</span>
                </div>
                <p className="text-[13px] text-green-600 font-bold mt-1">Free Cancellation within 24hrs</p>
              </div>

              <div className="space-y-4">
                <button onClick={() => setBookingOpen(true)} className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-black text-[17px] shadow-[0_10px_25px_rgba(124,58,237,0.3)] hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(124,58,237,0.4)] transition-all">
                  Book Now
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} studio={studio} />
    </div>
  );
};

export default StudioDetail;
