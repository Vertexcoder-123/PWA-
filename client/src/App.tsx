import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StudentDashboard from "@/pages/student-dashboard";
import NotFound from "@/pages/not-found";
import { OfflineIndicator } from "@/components/offline-indicator";

function Router() {
  return (
    <Switch>
      <Route path="/treasure-hunt/:subject?" component={StudentDashboard} />
      <Route path="/" component={() => {
        // Redirect to the static login page
        window.location.href = '/login.html';
        return null;
      }} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OfflineIndicator />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
