
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Clock, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PagamentoPixProps {
  isOpen: boolean;
  onClose: () => void;
  valor: number;
  pedidoId: string;
  onPagamentoConfirmado: () => void;
}

const PagamentoPix: React.FC<PagamentoPixProps> = ({
  isOpen,
  onClose,
  valor,
  pedidoId,
  onPagamentoConfirmado
}) => {
  const [pixCopiado, setPixCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600); // 10 minutos
  const [pagamentoProcessando, setPagamentoProcessando] = useState(false);

  // Simular código PIX (normalmente viria da API de pagamento)
  const codigoPix = `00020126580014br.gov.bcb.pix013636b5b6c4-e5d2-4c9a-9c7a-8f1234567890520400005303986540${valor.toFixed(2).replace('.', '')}5802BR5925ZDELIVERY LTDA6009SAO PAULO62070503***630445A2`;
  
  const qrCodeData = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`; // Placeholder QR Code

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          toast({
            title: 'Tempo esgotado',
            description: 'O tempo para pagamento expirou. Tente novamente.',
            variant: 'destructive'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopiarPix = async () => {
    try {
      await navigator.clipboard.writeText(codigoPix);
      setPixCopiado(true);
      toast({
        title: 'Código PIX copiado!',
        description: 'Cole no seu app de pagamentos para finalizar.',
      });

      setTimeout(() => setPixCopiado(false), 3000);
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o código PIX.',
        variant: 'destructive'
      });
    }
  };

  const handleSimularPagamento = () => {
    setPagamentoProcessando(true);
    
    toast({
      title: 'Processando pagamento...',
      description: 'Aguarde enquanto confirmamos o pagamento.',
    });

    // Simular tempo de processamento
    setTimeout(() => {
      setPagamentoProcessando(false);
      onPagamentoConfirmado();
      onClose();
      
      toast({
        title: 'Pagamento confirmado!',
        description: 'Seu pedido foi recebido pelo restaurante.',
      });
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span>Pagamento PIX</span>
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
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600">
                Tempo restante: {formatarTempo(tempoRestante)}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">QR Code PIX</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Escaneie com seu app de pagamentos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Código PIX para Copiar */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              Ou copie o código PIX:
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="font-mono text-xs text-gray-700 break-all mb-3">
                {codigoPix.substring(0, 50)}...
              </div>
              
              <Button
                onClick={handleCopiarPix}
                variant="outline"
                className="w-full"
                disabled={pixCopiado}
              >
                {pixCopiado ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar código PIX
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Como pagar:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Abra seu app de pagamentos</li>
              <li>2. Escaneie o QR Code ou cole o código PIX</li>
              <li>3. Confirme o pagamento</li>
              <li>4. Aguarde a confirmação automática</li>
            </ol>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            {/* Botão para simular pagamento (apenas para demo) */}
            <Button
              onClick={handleSimularPagamento}
              disabled={pagamentoProcessando}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {pagamentoProcessando ? 'Processando...' : 'Simular Pagamento (Demo)'}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={pagamentoProcessando}
            >
              Cancelar
            </Button>
          </div>

          {/* Status de Segurança */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Badge variant="outline" className="text-green-600 border-green-600">
              🔒 Pagamento Seguro
            </Badge>
            <span>Powered by PIX</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PagamentoPix;
