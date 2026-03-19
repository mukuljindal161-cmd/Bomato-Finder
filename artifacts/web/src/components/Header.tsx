import { UtensilsCrossed } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              Bomato
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Near Me
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Deals
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sign in
            </button>
            <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
