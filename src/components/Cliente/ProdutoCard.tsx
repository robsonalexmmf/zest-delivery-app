
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProdutoCardProps {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  disponivel: boolean;
  onAddToCart: (produto: any) => void;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({
  id,
  nome,
  descricao,
  preco,
  imagem,
  categoria,
  disponivel,
  onAddToCart
}) => {
  const handleAddToCart = () => {
    onAddToCart({
      id,
      nome,
      descricao,
      preco,
      imagem,
      categoria,
      quantidade: 1
    });
  };

  return (
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
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-red-600">
                R$ {preco.toFixed(2)}
              </span>
              
              <Button 
                size="sm" 
                onClick={handleAddToCart}
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
  );
};

export default ProdutoCard;
