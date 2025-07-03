import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Phone, 
  MessageSquare,
  Filter,
  Download,
  Search,
  Calendar,
  Eye,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Pedido {
  id: string;
  cliente: string;
  endereco: string;
  itens: { nome: string; quantidade: number }[];
  total: number;
  status: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
  data: string;
  hora: string;
  entregador?: string;
  observacoes?: string;
  metodoPagamento: 'dinheiro' | 'cartao' | 'pix';
}

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
    // Simulação de dados de pedidos (substitua por sua lógica real)
    const pedidosMock: Pedido[] = [
      {
        id: '1',
        cliente: 'João Silva',
        endereco: 'Rua A, 123 - Centro',
        itens: [{ nome: 'Pizza Calabresa', quantidade: 1 }, { nome: 'Coca-Cola', quantidade: 2 }],
        total: 45.50,
        status: 'pendente',
        data: '2024-08-01',
        hora: '19:30',
        metodoPagamento: 'dinheiro',
        observacoes: 'Sem cebola, por favor.'
      },
      {
        id: '2',
        cliente: 'Maria Souza',
        endereco: 'Av. B, 456 - Jardim',
        itens: [{ nome: 'Hamburguer', quantidade: 2 }, { nome: 'Batata Frita', quantidade: 1 }],
        total: 32.00,
        status: 'em_preparo',
        data: '2024-08-01',
        hora: '20:00',
        metodoPagamento: 'cartao',
        entregador: 'Carlos',
        observacoes: 'Adicionar maionese extra.'
      },
      {
        id: '3',
        cliente: 'Ana Paula',
        endereco: 'Rua C, 789 - Vila Nova',
        itens: [{ nome: 'Sushi', quantidade: 10 }],
        total: 68.00,
        status: 'saiu_para_entrega',
        data: '2024-08-01',
        hora: '20:15',
        metodoPagamento: 'pix',
        entregador: 'Pedro'
      },
      {
        id: '4',
        cliente: 'Ricardo Oliveira',
        endereco: 'Av. D, 1011 - Bela Vista',
        itens: [{ nome: 'Pizza Margherita', quantidade: 1 }, { nome: 'Suco de Laranja', quantidade: 1 }],
        total: 40.00,
        status: 'entregue',
        data: '2024-08-01',
        hora: '20:30',
        metodoPagamento: 'dinheiro'
      },
      {
        id: '5',
        cliente: 'Fernanda Costa',
        endereco: 'Rua E, 1213 - Floresta',
        itens: [{ nome: 'Salada', quantidade: 1 }],
        total: 25.00,
        status: 'cancelado',
        data: '2024-08-01',
        hora: '20:45',
        metodoPagamento: 'cartao',
        observacoes: 'Pedido cancelado pelo cliente.'
      },
    ];
    setPedidos(pedidosMock);
  };

  const filtrarPedidos = () => {
    let pedidosFiltrados = pedidos;

    if (filtroStatus) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.status === filtroStatus);
    }

    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      pedidosFiltrados = pedidosFiltrados.filter(pedido =>
        pedido.cliente.toLowerCase().includes(termo) ||
        pedido.endereco.toLowerCase().includes(termo) ||
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
    setPedidos(pedidos.map(pedido =>
      pedido.id === id ? { ...pedido, status: novoStatus } : pedido
    ));
    toast({
      title: 'Status do pedido atualizado!',
      description: `O pedido ${id} foi atualizado para ${novoStatus}.`,
    });
  };

  const handleObservacoesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservacoes(e.target.value);
  };

  const salvarObservacoes = () => {
    if (pedidoSelecionado) {
      setPedidos(pedidos.map(pedido =>
        pedido.id === pedidoSelecionado.id ? { ...pedido, observacoes: observacoes } : pedido
      ));
      setPedidoSelecionado({ ...pedidoSelecionado, observacoes: observacoes });
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pedidos do Restaurante
          </h1>
          <p className="text-gray-600">
            Acompanhe e gerencie os pedidos do seu restaurante
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Filtro por Status */}
          <div>
            <Label htmlFor="filtro-status">Filtrar por Status:</Label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger id="filtro-status">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_preparo">Em Preparo</SelectItem>
                <SelectItem value="saiu_para_entrega">Saiu para Entrega</SelectItem>
                <SelectItem value="entregue">Entregues</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Busca por Termo */}
          <div>
            <Label htmlFor="busca">Buscar:</Label>
            <div className="relative">
              <Input
                id="busca"
                type="search"
                placeholder="Buscar por cliente, endereço ou #ID"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <Search className="absolute top-2.5 right-3 w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Filtro por Data */}
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
              <Card key={pedido.id} className="border">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Pedido #{pedido.id} - {pedido.cliente}
                    </div>
                  </CardTitle>
                  <Badge variant="secondary">{pedido.metodoPagamento}</Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <strong>Endereço:</strong>
                    <p>{pedido.endereco}</p>
                  </div>
                  <div>
                    <strong>Data/Hora:</strong>
                    <p>{pedido.data} - {pedido.hora}</p>
                  </div>
                  <div>
                    <strong>Total:</strong>
                    <p>R$ {pedido.total.toFixed(2)}</p>
                  </div>

                  <div className="md:col-span-3">
                    <strong>Itens:</strong>
                    <ul>
                      {pedido.itens.map((item, index) => (
                        <li key={index}>
                          {item.quantidade}x {item.nome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-3 flex justify-between items-center">
                    <div>
                      <strong>Status:</strong>
                      <Badge
                        className={
                          pedido.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : pedido.status === 'em_preparo'
                            ? 'bg-blue-100 text-blue-800'
                            : pedido.status === 'saiu_para_entrega'
                            ? 'bg-purple-100 text-purple-800'
                            : pedido.status === 'entregue'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {pedido.status}
                      </Badge>
                    </div>

                    <div className="space-x-2">
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
                      
                      <Select
                        value={pedido.status}
                        onValueChange={(value: any) => handleStatusChange(pedido.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="em_preparo">Em Preparo</SelectItem>
                          <SelectItem value="saiu_para_entrega">Saiu para Entrega</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center">
                <p className="text-gray-600">Nenhum pedido encontrado.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal de Detalhes do Pedido */}
        <Dialog open={detalhesAberto} onOpenChange={setDetalhesAberto}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
            </DialogHeader>

            {pedidoSelecionado && (
              <div className="space-y-4">
                <div>
                  <strong>Cliente:</strong>
                  <p>{pedidoSelecionado.cliente}</p>
                </div>
                <div>
                  <strong>Endereço:</strong>
                  <p>{pedidoSelecionado.endereco}</p>
                </div>
                <div>
                  <strong>Itens:</strong>
                  <ul>
                    {pedidoSelecionado.itens.map((item, index) => (
                      <li key={index}>
                        {item.quantidade}x {item.nome}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Total:</strong>
                  <p>R$ {pedidoSelecionado.total.toFixed(2)}</p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge
                    className={
                      pedidoSelecionado.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : pedidoSelecionado.status === 'em_preparo'
                        ? 'bg-blue-100 text-blue-800'
                        : pedidoSelecionado.status === 'saiu_para_entrega'
                        ? 'bg-purple-100 text-purple-800'
                        : pedidoSelecionado.status === 'entregue'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {pedidoSelecionado.status}
                  </Badge>
                </div>
                 <div>
                  <strong>Método de Pagamento:</strong>
                  <p>{pedidoSelecionado.metodoPagamento}</p>
                </div>
                <div>
                  <strong>Observações:</strong>
                  <Textarea
                    value={observacoes}
                    onChange={handleObservacoesChange}
                    placeholder="Adicione observações sobre o pedido"
                  />
                </div>
                <Button onClick={salvarObservacoes} className="bg-red-600 hover:bg-red-700">Salvar Observações</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PedidosRestaurantePage;
