import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTrendingStudios, getTrendingProfessionals } from "@/services/supabase-service";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Search, Users, Camera, Building2, Sparkles, Rocket, Smile, CalendarDays, Home, Video, Clapperboard, Briefcase, Presentation, UserPlus, Edit, Box, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Logo from "@/components/Logo";

const SHOWCASE_VIDEOS = [
  "https://res.cloudinary.com/drulic8e0/video/upload/v1776249407/14478811_1080_1920_30fps_e1w0ct.mp4",
  "https://res.cloudinary.com/drulic8e0/video/upload/v1776798751/15628135_1080_1920_30fps_fhqzwv.mp4",
  "https://res.cloudinary.com/drulic8e0/video/upload/v1776798733/15422875_1080_1920_30fps_dnzlsc.mp4",
  "https://res.cloudinary.com/drulic8e0/video/upload/v1778009814/3917780-uhd_2160_4096_25fps_a2r4y9.mp4",
  "https://res.cloudinary.com/drulic8e0/video/upload/v1778009855/14961399_2160_3840_50fps_xxfkws.mp4",
  "https://res.cloudinary.com/drulic8e0/video/upload/v1778241052/9441682-uhd_2160_3840_30fps_c16fgl.mp4",
];

const SHAPE_GRADIENTS = [
  "shape-gradient-1",
  "shape-gradient-2",
  "shape-gradient-3",
  "shape-gradient-4",
  "shape-gradient-5",
  "shape-gradient-6",
];

