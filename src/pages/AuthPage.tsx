import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import Logo from '@/components/common/Logo';

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipo: 'cliente' as 'cliente' | 'restaurante' | 'entregador',
    telefone: '',
    endereco: '',
    // Campos específicos para restaurante
    categoria: '',
    cidade: '',
    descricao: '',
    // Campos específicos para entregador
    veiculo: '',
    placa: ''
  });

  const { user, signIn, signUp } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha email e senha',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn(loginData.email, loginData.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.nome || !signupData.email || !signupData.password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, email e senha',
        variant: 'destructive'
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: 'Senhas não conferem',
        description: 'Digite a mesma senha nos dois campos',
        variant: 'destructive'
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 6 caracteres',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        nome: signupData.nome,
        tipo: signupData.tipo,
        telefone: signupData.telefone,
        endereco: signupData.endereco
      };

      if (signupData.tipo === 'restaurante') {
        Object.assign(userData, {
          categoria: signupData.categoria,
          cidade: signupData.cidade,
          descricao: signupData.descricao
        });
      } else if (signupData.tipo === 'entregador') {
        Object.assign(userData, {
          veiculo: signupData.veiculo,
          placa: signupData.placa
        });
      }

      await signUp(signupData.email, signupData.password, userData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (tipo: string) => {
    const testUsers = {
      cliente: { email: 'cliente@test.com', password: '123456' },
      restaurante: { email: 'restaurante@test.com', password: '123456' },
      entregador: { email: 'entregador@test.com', password: '123456' }
    };

    const testUser = testUsers[tipo as keyof typeof testUsers];
    if (testUser) {
      setLoginData(testUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-gray-600 mt-2">Entre ou cadastre-se na plataforma</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Sua senha"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">Acesso rápido para teste:</p>
                  <div className="grid gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestLogin('cliente')}
                      className="text-xs"
                    >
                      Login como Cliente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestLogin('restaurante')}
                      className="text-xs"
                    >
                      Login como Restaurante
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestLogin('entregador')}
                      className="text-xs"
                    >
                      Login como Entregador
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-tipo">Tipo de Usuário</Label>
                    <Select 
                      value={signupData.tipo} 
                      onValueChange={(value: any) => setSignupData({ ...signupData, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="restaurante">Restaurante</SelectItem>
                        <SelectItem value="entregador">Entregador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-nome">Nome</Label>
                    <Input
                      id="signup-nome"
                      value={signupData.nome}
                      onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                      placeholder={signupData.tipo === 'restaurante' ? 'Nome do restaurante' : 'Seu nome'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      placeholder="Digite a senha novamente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-telefone">Telefone</Label>
                    <Input
                      id="signup-telefone"
                      value={signupData.telefone}
                      onChange={(e) => setSignupData({ ...signupData, telefone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-endereco">Endereço</Label>
                    <Textarea
                      id="signup-endereco"
                      value={signupData.endereco}
                      onChange={(e) => setSignupData({ ...signupData, endereco: e.target.value })}
                      placeholder="Seu endereço completo"
                      rows={2}
                    />
                  </div>

                  {/* Campos específicos para restaurante */}
                  {signupData.tipo === 'restaurante' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-categoria">Categoria</Label>
                        <Select 
                          value={signupData.categoria} 
                          onValueChange={(value) => setSignupData({ ...signupData, categoria: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Categoria do restaurante" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pizzaria">Pizzaria</SelectItem>
                            <SelectItem value="Hamburgueria">Hamburgueria</SelectItem>
                            <SelectItem value="Comida Japonesa">Comida Japonesa</SelectItem>
                            <SelectItem value="Comida Italiana">Comida Italiana</SelectItem>
                            <SelectItem value="Comida Brasileira">Comida Brasileira</SelectItem>
                            <SelectItem value="Lanches">Lanches</SelectItem>
                            <SelectItem value="Doces & Sobremesas">Doces & Sobremesas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-cidade">Cidade</Label>
                        <Input
                          id="signup-cidade"
                          value={signupData.cidade}
                          onChange={(e) => setSignupData({ ...signupData, cidade: e.target.value })}
                          placeholder="São Paulo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-descricao">Descrição</Label>
                        <Textarea
                          id="signup-descricao"
                          value={signupData.descricao}
                          onChange={(e) => setSignupData({ ...signupData, descricao: e.target.value })}
                          placeholder="Descreva seu restaurante"
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {/* Campos específicos para entregador */}
                  {signupData.tipo === 'entregador' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-veiculo">Veículo</Label>
                        <Select 
                          value={signupData.veiculo} 
                          onValueChange={(value) => setSignupData({ ...signupData, veiculo: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de veículo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Moto">Moto</SelectItem>
                            <SelectItem value="Carro">Carro</SelectItem>
                            <SelectItem value="Bike">Bike</SelectItem>
                            <SelectItem value="A pé">A pé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-placa">Placa do Veículo</Label>
                        <Input
                          id="signup-placa"
                          value={signupData.placa}
                          onChange={(e) => setSignupData({ ...signupData, placa: e.target.value })}
                          placeholder="ABC1234 (ou N/A para bike/a pé)"
                        />
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;