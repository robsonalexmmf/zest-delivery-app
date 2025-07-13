
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: '',
    endereco: '',
    tipo: 'cliente' as 'cliente' | 'restaurante' | 'entregador'
  });

  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(loginData.email, loginData.password);
      
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando...'
      });

      // Redirecionar baseado no tipo de usuário
      const userType = getUserTypeFromEmail(loginData.email);
      redirectUserToDashboard(userType);
      
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error.message || 'Credenciais inválidas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.nome || !signupData.email || !signupData.password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(signupData.email, signupData.password, {
        nome: signupData.nome,
        telefone: signupData.telefone,
        endereco: signupData.endereco,
        tipo: signupData.tipo
      });
      
      toast({
        title: 'Cadastro realizado!',
        description: 'Você pode fazer login agora.'
      });

      // Limpar formulário e voltar para login
      setSignupData({
        nome: '',
        email: '',
        password: '',
        telefone: '',
        endereco: '',
        tipo: 'cliente'
      });
      
    } catch (error: any) {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Erro ao criar conta',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeFromEmail = (email: string): string => {
    if (email === 'cliente@test.com') return 'cliente';
    if (email === 'restaurante@test.com') return 'restaurante';
    if (email === 'entregador@test.com') return 'entregador';
    if (email === 'admin@test.com') return 'admin';
    return 'cliente';
  };

  const redirectUserToDashboard = (userType: string) => {
    switch (userType) {
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
      default:
        navigate('/');
    }
  };

  const fillTestCredentials = (userType: string) => {
    const testCredentials = {
      cliente: { email: 'cliente@test.com', password: '123456' },
      restaurante: { email: 'restaurante@test.com', password: '123456' },
      entregador: { email: 'entregador@test.com', password: '123456' },
      admin: { email: 'admin@test.com', password: '123456' }
    };

    const credentials = testCredentials[userType as keyof typeof testCredentials];
    if (credentials) {
      setLoginData(credentials);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ZDelivery
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sua plataforma de delivery
          </p>
        </div>

        <Card className="w-full">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Fazer Login</CardTitle>
                <CardDescription>
                  Entre com sua conta para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Sua senha"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                {/* Botões de teste */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">Contas de teste:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillTestCredentials('cliente')}
                    >
                      Cliente
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillTestCredentials('restaurante')}
                    >
                      Restaurante
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillTestCredentials('entregador')}
                    >
                      Entregador
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillTestCredentials('admin')}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Cadastre-se para começar a usar o ZDelivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-nome">Nome Completo *</Label>
                    <Input
                      id="signup-nome"
                      type="text"
                      value={signupData.nome}
                      onChange={(e) => setSignupData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email">E-mail *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Senha *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Sua senha"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-telefone">Telefone</Label>
                    <Input
                      id="signup-telefone"
                      type="tel"
                      value={signupData.telefone}
                      onChange={(e) => setSignupData(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-endereco">Endereço</Label>
                    <Input
                      id="signup-endereco"
                      type="text"
                      value={signupData.endereco}
                      onChange={(e) => setSignupData(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Seu endereço completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-tipo">Tipo de Conta *</Label>
                    <Select
                      value={signupData.tipo}
                      onValueChange={(value: 'cliente' | 'restaurante' | 'entregador') =>
                        setSignupData(prev => ({ ...prev, tipo: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="restaurante">Restaurante</SelectItem>
                        <SelectItem value="entregador">Entregador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
