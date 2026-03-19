import { useMemo } from "react";
import { Link, useSearch } from "wouter";
import { ArrowLeft, Receipt } from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type OrderData = {
  restaurantName: string;
  restaurantId: number;
  items: OrderItem[];
};

export default function OrderSummaryPage() {
  const search = useSearch();

  const orderData: OrderData | null = useMemo(() => {
    try {
      const params = new URLSearchParams(search);
      const raw = params.get("data");
      if (!raw) return null;
      return JSON.parse(decodeURIComponent(raw)) as OrderData;
    } catch {
      return null;
    }
  }, [search]);

  const grandTotal = useMemo(() => {
    if (!orderData) return 0;
    return orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [orderData]);

  if (!orderData || orderData.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-foreground">No order found</p>
        <Link href="/">
          <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">
            Back to home
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href={`/restaurant/${orderData.restaurantId}`}>
            <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-black text-foreground">Order Summary</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">{orderData.restaurantName}</p>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-36">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Your order from
            </p>
            <p className="font-bold text-foreground leading-tight">{orderData.restaurantName}</p>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-3 border-b border-border bg-muted/40">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Item</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Qty</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Price</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Total</span>
          </div>

          {orderData.items.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-4 items-center ${
                index < orderData.items.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="font-medium text-foreground text-sm leading-snug">
                {item.name}
              </span>
              <span className="text-sm text-muted-foreground font-semibold text-center min-w-[2rem]">
                ×{item.quantity}
              </span>
              <span className="text-sm text-muted-foreground text-right min-w-[3.5rem]">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-foreground text-right min-w-[4rem]">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Delivery fee</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-bold text-foreground text-base">Grand Total</span>
              <span className="font-black text-foreground text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-2xl mx-auto">
          <button className="w-full bg-primary text-primary-foreground px-5 py-4 rounded-2xl font-bold text-base hover:opacity-90 active:scale-[0.99] transition-all duration-150 shadow-lg">
            Proceed to Payment
          </button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Total: ${grandTotal.toFixed(2)} · {orderData.items.reduce((s, i) => s + i.quantity, 0)} items
          </p>
        </div>
      </div>
    </div>
  );
}
