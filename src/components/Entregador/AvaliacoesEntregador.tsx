import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, TrendingUp, Calendar, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Avaliacao {
  id: string;
  pedido_id: string;
  nota_entregador: number;
  comentario_entregador: string;
  created_at: string;
  cliente: {
    nome: string;
  };
  restaurante: {
    nome: string;
  };
}

interface AvaliacoesEntregadorProps {
  entregadorNome: string;
}

const AvaliacoesEntregador: React.FC<AvaliacoesEntregadorProps> = ({ entregadorNome }) => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [estatisticas, setEstatisticas] = useState({
    mediaGeral: 0,
    totalAvaliacoes: 0,
    distribuicao: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAvaliacoes();
  }, [entregadorNome]);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      
      // Buscar o ID do entregador através do perfil
      const { data: perfil, error: perfilError } = await supabase
        .from('profiles')
        .select('id')
        .eq('nome', entregadorNome)
        .eq('tipo', 'entregador')
        .maybeSingle();

      if (perfilError || !perfil) {
        console.error('Erro ao buscar perfil do entregador:', perfilError);
        return;
      }

      const { data: entregador, error: entregadorError } = await supabase
        .from('entregadores')
        .select('id')
        .eq('user_id', perfil.id)
        .maybeSingle();

      if (entregadorError || !entregador) {
        console.error('Erro ao buscar entregador:', entregadorError);
        return;
      }

      // Buscar avaliações do entregador
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('entregador_id', entregador.id)
        .not('nota_entregador', 'is', null)
        .order('created_at', { ascending: false });

      if (avaliacoesError) {
        console.error('Erro ao buscar avaliações:', avaliacoesError);
        return;
      }

      // Buscar nomes dos clientes e restaurantes separadamente
      const avaliacoesFormatadas = [];
      for (const av of avaliacoesData || []) {
        const { data: cliente } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id', av.cliente_id)
          .maybeSingle();

        const { data: restauranteData } = await supabase
          .from('restaurantes')
          .select('nome')
          .eq('id', av.restaurante_id)
          .maybeSingle();

        avaliacoesFormatadas.push({
          id: av.id,
          pedido_id: av.pedido_id,
          nota_entregador: av.nota_entregador,
          comentario_entregador: av.comentario_entregador || '',
          created_at: av.created_at,
          cliente: {
            nome: cliente?.nome || 'Cliente'
          },
          restaurante: {
            nome: restauranteData?.nome || 'Restaurante'
          }
        });
      }

      setAvaliacoes(avaliacoesFormatadas);

      // Calcular estatísticas
      if (avaliacoesFormatadas.length > 0) {
        const notas = avaliacoesFormatadas.map(av => av.nota_entregador);
        const media = notas.reduce((acc, nota) => acc + nota, 0) / notas.length;
        
        const distribuicao = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        notas.forEach(nota => {
          distribuicao[nota as keyof typeof distribuicao]++;
        });

        setEstatisticas({
          mediaGeral: Number(media.toFixed(1)),
          totalAvaliacoes: avaliacoesFormatadas.length,
          distribuicao
        });
      }

    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (nota: number) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((estrela) => (
        <Star
          key={estrela}
          className={`w-4 h-4 ${
            estrela <= nota
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <span className="text-3xl font-bold ml-2">{estatisticas.mediaGeral}</span>
            </div>
            <p className="text-sm text-gray-600">Avaliação Média</p>
            <div className="flex justify-center mt-2">
              {renderStars(Math.round(estatisticas.mediaGeral))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-3xl font-bold">{estatisticas.totalAvaliacoes}</span>
            </div>
            <p className="text-sm text-gray-600">Total de Avaliações</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
              <span className="text-3xl font-bold">
                {estatisticas.totalAvaliacoes > 0 
                  ? Math.round((estatisticas.distribuicao[4] + estatisticas.distribuicao[5]) / estatisticas.totalAvaliacoes * 100)
                  : 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Avaliações Positivas</p>
            <p className="text-xs text-gray-500">(4-5 estrelas)</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Distribuição das Avaliações de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(nota => (
              <div key={nota} className="flex items-center space-x-3">
                <span className="w-8 text-sm">{nota}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ 
                      width: estatisticas.totalAvaliacoes > 0 
                        ? `${(estatisticas.distribuicao[nota as keyof typeof estatisticas.distribuicao] / estatisticas.totalAvaliacoes) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <span className="w-8 text-sm text-right">
                  {estatisticas.distribuicao[nota as keyof typeof estatisticas.distribuicao]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {avaliacoes.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma avaliação ainda</p>
              <p className="text-sm text-gray-400">As avaliações dos clientes sobre suas entregas aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              {avaliacoes.map(avaliacao => (
                <div key={avaliacao.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{avaliacao.cliente.nome}</span>
                        <Badge variant="outline" className="text-xs">
                          {avaliacao.restaurante.nome}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Pedido #{avaliacao.pedido_id}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(avaliacao.nota_entregador)}
                        <span className="text-sm text-gray-600">
                          {avaliacao.nota_entregador}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatarData(avaliacao.created_at)}
                    </div>
                  </div>
                  
                  {avaliacao.comentario_entregador && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        "{avaliacao.comentario_entregador}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvaliacoesEntregador;