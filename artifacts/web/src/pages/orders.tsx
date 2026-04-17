import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ShoppingBag, Clock, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

type OrderItem = { id: string; name: string; quantity: number; unitPrice: string; total: string };
type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  total: string;
  createdAt: string;
  restaurantName: string | null;
  restaurantImage: string | null;
  items: OrderItem[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-50",
  confirmed: "text-blue-600 bg-blue-50",
  preparing: "text-orange-600 bg-orange-50",
  out_for_delivery: "text-purple-600 bg-purple-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    apiFetch<{ orders: Order[] }>("/orders", { auth: true })
      .then((data) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <ShoppingBag className="w-14 h-14 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-black text-foreground mb-2">Sign in to view orders</h2>
          <p className="text-muted-foreground mb-6">Track your past and current orders.</p>
          <Link href="/login">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <h1 className="text-2xl font-black text-foreground">My Orders</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-card-border rounded-2xl p-5 animate-pulse">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">When you place an order, it'll show up here.</p>
            <Link href="/">
              <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                Browse Restaurants
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-black text-foreground">{order.restaurantName ?? "Restaurant"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.orderNumber} · {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[order.status] ?? "text-muted-foreground bg-muted"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3 space-y-1">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} ×{item.quantity}</span>
                        <span>${Number(item.total).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-muted-foreground/60">+{order.items.length - 3} more items</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <p className="font-black text-foreground">${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
