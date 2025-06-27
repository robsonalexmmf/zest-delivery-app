
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, Clock, Star } from 'lucide-react';

const DashboardRestaurante: React.FC = () => {
  const [user, setUser] = useState<any>(null);
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
            Dashboard - {user.nome}
          </h1>
          <p className="text-gray-600">
            Gerencie seu restaurante e acompanhe suas vendas
          </p>
        </div>

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
      </main>
    </div>
  );
};

export default DashboardRestaurante;
