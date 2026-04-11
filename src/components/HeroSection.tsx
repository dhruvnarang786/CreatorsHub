import { Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import videoStudio from "@/assets/video-studio.jpg";

interface HeroSectionProps {
  onExplore: () => void;
}

/* Large, faded infinity SVG used as a background watermark */
const InfinityWatermark = () => (
  <svg
    className="absolute right-[-5%] top-[-10%] h-[700px] w-[700px] opacity-[0.04] pointer-events-none"
    viewBox="0 0 120 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5BB8E8" />
        <stop offset="50%" stopColor="#6DC8A0" />
        <stop offset="100%" stopColor="#F5A623" />
      </linearGradient>
    </defs>
    <path
      d="M36 16C20 16 8 26 8 36s12 20 28 20c10 0 18-5 24-12 6 7 14 12 24 12 16 0 28-10 28-20S100 16 84 16c-10 0-18 5-24 12C54 21 46 16 36 16z"
      stroke="url(#wmGrad)"
      strokeWidth="6"
      fill="url(#wmGrad)"
    />
  </svg>
);

const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="bg-hero overflow-hidden relative">
      {/* Decorative background elements */}
      <InfinityWatermark />
      <div className="absolute left-[-8%] bottom-[-15%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#5BB8E8]/5 to-[#F5A623]/5 blur-3xl pointer-events-none" />
      <div className="absolute right-[20%] top-[10%] h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#6DC8A0]/5 to-[#5BB8E8]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto py-16 md:py-24 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Built to Your Dream Space
            </div>

            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Unlock Amazing Spaces for Creators
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Discover unique studios, co-working spaces, and production venues tailored for creatives.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={onExplore}>
                Get Started
              </Button>
              <Button variant="heroOutline" size="lg">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 flex gap-8">
              <div>
                <div className="text-2xl font-bold text-foreground">5,000+</div>
                <div className="text-sm text-muted-foreground">Listings Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">12k</div>
                <div className="text-sm text-muted-foreground">Happy Creators</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">1.8M</div>
                <div className="text-sm text-muted-foreground">Bookings Made</div>
              </div>
            </div>
          </div>

          {/* Right side - visual collage */}
          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5BB8E8]/10 via-[#6DC8A0]/10 to-[#F5A623]/10" />

            {/* Main large image */}
            <div className="absolute right-8 top-8 h-56 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <img src={modernLoft} alt="Modern Loft" className="h-full w-full object-cover" width={640} height={512} />
            </div>

            {/* Screenshot card */}
            <div className="absolute bottom-16 left-4 h-48 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="flex h-full flex-col items-center justify-center bg-accent p-4">
                <img src={podcastStudio} alt="Podcast Room" className="h-32 w-full rounded-lg object-cover" loading="lazy" width={640} height={512} />
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  🎙️ Podcast Room
                </div>
              </div>
            </div>

            {/* Bottom right image */}
            <div className="absolute bottom-4 right-4 h-44 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <img src={videoStudio} alt="Video Studio" className="h-32 w-full object-cover" loading="lazy" width={640} height={512} />
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground">
                🎬 Video Studio
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
