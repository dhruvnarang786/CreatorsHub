import React from "react";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: "text-[18px]",
    md: "text-[24px]",
    lg: "text-[32px]",
  };

  return (
    <div 
      onClick={() => navigate("/")} 
      className={`font-extrabold flex items-center tracking-tight cursor-pointer hover:opacity-90 transition-all shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: '"Manrope", sans-serif' }}
    >
      <span className="text-[#0A0A1A]">Creators</span>
      <span className="text-[#7C3AED]">BNB</span>
    </div>
  );
};

export default Logo;
