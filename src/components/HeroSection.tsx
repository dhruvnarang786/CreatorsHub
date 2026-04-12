import { Play, Star, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import videoStudio from "@/assets/video-studio.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto py-14 md:py-20 relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left side */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Find & Book<br />
              Creative Spaces<br />
              in Seconds
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Studios, videographers, editors —<br />
              all in one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" onClick={() => navigate("/explore")}>
                Get Started
              </Button>
              <Button variant="heroOutline" size="lg">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { label: "5,000+", sub: "Spaces" },
                { label: "10k+", sub: "Creators" },
                { label: "1.8M", sub: "Bookings" },
              ].map((stat) => (
                <div key={stat.sub} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{stat.label}</span> {stat.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — layered card composition */}
          <div className="relative hidden min-h-[400px] lg:flex items-center justify-center">
            {/* Podcast Studio — top-left */}
            <div className="absolute z-30 top-2 left-6 w-[210px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden -rotate-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <div className="h-[110px] overflow-hidden">
                <img src={podcastStudio} alt="Podcast Studio" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">🎙️</span>
                    <span className="text-xs font-semibold text-foreground">Podcast Studio</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-[10px] font-medium text-foreground">4.8</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-foreground mt-1 block">
                  $80<span className="text-[10px] font-normal text-muted-foreground">/hr</span>
                </span>
              </div>
            </div>

            {/* Main card — Modern Creative Loft */}
            <div className="relative z-20 w-[270px] rounded-2xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden ml-14 mt-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.14)]">
              <div className="h-[180px] overflow-hidden">
                <img src={modernLoft} alt="Modern Creative Loft" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-foreground">Modern Creative Loft</h4>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Los Angeles, CA</span>
                </div>
                <span className="text-sm font-bold text-foreground mt-2 block">
                  $120<span className="text-xs font-normal text-muted-foreground">/night</span>
                </span>
              </div>
            </div>

            {/* Video Studio — bottom-right */}
            <div className="absolute z-30 bottom-2 right-2 w-[180px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden rotate-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🎬</span>
                  <span className="text-xs font-semibold text-foreground">Video Studio</span>
                </div>
              </div>
              <div className="px-2.5 pb-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  $150<span className="text-[10px] font-normal text-muted-foreground">/hr</span>
                </span>
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-[10px] font-medium text-foreground">4.7</span>
                </div>
              </div>
            </div>

            {/* Depth layer */}
            <div className="absolute z-10 w-[250px] h-[300px] rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 translate-x-10 translate-y-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
