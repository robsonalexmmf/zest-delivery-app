
import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RestauranteCardProps {
  id: string;
  nome: string;
  categoria: string;
  avaliacao: number;
  tempoEntrega: string;
  taxaEntrega: number;
  imagem: string;
  descricao: string;
  onClick: () => void;
}

const RestauranteCard: React.FC<RestauranteCardProps> = ({
  nome,
  categoria,
  avaliacao,
  tempoEntrega,
  taxaEntrega,
  imagem,
  descricao,
  onClick
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" onClick={onClick}>
      <div className="relative">
        <img 
          src={imagem} 
          alt={nome}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {taxaEntrega === 0 && (
          <Badge className="absolute top-2 left-2 bg-green-500">
            Frete Grátis
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{nome}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{avaliacao}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{descricao}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{tempoEntrega}</span>
          </div>
          
          <Badge variant="secondary">{categoria}</Badge>
          
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>R$ {taxaEntrega.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestauranteCard;
