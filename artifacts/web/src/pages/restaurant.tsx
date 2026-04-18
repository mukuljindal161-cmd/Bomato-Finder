import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft, Star, Clock, MapPin, ShoppingBag } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { getCuisineFallback } from "@/lib/imageFallback";
import { getFoodImage } from "@/lib/foodImages";

type ApiRestaurant = {
  id: number;
  name: string;
  imageUrl: string | null;
  rating: string;
  reviewCount: number;
  priceLevel: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isOpen: boolean;
  distance: string | null;
  cuisines: string[];
  description: string | null;
  address: string | null;
};

type ApiMenuItemBase = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: number;
};

type ApiMenuItem = ApiMenuItemBase & { categoryName: string };

type ApiMenuCategory = {
  name: string;
  items: ApiMenuItemBase[];
};

function PriceLevel({ level }: { level: number }) {
  return (
    <span className="font-semibold">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={i < level ? "text-foreground" : "text-muted-foreground/30"}>$</span>
      ))}
    </span>
  );
}

function ItemCounter({ count, onAdd, onIncrement, onDecrement }: {
  count: number; onAdd: () => void; onIncrement: () => void; onDecrement: () => void;
}) {
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
      >−</button>
      <span className="text-sm font-bold text-primary-foreground min-w-[1.25rem] text-center select-none">{count}</span>
      <button
        onClick={onIncrement}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-primary-foreground font-bold text-lg hover:bg-white/20 active:bg-white/30 transition-colors"
      >+</button>
    </div>
  );
}

function MenuItemRow({ item, count, onAdd, onIncrement, onDecrement }: {
  item: ApiMenuItem; count: number; onAdd: () => void; onIncrement: () => void; onDecrement: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const foodImg = getFoodImage(item.name, item.categoryName);

  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-base leading-snug">{item.name}</h4>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
        )}
        <p className="text-sm font-bold text-foreground mt-1.5">${Number(item.price).toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        {!imgError && (
          <img
            src={foodImg}
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-20 h-20 rounded-xl object-cover shadow-sm"
          />
        )}
        <ItemCounter count={count} onAdd={onAdd} onIncrement={onIncrement} onDecrement={onDecrement} />
      </div>
    </div>
  );
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const restaurantId = Number(params.id);

  const [restaurant, setRestaurant] = useState<ApiRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!restaurantId) { setNotFound(true); setLoading(false); return; }
    Promise.all([
      apiFetch<{ restaurant: ApiRestaurant }>(`/restaurants/${restaurantId}`),
      apiFetch<{ categories: ApiMenuCategory[]; uncategorized: ApiMenuItemBase[] }>(`/restaurants/${restaurantId}/menu`),
    ])
      .then(([rData, mData]) => {
        setRestaurant(rData.restaurant);
        const flatItems: ApiMenuItem[] = [];
        for (const cat of mData.categories ?? []) {
          for (const item of cat.items ?? []) {
            if (item.isAvailable) flatItems.push({ ...item, categoryName: cat.name });
          }
        }
        for (const item of mData.uncategorized ?? []) {
          if (item.isAvailable) flatItems.push({ ...item, categoryName: "Other" });
        }
        setMenuItems(flatItems);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const groupedMenu = useMemo(() => {
    const groups: Record<string, ApiMenuItem[]> = {};
    for (const item of menuItems) {
      if (!groups[item.categoryName]) groups[item.categoryName] = [];
      groups[item.categoryName].push(item);
    }
    return groups;
  }, [menuItems]);

  const totalItems = useMemo(() => Object.values(quantities).reduce((s, q) => s + q, 0), [quantities]);

  const handleChange = (itemId: number, delta: number) => {
    setQuantities((prev) => {
      const next = { ...prev, [itemId]: Math.max(0, (prev[itemId] ?? 0) + delta) };
      if (next[itemId] === 0) delete next[itemId];
      return next;
    });
  };

  const handleViewOrder = () => {
    if (!restaurant) return;
    const orderedItems = menuItems
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: quantities[item.id],
      }));
    const encoded = encodeURIComponent(JSON.stringify({
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      items: orderedItems,
    }));
    navigate(`/order-summary?data=${encoded}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative w-full h-72 bg-muted animate-pulse" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !restaurant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-foreground">Restaurant not found</p>
        <Link href="/"><span className="text-sm font-semibold text-primary hover:underline cursor-pointer">Back to home</span></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative">
        <div className="relative w-full h-72 sm:h-96 overflow-hidden">
          <img
            src={restaurant.imageUrl ?? ""}
            alt={`${restaurant.name} restaurant`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const fallback = getCuisineFallback(restaurant.cuisines);
              if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <Link href="/">
            <button className="absolute top-4 left-4 flex items-center gap-2 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/20">
              <ArrowLeft className="w-4 h-4" /> Back
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
              {Number(restaurant.rating).toFixed(1)}
              <span className="text-muted-foreground font-normal">({restaurant.reviewCount.toLocaleString()} reviews)</span>
            </span>

            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
            </span>

            {restaurant.distance && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" /> {restaurant.distance}
              </span>
            )}

            <PriceLevel level={restaurant.priceLevel} />

            <div className="flex flex-wrap gap-1.5">
              {restaurant.cuisines.map((c) => (
                <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">{c}</span>
              ))}
            </div>

            {!restaurant.isOpen && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">Currently Closed</span>
            )}
          </div>

          {restaurant.description && (
            <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">{restaurant.description}</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-black text-foreground mb-6">Menu</h2>
          {Object.keys(groupedMenu).length === 0 ? (
            <p className="text-muted-foreground">No menu items available.</p>
          ) : (
            Object.entries(groupedMenu).map(([category, items]) => (
              <section key={category} className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-1 pb-2 border-b-2 border-primary/20">{category}</h3>
                <div>
                  {items.map((item) => (
                    <MenuItemRow
                      key={item.id}
                      item={item}
                      count={quantities[item.id] ?? 0}
                      onAdd={() => handleChange(item.id, 1)}
                      onIncrement={() => handleChange(item.id, 1)}
                      onDecrement={() => handleChange(item.id, -1)}
                    />
                  ))}
                </div>
              </section>
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
