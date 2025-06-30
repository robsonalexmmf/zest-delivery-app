
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import CarrinhoItem from '@/components/Cliente/CarrinhoItem';
import PagamentoPix from '@/components/Pagamento/PagamentoPix';
import AplicadorCupom from '@/components/Cliente/AplicadorCupom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { restaurantes } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface CupomAplicado {
  codigo: string;
  descricao: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
}

const CarrinhoPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState<'pix' | 'cartao'>('pix');
  const [observacoes, setObservacoes] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<CupomAplicado | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pedidoId, setPedidoId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setEndereco(user.endereco || '');
    } else {
      navigate('/login');
    }

    // Carregar carrinho
    const carrinhoSalvo = localStorage.getItem('zdelivery_carrinho');
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }

    // Verificar se Mercado Pago está configurado
    const mpConfig = localStorage.getItem('zdelivery_mercadopago_config');
    if (!mpConfig) {
      console.warn('Mercado Pago não configurado');
    }
  }, [navigate]);

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

  const handleFinalizarPedido = () => {
    if (!endereco.trim()) {
      toast({
        title: 'Endereço obrigatório',
        description: 'Por favor, informe o endereço de entrega.',
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
          description: 'O sistema de pagamento PIX não está configurado. Tente o cartão.',
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
      // Simular pagamento com cartão
      finalizarPedidoComCartao(novoIdPedido);
    }
  };

  const finalizarPedidoComCartao = (id: string) => {
    // Simular processamento do cartão
    toast({
      title: 'Processando pagamento...',
      description: 'Aguarde enquanto processamos seu cartão.',
    });

    setTimeout(() => {
      confirmarPedido(id);
    }, 3000);
  };

  const confirmarPedido = (id: string) => {
    // Simular criação do pedido
    const pedido = {
      id,
      produtos: carrinho,
      endereco,
      pagamento,
      observacoes,
      cupom: cupomAplicado,
      subtotal,
      taxaEntrega,
      valorDesconto,
      total: totalFinal,
      status: 'recebido',
      dataCriacao: new Date().toISOString()
    };

    // Salvar pedido e limpar carrinho
    const pedidosAnteriores = JSON.parse(localStorage.getItem('zdelivery_pedidos') || '[]');
    pedidosAnteriores.push(pedido);
    localStorage.setItem('zdelivery_pedidos', JSON.stringify(pedidosAnteriores));
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

              {/* Endereço e Observações */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Dados da Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="endereco">Endereço de Entrega</Label>
                    <Textarea
                      id="endereco"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Rua, número, bairro, cidade..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="observacoes">Observações (opcional)</Label>
                    <Textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Alguma observação para o pedido..."
                      rows={2}
                    />
                  </div>
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
                          Pagamento instantâneo (Mercado Pago)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cartao" id="cartao" />
                        <Label htmlFor="cartao" className="flex items-center cursor-pointer">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                            Cartão
                          </span>
                          Cartão de Crédito
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
                  >
                    {pagamento === 'pix' ? 'Pagar com PIX (Mercado Pago)' : 'Pagar com Cartão'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Pagamento PIX */}
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
