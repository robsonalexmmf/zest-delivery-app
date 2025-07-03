
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingCart, LogOut, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface HeaderProps {
  userType?: 'cliente' | 'restaurante' | 'entregador' | 'admin';
  userName?: string;
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ userType, userName, cartCount = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('zdelivery_user');
    localStorage.removeItem('zdelivery_token');
    navigate('/');
  };

  const handleEditProfile = () => {
    if (userType === 'restaurante') {
      // Abrir modal de configurações do restaurante
      window.dispatchEvent(new CustomEvent('openRestaurantConfig'));
    } else if (userType === 'entregador') {
      navigate('/configuracao-entregador');
    } else if (userType === 'cliente') {
      // Navegar para configurações do cliente (quando implementado)
      console.log('Editar perfil do cliente');
    } else if (userType === 'admin') {
      console.log('Editar perfil do administrador');
    }
  };

  const handleViewProfile = () => {
    if (userType === 'restaurante') {
      console.log('Ver perfil do restaurante');
    } else if (userType === 'entregador') {
      console.log('Ver perfil do entregador');
    } else if (userType === 'cliente') {
      console.log('Ver perfil do cliente');
    } else if (userType === 'admin') {
      console.log('Ver perfil do administrador');
    }
  };

  return (
    <header className="bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Z Delivery
          </Link>

          <nav className="hidden md:flex space-x-6">
            {!userType && (
              <>
                <Link to="/login" className="hover:text-red-200 transition-colors">
                  Login
                </Link>
                <Link to="/cadastro" className="hover:text-red-200 transition-colors">
                  Cadastrar
                </Link>
              </>
            )}
            
            {userType === 'cliente' && (
              <>
                <Link to="/restaurantes" className="hover:text-red-200 transition-colors">
                  Restaurantes
                </Link>
                <Link to="/meus-pedidos" className="hover:text-red-200 transition-colors">
                  Meus Pedidos
                </Link>
              </>
            )}

            {userType === 'restaurante' && (
              <>
                <Link to="/dashboard-restaurante" className="hover:text-red-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/produtos" className="hover:text-red-200 transition-colors">
                  Produtos
                </Link>
                <Link to="/pedidos-restaurante" className="hover:text-red-200 transition-colors">
                  Pedidos
                </Link>
              </>
            )}

            {userType === 'entregador' && (
              <>
                <Link to="/dashboard-entregador" className="hover:text-red-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/entregas-disponiveis" className="hover:text-red-200 transition-colors">
                  Entregas Disponíveis
                </Link>
              </>
            )}

            {userType === 'admin' && (
              <>
                <Link to="/dashboard-admin" className="hover:text-red-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/dashboard-admin" className="hover:text-red-200 transition-colors">
                  Gerenciar Usuários
                </Link>
                <Link to="/dashboard-admin" className="hover:text-red-200 transition-colors">
                  Relatórios
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {userType === 'cliente' && (
              <Link to="/carrinho" className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {userName && (
              <div className="flex items-center space-x-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-red-700 px-2 py-1 rounded transition-colors">
                      <User className="w-5 h-5" />
                      <span className="hidden md:inline">{userName}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-56 p-4" side="bottom" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{userName}</p>
                          <p className="text-sm text-gray-500 capitalize">{userType}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3 space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleViewProfile}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Meu Perfil
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleEditProfile}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Perfil
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-white hover:text-red-200 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
