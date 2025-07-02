
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

interface Adicional {
  id: string;
  nome: string;
  preco: number;
  tipo: 'unico' | 'multiplo';
  obrigatorio: boolean;
  opcoes?: { id: string; nome: string; preco: number }[];
}

interface ModalAdicionaisProps {
  isOpen: boolean;
  onClose: () => void;
  produto: {
    id: string;
    nome: string;
    preco: number;
    imagem: string;
    adicionais?: Adicional[];
  };
  onAddToCart: (produto: any, adicionais: any[], quantidade: number) => void;
}

const ModalAdicionais: React.FC<ModalAdicionaisProps> = ({
  isOpen,
  onClose,
  produto,
  onAddToCart
}) => {
  const [quantidade, setQuantidade] = useState(1);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<{[key: string]: any}>({});

  const handleAdicionalChange = (adicionalId: string, opcaoId: string, preco: number, tipo: string) => {
    setAdicionaisSelecionados(prev => {
      const newState = { ...prev };
      
      if (tipo === 'unico') {
        newState[adicionalId] = { opcaoId, preco };
      } else {
        if (!newState[adicionalId]) newState[adicionalId] = {};
        if (newState[adicionalId][opcaoId]) {
          delete newState[adicionalId][opcaoId];
        } else {
          newState[adicionalId][opcaoId] = preco;
        }
      }
      
      return newState;
    });
  };

  const calcularPrecoTotal = () => {
    let total = produto.preco * quantidade;
    
    Object.values(adicionaisSelecionados).forEach((adicional: any) => {
      if (typeof adicional === 'object') {
        if (adicional.preco) {
          total += adicional.preco * quantidade;
        } else {
          Object.values(adicional).forEach((preco: any) => {
            total += preco * quantidade;
          });
        }
      }
    });
    
    return total;
  };

  const handleAddToCart = () => {
    const adicionaisFormatados = Object.entries(adicionaisSelecionados).map(([adicionalId, dados]) => ({
      adicionalId,
      dados
    }));
    
    onAddToCart(produto, adicionaisFormatados, quantidade);
    onClose();
    setQuantidade(1);
    setAdicionaisSelecionados({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalizar Produto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Produto */}
          <div className="flex items-center space-x-4">
            <img src={produto.imagem} alt={produto.nome} className="w-16 h-16 object-cover rounded" />
            <div>
              <h3 className="font-semibold">{produto.nome}</h3>
              <p className="text-red-600 font-bold">R$ {produto.preco.toFixed(2)}</p>
            </div>
          </div>

          {/* Adicionais */}
          {produto.adicionais?.map(adicional => (
            <div key={adicional.id} className="space-y-3">
              <div>
                <h4 className="font-medium">
                  {adicional.nome}
                  {adicional.obrigatorio && <span className="text-red-500 ml-1">*</span>}
                </h4>
                <p className="text-sm text-gray-500">
                  {adicional.tipo === 'unico' ? 'Escolha 1 opção' : 'Escolha quantas quiser'}
                </p>
              </div>

              {adicional.tipo === 'unico' ? (
                <RadioGroup
                  value={adicionaisSelecionados[adicional.id]?.opcaoId || ''}
                  onValueChange={(value) => {
                    const opcao = adicional.opcoes?.find(o => o.id === value);
                    if (opcao) {
                      handleAdicionalChange(adicional.id, value, opcao.preco, 'unico');
                    }
                  }}
                >
                  {adicional.opcoes?.map(opcao => (
                    <div key={opcao.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={opcao.id} id={opcao.id} />
                      <Label htmlFor={opcao.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>{opcao.nome}</span>
                          <span>+R$ {opcao.preco.toFixed(2)}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {adicional.opcoes?.map(opcao => (
                    <div key={opcao.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={opcao.id}
                        checked={!!adicionaisSelecionados[adicional.id]?.[opcao.id]}
                        onCheckedChange={() => handleAdicionalChange(adicional.id, opcao.id, opcao.preco, 'multiplo')}
                      />
                      <Label htmlFor={opcao.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>{opcao.nome}</span>
                          <span>+R$ {opcao.preco.toFixed(2)}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quantidade */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantidade:</span>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold">{quantidade}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantidade(quantidade + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total e Adicionar */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-lg text-red-600">
                R$ {calcularPrecoTotal().toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAdicionais;
