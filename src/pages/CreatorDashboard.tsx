import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCreatorBookings } from "@/services/supabase-service";
import { CalendarDays, Clock, MapPin } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};

const CreatorDashboard = () => {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!user) return; getCreatorBookings(user.id).then(({ data }) => { setBookings(data || []); setLoading(false); }); }, [user]);
  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <div className="min-h-screen bg-[#F8F8FC] relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[rgba(124,58,237,0.08)] px-8 py-5 flex justify-between items-center">
        <a href="/" className="font-newsreader italic text-2xl font-bold text-[#0A0A1A]">CreatorsBNB</a>
        <div className="flex items-center gap-6">
          <div className="text-right"><p className="text-sm font-bold text-[#0A0A1A]">{profile?.full_name}</p><p className="text-xs text-[#9CA3AF]">Creator</p></div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">{profile?.full_name?.charAt(0)?.toUpperCase() || "C"}</div>
          <button onClick={handleSignOut} className="text-sm text-[#9CA3AF] hover:text-red-500 transition-colors font-medium">Sign Out</button>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Welcome, <span className="italic">{profile?.full_name?.split(" ")[0] || "Creator"}!</span></h1>
          <p className="text-[#6B7280]">Manage your studio bookings and explore new spaces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "search", title: "Find Studios", desc: "Browse available spaces", color: "from-[#7C3AED] to-[#a476ff]", action: () => navigate("/studios") },
            { icon: "calendar_month", title: "My Bookings", desc: `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`, color: "from-[#06B6D4] to-[#67e8f9]", action: () => {} },
            { icon: "group", title: "Find Pros", desc: "Editors & videographers", color: "from-[#EC4899] to-[#f9a8d4]", action: () => navigate("/professionals?type=videographer") },
          ].map((item) => (
            <div key={item.title} onClick={item.action} className="p-8 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all cursor-pointer group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-white text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-[#0A0A1A]">{item.title}</h3>
              <p className="text-[#9CA3AF] text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#0A0A1A] mb-6" style={{ fontFamily: '"Newsreader", serif' }}>Your <span className="italic">Bookings</span></h2>
          {loading && <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse" />)}</div>}
          {!loading && bookings.length === 0 && (
            <div className="text-center py-16 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <span className="text-3xl block mb-4">📅</span>
              <h3 className="font-bold text-[#0A0A1A] mb-2">No bookings yet</h3>
              <p className="text-[#9CA3AF] text-sm mb-4">Find a studio and make your first booking!</p>
              <button onClick={() => navigate("/studios")} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm">Browse Studios</button>
            </div>
          )}
          {!loading && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((b: any) => (
                <div key={b.id} className="p-6 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.08)] transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0A0A1A]">{b.studios?.name || "Studio"}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                        {b.studios?.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.studios.city}</span>}
                        <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{b.booking_date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.start_time} – {b.end_time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#0A0A1A]">₹{(b.total_price || 0).toLocaleString()}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusColors[b.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>{b.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
