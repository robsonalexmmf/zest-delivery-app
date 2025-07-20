import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { pedidosService, Pedido } from '@/services/pedidosService';

const StatusPedidosPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar usuário
    const testUser = localStorage.getItem('zdelivery_test_user');
    if (testUser) {
      try {
        const { profile } = JSON.parse(testUser);
        if (profile.tipo !== 'entregador') {
          navigate('/login');
        } else {
          setUser(profile);
        }
        return;
      } catch (error) {
        console.error('Error loading test user:', error);
        localStorage.removeItem('zdelivery_test_user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Função para carregar pedidos
  const carregarPedidos = () => {
    if (!user) return;
    
    const todosPedidos = pedidosService.getPedidos();
    // Filtrar pedidos do entregador atual ou disponíveis
    const pedidosFiltrados = todosPedidos.filter(p => 
      p.entregador?.nome === user.nome || p.status === 'pronto'
    );
    
    setPedidos(pedidosFiltrados);
    setUltimaAtualizacao(new Date());
  };

  // Atualizar pedidos a cada 1 minuto
  useEffect(() => {
    if (!user) return;

    // Carregar dados iniciais
    carregarPedidos();

    // Configurar atualização automática
    const interval = setInterval(() => {
      carregarPedidos();
    }, 60000); // 1 minuto

    // Subscribe para mudanças em tempo real
    const unsubscribe = pedidosService.subscribe(() => {
      carregarPedidos();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendente': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      'em_preparo': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Em Preparo' },
      'pronto': { bg: 'bg-green-100', text: 'text-green-800', label: 'Pronto para Entrega' },
      'saiu_para_entrega': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Em Entrega' },
      'entregue': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Entregue' },
      'cancelado': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    
    return (
      <Badge className={`${config.bg} ${config.text}`}>
        {config.label}
      </Badge>
    );
  };

  const handleAceitarEntrega = (pedidoId: string) => {
    const sucesso = pedidosService.aceitarEntrega(pedidoId, {
      nome: user.nome,
      telefone: user.telefone || '(11) 99999-9999'
    });

    if (sucesso) {
      carregarPedidos();
    }
  };

  const handleConfirmarEntrega = (pedidoId: string) => {
    const confirmar = window.confirm('Confirmar que o pedido foi entregue?');
    if (confirmar) {
      const sucesso = pedidosService.atualizarStatusPedido(pedidoId, 'entregue');
      
      if (sucesso) {
        carregarPedidos();
      }
    }
  };

  const handleVerNoMapa = (endereco: string) => {
    const enderecoEncoded = encodeURIComponent(endereco);
    window.open(`https://maps.google.com/?q=${enderecoEncoded}`, '_blank');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="entregador" userName={user.nome} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard-entregador')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Status dos Pedidos
                </h1>
                <p className="text-gray-600">
                  Acompanhe o status dos pedidos em tempo real
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={carregarPedidos}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Última atualização</p>
                <p className="text-sm font-medium">
                  {ultimaAtualizacao.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações sobre atualização automática */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">
                Atualização automática ativa - Os pedidos são atualizados a cada 1 minuto
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pedidos */}
        <div className="space-y-6">
          {pedidos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 text-lg">
                  Nenhum pedido encontrado
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Aguarde novos pedidos ficarem disponíveis
                </p>
              </CardContent>
            </Card>
          ) : (
            pedidos.map(pedido => (
              <Card key={pedido.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>Pedido #{pedido.id}</span>
                      {getStatusBadge(pedido.status)}
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{pedido.data}</p>
                      <p className="text-sm text-gray-600">{pedido.hora}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Informações do Restaurante */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Restaurante</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Nome:</strong> {pedido.restaurante.nome}</p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {pedido.restaurante.endereco}
                        </p>
                        <p><strong>Telefone:</strong> {pedido.restaurante.telefone}</p>
                      </div>
                    </div>

                    {/* Informações do Cliente */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Cliente</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Nome:</strong> {pedido.cliente.nome}</p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {pedido.cliente.endereco}
                        </p>
                        <p><strong>Telefone:</strong> {pedido.cliente.telefone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Itens do Pedido</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {pedido.itens.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{item.quantidade}x {item.nome}</span>
                          <span className="text-sm font-medium">R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total + Entrega</span>
                          <span className="font-bold text-green-600">R$ {pedido.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Tempo estimado: {pedido.tempoEstimado}
                      </span>
                      <span>Pagamento: {pedido.metodoPagamento}</span>
                      <span className="text-green-600 font-medium">
                        Taxa entrega: R$ {pedido.valorEntrega.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="mt-4 flex space-x-2">
                    {pedido.status === 'pronto' && !pedido.entregador && (
                      <Button 
                        onClick={() => handleAceitarEntrega(pedido.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Aceitar Entrega
                      </Button>
                    )}
                    
                    {pedido.status === 'saiu_para_entrega' && pedido.entregador?.nome === user.nome && (
                      <Button 
                        onClick={() => handleConfirmarEntrega(pedido.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirmar Entrega
                      </Button>
                    )}

                    <Button 
                      variant="outline"
                      onClick={() => handleVerNoMapa(pedido.cliente.endereco)}
                    >
                      Ver no Mapa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StatusPedidosPage;