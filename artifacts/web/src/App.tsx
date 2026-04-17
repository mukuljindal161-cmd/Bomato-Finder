import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import RestaurantPage from "@/pages/restaurant";
import OrderSummaryPage from "@/pages/order-summary";
import PaymentPage from "@/pages/payment";
import OrderConfirmationPage from "@/pages/order-confirmation";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import OrdersPage from "@/pages/orders";
import AccountPage from "@/pages/account";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/restaurant/:id" component={RestaurantPage} />
      <Route path="/order-summary" component={OrderSummaryPage} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/order-confirmation" component={OrderConfirmationPage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/account" component={AccountPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
