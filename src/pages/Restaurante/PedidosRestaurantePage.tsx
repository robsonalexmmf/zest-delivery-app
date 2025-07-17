
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Clock, 
  Eye,
  Bell
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { pedidosService, Pedido } from '@/services/pedidosService';

const PedidosRestaurantePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('pendente');
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [detalhesAberto, setDetalhesAberto] = useState<boolean>(false);
  const [observacoes, setObservacoes] = useState<string>('');
  const [novosPedidos, setNovosPedidos] = useState<number>(0);

  useEffect(() => {
    // Verificar se é usuário de teste primeiro
    const testUser = localStorage.getItem('zdelivery_test_user');
    if (testUser) {
      try {
        const { profile } = JSON.parse(testUser);
        if (profile.tipo !== 'restaurante') {
          navigate('/login');
        } else {
          setUser(profile);
        }
        return;
      } catch (error) {
        console.error('Error loading test user:', error);
        localStorage.removeItem('zdelivery_test_user');
      }
    }

    // Verificar usuário normal
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'restaurante') {
        navigate('/login');
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = pedidosService.subscribe((todosPedidos) => {
      const pedidosRestaurante = pedidosService.getPedidosPorRestaurante(user.nome);
      
      // Detectar novos pedidos pendentes
      const pedidosPendentes = pedidosRestaurante.filter(p => p.status === 'pendente');
      const pedidosPendentesAnteriores = pedidos.filter(p => p.status === 'pendente');
      
      if (pedidosPendentes.length > pedidosPendentesAnteriores.length) {
        const novosPedidosCount = pedidosPendentes.length - pedidosPendentesAnteriores.length;
        setNovosPedidos(novosPedidosCount);
        
        toast({
          title: '🔔 Novo Pedido Recebido!',
          description: `Você tem ${novosPedidosCount} novo(s) pedido(s) pendente(s).`,
        });

        // Tocar som de notificação (opcional)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Novo Pedido ZDelivery', {
            body: `Novo pedido de ${pedidosPendentes[pedidosPendentes.length - 1].cliente.nome}`,
            icon: '/favicon.ico'
          });
        }
      }
      
      setPedidos(pedidosRestaurante);
    });

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return unsubscribe;
  }, [user, pedidos]);

  const filtrarPedidos = () => {
    let pedidosFiltrados = pedidos;

    if (filtroStatus) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.status === filtroStatus);
    }

    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      pedidosFiltrados = pedidosFiltrados.filter(pedido =>
        pedido.cliente.nome.toLowerCase().includes(termo) ||
        pedido.cliente.endereco.toLowerCase().includes(termo) ||
        pedido.id.includes(termo)
      );
    }

    if (dataInicio && dataFim) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido => {
        const dataPedido = new Date(pedido.data);
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        return dataPedido >= inicio && dataPedido <= fim;
      });
    }

    return pedidosFiltrados;
  };

  const handleStatusChange = (id: string, novoStatus: Pedido['status']) => {
    pedidosService.atualizarStatusPedido(id, novoStatus);
    
    let mensagem = '';
    switch (novoStatus) {
      case 'em_preparo':
        mensagem = 'Pedido está sendo preparado';
        break;
      case 'pronto':
        mensagem = 'Pedido está pronto para entrega';
        break;
      case 'cancelado':
        mensagem = 'Pedido foi cancelado';
        break;
      default:
        mensagem = `Status atualizado para ${novoStatus}`;
    }

    toast({
      title: 'Status Atualizado!',
      description: mensagem,
    });

    // Limpar contador de novos pedidos quando aceitar
    if (novoStatus === 'em_preparo') {
      setNovosPedidos(0);
    }
  };

  const salvarObservacoes = () => {
    if (pedidoSelecionado) {
      // Aqui você pode implementar a lógica para salvar observações
      toast({
        title: 'Observações salvas!',
        description: 'As observações do pedido foram atualizadas.',
      });
    }
  };

  const pedidosFiltrados = filtrarPedidos();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="restaurante" userName={user.nome} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Pedidos do Restaurante
              </h1>
              <p className="text-gray-600">
                Acompanhe e gerencie os pedidos do seu restaurante
              </p>
            </div>
            
            {novosPedidos > 0 && (
              <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="font-medium">
                  {novosPedidos} novo(s) pedido(s)!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pedidos.filter(p => p.status === 'pendente').length}
              </div>
              <p className="text-sm text-gray-600">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pedidos.filter(p => p.status === 'em_preparo').length}
              </div>
              <p className="text-sm text-gray-600">Em Preparo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {pedidos.filter(p => p.status === 'pronto').length}
              </div>
              <p className="text-sm text-gray-600">Prontos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {pedidos.filter(p => p.status === 'entregue').length}
              </div>
              <p className="text-sm text-gray-600">Entregues</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label htmlFor="filtro-status">Filtrar por Status:</Label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger id="filtro-status">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_preparo">Em Preparo</SelectItem>
                <SelectItem value="pronto">Prontos</SelectItem>
                <SelectItem value="saiu_para_entrega">Saiu para Entrega</SelectItem>
                <SelectItem value="entregue">Entregues</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="busca">Buscar:</Label>
            <Input
              id="busca"
              type="search"
              placeholder="Cliente, endereço ou #ID"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="data-inicio">Data Início:</Label>
            <Input
              type="date"
              id="data-inicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="data-fim">Data Fim:</Label>
            <Input
              type="date"
              id="data-fim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="grid grid-cols-1 gap-4">
          {pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((pedido) => (
              <Card key={pedido.id} className={`border ${pedido.status === 'pendente' && novosPedidos > 0 ? 'border-red-300 bg-red-50' : ''}`}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Pedido #{pedido.id} - {pedido.cliente.nome}
                    </div>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{pedido.metodoPagamento}</Badge>
                    <Badge
                      className={
                        pedido.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : pedido.status === 'em_preparo'
                          ? 'bg-blue-100 text-blue-800'
                          : pedido.status === 'pronto'
                          ? 'bg-purple-100 text-purple-800'
                          : pedido.status === 'saiu_para_entrega'
                          ? 'bg-orange-100 text-orange-800'
                          : pedido.status === 'entregue'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {pedido.status === 'pendente' ? 'Pendente' :
                       pedido.status === 'em_preparo' ? 'Em Preparo' :
                       pedido.status === 'pronto' ? 'Pronto' :
                       pedido.status === 'saiu_para_entrega' ? 'Saiu para Entrega' :
                       pedido.status === 'entregue' ? 'Entregue' : 'Cancelado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <strong>Cliente:</strong>
                    <p>{pedido.cliente.nome}</p>
                    <p className="text-sm text-gray-600">{pedido.cliente.telefone}</p>
                  </div>
                  <div>
                    <strong>Endereço:</strong>
                    <p>{pedido.cliente.endereco}</p>
                  </div>
                  <div>
                    <strong>Data/Hora:</strong>
                    <p>{pedido.data} - {pedido.hora}</p>
                    <strong>Total:</strong>
                    <p className="text-green-600 font-bold">R$ {pedido.total.toFixed(2)}</p>
                  </div>

                  <div className="md:col-span-3">
                    <strong>Itens:</strong>
                    <ul className="mt-1">
                      {pedido.itens.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.quantidade}x {item.nome}</span>
                          <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-3 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPedidoSelecionado(pedido);
                          setObservacoes(pedido.observacoes || '');
                          setDetalhesAberto(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {pedido.status === 'pendente' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStatusChange(pedido.id, 'em_preparo')}
                        >
                          Aceitar Pedido
                        </Button>
                      )}
                      
                      {pedido.status === 'em_preparo' && (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleStatusChange(pedido.id, 'pronto')}
                        >
                          Marcar como Pronto
                        </Button>
                      )}
                      
                      {pedido.status !== 'entregue' && pedido.status !== 'cancelado' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(pedido.id, 'cancelado')}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum pedido encontrado.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal de Detalhes do Pedido */}
        <Dialog open={detalhesAberto} onOpenChange={setDetalhesAberto}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido #{pedidoSelecionado?.id}</DialogTitle>
            </DialogHeader>

            {pedidoSelecionado && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <strong>Cliente:</strong>
                    <p>{pedidoSelecionado.cliente.nome}</p>
                    <p className="text-sm text-gray-600">{pedidoSelecionado.cliente.telefone}</p>
                  </div>
                  <div>
                    <strong>Endereço de Entrega:</strong>
                    <p>{pedidoSelecionado.cliente.endereco}</p>
                  </div>
                </div>
                
                <div>
                  <strong>Itens do Pedido:</strong>
                  <div className="mt-2 space-y-2">
                    {pedidoSelecionado.itens.map((item, index) => (
                      <div key={index} className="flex justify-between border-b pb-2">
                        <span>{item.quantidade}x {item.nome}</span>
                        <span className="font-medium">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">R$ {pedidoSelecionado.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <strong>Método de Pagamento:</strong>
                    <p>{pedidoSelecionado.metodoPagamento}</p>
                  </div>
                  <div>
                    <strong>Taxa de Entrega:</strong>
                    <p>R$ {pedidoSelecionado.valorEntrega.toFixed(2)}</p>
                  </div>
                </div>
                
                <div>
                  <strong>Observações:</strong>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Adicione observações sobre o pedido"
                    className="mt-2"
                  />
                  <Button 
                    onClick={salvarObservacoes} 
                    className="mt-2 bg-red-600 hover:bg-red-700"
                  >
                    Salvar Observações
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PedidosRestaurantePage;
