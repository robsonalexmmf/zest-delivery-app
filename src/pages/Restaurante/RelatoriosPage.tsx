
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Package, TrendingUp, Users, Star, Clock } from 'lucide-react';

const RelatoriosPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'restaurante') {
        navigate('/login');
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Dados mockados para relatórios
  const dadosRelatorio = {
    semana: {
      vendas: 5487.60,
      pedidos: 67,
      ticket_medio: 81.90,
      crescimento: 12.5,
      clientes_unicos: 52,
      avaliacao_media: 4.6,
      tempo_preparo: 28,
      produtos_mais_vendidos: [
        { nome: 'Pizza Margherita', quantidade: 15, valor: 538.50 },
        { nome: 'Pizza Calabresa', quantidade: 12, valor: 466.80 },
        { nome: 'Pizza Portuguesa', quantidade: 8, valor: 343.20 }
      ]
    },
    mes: {
      vendas: 24580.40,
      pedidos: 312,
      ticket_medio: 78.80,
      crescimento: 18.3,
      clientes_unicos: 198,
      avaliacao_media: 4.5,
      tempo_preparo: 32,
      produtos_mais_vendidos: [
        { nome: 'Pizza Margherita', quantidade: 68, valor: 2443.20 },
        { nome: 'Pizza Calabresa', quantidade: 52, valor: 2023.80 },
        { nome: 'Pizza 4 Queijos', quantidade: 41, valor: 1880.90 }
      ]
    },
    trimestre: {
      vendas: 78650.20,
      pedidos: 987,
      ticket_medio: 79.70,
      crescimento: 22.1,
      clientes_unicos: 456,
      avaliacao_media: 4.4,
      tempo_preparo: 30,
      produtos_mais_vendidos: [
        { nome: 'Pizza Margherita', quantidade: 195, valor: 7005.00 },
        { nome: 'Pizza Calabresa', quantidade: 168, valor: 6535.20 },
        { nome: 'Pizza 4 Queijos', quantidade: 142, valor: 6518.00 }
      ]
    }
  };

  const dados = dadosRelatorio[periodoSelecionado as keyof typeof dadosRelatorio];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="restaurante" userName={user.nome} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Relatórios
              </h1>
              <p className="text-gray-600">
                Acompanhe o desempenho do seu restaurante
              </p>
            </div>
            
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última semana</SelectItem>
                <SelectItem value="mes">Último mês</SelectItem>
                <SelectItem value="trimestre">Último trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Faturamento
                </CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {dados.vendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{dados.crescimento}% vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Pedidos
                </CardTitle>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {dados.pedidos}
              </div>
              <p className="text-xs text-gray-500">
                Ticket médio: R$ {dados.ticket_medio.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Clientes Únicos
                </CardTitle>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {dados.clientes_unicos}
              </div>
              <p className="text-xs text-gray-500">
                Avaliação média: {dados.avaliacao_media}/5
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tempo Médio
                </CardTitle>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dados.tempo_preparo}min
              </div>
              <p className="text-xs text-gray-500">
                Preparo + entrega
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Produtos Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dados.produtos_mais_vendidos.map((produto, index) => (
                  <div key={produto.nome} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{produto.nome}</p>
                        <p className="text-sm text-gray-500">{produto.quantidade} vendidos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        R$ {produto.valor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Desempenho */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Avaliação Média</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{dados.avaliacao_media}</span>
                    <span className="text-gray-500">/5</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span>Ticket Médio</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">R$ {dados.ticket_medio.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span>Crescimento</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">+{dados.crescimento}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span>Tempo Médio</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{dados.tempo_preparo}</span>
                    <span className="text-gray-500">min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dicas de Melhoria */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Dicas de Melhoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Tempo de Preparo</h4>
                <p className="text-sm text-blue-700">
                  Seu tempo médio está {dados.tempo_preparo > 30 ? 'acima' : 'dentro'} da média ideal (30min). 
                  {dados.tempo_preparo > 30 && ' Considere otimizar os processos de cozinha.'}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Crescimento</h4>
                <p className="text-sm text-green-700">
                  Excelente crescimento de {dados.crescimento}%! Continue investindo em qualidade e marketing.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Avaliações</h4>
                <p className="text-sm text-yellow-700">
                  Sua avaliação de {dados.avaliacao_media}/5 é {dados.avaliacao_media >= 4.5 ? 'excelente' : 'boa'}. 
                  {dados.avaliacao_media < 4.5 && ' Foque em melhorar a qualidade dos produtos.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RelatoriosPage;
