import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCuisine: string;
  onCuisineChange: (c: string) => void;
  cuisines: string[];
  priceFilter: number | null;
  onPriceFilterChange: (p: number | null) => void;
  openOnly: boolean;
  onOpenOnlyChange: (o: boolean) => void;
  totalResults: number;
}

export function SearchBar({
  query,
  onQueryChange,
  selectedCuisine,
  onCuisineChange,
  cuisines,
  priceFilter,
  onPriceFilterChange,
  openOnly,
  onOpenOnlyChange,
  totalResults,
}: SearchBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Search restaurants, cuisines..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-card-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm text-base"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />

        <select
          value={selectedCuisine}
          onChange={(e) => onCuisineChange(e.target.value)}
          className="text-sm font-medium px-3 py-1.5 rounded-xl bg-card border border-card-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          <option value="">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex gap-1">
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              onClick={() => onPriceFilterChange(priceFilter === p ? null : p)}
              className={`text-sm font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                priceFilter === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-card-border text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {"$".repeat(p)}
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenOnlyChange(!openOnly)}
          className={`text-sm font-semibold px-3 py-1.5 rounded-xl border transition-all ${
            openOnly
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-card-border text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Open Now
        </button>

        <span className="ml-auto text-sm text-muted-foreground">
          {totalResults} restaurant{totalResults !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
