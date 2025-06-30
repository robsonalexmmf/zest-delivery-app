
interface MenuAiConfig {
  apiKey: string;
  phoneNumber: string;
  ativo: boolean;
}

interface WhatsAppMessage {
  to: string;
  message: string;
  pedidoId: string;
}

class MenuAiService {
  private config: MenuAiConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const savedConfig = localStorage.getItem('zdelivery_menuai_config');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  updateConfig(config: MenuAiConfig) {
    this.config = config;
    localStorage.setItem('zdelivery_menuai_config', JSON.stringify(config));
  }

  isConfigured(): boolean {
    return this.config?.ativo && !!this.config?.apiKey && !!this.config?.phoneNumber;
  }

  async sendStatusMessage(clientePhone: string, pedidoId: string, status: string, restaurante: string): Promise<void> {
    if (!this.isConfigured()) {
      console.log('MenuAI não configurado');
      return;
    }

    const message = this.getStatusMessage(status, pedidoId, restaurante);
    
    try {
      const response = await fetch('https://api.menu.ai/v1/whatsapp/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config!.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.config!.phoneNumber,
          to: clientePhone,
          type: 'text',
          text: {
            body: message
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem WhatsApp');
      }

      console.log(`Mensagem enviada para ${clientePhone}: ${message}`);
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
    }
  }

  private getStatusMessage(status: string, pedidoId: string, restaurante: string): string {
    const statusMessages = {
      'recebido': `🍽️ *Pedido Confirmado!*\n\nSeu pedido ${pedidoId} do ${restaurante} foi recebido e está sendo preparado!\n\n⏰ Tempo estimado: 30-45 min`,
      'preparando': `👨‍🍳 *Preparando seu pedido*\n\nSeu pedido ${pedidoId} está sendo preparado com muito carinho!\n\n🔥 Nossa cozinha está trabalhando para você!`,
      'pronto': `✅ *Pedido Pronto!*\n\nSeu pedido ${pedidoId} está pronto!\n\n🚚 Em breve sairá para entrega!`,
      'saiu_entrega': `🚚 *Saiu para entrega!*\n\nSeu pedido ${pedidoId} saiu para entrega!\n\n📍 Nosso entregador está a caminho!`,
      'entregue': `🎉 *Pedido Entregue!*\n\nSeu pedido ${pedidoId} foi entregue com sucesso!\n\n⭐ Que tal avaliar sua experiência?`,
      'cancelado': `❌ *Pedido Cancelado*\n\nInfelizmente seu pedido ${pedidoId} foi cancelado.\n\n💬 Entre em contato conosco para mais informações.`
    };

    return statusMessages[status as keyof typeof statusMessages] || 
           `📱 Status do pedido ${pedidoId} atualizado para: ${status}`;
  }
}

export const menuAiService = new MenuAiService();
export type { MenuAiConfig };
