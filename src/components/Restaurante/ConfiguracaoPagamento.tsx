
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfiguracaoMercadoPago from '@/components/Pagamento/ConfiguracaoMercadoPago';
import ConfiguracaoMenuAi from '@/components/Pagamento/ConfiguracaoMenuAi';
import type { MercadoPagoConfig } from '@/components/Pagamento/ConfiguracaoMercadoPago';
import type { MenuAiConfig } from '@/services/menuAiService';
import { mercadoPagoService } from '@/services/mercadoPagoService';
import { menuAiService } from '@/services/menuAiService';
import { toast } from '@/hooks/use-toast';

const ConfiguracaoPagamento: React.FC = () => {
  const [mercadoPagoConfig, setMercadoPagoConfig] = useState<MercadoPagoConfig>({
    accessToken: '',
    publicKey: '',
    ativo: false
  });

  const [menuAiConfig, setMenuAiConfig] = useState<MenuAiConfig>({
    apiKey: '',
    phoneNumber: '',
    ativo: false
  });

  const handleMercadoPagoConfigChange = (config: MercadoPagoConfig) => {
    setMercadoPagoConfig(config);
    mercadoPagoService.updateConfig(config);
  };

  const handleMenuAiConfigChange = (config: MenuAiConfig) => {
    setMenuAiConfig(config);
    menuAiService.updateConfig(config);
  };

  const handleSalvarTodasConfiguracoes = () => {
    toast({
      title: 'Configurações salvas!',
      description: 'Todas as configurações foram atualizadas.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configurações de Pagamento & Notificações</h2>
        <Button onClick={handleSalvarTodasConfiguracoes} className="bg-red-600 hover:bg-red-700">
          Salvar Todas as Configurações
        </Button>
      </div>

      <Tabs defaultValue="mercadopago" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mercadopago">Mercado Pago</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="mercadopago" className="space-y-4">
          <ConfiguracaoMercadoPago
            onConfigChanged={handleMercadoPagoConfigChange}
          />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <ConfiguracaoMenuAi
            onConfigChanged={handleMenuAiConfigChange}
          />
        </TabsContent>

        <TabsContent value="resumo" className="space-y-4">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Resumo das Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mercado Pago */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Mercado Pago (PIX):</span>
                    <span className={mercadoPagoConfig.ativo ? 'text-green-600' : 'text-red-600'}>
                      {mercadoPagoConfig.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  {mercadoPagoConfig.ativo && (
                    <>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Access Token:</span>
                        <span>{mercadoPagoConfig.accessToken ? '••••••••' : 'Não configurado'}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Public Key:</span>
                        <span>{mercadoPagoConfig.publicKey ? '••••••••' : 'Não configurado'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* MenuAI WhatsApp */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">MenuAI WhatsApp:</span>
                    <span className={menuAiConfig.ativo ? 'text-green-600' : 'text-red-600'}>
                      {menuAiConfig.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  {menuAiConfig.ativo && (
                    <>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>API Key:</span>
                        <span>{menuAiConfig.apiKey ? '••••••••' : 'Não configurado'}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Número WhatsApp:</span>
                        <span>{menuAiConfig.phoneNumber || 'Não configurado'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Funcionalidades */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Funcionalidades Ativas:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {mercadoPagoConfig.ativo && <li>• Pagamento PIX via Mercado Pago</li>}
                    {menuAiConfig.ativo && <li>• Notificações WhatsApp de status de pedido</li>}
                    {!mercadoPagoConfig.ativo && !menuAiConfig.ativo && 
                      <li className="text-gray-500">• Nenhuma funcionalidade configurada</li>
                    }
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracaoPagamento;
