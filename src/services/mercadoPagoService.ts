
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
    this.initializeWithDefaultConfig();
  }

  private loadConfig() {
    const savedConfig = localStorage.getItem('zdelivery_mercadopago_config');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  private initializeWithDefaultConfig() {
    // Configurar automaticamente com a chave fornecida
    if (!this.config) {
      this.config = {
        accessToken: 'APP_USR-3212728345390685-060911-f764f941b8b326a90bf56e30a417d512-40217673',
        publicKey: 'APP_USR-3212728345390685-060911-f764f941b8b326a90bf56e30a417d512-40217673',
        ativo: true
      };
      localStorage.setItem('zdelivery_mercadopago_config', JSON.stringify(this.config));
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

    // Simular resposta do Mercado Pago (necessário backend real para produção)
    const mockPixResponse: PixPaymentResponse = {
      id: `MP${Date.now()}`,
      qrCode: this.generatePixCode(request.amount),
      qrCodeBase64: this.generateQRCodeBase64(),
      pixCopyPaste: this.generatePixCode(request.amount),
      status: 'pending',
      expirationDate: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    };

    // Salvar localmente para verificação posterior
    localStorage.setItem(`pix_payment_${mockPixResponse.id}`, JSON.stringify({
      ...mockPixResponse,
      createdAt: new Date().toISOString(),
      amount: request.amount,
      description: request.description
    }));

    return mockPixResponse;
  }

  private generatePixCode(amount: number): string {
    // Gerar código PIX simulado baseado no formato real
    const timestamp = Date.now().toString();
    const baseCode = `00020126360014BR.GOV.BCB.PIX0114+5511999999999${timestamp}`;
    const amountStr = amount.toFixed(2).replace('.', '');
    return `${baseCode}${amountStr}6304`;
  }

  private generateQRCodeBase64(): string {
    // QR Code base64 simulado (em produção seria gerado pelo Mercado Pago)
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  async checkPaymentStatus(paymentId: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Mercado Pago não configurado');
    }

    // Verificar status localmente (em produção seria via API)
    const paymentData = localStorage.getItem(`pix_payment_${paymentId}`);
    if (paymentData) {
      const payment = JSON.parse(paymentData);
      return payment.status;
    }

    return 'pending';
  }

  simulatePaymentConfirmation(paymentId: string): void {
    const paymentData = localStorage.getItem(`pix_payment_${paymentId}`);
    if (paymentData) {
      const payment = JSON.parse(paymentData);
      payment.status = 'approved';
      localStorage.setItem(`pix_payment_${paymentId}`, JSON.stringify(payment));
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();
export type { PixPaymentRequest, PixPaymentResponse };
