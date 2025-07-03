
export interface PagamentoSimulado {
  id: string;
  plano: string;
  valor: number;
  restaurante: string;
  status: 'pendente' | 'pago' | 'falhado';
  dataCriacao: string;
  dataVencimento: string;
  pixCode?: string;
}

class PagamentoService {
  private pagamentos: PagamentoSimulado[] = [];

  constructor() {
    this.carregarPagamentos();
  }

  private carregarPagamentos() {
    const pagamentosSalvos = localStorage.getItem('zdelivery_pagamentos');
    if (pagamentosSalvos) {
      this.pagamentos = JSON.parse(pagamentosSalvos);
    }
  }

  private salvarPagamentos() {
    localStorage.setItem('zdelivery_pagamentos', JSON.stringify(this.pagamentos));
  }

  criarPagamentoPIX(plano: string, valor: number, restaurante: string = 'Novo Restaurante'): PagamentoSimulado {
    const pagamento: PagamentoSimulado = {
      id: `PAG${Date.now()}`,
      plano,
      valor,
      restaurante,
      status: 'pendente',
      dataCriacao: new Date().toISOString(),
      dataVencimento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      pixCode: `00020126360014BR.GOV.BCB.PIX0114+5511999999999${Date.now()}6304`
    };

    this.pagamentos.push(pagamento);
    this.salvarPagamentos();
    return pagamento;
  }

  simularPagamento(pagamentoId: string): boolean {
    const index = this.pagamentos.findIndex(p => p.id === pagamentoId);
    if (index !== -1) {
      this.pagamentos[index].status = 'pago';
      this.salvarPagamentos();
      return true;
    }
    return false;
  }

  getPagamentos(): PagamentoSimulado[] {
    return [...this.pagamentos];
  }

  getPagamentosPorStatus(status: PagamentoSimulado['status']): PagamentoSimulado[] {
    return this.pagamentos.filter(p => p.status === status);
  }
}

export const pagamentoService = new PagamentoService();
