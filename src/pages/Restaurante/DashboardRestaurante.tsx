import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import ConfiguracaoPagamento from '@/components/Restaurante/ConfiguracaoPagamento';
import GerenciadorCupons from '@/components/Restaurante/GerenciadorCupons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  TrendingUp,
  Package,
  Settings,
  CreditCard,
  Star,
  Tag,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DashboardRestaurante: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [configuracoes, setConfiguracoes] = useState({
    nomeRestaurante: '',
    descricao: '',
    categoria: '',
    cidade: '',
    endereco: '',
    telefone: '',
    email: '',
    site: '',
    horarioFuncionamento: {
      segunda: { abertura: '08:00', fechamento: '22:00', ativo: true },
      terca: { abertura: '08:00', fechamento: '22:00', ativo: true },
      quarta: { abertura: '08:00', fechamento: '22:00', ativo: true },
      quinta: { abertura: '08:00', fechamento: '22:00', ativo: true },
      sexta: { abertura: '08:00', fechamento: '23:00', ativo: true },
      sabado: { abertura: '10:00', fechamento: '23:00', ativo: true },
      domingo: { abertura: '10:00', fechamento: '22:00', ativo: false }
    },
    tempoPreparoMedio: 30,
    valorMinimoEntrega: 20,
    taxaEntrega: 5,
    raioEntrega: 10,
    aceitaPedidosOnline: true,
    logo: '',
    bannerPrincipal: ''
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const navigate = useNavigate();

  const categorias = [
    'Pizza', 'Hambúrguer', 'Japonês', 'Chinês', 'Italiana', 'Brasileira',
    'Mexicana', 'Árabe', 'Vegetariana', 'Doces', 'Açaí', 'Lanches',
    'Saudável', 'Fast Food', 'Regional', 'Frutos do Mar'
  ];

  const cidades = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza',
    'Brasília', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus',
    'Belém', 'Goiânia', 'Campinas', 'São Luís', 'São Gonçalo'
  ];

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'restaurante') {
        navigate('/login');
      } else {
        setUser(parsedUser);
        carregarConfiguracoes();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const carregarConfiguracoes = () => {
    const configSalvas = localStorage.getItem('config_restaurante');
    if (configSalvas) {
      const config = JSON.parse(configSalvas);
      setConfiguracoes(config);
      setLogoPreview(config.logo);
      setBannerPreview(config.bannerPrincipal);
    }
  };

  const salvarConfiguracoes = () => {
    localStorage.setItem('config_restaurante', JSON.stringify(configuracoes));
    toast({
      title: 'Configurações salvas!',
      description: 'As configurações do restaurante foram atualizadas com sucesso.',
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setConfiguracoes({ ...configuracoes, logo: imageUrl });
        setLogoPreview(imageUrl);
        
        toast({
          title: 'Logo carregada!',
          description: 'A logo foi carregada com sucesso.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setConfiguracoes({ ...configuracoes, bannerPrincipal: imageUrl });
        setBannerPreview(imageUrl);
        
        toast({
          title: 'Banner carregado!',
          description: 'O banner foi carregado com sucesso.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHorarioChange = (dia: string, campo: string, valor: string | boolean) => {
    setConfiguracoes({
      ...configuracoes,
      horarioFuncionamento: {
        ...configuracoes.horarioFuncionamento,
        [dia]: {
          ...configuracoes.horarioFuncionamento[dia as keyof typeof configuracoes.horarioFuncionamento],
          [campo]: valor
        }
      }
    });
  };

  // Dados mockados para demonstração
  const estatisticas = {
    vendas: {
      hoje: 1250.80,
      semana: 8750.40,
      mes: 32450.60
    },
    pedidos: {
      pendentes: 5,
      preparando: 3,
      prontos: 2,
      total_hoje: 23
    },
    produtos: {
      total: 15,
      disponivel: 12,
      indisponivel: 3
    },
    avaliacao: 4.5
  };

  const pedidosRecentes = [
    {
      id: '#001',
      cliente: 'João Silva',
      valor: 85.90,
      status: 'preparando',
      tempo: '15min',
      produtos: ['Pizza Margherita', 'Coca-Cola 350ml']
    },
    {
      id: '#002',
      cliente: 'Maria Santos',
      valor: 42.50,
      status: 'aceito',
      tempo: '5min',
      produtos: ['Pizza Calabresa']
    },
    {
      id: '#003',
      cliente: 'Carlos Silva',
      valor: 125.80,
      status: 'saiu_entrega',
      tempo: '45min',
      produtos: ['Pizza Portuguesa', 'Pizza 4 Queijos', 'Refrigerante 2L']
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'aceito': { color: 'bg-blue-100 text-blue-800', label: 'Aceito' },
      'preparando': { color: 'bg-yellow-100 text-yellow-800', label: 'Preparando' },
      'pronto': { color: 'bg-green-100 text-green-800', label: 'Pronto' },
      'saiu_entrega': { color: 'bg-purple-100 text-purple-800', label: 'Em Entrega' },
      'entregue': { color: 'bg-gray-100 text-gray-800', label: 'Entregue' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.aceito;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="restaurante" userName={user.nome} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard do Restaurante
          </h1>
          <p className="text-gray-600">
            Acompanhe o desempenho do seu negócio
          </p>
        </div>

        <Tabs defaultValue="resumo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="cupons">
              <Tag className="w-4 h-4 mr-2" />
              Cupons
            </TabsTrigger>
            <TabsTrigger value="pagamentos">
              <CreditCard className="w-4 h-4 mr-2" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="configuracoes">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Vendas Hoje
                    </CardTitle>
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {estatisticas.vendas.hoje.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">
                    +12% em relação a ontem
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Pedidos Hoje
                    </CardTitle>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {estatisticas.pedidos.total_hoje}
                  </div>
                  <p className="text-xs text-gray-500">
                    {estatisticas.pedidos.pendentes} pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Tempo Médio
                    </CardTitle>
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    32min
                  </div>
                  <p className="text-xs text-gray-500">
                    Preparação + entrega
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Avaliação
                    </CardTitle>
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {estatisticas.avaliacao}
                  </div>
                  <p className="text-xs text-gray-500">
                    Baseado em 234 avaliações
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pedidos Recentes */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Pedidos Recentes</CardTitle>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/pedidos-restaurante')}
                      >
                        Ver Todos
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pedidosRecentes.map(pedido => (
                        <div key={pedido.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold">{pedido.id}</span>
                              <span className="text-gray-600">{pedido.cliente}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusBadge(pedido.status).color}>
                                {getStatusBadge(pedido.status).label}
                              </Badge>
                              <span className="text-sm text-gray-500">{pedido.tempo}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {pedido.produtos.join(', ')}
                            </div>
                            <div className="font-bold text-green-600">
                              R$ {pedido.valor.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ações Rápidas */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => navigate('/produtos')}
                    >
                      Gerenciar Produtos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/pedidos-restaurante')}
                    >
                      Ver Pedidos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/relatorios')}
                    >
                      Relatórios
                    </Button>
                  </CardContent>
                </Card>

                {/* Status do Restaurante */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Status do Restaurante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-100 text-green-800">Aberto</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Produtos:</span>
                        <span>{estatisticas.produtos.disponivel}/{estatisticas.produtos.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Pedidos na fila:</span>
                        <span>{estatisticas.pedidos.pendentes + estatisticas.pedidos.preparando}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cupons">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Cupons</CardTitle>
                <p className="text-sm text-gray-600">
                  Crie e gerencie cupons de desconto para seus clientes
                </p>
              </CardHeader>
              <CardContent>
                <GerenciadorCupons />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagamentos">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Pagamentos</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure como você deseja receber os pagamentos dos pedidos
                </p>
              </CardHeader>
              <CardContent>
                <ConfiguracaoPagamento />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <div className="grid gap-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Restaurante</CardTitle>
                  <p className="text-sm text-gray-600">
                    Configure as informações básicas do seu restaurante
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomeRestaurante">Nome do Restaurante</Label>
                      <Input
                        id="nomeRestaurante"
                        value={configuracoes.nomeRestaurante}
                        onChange={(e) => setConfiguracoes({...configuracoes, nomeRestaurante: e.target.value})}
                        placeholder="Nome do seu restaurante"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select 
                        value={configuracoes.categoria} 
                        onValueChange={(value) => setConfiguracoes({...configuracoes, categoria: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={configuracoes.descricao}
                      onChange={(e) => setConfiguracoes({...configuracoes, descricao: e.target.value})}
                      placeholder="Descreva seu restaurante"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Select 
                        value={configuracoes.cidade} 
                        onValueChange={(value) => setConfiguracoes({...configuracoes, cidade: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {cidades.map(cidade => (
                            <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={configuracoes.endereco}
                        onChange={(e) => setConfiguracoes({...configuracoes, endereco: e.target.value})}
                        placeholder="Endereço completo"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={configuracoes.telefone}
                        onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={configuracoes.email}
                        onChange={(e) => setConfiguracoes({...configuracoes, email: e.target.value})}
                        placeholder="contato@restaurante.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="site">Site</Label>
                      <Input
                        id="site"
                        value={configuracoes.site}
                        onChange={(e) => setConfiguracoes({...configuracoes, site: e.target.value})}
                        placeholder="www.restaurante.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Imagens */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagens do Restaurante</CardTitle>
                  <p className="text-sm text-gray-600">
                    Faça upload da logo e banner do seu restaurante
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Logo do Restaurante</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      {logoPreview && (
                        <div className="flex items-center space-x-2">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                          <span className="text-sm text-green-600">Logo carregada</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Banner Principal</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                        id="banner-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('banner-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Banner
                      </Button>
                      {bannerPreview && (
                        <div className="flex items-center space-x-2">
                          <img 
                            src={bannerPreview} 
                            alt="Banner preview" 
                            className="w-20 h-12 object-cover rounded-lg border"
                          />
                          <span className="text-sm text-green-600">Banner carregado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Horário de Funcionamento */}
              <Card>
                <CardHeader>
                  <CardTitle>Horário de Funcionamento</CardTitle>
                  <p className="text-sm text-gray-600">
                    Configure os horários de funcionamento do seu restaurante
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(configuracoes.horarioFuncionamento).map(([dia, horario]) => (
                      <div key={dia} className="flex items-center space-x-4">
                        <div className="w-20">
                          <span className="capitalize font-medium">{dia}</span>
                        </div>
                        <Switch
                          checked={horario.ativo}
                          onCheckedChange={(checked) => handleHorarioChange(dia, 'ativo', checked)}
                        />
                        {horario.ativo && (
                          <>
                            <Input
                              type="time"
                              value={horario.abertura}
                              onChange={(e) => handleHorarioChange(dia, 'abertura', e.target.value)}
                              className="w-32"
                            />
                            <span>às</span>
                            <Input
                              type="time"
                              value={horario.fechamento}
                              onChange={(e) => handleHorarioChange(dia, 'fechamento', e.target.value)}
                              className="w-32"
                            />
                          </>
                        )}
                        {!horario.ativo && (
                          <span className="text-gray-500">Fechado</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Configurações de Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Entrega</CardTitle>
                  <p className="text-sm text-gray-600">
                    Configure as opções de entrega do seu restaurante
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tempoPreparoMedio">Tempo de Preparo Médio (min)</Label>
                      <Input
                        id="tempoPreparoMedio"
                        type="number"
                        value={configuracoes.tempoPreparoMedio}
                        onChange={(e) => setConfiguracoes({...configuracoes, tempoPreparoMedio: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="valorMinimoEntrega">Valor Mínimo para Entrega (R$)</Label>
                      <Input
                        id="valorMinimoEntrega"
                        type="number"
                        step="0.01"
                        value={configuracoes.valorMinimoEntrega}
                        onChange={(e) => setConfiguracoes({...configuracoes, valorMinimoEntrega: parseFloat(e.target.value)})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="taxaEntrega">Taxa de Entrega (R$)</Label>
                      <Input
                        id="taxaEntrega"
                        type="number"
                        step="0.01"
                        value={configuracoes.taxaEntrega}
                        onChange={(e) => setConfiguracoes({...configuracoes, taxaEntrega: parseFloat(e.target.value)})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="raioEntrega">Raio de Entrega (km)</Label>
                      <Input
                        id="raioEntrega"
                        type="number"
                        value={configuracoes.raioEntrega}
                        onChange={(e) => setConfiguracoes({...configuracoes, raioEntrega: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <Switch
                      checked={configuracoes.aceitaPedidosOnline}
                      onCheckedChange={(checked) => setConfiguracoes({...configuracoes, aceitaPedidosOnline: checked})}
                    />
                    <Label>Aceitar pedidos online</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Botão Salvar */}
              <div className="flex justify-end">
                <Button 
                  onClick={salvarConfiguracoes}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardRestaurante;
