
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  className = '',
  accept = 'image/*',
  maxSizeMB = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tamanho do arquivo
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: `O arquivo deve ter no máximo ${maxSizeMB}MB.`,
        variant: 'destructive'
      });
      return;
    }

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Por favor, selecione uma imagem válida.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPreview(imageUrl);
      onChange(imageUrl);
      
      toast({
        title: 'Imagem carregada!',
        description: 'A imagem foi carregada com sucesso.',
      });
      
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: 'Erro ao carregar imagem',
        description: 'Ocorreu um erro ao processar a imagem.',
        variant: 'destructive'
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    
    toast({
      title: 'Imagem removida',
      description: 'A imagem foi removida com sucesso.',
    });
  };

  const inputId = `image-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={inputId}>{label}</Label>
      
      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(inputId)?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              {preview ? 'Alterar Imagem' : 'Carregar Imagem'}
            </>
          )}
        </Button>
        
        {preview && (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt={label}
              className="max-w-32 max-h-32 object-cover rounded-lg border shadow-sm"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
