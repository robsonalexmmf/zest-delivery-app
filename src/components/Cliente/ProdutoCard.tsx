
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModalAdicionais from './ModalAdicionais';

interface ProdutoCardProps {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  disponivel: boolean;
  adicionais?: any[];
  onAddToCart: (produto: any, adicionais?: any[], quantidade?: number) => void;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({
  id,
  nome,
  descricao,
  preco,
  imagem,
  categoria,
  disponivel,
  adicionais = [],
  onAddToCart
}) => {
  const [showAdicionais, setShowAdicionais] = useState(false);

  const handleAddToCart = (produto: any, adicionaisSelecionados: any[] = [], quantidade: number = 1) => {
    onAddToCart(produto, adicionaisSelecionados, quantidade);
  };

  const handleButtonClick = () => {
    const produto = { id, nome, descricao, preco, imagem, categoria, adicionais };
    
    if (adicionais && adicionais.length > 0) {
      setShowAdicionais(true);
    } else {
      handleAddToCart(produto);
    }
  };

  return (
    <>
      <Card className={`${!disponivel ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <img 
              src={imagem} 
              alt={nome}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 truncate">{nome}</h3>
                <Badge variant="outline" className="ml-2 text-xs">
                  {categoria}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{descricao}</p>
              
              {adicionais && adicionais.length > 0 && (
                <p className="text-xs text-blue-600 mb-2">
                  ✨ Personalize seu produto
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-red-600">
                  R$ {preco.toFixed(2)}
                </span>
                
                <Button 
                  size="sm" 
                  onClick={handleButtonClick}
                  disabled={!disponivel}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {!disponivel && (
                <p className="text-xs text-gray-500 mt-1">Produto indisponível</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ModalAdicionais
        isOpen={showAdicionais}
        onClose={() => setShowAdicionais(false)}
        produto={{ id, nome, preco, imagem, adicionais }}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProdutoCard;
