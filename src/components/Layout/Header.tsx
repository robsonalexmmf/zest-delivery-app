
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, LogOut, Settings, Package, Truck } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  userType?: 'cliente' | 'restaurante' | 'entregador' | 'admin';
  userName?: string;
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ userType, userName, cartCount = 0 }) => {
  const navigate = useNavigate();
  const { signOut, user, profile } = useAuth();

  // Use auth data if available, fallback to props for backward compatibility
  const currentUserType = profile?.tipo || userType || 'cliente';
  const currentUserName = profile?.nome || userName || 'Usuário';

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getNavigationItems = () => {
    switch (currentUserType) {
      case 'cliente':
        return [
          { label: 'Restaurantes', path: '/restaurantes', icon: Package },
          { label: 'Meus Pedidos', path: '/meus-pedidos', icon: Package },
        ];
      case 'restaurante':
        return [
          { label: 'Dashboard', path: '/dashboard-restaurante', icon: Package },
          { label: 'Produtos', path: '/produtos', icon: Package },
          { label: 'Pedidos', path: '/pedidos-restaurante', icon: Package },
          { label: 'Relatórios', path: '/relatorios', icon: Package },
        ];
      case 'entregador':
        return [
          { label: 'Dashboard', path: '/dashboard-entregador', icon: Truck },
          { label: 'Entregas', path: '/entregas-disponiveis', icon: Truck },
          { label: 'Configurações', path: '/configuracao-entregador', icon: Settings },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/dashboard-admin', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Logo />
          </div>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart for clients */}
                {currentUserType === 'cliente' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/carrinho')}
                    className="relative"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {currentUserName}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)}
                    </Badge>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button onClick={() => navigate('/cadastro')} className="bg-red-600 hover:bg-red-700">
                  Cadastrar
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
