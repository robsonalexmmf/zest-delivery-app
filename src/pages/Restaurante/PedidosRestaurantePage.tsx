
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Phone, Package, CheckCircle, Truck, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { menuAiService } from '@/services/menuAiService';

const PedidosRestaurantePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
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

  // Dados mockados de pedidos com telefone do cliente
  const [pedidos, setPedidos] = useState([
    {
      id: '#001',
      cliente: {
        nome: 'João Silva',
        telefone: '5511999999999',
        endereco: 'Rua das Flores, 123 - Centro'
      },
      produtos: [
        { nome: 'Pizza Margherita Grande', quantidade: 1, preco: 35.90 },
        { nome: 'Coca-Cola 350ml', quantidade: 2, preco: 5.50 }
      ],
      valor_total: 46.90,
      status: 'recebido',
      horario: '19:30',
      observacoes: 'Sem cebola, por favor',
      pagamento: 'Cartão de Crédito',
      data: new Date().toLocaleDateString()
    },
    {
      id: '#002',
      cliente: {
        nome: 'Maria Santos',
        telefone: '5511888888888',
        endereco: 'Av. Paulista, 456 - Apto 102'
      },
      produtos: [
        { nome: 'Pizza Calabresa', quantidade: 1, preco: 38.90 }
      ],
      valor_total: 38.90,
      status: 'preparando',
      horario: '19:45',
      observacoes: '',
      pagamento: 'PIX',
      data: new Date().toLocaleDateString()
    },
    {
      id: '#003',
      cliente: {
        nome: 'Carlos Oliveira',
        telefone: '5511777777777',
        endereco: 'Rua do Centro, 789'
      },
      produtos: [
        { nome: 'Pizza Portuguesa', quantidade: 1, preco: 42.90 },
        { nome: 'Pizza 4 Queijos', quantidade: 1, preco: 45.90 }
      ],
      valor_total: 88.80,
      status: 'pronto',
      horario: '19:15',
      observacoes: 'Entregar no portão',
      pagamento: 'Dinheiro',
      data: new Date().toLocaleDateString()
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'recebido': { color: 'bg-blue-100 text-blue-800', label: 'Recebido', icon: Package },
      'preparando': { color: 'bg-yellow-100 text-yellow-800', label: 'Preparando', icon: Clock },
      'pronto': { color: 'bg-green-100 text-green-800', label: 'Pronto', icon: CheckCircle },
      'saiu_entrega': { color: 'bg-purple-100 text-purple-800', label: 'Saiu para Entrega', icon: Truck },
      'entregue': { color: 'bg-gray-100 text-gray-800', label: 'Entregue', icon: CheckCircle },
      'cancelado': { color: 'bg-red-100 text-red-800', label: 'Cancelado', icon: X }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.recebido;
  };

  const handleStatusChange = async (pedidoId: string, novoStatus: string) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    // Atualizar status localmente
    setPedidos(pedidos.map(pedido => 
      pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
    ));
    
    // Salvar no localStorage para persistência
    const pedidosAtualizados = pedidos.map(p => 
      p.id === pedidoId ? { ...p, status: novoStatus } : p
    );
    localStorage.setItem('restaurant_orders', JSON.stringify(pedidosAtualizados));
    
    const statusInfo = getStatusBadge(novoStatus);
    
    toast({
      title: 'Status atualizado!',
      description: `Pedido ${pedidoId} foi atualizado para ${statusInfo.label}.`,
    });

    // Enviar notificação WhatsApp se configurado
    if (pedido && menuAiService.isConfigured()) {
      try {
        await menuAiService.sendStatusMessage(
          pedido.cliente.telefone,
          pedidoId,
          novoStatus,
          user?.nome || 'Restaurante'
        );
        
        toast({
          title: 'WhatsApp enviado!',
          description: `Notificação enviada para ${pedido.cliente.nome}.`,
        });
      } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error);
      }
    }

    // Se o pedido foi marcado como "saiu para entrega", simular notificação para entregador
    if (novoStatus === 'saiu_entrega') {
      toast({
        title: 'Entregador notificado!',
        description: `O entregador foi notificado sobre o pedido ${pedidoId}.`,
      });
    }
  };

  const handleEntrarContato = (pedido: any) => {
    const telefone = pedido.cliente.telefone.replace(/\D/g, '');
    const mensagem = encodeURIComponent(
      `Olá ${pedido.cliente.nome}! Sou do restaurante ${user?.nome || 'ZDelivery'} sobre o seu pedido ${pedido.id}.`
    );
    const url = `https://wa.me/${telefone}?text=${mensagem}`;
    
    window.open(url, '_blank');
    
    toast({
      title: 'Abrindo WhatsApp',
      description: `Entrando em contato com ${pedido.cliente.nome}`,
    });
  };

  const handleCancelarPedido = (pedidoId: string) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (pedido && ['recebido', 'preparando'].includes(pedido.status)) {
      handleStatusChange(pedidoId, 'cancelado');
    } else {
      toast({
        title: 'Não é possível cancelar',
        description: 'Este pedido não pode ser cancelado no status atual.',
        variant: 'destructive'
      });
    }
  };

  const pedidosFiltrados = filtroStatus === 'todos' 
    ? pedidos 
    : pedidos.filter(pedido => pedido.status === filtroStatus);

  const getProximoStatus = (statusAtual: string) => {
    const fluxo = {
      'recebido': 'preparando',
      'preparando': 'pronto',
      'pronto': 'saiu_entrega',
      'saiu_entrega': 'entregue'
    };
    return fluxo[statusAtual as keyof typeof fluxo];
  };

  const getStatusActions = (pedido: any) => {
    const actions = [];
    
    // Botão para próximo status
    const proximoStatus = getProximoStatus(pedido.status);
    if (proximoStatus) {
      const statusInfo = getStatusBadge(proximoStatus);
      const StatusIcon = statusInfo.icon;
      
      actions.push(
        <Button 
          key="proximo"
          onClick={() => handleStatusChange(pedido.id, proximoStatus)}
          className="bg-red-600 hover:bg-red-700"
          size="sm"
        >
          <StatusIcon className="w-4 h-4 mr-2" />
          Marcar como {statusInfo.label}
        </Button>
      );
    }
    
    // Botão de cancelar (apenas para pedidos recebidos ou preparando)
    if (['recebido', 'preparando'].includes(pedido.status)) {
      actions.push(
        <Button 
          key="cancelar"
          variant="outline"
          onClick={() => handleCancelarPedido(pedido.id)}
          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar Pedido
        </Button>
      );
    }
    
    return actions;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="restaurante" userName={user.nome} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Pedidos
              </h1>
              <p className="text-gray-600">
                Gerencie os pedidos do seu restaurante
              </p>
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os pedidos</SelectItem>
                <SelectItem value="recebido">Recebidos</SelectItem>
                <SelectItem value="preparando">Preparando</SelectItem>
                <SelectItem value="pronto">Prontos</SelectItem>
                <SelectItem value="saiu_entrega">Em entrega</SelectItem>
                <SelectItem value="entregue">Entregues</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pedidos.filter(p => p.status === 'recebido').length}
              </div>
              <p className="text-sm text-gray-600">Recebidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pedidos.filter(p => p.status === 'preparando').length}
              </div>
              <p className="text-sm text-gray-600">Preparando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {pedidos.filter(p => p.status === 'pronto').length}
              </div>
              <p className="text-sm text-gray-600">Prontos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {pedidos.filter(p => p.status === 'saiu_entrega').length}
              </div>
              <p className="text-sm text-gray-600">Em entrega</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {pedidos.filter(p => p.status === 'entregue').length}
              </div>
              <p className="text-sm text-gray-600">Entregues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {pedidos.filter(p => p.status === 'cancelado').length}
              </div>
              <p className="text-sm text-gray-600">Cancelados</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-6">
          {pedidosFiltrados.map(pedido => {
            const statusInfo = getStatusBadge(pedido.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={pedido.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{pedido.id}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {pedido.horario} - {pedido.data}
                        </span>
                        <span>{pedido.pagamento}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <span className="font-bold text-lg text-green-600">
                        R$ {pedido.valor_total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Informações do Cliente */}
                    <div>
                      <h4 className="font-medium mb-3">Cliente</h4>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{pedido.cliente.nome}</p>
                        <p className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {pedido.cliente.telefone}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {pedido.cliente.endereco}
                        </p>
                        {pedido.observacoes && (
                          <p className="text-gray-600 bg-yellow-50 p-2 rounded">
                            <strong>Obs:</strong> {pedido.observacoes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Produtos */}
                    <div>
                      <h4 className="font-medium mb-3">Produtos</h4>
                      <div className="space-y-2">
                        {pedido.produtos.map((produto, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{produto.quantidade}x {produto.nome}</span>
                            </div>
                            <span className="font-medium">
                              R$ {(produto.quantidade * produto.preco).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span className="text-green-600">R$ {pedido.valor_total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                    {getStatusActions(pedido)}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEntrarContato(pedido)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Entrar em Contato
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {pedidosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500">
              {filtroStatus === 'todos' 
                ? 'Não há pedidos no momento.' 
                : `Não há pedidos com status "${getStatusBadge(filtroStatus).label}".`
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PedidosRestaurantePage;
