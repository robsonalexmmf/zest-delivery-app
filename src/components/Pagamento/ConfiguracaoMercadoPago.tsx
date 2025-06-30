
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConfiguracaoMercadoPagoProps {
  onConfigChanged?: (config: MercadoPagoConfig) => void;
}

export interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
  ativo: boolean;
}

const ConfiguracaoMercadoPago: React.FC<ConfiguracaoMercadoPagoProps> = ({
  onConfigChanged
}) => {
  const [config, setConfig] = useState<MercadoPagoConfig>({
    accessToken: '',
    publicKey: '',
    ativo: false
  });
  const [showTokens, setShowTokens] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('zdelivery_mercadopago_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
    }
  }, []);

  const handleSalvar = () => {
    if (config.ativo && (!config.accessToken || !config.publicKey)) {
      toast({
        title: 'Configuração incompleta',
        description: 'Por favor, preencha Access Token e Public Key.',
        variant: 'destructive'
      });
      return;
    }

    // Salvar configurações
    localStorage.setItem('zdelivery_mercadopago_config', JSON.stringify(config));
    
    if (onConfigChanged) {
      onConfigChanged(config);
    }

    toast({
      title: 'Configurações salvas!',
      description: 'Integração com Mercado Pago configurada com sucesso.',
    });
  };

  const handleTestar = async () => {
    if (!config.accessToken) {
      toast({
        title: 'Access Token necessário',
        description: 'Configure o Access Token antes de testar.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Testar a conexão fazendo uma requisição simples
      const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`
        }
      });

      if (response.ok) {
        toast({
          title: 'Conexão bem-sucedida!',
          description: 'Suas credenciais do Mercado Pago estão funcionando.',
        });
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast({
        title: 'Erro na conexão',
        description: 'Verifique suas credenciais do Mercado Pago.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Configuração Mercado Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="mp-ativo">Habilitar Mercado Pago</Label>
          <Switch
            id="mp-ativo"
            checked={config.ativo}
            onCheckedChange={(checked) =>
              setConfig(prev => ({ ...prev, ativo: checked }))
            }
          />
        </div>

        {config.ativo && (
          <>
            <div>
              <Label htmlFor="access-token">Access Token</Label>
              <div className="relative">
                <Input
                  id="access-token"
                  type={showTokens ? "text" : "password"}
                  value={config.accessToken}
                  onChange={(e) =>
                    setConfig(prev => ({ ...prev, accessToken: e.target.value }))
                  }
                  placeholder="APP_USR-..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowTokens(!showTokens)}
                >
                  {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Seu Access Token do Mercado Pago (modo produção ou teste)
              </p>
            </div>

            <div>
              <Label htmlFor="public-key">Public Key</Label>
              <Input
                id="public-key"
                value={config.publicKey}
                onChange={(e) =>
                  setConfig(prev => ({ ...prev, publicKey: e.target.value }))
                }
                placeholder="APP_USR-..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Sua Public Key do Mercado Pago
              </p>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleTestar} variant="outline" size="sm">
                Testar Conexão
              </Button>
              <Button onClick={handleSalvar} size="sm">
                Salvar Configuração
              </Button>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Como obter as credenciais:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Acesse sua conta no Mercado Pago</li>
                <li>2. Vá em "Seu negócio" → "Configurações" → "Credenciais"</li>
                <li>3. Copie o Access Token e Public Key</li>
                <li>4. Use credenciais de teste para testar, produção para vender</li>
              </ol>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfiguracaoMercadoPago;
