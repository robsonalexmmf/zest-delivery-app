
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Cupom {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
  ativo: boolean;
  dataExpiracao?: string;
  usoMaximo?: number;
  usoAtual: number;
}

const GerenciadorCupons: React.FC = () => {
  const [cupons, setCupons] = useState<Cupom[]>([
    {
      id: '1',
      codigo: 'DESCONTO10',
      descricao: 'Desconto de 10%',
      tipo: 'percentual',
      valor: 10,
      ativo: true,
      usoMaximo: 100,
      usoAtual: 25
    },
    {
      id: '2',
      codigo: 'PRIMEIRACOMPRA',
      descricao: 'Primeira compra',
      tipo: 'percentual',
      valor: 15,
      ativo: true,
      usoMaximo: 50,
      usoAtual: 12
    },
    {
      id: '3',
      codigo: 'FRETEGRATIS',
      descricao: 'Desconto no frete',
      tipo: 'fixo',
      valor: 5,
      ativo: true,
      usoMaximo: 200,
      usoAtual: 78
    }
  ]);

  const [novoCupom, setNovoCupom] = useState({
    codigo: '',
    descricao: '',
    tipo: 'percentual' as 'percentual' | 'fixo',
    valor: 0,
    dataExpiracao: '',
    usoMaximo: 100
  });

  const [editando, setEditando] = useState<string | null>(null);

  const handleAdicionarCupom = () => {
    if (!novoCupom.codigo || !novoCupom.descricao || novoCupom.valor <= 0) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    const cupomExiste = cupons.some(c => c.codigo.toLowerCase() === novoCupom.codigo.toLowerCase());
    if (cupomExiste) {
      toast({
        title: 'Erro',
        description: 'Já existe um cupom com este código.',
        variant: 'destructive'
      });
      return;
    }

    const cupom: Cupom = {
      id: Date.now().toString(),
      codigo: novoCupom.codigo.toUpperCase(),
      descricao: novoCupom.descricao,
      tipo: novoCupom.tipo,
      valor: novoCupom.valor,
      ativo: true,
      dataExpiracao: novoCupom.dataExpiracao || undefined,
      usoMaximo: novoCupom.usoMaximo,
      usoAtual: 0
    };

    setCupons([...cupons, cupom]);
    setNovoCupom({
      codigo: '',
      descricao: '',
      tipo: 'percentual',
      valor: 0,
      dataExpiracao: '',
      usoMaximo: 100
    });

    toast({
      title: 'Cupom criado!',
      description: `Cupom ${cupom.codigo} foi criado com sucesso.`
    });
  };

  const handleRemoverCupom = (id: string) => {
    setCupons(cupons.filter(c => c.id !== id));
    toast({
      title: 'Cupom removido',
      description: 'Cupom foi removido com sucesso.'
    });
  };

  const handleToggleAtivo = (id: string) => {
    setCupons(cupons.map(c => 
      c.id === id ? { ...c, ativo: !c.ativo } : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Formulário para novo cupom */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Cupom</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código do Cupom</Label>
              <Input
                id="codigo"
                value={novoCupom.codigo}
                onChange={(e) => setNovoCupom({...novoCupom, codigo: e.target.value.toUpperCase()})}
                placeholder="Ex: DESCONTO20"
                maxLength={20}
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={novoCupom.descricao}
                onChange={(e) => setNovoCupom({...novoCupom, descricao: e.target.value})}
                placeholder="Ex: Desconto de 20%"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Tipo de Desconto</Label>
              <Select value={novoCupom.tipo} onValueChange={(value: any) => setNovoCupom({...novoCupom, tipo: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentual">Percentual (%)</SelectItem>
                  <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="valor">
                Valor {novoCupom.tipo === 'percentual' ? '(%)' : '(R$)'}
              </Label>
              <Input
                id="valor"
                type="number"
                value={novoCupom.valor}
                onChange={(e) => setNovoCupom({...novoCupom, valor: Number(e.target.value)})}
                min="0"
                max={novoCupom.tipo === 'percentual' ? 100 : undefined}
              />
            </div>
            <div>
              <Label htmlFor="usoMaximo">Uso Máximo</Label>
              <Input
                id="usoMaximo"
                type="number"
                value={novoCupom.usoMaximo}
                onChange={(e) => setNovoCupom({...novoCupom, usoMaximo: Number(e.target.value)})}
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dataExpiracao">Data de Expiração (opcional)</Label>
            <Input
              id="dataExpiracao"
              type="date"
              value={novoCupom.dataExpiracao}
              onChange={(e) => setNovoCupom({...novoCupom, dataExpiracao: e.target.value})}
            />
          </div>

          <Button onClick={handleAdicionarCupom} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Criar Cupom
          </Button>
        </CardContent>
      </Card>

      {/* Lista de cupons existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Cupons Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cupons.map(cupom => (
              <div key={cupom.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="font-mono">
                      {cupom.codigo}
                    </Badge>
                    <span className="font-medium">{cupom.descricao}</span>
                    <Badge className={cupom.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {cupom.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAtivo(cupom.id)}
                    >
                      {cupom.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoverCupom(cupom.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Desconto:</span>{' '}
                    {cupom.tipo === 'percentual' ? `${cupom.valor}%` : `R$ ${cupom.valor.toFixed(2)}`}
                  </div>
                  <div>
                    <span className="font-medium">Uso:</span>{' '}
                    {cupom.usoAtual}/{cupom.usoMaximo || '∞'}
                  </div>
                  <div>
                    <span className="font-medium">Expira:</span>{' '}
                    {cupom.dataExpiracao ? new Date(cupom.dataExpiracao).toLocaleDateString() : 'Sem expiração'}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    {cupom.ativo && (!cupom.usoMaximo || cupom.usoAtual < cupom.usoMaximo) ? 'Disponível' : 'Indisponível'}
                  </div>
                </div>
              </div>
            ))}
            
            {cupons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum cupom criado ainda. Crie seu primeiro cupom acima.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciadorCupons;
