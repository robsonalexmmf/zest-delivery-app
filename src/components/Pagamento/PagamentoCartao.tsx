import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PagamentoCartaoProps {
  isOpen: boolean;
  onClose: () => void;
  valor: number;
  pedidoId: string;
  onPagamentoConfirmado: () => void;
}

const PagamentoCartao: React.FC<PagamentoCartaoProps> = ({
  isOpen,
  onClose,
  valor,
  pedidoId,
  onPagamentoConfirmado
}) => {
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomePortador, setNomePortador] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [processando, setProcessando] = useState(false);

  const formatarNumeroCartao = (valor: string) => {
    const numeroLimpo = valor.replace(/\D/g, '');
    const formatado = numeroLimpo.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatado.slice(0, 19);
  };

  const formatarValidade = (valor: string) => {
    const numeroLimpo = valor.replace(/\D/g, '');
    if (numeroLimpo.length >= 2) {
      return numeroLimpo.slice(0, 2) + '/' + numeroLimpo.slice(2, 4);
    }
    return numeroLimpo;
  };

  const handleProcessarPagamento = () => {
    if (!numeroCartao || !nomePortador || !validade || !cvv) {
      toast({
        title: 'Dados incompletos',
        description: 'Por favor, preencha todos os campos do cartão.',
        variant: 'destructive'
      });
      return;
    }

    setProcessando(true);

    toast({
      title: 'Processando pagamento...',
      description: 'Aguarde enquanto processamos seu cartão.',
    });

    // Simular processamento do cartão
    setTimeout(() => {
      setProcessando(false);
      onPagamentoConfirmado();
      onClose();
      
      toast({
        title: 'Pagamento aprovado!',
        description: 'Seu pedido foi confirmado e enviado para o restaurante.',
      });
    }, 3000);
  };

  const handleReset = () => {
    setNumeroCartao('');
    setNomePortador('');
    setValidade('');
    setCvv('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Pagamento com Cartão</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Pedido */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-blue-600">
              R$ {valor.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              Pedido {pedidoId}
            </div>
          </div>

          {/* Formulário do Cartão */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="numero">Número do Cartão</Label>
                <Input
                  id="numero"
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(formatarNumeroCartao(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  disabled={processando}
                />
              </div>

              <div>
                <Label htmlFor="nome">Nome do Portador</Label>
                <Input
                  id="nome"
                  value={nomePortador}
                  onChange={(e) => setNomePortador(e.target.value.toUpperCase())}
                  placeholder="NOME COMO NO CARTÃO"
                  disabled={processando}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validade">Validade</Label>
                  <Input
                    id="validade"
                    value={validade}
                    onChange={(e) => setValidade(formatarValidade(e.target.value))}
                    placeholder="MM/AA"
                    maxLength={5}
                    disabled={processando}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="000"
                    maxLength={4}
                    disabled={processando}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Segurança */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Lock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">Pagamento Seguro</span>
            </div>
            <p className="text-xs text-blue-800">
              Seus dados são protegidos por criptografia SSL e não são armazenados em nossos servidores.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button
              onClick={handleProcessarPagamento}
              disabled={processando}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {processando ? 'Processando...' : `Pagar R$ ${valor.toFixed(2)}`}
            </Button>
            
            <Button
              onClick={() => {
                handleReset();
                onClose();
              }}
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

export default PagamentoCartao;