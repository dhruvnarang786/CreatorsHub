interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: "text-lg", tagline: "text-[9px]" },
  md: { icon: 40, text: "text-xl", tagline: "text-[10px]" },
  lg: { icon: 56, text: "text-3xl", tagline: "text-xs" },
  xl: { icon: 80, text: "text-5xl", tagline: "text-sm" },
};

const InfinityIcon = ({ size = 40 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.6}
    viewBox="0 0 120 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5BB8E8" />
        <stop offset="30%" stopColor="#6DC8A0" />
        <stop offset="60%" stopColor="#F5A623" />
        <stop offset="100%" stopColor="#F47C48" />
      </linearGradient>
    </defs>
    <path
      d="M36 16C20 16 8 26 8 36s12 20 28 20c10 0 18-5 24-12 6 7 14 12 24 12 16 0 28-10 28-20S100 16 84 16c-10 0-18 5-24 12C54 21 46 16 36 16z"
      stroke="url(#infinityGrad)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* C and B letters subtly integrated */}
    <text x="28" y="42" fontSize="18" fontWeight="700" fill="url(#infinityGrad)" textAnchor="middle" fontFamily="Inter, sans-serif">C</text>
    <text x="92" y="42" fontSize="18" fontWeight="700" fill="url(#infinityGrad)" textAnchor="middle" fontFamily="Inter, sans-serif">B</text>
  </svg>
);

const Logo = ({ size = "md", showTagline = false, className = "" }: LogoProps) => {
  const s = sizes[size];
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-1.5">
        <InfinityIcon size={s.icon} />
        <span className={`${s.text} font-extrabold tracking-tight text-foreground`}>
          Creators<span className="bg-gradient-to-r from-[#5BB8E8] via-[#6DC8A0] to-[#F5A623] bg-clip-text text-transparent">BNB</span>
        </span>
      </div>
      {showTagline && (
        <p className={`${s.tagline} tracking-[0.25em] text-muted-foreground mt-1`}>
          Create. Book. Collaborate. ∞
        </p>
      )}
    </div>
  );
};

export default Logo;
