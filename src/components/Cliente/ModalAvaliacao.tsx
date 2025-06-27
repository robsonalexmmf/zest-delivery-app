
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ModalAvaliacaoProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: string;
  restaurante: string;
}

const ModalAvaliacao: React.FC<ModalAvaliacaoProps> = ({
  isOpen,
  onClose,
  pedidoId,
  restaurante
}) => {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [hoverNota, setHoverNota] = useState(0);

  const handleSubmit = () => {
    if (nota === 0) {
      toast({
        title: 'Avaliação obrigatória',
        description: 'Por favor, selecione uma nota de 1 a 5 estrelas.',
        variant: 'destructive'
      });
      return;
    }

    // Simular envio da avaliação
    console.log('Avaliação enviada:', {
      pedidoId,
      nota,
      comentario,
      restaurante
    });

    toast({
      title: 'Avaliação enviada!',
      description: 'Obrigado pelo seu feedback. Sua avaliação foi registrada.',
    });

    // Reset e fechar
    setNota(0);
    setComentario('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar Pedido</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Restaurante: {restaurante}</h4>
            <p className="text-sm text-gray-600">Pedido: {pedidoId}</p>
          </div>

          {/* Avaliação por estrelas */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Como foi sua experiência?
            </label>
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
            {nota > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {nota === 1 && 'Muito ruim'}
                {nota === 2 && 'Ruim'}
                {nota === 3 && 'Regular'}
                {nota === 4 && 'Bom'}
                {nota === 5 && 'Excelente'}
              </p>
            )}
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Comentário (opcional)
            </label>
            <Textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte-nos sobre sua experiência..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comentario.length}/500 caracteres
            </p>
          </div>

          {/* Botões */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAvaliacao;
