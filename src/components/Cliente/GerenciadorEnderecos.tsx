
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Endereco {
  id: string;
  nome: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep: string;
  referencia?: string;
  principal: boolean;
}

interface GerenciadorEnderecosProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEndereco: (endereco: Endereco) => void;
}

const GerenciadorEnderecos: React.FC<GerenciadorEnderecosProps> = ({
  isOpen,
  onClose,
  onSelectEndereco
}) => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [novoEndereco, setNovoEndereco] = useState({
    nome: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    referencia: '',
    principal: false
  });

  useEffect(() => {
    // Carregar endereços salvos
    const enderecosSalvos = localStorage.getItem('zdelivery_enderecos');
    if (enderecosSalvos) {
      setEnderecos(JSON.parse(enderecosSalvos));
    }
  }, []);

  const salvarEnderecos = (novosEnderecos: Endereco[]) => {
    setEnderecos(novosEnderecos);
    localStorage.setItem('zdelivery_enderecos', JSON.stringify(novosEnderecos));
  };

  const handleSalvarEndereco = () => {
    if (!novoEndereco.nome || !novoEndereco.endereco || !novoEndereco.numero) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome, endereço e número são obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    const endereco: Endereco = {
      id: editando || Date.now().toString(),
      ...novoEndereco,
      complemento: novoEndereco.complemento || undefined,
      referencia: novoEndereco.referencia || undefined
    };

    let novosEnderecos: Endereco[];
    
    if (editando) {
      novosEnderecos = enderecos.map(e => e.id === editando ? endereco : e);
    } else {
      novosEnderecos = [...enderecos, endereco];
    }

    // Se for principal, remover principal dos outros
    if (endereco.principal) {
      novosEnderecos = novosEnderecos.map(e => 
        e.id === endereco.id ? e : { ...e, principal: false }
      );
    }

    salvarEnderecos(novosEnderecos);
    
    toast({
      title: 'Endereço salvo!',
      description: editando ? 'Endereço atualizado com sucesso.' : 'Novo endereço adicionado.',
    });

    setNovoEndereco({
      nome: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      referencia: '',
      principal: false
    });
    setEditando(null);
  };

  const handleEditarEndereco = (endereco: Endereco) => {
    setNovoEndereco({
      nome: endereco.nome,
      endereco: endereco.endereco,
      numero: endereco.numero,
      complemento: endereco.complemento || '',
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      cep: endereco.cep,
      referencia: endereco.referencia || '',
      principal: endereco.principal
    });
    setEditando(endereco.id);
  };

  const handleExcluirEndereco = (id: string) => {
    const novosEnderecos = enderecos.filter(e => e.id !== id);
    salvarEnderecos(novosEnderecos);
    
    toast({
      title: 'Endereço excluído',
      description: 'O endereço foi removido com sucesso.',
    });
  };

  const handleSelecionarEndereco = (endereco: Endereco) => {
    onSelectEndereco(endereco);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Endereços</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Lista de endereços */}
          <div>
            <h4 className="font-medium mb-4">Seus Endereços</h4>
            <div className="space-y-3">
              {enderecos.map(endereco => (
                <Card key={endereco.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex-1"
                        onClick={() => handleSelecionarEndereco(endereco)}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{endereco.nome}</span>
                          {endereco.principal && (
                            <Badge variant="outline">Principal</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {endereco.endereco}, {endereco.numero}
                          {endereco.complemento && `, ${endereco.complemento}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {endereco.bairro}, {endereco.cidade} - {endereco.cep}
                        </p>
                        {endereco.referencia && (
                          <p className="text-xs text-gray-500 mt-1">
                            Referência: {endereco.referencia}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditarEndereco(endereco)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExcluirEndereco(endereco.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulário de novo endereço */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">
              {editando ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Endereço *</Label>
                <Input
                  id="nome"
                  value={novoEndereco.nome}
                  onChange={(e) => setNovoEndereco({...novoEndereco, nome: e.target.value})}
                  placeholder="Casa, Trabalho, etc."
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={novoEndereco.cep}
                  onChange={(e) => setNovoEndereco({...novoEndereco, cep: e.target.value})}
                  placeholder="00000-000"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={novoEndereco.endereco}
                  onChange={(e) => setNovoEndereco({...novoEndereco, endereco: e.target.value})}
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={novoEndereco.numero}
                  onChange={(e) => setNovoEndereco({...novoEndereco, numero: e.target.value})}
                  placeholder="123"
                />
              </div>
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={novoEndereco.complemento}
                  onChange={(e) => setNovoEndereco({...novoEndereco, complemento: e.target.value})}
                  placeholder="Apto 101, Bloco A, etc."
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={novoEndereco.bairro}
                  onChange={(e) => setNovoEndereco({...novoEndereco, bairro: e.target.value})}
                  placeholder="Centro"
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={novoEndereco.cidade}
                  onChange={(e) => setNovoEndereco({...novoEndereco, cidade: e.target.value})}
                  placeholder="São Paulo"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="referencia">Ponto de Referência</Label>
                <Input
                  id="referencia"
                  value={novoEndereco.referencia}
                  onChange={(e) => setNovoEndereco({...novoEndereco, referencia: e.target.value})}
                  placeholder="Próximo ao shopping, em frente à padaria, etc."
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="principal"
                checked={novoEndereco.principal}
                onChange={(e) => setNovoEndereco({...novoEndereco, principal: e.target.checked})}
              />
              <Label htmlFor="principal">Definir como endereço principal</Label>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleSalvarEndereco} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                {editando ? 'Atualizar' : 'Adicionar'} Endereço
              </Button>
              {editando && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditando(null);
                    setNovoEndereco({
                      nome: '',
                      endereco: '',
                      numero: '',
                      complemento: '',
                      bairro: '',
                      cidade: '',
                      cep: '',
                      referencia: '',
                      principal: false
                    });
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GerenciadorEnderecos;
