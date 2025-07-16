
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import ProdutoCard from '@/components/Cliente/ProdutoCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { restaurantes, produtos } from '@/data/mockData';
import { Star, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RestauranteDetalhePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [restaurante, setRestaurante] = useState<any>(null);
  const [produtosRestaurante, setProdutosRestaurante] = useState<any[]>([]);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    // Buscar restaurante pelo ID
    const restauranteEncontrado = restaurantes.find(r => r.id === id);
    if (restauranteEncontrado) {
      setRestaurante(restauranteEncontrado);
      // Buscar produtos dos dados globais primeiro
      const produtosGlobais = JSON.parse(localStorage.getItem('zdelivery_produtos_globais') || '{}');
      const produtosDoRestaurante = produtosGlobais[restauranteEncontrado.nome] || [];
      
      // Se não houver produtos globais, usar produtos mock
      if (produtosDoRestaurante.length === 0) {
        const produtosMock = produtos.filter(p => p.restauranteId === restauranteEncontrado.id);
        setProdutosRestaurante(produtosMock);
      } else {
        setProdutosRestaurante(produtosDoRestaurante);
      }
    } else {
      navigate('/restaurantes');
    }

    // Carregar carrinho do localStorage
    const carrinhoSalvo = localStorage.getItem('zdelivery_carrinho');
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, [id, navigate]);

  const handleAddToCart = (produto: any) => {
    const novoCarrinho = [...carrinho];
    const itemExistente = novoCarrinho.find(item => item.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      novoCarrinho.push({ ...produto, quantidade: 1 });
    }

    setCarrinho(novoCarrinho);
    localStorage.setItem('zdelivery_carrinho', JSON.stringify(novoCarrinho));
    
    toast({
      title: 'Produto adicionado!',
      description: `${produto.nome} foi adicionado ao carrinho.`,
    });
  };

  const categoriasProdutos = Array.from(new Set(produtosRestaurante.map(p => p.categoria)));
  const totalItensCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);

  if (!user || !restaurante) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="cliente" userName={user.nome} cartCount={totalItensCarrinho} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header do Restaurante */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="relative">
            <img 
              src={restaurante.imagem} 
              alt={restaurante.nome}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold mb-2">{restaurante.nome}</h1>
              <p className="text-lg opacity-90">{restaurante.descricao}</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge className="bg-red-100 text-red-800">{restaurante.categoria}</Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurante.avaliacao}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{restaurante.tempoEntrega}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Taxa: R$ {restaurante.taxaEntrega.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos por Categoria */}
        <div className="space-y-8">
          {categoriasProdutos.map(categoria => (
            <div key={categoria}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{categoria}</h2>
              <div className="grid gap-4">
                {produtosRestaurante
                  .filter(produto => produto.categoria === categoria)
                  .map(produto => (
                    <ProdutoCard
                      key={produto.id}
                      id={produto.id}
                      nome={produto.nome}
                      descricao={produto.descricao}
                      preco={produto.preco}
                      imagem={produto.imagem}
                      categoria={produto.categoria}
                      disponivel={produto.disponivel}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {produtosRestaurante.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Este restaurante ainda não possui produtos cadastrados.
            </p>
          </div>
        )}

        {/* Botão Carrinho Flutuante */}
        {totalItensCarrinho > 0 && (
          <div className="fixed bottom-4 right-4">
            <Button 
              onClick={() => navigate('/carrinho')}
              className="bg-red-600 hover:bg-red-700 rounded-full px-6 py-3 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ver Carrinho ({totalItensCarrinho})
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestauranteDetalhePage;
