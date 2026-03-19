import { useState, useMemo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft, Star, Clock, MapPin, ShoppingBag } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { menus, type MenuItem } from "@/data/menu";

function PriceLevel({ level }: { level: number }) {
  return (
    <span className="font-semibold">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={i < level ? "text-foreground" : "text-muted-foreground/30"}>
          $
        </span>
      ))}
    </span>
  );
}

interface ItemCounterProps {
  count: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function ItemCounter({ count, onAdd, onIncrement, onDecrement }: ItemCounterProps) {
  if (count === 0) {
    return (
      <button
        onClick={onAdd}
        className="text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-150 shrink-0"
      >
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-primary rounded-xl px-1 py-1 shrink-0">
      <button
        onClick={onDecrement}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-primary-foreground font-bold text-lg hover:bg-white/20 active:bg-white/30 transition-colors"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="text-sm font-bold text-primary-foreground min-w-[1.25rem] text-center select-none">
        {count}
      </span>
      <button
        onClick={onIncrement}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-primary-foreground font-bold text-lg hover:bg-white/20 active:bg-white/30 transition-colors"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

interface MenuItemRowProps {
  item: MenuItem;
  count: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function MenuItemRow({ item, count, onAdd, onIncrement, onDecrement }: MenuItemRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-base leading-snug">
          {item.name}
        </h4>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <p className="text-sm font-bold text-foreground mt-1.5">
          ${item.price.toFixed(2)}
        </p>
      </div>
      <ItemCounter
        count={count}
        onAdd={onAdd}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    </div>
  );
}

interface MenuSectionProps {
  category: string;
  items: MenuItem[];
  quantities: Record<number, number>;
  onChange: (itemId: number, delta: number) => void;
}

function MenuSection({ category, items, quantities, onChange }: MenuSectionProps) {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold text-foreground mb-1 pb-2 border-b-2 border-primary/20">
        {category}
      </h3>
      <div>
        {items.map((item) => {
          const count = quantities[item.id] ?? 0;
          return (
            <MenuItemRow
              key={item.id}
              item={item}
              count={count}
              onAdd={() => onChange(item.id, 1)}
              onIncrement={() => onChange(item.id, 1)}
              onDecrement={() => onChange(item.id, -1)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const restaurantId = Number(params.id);

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const menu = menus[restaurantId];

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const groupedMenu = useMemo(() => {
    if (!menu) return {} as Record<string, MenuItem[]>;
    const groups: Record<string, MenuItem[]> = {};
    for (const item of menu.items) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [menu]);

  const totalItems = useMemo(
    () => Object.values(quantities).reduce((s, q) => s + q, 0),
    [quantities]
  );

  const handleChange = (itemId: number, delta: number) => {
    setQuantities((prev) => {
      const next = { ...prev, [itemId]: Math.max(0, (prev[itemId] ?? 0) + delta) };
      if (next[itemId] === 0) delete next[itemId];
      return next;
    });
  };

  const handleViewOrder = () => {
    if (!menu || !restaurant) return;
    const orderedItems = menu.items
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantities[item.id],
      }));
    const encoded = encodeURIComponent(JSON.stringify({
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      items: orderedItems,
    }));
    navigate(`/order-summary?data=${encoded}`);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-foreground">Restaurant not found</p>
        <Link href="/">
          <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">
            Back to home
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative">
        <div className="relative w-full h-72 sm:h-96 overflow-hidden">
          <img
            src={restaurant.image}
            alt={`${restaurant.name} restaurant`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <Link href="/">
            <button className="absolute top-4 left-4 flex items-center gap-2 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">
              {restaurant.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-card-border rounded-2xl shadow-sm -mt-5 relative z-10 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {restaurant.rating.toFixed(1)}
              <span className="text-muted-foreground font-normal">
                ({restaurant.reviewCount.toLocaleString()} reviews)
              </span>
            </span>

            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              {restaurant.deliveryTime}
            </span>

            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              {restaurant.distance}
            </span>

            <span>
              <PriceLevel level={restaurant.priceLevel} />
            </span>

            <div className="flex flex-wrap gap-1.5">
              {restaurant.cuisines.map((c) => (
                <span
                  key={c}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-black text-foreground mb-6">Menu</h2>
          {Object.keys(groupedMenu).length === 0 ? (
            <p className="text-muted-foreground">No menu available.</p>
          ) : (
            Object.entries(groupedMenu).map(([category, items]) => (
              <MenuSection
                key={category}
                category={category}
                items={items}
                quantities={quantities}
                onChange={handleChange}
              />
            ))
          )}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleViewOrder}
              className="w-full flex items-center justify-between bg-primary text-primary-foreground px-5 py-4 rounded-2xl font-bold text-base hover:opacity-90 active:scale-[0.99] transition-all duration-150 shadow-lg"
            >
              <span className="bg-white/20 text-white text-sm font-bold px-2.5 py-0.5 rounded-lg">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
              <span>View Order</span>
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
