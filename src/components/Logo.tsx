import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
  variant?: "light" | "dark";
}

const sizes = {
  sm: { icon: 32, text: "text-lg", tagline: "text-[8px]", gap: "gap-1.5" },
  md: { icon: 40, text: "text-xl", tagline: "text-[9px]", gap: "gap-2" },
  lg: { icon: 56, text: "text-3xl", tagline: "text-xs", gap: "gap-2.5" },
  xl: { icon: 80, text: "text-5xl", tagline: "text-sm", gap: "gap-3" },
};

/**
 * CreatorsBNB Infinity Logo
 * Left loop = "C" (open on the right side, like the letter C)
 * Right loop = "B" (closed with a bump/indentation creating two bowls)
 * Smooth continuous stroke with gradient from blue→cyan→amber→orange
 */
const InfinityIcon = ({ size = 40, id = "main" }: { size?: number; id?: string }) => {
  const gradId = `cbGrad_${id}`;
  const shadowId = `cbShadow_${id}`;
  const w = size;
  const h = size * 0.6;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 240 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CreatorsBNB logo"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="30%" stopColor="#22D3EE" />
          <stop offset="55%" stopColor="#6DD8A0" />
          <stop offset="75%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id={shadowId} x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.12" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/*
          The "C" — left loop:
          An open curve that clearly reads as the letter C.
          It starts from the center crossing, sweeps left forming a C-shape
          (open gap on the right side of the left loop).
        */}
        <path
          d="
            M120 72
            C106 42, 70 16, 48 20
            C22 24, 12 46, 12 72
            C12 98, 22 120, 48 124
            C70 128, 106 102, 120 72
          "
          stroke={`url(#${gradId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/*
          The "B" — right loop:
          A figure that reads as B — has two bumps on the right side.
          The vertical spine on the left, with two curved bowls.
        */}
        {/* Upper bowl of B */}
        <path
          d="
            M120 72
            C130 50, 148 28, 168 28
            C192 28, 200 44, 200 56
            C200 66, 194 72, 182 72
          "
          stroke={`url(#${gradId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Lower bowl of B */}
        <path
          d="
            M182 72
            C196 72, 204 80, 204 90
            C204 104, 194 116, 168 116
            C148 116, 130 94, 120 72
          "
          stroke={`url(#${gradId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* B spine — subtle vertical line connecting the two bowls at the center meeting point */}
        <path
          d="M182 72 L182 72"
          stroke={`url(#${gradId})`}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
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
          Create · Book · Collaborate · ∞
        </p>
      )}
    </div>
  );
};

export default Logo;