const COLORS = ["primary", "secondary", "tertiary", "primary"];

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ─── Reusable Card Component ─── */
function ProfileCard({ name, location, price, rating, img, accentClass = "text-[#702ae1]", hoverShadow = "hover:shadow-[0_20px_50px_rgba(112,42,225,0.15)]", btnHoverBg = "group-hover:bg-[#702ae1]" }: {
  name: string; location: string; price: string; rating: string; img: string;
  accentClass?: string; hoverShadow?: string; btnHoverBg?: string;
}) {
  return (
    <div className={`group bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-4 ${hoverShadow} cursor-pointer`}>
      <div className="relative h-64">
        <img alt={name} className="w-full h-full object-cover" src={img} />
        <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Available Now</div>
      </div>
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-newsreader italic text-xl font-bold">{name}</h4>
            <p className="text-[#5a5c5c] text-xs font-bold uppercase tracking-widest mt-1 opacity-60">{location}</p>
          </div>
          <div className={`flex items-center text-sm font-bold ${accentClass}`}>
            <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>star</span> {rating}
          </div>
        </div>
        <div className="pt-4 flex justify-between items-center border-t border-[#dbdddd]/30">
          <span className="text-xl font-bold">{price}<span className="text-xs text-[#5a5c5c] font-medium">/hr</span></span>
          <button className={`w-10 h-10 rounded-full bg-[#f0f1f1] flex items-center justify-center text-[#702ae1] ${btnHoverBg} group-hover:text-white transition-colors`}>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Index Page ─── */
const Index = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigateTo = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Search Bar State
  const [whereInput, setWhereInput] = useState("");
  const [isWhereOpen, setIsWhereOpen] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isWhenOpen, setIsWhenOpen] = useState(false);
  const whereRef = useRef<HTMLDivElement>(null);
  const whenRef = useRef<HTMLDivElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await supabase.from('studios').select('city').eq('is_approved', true).eq('is_active', true);
      if (data) {
        const uniqueCities = [...new Set(data.map(s => s.city))].filter(Boolean).sort();
        setCities(uniqueCities as string[]);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (whereRef.current && !whereRef.current.contains(target)) setIsWhereOpen(false);
      if (whenRef.current && !whenRef.current.contains(target)) setIsWhenOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const handleSearchSubmit = () => {
    navigateTo(`/studios?city=${encodeURIComponent(whereInput)}`);
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigateTo(`/studios?search=${encodeURIComponent(navSearchQuery.trim())}`);
    }
  };

  // Supabase trending data
  const [trendingStudios, setTrendingStudios] = useState<any[]>([]);
  const [trendingEditors, setTrendingEditors] = useState<any[]>([]);
  const [trendingVideographers, setTrendingVideographers] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const [studiosRes, editorsRes, videographersRes] = await Promise.all([
        getTrendingStudios(),
        getTrendingProfessionals("editor"),
        getTrendingProfessionals("videographer"),
      ]);
      setTrendingStudios(studiosRes.data || []);
      setTrendingEditors(editorsRes.data || []);
      setTrendingVideographers(videographersRes.data || []);
      setLoadingTrending(false);
    };
    fetchTrending();
  }, []);

  return (
    <div className="silver-shimmer-bg text-[#2d2f2f] overflow-x-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      {/* Silver Sparkle Noise Layer */}
      <div className="silver-sparkle-noise" />
      {/* Grain Overlay */}
      <div className="fixed inset-0 grain-overlay z-[60] pointer-events-none" />

      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 w-full z-[100] bg-[rgba(226,226,228,0.92)] backdrop-blur-2xl flex justify-between items-center px-[30px] py-[20px] h-[80px] max-w-full border-b border-[rgba(0,0,0,0.06)]">
        <Logo size="lg" />
        
        <div className="hidden md:flex gap-[20px] text-[18px] font-bold tracking-tight h-full items-center px-4">
          <a className="text-[#000000] font-bold underline decoration-2 underline-offset-4 transition-colors whitespace-nowrap" href="#hero">Home</a>
          <a className="text-[#6B46C1] hover:text-[#000000] transition-colors whitespace-nowrap" href="#find-best-studios">About Us</a>
          <div
            className="relative h-full flex items-center group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="text-[#6B46C1] group-hover:text-[#000000] transition-colors flex items-center gap-1 whitespace-nowrap">
              Services <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full -left-20 w-[420px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 flex flex-row gap-8">
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[2px] text-violet-600 mb-4">I Want to Find</p>
                  <div className="space-y-4">
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/studios'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Studio Space</p>
                      <p className="text-[11px] text-gray-500 font-medium">Creative havens for rent</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/professionals?type=videographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Videographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Professional video creators</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/professionals?type=photographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Photographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Expert lens professionals</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/professionals?type=editor'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Editor</p>
                      <p className="text-[11px] text-gray-500 font-medium">Post-production experts</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[2px] text-cyan-600 mb-4">I Want to List</p>
                  <div className="space-y-4">
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/register/list-studio'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">List Studio Space</p>
                      <p className="text-[11px] text-gray-500 font-medium">Monetize your creative studio</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/professionals/register?type=videographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">As a Videographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Offer your video services</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/professionals/register?type=photographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">As a Photographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Offer your photography</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/register/list-equipment'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">List Equipment</p>
                      <p className="text-[11px] text-gray-500 font-medium">Rent out your gear</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <a className="text-[#6B46C1] hover:text-[#000000] transition-colors cursor-pointer whitespace-nowrap" onClick={() => navigateTo('/influencer-discovery')}>Influencer Discovery</a>
          <a className="text-[#6B46C1] hover:text-[#000000] transition-colors whitespace-nowrap" href="#footer">Contact Us</a>

          {/* ═══ NAVBAR SEARCH BAR ═══ */}
          <form onSubmit={handleNavSearchSubmit} className="ml-[10px] flex items-center bg-[#FFFFFF] rounded-[20px] border border-[#CCCCCC] pl-[12px] pr-[5px] h-[40px] w-[200px] shrink-0">
            <input 
              type="text" 
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              placeholder="Search your studio" 
              className="bg-transparent border-none outline-none text-[14px] w-full text-[#555555] placeholder:text-[#CCCCCC]"
            />
            <button type="submit" className="w-[30px] h-[30px] rounded-full bg-[#6B46C1] text-white flex items-center justify-center shrink-0 cursor-pointer">
              <Search className="w-[14px] h-[14px]" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-[15px] shrink-0">
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 bg-white/80 border border-[rgba(124,58,237,0.2)] rounded-full pl-4 pr-2 py-2 hover:border-[#7C3AED] transition-all"
              >
                <span className="text-[15px] font-bold text-[#0A0A1A] whitespace-nowrap">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#702ae1] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl p-3 z-[400]">
                  <div className="px-3 py-2 mb-1 border-b border-gray-100">
                    <p className="text-sm font-bold text-[#0A0A1A] truncate">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate capitalize">{profile?.role?.replace('_', ' ') || 'Member'}</p>
                  </div>
                  <button
                    onClick={() => { navigateTo(profile?.role === 'studio_owner' ? '/dashboard/owner' : '/dashboard/creator'); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-[#0A0A1A] hover:bg-violet-50 hover:text-[#7C3AED] transition-colors"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigateTo('/signin')} className="text-[#0A0A1A] font-bold text-[18px] px-3 py-2 hover:opacity-70 transition-opacity whitespace-nowrap">Sign In</button>
              <button onClick={() => navigateTo('/signup')} className="bg-gradient-to-r from-[#702ae1] to-[#006576] text-white px-6 py-2.5 rounded-full font-bold text-[18px] hover:shadow-[0_8px_20px_rgba(112,42,225,0.3)] hover:-translate-y-0.5 transition-all whitespace-nowrap">
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen pt-[90px] pb-10 px-6 md:px-12 flex flex-col items-center overflow-visible" id="hero">
        
        {/* 1. Shapes (Full Width, Top) */}
        <div className="w-full overflow-hidden mb-8 z-10 py-4">
          <div className="showcase-gallery">
            {[...SHOWCASE_VIDEOS, ...SHOWCASE_VIDEOS].map((src, idx) => (
              <div key={idx} className="showcase-shape shrink-0 relative group">
                <div className={`gradient-fill ${SHAPE_GRADIENTS[idx % SHAPE_GRADIENTS.length]}`} />
                {src && (
                  <video autoPlay className="absolute inset-0 w-full h-full object-cover rounded-[32px]" loop muted playsInline>
                    <source src={src} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Content Container (Two Column Layout Below Shapes) */}
        <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 z-20">
          
          {/* Left Side: Tag + Heading */}
          <div className="flex-1 text-left lg:pt-2">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#EBE4FF] text-[#6B46C1] text-[12px] font-black uppercase tracking-[2px] mb-6 shadow-sm">
              #Built for creators and brands
            </div>
            <h1 className="text-[48px] md:text-[58px] lg:text-[64px] font-bold text-[#0A0A1A] leading-[1.1] tracking-tight mb-6" style={{ fontFamily: '"Newsreader", serif' }}>
              Elevate your content game with <span className="italic">CreatorsHub</span>
            </h1>
          </div>

          {/* Right Side: Airbnb-style Search Bar */}
          <div className="flex-1 w-full flex flex-col lg:items-end justify-center lg:pt-12">
            <div className="w-full max-w-[500px] relative" style={{ fontFamily: '"Manrope", sans-serif' }}>
              <div className="flex items-center bg-white/95 rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E5E7EB] h-[56px] w-full relative">
                
                {/* Where Section */}
                <div ref={whereRef} className="flex-1 h-full border-r border-[#E5E7EB] relative group">
                  <button onClick={() => setIsWhereOpen(!isWhereOpen)} className="w-full h-full text-left flex flex-col justify-center px-5 hover:bg-gray-50/80 transition-colors rounded-l-[12px]">
                    <span className="text-[11px] font-black text-[#0A0A1A] uppercase tracking-wider leading-tight mb-0.5">Where</span>
                    <span className={`text-[13px] truncate w-full leading-tight font-bold ${whereInput ? 'text-[#0A0A1A]' : 'text-[#9CA3AF]'}`}>{whereInput || 'Search studios'}</span>
                  </button>
                  {isWhereOpen && (
                    <div className="absolute top-[110%] left-0 w-[300px] bg-white border border-[#E5E7EB] rounded-[16px] shadow-2xl p-4 z-50 max-h-[280px] overflow-y-auto">
                      <p className="text-[10px] font-black text-[#9CA3AF] mb-2 px-2 uppercase tracking-widest">Suggested Cities</p>
                      {cities.map((city) => (
                        <button 
                          key={city} 
                          onClick={() => { setWhereInput(city); setIsWhereOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[10px] hover:bg-violet-50 transition-colors text-left group/city"
                        >
                          <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover/city:text-violet-600" />
                          <span className="text-[14px] font-bold text-[#0A0A1A] group-hover/city:text-violet-700">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* When Section */}
                <div ref={whenRef} className="flex-[0.7] h-full border-r border-[#E5E7EB] group">
                  <button onClick={() => setIsWhenOpen(!isWhenOpen)} className="w-full h-full text-left flex flex-col justify-center px-5 hover:bg-gray-50/80 transition-colors">
                    <span className="text-[11px] font-black text-[#0A0A1A] uppercase tracking-wider leading-tight mb-0.5">When</span>
                    <span className={`text-[13px] truncate w-full leading-tight font-bold ${selectedDate ? 'text-[#0A0A1A]' : 'text-[#9CA3AF]'}`}>{selectedDate ? selectedDate.toLocaleDateString() : 'Add dates'}</span>
                  </button>
                  {isWhenOpen && (
                    <div className="absolute top-[120%] left-1/2 -translate-x-1/2 bg-white/100 border border-[#E5E7EB] rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] p-4 z-[1000] animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
                      <div className="relative z-10 bg-white rounded-xl shadow-inner">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => { setSelectedDate(date); setIsWhenOpen(false); }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className="bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button 
                  onClick={handleSearchSubmit}
                  className="w-[56px] h-full bg-[#6B46C1] text-white flex items-center justify-center hover:bg-[#5A39A8] transition-all rounded-r-[12px] shrink-0 cursor-pointer"
                >
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
              <p className="mt-4 text-[16px] text-[#555555] font-medium text-center lg:text-right px-2 leading-relaxed">
                Find inspiring studios, expert videographers, and professional gear—all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══ FIND YOUR VIBE ═══ */}
      <section className="relative py-[80px] px-6 overflow-hidden" id="find-your-vibe">
        <div className="max-w-[1000px] mx-auto flex flex-col items-center relative z-10">
          
          {/* Heading */}
          <div className="flex flex-col items-center mb-[30px] text-center">
            <h2 className="text-[48px] md:text-[64px] font-bold text-[#000000] tracking-tight leading-none mb-[16px]" style={{ fontFamily: '"Newsreader", serif' }}>
              Find your vibe.
            </h2>
            
            {/* Sparkle Separator */}
            <div className="flex items-center gap-[12px]">
              <div className="w-[60px] h-[1.5px] bg-[#6B46C1]/30"></div>
              <Sparkles className="w-[18px] h-[18px] text-[#6B46C1] fill-[#6B46C1]/20" />
              <div className="w-[60px] h-[1.5px] bg-[#6B46C1]/30"></div>
            </div>
          </div>

          {/* Show both cards if not logged in, or just the relevant one based on role */}
          <div className={`w-full gap-[30px] place-items-center items-start ${
            !user || (profile?.role !== 'creator' && profile?.role !== 'studio_owner')
              ? 'grid md:grid-cols-2'
              : 'flex justify-center'
          }`}>
            
            {/* Card 1: I Want to Find — shown to guests and creators */}
            {(!user || profile?.role === 'creator') && (
            <div className="w-full max-w-[420px] bg-[#FFFFFF] rounded-[24px] p-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
              <div className="mb-[24px]">
                <h3 className="font-newsreader italic text-[28px] font-bold text-[#0A0A1A] mb-[12px]">I Want to Find</h3>
                <div className="w-[30px] h-[2.5px] bg-[#6B46C1] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                {[
                  { icon: Home, label: "Studio Space", path: "/studios" },
                  { icon: Video, label: "Videographer", path: "/professionals?type=videographer" },
                  { icon: Clapperboard, label: "Video Editor", path: "/professionals?type=editor" },
                  { icon: Briefcase, label: "Casting Equipment", path: "/equipment" },
                ].map((item, idx) => (
                  <div key={item.label} onClick={() => navigateTo(item.path)} className={`group/item flex items-center justify-between py-[18px] ${idx !== 3 ? 'border-b border-[#F3F4F6]' : ''} cursor-pointer hover:bg-gray-50/50 transition-colors -mx-3 px-3 rounded-[12px]`}>
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[44px] h-[44px] rounded-[10px] bg-[#EBE4FF] flex items-center justify-center shrink-0">
                        <item.icon className="w-[20px] h-[20px] text-[#6B46C1] stroke-[2.5]" />
                      </div>
                      <span className="font-manrope font-[800] text-[17px] text-[#000000] tracking-tight">{item.label}</span>
                    </div>
                    <div className="w-[28px] h-[28px] rounded-full bg-[#F3E8FF] flex items-center justify-center group-hover/item:bg-[#6B46C1] transition-colors">
                      <ArrowRight className="w-[14px] h-[14px] text-[#6B46C1] group-hover/item:text-white transition-colors stroke-[2.5]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Card 2: I Want to List — shown to guests and studio owners */}
            {(!user || profile?.role === 'studio_owner') && (
            <div className="w-full max-w-[420px] bg-[#FFFFFF] rounded-[24px] p-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#F3F4F6]">
              <div className="mb-[24px]">
                <h3 className="font-newsreader italic text-[28px] font-bold text-[#0A0A1A] mb-[12px]">I Want to List</h3>
                <div className="w-[30px] h-[2.5px] bg-[#2D9B87] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                {[
                  { icon: Home, label: "Studio", path: "/register/list-studio" },
                  { icon: Video, label: "List as Videographer", path: "/professionals/register?type=videographer" },
                  { icon: Clapperboard, label: "List as Video Editor", path: "/professionals/register?type=editor" },
                  { icon: Briefcase, label: "Rent my Equipment", path: "/register/list-equipment" },
                ].map((item, idx) => (
                  <div key={item.label} onClick={() => navigateTo(item.path)} className={`group/item flex items-center justify-between py-[18px] ${idx !== 3 ? 'border-b border-[#F3F4F6]' : ''} cursor-pointer hover:bg-gray-50/50 transition-colors -mx-3 px-3 rounded-[12px]`}>
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[44px] h-[44px] rounded-[10px] bg-[#E6F8F5] flex items-center justify-center shrink-0">
                        <item.icon className="w-[20px] h-[20px] text-[#2D9B87] stroke-[2.5]" />
                      </div>
                      <span className="font-manrope font-[800] text-[17px] text-[#000000] tracking-tight">{item.label}</span>
                    </div>
                    <div className="w-[28px] h-[28px] rounded-full bg-[#E6F8F5] flex items-center justify-center group-hover/item:bg-[#2D9B87] transition-colors">
                      <ArrowRight className="w-[14px] h-[14px] text-[#2D9B87] group-hover/item:text-white transition-colors stroke-[2.5]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

          </div>
        </div>
      </section>

      {/* ═══ FIND THE BEST STUDIO SPACES (REDESIGNED ABOUT US - COMPACT & HIGH CONTRAST) ═══ */}
      <section className="relative py-12 px-6 md:px-10 overflow-hidden" id="find-best-studios">
        <div className="max-w-[1100px] mx-auto">
          
          {/* Top Row: Stats (More Compact) */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 bg-white/60 backdrop-blur-md rounded-[24px] p-6 md:p-8 border border-white/80 shadow-sm">
            {[
              { icon: Users, val: "+50", unit: "K", label: "Creators" },
              { icon: Building2, val: "+12", unit: "K", label: "Studios" },
              { icon: Smile, val: "98", unit: "%", label: "Satisfaction" },
              { icon: CalendarDays, val: "+20", unit: "K", label: "Bookings" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBE4FF] flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-[#6B46C1]" />
                </div>
                <div className="flex flex-col">
                  <div className="font-bold text-[28px] md:text-[32px] tracking-tight leading-none" style={{ fontFamily: '"Newsreader", serif' }}>
                    <span className="text-[#000000]">{stat.val}</span>
                    <span className="text-[#6B46C1] text-[18px] md:text-[20px] ml-0.5">{stat.unit}</span>
                  </div>
                  <p className="font-manrope font-black text-[13px] text-[#000000]/60 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Layout: Image Left, Text Right (Compact) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left Column: User Provided Image */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7C3AED]/10 to-[#06B6D4]/10 blur-xl opacity-50" />
              <div className="relative rounded-[32px] overflow-hidden shadow-xl border-2 border-white">
                <img 
                  src="/studio-shoot.jpg" 
                  alt="Studio Shoot" 
                  className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: About Us Content (High Contrast) */}
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="font-newsreader text-[44px] md:text-[56px] font-bold text-[#000000] leading-tight ml-2">About Us</h3>
                {/* Creative Separator */}
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-12 h-[2px] bg-[#6B46C1]"></div>
                  <Sparkles className="w-5 h-5 text-[#6B46C1] fill-[#6B46C1]/10" />
                  <div className="w-24 h-[2px] bg-[#6B46C1]/30"></div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8">
                <p className="text-[18px] md:text-[20px] text-[#000000] font-bold leading-relaxed">
                  CreatorsHub is a marketplace where Creators and Brands find the best ecosystem for the Brand and Content Shoots.
                </p>

                <div className="space-y-6">
                  <h4 className="text-[18px] font-black text-[#4C1D95] uppercase tracking-[2px]" style={{ fontFamily: '"Manrope", sans-serif' }}>WHY CHOOSE US</h4>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Find premium Studios in one Click", desc: "Access elite creative spaces instantly.", icon: <Sparkles className="w-4 h-4" /> },
                      { title: "Find the best Videographers and Editors", desc: "Connect with verified professionals in town.", icon: <Rocket className="w-4 h-4" /> },
                      { title: "Transparent pricing with no hidden costs", desc: "Honest booking without any surprises.", icon: <Smile className="w-4 h-4" /> },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-5 group">
                        <div className="w-11 h-11 rounded-2xl bg-[#EBE4FF] border border-[#EBE4FF] flex items-center justify-center shrink-0 text-[#6B46C1] group-hover:bg-[#6B46C1] group-hover:text-white transition-all duration-300">
                          {item.icon}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[17px] font-black text-[#000000] group-hover:text-[#6B46C1] transition-colors">{item.title}</p>
                          <p className="text-[15px] text-[#000000]/70 font-bold leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => navigateTo('/studios')}
                    className="w-full md:w-auto px-10 py-4 rounded-full bg-[#000000] text-white font-black text-[15px] hover:bg-[#6B46C1] hover:shadow-[0_15px_30px_rgba(107,70,193,0.3)] transition-all"
                  >
                    Explore Marketplace
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ TRENDING STUDIOS ═══ */}
      <section className="py-32 px-6 md:px-8" id="studios">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-6xl font-bold mb-16 text-[#000000]" style={{ fontFamily: '"Newsreader", serif' }}>
            Trending <span className="italic">Studios</span>
          </h2>
          {loadingTrending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-96 rounded-[2rem] bg-white animate-pulse" />)}
            </div>
          ) : trendingStudios.length === 0 ? (
            <div className="text-center py-16"><p className="text-[#5a5c5c] text-lg">No studios listed yet — be the first!</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingStudios.map((s: any, idx: number) => {
                const color = COLORS[idx % 4];
                return (
                  <div key={s.id} onClick={() => navigateTo(`/studio/${s.id}`)} className="cursor-pointer">
                    <ProfileCard
                      name={s.name}
                      location={`${s.area || ''}, ${s.city || ''}`}
                      price={`₹${(s.price_per_hour || 0).toLocaleString()}`}
                      rating="—"
                      img={s.photos?.[0] || `https://picsum.photos/seed/${s.id}/600/400`}
                      accentClass={color === "secondary" ? "text-[#006576]" : color === "tertiary" ? "text-[#b00d6a]" : "text-[#702ae1]"}
                      hoverShadow={color === "secondary" ? "hover:shadow-[0_20px_50px_rgba(0,101,118,0.15)]" : color === "tertiary" ? "hover:shadow-[0_20px_50px_rgba(176,13,106,0.15)]" : "hover:shadow-[0_20px_50px_rgba(112,42,225,0.15)]"}
                      btnHoverBg={color === "secondary" ? "group-hover:bg-[#006576]" : color === "tertiary" ? "group-hover:bg-[#b00d6a]" : "group-hover:bg-[#702ae1]"}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ TRENDING EDITORS ═══ */}
      <section className="py-32 px-6 md:px-8" id="editors">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-6xl font-bold mb-16 text-[#000000]" style={{ fontFamily: '"Newsreader", serif' }}>
            <span className="font-black">Trending</span> <span className="italic">Editors</span>
          </h2>
          {loadingTrending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-96 rounded-[2rem] bg-white animate-pulse border border-gray-100" />)}
            </div>
          ) : trendingEditors.length === 0 ? (
            <div className="text-center py-16"><p className="text-[#5a5c5c] text-lg">No editors registered yet — join the platform!</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingEditors.map((e: any) => (
                <ProfileCard key={e.id} name={e.profiles?.full_name || 'Editor'} location={e.profiles?.location || 'Remote'} price={`₹${(e.price_per_hour || 0).toLocaleString()}`} rating="—" img={e.profiles?.avatar_url || `https://picsum.photos/seed/${e.id}/600/400`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ TRENDING VIDEOGRAPHERS ═══ */}
      <section className="py-32 px-6 md:px-8" id="videographers">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-6xl font-bold mb-16 text-[#000000]" style={{ fontFamily: '"Newsreader", serif' }}>
            <span className="font-black">Trending</span> <span className="italic">Videographers</span>
          </h2>
          {loadingTrending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-96 rounded-[2rem] bg-white animate-pulse border border-gray-100" />)}
            </div>
          ) : trendingVideographers.length === 0 ? (
            <div className="text-center py-16"><p className="text-[#5a5c5c] text-lg">No videographers registered yet — be the first!</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingVideographers.map((v: any) => (
                <ProfileCard key={v.id} name={v.profiles?.full_name || 'Videographer'} location={v.profiles?.location || 'Remote'} price={`₹${(v.price_per_hour || 0).toLocaleString()}`} rating="—" img={v.profiles?.avatar_url || `https://picsum.photos/seed/${v.id}/600/400`} hoverShadow="hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)]" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer id="footer" className="w-full py-20 px-6 md:px-12 mt-20 bg-[#07070E] text-white" style={{ borderTop: '2px solid transparent', borderImage: 'linear-gradient(to right, #702ae1, #06B6D4, #b00d6a) 1' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="font-newsreader text-2xl font-black text-white">CreatorsHub</div>
            <p className="text-gray-400 text-sm leading-relaxed">The premier destination for creative minds to find and book unique studio spaces worldwide.</p>
          </div>
          <div className="space-y-6">
            <h4 className="font-newsreader italic text-xl">Platform</h4>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <a className="hover:text-cyan-400 transition-colors" href="#">Browse Spaces</a>
              <a className="hover:text-cyan-400 transition-colors" href="#">Membership</a>
              <a className="hover:text-cyan-400 transition-colors" href="#">Creators Hub</a>
              <a className="hover:text-cyan-400 transition-colors" href="#">Workshops</a>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-newsreader italic text-xl">Resources</h4>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <a className="hover:text-cyan-400 transition-colors" href="#">Terms</a>
              <a className="hover:text-cyan-400 transition-colors" href="#">Privacy</a>
              <a className="hover:text-cyan-400 transition-colors" href="#">Press</a>
              <a className="hover:text-cyan-400 transition-colors" href="#">Contact</a>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-newsreader italic text-xl">Connect</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-cyan-400 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-cyan-400 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">share</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 border-t border-gray-800 text-center text-xs text-gray-500 uppercase tracking-widest">
          © 2024 CreatorsHub. Kinetic Energy for the Digital Native.
        </div>
      </footer>
    </div>
  );
};

export default Index;
