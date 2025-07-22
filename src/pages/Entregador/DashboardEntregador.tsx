import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Package, Clock, MapPin, Truck, Settings, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvaliacoesEntregador from '@/components/Entregador/AvaliacoesEntregador';
import { pedidosService, Pedido } from '@/services/pedidosService';

const DashboardEntregador: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [disponivel, setDisponivel] = useState(true);
  const [entregasAndamento, setEntregasAndamento] = useState<Pedido[]>([]);
  const [entregasDisponiveis, setEntregasDisponiveis] = useState<Pedido[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se é usuário de teste primeiro
    const testUser = localStorage.getItem('zdelivery_test_user');
    if (testUser) {
      try {
        const { profile } = JSON.parse(testUser);
        if (profile.tipo !== 'entregador') {
          navigate('/auth');
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
      if (parsedUser.tipo !== 'entregador') {
        navigate('/auth');
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = pedidosService.subscribe((pedidos) => {
      // Pedidos em andamento do entregador atual
      const andamento = pedidosService.getPedidosDoEntregador(user.nome);
      setEntregasAndamento(andamento);

      // Pedidos disponíveis (prontos para entrega)
      const disponiveis = pedidosService.getPedidosDisponiveis();
      setEntregasDisponiveis(disponiveis);
    });

    return unsubscribe;
  }, [user]);

  // Dados mockados para demonstração
  const estatisticas = {
    ganhos: {
      hoje: 125.50,
      semana: 687.20,
      mes: 2840.80
    },
    entregas: {
      hoje: 8,
      semana: 45,
      mes: 187,
      taxa_aceite: 95
    },
    avaliacao: 4.8,
    tempo_online: '6h 30min'
  };

  const handleAceitarEntrega = (pedidoId: string) => {
    const sucesso = pedidosService.aceitarEntrega(pedidoId, {
      nome: user.nome,
      telefone: user.telefone || '(11) 99999-9999'
    });

    if (sucesso) {
      toast({
        title: 'Entrega aceita!',
        description: `Você aceitou o pedido ${pedidoId}. Dirija-se ao restaurante.`,
      });
    }
  };

  const handleConfirmarEntrega = (pedidoId: string) => {
    const confirmar = window.confirm('Confirmar que o pedido foi entregue?');
    if (confirmar) {
      const sucesso = pedidosService.atualizarStatusPedido(pedidoId, 'entregue');
      
      if (sucesso) {
        toast({
          title: 'Entrega confirmada!',
          description: `Pedido ${pedidoId} foi marcado como entregue.`,
        });
      }
    }
  };

  const handleVerNoMapa = (endereco: string) => {
    toast({
      title: 'Abrindo Google Maps',
      description: `Carregando rota para: ${endereco}`,
    });
    
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
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard - {user.nome}
              </h1>
              <p className="text-gray-600">
                Gerencie suas entregas e acompanhe seus ganhos
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/status-pedidos')}
                className="flex items-center mr-2"
              >
                <Clock className="w-4 h-4 mr-2" />
                Ver Status
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/configuracao-entregador')}
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {disponivel ? 'Disponível' : 'Indisponível'}
                </span>
                <Switch 
                  checked={disponivel} 
                  onCheckedChange={setDisponivel}
                />
              </div>
              <Badge className={disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {disponivel ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Ganhos Hoje
                </CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {estatisticas.ganhos.hoje.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">
                +8% em relação a ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Entregas Hoje
                </CardTitle>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {estatisticas.entregas.hoje}
              </div>
              <p className="text-xs text-gray-500">
                Taxa de aceite: {estatisticas.entregas.taxa_aceite}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tempo Online
                </CardTitle>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {estatisticas.tempo_online}
              </div>
              <p className="text-xs text-gray-500">
                Meta: 8h por dia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avaliação
                </CardTitle>
                <Truck className="w-4 h-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {estatisticas.avaliacao}
              </div>
              <p className="text-xs text-gray-500">
                Baseado em 89 avaliações
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Abas principais do Dashboard */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="entregas">Entregas</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Entregas em Andamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Entregas em Andamento ({entregasAndamento.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {entregasAndamento.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma entrega em andamento
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {entregasAndamento.map(entrega => (
                        <div key={entrega.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">#{entrega.id}</span>
                            <Badge className="bg-blue-100 text-blue-800">
                              {entrega.status === 'saiu_para_entrega' ? 'Em entrega' : entrega.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Restaurante:</strong> {entrega.restaurante.nome}</p>
                            <p><strong>Cliente:</strong> {entrega.cliente.nome}</p>
                            <p className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {entrega.cliente.endereco}
                            </p>
                            <p className="text-green-600 font-medium">
                              Valor: R$ {entrega.valorEntrega.toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-3 space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleConfirmarEntrega(entrega.id)}
                            >
                              Confirmar Entrega
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVerNoMapa(entrega.cliente.endereco)}
                            >
                              Ver no Mapa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Entregas Disponíveis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Entregas Disponíveis ({entregasDisponiveis.length})
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/entregas-disponiveis')}
                    >
                      Ver Todas
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!disponivel ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        Você está offline. Ative seu status para ver entregas disponíveis.
                      </p>
                      <Button 
                        onClick={() => setDisponivel(true)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ficar Disponível
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {entregasDisponiveis.slice(0, 3).map(entrega => (
                        <div key={entrega.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">#{entrega.id}</span>
                            <Badge className="bg-green-100 text-green-800">
                              R$ {entrega.valorEntrega.toFixed(2)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p><strong>Restaurante:</strong> {entrega.restaurante.nome}</p>
                            <p><strong>Entregar para:</strong> {entrega.cliente.nome}</p>
                            <p className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {entrega.cliente.endereco}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => handleAceitarEntrega(entrega.id)}
                          >
                            Aceitar Entrega
                          </Button>
                        </div>
                      ))}
                      
                      {entregasDisponiveis.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          Nenhuma entrega disponível no momento
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumo da Semana */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {estatisticas.entregas.semana}
                    </div>
                    <p className="text-sm text-gray-600">Entregas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {estatisticas.ganhos.semana.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">Ganhos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      R$ {(estatisticas.ganhos.semana / estatisticas.entregas.semana).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">Média por entrega</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      42h
                    </div>
                    <p className="text-sm text-gray-600">Horas trabalhadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entregas">
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Vá para a página de status para acompanhar entregas</p>
              <Button 
                onClick={() => navigate('/status-pedidos')}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Ver Status dos Pedidos
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="avaliacoes">
            <AvaliacoesEntregador entregadorNome={user.nome} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardEntregador;
