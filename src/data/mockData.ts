
// Dados mockados para demonstração do sistema Z Delivery

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'cliente' | 'restaurante' | 'entregador';
  endereco?: string;
  avaliacao?: number;
}

export interface Restaurante {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  imagem: string;
  avaliacao: number;
  tempoEntrega: string;
  taxaEntrega: number;
  endereco: string;
  ativo: boolean;
}

export interface Produto {
  id: string;
  restauranteId: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  disponivel: boolean;
}

export interface Pedido {
  id: string;
  clienteId: string;
  restauranteId: string;
  entregadorId?: string;
  produtos: Array<{
    produtoId: string;
    nome: string;
    quantidade: number;
    preco: number;
  }>;
  status: 'aguardando' | 'aceito' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
  total: number;
  taxaEntrega: number;
  endereco: string;
  pagamento: 'pix' | 'cartao';
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Dados mockados
export const usuarios: Usuario[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'cliente@test.com',
    telefone: '(11) 99999-9999',
    tipo: 'cliente',
    endereco: 'Rua das Flores, 123 - São Paulo/SP'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@test.com',
    telefone: '(11) 88888-8888',
    tipo: 'cliente',
    endereco: 'Av. Paulista, 456 - São Paulo/SP'
  },
  {
    id: '3',
    nome: 'Pizza Deliciosa',
    email: 'restaurante@test.com',
    telefone: '(11) 77777-7777',
    tipo: 'restaurante',
    endereco: 'Rua da Pizza, 789 - São Paulo/SP'
  },
  {
    id: '4',
    nome: 'Carlos Entregador',
    email: 'entregador@test.com',
    telefone: '(11) 66666-6666',
    tipo: 'entregador',
    avaliacao: 4.8
  }
];

export const restaurantes: Restaurante[] = [
  {
    id: '1',
    nome: 'Pizza Deliciosa',
    categoria: 'Pizza',
    descricao: 'As melhores pizzas da cidade com ingredientes frescos e massa artesanal',
    imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    avaliacao: 4.5,
    tempoEntrega: '30-45 min',
    taxaEntrega: 5.99,
    endereco: 'Rua da Pizza, 789',
    ativo: true
  },
  {
    id: '2',
    nome: 'Burger House',
    categoria: 'Hambúrguer',
    descricao: 'Hambúrgueres artesanais com carnes selecionadas e pães frescos',
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    avaliacao: 4.3,
    tempoEntrega: '25-40 min',
    taxaEntrega: 4.99,
    endereco: 'Av. dos Hambúrgueres, 456',
    ativo: true
  },
  {
    id: '3',
    nome: 'Sushi Premium',
    categoria: 'Japonesa',
    descricao: 'Sushi fresco e sashimi com ingredientes importados do Japão',
    imagem: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    avaliacao: 4.7,
    tempoEntrega: '40-60 min',
    taxaEntrega: 0,
    endereco: 'Rua do Sushi, 321',
    ativo: true
  },
  {
    id: '4',
    nome: 'Pasta & Amore',
    categoria: 'Italiana',
    descricao: 'Massas artesanais e molhos tradicionais da Itália',
    imagem: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    avaliacao: 4.4,
    tempoEntrega: '35-50 min',
    taxaEntrega: 6.99,
    endereco: 'Praça da Itália, 654',
    ativo: true
  },
  {
    id: '5',
    nome: 'Açaí da Praia',
    categoria: 'Açaí',
    descricao: 'Açaí natural com frutas frescas e acompanhamentos variados',
    imagem: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
    avaliacao: 4.2,
    tempoEntrega: '15-25 min',
    taxaEntrega: 3.99,
    endereco: 'Av. da Praia, 987',
    ativo: true
  },
  {
    id: '6',
    nome: 'Churrasco Gaúcho',
    categoria: 'Churrasco',
    descricao: 'Carnes nobres grelhadas no estilo tradicional gaúcho',
    imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    avaliacao: 4.6,
    tempoEntrega: '45-60 min',
    taxaEntrega: 8.99,
    endereco: 'Rua do Pampa, 147',
    ativo: true
  },
  {
    id: '7',
    nome: 'Tacos Mexicanos',
    categoria: 'Mexicana',
    descricao: 'Tacos autênticos com temperos e ingredientes mexicanos',
    imagem: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
    avaliacao: 4.1,
    tempoEntrega: '20-35 min',
    taxaEntrega: 4.99,
    endereco: 'Rua do México, 258',
    ativo: true
  },
  {
    id: '8',
    nome: 'Saladas Naturais',
    categoria: 'Saudável',
    descricao: 'Saladas frescas e nutritivas com ingredientes orgânicos',
    imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    avaliacao: 4.3,
    tempoEntrega: '20-30 min',
    taxaEntrega: 0,
    endereco: 'Av. da Saúde, 369',
    ativo: true
  },
  {
    id: '9',
    nome: 'Doces & Sobremesas',
    categoria: 'Sobremesa',
    descricao: 'Doces artesanais e sobremesas irresistíveis',
    imagem: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    avaliacao: 4.5,
    tempoEntrega: '25-40 min',
    taxaEntrega: 5.99,
    endereco: 'Rua dos Doces, 741',
    ativo: true
  },
  {
    id: '10',
    nome: 'Frango Crocante',
    categoria: 'Frango',
    descricao: 'Frango frito crocante com temperos especiais',
    imagem: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
    avaliacao: 4.0,
    tempoEntrega: '30-45 min',
    taxaEntrega: 6.99,
    endereco: 'Av. do Frango, 852',
    ativo: true
  }
];

