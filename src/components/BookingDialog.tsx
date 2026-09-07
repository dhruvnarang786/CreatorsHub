import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, CalendarDays, Clock, Loader2, CheckCircle, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createBooking, getStudioAvailability } from "@/services/supabase-service";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface BookingDialogProps { open: boolean; onOpenChange: (open: boolean) => void; studio: any; }

const BookingDialog = ({ open, onOpenChange, studio }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  useEffect(() => {
    if (open && studio?.id) {
      getStudioAvailability(studio.id).then(({ data }) => {
        if (data) setUnavailableDates(data.map((d: any) => d.date));
      });
    }
  }, [open, studio]);

  // Generate slots based on studio hours
  const allSlots = useMemo(() => {
    const start = studio?.available_from || "09:00";
    const end = studio?.available_to || "21:00";
    const slots = [];
    let current = parseInt(start.split(":")[0]);
    const last = parseInt(end.split(":")[0]);

    for (let i = current; i < last; i++) {
      const time = `${i.toString().padStart(2, "0")}:00`;
      slots.push(time);
    }
    return slots;
  }, [studio]);

  // Check if current selected date is manually blocked
  const isDateBlocked = useMemo(() => {
    return unavailableDates.includes(selectedDate);
  }, [selectedDate, unavailableDates]);

  // Mock booked slots for dummy studios
  const bookedSlots = useMemo(() => {
    if (isDateBlocked) return allSlots; // Block all slots if date is blocked
    if (studio?.id?.startsWith("p") && selectedDate.endsWith("5")) {
      return ["11:00", "12:00", "15:00"];
    }
    return [];
  }, [studio, selectedDate, isDateBlocked, allSlots]);

  if (!open) return null;

  const pricePerHour = Number(studio?.price_per_hour) || 0;
  const totalHours = selectedSlots.length;
  const totalPrice = totalHours * pricePerHour;

  const toggleSlot = (slot: string) => {
    if (bookedSlots.includes(slot)) return;
    
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot].sort());
    }
  };

  const handleSubmit = async () => {
    if (!user) { navigate("/signin"); return; }
    if (selectedSlots.length === 0) { setError("Please select at least one time slot."); return; }
    
    setLoading(true);
    setError("");

    // Find start and end
    const sorted = [...selectedSlots].sort();
    const startTime = sorted[0];
    const lastSlot = sorted[sorted.length - 1];
    const endTime = `${(parseInt(lastSlot.split(":")[0]) + 1).toString().padStart(2, "0")}:00`;

    const { error: bookingError } = await createBooking({
      studio_id: studio.id,
      creator_id: user.id,
      owner_id: studio.owner_id,
      booking_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      total_hours: totalHours,
      total_price: totalPrice,
      status: "pending",
      payment_status: "unpaid"
    });

    setLoading(false);
    if (bookingError) {
      setError("Booking failed. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError("");
    setSelectedSlots([]);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={handleClose} />
      
      <div className="relative bg-white rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300" style={{ fontFamily: '"Manrope", sans-serif' }}>
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Select Time Slots</h3>
            <p className="text-sm text-[#6B7280] font-medium mt-1">{studio.name}</p>
          </div>
          <button onClick={handleClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#9CA3AF] hover:text-[#0A0A1A] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500 animate-in zoom-in-50 duration-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#0A0A1A]">Booking Successful!</h3>
              <p className="text-[#6B7280] mt-2">Your request for {totalHours} hour(s) has been sent to the studio owner.</p>
            </div>
            <button onClick={handleClose} className="w-full py-4 rounded-full bg-[#0A0A1A] text-white font-bold text-[15px] hover:scale-[1.02] transition-transform">
              Back to Studio
            </button>
          </div>
        ) : (
          <div className="p-8 pt-6 space-y-8 max-h-[80vh] overflow-y-auto">
            
            {/* Date Selection */}
            <div className="space-y-4">
              <label className="text-[13px] font-black uppercase tracking-[1.5px] text-[#9CA3AF] flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Select Date
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlots([]); }} 
                  min={new Date().toISOString().split("T")[0]} 
                  className={`w-full rounded-2xl bg-gray-50 border-none px-6 py-4 text-[15px] font-bold outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all cursor-pointer ${isDateBlocked ? 'text-red-500 ring-2 ring-red-100' : 'text-[#0A0A1A]'}`}
                />
                {isDateBlocked && (
                  <p className="text-[11px] text-red-500 font-bold mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" /> This date is marked as unavailable by the owner.
                  </p>
                )}
              </div>
            </div>

            {/* Time Slots Grid */}
            {!isDateBlocked ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-black uppercase tracking-[1.5px] text-[#9CA3AF] flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Available Slots
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-100" /><span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Booked</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#7C3AED]" /><span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Selected</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlots.includes(slot);
                    
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        disabled={isBooked}
                        className={`
                          group relative py-3.5 rounded-xl text-[14px] font-bold transition-all border-[1.5px]
                          ${isBooked ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 
                            isSelected ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]' : 
                            'bg-white border-gray-100 text-[#374151] hover:border-[#7C3AED] hover:text-[#7C3AED]'}
                        `}
                      >
                        {slot}
                        {isBooked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-[70%] h-[1.5px] bg-gray-300 rotate-[-15deg]" /></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
                <p className="text-[#9CA3AF] text-sm font-bold">Please select another date to see available slots.</p>
              </div>
            )}

            {/* Summary Card */}
            {!isDateBlocked && (
              <div className="rounded-[24px] bg-[#F8F8FC] border border-[#E5E7EB] p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#6B7280]">Price per hour</span>
                  <span className="text-sm font-bold text-[#0A0A1A]">₹{pricePerHour.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#6B7280]">Hours Selected</span>
                  <span className="text-sm font-bold text-[#7C3AED]">{totalHours}h</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-[17px] font-black text-[#0A0A1A]">Total Payable</span>
                  <span className="text-[17px] font-black text-[#7C3AED]">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-[13px] font-bold border border-red-100">
                <Info className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {/* CTA */}
            <button 
              onClick={handleSubmit} 
              disabled={loading || selectedSlots.length === 0 || isDateBlocked} 
              className="w-full py-5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-black text-[17px] hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                </span>
              ) : !user ? (
                "Sign In to Book"
              ) : isDateBlocked ? (
                "Date Unavailable"
              ) : (
                `Confirm Booking • ₹${totalPrice.toLocaleString()}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDialog;
