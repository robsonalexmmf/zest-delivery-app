import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { pagamentoService } from '@/services/pagamentoService';
import Logo from '@/components/common/Logo';

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pagamento, setPagamento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const plan = searchParams.get('plan') || 'premium';
  const userEmail = searchParams.get('user');

  useEffect(() => {
    if (!user && !userEmail) {
      navigate('/auth');
      return;
    }

    // Criar pagamento automaticamente
    try {
      const planData = {
        premium: { name: 'Premium', price: 79 },
        basico: { name: 'Básico', price: 29 },
        enterprise: { name: 'Enterprise', price: 149 }
      };

      const selectedPlan = planData[plan as keyof typeof planData] || planData.premium;
      const novoPagamento = pagamentoService.criarPagamentoPIX(
        selectedPlan.name, 
        selectedPlan.price,
        (user?.user_metadata?.nome as string) || userEmail || 'Novo Restaurante'
      );

      setPagamento(novoPagamento);
      setLoading(false);

      toast({
        title: 'Checkout iniciado',
        description: `Finalize o pagamento do plano ${selectedPlan.name}`,
      });
    } catch (error) {
      toast({
        title: 'Erro no checkout',
        description: 'Não foi possível iniciar o processo de pagamento.',
        variant: 'destructive'
      });
      navigate('/');
    }
  }, [user, userEmail, plan, navigate]);

  const handleCopyPixCode = async () => {
    if (!pagamento?.pixCode) return;

    try {
      await navigator.clipboard.writeText(pagamento.pixCode);
      toast({
        title: 'Código PIX copiado!',
        description: 'Cole no seu app de pagamentos para finalizar.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o código PIX.',
        variant: 'destructive'
      });
    }
  };

  const handleSimularPagamento = () => {
    if (!pagamento?.id) return;

    pagamentoService.simularPagamento(pagamento.id);
    
    toast({
      title: 'Pagamento confirmado!',
      description: 'Sua assinatura foi ativada com sucesso. Redirecionando...',
    });

    // Redirecionar para dashboard do restaurante
    setTimeout(() => {
      navigate('/dashboard-restaurante');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando checkout...</p>
        </div>
      </div>
    );
  }

  if (!pagamento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Erro no checkout</p>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Badge className="bg-white text-red-600">Checkout</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span>Finalizar Assinatura</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações do Plano */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Plano {pagamento.plano}
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-4">
                  R$ {pagamento.valor.toFixed(2)}
                  <span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
              </div>

              {/* QR Code PIX */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pagamento.pixCode)}&format=png`}
                  alt="QR Code PIX"
                  className="w-32 h-32 mx-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNEMUQ1REIiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />
                <p className="text-sm text-gray-600">
                  Escaneie com seu app de pagamentos
                </p>
              </div>

              {/* Código PIX */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  Ou copie o código PIX:
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="font-mono text-xs text-gray-700 break-all mb-3">
                    {pagamento.pixCode.substring(0, 50)}...
                  </div>
                  
                  <Button
                    onClick={handleCopyPixCode}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar código PIX
                  </Button>
                </div>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Como pagar:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Abra seu app de pagamentos</li>
                  <li>2. Escaneie o QR Code ou cole o código PIX</li>
                  <li>3. Confirme o pagamento</li>
                  <li>4. Sua assinatura será ativada automaticamente</li>
                </ol>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                <Button
                  onClick={handleSimularPagamento}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Simular Pagamento (Demo)
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>

              {/* Status de Segurança */}
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  🔒 Pagamento Seguro
                </Badge>
                <span>Powered by ZDelivery</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;