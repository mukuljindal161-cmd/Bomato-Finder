import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { restaurants, allCuisines } from "@/data/restaurants";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesQuery =
        !query ||
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisines.some((c) => c.toLowerCase().includes(query.toLowerCase()));

      const matchesCuisine =
        !selectedCuisine || r.cuisines.includes(selectedCuisine);

      const matchesPrice = !priceFilter || r.priceLevel === priceFilter;

      const matchesOpen = !openOnly || r.isOpen;

      return matchesQuery && matchesCuisine && matchesPrice && matchesOpen;
    });
  }, [query, selectedCuisine, priceFilter, openOnly]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-3">
              Discover Great Food,{" "}
              <span className="text-primary">Near You</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Explore top-rated restaurants and get your favorites delivered fast.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              selectedCuisine={selectedCuisine}
              onCuisineChange={setSelectedCuisine}
              cuisines={allCuisines}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
              openOnly={openOnly}
              onOpenOnlyChange={setOpenOnly}
              totalResults={filtered.length}
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search for something else.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedCuisine("");
                setPriceFilter(null);
                setOpenOnly(false);
              }}
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-foreground">Bomato</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bomato. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
