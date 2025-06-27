
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userType?: 'cliente' | 'restaurante' | 'entregador';
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
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{userName}</span>
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
