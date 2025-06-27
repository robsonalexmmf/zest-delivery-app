
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, QrCode, CheckCircle, Clock } from 'lucide-react';
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
  const [pixGerado, setPixGerado] = useState(false);
  const [copiaCola, setCopiaCola] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [statusPagamento, setStatusPagamento] = useState<'pendente' | 'processando' | 'aprovado'>('pendente');
  const [tempoRestante, setTempoRestante] = useState(300); // 5 minutos

  useEffect(() => {
    if (isOpen && !pixGerado) {
      gerarPix();
    }
  }, [isOpen]);

  useEffect(() => {
    if (pixGerado && tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [pixGerado, tempoRestante]);

  // Simular verificação de pagamento a cada 3 segundos
  useEffect(() => {
    if (statusPagamento === 'processando') {
      const verificarPagamento = setInterval(() => {
        // Simular aprovação após 10 segundos (em produção seria via webhook)
        const randomAprovacao = Math.random() > 0.3; // 70% de chance de aprovar
        
        if (randomAprovacao) {
          setStatusPagamento('aprovado');
          clearInterval(verificarPagamento);
          
          toast({
            title: 'Pagamento aprovado!',
            description: 'Seu pedido foi confirmado e será preparado em breve.',
          });

          setTimeout(() => {
            onPagamentoConfirmado();
            onClose();
          }, 2000);
        }
      }, 3000);

      return () => clearInterval(verificarPagamento);
    }
  }, [statusPagamento]);

  const gerarPix = async () => {
    try {
      // Simular geração do PIX (em produção seria integração real com Mercado Pago)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pixCopiaCola = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2)}520400005303986540${valor.toFixed(2)}5802BR5925Z DELIVERY LTDA6009SAO PAULO62070503***6304${Math.random().toString(4)}`;
      
      setCopiaCola(pixCopiaCola);
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCopiaCola)}`);
      setPixGerado(true);

      toast({
        title: 'PIX gerado com sucesso!',
        description: 'Escaneie o QR Code ou copie o código para pagar.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar PIX',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    }
  };

  const copiarCodigoPixe = () => {
    navigator.clipboard.writeText(copiaCola);
    toast({
      title: 'Código copiado!',
      description: 'Cole no app do seu banco para efetuar o pagamento.',
    });
  };

  const simularPagamento = () => {
    setStatusPagamento('processando');
    toast({
      title: 'Verificando pagamento...',
      description: 'Aguarde enquanto confirmamos seu pagamento.',
    });
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            Pagamento PIX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Valor e informações */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Valor a pagar</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {valor.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Pedido: {pedidoId}</p>
          </div>

          {/* Status do pagamento */}
          {statusPagamento === 'aprovado' ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800">
                  Pagamento Aprovado!
                </h3>
                <p className="text-green-600 text-sm">
                  Seu pedido foi confirmado com sucesso.
                </p>
              </CardContent>
            </Card>
          ) : statusPagamento === 'processando' ? (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-2 animate-spin" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Verificando Pagamento...
                </h3>
                <p className="text-blue-600 text-sm">
                  Aguarde a confirmação do pagamento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* QR Code e instruções */}
              {pixGerado ? (
                <div className="space-y-4">
                  {/* Tempo restante */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Tempo para pagamento: 
                      <span className="font-mono text-red-600 ml-2">
                        {formatarTempo(tempoRestante)}
                      </span>
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code PIX" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Escaneie com a câmera do seu banco
                    </p>
                  </div>

                  {/* Código copia e cola */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ou copie o código PIX:
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                        {copiaCola.substring(0, 50)}...
                      </div>
                      <Button
                        onClick={copiarCodigoPixe}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Botão para simular pagamento (apenas para demo) */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-xs text-yellow-800 mb-2">
                      ⚠️ Demo: Clique para simular pagamento
                    </p>
                    <Button
                      onClick={simularPagamento}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Simular Pagamento Aprovado
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Gerando código PIX...</p>
                </div>
              )}
            </>
          )}

          {/* Botões */}
          {statusPagamento === 'pendente' && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              {pixGerado && (
                <Button
                  onClick={() => gerarPix()}
                  variant="outline"
                  className="flex-1"
                >
                  Gerar Novo PIX
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PagamentoPix;
