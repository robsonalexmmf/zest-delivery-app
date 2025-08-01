
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import RestauranteCard from '@/components/Cliente/RestauranteCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { restaurantes } from '@/data/mockData';
import { Search, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const RestaurantesPage: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroCidade, setFiltroCidade] = useState('todas');
  const [termoBusca, setTermoBusca] = useState('');
  const [restaurantesFiltrados, setRestaurantesFiltrados] = useState(restaurantes);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile && profile.tipo !== 'cliente') {
        navigate('/auth');
      }
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    let resultado = restaurantes;

    // Filtro por categoria
    if (filtroCategoria !== 'todos') {
      resultado = resultado.filter(r => r.categoria.toLowerCase() === filtroCategoria.toLowerCase());
    }

    // Filtro por cidade
    if (filtroCidade !== 'todas') {
      resultado = resultado.filter(r => r.cidade?.toLowerCase() === filtroCidade.toLowerCase());
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
  }, [filtroCategoria, filtroCidade, termoBusca]);

  const categorias = [
    { value: 'todos', label: 'Todas as categorias' },
    { value: 'açaí', label: 'Açaí' },
    { value: 'sorveteria', label: 'Sorveteria' },
    { value: 'japonesa', label: 'Japonesa' },
    { value: 'italiana', label: 'Italiana' },
    { value: 'pizzaria', label: 'Pizzaria' },
    { value: 'brasileira', label: 'Brasileira' },
    { value: 'lanches', label: 'Lanches' },
    { value: 'hamburguer', label: 'Hambúrguer' },
    { value: 'mexicana', label: 'Mexicana' },
  ];

  const cidades = [
    'todas',
    ...Array.from(new Set(restaurantes.map(r => r.cidade).filter(Boolean)))
  ];

  const handleRestauranteClick = (restauranteId: string) => {
    navigate(`/restaurante/${restauranteId}`);
  };

  const limparFiltros = () => {
    setFiltroCategoria('todos');
    setFiltroCidade('todas');
    setTermoBusca('');
  };

  if (loading || !user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="cliente" userName={profile?.nome} cartCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Restaurantes Disponíveis
          </h1>
          
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Busca */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar restaurantes, categorias..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filtro Categoria */}
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="lg:w-56">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro Cidade */}
              <Select value={filtroCidade} onValueChange={setFiltroCidade}>
                <SelectTrigger className="lg:w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cidades.map(cidade => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade === 'todas' ? 'Todas as cidades' : cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtros Ativos */}
            <div className="flex flex-wrap gap-2 items-center">
              {filtroCategoria !== 'todos' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categorias.find(c => c.value === filtroCategoria)?.label}
                  <button 
                    onClick={() => setFiltroCategoria('todos')}
                    className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filtroCidade !== 'todas' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {filtroCidade}
                  <button 
                    onClick={() => setFiltroCidade('todas')}
                    className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {termoBusca && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  "{termoBusca}"
                  <button 
                    onClick={() => setTermoBusca('')}
                    className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}

              {(filtroCategoria !== 'todos' || filtroCidade !== 'todas' || termoBusca) && (
                <button 
                  onClick={limparFiltros}
                  className="text-sm text-red-600 hover:text-red-700 underline ml-2"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mb-4">
            <p className="text-gray-600">
              {restaurantesFiltrados.length} restaurante{restaurantesFiltrados.length !== 1 ? 's' : ''} encontrado{restaurantesFiltrados.length !== 1 ? 's' : ''}
            </p>
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
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Search className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum restaurante encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Não encontramos restaurantes com os filtros selecionados. Tente:
              </p>
              <ul className="text-sm text-gray-500 space-y-1 mb-6">
                <li>• Verificar a ortografia</li>
                <li>• Usar termos mais gerais</li>
                <li>• Remover alguns filtros</li>
              </ul>
              <button 
                onClick={limparFiltros}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Ver todos os restaurantes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantesPage;
