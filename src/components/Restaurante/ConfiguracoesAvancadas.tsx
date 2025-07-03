
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Clock, MapPin, CreditCard, Settings, Bell, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConfiguracoesAvancadasProps {
  configuracoes: any;
  onSave: (config: any) => void;
}

const ConfiguracoesAvancadas: React.FC<ConfiguracoesAvancadasProps> = ({ configuracoes, onSave }) => {
  const [config, setConfig] = useState(configuracoes);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoHorario, setNovoHorario] = useState({ dia: '', abertura: '', fechamento: '', fechado: false });

  const diasSemana = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 
    'Sexta-feira', 'Sábado', 'Domingo'
  ];

  const adicionarCategoria = () => {
    if (novaCategoria && !config.categorias_personalizadas?.includes(novaCategoria)) {
      setConfig({
        ...config,
        categorias_personalizadas: [...(config.categorias_personalizadas || []), novaCategoria]
      });
      setNovaCategoria('');
    }
  };

  const removerCategoria = (categoria: string) => {
    setConfig({
      ...config,
      categorias_personalizadas: config.categorias_personalizadas?.filter((c: string) => c !== categoria)
    });
  };

  const adicionarHorario = () => {
    if (novoHorario.dia && (novoHorario.fechado || (novoHorario.abertura && novoHorario.fechamento))) {
      const horariosExistentes = config.horarios_especiais || [];
      const horarioExiste = horariosExistentes.some((h: any) => h.dia === novoHorario.dia);
      
      if (!horarioExiste) {
        setConfig({
          ...config,
          horarios_especiais: [...horariosExistentes, { ...novoHorario, id: Date.now() }]
        });
        setNovoHorario({ dia: '', abertura: '', fechamento: '', fechado: false });
      }
    }
  };

  const removerHorario = (id: number) => {
    setConfig({
      ...config,
      horarios_especiais: config.horarios_especiais?.filter((h: any) => h.id !== id)
    });
  };

  const salvarConfiguracoes = () => {
    onSave(config);
    toast({
      title: 'Configurações salvas!',
      description: 'Todas as configurações avançadas foram atualizadas.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Horários Especiais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Horários Especiais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.horarios_especiais?.map((horario: any) => (
            <div key={horario.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">{horario.dia}</span>
                <span className="text-gray-600 ml-2">
                  {horario.fechado ? 'Fechado' : `${horario.abertura} - ${horario.fechamento}`}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removerHorario(horario.id)}
                className="text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="grid grid-cols-4 gap-2">
            <Select value={novoHorario.dia} onValueChange={(value) => setNovoHorario({...novoHorario, dia: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Dia" />
              </SelectTrigger>
              <SelectContent>
                {diasSemana.map(dia => (
                  <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="time"
              placeholder="Abertura"
              value={novoHorario.abertura}
              onChange={(e) => setNovoHorario({...novoHorario, abertura: e.target.value})}
              disabled={novoHorario.fechado}
            />
            
            <Input
              type="time"
              placeholder="Fechamento"
              value={novoHorario.fechamento}
              onChange={(e) => setNovoHorario({...novoHorario, fechamento: e.target.value})}
              disabled={novoHorario.fechado}
            />
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={novoHorario.fechado}
                onCheckedChange={(checked) => setNovoHorario({...novoHorario, fechado: checked})}
              />
              <Label className="text-sm">Fechado</Label>
            </div>
          </div>
          
          <Button onClick={adicionarHorario} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Horário
          </Button>
        </CardContent>
      </Card>

      {/* Área de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Área de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Raio de Entrega (km)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.raio_entrega || 5}
                onChange={(e) => setConfig({...config, raio_entrega: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label>Valor Mínimo do Pedido (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={config.valor_minimo_pedido || 20}
                onChange={(e) => setConfig({...config, valor_minimo_pedido: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <div>
            <Label>CEPs Específicos (separados por vírgula)</Label>
            <Textarea
              placeholder="01000-000, 02000-000, 03000-000"
              value={config.ceps_atendimento || ''}
              onChange={(e) => setConfig({...config, ceps_atendimento: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categorias Personalizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Categorias Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {config.categorias_personalizadas?.map((categoria: string) => (
              <Badge key={categoria} variant="secondary" className="flex items-center">
                {categoria}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => removerCategoria(categoria)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Nova categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && adicionarCategoria()}
            />
            <Button onClick={adicionarCategoria} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar novos pedidos</Label>
                <p className="text-sm text-gray-600">Receber notificação por email e SMS</p>
              </div>
              <Switch
                checked={config.notificacoes_pedidos || true}
                onCheckedChange={(checked) => setConfig({...config, notificacoes_pedidos: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar cancelamentos</Label>
                <p className="text-sm text-gray-600">Alertas de pedidos cancelados</p>
              </div>
              <Switch
                checked={config.notificacoes_cancelamentos || true}
                onCheckedChange={(checked) => setConfig({...config, notificacoes_cancelamentos: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Relatórios diários</Label>
                <p className="text-sm text-gray-600">Resumo diário por email</p>
              </div>
              <Switch
                checked={config.relatorios_diarios || false}
                onCheckedChange={(checked) => setConfig({...config, relatorios_diarios: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Configurações de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tempo estimado de preparo (min)</Label>
              <Input
                type="number"
                value={config.tempo_preparo_estimado || 30}
                onChange={(e) => setConfig({...config, tempo_preparo_estimado: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label>Tempo estimado de entrega (min)</Label>
              <Input
                type="number"
                value={config.tempo_entrega_estimado || 30}
                onChange={(e) => setConfig({...config, tempo_entrega_estimado: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Entrega própria</Label>
              <p className="text-sm text-gray-600">Usar entregadores próprios</p>
            </div>
            <Switch
              checked={config.entrega_propria || false}
              onCheckedChange={(checked) => setConfig({...config, entrega_propria: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Retirada no local</Label>
              <p className="text-sm text-gray-600">Permitir retirada no restaurante</p>
            </div>
            <Switch
              checked={config.retirada_local || true}
              onCheckedChange={(checked) => setConfig({...config, retirada_local: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={salvarConfiguracoes} className="bg-red-600 hover:bg-red-700">
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
};

export default ConfiguracoesAvancadas;
