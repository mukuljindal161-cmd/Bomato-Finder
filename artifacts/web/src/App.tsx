import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import RestaurantPage from "@/pages/restaurant";
import OrderSummaryPage from "@/pages/order-summary";
import PaymentPage from "@/pages/payment";
import OrderConfirmationPage from "@/pages/order-confirmation";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/restaurant/:id" component={RestaurantPage} />
      <Route path="/order-summary" component={OrderSummaryPage} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/order-confirmation" component={OrderConfirmationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
