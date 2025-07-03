
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'restaurante' | 'entregador' | 'admin'>('cliente');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dados mockados para demonstração
  const usuariosMock = {
    cliente: { email: 'cliente@test.com', senha: '123456', nome: 'João Silva' },
    restaurante: { email: 'restaurante@test.com', senha: '123456', nome: 'Pizza Deliciosa' },
    entregador: { email: 'entregador@test.com', senha: '123456', nome: 'Carlos Entregador' },
    admin: { email: 'admin@test.com', senha: '123456', nome: 'Administrador' }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de autenticação
    setTimeout(() => {
      const userMock = usuariosMock[tipoUsuario];
      
      if (email === userMock.email && senha === userMock.senha) {
        const userData = {
          id: Math.random().toString(36),
          email,
          nome: userMock.nome,
          tipo: tipoUsuario
        };

        localStorage.setItem('zdelivery_user', JSON.stringify(userData));
        localStorage.setItem('zdelivery_token', 'mock-jwt-token');

        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo(a), ${userMock.nome}!`,
        });

        // Redirecionamento baseado no tipo de usuário
        switch (tipoUsuario) {
          case 'cliente':
            navigate('/restaurantes');
            break;
          case 'restaurante':
            navigate('/dashboard-restaurante');
            break;
          case 'entregador':
            navigate('/dashboard-entregador');
            break;
          case 'admin':
            navigate('/dashboard-admin');
            break;
        }
      } else {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos.',
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            Entrar no Z Delivery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="tipoUsuario">Tipo de Usuário</Label>
              <Select value={tipoUsuario} onValueChange={(value: any) => setTipoUsuario(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="restaurante">Restaurante</SelectItem>
                  <SelectItem value="entregador">Entregador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">Dados para teste:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Cliente:</strong> cliente@test.com / 123456</p>
              <p><strong>Restaurante:</strong> restaurante@test.com / 123456</p>
              <p><strong>Entregador:</strong> entregador@test.com / 123456</p>
              <p><strong>Admin:</strong> admin@test.com / 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
