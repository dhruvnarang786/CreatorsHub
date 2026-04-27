import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CheckCircle } from "lucide-react";
import { getStudioById } from "@/services/supabase-service";
import BookingDialog from "@/components/BookingDialog";

/* eslint-disable @typescript-eslint/no-explicit-any */
const StudioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    getStudioById(id).then(({ data }) => { setStudio(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8FC]" style={{ fontFamily: '"Manrope", sans-serif' }}>
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
      <div className="min-h-screen bg-[#F8F8FC] flex items-center justify-center" style={{ fontFamily: '"Manrope", sans-serif' }}>
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
    <div className="min-h-screen bg-[#F8F8FC] relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[rgba(124,58,237,0.08)] px-6 md:px-12 h-[72px] flex items-center justify-between">
        <a href="/" className="font-newsreader italic text-2xl font-bold text-[#0A0A1A]">CreatorsBNB</a>
        <button onClick={() => setBookingOpen(true)} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-sm font-bold hover:shadow-[0_8px_20px_rgba(124,58,237,0.3)] transition-all">Book This Studio</button>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#0A0A1A] transition-colors"><ArrowLeft className="h-4 w-4" /> Back</button>

        {/* Photo Gallery */}
        <div className="rounded-3xl overflow-hidden mb-8">
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-80">
              <img src={photos[0]} alt={studio.name} className="w-full h-full object-cover rounded-l-3xl" />
              <div className="grid grid-cols-2 gap-2">{photos.slice(1, 5).map((p: string, i: number) => (<img key={i} src={p} alt="" className="w-full h-full object-cover" />))}</div>
            </div>
          ) : (
            <div className="h-80 bg-gradient-to-br from-[#7C3AED]/10 to-[#06B6D4]/10 flex items-center justify-center rounded-3xl"><span className="text-6xl">🎬</span></div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="px-3 py-1 rounded-full bg-[rgba(124,58,237,0.08)] text-[#7C3AED] text-xs font-bold uppercase tracking-widest">{studio.type}</span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A1A] mt-4" style={{ fontFamily: '"Newsreader", serif' }}>{studio.name}</h1>
              <div className="flex items-center gap-4 mt-3 text-[#6B7280]"><span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {studio.area}, {studio.city}</span></div>
            </div>
            {studio.description && (<div><h3 className="font-bold text-[#0A0A1A] mb-3">About This Studio</h3><p className="text-[#6B7280] leading-relaxed">{studio.description}</p></div>)}
            {studio.vibe && (<div><h3 className="font-bold text-[#0A0A1A] mb-3">Vibe</h3><p className="text-[#6B7280]">{studio.vibe}</p></div>)}
            {studio.ideal_use_cases && (<div><h3 className="font-bold text-[#0A0A1A] mb-3">Ideal For</h3><p className="text-[#6B7280]">{studio.ideal_use_cases}</p></div>)}
            {features.length > 0 && (
              <div>
                <h3 className="font-bold text-[#0A0A1A] mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-2 gap-3">{features.map((f: string) => (<div key={f} className="flex items-center gap-2 text-[#6B7280]"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm">{f}</span></div>))}</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 rounded-3xl bg-white border border-[rgba(124,58,237,0.10)] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-6">
              <div><span className="text-3xl font-bold text-[#0A0A1A]">₹{(studio.price_per_hour || 0).toLocaleString()}</span><span className="text-[#9CA3AF] text-sm"> / hour</span></div>
              {studio.available_days?.length > 0 && (
                <div><p className="text-sm font-bold text-[#0A0A1A] mb-2">Available Days</p><div className="flex flex-wrap gap-2">{studio.available_days.map((d: string) => (<span key={d} className="px-3 py-1 rounded-full bg-[#F8F8FC] border border-[#E5E7EB] text-xs font-medium text-[#6B7280]">{d}</span>))}</div></div>
              )}
              {(studio.available_from || studio.available_to) && (
                <div className="flex items-center gap-2 text-sm text-[#6B7280]"><Clock className="h-4 w-4" /><span>{studio.available_from || "—"} to {studio.available_to || "—"}</span></div>
              )}
              <button onClick={() => setBookingOpen(true)} className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all">Book Now</button>
              <div className="pt-4 border-t border-[#E5E7EB]">
                <p className="text-xs text-[#9CA3AF] mb-2">Listed by</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">{ownerName.charAt(0).toUpperCase()}</div>
                  <div><p className="text-sm font-bold text-[#0A0A1A]">{ownerName}</p><p className="text-xs text-[#9CA3AF]">Studio Owner</p></div>
                </div>
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
