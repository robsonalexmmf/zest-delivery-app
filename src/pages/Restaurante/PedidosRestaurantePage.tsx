
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, MapPin, Phone, Package, CheckCircle, Truck, X, Search, Filter, Calendar as CalendarIcon, Download, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { menuAiService } from '@/services/menuAiService';

const PedidosRestaurantePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState<Date | undefined>(undefined);
  const [busca, setBusca] = useState('');
  const [pedidosSelecionados, setPedidosSelecionados] = useState<string[]>([]);
  const [showFiltros, setShowFiltros] = useState(false);
  const [atualizandoPedidos, setAtualizandoPedidos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'restaurante') {
        navigate('/login');
      } else {
        setUser(parsedUser);
        carregarPedidos();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const carregarPedidos = () => {
    const pedidosSalvos = localStorage.getItem('restaurant_orders');
    if (pedidosSalvos) {
      setPedidos(JSON.parse(pedidosSalvos));
      return;
    }
    // Manter pedidos mockados se não houver salvos
  };

  // Dados mockados de pedidos expandidos
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
      data: new Date().toLocaleDateString(),
      tempo_estimado: 35,
      avaliacao: null
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
      data: new Date().toLocaleDateString(),
      tempo_estimado: 25,
      avaliacao: null
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
      data: new Date().toLocaleDateString(),
      tempo_estimado: 30,
      avaliacao: 4.5
    },
    {
      id: '#004',
      cliente: {
        nome: 'Ana Costa',
        telefone: '5511666666666',
        endereco: 'Rua das Palmeiras, 321'
      },
      produtos: [
        { nome: 'Pizza Frango Catupiry', quantidade: 1, preco: 39.90 }
      ],
      valor_total: 39.90,
      status: 'entregue',
      horario: '18:30',
      observacoes: '',
      pagamento: 'PIX',
      data: new Date().toLocaleDateString(),
      tempo_estimado: 28,
      avaliacao: 5.0
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
    
    setPedidos(pedidos.map(pedido => 
      pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
    ));
    
    const pedidosAtualizados = pedidos.map(p => 
      p.id === pedidoId ? { ...p, status: novoStatus } : p
    );
    localStorage.setItem('restaurant_orders', JSON.stringify(pedidosAtualizados));
    
    const statusInfo = getStatusBadge(novoStatus);
    
    toast({
      title: 'Status atualizado!',
      description: `Pedido ${pedidoId} foi atualizado para ${statusInfo.label}.`,
    });

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

  const handleSelecionarPedido = (pedidoId: string, selecionado: boolean) => {
    if (selecionado) {
      setPedidosSelecionados([...pedidosSelecionados, pedidoId]);
    } else {
      setPedidosSelecionados(pedidosSelecionados.filter(id => id !== pedidoId));
    }
  };

  const handleSelecionarTodos = (selecionado: boolean) => {
    if (selecionado) {
      setPedidosSelecionados(pedidosFiltrados.map(p => p.id));
    } else {
      setPedidosSelecionados([]);
    }
  };

  const handleAcaoLote = async (acao: string) => {
    if (pedidosSelecionados.length === 0) {
      toast({
        title: 'Nenhum pedido selecionado',
        description: 'Selecione pelo menos um pedido para executar a ação.',
        variant: 'destructive'
      });
      return;
    }

    const acoes = {
      'marcar_preparando': 'preparando',
      'marcar_pronto': 'pronto',
      'marcar_saiu_entrega': 'saiu_entrega',
      'cancelar': 'cancelado'
    };

    const novoStatus = acoes[acao as keyof typeof acoes];
    if (novoStatus) {
      pedidosSelecionados.forEach(pedidoId => {
        handleStatusChange(pedidoId, novoStatus);
      });
      setPedidosSelecionados([]);
      
      toast({
        title: 'Ação executada!',
        description: `${pedidosSelecionados.length} pedido(s) atualizado(s).`,
      });
    }
  };

  const atualizarPedidos = () => {
    setAtualizandoPedidos(true);
    // Simular atualização
    setTimeout(() => {
      carregarPedidos();
      setAtualizandoPedidos(false);
      toast({
        title: 'Pedidos atualizados!',
        description: 'Lista de pedidos foi atualizada.',
      });
    }, 1000);
  };

  const exportarRelatorio = () => {
    const dados = pedidosFiltrados.map(pedido => ({
      ID: pedido.id,
      Cliente: pedido.cliente.nome,
      Telefone: pedido.cliente.telefone,
      Status: getStatusBadge(pedido.status).label,
      Valor: `R$ ${pedido.valor_total.toFixed(2)}`,
      Horario: pedido.horario,
      Data: pedido.data,
      Pagamento: pedido.pagamento
    }));

    const csv = [
      Object.keys(dados[0]).join(','),
      ...dados.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Relatório exportado!',
      description: 'Arquivo CSV foi baixado com sucesso.',
    });
  };

  // Filtros aplicados
  let pedidosFiltrados = pedidos;

  if (filtroStatus !== 'todos') {
    pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.status === filtroStatus);
  }

  if (filtroData) {
    const dataFiltro = filtroData.toLocaleDateString();
    pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.data === dataFiltro);
  }

  if (busca) {
    pedidosFiltrados = pedidosFiltrados.filter(pedido => 
      pedido.id.toLowerCase().includes(busca.toLowerCase()) ||
      pedido.cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      pedido.cliente.telefone.includes(busca)
    );
  }

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
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={atualizarPedidos}
                disabled={atualizandoPedidos}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${atualizandoPedidos ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                variant="outline"
                onClick={exportarRelatorio}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowFiltros(!showFiltros)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros Expandidos */}
        {showFiltros && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros Avançados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por ID, cliente ou telefone"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
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
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {filtroData ? filtroData.toLocaleDateString() : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filtroData}
                      onSelect={setFiltroData}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusca('');
                    setFiltroStatus('todos');
                    setFiltroData(undefined);
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Ações em Lote */}
        {pedidosSelecionados.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {pedidosSelecionados.length} pedido(s) selecionado(s)
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleAcaoLote('marcar_preparando')}>
                    Marcar como Preparando
                  </Button>
                  <Button size="sm" onClick={() => handleAcaoLote('marcar_pronto')}>
                    Marcar como Pronto
                  </Button>
                  <Button size="sm" onClick={() => handleAcaoLote('marcar_saiu_entrega')}>
                    Marcar Saiu p/ Entrega
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAcaoLote('cancelar')}>
                    Cancelar Selecionados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controle de Seleção */}
        {pedidosFiltrados.length > 0 && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={pedidosSelecionados.length === pedidosFiltrados.length}
                onCheckedChange={handleSelecionarTodos}
              />
              <Label>Selecionar todos ({pedidosFiltrados.length})</Label>
            </div>
          </div>
        )}

        {/* Lista de Pedidos */}
        <div className="space-y-6">
          {pedidosFiltrados.map(pedido => {
            const statusInfo = getStatusBadge(pedido.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={pedido.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={pedidosSelecionados.includes(pedido.id)}
                        onCheckedChange={(checked) => handleSelecionarPedido(pedido.id, checked as boolean)}
                      />
                      <div>
                        <CardTitle className="text-lg">{pedido.id}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {pedido.horario} - {pedido.data}
                          </span>
                          <span>{pedido.pagamento}</span>
                          {pedido.tempo_estimado && (
                            <span>⏱️ {pedido.tempo_estimado}min</span>
                          )}
                        </div>
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
                      {pedido.avaliacao && (
                        <div className="flex items-center">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm ml-1">{pedido.avaliacao}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
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
                : `Não há pedidos com os filtros aplicados.`
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PedidosRestaurantePage;
