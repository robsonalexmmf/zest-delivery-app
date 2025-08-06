import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Package, TrendingUp, Users, Clock, Settings, Bell, MapPin, Phone, Mail, Camera, BarChart3, PieChart, LineChart, Target, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import StatisticsChart from '@/components/common/StatisticsChart';
import ConfiguracoesAvancadas from '@/components/Restaurante/ConfiguracoesAvancadas';
import AvaliacoesRestaurante from '@/components/Restaurante/AvaliacoesRestaurante';
import ImageUpload from '@/components/common/ImageUpload';
import { useAuth } from '@/hooks/useAuth';
import { pedidosService, Pedido } from '@/services/pedidosService';

const DashboardRestaurante: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [pedidosRecentes, setPedidosRecentes] = useState<Pedido[]>([]);
  const [configuracoes, setConfiguracoes] = useState({
    nome: '',
    categoria: '',
    cidade: '',
    telefone: '',
    email: '',
    endereco: '',
    descricao: '',
    horario_funcionamento: {
      abertura: '08:00',
      fechamento: '22:00'
    },
    taxa_entrega: 5.00,
    tempo_preparo_medio: 30,
    logo: '',
    banner: '',
    aceita_pix: true,
    aceita_cartao: true,
    aceita_dinheiro: true,
    // Configuração PIX do restaurante
    pix: {
      ativo: true,
      chave: '',
      tipo: 'cpf' as 'cpf' | 'email' | 'telefone' | 'aleatorio'
    },
    // Configurações avançadas
    raio_entrega: 5,
    valor_minimo_pedido: 20,
    ceps_atendimento: '',
    categorias_personalizadas: [],
    horarios_especiais: [],
    notificacoes_pedidos: true,
    notificacoes_cancelamentos: true,
    relatorios_diarios: false,
    entrega_propria: false,
    retirada_local: true,
    tempo_preparo_estimado: 30,
    tempo_entrega_estimado: 30
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !profile) {
        navigate('/auth');
      } else if (profile.tipo !== 'restaurante') {
        navigate('/auth');
      } else {
        carregarConfiguracoes();
      }
    }

    // Escutar evento customizado para abrir configurações
    const handleOpenConfig = () => {
      setShowConfigDialog(true);
    };

    window.addEventListener('openRestaurantConfig', handleOpenConfig);

    return () => {
      window.removeEventListener('openRestaurantConfig', handleOpenConfig);
    };
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (!user || !profile) return;

    const unsubscribe = pedidosService.subscribe((pedidos) => {
      // Filtrar pedidos do restaurante atual
      const pedidosRestaurante = pedidos.filter(p => p.restaurante.nome === profile.nome);
      setPedidosRecentes(pedidosRestaurante.slice(0, 5)); // Mostrar apenas os 5 mais recentes
    });

    return unsubscribe;
  }, [user, profile]);

  const carregarConfiguracoes = () => {
    const configSalvas = localStorage.getItem('restaurant_config');
    if (configSalvas) {
      const config = JSON.parse(configSalvas);
      setConfiguracoes(config);
    }
  };

  // Dados mockados para estatísticas com mais detalhes
  const estatisticas = {
    vendas_hoje: 1247.80,
    pedidos_hoje: 23,
    ticket_medio: 54.25,
    crescimento: 15.2,
    pedidos_pendentes: 5,
    avaliacoes: 4.7,
    tempo_medio_entrega: 28,
    faturamento_mensal: 24680.50,
    clientes_ativos: 156,
    produtos_vendidos_hoje: 89,
    taxa_cancelamento: 2.1
  };

  // Dados para gráficos
  const dadosVendasSemana = [
    { name: 'Seg', vendas: 890, pedidos: 15 },
    { name: 'Ter', vendas: 1200, pedidos: 22 },
    { name: 'Qua', vendas: 980, pedidos: 18 },
    { name: 'Qui', vendas: 1350, pedidos: 25 },
    { name: 'Sex', vendas: 1680, pedidos: 32 },
    { name: 'Sáb', vendas: 2100, pedidos: 38 },
    { name: 'Dom', vendas: 1850, pedidos: 35 }
  ];

  const dadosProdutosMaisVendidos = [
    { name: 'Pizza Margherita', value: 45 },
    { name: 'Pizza Calabresa', value: 32 },
    { name: 'Pizza Portuguesa', value: 28 },
    { name: 'Pizza 4 Queijos', value: 25 },
    { name: 'Bebidas', value: 40 }
  ];

  const dadosHorariosPico = [
    { name: '11h', pedidos: 8 },
    { name: '12h', pedidos: 15 },
    { name: '13h', pedidos: 12 },
    { name: '18h', pedidos: 18 },
    { name: '19h', pedidos: 25 },
    { name: '20h', pedidos: 22 },
    { name: '21h', pedidos: 15 }
  ];

  const categorias = [
    'Pizzaria', 'Hamburgueria', 'Comida Japonesa', 'Comida Italiana', 
    'Comida Brasileira', 'Lanches', 'Doces & Sobremesas', 'Bebidas',
    'Comida Saudável', 'Comida Mexicana', 'Frutos do Mar', 'Churrascaria'
  ];

  const cidades = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 
    'Brasília', 'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 
    'Manaus', 'Belém', 'Goiânia', 'Campinas', 'São Luis'
  ];

  const salvarConfiguracoes = (novasConfiguracoes: any) => {
    const configParaSalvar = { ...configuracoes, ...novasConfiguracoes };
    setConfiguracoes(configParaSalvar);
    localStorage.setItem('restaurant_config', JSON.stringify(configParaSalvar));
    
    toast({
      title: 'Configurações salvas!',
      description: 'As configurações do restaurante foram atualizadas.',
    });
  };

  const salvarConfiguracaoBasica = () => {
    salvarConfiguracoes(configuracoes);
    setShowConfigDialog(false);
  };

  const handleTestarPix = () => {
    if (!configuracoes.pix.chave.trim()) {
      toast({
        title: 'Informe a chave PIX',
        description: 'Digite sua chave PIX antes de testar.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Testando chave PIX...',
      description: 'Verificando se a chave é válida.',
    });

    // Simular validação
    setTimeout(() => {
      toast({
        title: 'Chave PIX válida!',
        description: 'Sua chave está configurada corretamente.',
      });
    }, 2000);
  };

  if (loading || !user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="restaurante" userName={profile.nome} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header do Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard - {profile.nome}
              </h1>
              <p className="text-gray-600">
                Gerencie seu restaurante e acompanhe o desempenho
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/pedidos-restaurante')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Ver Pedidos
              </Button>
              
              <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Configurações do Restaurante</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="basico" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basico">Configurações Básicas</TabsTrigger>
                      <TabsTrigger value="avancadas">Configurações Avançadas</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basico" className="space-y-6">
                      {/* Informações Básicas */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="nome">Nome do Restaurante</Label>
                            <Input
                              id="nome"
                              value={configuracoes.nome}
                              onChange={(e) => setConfiguracoes(prev => ({ ...prev, nome: e.target.value }))}
                              placeholder="Nome do seu restaurante"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="categoria">Categoria</Label>
                            <Select 
                              value={configuracoes.categoria} 
                              onValueChange={(value) => setConfiguracoes(prev => ({ ...prev, categoria: value }))}
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

                          <div>
                            <Label htmlFor="cidade">Cidade</Label>
                            <Select 
                              value={configuracoes.cidade} 
                              onValueChange={(value) => setConfiguracoes(prev => ({ ...prev, cidade: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione sua cidade" />
                              </SelectTrigger>
                              <SelectContent>
                                {cidades.map(cidade => (
                                  <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                              id="telefone"
                              value={configuracoes.telefone}
                              onChange={(e) => setConfiguracoes(prev => ({ ...prev, telefone: e.target.value }))}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="endereco">Endereço Completo</Label>
                            <Textarea
                              id="endereco"
                              value={configuracoes.endereco}
                              onChange={(e) => setConfiguracoes(prev => ({ ...prev, endereco: e.target.value }))}
                              placeholder="Endereço completo do restaurante"
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                              id="descricao"
                              value={configuracoes.descricao}
                              onChange={(e) => setConfiguracoes(prev => ({ ...prev, descricao: e.target.value }))}
                              placeholder="Descrição do seu restaurante"
                              rows={4}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="taxa-entrega">Taxa de Entrega (R$)</Label>
                              <Input
                                id="taxa-entrega"
                                type="number"
                                step="0.01"
                                value={configuracoes.taxa_entrega}
                                onChange={(e) => setConfiguracoes(prev => ({ 
                                  ...prev, 
                                  taxa_entrega: parseFloat(e.target.value) || 0 
                                }))}
                              />
                            </div>

                            <div>
                              <Label htmlFor="tempo-preparo">Tempo Preparo (min)</Label>
                              <Input
                                id="tempo-preparo"
                                type="number"
                                value={configuracoes.tempo_preparo_medio}
                                onChange={(e) => setConfiguracoes(prev => ({ 
                                  ...prev, 
                                  tempo_preparo_medio: parseInt(e.target.value) || 30 
                                }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Horários de Funcionamento */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Horários de Funcionamento</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="abertura">Abertura</Label>
                            <Input
                              id="abertura"
                              type="time"
                              value={configuracoes.horario_funcionamento.abertura}
                              onChange={(e) => setConfiguracoes(prev => ({ 
                                ...prev, 
                                horario_funcionamento: { 
                                  ...prev.horario_funcionamento, 
                                  abertura: e.target.value 
                                } 
                              }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="fechamento">Fechamento</Label>
                            <Input
                              id="fechamento"
                              type="time"
                              value={configuracoes.horario_funcionamento.fechamento}
                              onChange={(e) => setConfiguracoes(prev => ({ 
                                ...prev, 
                                horario_funcionamento: { 
                                  ...prev.horario_funcionamento, 
                                  fechamento: e.target.value 
                                } 
                              }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Configurações PIX */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Configurações PIX</h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={configuracoes.pix.ativo}
                              onCheckedChange={(checked) => setConfiguracoes(prev => ({ 
                                ...prev, 
                                pix: { ...prev.pix, ativo: checked } 
                              }))}
                            />
                            <Label>Aceitar PIX</Label>
                          </div>

                          {configuracoes.pix.ativo && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="tipo-chave">Tipo de Chave PIX</Label>
                                <Select 
                                  value={configuracoes.pix.tipo}
                                  onValueChange={(value: any) => setConfiguracoes(prev => ({ 
                                    ...prev, 
                                    pix: { ...prev.pix, tipo: value } 
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cpf">CPF</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="telefone">Telefone</SelectItem>
                                    <SelectItem value="aleatorio">Chave Aleatória</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="chave-pix">Chave PIX</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id="chave-pix"
                                    value={configuracoes.pix.chave}
                                    onChange={(e) => setConfiguracoes(prev => ({ 
                                      ...prev, 
                                      pix: { ...prev.pix, chave: e.target.value } 
                                    }))}
                                    placeholder="Sua chave PIX"
                                  />
                                  <Button 
                                    variant="outline" 
                                    onClick={handleTestarPix}
                                    disabled={!configuracoes.pix.chave.trim()}
                                  >
                                    Testar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Métodos de Pagamento */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Métodos de Pagamento Aceitos</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={configuracoes.aceita_pix}
                              onCheckedChange={(checked) => setConfiguracoes(prev => ({ ...prev, aceita_pix: checked }))}
                            />
                            <Label>PIX</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={configuracoes.aceita_cartao}
                              onCheckedChange={(checked) => setConfiguracoes(prev => ({ ...prev, aceita_cartao: checked }))}
                            />
                            <Label>Cartão de Crédito/Débito</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={configuracoes.aceita_dinheiro}
                              onCheckedChange={(checked) => setConfiguracoes(prev => ({ ...prev, aceita_dinheiro: checked }))}
                            />
                            <Label>Dinheiro</Label>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex justify-end space-x-4 pt-6">
                        <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={salvarConfiguracaoBasica} className="bg-red-600 hover:bg-red-700">
                          Salvar Configurações
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="avancadas">
                      <ConfiguracoesAvancadas 
                        configuracoes={configuracoes}
                        onSave={salvarConfiguracoes}
                      />
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Abas principais do Dashboard */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards de Estatísticas Expandidos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    R$ {estatisticas.vendas_hoje.toFixed(2)}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{estatisticas.crescimento}% vs ontem
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
                    {estatisticas.pedidos_hoje}
                  </div>
                  <p className="text-xs text-gray-500">
                    Ticket médio: R$ {estatisticas.ticket_medio.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Avaliação
                    </CardTitle>
                    <Users className="w-4 h-4 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {estatisticas.avaliacoes}/5
                  </div>
                  <p className="text-xs text-gray-500">
                    {estatisticas.clientes_ativos} clientes ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Tempo Médio
                    </CardTitle>
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {estatisticas.tempo_medio_entrega}min
                  </div>
                  <p className="text-xs text-gray-500">
                    Preparo + entrega
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos e Analytics */}
            <div className="grid lg:grid-cols-2 gap-6">
              <StatisticsChart
                data={dadosVendasSemana}
                title="Vendas da Semana"
                type="bar"
                dataKey="vendas"
                xAxisKey="name"
              />
              
              <StatisticsChart
                data={dadosProdutosMaisVendidos}
                title="Produtos Mais Vendidos"
                type="pie"
                dataKey="value"
              />
            </div>

            {/* Ações Rápidas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => navigate('/produtos')}
                className="h-16 bg-red-600 hover:bg-red-700"
              >
                <Package className="w-5 h-5 mr-2" />
                Gerenciar Produtos
              </Button>
              
              <Button 
                onClick={() => navigate('/pedidos-restaurante')}
                variant="outline"
                className="h-16"
              >
                <Bell className="w-5 h-5 mr-2" />
                Ver Pedidos ({estatisticas.pedidos_pendentes})
              </Button>
              
              <Button 
                onClick={() => navigate('/relatorios')}
                variant="outline"
                className="h-16"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Relatórios
              </Button>
              
              <Button 
                variant="outline"
                className="h-16"
                onClick={() => setShowConfigDialog(true)}
              >
                <Settings className="w-5 h-5 mr-2" />
                Configurações
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {pedidosRecentes.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum pedido encontrado</p>
                    <Button 
                      onClick={() => navigate('/pedidos-restaurante')}
                      className="mt-4 bg-red-600 hover:bg-red-700"
                    >
                      Ver Todos os Pedidos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidosRecentes.map(pedido => (
                      <div key={pedido.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">Pedido #{pedido.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-600">Cliente: {pedido.cliente.nome}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              pedido.status === 'entregue' ? 'bg-green-100 text-green-800' :
                              pedido.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {pedido.status}
                            </Badge>
                            <p className="text-lg font-bold text-green-600 mt-1">
                              R$ {pedido.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {pedido.data} às {pedido.hora} • {pedido.itens.length} itens
                        </p>
                      </div>
                    ))}
                    <Button 
                      onClick={() => navigate('/pedidos-restaurante')}
                      className="w-full mt-4 bg-red-600 hover:bg-red-700"
                    >
                      Ver Todos os Pedidos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avaliacoes">
            <AvaliacoesRestaurante restauranteNome={profile.nome} />
          </TabsContent>

          <TabsContent value="relatorios">
            <div className="grid lg:grid-cols-2 gap-6">
              <StatisticsChart
                data={dadosHorariosPico}
                title="Horários de Pico"
                type="line"
                dataKey="pedidos"
                xAxisKey="name"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Metas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Faturamento</span>
                      <span>R$ 24.680 / R$ 30.000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pedidos</span>
                      <span>680 / 800</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Novos Clientes</span>
                      <span>45 / 60</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardRestaurante;
