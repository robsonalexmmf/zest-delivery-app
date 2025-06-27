
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MapPin, Clock, DollarSign, Package, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EntregasDisponiveisPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [disponivel, setDisponivel] = useState(true);
  const [entregasDisponiveis, setEntregasDisponiveis] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'entregador') {
        navigate('/login');
      } else {
        setUser(parsedUser);
        carregarEntregasDisponiveis();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const carregarEntregasDisponiveis = () => {
    // Dados mockados de entregas disponíveis
    const entregas = [
      {
        id: '#E001',
        restaurante: {
          nome: 'Pizza Deliciosa',
          endereco: 'Rua das Flores, 123 - Centro',
          telefone: '(11) 3333-3333'
        },
        cliente: {
          nome: 'João Silva',
          endereco: 'Av. Paulista, 456 - Apto 102',
          telefone: '(11) 99999-9999'
        },
        distancia_total: '2.8 km',
        distancia_restaurante: '0.5 km',
        valor_entrega: 8.50,
        estimativa: '25min',
        urgente: false,
        valor_pedido: 89.90,
        observacoes: 'Apartamento - Interfone 102',
        produtos: ['Pizza Margherita Grande', 'Coca-Cola 350ml']
      },
      {
        id: '#E002',
        restaurante: {
          nome: 'Burger House',
          endereco: 'Av. Central, 789',
          telefone: '(11) 4444-4444'
        },
        cliente: {
          nome: 'Maria Santos',
          endereco: 'Rua do Parque, 321 - Casa',
          telefone: '(11) 88888-8888'
        },
        distancia_total: '1.5 km',
        distancia_restaurante: '0.3 km',
        valor_entrega: 12.00,
        estimativa: '18min',
        urgente: true,
        valor_pedido: 65.50,
        observacoes: 'Portão verde - tocar campainha',
        produtos: ['X-Bacon', 'Batata Frita', 'Milkshake']
      },
      {
        id: '#E003',
        restaurante: {
          nome: 'Sushi Premium',
          endereco: 'Rua Japão, 555',
          telefone: '(11) 5555-5555'
        },
        cliente: {
          nome: 'Carlos Oliveira',
          endereco: 'Condomínio Flores, Bloco A - Apto 205',
          telefone: '(11) 77777-7777'
        },
        distancia_total: '3.2 km',
        distancia_restaurante: '1.1 km',
        valor_entrega: 15.00,
        estimativa: '35min',
        urgente: false,
        valor_pedido: 145.80,
        observacoes: 'Condomínio - avisar na portaria',
        produtos: ['Combo Sushi Premium', 'Temaki Salmão']
      },
      {
        id: '#E004',
        restaurante: {
          nome: 'Açaí da Vila',
          endereco: 'Praça Central, 111',
          telefone: '(11) 6666-6666'
        },
        cliente: {
          nome: 'Ana Costa',
          endereco: 'Rua das Palmeiras, 987',
          telefone: '(11) 66666-6666'
        },
        distancia_total: '1.8 km',
        distancia_restaurante: '0.7 km',
        valor_entrega: 6.50,
        estimativa: '20min',
        urgente: false,
        valor_pedido: 28.90,
        observacoes: '',
        produtos: ['Açaí 500ml', 'Suco Natural']
      }
    ];
    
    setEntregasDisponiveis(entregas);
  };

  const handleAceitarEntrega = (entregaId: string) => {
    setEntregasDisponiveis(entregas => entregas.filter(e => e.id !== entregaId));
    
    toast({
      title: 'Entrega aceita!',
      description: `Você aceitou a entrega ${entregaId}. Dirija-se ao restaurante.`,
    });
  };

  const handleVerMapa = (entrega: any) => {
    // Simular abertura do mapa
    toast({
      title: 'Abrindo mapa...',
      description: `Rota: ${entrega.restaurante.endereco} → ${entrega.cliente.endereco}`,
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
                    R$ {entregasDisponiveis.reduce((total, e) => total + e.valor_entrega, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">Valor total possível</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {entregasDisponiveis.filter(e => e.urgente).length}
                  </div>
                  <p className="text-sm text-gray-600">Entregas urgentes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {entregasDisponiveis.length > 0 
                      ? Math.round(entregasDisponiveis.reduce((total, e) => total + parseFloat(e.distancia_total), 0) / entregasDisponiveis.length * 10) / 10
                      : 0
                    } km
                  </div>
                  <p className="text-sm text-gray-600">Distância média</p>
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
                        <CardTitle className="text-lg">{entrega.id}</CardTitle>
                        <p className="text-sm text-gray-600">{entrega.restaurante.nome}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {entrega.urgente && (
                          <Badge className="bg-red-100 text-red-800">
                            Urgente
                          </Badge>
                        )}
                        <Badge className="bg-green-100 text-green-800">
                          R$ {entrega.valor_entrega.toFixed(2)}
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
                              <Navigation className="w-4 h-4 mr-2 text-gray-400" />
                              Distância total
                            </span>
                            <span className="font-medium">{entrega.distancia_total}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              Tempo estimado
                            </span>
                            <span className="font-medium">{entrega.estimativa}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                              Valor do pedido
                            </span>
                            <span className="font-medium">R$ {entrega.valor_pedido.toFixed(2)}</span>
                          </div>
                          
                          <div className="pt-2 border-t">
                            <p className="text-gray-600 mb-2">Produtos:</p>
                            <ul className="space-y-1">
                              {entrega.produtos.map((produto, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                  <Package className="w-3 h-3 mr-2" />
                                  {produto}
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
                  onClick={carregarEntregasDisponiveis}
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
