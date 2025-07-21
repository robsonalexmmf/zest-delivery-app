
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Star, Store, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { pedidosService } from '@/services/pedidosService';

interface ModalAvaliacaoProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: string;
  restaurante: string;
  entregador?: string;
  onAvaliacaoEnviada?: () => void;
}

const ModalAvaliacao: React.FC<ModalAvaliacaoProps> = ({
  isOpen,
  onClose,
  pedidoId,
  restaurante,
  entregador,
  onAvaliacaoEnviada
}) => {
  const [notaRestaurante, setNotaRestaurante] = useState(0);
  const [notaEntregador, setNotaEntregador] = useState(0);
  const [comentarioRestaurante, setComentarioRestaurante] = useState('');
  const [comentarioEntregador, setComentarioEntregador] = useState('');
  const [hoverNotaRestaurante, setHoverNotaRestaurante] = useState(0);
  const [hoverNotaEntregador, setHoverNotaEntregador] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar usuário logado
    const testUser = localStorage.getItem('zdelivery_test_user');
    if (testUser) {
      try {
        const { profile } = JSON.parse(testUser);
        setUser(profile);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    }
  }, []);

  const resetForm = () => {
    setNotaRestaurante(0);
    setNotaEntregador(0);
    setComentarioRestaurante('');
    setComentarioEntregador('');
    setHoverNotaRestaurante(0);
    setHoverNotaEntregador(0);
  };

  const handleSubmit = async () => {
    if (notaRestaurante === 0) {
      toast({
        title: 'Avaliação obrigatória',
        description: 'Por favor, avalie o restaurante com 1 a 5 estrelas.',
        variant: 'destructive'
      });
      return;
    }

    if (entregador && notaEntregador === 0) {
      toast({
        title: 'Avaliação do entregador obrigatória',
        description: 'Por favor, avalie o entregador com 1 a 5 estrelas.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Primeiro buscar os dados do pedido para obter os IDs necessários
      const pedidos = pedidosService.getPedidos();
      const pedido = pedidos.find(p => p.id === pedidoId);
      
      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      // Buscar o restaurante para obter o ID
      const { data: restaurantes, error: restauranteError } = await supabase
        .from('restaurantes')
        .select('id')
        .eq('nome', restaurante)
        .maybeSingle();

      if (restauranteError) {
        throw restauranteError;
      }

      let entregadorId = null;
      if (entregador) {
        const { data: entregadorData, error: entregadorError } = await supabase
          .from('entregadores')
          .select('id')
          .eq('user_id', (await supabase.from('profiles').select('id').eq('nome', entregador).maybeSingle()).data?.id)
          .maybeSingle();

        if (!entregadorError && entregadorData) {
          entregadorId = entregadorData.id;
        }
      }

      // Inserir avaliação no Supabase
      const { error: avaliacaoError } = await supabase
        .from('avaliacoes')
        .insert({
          pedido_id: pedidoId,
          cliente_id: user.id,
          restaurante_id: restaurantes?.id,
          entregador_id: entregadorId,
          nota_restaurante: notaRestaurante,
          nota_entregador: entregador ? notaEntregador : null,
          comentario_restaurante: comentarioRestaurante || null,
          comentario_entregador: entregador ? comentarioEntregador || null : null
        });

      if (avaliacaoError) {
        throw avaliacaoError;
      }

      // Atualizar status do pedido para avaliado
      const { error: pedidoError } = await supabase
        .from('pedidos')
        .update({ avaliado: true })
        .eq('id', pedidoId);

      if (pedidoError) {
        console.warn('Erro ao atualizar status de avaliado:', pedidoError);
      }

      // Atualizar no localStorage também
      pedidosService.marcarComoAvaliado(pedidoId);

      toast({
        title: 'Avaliação enviada!',
        description: 'Obrigado pelo seu feedback. Sua avaliação foi registrada.',
      });

      resetForm();
      onClose();
      onAvaliacaoEnviada?.();

    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast({
        title: 'Erro ao enviar avaliação',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (
    nota: number,
    setNota: (nota: number) => void,
    hoverNota: number,
    setHoverNota: (nota: number) => void
  ) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((estrela) => (
        <button
          key={estrela}
          type="button"
          onClick={() => setNota(estrela)}
          onMouseEnter={() => setHoverNota(estrela)}
          onMouseLeave={() => setHoverNota(0)}
          className="p-1 rounded focus:outline-none"
        >
          <Star
            className={`w-8 h-8 ${
              estrela <= (hoverNota || nota)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  const getNotaTexto = (nota: number) => {
    switch (nota) {
      case 1: return 'Muito ruim';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Avaliar Pedido</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Pedido: {pedidoId}</h4>
            <p className="text-sm text-gray-600">Restaurante: {restaurante}</p>
            {entregador && (
              <p className="text-sm text-gray-600">Entregador: {entregador}</p>
            )}
          </div>

          {/* Avaliação do Restaurante */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium">Avalie o Restaurante</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Como foi a qualidade da comida?
              </label>
              {renderStars(
                notaRestaurante,
                setNotaRestaurante,
                hoverNotaRestaurante,
                setHoverNotaRestaurante
              )}
              {notaRestaurante > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {getNotaTexto(notaRestaurante)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Comentário sobre o restaurante (opcional)
              </label>
              <Textarea
                value={comentarioRestaurante}
                onChange={(e) => setComentarioRestaurante(e.target.value)}
                placeholder="Como foi a comida, atendimento, etc..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comentarioRestaurante.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Avaliação do Entregador (se houver) */}
          {entregador && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium">Avalie o Entregador</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Como foi o atendimento e pontualidade?
                  </label>
                  {renderStars(
                    notaEntregador,
                    setNotaEntregador,
                    hoverNotaEntregador,
                    setHoverNotaEntregador
                  )}
                  {notaEntregador > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {getNotaTexto(notaEntregador)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comentário sobre o entregador (opcional)
                  </label>
                  <Textarea
                    value={comentarioEntregador}
                    onChange={(e) => setComentarioEntregador(e.target.value)}
                    placeholder="Como foi a entrega, atendimento, etc..."
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comentarioEntregador.length}/500 caracteres
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Botões */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAvaliacao;
