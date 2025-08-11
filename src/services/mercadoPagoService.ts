// Serviço Mercado Pago PIX - usa Edge Function do Supabase com segredo seguro
interface MercadoPagoConfig {
  accessToken: string; // ignorado no frontend (usado no backend)
  publicKey: string;   // ignorado no frontend (usado no backend)
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
  qrCode: string; // alias para qr_code (string copia e cola)
  qrCodeBase64: string; // imagem base64
  pixCopyPaste: string; // igual ao qrCode
  status: string;
  expirationDate?: string;
}

class MercadoPagoService {
  private config: MercadoPagoConfig | null = null;
  private edgeUrl = 'https://bnimpmwltkgwkgswkqkl.supabase.co/functions/v1/mercadopago-pix';

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem('zdelivery_mercadopago_config');
      if (saved) this.config = JSON.parse(saved);
      // Padrão: ativo se não estiver explicitamente desativado
      if (!this.config) this.config = { accessToken: '', publicKey: '', ativo: true };
    } catch {
      this.config = { accessToken: '', publicKey: '', ativo: true };
    }
  }

  updateConfig(config: MercadoPagoConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    // Considera configurado quando não estiver explicitamente desativado.
    return this.config?.ativo !== false;
  }

  async createPixPayment(request: PixPaymentRequest): Promise<PixPaymentResponse> {
    if (!this.isConfigured()) {
      throw new Error('Mercado Pago não configurado');
    }

    const res = await fetch(this.edgeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: request.amount,
        description: request.description,
        payerEmail: request.payerEmail,
        orderId: request.orderId,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erro ao criar PIX: ${errText}`);
    }

    const data = await res.json();
    const qr = data?.point_of_interaction?.transaction_data?.qr_code || data?.qr_code || '';
    const qrBase64 = data?.point_of_interaction?.transaction_data?.qr_code_base64 || data?.qr_code_base64 || '';

    const response: PixPaymentResponse = {
      id: String(data.id),
      qrCode: qr,
      qrCodeBase64: qrBase64,
      pixCopyPaste: qr,
      status: data.status || 'pending',
      expirationDate: data.date_of_expiration,
    };

    return response;
  }

  async checkPaymentStatus(paymentId: string): Promise<string> {
    const url = `${this.edgeUrl}?id=${encodeURIComponent(paymentId)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erro ao verificar status: ${errText}`);
    }
    const data = await res.json();
    return data.status || 'pending';
  }

  // Em modo real não simulamos confirmação
  simulatePaymentConfirmation(_paymentId: string): void {
    console.warn('Simulação de pagamento desabilitada no modo real.');
  }
}

export const mercadoPagoService = new MercadoPagoService();
export type { PixPaymentRequest, PixPaymentResponse };