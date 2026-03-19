import { useMemo } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle2, MapPin, Clock, UtensilsCrossed } from "lucide-react";

type ConfirmData = {
  restaurantName: string;
  restaurantId: number;
  items: { id: number; name: string; price: number; quantity: number }[];
  grandTotal: number;
  totalItems: number;
  paymentMethod: "upi" | "card" | "cod";
  fullName: string;
  address: string;
};

const methodLabel: Record<string, string> = {
  upi: "UPI",
  card: "Credit / Debit Card",
  cod: "Cash on Delivery",
};

function generateOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "BOM-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default function OrderConfirmationPage() {
  const search = useSearch();

  const data: ConfirmData | null = useMemo(() => {
    try {
      const params = new URLSearchParams(search);
      const raw = params.get("data");
      if (!raw) return null;
      return JSON.parse(decodeURIComponent(raw)) as ConfirmData;
    } catch {
      return null;
    }
  }, [search]);

  const orderId = useMemo(() => generateOrderId(), []);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-foreground">Order data not found</p>
        <Link href="/">
          <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">Back to home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="bg-gradient-to-b from-primary/10 via-background to-background pt-14 pb-8 px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5 shadow-md">
          <CheckCircle2 className="w-11 h-11 text-green-600" strokeWidth={1.8} />
        </div>
        <h1 className="text-3xl font-black text-foreground">Order Placed!</h1>
        <p className="text-muted-foreground mt-2 text-base max-w-xs mx-auto leading-relaxed">
          {data.paymentMethod === "cod"
            ? "Your order has been placed. Please keep cash ready on delivery."
            : "Payment successful! Your food is being prepared."}
        </p>
        <div className="inline-block mt-4 bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full tracking-wide">
          Order ID: {orderId}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Your Order</h2>
            <span className="ml-auto text-xs text-muted-foreground font-medium">{data.restaurantName}</span>
          </div>
          <div className="px-4 pt-2 pb-3 space-y-0">
            {data.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                    ×{item.quantity}
                  </span>
                  <span className="text-sm font-medium text-foreground line-clamp-1">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-foreground ml-4 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              {data.totalItems} {data.totalItems === 1 ? "item" : "items"} · {methodLabel[data.paymentMethod]}
            </span>
            <span className="text-lg font-black text-foreground">${Number(data.grandTotal).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Delivery Details</h2>
          </div>
          <div className="px-4 py-4 space-y-1.5">
            <p className="text-sm font-semibold text-foreground">{data.fullName}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.address}</p>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Estimated Delivery</h2>
          </div>
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-foreground">30 – 45 min</p>
              <p className="text-sm text-muted-foreground mt-0.5">We'll notify you when it's on the way</p>
            </div>
            <div className="text-4xl">🛵</div>
          </div>
        </div>

        <Link href="/">
          <button className="w-full mt-2 bg-primary text-primary-foreground px-5 py-4 rounded-2xl font-bold text-base hover:opacity-90 active:scale-[0.99] transition-all duration-150 shadow-lg">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
