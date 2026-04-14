import { Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import modernLoft from "@/assets/modern-loft.jpg";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4";

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

          {/* Right side — video card */}
          <div className="relative flex items-center justify-center">
            {/* Decorative glow behind the card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-[hsl(199,89%,48%)]/10 blur-2xl opacity-60" />

            {/* Video card — desktop */}
            <div className="relative hidden lg:block w-full max-w-[480px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-border/40 bg-card">
              <video
                className="w-full h-auto aspect-video object-cover"
                src={HERO_VIDEO_URL}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>

            {/* Static image fallback — mobile/tablet */}
            <div className="relative block lg:hidden w-full max-w-[480px] rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.1)] border border-border/40 bg-card">
              <img
                src={modernLoft}
                alt="Creative studio space"
                className="w-full h-auto aspect-video object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
