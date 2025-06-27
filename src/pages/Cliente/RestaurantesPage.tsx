
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import RestauranteCard from '@/components/Cliente/RestauranteCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { restaurantes } from '@/data/mockData';
import { Search } from 'lucide-react';

const RestaurantesPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [restaurantesFiltrados, setRestaurantesFiltrados] = useState(restaurantes);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    let resultado = restaurantes;

    // Filtro por categoria
    if (filtroCategoria !== 'todos') {
      resultado = resultado.filter(r => r.categoria.toLowerCase() === filtroCategoria.toLowerCase());
    }

    // Filtro por busca
    if (termoBusca) {
      resultado = resultado.filter(r => 
        r.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        r.categoria.toLowerCase().includes(termoBusca.toLowerCase()) ||
        r.descricao.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }

    setRestaurantesFiltrados(resultado);
  }, [filtroCategoria, termoBusca]);

  const categorias = ['todos', ...Array.from(new Set(restaurantes.map(r => r.categoria)))];

  const handleRestauranteClick = (restauranteId: string) => {
    navigate(`/restaurante/${restauranteId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="cliente" userName={user.nome} cartCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Restaurantes Disponíveis
          </h1>
          
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar restaurantes, categorias..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria === 'todos' ? 'Todas as categorias' : categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Restaurantes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantesFiltrados.map(restaurante => (
            <RestauranteCard
              key={restaurante.id}
              id={restaurante.id}
              nome={restaurante.nome}
              categoria={restaurante.categoria}
              avaliacao={restaurante.avaliacao}
              tempoEntrega={restaurante.tempoEntrega}
              taxaEntrega={restaurante.taxaEntrega}
              imagem={restaurante.imagem}
              descricao={restaurante.descricao}
              onClick={() => handleRestauranteClick(restaurante.id)}
            />
          ))}
        </div>

        {restaurantesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum restaurante encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantesPage;
