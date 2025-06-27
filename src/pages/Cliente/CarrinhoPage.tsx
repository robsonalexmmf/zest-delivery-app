
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import CarrinhoItem from '@/components/Cliente/CarrinhoItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { restaurantes } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const CarrinhoPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState<'pix' | 'cartao'>('pix');
  const [observacoes, setObservacoes] = useState('');
  const [cupom, setCupom] = useState('');
  const [desconto, setDesconto] = useState(0);
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

  const handleAplicarCupom = () => {
    const cuponsValidos = {
      'DESCONTO10': 10,
      'PRIMEIRACOMPRA': 15,
      'FRETEGRATIS': 5
    };

    if (cuponsValidos[cupom as keyof typeof cuponsValidos]) {
      setDesconto(cuponsValidos[cupom as keyof typeof cuponsValidos]);
      toast({
        title: 'Cupom aplicado!',
        description: `Desconto de ${cuponsValidos[cupom as keyof typeof cuponsValidos]}% aplicado.`,
      });
    } else {
      toast({
        title: 'Cupom inválido',
        description: 'O cupom informado não é válido.',
        variant: 'destructive'
      });
    }
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

    // Simular criação do pedido
    const pedido = {
      id: Math.random().toString(36),
      produtos: carrinho,
      endereco,
      pagamento,
      observacoes,
      total: totalFinal,
      status: 'aguardando',
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
  const valorDesconto = (subtotal * desconto) / 100;
  const totalFinal = subtotal + taxaEntrega - valorDesconto;

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
                  {/* Cupom de Desconto */}
                  <div>
                    <Label htmlFor="cupom">Cupom de Desconto</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="cupom"
                        value={cupom}
                        onChange={(e) => setCupom(e.target.value.toUpperCase())}
                        placeholder="Digite o cupom"
                      />
                      <Button variant="outline" onClick={handleAplicarCupom}>
                        Aplicar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cupons válidos: DESCONTO10, PRIMEIRACOMPRA, FRETEGRATIS
                    </p>
                  </div>

                  {/* Forma de Pagamento */}
                  <div>
                    <Label htmlFor="pagamento">Forma de Pagamento</Label>
                    <Select value={pagamento} onValueChange={(value: any) => setPagamento(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
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
                    {desconto > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({desconto}%):</span>
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
                    Finalizar Pedido
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CarrinhoPage;