export const produtos: Produto[] = [
  // Pizza Deliciosa (restauranteId: '1')
  {
    id: '1',
    restauranteId: '1',
    nome: 'Pizza Margherita',
    descricao: 'Molho de tomate, mussarela, manjericão fresco',
    preco: 35.90,
    imagem: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
    categoria: 'Pizza',
    disponivel: true
  },
  {
    id: '2',
    restauranteId: '1',
    nome: 'Pizza Calabresa',
    descricao: 'Molho de tomate, mussarela, calabresa, cebola',
    preco: 39.90,
    imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    categoria: 'Pizza',
    disponivel: true
  },
  // Burger House (restauranteId: '2')
  {
    id: '3',
    restauranteId: '2',
    nome: 'Classic Burger',
    descricao: 'Pão brioche, hambúrguer 180g, queijo, alface, tomate',
    preco: 28.90,
    imagem: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
    categoria: 'Hambúrguer',
    disponivel: true
  },
  {
    id: '4',
    restauranteId: '2',
    nome: 'Bacon Burger',
    descricao: 'Pão brioche, hambúrguer 180g, bacon, queijo cheddar',
    preco: 32.90,
    imagem: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300&h=200&fit=crop',
    categoria: 'Hambúrguer',
    disponivel: true
  },
  {
    id: '5',
    restauranteId: '2',
    nome: 'Batata Frita',
    descricao: 'Batatas crocantes temperadas com sal e ervas',
    preco: 12.90,
    imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
    categoria: 'Acompanhamento',
    disponivel: true
  },
  // Sushi Premium (restauranteId: '3')
  {
    id: '6',
    restauranteId: '3',
    nome: 'Combo Sashimi',
    descricao: '15 peças de sashimi variado (salmão, atum, peixe branco)',
    preco: 45.90,
    imagem: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop',
    categoria: 'Sashimi',
    disponivel: true
  },
  {
    id: '7',
    restauranteId: '3',
    nome: 'Hot Roll Philadelphia',
    descricao: 'Salmão, cream cheese, empanado e frito',
    preco: 38.90,
    imagem: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
    categoria: 'Hot Roll',
    disponivel: true
  },
  // Outros produtos para diferentes restaurantes...
  {
    id: '8',
    restauranteId: '4',
    nome: 'Spaghetti Carbonara',
    descricao: 'Massa fresca, bacon, ovos, queijo parmesão',
    preco: 42.90,
    imagem: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=300&h=200&fit=crop',
    categoria: 'Massa',
    disponivel: true
  },
  {
    id: '9',
    restauranteId: '5',
    nome: 'Açaí 500ml',
    descricao: 'Açaí puro com granola, banana e mel',
    preco: 18.90,
    imagem: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=200&fit=crop',
    categoria: 'Açaí',
    disponivel: true
  },
  {
    id: '10',
    restauranteId: '6',
    nome: 'Picanha Grelhada',
    descricao: 'Picanha 300g grelhada com farofa e vinagrete',
    preco: 52.90,
    imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop',
    categoria: 'Carne',
    disponivel: true
  }
];

export const pedidos: Pedido[] = [
  {
    id: '1',
    clienteId: '1',
    restauranteId: '1',
    entregadorId: '4',
    produtos: [
      { produtoId: '1', nome: 'Pizza Margherita', quantidade: 1, preco: 35.90 },
      { produtoId: '2', nome: 'Pizza Calabresa', quantidade: 1, preco: 39.90 }
    ],
    status: 'preparando',
    total: 81.89,
    taxaEntrega: 5.99,
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    pagamento: 'pix',
    observacoes: 'Sem cebola na calabresa',
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString()
  }
];

export const entregadores = [
  {
    id: '4',
    nome: 'Carlos Entregador',
    email: 'entregador@test.com',
    telefone: '(11) 66666-6666',
    avaliacao: 4.8,
    veiculo: 'Moto Honda CG 160',
    disponivel: true
  },
  {
    id: '5',
    nome: 'Ana Delivery',
    email: 'ana@delivery.com',
    telefone: '(11) 55555-5555',
    avaliacao: 4.6,
    veiculo: 'Bicicleta Elétrica',
    disponivel: true
  }
];
