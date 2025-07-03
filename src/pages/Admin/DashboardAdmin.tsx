
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Store, Truck, ShoppingCart, Eye, Edit, Ban, CheckCircle } from 'lucide-react';
import Header from '@/components/Layout/Header';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'restaurante' | 'entregador';
  status: 'ativo' | 'inativo' | 'suspenso';
  dataCadastro: string;
  ultimoAcesso: string;
}

interface Pedido {
  id: string;
  cliente: string;
  restaurante: string;
  entregador?: string;
  status: string;
  valor: number;
  data: string;
}

const DashboardAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalRestaurantes: 0,
    totalEntregadores: 0,
    totalPedidos: 0,
    pedidosHoje: 0,
    receitaTotal: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    // Simulando dados de usuários
    const usuariosMock: Usuario[] = [
      {
        id: '1',
        nome: 'João Silva',
        email: 'cliente@test.com',
        tipo: 'cliente',
        status: 'ativo',
        dataCadastro: '2024-01-15',
        ultimoAcesso: '2024-01-20'
      },
      {
        id: '2',
        nome: 'Pizza Deliciosa',
        email: 'restaurante@test.com',
        tipo: 'restaurante',
        status: 'ativo',
        dataCadastro: '2024-01-10',
        ultimoAcesso: '2024-01-20'
      },
      {
        id: '3',
        nome: 'Carlos Entregador',
        email: 'entregador@test.com',
        tipo: 'entregador',
        status: 'ativo',
        dataCadastro: '2024-01-12',
        ultimoAcesso: '2024-01-20'
      }
    ];

    // Simulando dados de pedidos
    const pedidosMock: Pedido[] = [
      {
        id: '1',
        cliente: 'João Silva',
        restaurante: 'Pizza Deliciosa',
        entregador: 'Carlos Entregador',
        status: 'entregue',
        valor: 45.90,
        data: '2024-01-20'
      },
      {
        id: '2',
        cliente: 'João Silva',
        restaurante: 'Pizza Deliciosa',
        status: 'preparando',
        valor: 32.50,
        data: '2024-01-20'
      }
    ];

    setUsuarios(usuariosMock);
    setPedidos(pedidosMock);
    
    // Calculando estatísticas
    setStats({
      totalClientes: usuariosMock.filter(u => u.tipo === 'cliente').length,
      totalRestaurantes: usuariosMock.filter(u => u.tipo === 'restaurante').length,
      totalEntregadores: usuariosMock.filter(u => u.tipo === 'entregador').length,
      totalPedidos: pedidosMock.length,
      pedidosHoje: pedidosMock.filter(p => p.data === '2024-01-20').length,
      receitaTotal: pedidosMock.reduce((total, p) => total + p.valor, 0)
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

  const getStatusBadge = (status: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      suspenso: 'bg-red-100 text-red-800',
      preparando: 'bg-yellow-100 text-yellow-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="admin" userName="Administrador" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Gerencie todos os usuários e monitore a plataforma</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClientes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restaurantes</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRestaurantes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregadores</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntregadores}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pedidosHoje}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes seções */}
        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários da plataforma
                </CardDescription>
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
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell className="capitalize">{usuario.tipo}</TableCell>
                        <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                        <TableCell>{usuario.dataCadastro}</TableCell>
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
                      <TableHead>Data</TableHead>
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
                        <TableCell>{pedido.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para detalhes do usuário */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações detalhadas do usuário selecionado
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardAdmin;
