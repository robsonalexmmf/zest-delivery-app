import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Banknote, Calculator } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PagamentoDinheiroProps {
  isOpen: boolean;
  onClose: () => void;
  valor: number;
  pedidoId: string;
  onPagamentoConfirmado: (dadosTroco?: { precisaTroco: boolean; valorTroco?: number }) => void;
}

const PagamentoDinheiro: React.FC<PagamentoDinheiroProps> = ({
  isOpen,
  onClose,
  valor,
  pedidoId,
  onPagamentoConfirmado
}) => {
  const [precisaTroco, setPrecisaTroco] = useState(false);
  const [valorTroco, setValorTroco] = useState('');
  const [processando, setProcessando] = useState(false);

  const valorTrocoNumerico = parseFloat(valorTroco) || 0;
  const trocoDevolvido = valorTrocoNumerico > valor ? valorTrocoNumerico - valor : 0;

  const handleConfirmarPagamento = () => {
    if (precisaTroco && (!valorTroco || valorTrocoNumerico <= valor)) {
      toast({
        title: 'Valor inválido',
        description: 'O valor para troco deve ser maior que o total do pedido.',
        variant: 'destructive'
      });
      return;
    }

    setProcessando(true);

    toast({
      title: 'Pedido confirmado!',
      description: precisaTroco 
        ? `Entregador levará troco para R$ ${valorTrocoNumerico.toFixed(2)}`
        : 'Pagamento será feito na entrega com valor exato.',
    });

    setTimeout(() => {
      setProcessando(false);
      onPagamentoConfirmado({
        precisaTroco,
        valorTroco: precisaTroco ? valorTrocoNumerico : undefined
      });
      onClose();
    }, 1500);
  };

  const sugestoesTroco = [10, 20, 50, 100].map(sugestao => valor + sugestao);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Banknote className="w-5 h-5 text-green-600" />
            <span>Pagamento em Dinheiro</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Pedido */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-600">
              R$ {valor.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              Pedido {pedidoId}
            </div>
          </div>

          {/* Opções de Troco */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="troco"
                  checked={precisaTroco}
                  onCheckedChange={(checked) => {
                    setPrecisaTroco(checked as boolean);
                    if (!checked) setValorTroco('');
                  }}
                />
                <Label htmlFor="troco" className="cursor-pointer">
                  Preciso de troco
                </Label>
              </div>

              {precisaTroco && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="valorTroco">Vou pagar com quanto?</Label>
                    <Input
                      id="valorTroco"
                      type="number"
                      value={valorTroco}
                      onChange={(e) => setValorTroco(e.target.value)}
                      placeholder="Ex: 50.00"
                      min={valor}
                      step="0.01"
                    />
                  </div>

                  {/* Sugestões de Valores */}
                  <div>
                    <Label className="text-sm text-gray-600">Sugestões de valores:</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {sugestoesTroco.map((sugestao) => (
                        <Button
                          key={sugestao}
                          variant="outline"
                          size="sm"
                          onClick={() => setValorTroco(sugestao.toString())}
                          className="text-xs"
                        >
                          R$ {sugestao.toFixed(2)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Cálculo do Troco */}
                  {valorTroco && valorTrocoNumerico > valor && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calculator className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Cálculo do Troco</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Você pagará:</span>
                          <span>R$ {valorTrocoNumerico.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total do pedido:</span>
                          <span>R$ {valor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Troco:</span>
                          <span className="text-green-600">R$ {trocoDevolvido.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Importante:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• O pagamento será feito na entrega</li>
              <li>• Tenha o dinheiro separado para agilizar</li>
              {precisaTroco && <li>• O entregador levará troco conforme informado</li>}
              <li>• Em caso de dúvidas, entre em contato conosco</li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button
              onClick={handleConfirmarPagamento}
              disabled={processando}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {processando ? 'Confirmando...' : 'Confirmar Pedido'}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={processando}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PagamentoDinheiro;