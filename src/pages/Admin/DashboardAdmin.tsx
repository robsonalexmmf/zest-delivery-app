import React, { useState, useEffect } from 'react';
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

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  tipo: 'cliente' | 'restaurante' | 'entregador';
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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
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
    carregarDados();
  }, []);

  const carregarDados = () => {
    // Simulando dados expandidos de usuários
    const usuariosMock: Usuario[] = [
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
        nome: 'Pizza Deliciosa',
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
        nome: 'Maria Santos',
        email: 'maria@test.com',
        telefone: '(11) 77777-7777',
        endereco: 'Rua B, 789',
        tipo: 'cliente',
        status: 'ativo',
        dataCadastro: '2024-01-18',
        ultimoAcesso: '2024-01-19',
        totalPedidos: 8,
        totalGasto: 234.90
      },
      {
        id: '5',
        nome: 'Burger House',
        email: 'burger@test.com',
        telefone: '(11) 4444-4444',
        endereco: 'Av. Principal, 321',
        tipo: 'restaurante',
        status: 'suspenso',
        dataCadastro: '2024-01-05',
        ultimoAcesso: '2024-01-15'
      }
    ];

    // Dados expandidos de pedidos
    const pedidosMock: Pedido[] = [
      {
        id: '1',
        cliente: 'João Silva',
        restaurante: 'Pizza Deliciosa',
        entregador: 'Carlos Entregador',
        status: 'entregue',
        valor: 45.90,
        data: '2024-01-20',
        hora: '19:30',
        metodoPagamento: 'pix'
      },
      {
        id: '2',
        cliente: 'Maria Santos',
        restaurante: 'Burger House',
        status: 'preparando',
        valor: 32.50,
        data: '2024-01-20',
        hora: '20:15',
        metodoPagamento: 'cartao'
      },
      {
        id: '3',
        cliente: 'João Silva',
        restaurante: 'Pizza Deliciosa',
        entregador: 'Carlos Entregador',
        status: 'entregue',
        valor: 67.80,
        data: '2024-01-19',
        hora: '18:45',
        metodoPagamento: 'dinheiro'
      }
    ];

    // Dados de suporte
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
        usuario: 'Pizza Deliciosa',
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
        restaurante: 'Pizza Deliciosa',
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
    setPedidos(pedidosMock);
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
      totalPedidos: pedidosMock.length,
      pedidosHoje: pedidosMock.filter(p => p.data === '2024-01-20').length,
      receitaTotal: pedidosMock.reduce((total, p) => total + p.valor, 0),
      mensalidadesPendentes,
      receitaMensalidades,
      suportesAbertos,
      mediaAvaliacoes: 4.5,
      crescimentoMensal: 15.3,
      ticketMedio: pedidosMock.reduce((total, p) => total + p.valor, 0) / pedidosMock.length
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
      preparando: 'bg-yellow-100 text-yellow-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      pago: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      atrasado: 'bg-red-100 text-red-800',
      aberto: 'bg-red-100 text-red-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      resolvido: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
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
    return planos[plano as keyof typeof planos];
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesTipo = filtroTipo === 'todos' || usuario.tipo === filtroTipo;
    const matchesStatus = filtroStatus === 'todos' || usuario.status === filtroStatus;
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTipo && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="admin" userName="Administrador" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Central de controle completa da plataforma Z Delivery</p>
        </div>

        {/* Cards de Estatísticas Expandidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClientes + stats.totalRestaurantes + stats.totalEntregadores}</div>
              <p className="text-xs text-green-600">+{stats.crescimentoMensal}% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.receitaTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ticket médio: R$ {stats.ticketMedio.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suporte Aberto</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.suportesAbertos}</div>
              <p className="text-xs text-muted-foreground">Tickets pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.mediaAvaliacoes}</div>
              <p className="text-xs text-muted-foreground">Satisfação geral</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs expandidas */}
        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="suporte">Suporte</TabsTrigger>
            <TabsTrigger value="configuracoes">Config</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários da plataforma
                </CardDescription>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="cliente">Clientes</SelectItem>
                      <SelectItem value="restaurante">Restaurantes</SelectItem>
                      <SelectItem value="entregador">Entregadores</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativos</SelectItem>
                      <SelectItem value="inativo">Inativos</SelectItem>
                      <SelectItem value="suspenso">Suspensos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Info Extra</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosFiltrados.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell className="capitalize">{usuario.tipo}</TableCell>
                        <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                        <TableCell>{usuario.dataCadastro}</TableCell>
                        <TableCell>
                          {usuario.tipo === 'cliente' && (
                            <span className="text-sm text-gray-600">
                              {usuario.totalPedidos} pedidos | R$ {usuario.totalGasto?.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(usuario);
                                setShowUserDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alterarStatusUsuario(usuario.id, 
                                usuario.status === 'ativo' ? 'suspenso' : 'ativo'
                              )}
                            >
                              {usuario.status === 'ativo' ? 
                                <Ban className="h-4 w-4 text-red-500" /> : 
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              }
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pedidos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitorar Pedidos</CardTitle>
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
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Pagamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-medium">#{pedido.id}</TableCell>
                        <TableCell>{pedido.cliente}</TableCell>
                        <TableCell>{pedido.restaurante}</TableCell>
                        <TableCell>{pedido.entregador || '-'}</TableCell>
                        <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                        <TableCell>R$ {pedido.valor.toFixed(2)}</TableCell>
                        <TableCell>{pedido.data} {pedido.hora}</TableCell>
                        <TableCell className="capitalize">{pedido.metodoPagamento}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mensalidades</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {stats.receitaMensalidades.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mensalidades pagas este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {mensalidades.filter(m => m.status === 'pendente').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mensalidades a vencer
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {mensalidades.filter(m => m.status === 'atrasado').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mensalidades em atraso
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mensalidades dos Restaurantes</CardTitle>
                <CardDescription>
                  Gerencie os pagamentos das mensalidades dos restaurantes parceiros
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
                      <TableHead>Data Pagamento</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mensalidades.map((mensalidade) => (
                      <TableRow key={mensalidade.id}>
                        <TableCell className="font-medium">{mensalidade.restaurante}</TableCell>
                        <TableCell>{getPlanoNome(mensalidade.plano)}</TableCell>
                        <TableCell>R$ {mensalidade.valor.toFixed(2)}</TableCell>
                        <TableCell>{mensalidade.vencimento}</TableCell>
                        <TableCell>{getStatusBadge(mensalidade.status)}</TableCell>
                        <TableCell>{mensalidade.dataPagamento || '-'}</TableCell>
                        <TableCell>
                          {mensalidade.status !== 'pago' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => marcarMensalidadePaga(mensalidade.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Marcar como Pago
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

          <TabsContent value="suporte" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Central de Suporte</CardTitle>
                <CardDescription>
                  Gerencie todos os tickets de suporte da plataforma
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
                    {suportes.map((suporte) => (
                      <TableRow key={suporte.id}>
                        <TableCell className="font-medium">#{suporte.id}</TableCell>
                        <TableCell>{suporte.usuario}</TableCell>
                        <TableCell className="capitalize">{suporte.tipo}</TableCell>
                        <TableCell>{suporte.assunto}</TableCell>
                        <TableCell>{getStatusBadge(suporte.status)}</TableCell>
                        <TableCell>{getPrioridadeBadge(suporte.prioridade)}</TableCell>
                        <TableCell>{suporte.data}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {suporte.status !== 'resolvido' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => alterarStatusSuporte(suporte.id, 'em_andamento')}
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => alterarStatusSuporte(suporte.id, 'resolvido')}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                              </>
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

          <TabsContent value="configuracoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Gerencie as configurações globais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['financeiro', 'operacional', 'contato'].map(categoria => (
                    <div key={categoria}>
                      <h3 className="text-lg font-semibold mb-3 capitalize">{categoria}</h3>
                      <div className="space-y-3">
                        {configuracoes
                          .filter(config => config.categoria === categoria)
                          .map(config => (
                            <div key={config.id} className="flex items-center space-x-4">
                              <div className="flex-1">
                                <label className="text-sm font-medium">{config.descricao}</label>
                                <p className="text-xs text-gray-500">{config.chave}</p>
                              </div>
                              <Input
                                value={config.valor}
                                onChange={(e) => atualizarConfiguracao(config.id, e.target.value)}
                                className="w-48"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    R$ {stats.receitaTotal.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Total de receita gerada na plataforma
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Clientes:</span>
                      <span className="font-semibold">{stats.totalClientes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Restaurantes:</span>
                      <span className="font-semibold">{stats.totalRestaurantes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entregadores:</span>
                      <span className="font-semibold">{stats.totalEntregadores}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pedidos hoje:</span>
                      <span className="font-semibold">{stats.pedidosHoje}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ticket médio:</span>
                      <span className="font-semibold">R$ {stats.ticketMedio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avaliação média:</span>
                      <span className="font-semibold">{stats.mediaAvaliacoes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crescimento:</span>
                      <span className="font-semibold text-green-600">+{stats.crescimentoMensal}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>API Status:</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database:</span>
                      <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pagamentos:</span>
                      <Badge className="bg-green-100 text-green-800">Operacional</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Newsletter
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Backup Sistema
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog expandido para detalhes do usuário */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações completas do usuário selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Nome:</label>
                <p>{selectedUser.nome}</p>
              </div>
              <div>
                <label className="font-semibold">Email:</label>
                <p>{selectedUser.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{selectedUser.telefone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{selectedUser.endereco}</span>
              </div>
              <div>
                <label className="font-semibold">Tipo:</label>
                <p className="capitalize">{selectedUser.tipo}</p>
              </div>
              <div>
                <label className="font-semibold">Status:</label>
                <p>{getStatusBadge(selectedUser.status)}</p>
              </div>
              <div>
                <label className="font-semibold">Data de Cadastro:</label>
                <p>{selectedUser.dataCadastro}</p>
              </div>
              <div>
                <label className="font-semibold">Último Acesso:</label>
                <p>{selectedUser.ultimoAcesso}</p>
              </div>
              {selectedUser.tipo === 'cliente' && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">Total de Pedidos:</label>
                      <p>{selectedUser.totalPedidos}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Total Gasto:</label>
                      <p>R$ {selectedUser.totalGasto?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardAdmin;
