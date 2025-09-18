import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import StudentDashboard from "@/pages/student-dashboard";
import TeacherDashboard from "./pages/teacher-dashboard";
import NotFound from "@/pages/not-found";
import { OfflineIndicator } from "@/components/offline-indicator";

function Router() {
  return (
    <Switch>
      {/* Student Routes */}
      <Route path="/treasure-hunt/:subject?" component={() => (
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      )} />
      
      {/* Teacher Routes */}
      <Route path="/teacher" component={() => (
        <ProtectedRoute requiredRole="teacher">
          <TeacherDashboard />
        </ProtectedRoute>
      )} />
      
      {/* General protected route */}
      <Route path="/dashboard" component={() => (
        <ProtectedRoute>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Sarathi!</h1>
            <p>Loading your dashboard...</p>
          </div>
        </ProtectedRoute>
      )} />
      
      {/* Auth Route - shows login if not authenticated */}
      <Route path="/auth" component={() => (
        <ProtectedRoute>
          <div>Authenticated!</div>
        </ProtectedRoute>
      )} />
      
      {/* Home redirect */}
      <Route path="/" component={() => {
        // Redirect to the static home page
        window.location.href = '/home.html';
        return null;
      }} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <OfflineIndicator />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
