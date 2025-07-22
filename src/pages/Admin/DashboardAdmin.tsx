import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Store, Truck, ShoppingCart, Eye, Edit, Ban, CheckCircle, DollarSign, Calendar, AlertTriangle, TrendingUp, FileText, Settings, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Layout/Header';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { pagamentoService } from '@/services/pagamentoService';
import { pedidosService } from '@/services/pedidosService';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  tipo: 'cliente' | 'restaurante' | 'entregador' | 'admin';
  status: 'ativo' | 'inativo' | 'suspenso';
  dataCadastro: string;
  ultimoAcesso: string;
  totalPedidos?: number;
  totalGasto?: number;
}

interface Pedido {
  id: string;
  cliente: string;
  restaurante: string;
  entregador?: string;
  status: string;
  valor: number;
  data: string;
  hora: string;
  metodoPagamento: string;
}

interface Mensalidade {
  id: string;
  restaurante: string;
  plano: 'basico' | 'premium' | 'enterprise';
  valor: number;
  vencimento: string;
  status: 'pago' | 'pendente' | 'atrasado';
  dataPagamento?: string;
}

interface Suporte {
  id: string;
  usuario: string;
  tipo: string;
  assunto: string;
  status: 'aberto' | 'em_andamento' | 'resolvido';
  prioridade: 'baixa' | 'media' | 'alta';
  data: string;
  descricao: string;
}

interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  descricao: string;
  categoria: string;
}

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { userProfile, pedidos } = useSupabaseData();
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pedidosList, setPedidosList] = useState<Pedido[]>([]);
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [suportes, setSuportes] = useState<Suporte[]>([]);
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalRestaurantes: 0,
    totalEntregadores: 0,
    totalPedidos: 0,
    pedidosHoje: 0,
    receitaTotal: 0,
    mensalidadesPendentes: 0,
    receitaMensalidades: 0,
    suportesAbertos: 0,
    mediaAvaliacoes: 4.5,
    crescimentoMensal: 15.3,
    ticketMedio: 42.50
  });

  useEffect(() => {
    // Verificar se o usuário está logado e é admin
    const checkUserAccess = async () => {
      // Verificar se é usuário de teste primeiro
      const testUser = localStorage.getItem('zdelivery_test_user');
      if (testUser) {
        try {
          const { profile } = JSON.parse(testUser);
          if (profile.tipo !== 'admin') {
            toast({
              title: "Acesso negado",
              description: "Você não tem permissão para acessar esta página",
              variant: "destructive"
            });
            navigate('/auth');
          } else {
            carregarDados();
          }
          return;
        } catch (error) {
          console.error('Error loading test user:', error);
          localStorage.removeItem('zdelivery_test_user');
        }
      }

      // Aguardar o carregamento do usuário
      if (!user && userProfile === null) {
        return; // Ainda carregando
      }
      
      // Se não está autenticado após carregamento, redirecionar para login
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // Verificar se o perfil é do tipo admin
      if (userProfile && userProfile.tipo !== 'admin') {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive"
        });
        navigate('/auth');
      } else if (userProfile) {
        carregarDados();
      }
    };
    
    checkUserAccess();
  }, [user, userProfile, navigate]);

  const carregarDados = async () => {
    // Carregar dados reais do Supabase quando possível
    
    // Buscar perfis de usuários
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*');
    
    // Criar usuários a partir dos perfis
    const usuariosMock: Usuario[] = (profilesData || []).map((profile) => ({
      id: profile.id,
      nome: profile.nome || 'Sem nome',
      email: profile.email || 'sem@email.com',
      telefone: profile.telefone || 'Não informado',
      endereco: profile.endereco || 'Não informado',
      tipo: profile.tipo as any,
      status: 'ativo',
      dataCadastro: new Date(profile.created_at).toLocaleDateString('pt-BR'),
      ultimoAcesso: new Date(profile.updated_at).toLocaleDateString('pt-BR'),
      totalPedidos: 0,
      totalGasto: 0
    }));
    
    if (usuariosMock.length === 0) {
      // Dados simulados caso não tenha dados do Supabase
      usuariosMock.push(
        {
          id: '1',
          nome: 'João Silva',
          email: 'cliente@test.com',
          telefone: '(11) 99999-9999',
          endereco: 'Rua A, 123 - Centro',
          tipo: 'cliente',
          status: 'ativo',
          dataCadastro: '2024-01-15',
          ultimoAcesso: '2024-01-20',
          totalPedidos: 15,
          totalGasto: 487.50
        },
        {
          id: '2',
          nome: 'Pizzaria do Mario',
          email: 'restaurante@test.com',
          telefone: '(11) 3333-3333',
          endereco: 'Rua das Flores, 123',
          tipo: 'restaurante',
          status: 'ativo',
          dataCadastro: '2024-01-10',
          ultimoAcesso: '2024-01-20'
        },
        {
          id: '3',
          nome: 'Carlos Entregador',
          email: 'entregador@test.com',
          telefone: '(11) 88888-8888',
          endereco: 'Av. Central, 456',
          tipo: 'entregador',
          status: 'ativo',
          dataCadastro: '2024-01-12',
          ultimoAcesso: '2024-01-20'
        },
        {
          id: '4',
          nome: 'Admin Sistema',
          email: 'admin@test.com',
          telefone: '(11) 77777-7777',
          endereco: 'Rua Admin, 1',
          tipo: 'admin',
          status: 'ativo',
          dataCadastro: '2024-01-01',
          ultimoAcesso: '2024-01-21'
        }
      );
    }

    // Formatar pedidos para a exibição na tabela
    const pedidosFormatados = pedidos.map(p => ({
      id: p.id.substring(0, 8),
      cliente: p.profiles?.nome || 'Cliente',
      restaurante: p.restaurantes?.nome || 'Restaurante',
      entregador: p.entregadores?.profiles?.nome,
      status: p.status,
      valor: parseFloat(p.total),
      data: new Date(p.created_at).toLocaleDateString('pt-BR'),
      hora: new Date(p.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      metodoPagamento: p.metodo_pagamento
    }));

    // Dados de suporte simulados
    const suportesMock: Suporte[] = [
      {
        id: '1',
        usuario: 'João Silva',
        tipo: 'cliente',
        assunto: 'Problema com pagamento',
        status: 'aberto',
        prioridade: 'alta',
        data: '2024-01-20',
        descricao: 'Não consegui finalizar o pagamento via PIX'
      },
      {
        id: '2',
        usuario: 'Pizzaria do Mario',
        tipo: 'restaurante',
        assunto: 'Dúvida sobre comissões',
        status: 'em_andamento',
        prioridade: 'media',
        data: '2024-01-19',
        descricao: 'Gostaria de entender melhor as taxas cobradas'
      },
      {
        id: '3',
        usuario: 'Carlos Entregador',
        tipo: 'entregador',
        assunto: 'Problema no app',
        status: 'resolvido',
        prioridade: 'baixa',
        data: '2024-01-18',
        descricao: 'App travava ao aceitar entregas'
      }
    ];

    // Configurações do sistema
    const configuracoesMock: Configuracao[] = [
      {
        id: '1',
        chave: 'taxa_plataforma',
        valor: '12.5',
        descricao: 'Taxa da plataforma (%)',
        categoria: 'financeiro'
      },
      {
        id: '2',
        chave: 'tempo_entrega_maximo',
        valor: '60',
        descricao: 'Tempo máximo de entrega (min)',
        categoria: 'operacional'
      },
      {
        id: '3',
        chave: 'valor_minimo_pedido',
        valor: '15.00',
        descricao: 'Valor mínimo do pedido (R$)',
        categoria: 'operacional'
      },
      {
        id: '4',
        chave: 'email_suporte',
        valor: 'suporte@zdelivery.com',
        descricao: 'Email de suporte',
        categoria: 'contato'
      }
    ];

    // Carregando mensalidades (incluindo do serviço de pagamentos)
    const mensalidadesMock: Mensalidade[] = [
      {
        id: '1',
        restaurante: 'Pizzaria do Mario',
        plano: 'premium',
        valor: 79.90,
        vencimento: '2024-01-25',
        status: 'pago',
        dataPagamento: '2024-01-20'
      },
      {
        id: '2',
        restaurante: 'Burger House',
        plano: 'basico',
        valor: 29.90,
        vencimento: '2024-01-20',
        status: 'atrasado'
      },
      ...pagamentoService.getPagamentos().map(p => ({
        id: p.id,
        restaurante: p.restaurante,
        plano: p.plano as 'basico' | 'premium' | 'enterprise',
        valor: p.valor,
        vencimento: p.dataVencimento.split('T')[0],
        status: p.status === 'pago' ? 'pago' as const : 'pendente' as const,
        dataPagamento: p.status === 'pago' ? p.dataCriacao.split('T')[0] : undefined
      }))
    ];

    setUsuarios(usuariosMock);
    setPedidosList(pedidosFormatados);
    setMensalidades(mensalidadesMock);
    setSuportes(suportesMock);
    setConfiguracoes(configuracoesMock);
    
    // Calculando estatísticas expandidas
    const mensalidadesPendentes = mensalidadesMock.filter(m => m.status !== 'pago').length;
    const receitaMensalidades = mensalidadesMock
      .filter(m => m.status === 'pago')
      .reduce((total, m) => total + m.valor, 0);
    const suportesAbertos = suportesMock.filter(s => s.status !== 'resolvido').length;

    setStats({
      totalClientes: usuariosMock.filter(u => u.tipo === 'cliente').length,
      totalRestaurantes: usuariosMock.filter(u => u.tipo === 'restaurante').length,
      totalEntregadores: usuariosMock.filter(u => u.tipo === 'entregador').length,
      totalPedidos: pedidosFormatados.length,
      pedidosHoje: pedidosFormatados.filter(p => p.data === new Date().toLocaleDateString('pt-BR')).length,
      receitaTotal: pedidosFormatados.reduce((total, p) => total + p.valor, 0),
      mensalidadesPendentes,
      receitaMensalidades,
      suportesAbertos,
      mediaAvaliacoes: 4.5,
      crescimentoMensal: 15.3,
      ticketMedio: pedidosFormatados.length > 0 ? pedidosFormatados.reduce((total, p) => total + p.valor, 0) / pedidosFormatados.length : 0
    });
  };

  const alterarStatusUsuario = (userId: string, novoStatus: 'ativo' | 'inativo' | 'suspenso') => {
    setUsuarios(prev => prev.map(user => 
      user.id === userId ? { ...user, status: novoStatus } : user
    ));
    
    toast({
      title: 'Status atualizado',
      description: `Status do usuário alterado para ${novoStatus}`,
    });
  };

  const marcarMensalidadePaga = (mensalidadeId: string) => {
    setMensalidades(prev => prev.map(m => 
      m.id === mensalidadeId ? { 
        ...m, 
        status: 'pago' as const, 
        dataPagamento: new Date().toISOString().split('T')[0] 
      } : m
    ));
    
    toast({
      title: 'Mensalidade confirmada',
      description: 'Pagamento da mensalidade foi confirmado.',
    });
  };

  const alterarStatusSuporte = (suporteId: string, novoStatus: 'aberto' | 'em_andamento' | 'resolvido') => {
    setSuportes(prev => prev.map(s => 
      s.id === suporteId ? { ...s, status: novoStatus } : s
    ));
    
    toast({
      title: 'Status do suporte atualizado',
      description: `Ticket alterado para ${novoStatus}`,
    });
  };

  const atualizarConfiguracao = (configId: string, novoValor: string) => {
    setConfiguracoes(prev => prev.map(c => 
      c.id === configId ? { ...c, valor: novoValor } : c
    ));
    
    toast({
      title: 'Configuração atualizada',
      description: 'A configuração foi salva com sucesso',
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      suspenso: 'bg-red-100 text-red-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      em_preparo: 'bg-blue-100 text-blue-800',
      pronto: 'bg-purple-100 text-purple-800',
      saiu_para_entrega: 'bg-orange-100 text-orange-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      pago: 'bg-green-100 text-green-800',
      atrasado: 'bg-red-100 text-red-800',
      aberto: 'bg-red-100 text-red-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      resolvido: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const colors = {
      baixa: 'bg-blue-100 text-blue-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[prioridade as keyof typeof colors]}>
        {prioridade}
      </Badge>
    );
  };

  const getPlanoNome = (plano: string) => {
    const planos = {
      basico: 'Básico',
      premium: 'Premium',
      enterprise: 'Enterprise'
    };
    return planos[plano as keyof typeof planos] || plano;
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesTipo = filtroTipo === 'todos' || usuario.tipo === filtroTipo;
    const matchesStatus = filtroStatus === 'todos' || usuario.status === filtroStatus;
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTipo && matchesStatus && matchesSearch;
  });

  // Retornar null enquanto carrega ou se não tiver usuário
  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="admin" userName={userProfile.nome || "Administrador"} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie toda a plataforma ZDelivery
          </p>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Clientes
                </CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalClientes}
              </div>
              <p className="text-xs text-gray-500">
                +8% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Restaurantes
                </CardTitle>
                <Store className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalRestaurantes}
              </div>
              <p className="text-xs text-gray-500">
                +12% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Entregadores
                </CardTitle>
                <Truck className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalEntregadores}
              </div>
              <p className="text-xs text-gray-500">
                +5% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pedidos Hoje
                </CardTitle>
                <ShoppingCart className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.pedidosHoje}
              </div>
              <p className="text-xs text-gray-500">
                de {stats.totalPedidos} total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
            <TabsTrigger value="suporte">Suporte</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* Tab Usuários */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-80"
                  />
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="md:w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="cliente">Clientes</SelectItem>
                      <SelectItem value="restaurante">Restaurantes</SelectItem>
                      <SelectItem value="entregador">Entregadores</SelectItem>
                      <SelectItem value="admin">Administradores</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="md:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosFiltrados.map(usuario => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{usuario.tipo}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                        <TableCell>{usuario.ultimoAcesso}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(usuario);
                                setShowUserDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {usuario.status === 'ativo' ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => alterarStatusUsuario(usuario.id, 'suspenso')}
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => alterarStatusUsuario(usuario.id, 'ativo')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Pedidos */}
          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle>Monitoramento de Pedidos</CardTitle>
                <CardDescription>
                  Acompanhe todos os pedidos da plataforma em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Restaurante</TableHead>
                      <TableHead>Entregador</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Pagamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidosList.map(pedido => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-medium">#{pedido.id}</TableCell>
                        <TableCell>{pedido.cliente}</TableCell>
                        <TableCell>{pedido.restaurante}</TableCell>
                        <TableCell>{pedido.entregador || '-'}</TableCell>
                        <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                        <TableCell>R$ {pedido.valor.toFixed(2)}</TableCell>
                        <TableCell>{pedido.data} {pedido.hora}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{pedido.metodoPagamento}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Mensalidades */}
          <TabsContent value="mensalidades">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Mensalidades</CardTitle>
                <CardDescription>
                  Gerencie os pagamentos dos planos dos restaurantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurante</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mensalidades.map(mensalidade => (
                      <TableRow key={mensalidade.id}>
                        <TableCell className="font-medium">{mensalidade.restaurante}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getPlanoNome(mensalidade.plano)}</Badge>
                        </TableCell>
                        <TableCell>R$ {mensalidade.valor.toFixed(2)}</TableCell>
                        <TableCell>{mensalidade.vencimento}</TableCell>
                        <TableCell>{getStatusBadge(mensalidade.status)}</TableCell>
                        <TableCell>
                          {mensalidade.status !== 'pago' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => marcarMensalidadePaga(mensalidade.id)}
                            >
                              Confirmar Pagamento
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Suporte */}
          <TabsContent value="suporte">
            <Card>
              <CardHeader>
                <CardTitle>Central de Suporte</CardTitle>
                <CardDescription>
                  Gerencie tickets de suporte dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suportes.map(suporte => (
                      <TableRow key={suporte.id}>
                        <TableCell>#{suporte.id}</TableCell>
                        <TableCell>{suporte.usuario}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{suporte.tipo}</Badge>
                        </TableCell>
                        <TableCell>{suporte.assunto}</TableCell>
                        <TableCell>{getStatusBadge(suporte.status)}</TableCell>
                        <TableCell>{getPrioridadeBadge(suporte.prioridade)}</TableCell>
                        <TableCell>{suporte.data}</TableCell>
                        <TableCell>
                          <Select
                            value={suporte.status}
                            onValueChange={(value) => alterarStatusSuporte(suporte.id, value as any)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aberto">Aberto</SelectItem>
                              <SelectItem value="em_andamento">Em Andamento</SelectItem>
                              <SelectItem value="resolvido">Resolvido</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Configurações */}
          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure parâmetros globais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {configuracoes.map(config => (
                    <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{config.descricao}</h4>
                        <p className="text-sm text-gray-500">Categoria: {config.categoria}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={config.valor}
                          onChange={(e) => atualizarConfiguracao(config.id, e.target.value)}
                          className="w-32"
                        />
                        <Button size="sm" variant="outline">
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de Detalhes do Usuário */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>
                Informações completas do usuário selecionado
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Nome:</strong>
                    <p>{selectedUser.nome}</p>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <strong>Telefone:</strong>
                    <p>{selectedUser.telefone}</p>
                  </div>
                  <div>
                    <strong>Tipo:</strong>
                    <p>{selectedUser.tipo}</p>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <p>{selectedUser.status}</p>
                  </div>
                  <div>
                    <strong>Data de Cadastro:</strong>
                    <p>{selectedUser.dataCadastro}</p>
                  </div>
                </div>
                <div>
                  <strong>Endereço:</strong>
                  <p>{selectedUser.endereco}</p>
                </div>
                {selectedUser.tipo === 'cliente' && selectedUser.totalPedidos !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Total de Pedidos:</strong>
                      <p>{selectedUser.totalPedidos}</p>
                    </div>
                    <div>
                      <strong>Total Gasto:</strong>
                      <p>R$ {selectedUser.totalGasto?.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DashboardAdmin;