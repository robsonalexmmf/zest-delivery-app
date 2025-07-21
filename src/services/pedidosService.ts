
export interface ItemPedido {
  nome: string;
  quantidade: number;
  preco: number;
}

export interface Pedido {
  id: string;
  cliente: {
    nome: string;
    endereco: string;
    telefone: string;
  };
  restaurante: {
    nome: string;
    endereco: string;
    telefone: string;
  };
  itens: ItemPedido[];
  total: number;
  status: 'pendente' | 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
  data: string;
  hora: string;
  entregador?: {
    nome: string;
    telefone: string;
  };
  observacoes?: string;
  metodoPagamento: 'dinheiro' | 'cartao' | 'pix';
  valorEntrega: number;
  tempoEstimado: string;
  avaliado?: boolean;
}

class PedidosService {
  private listeners: Array<(pedidos: Pedido[]) => void> = [];
  private pedidos: Pedido[] = [];

  constructor() {
    this.carregarPedidos();
  }

  private carregarPedidos() {
    const pedidosSalvos = localStorage.getItem('zdelivery_pedidos');
    console.log('Pedidos salvos no localStorage:', pedidosSalvos);
    
    if (pedidosSalvos) {
      this.pedidos = JSON.parse(pedidosSalvos);
      console.log('Pedidos carregados:', this.pedidos);
    } else {
      // Não criar pedidos mockados automaticamente
      this.pedidos = [];
      this.salvarPedidos();
    }
  }

  private salvarPedidos() {
    localStorage.setItem('zdelivery_pedidos', JSON.stringify(this.pedidos));
    this.notificarListeners();
  }

  private notificarListeners() {
    this.listeners.forEach(listener => listener([...this.pedidos]));
  }

  subscribe(listener: (pedidos: Pedido[]) => void) {
    this.listeners.push(listener);
    listener([...this.pedidos]);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getPedidos(): Pedido[] {
    return [...this.pedidos];
  }

  getPedidosPorRestaurante(restauranteNome: string): Pedido[] {
    return this.pedidos.filter(p => p.restaurante.nome === restauranteNome);
  }

  getPedidosPorCliente(clienteNome: string): Pedido[] {
    return this.pedidos.filter(p => p.cliente.nome === clienteNome);
  }

  getPedidosDisponiveis(): Pedido[] {
    return this.pedidos.filter(p => p.status === 'pronto' && !p.entregador);
  }

  getPedidosDoEntregador(entregadorNome: string): Pedido[] {
    return this.pedidos.filter(p => p.entregador?.nome === entregadorNome);
  }

  atualizarStatusPedido(pedidoId: string, novoStatus: Pedido['status'], entregador?: { nome: string; telefone: string }) {
    console.log(`Atualizando pedido ${pedidoId} para status ${novoStatus}`);
    const pedidoIndex = this.pedidos.findIndex(p => p.id === pedidoId);
    if (pedidoIndex !== -1) {
      const pedidoAnterior = {...this.pedidos[pedidoIndex]};
      this.pedidos[pedidoIndex] = {
        ...this.pedidos[pedidoIndex],
        status: novoStatus,
        ...(entregador && { entregador })
      };
      console.log(`Pedido atualizado de ${pedidoAnterior.status} para ${novoStatus}`);
      this.salvarPedidos();
      return true;
    }
    console.log(`Pedido ${pedidoId} não encontrado`);
    return false;
  }

  aceitarEntrega(pedidoId: string, entregador: { nome: string; telefone: string }) {
    return this.atualizarStatusPedido(pedidoId, 'saiu_para_entrega', entregador);
  }

  criarPedido(pedido: Omit<Pedido, 'id'>): string {
    const novoPedido: Pedido = {
      ...pedido,
      id: `PED${Date.now()}`
    };
    console.log('Criando novo pedido:', novoPedido);
    this.pedidos.push(novoPedido);
    this.salvarPedidos();
    return novoPedido.id;
  }

  marcarComoAvaliado(pedidoId: string): boolean {
    const pedidoIndex = this.pedidos.findIndex(p => p.id === pedidoId);
    if (pedidoIndex !== -1) {
      this.pedidos[pedidoIndex] = {
        ...this.pedidos[pedidoIndex],
        avaliado: true
      };
      this.salvarPedidos();
      return true;
    }
    return false;
  }
}

export const pedidosService = new PedidosService();
