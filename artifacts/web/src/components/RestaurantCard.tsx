import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Restaurant } from "@/data/restaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

function PriceLevel({ level }: { level: number }) {
  return (
    <span className="text-sm font-medium">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={i < level ? "text-foreground font-semibold" : "text-muted-foreground/40"}
        >
          $
        </span>
      ))}
    </span>
  );
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="group bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={restaurant.image}
          alt={`${restaurant.name} restaurant`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-black/70 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
              Currently Closed
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-semibold px-2.5 py-1 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {restaurant.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-lg text-card-foreground leading-tight">
            {restaurant.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {restaurant.cuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {restaurant.distance}
          </span>
          <PriceLevel level={restaurant.priceLevel} />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
          <span className="text-xs text-muted-foreground">
            {restaurant.reviewCount.toLocaleString()} reviews
          </span>
          {restaurant.isOpen ? (
            <Link href={`/restaurant/${restaurant.id}`}>
              <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150">
                Order Now
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl opacity-50 cursor-not-allowed"
            >
              Closed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
