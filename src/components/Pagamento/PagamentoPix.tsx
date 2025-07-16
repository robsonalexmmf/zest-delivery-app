
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mercadoPagoService } from '@/services/mercadoPagoService';
import type { PixPaymentResponse } from '@/services/mercadoPagoService';

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
  const [pixData, setPixData] = useState<PixPaymentResponse | null>(null);
  const [carregandoPix, setCarregandoPix] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !pixData) {
      criarPagamentoPix();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !pixData) return;

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

    // Verificar status do pagamento periodicamente
    const statusChecker = setInterval(async () => {
      if (pixData?.id) {
        try {
          const status = await mercadoPagoService.checkPaymentStatus(pixData.id);
          if (status === 'approved') {
            clearInterval(statusChecker);
            clearInterval(timer);
            onPagamentoConfirmado();
            onClose();
            toast({
              title: 'Pagamento confirmado!',
              description: 'Seu pedido foi recebido pelo restaurante.',
            });
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(statusChecker);
    };
  }, [isOpen, pixData, onClose, onPagamentoConfirmado]);

  const criarPagamentoPix = async () => {
    setCarregandoPix(true);
    setErro(null);

    try {
      if (!mercadoPagoService.isConfigured()) {
        throw new Error('Sistema de pagamento não configurado. Configure as credenciais do Mercado Pago.');
      }

      const pixResponse = await mercadoPagoService.createPixPayment({
        amount: valor,
        description: `Pedido ${pedidoId} - ZDelivery`,
        orderId: pedidoId
      });

      setPixData(pixResponse);
    } catch (error) {
      console.error('Erro ao criar PIX:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao gerar código PIX');
      toast({
        title: 'Erro ao criar PIX',
        description: 'Não foi possível gerar o código PIX. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setCarregandoPix(false);
    }
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopiarPix = async () => {
    if (!pixData?.pixCopyPaste) return;

    try {
      await navigator.clipboard.writeText(pixData.pixCopyPaste);
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
            {pixData && (
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">
                  Tempo restante: {formatarTempo(tempoRestante)}
                </span>
              </div>
            )}
          </div>

          {/* Estado de Carregamento ou Erro */}
          {carregandoPix && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Gerando código PIX...</p>
            </div>
          )}

          {erro && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-800">{erro}</span>
              </div>
              <Button
                onClick={criarPagamentoPix}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* QR Code e Código PIX */}
          {pixData && (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-4">
                    {pixData.qrCodeBase64 ? (
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <img
                          src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                          alt="QR Code PIX"
                          className="w-32 h-32 mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">QR Code PIX</span>
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      Escaneie com seu app de pagamentos
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  Ou copie o código PIX:
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="font-mono text-xs text-gray-700 break-all mb-3">
                    {pixData.pixCopyPaste.substring(0, 50)}...
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
            </>
          )}

          {/* Instruções */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Como pagar:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Abra seu app de pagamentos</li>
              <li>2. Escaneie o QR Code ou cole o código PIX</li>
              <li>3. Confirme o pagamento</li>
              <li>4. O pagamento será confirmado automaticamente</li>
            </ol>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
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
            <span>Powered by Mercado Pago</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PagamentoPix;
