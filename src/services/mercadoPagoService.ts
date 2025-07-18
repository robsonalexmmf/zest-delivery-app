
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
    // QR Code simulado para PIX - representação visual do código PIX
    return 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7V1bjF3Hdd4/a+9zzj33xeGQFCmKlERRlmTJlmTZji05cZI4ThonbZAXo0DRFn1o+9CiBYq+FH3oU4s2LdCiKFAURR/6kBejaJEEsZM0ju3atkxLsi1SEiVRpEiKJIcz92Xutdd6qOqvaq+z9zlz75nhudf6gMHMOfecOefstdd//7/qr4wx5vNf/zouLi5TiqmLAi4urpvHa38VHnr2uS8A3CamlMbBweF9YdZ2i4T5bCa+ZrY9+sHI7Vgcc8f1J7/yuy6Mue56AXBfABxeK0L/edbXu9+kta9W3VYrmfnqPfXb+qTdvP3h3w25D5F/+Dd/+TlKGWPWsrlvDQ3G3kfXqy0zNw88VLd51ZpSWr2vr5v9BmU/r//q9xKccKk/5cz8MwYHI/c0f9vYOu2Z3Hx7e/vj+z745RzrHjSm9H3X/A3xOjj4t4e9fZF/97Nf/7nP1V9QJnOOPr3y66vP/sOHnFJKKdVo7bGmkPUd6DDNV9/X6KKq7etTd9f1jru0W/3JgdfOH6Jf+fqV3/zCjhGzJrZMK7Zw5+Lgdoa9f5+aGy0CJVSsKJUrOu19PZ12W2bKvVX7+vrnbb+pZr/qM/VX50zNK3vqfXXKIXWM+wd/8aMvHLr9wLOi3fOOaR5C82C0j5r7XfkC8L5+5c1tb1+WuiWqKgUZMHLVaP2r6O/Dyu+rzwfVKJn1ue/r88+Yr5bxtmvHWxs/lHJTyk+d8H7FuoTm6PYNnzSqHZ+8fc9n2UNiHzM5IKG8zGp5WQFJaRlRWKkJ+t5KwdZ+H39fvlYpHltt+lW1HdT39X5pZr9u/KE6y+tXG6g+V9/X+4k+z6rOI9V3+rrYr2q7pLx9t7s8ZRdVHnvrzc9t/Z+tgpVT6ZJSWlJKr9kmpZSSy1vf1+Y9sL9z2jr7Aq0VfXKvKuNur9rXp7zdppnOjt7Xfp5VP63K2Nevztn/7T6OGgdA1/X97PNtzHkdL5fB8n6P7Xu7vm8dJ1Ydx46f3//fO7b/jR3Pmt6x9LlSukxrt1Y0R9vLyrD2tLJSvVdqA9R5mH1JKKlGM/7Vp5Smfbgmp9/bp+z7WQNyWL2xWfOvl1lX3LhP1Ts7zKmP7n7n6v/45e/ev/+bz33vB/XjWKnVP9PXrjKg+r5SUrSf1M8qu8rKqmz/tFiOLuJWKW/fp+fF6/rZhOI8+7e9fn1P9z0q+7c7z/X1y7P8/Tz+vvt6X5K5z1rJqvt6fLN99U3HZjufnWr7r3793/7m1//rJ7Y+/8+/8e2fnfvLb19eeXrxl7mLi4uLy3sJzBhDeYxZsZTHBu+1a1L/Dw==';
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
