
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    if (!profile) return '/';
    
    switch (profile.tipo) {
      case 'restaurante':
        return '/dashboard-restaurante';
      case 'entregador':
        return '/dashboard-entregador';
      case 'admin':
        return '/dashboard-admin';
      default:
        return '/restaurantes';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/restaurantes" className="text-gray-700 hover:text-orange-600 transition-colors">
              Restaurantes
            </Link>
            {user && (
              <Link to="/meus-pedidos" className="text-gray-700 hover:text-orange-600 transition-colors">
                Meus Pedidos
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/carrinho" className="text-gray-700 hover:text-orange-600 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-orange-600 transition-colors">
                  <User className="h-6 w-6" />
                </Link>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Olá, {profile?.nome || user.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-orange-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                    Login
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
