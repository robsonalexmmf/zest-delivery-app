
interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
  ativo: boolean;
}

interface PixPaymentRequest {
  amount: number;
  description: string;
  payerEmail?: string;
  orderId?: string;
}

interface PixPaymentResponse {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
  pixCopyPaste: string;
  status: string;
  expirationDate: string;
}

class MercadoPagoService {
  private config: MercadoPagoConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const savedConfig = localStorage.getItem('zdelivery_mercadopago_config');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  updateConfig(config: MercadoPagoConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config?.ativo && !!this.config?.accessToken;
  }

  async createPixPayment(request: PixPaymentRequest): Promise<PixPaymentResponse> {
    if (!this.isConfigured()) {
      throw new Error('Mercado Pago não configurado');
    }

    const paymentData = {
      transaction_amount: request.amount,
      description: request.description,
      payment_method_id: 'pix',
      payer: {
        email: request.payerEmail || 'cliente@zdelivery.com',
        first_name: 'Cliente',
        last_name: 'ZDelivery'
      },
      external_reference: request.orderId,
      notification_url: window.location.origin + '/webhook/mercadopago'
    };

    try {
      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config!.accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': Date.now().toString()
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar pagamento PIX');
      }

      const paymentResponse = await response.json();

      return {
        id: paymentResponse.id,
        qrCode: paymentResponse.point_of_interaction?.transaction_data?.qr_code || '',
        qrCodeBase64: paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64 || '',
        pixCopyPaste: paymentResponse.point_of_interaction?.transaction_data?.qr_code || '',
        status: paymentResponse.status,
        expirationDate: paymentResponse.date_of_expiration || ''
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw error;
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Mercado Pago não configurado');
    }

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.config!.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento');
      }

      const paymentData = await response.json();
      return paymentData.status;
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      throw error;
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();
export type { PixPaymentRequest, PixPaymentResponse };
