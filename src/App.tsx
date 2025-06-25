
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthPage from "@/components/auth/AuthPage";
import Index from "./pages/Index";
import MechanicsPage from "./pages/MechanicsPage";
import ServicesPage from "./pages/ServicesPage";
import CheckoutPage from "./pages/CheckoutPage";
import ReportsPage from "./pages/ReportsPage";
import CustomersPage from "./pages/CustomersPage";
import MotorcycleModelsPage from "./pages/MotorcycleModelsPage";
import ServiceRecordsPage from "./pages/ServiceRecordsPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("App: Component iniciando renderização");
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mechanics"
                    element={
                      <ProtectedRoute>
                        <MechanicsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/services"
                    element={
                      <ProtectedRoute>
                        <ServicesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <ReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedRoute>
                        <CustomersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/motorcycle-models"
                    element={
                      <ProtectedRoute>
                        <MotorcycleModelsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/service-records/*"
                    element={
                      <ProtectedRoute>
                        <ServiceRecordsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("App: Erro durante renderização:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro na Aplicação</h1>
          <p className="text-red-700">Verifique o console para mais detalhes</p>
        </div>
      </div>
    );
  }
};

export default App;
