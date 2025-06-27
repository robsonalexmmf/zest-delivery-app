
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Tag, X } from 'lucide-react';

interface CupomAplicado {
  codigo: string;
  descricao: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
}

interface AplicadorCupomProps {
  onCupomAplicado: (cupom: CupomAplicado | null) => void;
  cupomAtual?: CupomAplicado | null;
  subtotal: number;
}

const AplicadorCupom: React.FC<AplicadorCupomProps> = ({
  onCupomAplicado,
  cupomAtual,
  subtotal
}) => {
  const [inputCupom, setInputCupom] = useState('');

  // Simulação de cupons válidos
  const cuponsValidos: Record<string, CupomAplicado> = {
    'DESCONTO10': {
      codigo: 'DESCONTO10',
      descricao: 'Desconto de 10%',
      tipo: 'percentual',
      valor: 10
    },
    'PRIMEIRACOMPRA': {
      codigo: 'PRIMEIRACOMPRA',
      descricao: 'Primeira compra',
      tipo: 'percentual',
      valor: 15
    },
    'FRETEGRATIS': {
      codigo: 'FRETEGRATIS',
      descricao: 'Desconto no frete',
      tipo: 'fixo',
      valor: 5
    },
    'WELCOME20': {
      codigo: 'WELCOME20',
      descricao: 'Bem-vindo!',
      tipo: 'percentual',
      valor: 20
    },
    'SAVE5': {
      codigo: 'SAVE5',
      descricao: 'Economize R$ 5',
      tipo: 'fixo',
      valor: 5
    }
  };

  const handleAplicarCupom = () => {
    const codigoLimpo = inputCupom.trim().toUpperCase();
    
    if (!codigoLimpo) {
      toast({
        title: 'Código inválido',
        description: 'Digite um código de cupom válido.',
        variant: 'destructive'
      });
      return;
    }

    if (cupomAtual?.codigo === codigoLimpo) {
      toast({
        title: 'Cupom já aplicado',
        description: 'Este cupom já está sendo usado.',
        variant: 'destructive'
      });
      return;
    }

    const cupomValido = cuponsValidos[codigoLimpo];
    
    if (cupomValido) {
      onCupomAplicado(cupomValido);
      setInputCupom('');
      
      const valorDesconto = cupomValido.tipo === 'percentual' 
        ? (subtotal * cupomValido.valor) / 100
        : cupomValido.valor;

      toast({
        title: 'Cupom aplicado!',
        description: `${cupomValido.descricao} - Economia de R$ ${valorDesconto.toFixed(2)}`,
      });
    } else {
      toast({
        title: 'Cupom inválido',
        description: 'O código informado não é válido ou expirou.',
        variant: 'destructive'
      });
    }
  };

  const handleRemoverCupom = () => {
    onCupomAplicado(null);
    toast({
      title: 'Cupom removido',
      description: 'O cupom foi removido do pedido.',
    });
  };

  const calcularDesconto = () => {
    if (!cupomAtual) return 0;
    
    return cupomAtual.tipo === 'percentual' 
      ? (subtotal * cupomAtual.valor) / 100
      : cupomAtual.valor;
  };

  return (
    <div className="space-y-4">
      {/* Cupom atual aplicado */}
      {cupomAtual && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-green-600" />
              <div>
                <Badge className="bg-green-100 text-green-800 font-mono">
                  {cupomAtual.codigo}
                </Badge>
                <p className="text-sm text-green-700 mt-1">{cupomAtual.descricao}</p>
                <p className="text-xs text-green-600">
                  Economia: R$ {calcularDesconto().toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemoverCupom}
              className="text-green-600 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Aplicar novo cupom */}
      {!cupomAtual && (
        <div>
          <Label htmlFor="cupom">Cupom de Desconto</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="cupom"
              value={inputCupom}
              onChange={(e) => setInputCupom(e.target.value.toUpperCase())}
              placeholder="Digite o código do cupom"
              onKeyPress={(e) => e.key === 'Enter' && handleAplicarCupom()}
            />
            <Button variant="outline" onClick={handleAplicarCupom}>
              Aplicar
            </Button>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Cupons disponíveis: DESCONTO10, PRIMEIRACOMPRA, FRETEGRATIS, WELCOME20, SAVE5
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AplicadorCupom;
