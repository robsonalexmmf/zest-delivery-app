import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import CarrinhoItem from '@/components/Cliente/CarrinhoItem';
import PagamentoPix from '@/components/Pagamento/PagamentoPix';
import AplicadorCupom from '@/components/Cliente/AplicadorCupom';
import GerenciadorEnderecos from '@/components/Cliente/GerenciadorEnderecos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Edit } from 'lucide-react';
import { restaurantes } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { pedidosService } from '@/services/pedidosService';

interface CupomAplicado {
  codigo: string;
  descricao: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
}

interface Endereco {
  id: string;
  nome: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep: string;
  referencia?: string;
  principal: boolean;
}

const CarrinhoPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | null>(null);
  const [showGerenciadorEnderecos, setShowGerenciadorEnderecos] = useState(false);
  const [pagamento, setPagamento] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [observacoes, setObservacoes] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<CupomAplicado | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pedidoId, setPedidoId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se é usuário de teste primeiro
    const testUser = localStorage.getItem('zdelivery_test_user');
    if (testUser) {
      try {
        const { profile } = JSON.parse(testUser);
        if (profile.tipo !== 'cliente') {
          navigate('/login');
        } else {
          setUser(profile);
          carregarEnderecoSalvo();
        }
      } catch (error) {
        console.error('Error loading test user:', error);
        localStorage.removeItem('zdelivery_test_user');
        navigate('/login');
      }
    } else {
      // Verificar usuário normal
      const userData = localStorage.getItem('zdelivery_user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.tipo !== 'cliente') {
          navigate('/login');
        } else {
          setUser(user);
          carregarEnderecoSalvo();
        }
      } else {
        navigate('/login');
      }
    }

    // Carregar carrinho
    const carrinhoSalvo = localStorage.getItem('zdelivery_carrinho');
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, [navigate]);

  const carregarEnderecoSalvo = () => {
    const endercosSalvos = localStorage.getItem('zdelivery_enderecos');
    if (endercosSalvos) {
      const enderecos = JSON.parse(endercosSalvos);
      const principal = enderecos.find((e: Endereco) => e.principal);
      if (principal) {
        setEnderecoSelecionado(principal);
      }
    }
  };

  const handleUpdateQuantity = (id: string, quantidade: number) => {
    const novoCarrinho = carrinho.map(item => 
      item.id === id ? { ...item, quantidade } : item
    );
    setCarrinho(novoCarrinho);
    localStorage.setItem('zdelivery_carrinho', JSON.stringify(novoCarrinho));
  };

  const handleRemoveItem = (id: string) => {
    const novoCarrinho = carrinho.filter(item => item.id !== id);
    setCarrinho(novoCarrinho);
    localStorage.setItem('zdelivery_carrinho', JSON.stringify(novoCarrinho));
    
    toast({
      title: 'Item removido',
      description: 'Item removido do carrinho com sucesso.',
    });
  };

  const handleCupomChange = (cupom: CupomAplicado | null) => {
    setCupomAplicado(cupom);
  };

  const handleEnderecoSelecionado = (endereco: Endereco) => {
    setEnderecoSelecionado(endereco);
    toast({
      title: 'Endereço selecionado!',
      description: `Endereço "${endereco.nome}" selecionado para entrega.`,
    });
  };

  const formatarEnderecoCompleto = (endereco: Endereco) => {
    return `${endereco.endereco}, ${endereco.numero}${endereco.complemento ? `, ${endereco.complemento}` : ''} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.cep}`;
  };

  const handleFinalizarPedido = () => {
    if (!enderecoSelecionado) {
      toast({
        title: 'Endereço obrigatório',
        description: 'Por favor, selecione um endereço de entrega.',
        variant: 'destructive'
      });
      return;
    }

    if (carrinho.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar.',
        variant: 'destructive'
      });
      return;
    }

    // Verificar se método de pagamento está configurado
    if (pagamento === 'pix') {
      const mpConfig = localStorage.getItem('zdelivery_mercadopago_config');
      if (!mpConfig || !JSON.parse(mpConfig).ativo) {
        toast({
          title: 'Pagamento PIX indisponível',
          description: 'O sistema de pagamento PIX não está configurado. Tente outro método.',
          variant: 'destructive'
        });
        return;
      }
    }

    // Gerar ID do pedido
    const novoIdPedido = `#${Date.now().toString().slice(-6)}`;
    setPedidoId(novoIdPedido);

    // Se for PIX, abrir modal de pagamento
    if (pagamento === 'pix') {
      setShowPixModal(true);
    } else {
      // Simular outros métodos de pagamento
      if (pagamento === 'cartao') {
        // Simular tela de cartão de crédito
        const dadosCartao = prompt('Número do cartão (simulação):\nDigite qualquer número para continuar');
        if (dadosCartao) {
          const cvv = prompt('CVV (simulação):');
          if (cvv) {
            toast({
              title: 'Processando pagamento...',
              description: 'Aguarde enquanto processamos seu cartão.',
            });
            setTimeout(() => confirmarPedido(novoIdPedido), 3000);
          }
        }
      } else if (pagamento === 'dinheiro') {
        // Para dinheiro na entrega, perguntar sobre troco
        const precisaTroco = confirm('Vai precisar de troco?');
        if (precisaTroco) {
          const valorTroco = prompt('Para quanto você precisa de troco?');
          if (valorTroco) {
            toast({
              title: 'Pedido confirmado!',
              description: `Entregador levará troco para R$ ${valorTroco}`,
            });
          }
        }
        confirmarPedido(novoIdPedido);
      } else {
        confirmarPedido(novoIdPedido);
      }
    }
  };

  const confirmarPedido = (id: string) => {
    // Criar pedido usando o serviço
    const pedidoData = {
      cliente: {
        nome: user.nome,
        endereco: formatarEnderecoCompleto(enderecoSelecionado!),
        telefone: user.telefone || '(11) 99999-9999'
      },
      restaurante: {
        nome: restaurantePedido?.nome || 'Restaurante',
        endereco: 'Rua das Flores, 123 - Centro',
        telefone: '(11) 3333-3333'
      },
      itens: carrinho.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco
      })),
      total: totalFinal,
      status: 'pendente' as const,
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      metodoPagamento: pagamento,
      valorEntrega: taxaEntrega,
      tempoEstimado: '30min',
      observacoes
    };

    // Usar o serviço de pedidos para criar o pedido
    const pedidoIdCriado = pedidosService.criarPedido(pedidoData);

    // Limpar carrinho
    localStorage.removeItem('zdelivery_carrinho');

    toast({
      title: 'Pedido realizado!',
      description: 'Seu pedido foi enviado para o restaurante.',
    });

    navigate('/meus-pedidos');
  };

  // Encontrar restaurante do primeiro item (assumindo que todos são do mesmo)
  const restaurantePedido = carrinho.length > 0 ? 
    restaurantes.find(r => carrinho.some(item => 
      r.id === '1' // Simplificação para demo - normalmente viria do produto
    )) : null;

  const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  const taxaEntrega = restaurantePedido?.taxaEntrega || 0;
  
  const valorDesconto = cupomAplicado ? (
    cupomAplicado.tipo === 'percentual' 
      ? (subtotal * cupomAplicado.valor) / 100
      : cupomAplicado.valor
  ) : 0;
  
  const totalFinal = Math.max(0, subtotal + taxaEntrega - valorDesconto);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="cliente" userName={user.nome} cartCount={carrinho.length} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Seu Carrinho</h1>

        {carrinho.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Seu carrinho está vazio</p>
            <Button onClick={() => navigate('/restaurantes')} className="bg-red-600 hover:bg-red-700">
              Ver Restaurantes
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Itens do Carrinho */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {carrinho.map(item => (
                    <CarrinhoItem
                      key={item.id}
                      id={item.id}
                      nome={item.nome}
                      preco={item.preco}
                      quantidade={item.quantidade}
                      imagem={item.imagem}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Endereço de Entrega</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGerenciadorEnderecos(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {enderecoSelecionado ? 'Alterar' : 'Adicionar'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {enderecoSelecionado ? (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <MapPin className="w-4 h-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">{enderecoSelecionado.nome}</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {formatarEnderecoCompleto(enderecoSelecionado)}
                      </p>
                      {enderecoSelecionado.referencia && (
                        <p className="text-xs text-gray-600 mt-1">
                          Referência: {enderecoSelecionado.referencia}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Nenhum endereço selecionado</p>
                      <Button
                        onClick={() => setShowGerenciadorEnderecos(true)}
                        className="mt-2 bg-red-600 hover:bg-red-700"
                      >
                        Adicionar Endereço
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Observações */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Alguma observação para o pedido..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Aplicador de Cupom */}
                  <AplicadorCupom
                    onCupomAplicado={handleCupomChange}
                    cupomAtual={cupomAplicado}
                    subtotal={subtotal}
                  />

                  {/* Forma de Pagamento */}
                  <div>
                    <Label>Forma de Pagamento</Label>
                    <RadioGroup value={pagamento} onValueChange={(value: any) => setPagamento(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center cursor-pointer">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                            PIX
                          </span>
                          Pagamento instantâneo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cartao" id="cartao" />
                        <Label htmlFor="cartao" className="flex items-center cursor-pointer">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                            Cartão
                          </span>
                          Cartão de Crédito/Débito
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dinheiro" id="dinheiro" />
                        <Label htmlFor="dinheiro" className="flex items-center cursor-pointer">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-2">
                            Dinheiro
                          </span>
                          Dinheiro na entrega
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Valores */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de entrega:</span>
                      <span>R$ {taxaEntrega.toFixed(2)}</span>
                    </div>
                    {valorDesconto > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({cupomAplicado?.codigo}):</span>
                        <span>-R$ {valorDesconto.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>R$ {totalFinal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleFinalizarPedido}
                    className="w-full bg-red-600 hover:bg-red-700"
                    size="lg"
                    disabled={!enderecoSelecionado}
                  >
                    Finalizar Pedido
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <GerenciadorEnderecos
        isOpen={showGerenciadorEnderecos}
        onClose={() => setShowGerenciadorEnderecos(false)}
        onSelectEndereco={handleEnderecoSelecionado}
      />

      <PagamentoPix
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        valor={totalFinal}
        pedidoId={pedidoId}
        onPagamentoConfirmado={() => confirmarPedido(pedidoId)}
      />
    </div>
  );
};

export default CarrinhoPage;