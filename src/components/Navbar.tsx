import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface NavbarProps {
  onExplore: () => void;
  onList: () => void;
}

const Navbar = ({ onExplore, onList }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Logo size="sm" />

        <nav className="hidden items-center gap-6 md:flex">
          <button onClick={onExplore} className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Explore <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it Works</a>
          <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Help <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Button variant="hero" size="sm">Sign Up</Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
