
import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarrinhoItemProps {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  onUpdateQuantity: (id: string, quantidade: number) => void;
  onRemove: (id: string) => void;
}

const CarrinhoItem: React.FC<CarrinhoItemProps> = ({
  id,
  nome,
  preco,
  quantidade,
  imagem,
  onUpdateQuantity,
  onRemove
}) => {
  const handleQuantityChange = (novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      onRemove(id);
    } else {
      onUpdateQuantity(id, novaQuantidade);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <img 
        src={imagem} 
        alt={nome}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{nome}</h3>
        <p className="text-red-600 font-semibold">R$ {preco.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleQuantityChange(quantidade - 1)}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <span className="w-8 text-center font-medium">{quantidade}</span>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleQuantityChange(quantidade + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <Button 
        size="sm" 
        variant="ghost"
        onClick={() => onRemove(id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CarrinhoItem;
