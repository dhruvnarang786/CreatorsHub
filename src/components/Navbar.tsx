import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

interface NavbarProps {
  onExplore: () => void;
  onList: () => void;
}

const Navbar = ({ onExplore, onList }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CreatorsBNB" className="h-10 w-auto" />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <button onClick={onExplore} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Explore</button>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</a>
          <Button variant="ghost" size="sm">Log In</Button>
          <Button variant="hero" size="sm">Sign Up</Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
