
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Phone, Key } from 'lucide-react';
import { menuAiService, type MenuAiConfig } from '@/services/menuAiService';
import { toast } from '@/hooks/use-toast';

interface ConfiguracaoMenuAiProps {
  onConfigChanged?: (config: MenuAiConfig) => void;
}

const ConfiguracaoMenuAi: React.FC<ConfiguracaoMenuAiProps> = ({ onConfigChanged }) => {
  const [config, setConfig] = useState<MenuAiConfig>({
    apiKey: '',
    phoneNumber: '',
    ativo: false
  });

  const [testPhone, setTestPhone] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('zdelivery_menuai_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
    }
  }, []);

  const handleConfigChange = (field: keyof MenuAiConfig, value: string | boolean) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
  };

  const handleSave = () => {
    menuAiService.updateConfig(config);
    onConfigChanged?.(config);
    
    toast({
      title: 'Configuração salva!',
      description: 'As configurações do MenuAI foram atualizadas.',
    });
  };

  const handleTest = async () => {
    if (!testPhone) {
      toast({
        title: 'Erro',
        description: 'Digite um número de telefone para teste.',
        variant: 'destructive'
      });
      return;
    }

    setIsTestLoading(true);
    
    try {
      await menuAiService.sendStatusMessage(
        testPhone,
        '#TESTE',
        'recebido',
        'Restaurante Teste'
      );
      
      toast({
        title: 'Teste enviado!',
        description: 'Mensagem de teste enviada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro no teste',
        description: 'Não foi possível enviar a mensagem de teste.',
        variant: 'destructive'
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          <span>Configuração MenuAI WhatsApp</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <MessageSquare className="h-4 w-4" />
          <AlertDescription>
            Configure sua integração com MenuAI para enviar notificações de status de pedido via WhatsApp.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="menuai-ativo"
              checked={config.ativo}
              onCheckedChange={(checked) => handleConfigChange('ativo', checked)}
            />
            <Label htmlFor="menuai-ativo" className="font-medium">
              Ativar notificações WhatsApp
            </Label>
          </div>

          {config.ativo && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="api-key" className="flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>API Key MenuAI</span>
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Sua chave API do MenuAI"
                  value={config.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Número WhatsApp Business</span>
                </Label>
                <Input
                  id="phone-number"
                  placeholder="5511999999999"
                  value={config.phoneNumber}
                  onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
                />
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Teste de Envio</h4>
                <div className="flex space-x-2">
                  <Input
                    placeholder="5511999999999"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleTest}
                    disabled={isTestLoading || !config.apiKey || !config.phoneNumber}
                    variant="outline"
                  >
                    {isTestLoading ? 'Enviando...' : 'Testar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            Salvar Configurações
          </Button>
        </div>

        {config.ativo && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Status das Configurações:</h4>
            <div className="space-y-1 text-sm text-green-800">
              <p>✅ MenuAI: {config.ativo ? 'Ativo' : 'Inativo'}</p>
              <p>✅ API Key: {config.apiKey ? 'Configurada' : 'Não configurada'}</p>
              <p>✅ Número WhatsApp: {config.phoneNumber ? 'Configurado' : 'Não configurado'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfiguracaoMenuAi;
