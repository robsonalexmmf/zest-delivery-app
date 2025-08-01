import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import ModalAvaliacao from '@/components/Cliente/ModalAvaliacao';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Package, Truck, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { pedidosService, Pedido } from '@/services/pedidosService';

interface PedidoItem {
  quantidade: number;
  nome: string;
  preco: number;
}

const MeusPedidosPage: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [modalAvaliacao, setModalAvaliacao] = useState({ 
    isOpen: false, 
    pedidoId: '', 
    restaurante: '', 
    entregador: '' 
  });
  const [meusPedidos, setMeusPedidos] = useState<Pedido[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !profile) {
        navigate('/auth');
      } else if (profile.tipo !== 'cliente') {
        navigate('/auth');
      }
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (!user || !profile) return;

    const unsubscribe = pedidosService.subscribe((pedidos) => {
      // Filtrar pedidos para mostrar apenas os do cliente atual
      const pedidosCliente = pedidos.filter(p => p.cliente.nome === profile.nome);
      setMeusPedidos(pedidosCliente);
    });

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return unsubscribe;
  }, [user, profile]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pendente': { color: 'bg-yellow-100 text-yellow-800', label: 'Aguardando confirmação' },
      'em_preparo': { color: 'bg-blue-100 text-blue-800', label: 'Sendo preparado' },
      'pronto': { color: 'bg-purple-100 text-purple-800', label: 'Pronto - Aguardando entregador' },
      'saiu_para_entrega': { color: 'bg-orange-100 text-orange-800', label: 'Saiu para entrega' },
      'entregue': { color: 'bg-green-100 text-green-800', label: 'Entregue' },
      'cancelado': { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pendente;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="w-4 h-4" />;
      case 'em_preparo':
        return <Package className="w-4 h-4" />;
      case 'pronto':
        return <Bell className="w-4 h-4" />;
      case 'saiu_para_entrega':
        return <Truck className="w-4 h-4" />;
      case 'entregue':
        return <Star className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleAvaliar = (pedidoId: string, restauranteNome: string, entregadorNome?: string) => {
    setModalAvaliacao({ 
      isOpen: true, 
      pedidoId, 
      restaurante: restauranteNome, 
      entregador: entregadorNome || '' 
    });
  };

  const handleCloseModal = () => {
    setModalAvaliacao({ 
      isOpen: false, 
      pedidoId: '', 
      restaurante: '', 
      entregador: '' 
    });
  };

  const handleAvaliacaoEnviada = () => {
    // O hook useSupabaseData já cuida de atualizar os pedidos via subscription
    toast({
      title: 'Avaliação registrada',
      description: 'Obrigado por avaliar seu pedido!'
    });
  };

  const handleRastrear = (pedido: Pedido) => {
    if (pedido.status === 'saiu_para_entrega' && pedido.entregador) {
      const entregadorNome = pedido.entregador.nome;
      const entregadorTelefone = pedido.entregador.telefone || 'não disponível';
      
      toast({
        title: 'Rastreamento em Tempo Real',
        description: `Seu pedido está com ${entregadorNome}. Tel: ${entregadorTelefone}`,
      });
      
      // Abrir Google Maps com rota do restaurante ao cliente
      if (pedido.restaurante.endereco && pedido.cliente.endereco) {
        const origem = encodeURIComponent(pedido.restaurante.endereco);
        const destino = encodeURIComponent(pedido.cliente.endereco);
        window.open(`https://www.google.com/maps/dir/${origem}/${destino}`, '_blank');
      } else {
        toast({
          title: 'Informações incompletas',
          description: 'Não foi possível abrir o mapa devido a informações de endereço incompletas',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: 'Status do Pedido',
        description: `Seu pedido está ${getStatusBadge(pedido.status).label.toLowerCase()}`,
      });
    }
  };

  const handlePedirNovamente = (restaurante: string) => {
    toast({
      title: 'Redirecionando...',
      description: `Levando você para ${restaurante} para fazer um novo pedido.`,
    });
    
    const restauranteSlug = restaurante.toLowerCase().replace(/ /g, '-');
    navigate(`/restaurante/${restauranteSlug}`);
  };

  const getTempoEstimadoRestante = (pedido: Pedido) => {
    if (pedido.status === 'entregue' || pedido.status === 'cancelado') {
      return null;
    }
    
    // Lógica simples para estimar tempo restante
    const agora = new Date();
    const horaInicial = new Date(`${pedido.data} ${pedido.hora}`);
    const tempoDecorrido = Math.floor((agora.getTime() - horaInicial.getTime()) / (1000 * 60));
    
    const tempoEstimadoTexto = pedido.tempoEstimado || '30 min';
    const tempoEstimadoMinutos = parseInt(tempoEstimadoTexto);
    const tempoRestante = tempoEstimadoMinutos - tempoDecorrido;
    
    if (tempoRestante > 0) {
      return `${tempoRestante}min restantes`;
    }
    return 'Deveria chegar a qualquer momento';
  };

  const formatarData = (dataHora: string) => {
    const [data, hora] = dataHora.split(' ');
    return { data, hora };
  };

  if (loading || !user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="cliente" userName={profile?.nome || ''} cartCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos em tempo real
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {meusPedidos.filter(p => ['pendente', 'em_preparo', 'pronto', 'saiu_para_entrega'].includes(p.status)).length}
              </div>
              <p className="text-sm text-gray-600">Em andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {meusPedidos.filter(p => p.status === 'entregue').length}
              </div>
              <p className="text-sm text-gray-600">Entregues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
                     <div className="text-2xl font-bold text-blue-600">
                R$ {meusPedidos.reduce((total, p) => total + p.total, 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Total gasto</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {meusPedidos.length}
              </div>
              <p className="text-sm text-gray-600">Total de pedidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-6">
          {meusPedidos.map(pedido => {
            const { data, hora } = formatarData(`${pedido.data} ${pedido.hora}`);
            return (
              <Card key={pedido.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{pedido.restaurante.nome}</CardTitle>
                        <p className="text-sm text-gray-500">Pedido #{pedido.id.slice(0, 8)} • {data} às {hora}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusBadge(pedido.status).color}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(pedido.status)}
                          <span>{getStatusBadge(pedido.status).label}</span>
                        </div>
                      </Badge>
                      <span className="font-bold text-lg text-green-600">
                        R$ {pedido.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Tempo estimado */}
                    {getTempoEstimadoRestante(pedido) && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-800">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="font-medium">{getTempoEstimadoRestante(pedido)}</span>
                        </div>
                      </div>
                    )}

                    {/* Informações do entregador */}
                    {pedido.entregador && pedido.status === 'saiu_para_entrega' && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center text-orange-800">
                          <Truck className="w-4 h-4 mr-2" />
                          <span className="font-medium">
                            Entregador: {pedido.entregador.nome} • {pedido.entregador.telefone || 'Sem telefone'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Produtos */}
                    <div>
                      <h4 className="font-medium mb-2">Produtos:</h4>
                      <ul className="text-gray-600 space-y-1">
                        {pedido.itens.map((item, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2" />
                              {item.quantidade}x {item.nome}
                            </div>
                            <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Informações de Entrega */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        Entregar em: {pedido.cliente.endereco}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        Restaurante: {pedido.restaurante.endereco || 'Endereço não disponível'}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      {pedido.status !== 'entregue' && pedido.status !== 'cancelado' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRastrear(pedido)}
                        >
                          {pedido.status === 'saiu_para_entrega' ? 'Rastrear em Tempo Real' : 'Ver Status'}
                        </Button>
                      )}
                      
                      {pedido.status === 'entregue' && !pedido.avaliado && (
                        <Button 
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleAvaliar(
                            pedido.id, 
                            pedido.restaurante.nome, 
                            pedido.entregador?.nome
                          )}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Avaliar Pedido
                        </Button>
                      )}

                      {pedido.status === 'entregue' && pedido.avaliado && (
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="w-4 h-4 mr-1" />
                          Pedido Avaliado
                        </Badge>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePedirNovamente(pedido.restaurante.nome)}
                      >
                        Pedir Novamente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

      {/* Modal de Avaliação */}
      <ModalAvaliacao
        isOpen={modalAvaliacao.isOpen}
        onClose={handleCloseModal}
        pedidoId={modalAvaliacao.pedidoId}
        restaurante={modalAvaliacao.restaurante}
        entregador={modalAvaliacao.entregador}
        onAvaliacaoEnviada={handleAvaliacaoEnviada}
      />
    </div>
  );
};

export default MeusPedidosPage;