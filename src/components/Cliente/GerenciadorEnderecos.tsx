
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
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
  onEnderecoSelecionado: (endereco: Endereco) => void;
  enderecoAtual?: string;
}

const GerenciadorEnderecos: React.FC<GerenciadorEnderecosProps> = ({
  isOpen,
  onClose,
  onEnderecoSelecionado,
  enderecoAtual
}) => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoEndereco, setEditandoEndereco] = useState<Endereco | null>(null);
  
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
    carregarEnderecos();
  }, []);

  const carregarEnderecos = () => {
    const endercosSalvos = localStorage.getItem('zdelivery_enderecos');
    if (endercosSalvos) {
      const enderecos = JSON.parse(endercosSalvos);
      setEnderecos(enderecos);
      
      // Selecionar o principal por padrão
      const principal = enderecos.find((e: Endereco) => e.principal);
      if (principal) {
        setEnderecoSelecionado(principal.id);
      }
    }
  };

  const salvarEndereco = () => {
    if (!novoEndereco.nome || !novoEndereco.endereco || !novoEndereco.numero || !novoEndereco.bairro || !novoEndereco.cidade || !novoEndereco.cep) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    let enderecosAtualizados = [...enderecos];
    
    if (editandoEndereco) {
      // Editando endereço existente
      enderecosAtualizados = enderecos.map(e => 
        e.id === editandoEndereco.id 
          ? { ...novoEndereco, id: editandoEndereco.id }
          : e
      );
    } else {
      // Novo endereço
      const endereco: Endereco = {
        ...novoEndereco,
        id: Date.now().toString()
      };
      enderecosAtualizados.push(endereco);
    }

    // Se é o primeiro endereço ou foi marcado como principal
    if (enderecosAtualizados.length === 1 || novoEndereco.principal) {
      enderecosAtualizados = enderecosAtualizados.map(e => ({
        ...e,
        principal: e.id === (editandoEndereco?.id || enderecosAtualizados[enderecosAtualizados.length - 1].id)
      }));
    }

    setEnderecos(enderecosAtualizados);
    localStorage.setItem('zdelivery_enderecos', JSON.stringify(enderecosAtualizados));
    
    toast({
      title: editandoEndereco ? 'Endereço atualizado!' : 'Endereço salvo!',
      description: 'Endereço foi salvo com sucesso.',
    });

    limparFormulario();
  };

  const limparFormulario = () => {
    setNovoEndereco({
      nome: '', endereco: '', numero: '', complemento: '', 
      bairro: '', cidade: '', cep: '', referencia: '', principal: false
    });
    setMostrarFormulario(false);
    setEditandoEndereco(null);
  };

  const editarEndereco = (endereco: Endereco) => {
    setEditandoEndereco(endereco);
    setNovoEndereco(endereco);
    setMostrarFormulario(true);
  };

  const removerEndereco = (id: string) => {
    const enderecosAtualizados = enderecos.filter(e => e.id !== id);
    setEnderecos(enderecosAtualizados);
    localStorage.setItem('zdelivery_enderecos', JSON.stringify(enderecosAtualizados));
    
    toast({
      title: 'Endereço removido!',
      description: 'Endereço foi removido com sucesso.',
    });
  };

  const confirmarSelecao = () => {
    const endereco = enderecos.find(e => e.id === enderecoSelecionado);
    if (endereco) {
      onEnderecoSelecionado(endereco);
      onClose();
    }
  };

  const formatarEnderecoCompleto = (endereco: Endereco) => {
    return `${endereco.endereco}, ${endereco.numero}${endereco.complemento ? `, ${endereco.complemento}` : ''} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.cep}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Endereços</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!mostrarFormulario ? (
            <>
              {/* Lista de Endereços */}
              {enderecos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Seus Endereços:</h3>
                  <RadioGroup value={enderecoSelecionado} onValueChange={setEnderecoSelecionado}>
                    {enderecos.map(endereco => (
                      <Card key={endereco.id} className={endereco.principal ? 'border-red-200 bg-red-50' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value={endereco.id} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {endereco.nome}
                                    {endereco.principal && (
                                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded ml-2">
                                        Principal
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {formatarEnderecoCompleto(endereco)}
                                  </p>
                                  {endereco.referencia && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Referência: {endereco.referencia}
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editarEndereco(endereco)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removerEndereco(endereco.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setMostrarFormulario(true)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Endereço
                </Button>
                {enderecos.length > 0 && (
                  <Button
                    onClick={confirmarSelecao}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={!enderecoSelecionado}
                  >
                    Usar Este Endereço
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Formulário de Novo/Editar Endereço */}
              <div className="space-y-4">
                <h3 className="font-medium">
                  {editandoEndereco ? 'Editar Endereço' : 'Novo Endereço'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome do Endereço *</Label>
                    <Input
                      placeholder="Ex: Casa, Trabalho, Faculdade"
                      value={novoEndereco.nome}
                      onChange={(e) => setNovoEndereco({...novoEndereco, nome: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Rua/Avenida *</Label>
                    <Input
                      placeholder="Nome da rua"
                      value={novoEndereco.endereco}
                      onChange={(e) => setNovoEndereco({...novoEndereco, endereco: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Número *</Label>
                    <Input
                      placeholder="123"
                      value={novoEndereco.numero}
                      onChange={(e) => setNovoEndereco({...novoEndereco, numero: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Complemento</Label>
                    <Input
                      placeholder="Apto, Casa, Bloco"
                      value={novoEndereco.complemento}
                      onChange={(e) => setNovoEndereco({...novoEndereco, complemento: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Bairro *</Label>
                    <Input
                      placeholder="Nome do bairro"
                      value={novoEndereco.bairro}
                      onChange={(e) => setNovoEndereco({...novoEndereco, bairro: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Cidade *</Label>
                    <Input
                      placeholder="Nome da cidade"
                      value={novoEndereco.cidade}
                      onChange={(e) => setNovoEndereco({...novoEndereco, cidade: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>CEP *</Label>
                    <Input
                      placeholder="00000-000"
                      value={novoEndereco.cep}
                      onChange={(e) => setNovoEndereco({...novoEndereco, cep: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Ponto de Referência</Label>
                    <Textarea
                      placeholder="Ex: Próximo ao mercado, em frente à farmácia"
                      value={novoEndereco.referencia}
                      onChange={(e) => setNovoEndereco({...novoEndereco, referencia: e.target.value})}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={limparFormulario}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={salvarEndereco}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {editandoEndereco ? 'Atualizar' : 'Salvar'} Endereço
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GerenciadorEnderecos;
