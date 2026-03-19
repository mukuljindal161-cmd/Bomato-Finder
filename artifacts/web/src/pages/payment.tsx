import { useState, useMemo } from "react";
import { Link, useSearch, useLocation } from "wouter";
import {
  ArrowLeft,
  Smartphone,
  CreditCard,
  Banknote,
  MapPin,
  User,
  Phone,
  ChevronRight,
  Loader2,
} from "lucide-react";

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

type PaymentMethod = "upi" | "card" | "cod";

const paymentOptions: { value: PaymentMethod; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "upi",
    label: "UPI",
    description: "Pay instantly via any UPI app",
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay and more",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: <Banknote className="w-5 h-5" />,
  },
];

export default function PaymentPage() {
  const search = useSearch();
  const [, navigate] = useLocation();

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

  const totalItems = useMemo(() => {
    if (!orderData) return 0;
    return orderData.items.reduce((s, i) => s + i.quantity, 0);
  }, [orderData]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isCOD = paymentMethod === "cod";
  const buttonLabel = isCOD ? "Place Order" : "Pay Now";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(phone.trim())) e.phone = "Enter a valid phone number";
    if (!address.trim()) e.address = "Delivery address is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const confirmData = encodeURIComponent(
        JSON.stringify({
          restaurantName: orderData?.restaurantName,
          restaurantId: orderData?.restaurantId,
          items: orderData?.items,
          grandTotal,
          totalItems,
          paymentMethod,
          fullName: fullName.trim(),
          address: address.trim(),
        })
      );
      navigate(`/order-confirmation?data=${confirmData}`);
    }, 2000);
  };

  if (!orderData || orderData.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-foreground">No order data found</p>
        <Link href="/">
          <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">Back to home</span>
        </Link>
      </div>
    );
  }

  const backData = encodeURIComponent(JSON.stringify(orderData));

  return (
    <div className="min-h-screen bg-background pb-36">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href={`/order-summary?data=${backData}`}>
            <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-black text-foreground">Payment Details</h1>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        <section className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Order Summary</h2>
          </div>
          <div className="px-4 pt-2 pb-3 space-y-2">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground leading-snug line-clamp-1">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-0"> × {item.quantity}</span>
                </div>
                <span className="text-sm font-bold text-foreground ml-4 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"} · {orderData.restaurantName}
            </span>
            <span className="text-base font-black text-foreground">${grandTotal.toFixed(2)}</span>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Delivery Address</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: "" })); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm ${errors.fullName ? "border-destructive" : "border-input"}`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm ${errors.phone ? "border-destructive" : "border-input"}`}
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Delivery Address
              </label>
              <textarea
                placeholder="123 Main St, Apt 4B, New York, NY 10001"
                value={address}
                rows={3}
                onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
                className={`w-full px-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm resize-none ${errors.address ? "border-destructive" : "border-input"}`}
              />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
            </div>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Payment Method</h2>
          </div>
          <div className="p-3 space-y-2">
            {paymentOptions.map((option) => {
              const selected = paymentMethod === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-3.5 rounded-xl cursor-pointer border transition-all ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={selected}
                    onChange={() => setPaymentMethod(option.value)}
                    className="sr-only"
                  />
                  <div className={`shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`}>
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected ? "border-primary" : "border-border"
                    }`}
                  >
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-2xl mx-auto space-y-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-5 py-4 rounded-2xl font-bold text-base hover:opacity-90 active:scale-[0.99] transition-all duration-150 shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                {buttonLabel} · ${grandTotal.toFixed(2)}
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Simulated payment · No real charges will be made
          </p>
        </div>
      </div>
    </div>
  );
}
