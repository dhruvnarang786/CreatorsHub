import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getOwnerStudios, getOwnerBookings, getOwnerEarnings, updateBookingStatus, getStudioAvailability, toggleStudioAvailability } from "@/services/supabase-service";
import { sendBookingStatusUpdateEmail } from "@/services/email-service";
import { CalendarDays, Clock, MapPin, Check, X as XIcon, Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday, parseISO } from "date-fns";

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
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Wallet & Banking State
  const [walletBalance, setWalletBalance] = useState(0);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showBankSetup, setShowBankSetup] = useState(false);
  
  // Availability State
  const [selectedStudio, setSelectedStudio] = useState<any>(null);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [togglingDate, setTogglingDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(() => { setLoading(false); }, 5000);
    Promise.all([getOwnerStudios(user.id), getOwnerBookings(user.id), getOwnerEarnings(user.id)]).then(([s, b, e]) => {
      clearTimeout(timeout);
      setStudios(s.data || []); 
      setBookings(b.data || []); 
      setEarnings(e.total); 
      // Simulate wallet balance (unpaid confirmed bookings)
      setWalletBalance(e.total * 0.8); // 80% of total earnings as virtual balance
      setLoading(false);
      if (s.data && s.data.length > 0) {
        setSelectedStudio(s.data[0]);
      }
    }).catch(() => { clearTimeout(timeout); setLoading(false); });
  }, [user]);

  useEffect(() => {
    if (selectedStudio) {
      fetchAvailability(selectedStudio.id);
    }
  }, [selectedStudio]);

  const fetchAvailability = async (studioId: string) => {
    const { data } = await getStudioAvailability(studioId);
    if (data) {
      setUnavailableDates(data.map((d: any) => d.date));
    }
  };

  const handleSignOut = async () => { await signOut(); navigate("/"); };
  
  const handleStatusUpdate = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    const { data } = await updateBookingStatus(bookingId, status);
    if (data) {
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b));
      // Notify creator
      const booking = bookings.find(b => b.id === bookingId);
      if (booking?.profiles?.email) {
        await sendBookingStatusUpdateEmail(
          booking.profiles.email,
          booking.profiles.full_name || "Creator",
          booking.studios?.name || "Studio",
          status
        );
      }
    }
    setUpdatingId(null);
  };

  const toggleDate = async (date: Date) => {
    if (!selectedStudio) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCurrentlyUnavailable = unavailableDates.includes(dateStr);
    
    setTogglingDate(dateStr);
    const { success } = await toggleStudioAvailability(selectedStudio.id, dateStr, isCurrentlyUnavailable);
    
    if (success) {
      setUnavailableDates(prev => 
        isCurrentlyUnavailable 
          ? prev.filter(d => d !== dateStr) 
          : [...prev, dateStr]
      );
    }
    setTogglingDate(null);
  };

  const handleConnectGoogleCalendar = async () => {
    setIsSyncing(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly',
        redirectTo: `${window.location.origin}/owner-dashboard`
      }
    });
    if (error) {
      console.error("Error connecting calendar:", error.message);
      setIsSyncing(false);
    }
  };

  const syncGoogleEvents = async () => {
    if (!selectedStudio) return;
    setIsSyncing(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.provider_token;

      if (!token) {
        console.log("No Google token found. Please reconnect.");
        setIsSyncing(false);
        return;
      }

      // Fetch events for the next 3 months
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();
      if (data.items) {
        const googleDates = data.items.map((event: any) => {
          const start = event.start.dateTime || event.start.date;
          return format(parseISO(start), 'yyyy-MM-dd');
        });

        // Batch block these dates in Supabase
        for (const dateStr of googleDates) {
          if (!unavailableDates.includes(dateStr)) {
            await toggleStudioAvailability(selectedStudio.id, dateStr, false);
          }
        }
        
        // Refresh local state
        const { data: newAvailability } = await getStudioAvailability(selectedStudio.id);
        setUnavailableDates(newAvailability?.map((a: any) => a.date) || []);
      }
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };



  const handleTransferToBank = async () => {
    if (!bankDetails) {
      setShowBankSetup(true);
      return;
    }
    if (walletBalance <= 0) return;

    setIsWithdrawing(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setWalletBalance(0);
    setIsWithdrawing(false);
    alert("Payout request submitted! Money will be credited to your bank account within 24-48 hours.");
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    setBankDetails({
      accountNumber: formData.get('accountNumber'),
      bankName: formData.get('bankName'),
      ifsc: formData.get('ifsc'),
    });
    setShowBankSetup(false);
  };

  // Calendar Rendering Helpers
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4 px-2">
      <h3 className="font-bold text-lg text-[#0A0A1A]">{format(currentMonth, 'MMMM yyyy')}</h3>
      <div className="flex gap-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = startOfToday();

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const isUnavailable = unavailableDates.includes(formattedDate);
        const isPast = isBefore(day, today) && !isSameDay(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isBeingToggled = togglingDate === formattedDate;

        days.push(
          <div
            key={day.toString()}
            onClick={() => !isPast && isCurrentMonth && toggleDate(new Date(formattedDate))}
            className={`relative h-10 flex items-center justify-center rounded-xl text-xs font-bold cursor-pointer transition-all
              ${!isCurrentMonth ? 'text-gray-300 pointer-events-none opacity-0' : ''}
              ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-[#EBE4FF]'}
              ${isUnavailable ? 'bg-red-50 text-red-600 border border-red-100' : 'text-[#0A0A1A]'}
              ${isBeingToggled ? 'animate-pulse' : ''}
            `}
          >
            {format(day, 'd')}
            {isUnavailable && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-600" />}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-1" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="min-h-screen silver-shimmer-bg relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 bg-[rgba(226,226,228,0.92)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] px-8 py-5 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-6">
          <div className="text-right"><p className="text-sm font-bold text-[#0A0A1A]">{profile?.full_name}</p><p className="text-xs text-[#9CA3AF]">Studio Owner</p></div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#67e8f9] flex items-center justify-center text-white font-bold text-sm">{profile?.full_name?.charAt(0)?.toUpperCase() || "O"}</div>
          <button onClick={handleSignOut} className="text-sm text-[#9CA3AF] hover:text-red-500 transition-colors font-medium">Sign Out</button>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Welcome, <span className="italic">{profile?.full_name?.split(" ")[0] || "Owner"}!</span></h1>
          <p className="text-[#6B7280]">Manage your studios, availability, and track bookings.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div onClick={() => navigate("/register/list-studio")} className="p-6 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#67e8f9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-white">add_business</span></div>
            <h3 className="font-bold text-[#0A0A1A] text-sm">List Studio</h3><p className="text-[#9CA3AF] text-xs mt-1">{studios.length} studios listed</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#a476ff] flex items-center justify-center mb-4"><span className="material-symbols-outlined text-white">event_available</span></div>
            <h3 className="font-bold text-[#0A0A1A] text-sm">Bookings</h3><p className="text-[#9CA3AF] text-xs mt-1">{bookings.length} requests</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#f9a8d4] flex items-center justify-center mb-4"><span className="material-symbols-outlined text-white">payments</span></div>
            <h3 className="font-bold text-[#0A0A1A] text-sm">Earnings</h3><p className="text-xl font-black text-[#7C3AED] mt-1">₹{earnings.toLocaleString()}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0A0A1A] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-all duration-700">
              <ShieldCheck className="w-20 h-20" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><p className="text-xl">💰</p></div>
                <span className="text-[10px] font-black uppercase tracking-[2px] opacity-60">Virtual Wallet</span>
              </div>
              <h3 className="text-2xl font-black mb-1">₹{walletBalance.toLocaleString()}</h3>
              <p className="text-[11px] opacity-60 mb-4 font-bold uppercase tracking-wider">Withdrawable Balance</p>
              <button 
                onClick={handleTransferToBank}
                disabled={isWithdrawing || walletBalance === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-[13px] font-black hover:shadow-[0_10px_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isWithdrawing ? "Processing..." : "Transfer to Bank"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Studios & Bookings */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* My Studios */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>My <span className="italic">Studios</span></h2>
                <button onClick={() => navigate("/register/list-studio")} className="text-[#7C3AED] text-sm font-bold hover:underline">+ Add New</button>
              </div>
              {studios.length === 0 ? (
                <div className="text-center py-10 rounded-2xl bg-white border border-dashed border-gray-300">
                  <p className="text-[#9CA3AF] text-sm">No studios listed yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {studios.map((s: any) => (
                    <div 
                      key={s.id} 
                      onClick={() => setSelectedStudio(s)}
                      className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${selectedStudio?.id === s.id ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-transparent bg-white shadow-sm hover:shadow-md'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-[#0A0A1A]">{s.name}</h4>
                          <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{s.area}, {s.city}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${s.is_approved ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{s.is_approved ? "Approved" : "Pending"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Requests */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A0A1A] mb-6" style={{ fontFamily: '"Newsreader", serif' }}>Recent <span className="italic">Requests</span></h2>
              {bookings.length === 0 ? (
                <div className="text-center py-10 rounded-2xl bg-white border border-dashed border-gray-300">
                  <p className="text-[#9CA3AF] text-sm">No booking requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((b: any) => (
                    <div key={b.id} className="p-5 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-[#0A0A1A]">{b.studios?.name || "Studio"}</h4>
                          <p className="text-xs text-[#6B7280] font-bold">by {b.profiles?.full_name || "Creator"}</p>
                          <div className="flex items-center gap-3 text-[11px] text-[#6B7280] font-black uppercase tracking-wider">
                            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{b.booking_date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.start_time} – {b.end_time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-[#0A0A1A] text-sm">₹{b.total_price}</span>
                          {b.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleStatusUpdate(b.id, 'cancelled')}
                                disabled={updatingId === b.id}
                                className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                title="Reject Booking"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                                disabled={updatingId === b.id}
                                className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                                title="Accept Booking"
                              >
                                {updatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              </button>
                            </div>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[b.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>{b.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Availability Calendar */}
          <div className="space-y-6">
            <div className="p-6 rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#EBE4FF] flex items-center justify-center text-[#7C3AED]">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Manage <span className="italic">Availability</span></h2>
              </div>

              {/* Google Calendar Sync Integration */}
              <div className="mb-8 p-4 rounded-[20px] bg-gradient-to-br from-[#f8f9ff] to-[#f3f4ff] border border-violet-100/50">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.51 6.16-4.51z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0A0A1A]">Calendar Automation</h4>
                    <p className="text-[11px] text-[#6B7280] leading-snug">Sync with Google Calendar to automatically block busy dates.</p>
                  </div>
                </div>
                <button 
                  onClick={handleConnectGoogleCalendar}
                  disabled={isSyncing}
                  className="w-full py-3 rounded-xl bg-white border border-[#EBE4FF] text-[#7C3AED] text-[13px] font-black hover:bg-violet-50 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSyncing ? "Syncing..." : "Connect Google Calendar"}
                </button>
              </div>
              
              {selectedStudio ? (
                <>
                  <p className="text-xs text-[#6B7280] mb-6 font-bold uppercase tracking-widest">Selected: <span className="text-[#7C3AED]">{selectedStudio.name}</span></p>
                  
                  {renderHeader()}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    {renderDays()}
                    {renderCells()}
                  </div>
                  
                  <div className="mt-6 p-4 rounded-xl bg-[#F5F3FF] border border-[#EBE4FF]">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#6B46C1]">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span>Blocked dates</span>
                    </div>
                    <p className="text-[10px] text-[#6B7280] mt-2 leading-relaxed">
                      Click a date to toggle availability. Red boxes are hidden from creators.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-[#9CA3AF]">Select a studio to manage its availability.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-[24px] bg-[#0A0A1A] text-white shadow-xl">
              <h3 className="font-newsreader italic text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold flex items-center justify-between px-4">
                  <span>Download Earnings</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold flex items-center justify-between px-4">
                  <span>Studio Settings</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bank Setup Modal */}
      {showBankSetup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBankSetup(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A1A]">Link Bank Account</h2>
                <p className="text-sm text-[#6B7280] mt-1">Details for virtual wallet payouts</p>
              </div>
              <button onClick={() => setShowBankSetup(false)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveBankDetails} className="space-y-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 block">Bank Name</label>
                <input name="bankName" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none transition-colors" placeholder="e.g. HDFC Bank" />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 block">Account Number</label>
                <input name="accountNumber" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none transition-colors" placeholder="0000 0000 0000 00" />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 block">IFSC Code</label>
                <input name="ifsc" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none transition-colors" placeholder="HDFC0001234" />
              </div>
              <button type="submit" className="w-full py-4 bg-[#0A0A1A] text-white rounded-xl font-bold mt-4 hover:bg-[#1a1a2e] transition-colors">
                Save & Link Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
