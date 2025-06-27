
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Package } from 'lucide-react';

const MeusPedidosPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Dados mockados de pedidos do cliente
  const meusPedidos = [
    {
      id: '#001',
      restaurante: 'Pizza Deliciosa',
      status: 'entregue',
      data: '2024-06-27 19:30',
      valor: 89.90,
      produtos: ['Pizza Margherita Grande', 'Coca-Cola 350ml'],
      entregador: 'João Silva',
      tempo_entrega: '32min',
      avaliado: true,
      avaliacao: 5
    },
    {
      id: '#002',
      restaurante: 'Burger House',
      status: 'saiu_entrega',
      data: '2024-06-27 20:15',
      valor: 45.50,
      produtos: ['X-Bacon', 'Batata Frita'],
      entregador: 'Maria Santos',
      tempo_entrega: '25min',
      avaliado: false,
      previsao: '20:40'
    },
    {
      id: '#003',
      restaurante: 'Açaí da Vila',
      status: 'preparando',
      data: '2024-06-27 20:30',
      valor: 32.80,
      produtos: ['Açaí 500ml c/ Granola', 'Suco de Laranja'],
      entregador: null,
      tempo_entrega: '15min',
      avaliado: false,
      previsao: '20:45'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'preparando': { color: 'bg-yellow-100 text-yellow-800', label: 'Preparando' },
      'saiu_entrega': { color: 'bg-blue-100 text-blue-800', label: 'Em entrega' },
      'entregue': { color: 'bg-green-100 text-green-800', label: 'Entregue' },
      'cancelado': { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.preparando;
  };

  const handleAvaliar = (pedidoId: string) => {
    // Simular avaliação
    console.log(`Avaliando pedido ${pedidoId}`);
  };

  const handleRastrear = (pedidoId: string) => {
    // Simular rastreamento
    console.log(`Rastreando pedido ${pedidoId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="cliente" userName={user.nome} cartCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos e avalie sua experiência
          </p>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-6">
          {meusPedidos.map(pedido => (
            <Card key={pedido.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <CardTitle className="text-lg">{pedido.restaurante}</CardTitle>
                      <p className="text-sm text-gray-500">Pedido {pedido.id} • {pedido.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusBadge(pedido.status).color}>
                      {getStatusBadge(pedido.status).label}
                    </Badge>
                    <span className="font-bold text-lg text-green-600">
                      R$ {pedido.valor.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Produtos */}
                  <div>
                    <h4 className="font-medium mb-2">Produtos:</h4>
                    <ul className="text-gray-600 space-y-1">
                      {pedido.produtos.map((produto, index) => (
                        <li key={index} className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          {produto}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Informações de Entrega */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Tempo de entrega: {pedido.tempo_entrega}
                    </div>
                    {pedido.entregador && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        Entregador: {pedido.entregador}
                      </div>
                    )}
                    {pedido.previsao && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Previsão: {pedido.previsao}
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {pedido.status !== 'entregue' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRastrear(pedido.id)}
                      >
                        Rastrear Pedido
                      </Button>
                    )}
                    
                    {pedido.status === 'entregue' && !pedido.avaliado && (
                      <Button 
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleAvaliar(pedido.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Avaliar
                      </Button>
                    )}
                    
                    {pedido.avaliado && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        Avaliado: {pedido.avaliacao} estrelas
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/restaurante/${pedido.restaurante.toLowerCase().replace(/ /g, '-')}`)}
                    >
                      Pedir Novamente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {meusPedidos.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Você ainda não fez nenhum pedido. Que tal começar agora?
            </p>
            <Button 
              onClick={() => navigate('/restaurantes')}
              className="bg-red-600 hover:bg-red-700"
            >
              Ver Restaurantes
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeusPedidosPage;
