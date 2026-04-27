import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getOwnerStudios, getOwnerBookings, getOwnerEarnings, updateBookingStatus } from "@/services/supabase-service";
import { CalendarDays, Clock, MapPin, Check, X as XIcon, Loader2 } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};

const OwnerDashboard = () => {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [studios, setStudios] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([getOwnerStudios(user.id), getOwnerBookings(user.id), getOwnerEarnings(user.id)]).then(([s, b, e]) => {
      setStudios(s.data || []); setBookings(b.data || []); setEarnings(e.total); setLoading(false);
    });
  }, [user]);

  const handleSignOut = async () => { await signOut(); navigate("/"); };
  const handleStatusUpdate = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    const { data } = await updateBookingStatus(bookingId, status);
    if (data) setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b));
    setUpdatingId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[rgba(124,58,237,0.08)] px-8 py-5 flex justify-between items-center">
        <a href="/" className="font-newsreader italic text-2xl font-bold text-[#0A0A1A]">CreatorsBNB</a>
        <div className="flex items-center gap-6">
          <div className="text-right"><p className="text-sm font-bold text-[#0A0A1A]">{profile?.full_name}</p><p className="text-xs text-[#9CA3AF]">Studio Owner</p></div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#67e8f9] flex items-center justify-center text-white font-bold text-sm">{profile?.full_name?.charAt(0)?.toUpperCase() || "O"}</div>
          <button onClick={handleSignOut} className="text-sm text-[#9CA3AF] hover:text-red-500 transition-colors font-medium">Sign Out</button>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Welcome, <span className="italic">{profile?.full_name?.split(" ")[0] || "Owner"}!</span></h1>
          <p className="text-[#6B7280]">Manage your studios, bookings, and track your earnings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div onClick={() => navigate("/register/list-studio")} className="p-8 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#67e8f9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-white text-2xl">add_business</span></div>
            <h3 className="font-bold text-[#0A0A1A]">List Studio</h3><p className="text-[#9CA3AF] text-sm mt-1">{studios.length} studio{studios.length !== 1 ? "s" : ""} listed</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#a476ff] flex items-center justify-center mb-4"><span className="material-symbols-outlined text-white text-2xl">event_available</span></div>
            <h3 className="font-bold text-[#0A0A1A]">Bookings</h3><p className="text-[#9CA3AF] text-sm mt-1">{bookings.length} total request{bookings.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#f9a8d4] flex items-center justify-center mb-4"><span className="material-symbols-outlined text-white text-2xl">payments</span></div>
            <h3 className="font-bold text-[#0A0A1A]">Earnings</h3><p className="text-2xl font-bold text-[#7C3AED] mt-1">₹{earnings.toLocaleString()}</p>
          </div>
        </div>

        {loading && <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse" />)}</div>}

        {!loading && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#0A0A1A] mb-6" style={{ fontFamily: '"Newsreader", serif' }}>My <span className="italic">Studios</span></h2>
            {studios.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)]">
                <span className="text-4xl block mb-4">🏠</span>
                <h3 className="font-bold text-[#0A0A1A] mb-2">No studios listed yet</h3>
                <p className="text-[#9CA3AF] text-sm mb-4">Add your first studio and start getting bookings!</p>
                <button onClick={() => navigate("/register/list-studio")} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm">List Your Studio</button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {studios.map((s: any) => (
                  <div key={s.id} className="p-6 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.08)] transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-[#0A0A1A]">{s.name}</h4>
                        <p className="text-sm text-[#6B7280] flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" />{s.area}, {s.city}</p>
                        <p className="text-sm font-bold text-[#7C3AED] mt-2">₹{(s.price_per_hour || 0).toLocaleString()}/hr</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.is_approved ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{s.is_approved ? "Approved" : "Pending Review"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && (
          <div>
            <h2 className="text-2xl font-bold text-[#0A0A1A] mb-6" style={{ fontFamily: '"Newsreader", serif' }}>Booking <span className="italic">Requests</span></h2>
            {bookings.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)]">
                <span className="text-4xl block mb-4">📅</span>
                <h3 className="font-bold text-[#0A0A1A] mb-2">No booking requests yet</h3>
                <p className="text-[#9CA3AF] text-sm">Once creators book your studios, they'll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b: any) => (
                  <div key={b.id} className="p-6 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.08)] transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-[#0A0A1A]">{b.studios?.name || "Studio"}</h4>
                        <p className="text-sm text-[#6B7280]">by {b.profiles?.full_name || "Creator"} ({b.profiles?.email || ""})</p>
                        <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{b.booking_date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.start_time} – {b.end_time}</span>
                        </div>
                        {b.message && <p className="text-sm text-[#9CA3AF] italic">"{b.message}"</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#0A0A1A]">₹{(b.total_price || 0).toLocaleString()}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusColors[b.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>{b.status}</span>
                        {b.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleStatusUpdate(b.id, "confirmed")} disabled={updatingId === b.id} className="w-9 h-9 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center hover:bg-green-100 transition-colors disabled:opacity-50">
                              {updatingId === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            </button>
                            <button onClick={() => handleStatusUpdate(b.id, "cancelled")} disabled={updatingId === b.id} className="w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50">
                              <XIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
