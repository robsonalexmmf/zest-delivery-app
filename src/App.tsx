
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Páginas principais
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Páginas do Cliente
import RestaurantesPage from "./pages/Cliente/RestaurantesPage";
import RestauranteDetalhePage from "./pages/Cliente/RestauranteDetalhePage";
import CarrinhoPage from "./pages/Cliente/CarrinhoPage";
import MeusPedidosPage from "./pages/Cliente/MeusPedidosPage";

// Páginas do Restaurante
import DashboardRestaurante from "./pages/Restaurante/DashboardRestaurante";
import ProdutosPage from "./pages/Restaurante/ProdutosPage";
import PedidosRestaurantePage from "./pages/Restaurante/PedidosRestaurantePage";
import RelatoriosPage from "./pages/Restaurante/RelatoriosPage";

// Páginas do Entregador
import DashboardEntregador from "./pages/Entregador/DashboardEntregador";
import EntregasDisponiveisPage from "./pages/Entregador/EntregasDisponiveisPage";
import ConfiguracaoEntregadorPage from "./pages/Entregador/ConfiguracaoEntregadorPage";
import StatusPedidosPage from "./pages/Entregador/StatusPedidosPage";

// Páginas do Administrador
import DashboardAdmin from "./pages/Admin/DashboardAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/cadastro" element={<AuthPage />} />
            
            {/* Rotas do Cliente */}
            <Route path="/restaurantes" element={<RestaurantesPage />} />
            <Route path="/restaurante/:id" element={<RestauranteDetalhePage />} />
            <Route path="/carrinho" element={<CarrinhoPage />} />
            <Route path="/meus-pedidos" element={<MeusPedidosPage />} />
            
            {/* Rotas do Restaurante */}
            <Route path="/dashboard-restaurante" element={<DashboardRestaurante />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/pedidos-restaurante" element={<PedidosRestaurantePage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            
            {/* Rotas do Entregador */}
            <Route path="/dashboard-entregador" element={<DashboardEntregador />} />
            <Route path="/entregas-disponiveis" element={<EntregasDisponiveisPage />} />
            <Route path="/configuracao-entregador" element={<ConfiguracaoEntregadorPage />} />
            <Route path="/status-pedidos" element={<StatusPedidosPage />} />
            
            {/* Rotas do Administrador */}
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
