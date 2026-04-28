import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTrendingStudios, getTrendingProfessionals } from "@/services/supabase-service";

const CAROUSEL_VIDEOS = [
  "https://res.cloudinary.com/drulic8e0/video/upload/v1776249407/14478811_1080_1920_30fps_e1w0ct.mp4",
  "https://res.cloudinary.com/drulic8e0/video/upload/v1776798751/15628135_1080_1920_30fps_fhqzwv.mp4",
  "https://res.cloudinary.com/drulic8e0/video/upload/v1776798733/15422875_1080_1920_30fps_dnzlsc.mp4",
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
  const [carouselIdx, setCarouselIdx] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigateTo = useNavigate();

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


  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const getCardClass = useCallback(
    (idx: number) => {
      const centerIdx = carouselIdx;
      const leftIdx = (carouselIdx + 2) % 3;
      const rightIdx = (carouselIdx + 1) % 3;
      if (idx === centerIdx) return "carousel-card card-center pulsing-glow";
      if (idx === leftIdx) return "carousel-card card-side card-left";
      if (idx === rightIdx) return "carousel-card card-side card-right";
      return "carousel-card card-side";
    },
    [carouselIdx]
  );

  return (
    <div className="bg-[#f6f6f6] text-[#2d2f2f] overflow-x-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      {/* Grain Overlay */}
      <div className="fixed inset-0 grain-overlay z-[60] pointer-events-none" />

      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[rgba(255,255,255,0.88)] backdrop-blur-2xl flex justify-between items-center px-6 md:px-12 h-[72px] max-w-full border-b border-gray-100">
        <a className="font-newsreader italic text-2xl font-bold text-[#0A0A1A] logo-shimmer transition-all" href="#hero">CreatorsBNB</a>
        <div className="hidden md:flex gap-10 text-[15px] font-bold tracking-tight h-full items-center">
          <a className="text-[#0A0A1A] hover:text-[#702ae1] transition-colors" href="#hero">Home</a>
          <a className="text-[#0A0A1A] hover:text-[#702ae1] transition-colors" href="#about">About Us</a>
          <div
            className="relative h-full flex items-center group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="text-[#0A0A1A] group-hover:text-[#702ae1] transition-colors flex items-center gap-1">
              Services <span className="material-symbols-outlined text-[18px]">expand_more</span>
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
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/studios/list'); }}>
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
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigateTo('/equipment/list'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">List Equipment</p>
                      <p className="text-[11px] text-gray-500 font-medium">Rent out your gear</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <a className="text-[#0A0A1A] hover:text-[#702ae1] transition-colors" href="#contact">Contact Us</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('/signin')} className="text-[#0A0A1A] font-bold text-[14px] px-5 py-2 hover:opacity-70 transition-opacity">Sign In</button>
          <button onClick={() => navigateTo('/signup')} className="bg-gradient-to-r from-[#702ae1] to-[#006576] text-white px-7 py-2.5 rounded-full font-bold text-[14px] hover:shadow-[0_8px_20px_rgba(112,42,225,0.3)] hover:-translate-y-0.5 transition-all">
            Sign Up
          </button>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen pt-32 pb-20 px-6 md:px-8 bg-white flex flex-col md:flex-row items-center overflow-hidden" id="hero">
        {/* Neon Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#702ae1] opacity-20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 -left-24 w-96 h-96 bg-[#006576] opacity-20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#b00d6a] opacity-10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full md:w-1/2 z-10 space-y-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-[#702ae1]/20 text-xs font-bold tracking-widest uppercase">
            <span className="mr-2">✦</span>
            <span className="bg-gradient-to-r from-[#702ae1] to-[#b00d6a] bg-clip-text text-transparent">For Creators. Built Different.</span>
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-extrabold leading-[1.1] tracking-tight" style={{ fontFamily: '"Newsreader", serif' }}>
            Your Creative <br />
            <span className="italic neon-gradient-text">Space,</span> <br />
            On Demand.
          </h1>
          <p className="text-[#5a5c5c] max-w-[460px] text-lg leading-relaxed" style={{ fontFamily: '"Manrope", sans-serif' }}>
            Unlock high-end production environments. From minimalist editorial lofts to neon-drenched sound stages, find your next masterpiece's birthplace.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={() => navigateTo('/studios')} className="px-8 py-4 rounded-full bg-gradient-to-r from-[#702ae1] to-[#006576] text-white font-bold text-lg hover:scale-105 transition-all duration-300 neon-pulse-shadow group flex items-center">
              Find a Studio <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button onClick={() => navigateTo('/register/list-studio')} className="px-8 py-4 rounded-full border-2 border-[#acadad]/30 font-bold text-lg hover:bg-[#f0f1f1] transition-colors">
              List Your Space
            </button>
          </div>
          <div className="flex gap-12 pt-8" id="about">
            <div className="space-y-1">
              <p className="font-headline italic text-3xl font-bold bg-gradient-to-br from-[#702ae1] to-[#006576] bg-clip-text text-transparent" style={{ fontFamily: '"Newsreader", serif' }}>12K+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#5a5c5c] opacity-60">Studios</p>
            </div>
            <div className="space-y-1">
              <p className="font-headline italic text-3xl font-bold bg-gradient-to-br from-[#702ae1] to-[#b00d6a] bg-clip-text text-transparent" style={{ fontFamily: '"Newsreader", serif' }}>50K+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#5a5c5c] opacity-60">Creators</p>
            </div>
            <div className="space-y-1">
              <p className="font-headline italic text-3xl font-bold bg-gradient-to-br from-[#006576] to-[#b00d6a] bg-clip-text text-transparent" style={{ fontFamily: '"Newsreader", serif' }}>98%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#5a5c5c] opacity-60">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Hero Right: Asymmetric Video Carousel */}
        <div className="w-full md:w-1/2 relative mt-20 md:mt-0 flex flex-col justify-center items-center overflow-visible min-h-[550px]">
          <div className="absolute inset-0 dot-grid opacity-30 z-0 pointer-events-none" />
          <div className="carousel-container z-10">
            {CAROUSEL_VIDEOS.map((src, idx) => (
              <div key={idx} className={getCardClass(idx)}>
                <video autoPlay className="w-full h-full object-cover" loop muted playsInline>
                  <source src={src} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
          {/* Progress Dots */}
          <div className="flex gap-3 mt-12">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === carouselIdx
                    ? "w-8 h-2 bg-[#702ae1]"
                    : "w-2 h-2 bg-white border border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FIND YOUR VIBE ═══ */}
      <section className="relative py-32 px-6 md:px-8 bg-[#f6f6f6] overflow-hidden" id="services">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#702ae1] to-transparent opacity-50 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-[#702ae1]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-5xl font-bold mb-16 text-center" style={{ fontFamily: '"Newsreader", serif' }}>
            <span className="font-black text-6xl text-[#0A0A1A]">Find your</span>{" "}
            <span className="italic neon-gradient-text text-6xl">vibe.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: I Want to Find */}
            <div className="group relative bg-[#F8F8FC] p-12 rounded-[2.5rem] overflow-hidden border border-[#702ae1]/5 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-[#702ae1]/10">
              <div className="relative z-10">
                <h3 className="font-newsreader italic text-5xl font-bold text-[#7C3AED] mb-8">I Want to Find</h3>
                <div className="space-y-6">
                  {[
                    { icon: "camera_indoor", label: "Studio Space", path: "/studios" },
                    { icon: "videocam", label: "Videographer", path: "/professionals?type=videographer" },
                    { icon: "movie_edit", label: "Editor", path: "/professionals?type=editor" },
                    { icon: "home_repair_service", label: "Equipment", path: "/equipment" },
                  ].map((item) => (
                    <div key={item.label} onClick={() => navigateTo(item.path)} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white transition-colors cursor-pointer">
                      <div className="w-14 h-14 rounded-2xl bg-[#b28cff] flex items-center justify-center text-[#702ae1]">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <span className="text-xl font-semibold text-[#0A0A1A]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Card 2: I Want to List */}
            <div className="group relative bg-[#F8F8FC] p-12 rounded-[2.5rem] overflow-hidden border border-[#006576]/5 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-[#006576]/10">
              <div className="relative z-10">
                <h3 className="font-newsreader italic text-5xl font-bold text-[#06B6D4] mb-8">I Want to List</h3>
                <div className="space-y-6">
                  {[
                    { icon: "add_business", label: "List My Studio", path: "/register/list-studio" },
                    { icon: "person_add", label: "Offer Videography", path: "/professionals/register?type=videographer" },
                    { icon: "edit_square", label: "Offer Editing", path: "/professionals/register?type=editor" },
                    { icon: "inventory_2", label: "Rent Out Equipment", path: "/register/list-equipment" },
                  ].map((item) => (
                    <div key={item.label} onClick={() => navigateTo(item.path)} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white transition-colors cursor-pointer">
                      <div className="w-14 h-14 rounded-2xl bg-[#65e1ff] flex items-center justify-center text-[#006576]">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <span className="text-xl font-semibold text-[#0A0A1A]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRENDING STUDIOS ═══ */}
      <section className="py-32 px-6 md:px-8 bg-[#F8F8FC]" id="studios">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-6xl font-bold mb-16" style={{ fontFamily: '"Newsreader", serif' }}>
            Trending <span className="italic text-[#702ae1]">Studios</span>
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
      <section className="py-32 px-6 md:px-8 bg-white" id="editors">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-6xl font-bold mb-16" style={{ fontFamily: '"Newsreader", serif' }}>
            <span className="font-black">Trending</span> <span className="italic text-[#7C3AED]">Editors</span>
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
      <section className="py-32 px-6 md:px-8 bg-[#F8F8FC]" id="videographers">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-6xl font-bold mb-16" style={{ fontFamily: '"Newsreader", serif' }}>
            <span className="font-black">Trending</span> <span className="italic text-[#06B6D4]">Videographers</span>
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

      {/* ═══ CTA BANNER ═══ */}
      <section className="relative px-6 md:px-8 pb-32" id="contact">
        <div className="max-w-7xl mx-auto rounded-[3rem] p-12 md:p-24 relative overflow-hidden bg-gradient-to-br from-[#702ae1] via-[#006576] to-[#b00d6a]">
          <div className="relative z-10 text-center space-y-10">
            <h2 className="font-headline italic text-5xl md:text-8xl font-bold text-white tracking-tight" style={{ fontFamily: '"Newsreader", serif' }}>
              Ready to take the stage?
            </h2>
            <div className="flex justify-center">
              <button className="px-10 py-5 rounded-full bg-white text-lg font-bold hover:scale-110 transition-transform shadow-2xl flex items-center group">
                <span className="bg-gradient-to-r from-[#702ae1] to-[#006576] bg-clip-text text-transparent">Get Started Free</span>
                <span className="ml-2 text-[#702ae1] group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
          {/* Decorative pulses */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="w-full py-20 px-6 md:px-12 mt-20 bg-[#07070E] text-white" style={{ borderTop: '2px solid transparent', borderImage: 'linear-gradient(to right, #702ae1, #06B6D4, #b00d6a) 1' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="font-newsreader text-2xl font-black text-white">CreatorsBNB</div>
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
          © 2024 CreatorsBNB. Kinetic Energy for the Digital Native.
        </div>
      </footer>
    </div>
  );
};

export default Index;
