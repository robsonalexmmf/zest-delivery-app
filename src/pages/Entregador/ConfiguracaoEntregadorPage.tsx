
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, User, MapPin, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ConfiguracaoEntregadorPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const [configuracoes, setConfiguracoes] = useState({
    pix: {
      ativo: true,
      chave: '',
      tipo: 'cpf' as 'cpf' | 'email' | 'telefone' | 'aleatorio'
    },
    dadosPessoais: {
      nome: '',
      cpf: '',
      telefone: '',
      veiculo: 'moto' as 'moto' | 'bicicleta' | 'carro' | 'pe'
    },
    disponibilidade: {
      ativo: true,
      raioEntrega: 5, // km
      valorMinimo: 15.00 // valor mínimo por entrega
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'entregador') {
        navigate('/login');
      } else {
        setUser(parsedUser);
        // Carregar configurações salvas
        const configSalvas = localStorage.getItem(`zdelivery_config_entregador_${parsedUser.id}`);
        if (configSalvas) {
          setConfiguracoes(JSON.parse(configSalvas));
        } else {
          // Preencher com dados do usuário
          setConfiguracoes(prev => ({
            ...prev,
            dadosPessoais: {
              ...prev.dadosPessoais,
              nome: parsedUser.nome,
              telefone: parsedUser.telefone || '',
              cpf: parsedUser.cpf || ''
            },
            pix: {
              ...prev.pix,
              chave: parsedUser.cpf || parsedUser.email
            }
          }));
        }
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSalvar = () => {
    // Validações
    if (!configuracoes.pix.chave.trim()) {
      toast({
        title: 'Chave PIX obrigatória',
        description: 'Por favor, informe sua chave PIX para receber pagamentos.',
        variant: 'destructive'
      });
      return;
    }

    if (!configuracoes.dadosPessoais.cpf.trim()) {
      toast({
        title: 'CPF obrigatório',
        description: 'Por favor, informe seu CPF.',
        variant: 'destructive'
      });
      return;
    }

    // Salvar configurações
    localStorage.setItem(
      `zdelivery_config_entregador_${user.id}`,
      JSON.stringify(configuracoes)
    );

    toast({
      title: 'Configurações salvas!',
      description: 'Suas informações foram atualizadas com sucesso.',
    });
  };

  const handleTestarPix = () => {
    if (!configuracoes.pix.chave.trim()) {
      toast({
        title: 'Informe a chave PIX',
        description: 'Digite sua chave PIX antes de testar.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Testando chave PIX...',
      description: 'Verificando se a chave é válida.',
    });

    // Simular validação
    setTimeout(() => {
      toast({
        title: 'Chave PIX válida!',
        description: 'Sua chave está configurada corretamente.',
      });
    }, 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="entregador" userName={user.nome} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Configurações do Entregador
            </h1>
            <p className="text-gray-600">
              Configure seus dados para receber pagamentos e entregas
            </p>
          </div>

          <div className="space-y-6">
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={configuracoes.dadosPessoais.nome}
                      onChange={(e) =>
                        setConfiguracoes(prev => ({
                          ...prev,
                          dadosPessoais: { ...prev.dadosPessoais, nome: e.target.value }
                        }))
                      }
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={configuracoes.dadosPessoais.cpf}
                      onChange={(e) =>
                        setConfiguracoes(prev => ({
                          ...prev,
                          dadosPessoais: { ...prev.dadosPessoais, cpf: e.target.value }
                        }))
                      }
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={configuracoes.dadosPessoais.telefone}
                      onChange={(e) =>
                        setConfiguracoes(prev => ({
                          ...prev,
                          dadosPessoais: { ...prev.dadosPessoais, telefone: e.target.value }
                        }))
                      }
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="veiculo">Veículo</Label>
                    <Select
                      value={configuracoes.dadosPessoais.veiculo}
                      onValueChange={(value: any) =>
                        setConfiguracoes(prev => ({
                          ...prev,
                          dadosPessoais: { ...prev.dadosPessoais, veiculo: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moto">Moto</SelectItem>
                        <SelectItem value="bicicleta">Bicicleta</SelectItem>
                        <SelectItem value="carro">Carro</SelectItem>
                        <SelectItem value="pe">A pé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PIX */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Configuração PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pix-ativo">Receber via PIX</Label>
                  <Switch
                    id="pix-ativo"
                    checked={configuracoes.pix.ativo}
                    onCheckedChange={(checked) =>
                      setConfiguracoes(prev => ({
                        ...prev,
                        pix: { ...prev.pix, ativo: checked }
                      }))
                    }
                  />
                </div>

                {configuracoes.pix.ativo && (
                  <>
                    <div>
                      <Label htmlFor="tipo-chave">Tipo da Chave</Label>
                      <Select
                        value={configuracoes.pix.tipo}
                        onValueChange={(value: any) =>
                          setConfiguracoes(prev => ({
                            ...prev,
                            pix: { ...prev.pix, tipo: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="telefone">Telefone</SelectItem>
                          <SelectItem value="aleatorio">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="chave-pix">Chave PIX</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="chave-pix"
                          value={configuracoes.pix.chave}
                          onChange={(e) =>
                            setConfiguracoes(prev => ({
                              ...prev,
                              pix: { ...prev.pix, chave: e.target.value }
                            }))
                          }
                          placeholder={`Sua chave ${configuracoes.pix.tipo}`}
                        />
                        <Button onClick={handleTestarPix} variant="outline">
                          Testar
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Esta chave será usada para receber seus pagamentos dos restaurantes
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Disponibilidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Disponibilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="disponivel">Disponível para entregas</Label>
                  <Switch
                    id="disponivel"
                    checked={configuracoes.disponibilidade.ativo}
                    onCheckedChange={(checked) =>
                      setConfiguracoes(prev => ({
                        ...prev,
                        disponibilidade: { ...prev.disponibilidade, ativo: checked }
                      }))
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="raio">Raio de Entrega (km)</Label>
                    <Input
                      id="raio"
                      type="number"
                      value={configuracoes.disponibilidade.raioEntrega}
                      onChange={(e) =>
                        setConfiguracoes(prev => ({
                          ...prev,
                          disponibilidade: { 
                            ...prev.disponibilidade, 
                            raioEntrega: parseInt(e.target.value) 
                          }
                        }))
                      }
                      min="1"
                      max="20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="valor-minimo">Valor Mínimo (R$)</Label>
                    <Input
                      id="valor-minimo"
                      type="number"
                      step="0.50"
                      value={configuracoes.disponibilidade.valorMinimo}
                      onChange={(e) =>
                        setConfiguracoes(prev => ({
                          ...prev,
                          disponibilidade: { 
                            ...prev.disponibilidade, 
                            valorMinimo: parseFloat(e.target.value) 
                          }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo de Ganhos */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Estimativa de Ganhos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Entregas por dia (estimativa):</span>
                    <span className="font-medium">8-12 entregas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor médio por entrega:</span>
                    <span className="font-medium">R$ {configuracoes.disponibilidade.valorMinimo.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-green-300 pt-2">
                    <span>Ganho diário estimado:</span>
                    <span>R$ {(configuracoes.disponibilidade.valorMinimo * 10).toFixed(2)} - R$ {(configuracoes.disponibilidade.valorMinimo * 12).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSalvar} className="w-full bg-red-600 hover:bg-red-700">
              Salvar Configurações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfiguracaoEntregadorPage;
