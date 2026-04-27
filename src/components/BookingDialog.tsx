import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CalendarDays, Clock, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/services/supabase-service";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface BookingDialogProps { open: boolean; onOpenChange: (open: boolean) => void; studio: any; }

const BookingDialog = ({ open, onOpenChange, studio }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState(""); const [startTime, setStartTime] = useState("10:00"); const [endTime, setEndTime] = useState("12:00");
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false); const [success, setSuccess] = useState(false); const [error, setError] = useState("");

  if (!open) return null;
  const pricePerHour = Number(studio?.price_per_hour) || 0;
  const calcHours = () => { if (!startTime || !endTime) return 0; const [sh,sm] = startTime.split(":").map(Number); const [eh,em] = endTime.split(":").map(Number); return Math.max(0, (eh*60+em-sh*60-sm)/60); };
  const totalHours = calcHours(); const totalPrice = totalHours * pricePerHour;

  const handleSubmit = async () => {
    if (!user) { navigate("/signin"); return; }
    if (!date || totalHours <= 0) { setError("Please select a valid date and time range."); return; }
    setLoading(true); setError("");
    const { error: bookingError } = await createBooking({ studio_id: studio.id, creator_id: user.id, owner_id: studio.owner_id, booking_date: date, start_time: startTime, end_time: endTime, total_hours: totalHours, total_price: totalPrice, message: message || null, status: "pending", payment_status: "unpaid" });
    setLoading(false);
    if (bookingError) { setError("Booking failed. Please try again."); } else { setSuccess(true); }
  };

  const handleClose = () => { setSuccess(false); setError(""); setDate(""); setStartTime("10:00"); setEndTime("12:00"); setMessage(""); onOpenChange(false); };

  const inputClass = "w-full rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] px-4 py-3 text-sm text-[#0A0A1A] outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_rgba(124,58,237,0.15),0_4px_20px_rgba(0,0,0,0.1)] w-full max-w-md mx-4 p-8 space-y-6 animate-in fade-in zoom-in-95" style={{ fontFamily: '"Manrope", sans-serif' }}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#0A0A1A] transition-colors"><X className="h-5 w-5" /></button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle className="h-8 w-8 text-green-500" /></div>
            <h3 className="text-2xl font-bold text-[#0A0A1A]">Booking Requested!</h3>
            <p className="text-[#6B7280] text-sm">Your booking for <span className="font-semibold">{studio.name}</span> has been sent to the owner.</p>
            <button onClick={handleClose} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm">Done</button>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Book {studio.name}</h3>
              <p className="text-sm text-[#6B7280] mt-1">₹{pricePerHour.toLocaleString()} / hour</p>
            </div>
            <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block flex items-center gap-2"><Clock className="h-4 w-4" /> Start</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} /></div>
              <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block flex items-center gap-2"><Clock className="h-4 w-4" /> End</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} /></div>
            </div>
            <div><label className="text-sm font-semibold text-[#374151] mb-1.5 block">Message (optional)</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell the owner about your shoot..." className={`${inputClass} min-h-[80px] resize-y`} /></div>
            {totalHours > 0 && (
              <div className="rounded-2xl bg-[#F8F8FC] border border-[#E5E7EB] p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[#6B7280]">{totalHours} hour{totalHours !== 1 ? "s" : ""} × ₹{pricePerHour.toLocaleString()}</span><span className="font-bold text-[#0A0A1A]">₹{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm border-t border-[#E5E7EB] pt-2"><span className="font-bold text-[#0A0A1A]">Total</span><span className="font-bold text-[#7C3AED]">₹{totalPrice.toLocaleString()}</span></div>
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={handleSubmit} disabled={loading} className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Booking...</span> : !user ? "Sign In to Book" : "Confirm Booking"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingDialog;
