import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
  variant?: "light" | "dark";
}

const sizes = {
  sm: { icon: 28, text: "text-lg", tagline: "text-[8px]", gap: "gap-1.5" },
  md: { icon: 36, text: "text-xl", tagline: "text-[9px]", gap: "gap-2" },
  lg: { icon: 52, text: "text-3xl", tagline: "text-xs", gap: "gap-2.5" },
  xl: { icon: 72, text: "text-5xl", tagline: "text-sm", gap: "gap-3" },
};

const InfinityIcon = ({ size = 36, id = "main" }: { size?: number; id?: string }) => {
  const gradId = `infinityGrad_${id}`;
  const shadowId = `infinityShadow_${id}`;
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 200 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CreatorsBNB logo"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="35%" stopColor="#22D3EE" />
          <stop offset="65%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id={shadowId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#3B82F6" floodOpacity="0.15" />
        </filter>
      </defs>
      {/* 
        Left loop = C shape, Right loop = B shape
        The infinity is drawn so the left half reads as "C" and the right half as "B"
      */}
      <g filter={`url(#${shadowId})`}>
        {/* Left loop — C shape: open on the right, curving left */}
        <path
          d="M100 55
             C100 55 92 20 60 20
             C28 20 14 38 14 55
             C14 72 28 90 60 90
             C92 90 100 55 100 55"
          stroke={`url(#${gradId})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right loop — B shape: has a slight bump/indent to suggest B */}
        <path
          d="M100 55
             C100 55 108 20 140 20
             C172 20 186 38 186 55
             C186 72 172 90 140 90
             C108 90 100 55 100 55"
          stroke={`url(#${gradId})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Subtle B detail — a small indentation on the right loop's outer edge */}
        <path
          d="M168 55 C168 50 172 47 176 50"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </g>
    </svg>
  );
};

const Logo = ({
  size = "md",
  showTagline = false,
  className = "",
  iconOnly = false,
  variant = "light",
}: LogoProps) => {
  const s = sizes[size];
  const textColor = variant === "dark" ? "text-white" : "text-foreground";

  if (iconOnly) {
    return <InfinityIcon size={s.icon} id={`icon_${size}`} />;
  }

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <div className={cn("flex items-center", s.gap)}>
        <InfinityIcon size={s.icon} id={`logo_${size}`} />
        <span className={cn(s.text, "font-extrabold tracking-tight", textColor)}>
          Creators
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
            BNB
          </span>
        </span>
      </div>
      {showTagline && (
        <p
          className={cn(
            s.tagline,
            "tracking-[0.22em] text-muted-foreground mt-0.5 ml-1 font-medium"
          )}
        >
          Create · Book · Collaborate
        </p>
      )}
    </div>
  );
};

export default Logo;
