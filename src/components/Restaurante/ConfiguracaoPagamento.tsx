
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ConfiguracaoPagamento: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState({
    mercadoPago: {
      ativo: true,
      accessToken: 'TEST-1234567890-123456-abcdef',
      publicKey: 'TEST-abcdef123456789-987654321',
    },
    pix: {
      ativo: true,
      chave: 'restaurante@zdelivery.com',
      tipo: 'email' as 'email' | 'cpf' | 'telefone' | 'aleatorio'
    },
    cartao: {
      ativo: true,
      taxa: 3.5, // Taxa de processamento
    }
  });

  const handleSalvar = () => {
    // Simular salvamento das configurações
    console.log('Configurações salvas:', configuracoes);
    
    toast({
      title: 'Configurações salvas!',
      description: 'As configurações de pagamento foram atualizadas com sucesso.',
    });
  };

  const handleTestarIntegracao = () => {
    // Simular teste da integração
    toast({
      title: 'Testando integração...',
      description: 'Verificando conectividade com Mercado Pago.',
    });

    setTimeout(() => {
      toast({
        title: 'Integração funcionando!',
        description: 'Todos os métodos de pagamento estão configurados corretamente.',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mercado Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Integração Mercado Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mp-ativo">Habilitar Mercado Pago</Label>
            <Switch
              id="mp-ativo"
              checked={configuracoes.mercadoPago.ativo}
              onCheckedChange={(checked) =>
                setConfiguracoes(prev => ({
                  ...prev,
                  mercadoPago: { ...prev.mercadoPago, ativo: checked }
                }))
              }
            />
          </div>

          {configuracoes.mercadoPago.ativo && (
            <>
              <div>
                <Label htmlFor="access-token">Access Token</Label>
                <Input
                  id="access-token"
                  type="password"
                  value={configuracoes.mercadoPago.accessToken}
                  onChange={(e) =>
                    setConfiguracoes(prev => ({
                      ...prev,
                      mercadoPago: { ...prev.mercadoPago, accessToken: e.target.value }
                    }))
                  }
                  placeholder="Seu Access Token do Mercado Pago"
                />
              </div>

              <div>
                <Label htmlFor="public-key">Public Key</Label>
                <Input
                  id="public-key"
                  value={configuracoes.mercadoPago.publicKey}
                  onChange={(e) =>
                    setConfiguracoes(prev => ({
                      ...prev,
                      mercadoPago: { ...prev.mercadoPago, publicKey: e.target.value }
                    }))
                  }
                  placeholder="Sua Public Key do Mercado Pago"
                />
              </div>

              <Button onClick={handleTestarIntegracao} variant="outline" size="sm">
                Testar Integração
              </Button>
            </>
          )}
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
            <Label htmlFor="pix-ativo">Habilitar PIX</Label>
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
            <div>
              <Label htmlFor="chave-pix">Chave PIX</Label>
              <Input
                id="chave-pix"
                value={configuracoes.pix.chave}
                onChange={(e) =>
                  setConfiguracoes(prev => ({
                    ...prev,
                    pix: { ...prev.pix, chave: e.target.value }
                  }))
                }
                placeholder="sua.chave@pix.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Chave PIX onde você receberá os pagamentos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cartão de Crédito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Cartão de Crédito
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cartao-ativo">Aceitar Cartão</Label>
            <Switch
              id="cartao-ativo"
              checked={configuracoes.cartao.ativo}
              onCheckedChange={(checked) =>
                setConfiguracoes(prev => ({
                  ...prev,
                  cartao: { ...prev.cartao, ativo: checked }
                }))
              }
            />
          </div>

          {configuracoes.cartao.ativo && (
            <div>
              <Label htmlFor="taxa-cartao">Taxa de Processamento (%)</Label>
              <Input
                id="taxa-cartao"
                type="number"
                step="0.1"
                value={configuracoes.cartao.taxa}
                onChange={(e) =>
                  setConfiguracoes(prev => ({
                    ...prev,
                    cartao: { ...prev.cartao, taxa: parseFloat(e.target.value) }
                  }))
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Taxa cobrada por transação de cartão
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Resumo das Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Mercado Pago:</span>
              <span className={configuracoes.mercadoPago.ativo ? 'text-green-600' : 'text-red-600'}>
                {configuracoes.mercadoPago.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>PIX:</span>
              <span className={configuracoes.pix.ativo ? 'text-green-600' : 'text-red-600'}>
                {configuracoes.pix.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cartão de Crédito:</span>
              <span className={configuracoes.cartao.ativo ? 'text-green-600' : 'text-red-600'}>
                {configuracoes.cartao.ativo ? `Ativo (${configuracoes.cartao.taxa}%)` : 'Inativo'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSalvar} className="w-full bg-red-600 hover:bg-red-700">
        Salvar Configurações
      </Button>
    </div>
  );
};

export default ConfiguracaoPagamento;
