import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, ExternalLink, ShieldCheck, Clock, MapPin } from "lucide-react";
import { sendOwnerApprovalEmail } from "@/services/email-service";

const AdminDashboard = () => {
  const [pendingStudios, setPendingStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingStudios();
  }, []);

  const fetchPendingStudios = async () => {
    const { data, error } = await supabase
      .from('studios')
      .select('*, profiles(full_name, email)')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });
    
    if (data) setPendingStudios(data);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    const studioToApprove = pendingStudios.find(s => s.id === id);
    if (!studioToApprove) return;

    setProcessingId(id);
    const { error } = await supabase
      .from('studios')
      .update({ is_approved: true })
      .eq('id', id);
    
    if (!error) {
      setPendingStudios(prev => prev.filter(s => s.id !== id));
      
      // Notify Owner
      if (studioToApprove.profiles?.email) {
        await sendOwnerApprovalEmail(
          studioToApprove.profiles.email,
          studioToApprove.profiles.full_name || "Owner",
          studioToApprove.name
        );
      }
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject and remove this listing?")) return;
    setProcessingId(id);
    const { error } = await supabase
      .from('studios')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setPendingStudios(prev => prev.filter(s => s.id !== id));
    }
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 md:p-12" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0A1A] flex items-center gap-3">
              <ShieldCheck className="text-[#7C3AED] w-8 h-8" />
              Admin <span className="font-newsreader italic">Portal</span>
            </h1>
            <p className="text-[#6B7280] mt-2">Review and approve new studio listings</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="text-sm font-bold text-[#7C3AED]">{pendingStudios.length} Pending Requests</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C3AED]"></div>
          </div>
        ) : pendingStudios.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-300">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-[#0A0A1A]">All caught up!</h3>
            <p className="text-[#6B7280]">No new studios are waiting for approval.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingStudios.map((studio) => (
              <div key={studio.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-[#F3F4F6] flex flex-col md:flex-row gap-8 items-center">
                {/* Preview Image */}
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                  {studio.photos?.[0] ? (
                    <img src={studio.photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#0A0A1A]">{studio.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider border border-amber-100 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending Review
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {studio.area}, {studio.city}</span>
                    <span className="flex items-center gap-1.5 font-bold text-[#7C3AED]">₹{studio.price_per_hour}/hr</span>
                    <span className="text-[#0A0A1A] font-bold">Owner: {studio.profiles?.full_name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {studio.features?.slice(0, 3).map((f: string) => (
                      <span key={f} className="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100">{f}</span>
                    ))}
                    {studio.features?.length > 3 && <span className="text-[10px] font-bold text-gray-400">+{studio.features.length - 3} more</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 shrink-0">
                  <button 
                    onClick={() => handleReject(studio.id)}
                    disabled={processingId === studio.id}
                    className="p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => handleApprove(studio.id)}
                    disabled={processingId === studio.id}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {processingId === studio.id ? "..." : <Check className="w-5 h-5" />}
                    Approve Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
