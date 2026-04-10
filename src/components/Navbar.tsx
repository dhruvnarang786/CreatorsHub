import { Button } from "@/components/ui/button";

interface NavbarProps {
  onExplore: () => void;
  onList: () => void;
}

const Navbar = ({ onExplore, onList }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-400 text-sm font-extrabold text-primary-foreground">
            CB
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground">CreatorsBNB</h1>
            <p className="text-xs text-muted-foreground">Find Your Creative Space</p>
          </div>
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
