
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfiguracaoMercadoPago from '@/components/Pagamento/ConfiguracaoMercadoPago';
import type { MercadoPagoConfig } from '@/components/Pagamento/ConfiguracaoMercadoPago';
import { mercadoPagoService } from '@/services/mercadoPagoService';
import { toast } from '@/hooks/use-toast';

const ConfiguracaoPagamento: React.FC = () => {
  const [mercadoPagoConfig, setMercadoPagoConfig] = useState<MercadoPagoConfig>({
    accessToken: '',
    publicKey: '',
    ativo: false
  });

  const handleMercadoPagoConfigChange = (config: MercadoPagoConfig) => {
    setMercadoPagoConfig(config);
    mercadoPagoService.updateConfig(config);
  };

  const handleSalvarTodasConfiguracoes = () => {
    toast({
      title: 'Configurações salvas!',
      description: 'Todas as configurações de pagamento foram atualizadas.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configurações de Pagamento</h2>
        <Button onClick={handleSalvarTodasConfiguracoes} className="bg-red-600 hover:bg-red-700">
          Salvar Todas as Configurações
        </Button>
      </div>

      <Tabs defaultValue="mercadopago" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mercadopago">Mercado Pago</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="mercadopago" className="space-y-4">
          <ConfiguracaoMercadoPago
            onConfigChanged={handleMercadoPagoConfigChange}
          />
        </TabsContent>

        <TabsContent value="resumo" className="space-y-4">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Resumo das Configurações</CardTitle>
            </CardHeader>
            <CardContent>
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

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Métodos Habilitados:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {mercadoPagoConfig.ativo && <li>• PIX (QR Code e Copia e Cola)</li>}
                    {!mercadoPagoConfig.ativo && <li className="text-gray-500">• Nenhum método configurado</li>}
                  </ul>
                </div>

                {mercadoPagoConfig.ativo && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Funcionalidades Ativas:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Geração automática de QR Code PIX</li>
                      <li>• Código PIX copia e cola</li>
                      <li>• Verificação automática de pagamento</li>
                      <li>• Integração completa com Mercado Pago</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracaoPagamento;
