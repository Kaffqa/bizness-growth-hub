import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Workspace Pages
import Overview from "./pages/workspace/Overview";
import Products from "./pages/workspace/Products";
import Calculator from "./pages/workspace/Calculator";
import Files from "./pages/workspace/Files";
import AITools from "./pages/workspace/AITools";
import Reports from "./pages/workspace/Reports";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Workspace Routes */}
          <Route
            path="/workspace/:businessId"
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="files" element={<Files />} />
            <Route path="ai" element={<AITools />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          
          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
