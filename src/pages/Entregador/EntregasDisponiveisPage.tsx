
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MapPin, Clock, DollarSign, Package, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { pedidosService, Pedido } from '@/services/pedidosService';

const EntregasDisponiveisPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [disponivel, setDisponivel] = useState(true);
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
      const disponiveis = pedidosService.getPedidosDisponiveis();
      setEntregasDisponiveis(disponiveis);
    });

    return unsubscribe;
  }, [user]);

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

      // Redirecionar para dashboard do entregador
      setTimeout(() => {
        navigate('/dashboard-entregador');
      }, 2000);
    }
  };

  const handleVerMapa = (entrega: Pedido) => {
    const origem = encodeURIComponent(entrega.restaurante.endereco);
    const destino = encodeURIComponent(entrega.cliente.endereco);
    const url = `https://www.google.com/maps/dir/${origem}/${destino}`;
    
    window.open(url, '_blank');
    
    toast({
      title: 'Abrindo Google Maps',
      description: `Rota: ${entrega.restaurante.nome} → ${entrega.cliente.nome}`,
    });
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
                Entregas Disponíveis
              </h1>
              <p className="text-gray-600">
                Aceite entregas próximas a você
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
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

        {!disponivel ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Você está offline
              </h3>
              <p className="text-gray-500 mb-6">
                Ative seu status para ver entregas disponíveis na sua região.
              </p>
              <Button 
                onClick={() => setDisponivel(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Ficar Disponível
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Estatísticas Rápidas */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {entregasDisponiveis.length}
                  </div>
                  <p className="text-sm text-gray-600">Entregas disponíveis</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {entregasDisponiveis.reduce((total, e) => total + e.valorEntrega, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">Valor total possível</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {entregasDisponiveis.filter(e => e.status === 'pronto').length}
                  </div>
                  <p className="text-sm text-gray-600">Pedidos prontos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {entregasDisponiveis.length > 0 
                      ? (entregasDisponiveis.reduce((total, e) => total + e.total, 0) / entregasDisponiveis.length).toFixed(2)
                      : '0.00'
                    }
                  </div>
                  <p className="text-sm text-gray-600">Valor médio dos pedidos</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Entregas */}
            <div className="space-y-6">
              {entregasDisponiveis.map(entrega => (
                <Card key={entrega.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">#{entrega.id}</CardTitle>
                        <p className="text-sm text-gray-600">{entrega.restaurante.nome}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          Pronto para entrega
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          R$ {entrega.valorEntrega.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Informações da Rota */}
                      <div>
                        <h4 className="font-medium mb-3">Rota</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                            <div>
                              <p className="font-medium">Retirar em:</p>
                              <p className="text-gray-600">{entrega.restaurante.endereco}</p>
                              <p className="text-gray-500">{entrega.restaurante.telefone}</p>
                            </div>
                          </div>
                          
                          <div className="border-l-2 border-dashed border-gray-300 ml-1.5 h-4"></div>
                          
                          <div className="flex items-start space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                            <div>
                              <p className="font-medium">Entregar para:</p>
                              <p className="text-gray-600">{entrega.cliente.nome}</p>
                              <p className="text-gray-600">{entrega.cliente.endereco}</p>
                              <p className="text-gray-500">{entrega.cliente.telefone}</p>
                              {entrega.observacoes && (
                                <p className="text-blue-600 mt-1">
                                  <strong>Obs:</strong> {entrega.observacoes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detalhes da Entrega */}
                      <div>
                        <h4 className="font-medium mb-3">Detalhes</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              Tempo estimado
                            </span>
                            <span className="font-medium">{entrega.tempoEstimado}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                              Valor do pedido
                            </span>
                            <span className="font-medium">R$ {entrega.total.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                              Sua taxa de entrega
                            </span>
                            <span className="font-medium text-green-600">R$ {entrega.valorEntrega.toFixed(2)}</span>
                          </div>
                          
                          <div className="pt-2 border-t">
                            <p className="text-gray-600 mb-2">Produtos:</p>
                            <ul className="space-y-1">
                              {entrega.itens.map((item, index) => (
                                <li key={index} className="flex items-center justify-between text-gray-600">
                                  <span className="flex items-center">
                                    <Package className="w-3 h-3 mr-2" />
                                    {item.quantidade}x {item.nome}
                                  </span>
                                  <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                      <Button 
                        onClick={() => handleAceitarEntrega(entrega.id)}
                        className="bg-red-600 hover:bg-red-700 flex-1 md:flex-none"
                      >
                        Aceitar Entrega
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => handleVerMapa(entrega)}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Ver no Mapa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {entregasDisponiveis.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma entrega disponível
                </h3>
                <p className="text-gray-500 mb-6">
                  Não há entregas disponíveis na sua região no momento. Volte em instantes!
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Atualizar Lista
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default EntregasDisponiveisPage;
