export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: 'cliente' | 'restaurante' | 'entregador';
  telefone?: string;
  endereco?: string;
}

export interface Produto {
  id: string;
  restauranteId: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  disponivel: boolean;
}

export interface Restaurante {
  id: string;
  nome: string;
  categoria: string;
  cidade?: string;
  avaliacao: number;
  tempoEntrega: string;
  taxaEntrega: number;
  imagem: string;
  descricao: string;
}

export interface Entregador {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  veiculo: string;
  placa: string;
  disponivel: boolean;
}

export interface Pedido {
  id: string;
  clienteId: string;
  restauranteId: string;
  entregadorId?: string;
  itens: Array<{
    produtoId: string;
    nome: string;
    preco: number;
    quantidade: number;
  }>;
  total: number;
  status: 'pendente' | 'confirmado' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
  endereco: string;
  formaPagamento: 'pix' | 'cartao';
  data: string;
}

export const restaurantes: Restaurante[] = [
  {
    id: "1",
    nome: "Pizzaria do Mario",
    categoria: "Pizzaria",
    cidade: "São Paulo",
    avaliacao: 4.5,
    tempoEntrega: "30-45 min",
    taxaEntrega: 5.99,
    imagem: "/placeholder.svg",
    descricao: "As melhores pizzas artesanais da cidade com massa fresca e ingredientes selecionados."
  },
  {
    id: "2", 
    nome: "Sushi Express",
    categoria: "Japonesa",
    cidade: "São Paulo",
    avaliacao: 4.8,
    tempoEntrega: "25-40 min",
    taxaEntrega: 0,
    imagem: "/placeholder.svg",
    descricao: "Sushi fresco e sashimi de qualidade premium. Entrega rápida e gratuita."
  },
  {
    id: "3",
    nome: "Açaí da Praia",
    categoria: "Açaí",
    cidade: "Rio de Janeiro",
    avaliacao: 4.6,
    tempoEntrega: "15-25 min", 
    taxaEntrega: 3.50,
    imagem: "/placeholder.svg",
    descricao: "Açaí natural e cremoso com os melhores acompanhamentos. Direto da praia!"
  },
  {
    id: "4",
    nome: "Gelato Italiano",
    categoria: "Sorveteria",
    cidade: "São Paulo",
    avaliacao: 4.7,
    tempoEntrega: "20-30 min",
    taxaEntrega: 4.99,
    imagem: "/placeholder.svg",
    descricao: "Gelatos artesanais com receitas tradicionais italianas e sabores únicos."
  },
  {
    id: "5",
    nome: "Cantina da Nonna",
    categoria: "Italiana",
    cidade: "Belo Horizonte",
    avaliacao: 4.9,
    tempoEntrega: "35-50 min",
    taxaEntrega: 6.99,
    imagem: "/placeholder.svg",
    descricao: "Massas caseiras e molhos tradicionais da Itália. Uma experiência autêntica."
  },
  {
    id: "6",
    nome: "Burguer King Size",
    categoria: "Hambúrguer", 
    cidade: "São Paulo",
    avaliacao: 4.3,
    tempoEntrega: "25-35 min",
    taxaEntrega: 0,
    imagem: "/placeholder.svg",
    descricao: "Hambúrguers gigantes com ingredientes frescos e batatas crocantes."
  },
  {
    id: "7",
    nome: "Tacos Mexicanos",
    categoria: "Mexicana",
    cidade: "Rio de Janeiro", 
    avaliacao: 4.4,
    tempoEntrega: "30-40 min",
    taxaEntrega: 5.50,
    imagem: "/placeholder.svg",
    descricao: "Autêntica comida mexicana com tacos, burritos e nachos apimentados."
  },
  {
    id: "8",
    nome: "Feijoada da Casa",
    categoria: "Brasileira",
    cidade: "Salvador",
    avaliacao: 4.8,
    tempoEntrega: "40-55 min",
    taxaEntrega: 7.99,
    imagem: "/placeholder.svg",
    descricao: "Feijoada completa e pratos típicos brasileiros feitos com amor e tradição."
  },
  {
    id: "9",
    nome: "Lanchonete do João",
    categoria: "Lanches",
    cidade: "Brasília",
    avaliacao: 4.2,
    tempoEntrega: "20-30 min",
    taxaEntrega: 3.99,
    imagem: "/placeholder.svg",
    descricao: "Lanches rápidos, sanduíches naturais e sucos frescos para o dia a dia."
  },
  {
    id: "10",
    nome: "Açaí Tropical",
    categoria: "Açaí",
    cidade: "Fortaleza",
    avaliacao: 4.5,
    tempoEntrega: "15-25 min",
    taxaEntrega: 2.99,
    imagem: "/placeholder.svg",
    descricao: "Açaí gelado e refrescante com frutas tropicais e granola crocante."
  }
];

export const produtos = [
  {
    id: "1",
    restauranteId: "1",
    nome: "Pizza Margherita",
    descricao: "A clássica pizza com molho de tomate, mussarela e manjericão fresco.",
    preco: 39.90,
    categoria: "Pizzas",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "2",
    restauranteId: "1",
    nome: "Pizza Pepperoni",
    descricao: "Pizza com molho de tomate, mussarela e pepperoni.",
    preco: 44.90,
    categoria: "Pizzas",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "3",
    restauranteId: "2",
    nome: "Sushi Califórnia",
    descricao: "Enrolado de sushi com kani, abacate e pepino.",
    preco: 29.90,
    categoria: "Sushis",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "4",
    restauranteId: "2",
    nome: "Sashimi Salmão",
    descricao: "Fatias frescas de salmão.",
    preco: 34.90,
    categoria: "Sashimis",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "5",
    restauranteId: "3",
    nome: "Açaí Completo",
    descricao: "Açaí com banana, granola e leite condensado.",
    preco: 24.90,
    categoria: "Açaí",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "6",
    restauranteId: "3",
    nome: "Açaí com Morango",
    descricao: "Açaí com morangos frescos e calda de chocolate.",
    preco: 27.90,
    categoria: "Açaí",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "7",
    restauranteId: "4",
    nome: "Gelato Pistache",
    descricao: "Gelato italiano de pistache.",
    preco: 19.90,
    categoria: "Gelatos",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "8",
    restauranteId: "4",
    nome: "Gelato Chocolate",
    descricao: "Gelato italiano de chocolate belga.",
    preco: 22.90,
    categoria: "Gelatos",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "9",
    restauranteId: "5",
    nome: "Spaghetti Carbonara",
    descricao: "Spaghetti com molho cremoso de ovos, bacon e queijo parmesão.",
    preco: 49.90,
    categoria: "Massas",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "10",
    restauranteId: "5",
    nome: "Lasanha Bolonhesa",
    descricao: "Lasanha com molho bolonhesa e queijo mussarela.",
    preco: 54.90,
    categoria: "Massas",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "11",
    restauranteId: "6",
    nome: "Burger Clássico",
    descricao: "Hambúrguer com carne, queijo, alface, tomate e molho especial.",
    preco: 34.90,
    categoria: "Hambúrgueres",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "12",
    restauranteId: "6",
    nome: "Burger Bacon",
    descricao: "Hambúrguer com carne, queijo, bacon e cebola caramelizada.",
    preco: 39.90,
    categoria: "Hambúrgueres",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "13",
    restauranteId: "7",
    nome: "Taco de Carne",
    descricao: "Taco com carne desfiada, guacamole e pico de gallo.",
    preco: 29.90,
    categoria: "Tacos",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "14",
    restauranteId: "7",
    nome: "Burrito Frango",
    descricao: "Burrito com frango, arroz, feijão e queijo.",
    preco: 34.90,
    categoria: "Burritos",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "15",
    restauranteId: "8",
    nome: "Feijoada",
    descricao: "Feijoada completa com arroz, couve, farofa e laranja.",
    preco: 59.90,
    categoria: "Pratos",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "16",
    restauranteId: "8",
    nome: "Moqueca",
    descricao: "Moqueca de peixe com arroz e pirão.",
    preco: 64.90,
    categoria: "Pratos",
    imagem: "/placeholder.svg",
    disponivel: true
  },
    {
    id: "17",
    restauranteId: "9",
    nome: "X-Salada",
    descricao: "Pão, hambúrguer, queijo, alface e tomate.",
    preco: 19.90,
    categoria: "Lanches",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "18",
    restauranteId: "9",
    nome: "Misto Quente",
    descricao: "Pão de forma com queijo e presunto.",
    preco: 14.90,
    categoria: "Lanches",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "19",
    restauranteId: "10",
    nome: "Açaí Turbinado",
    descricao: "Açaí com banana, morango, granola, leite condensado e mel.",
    preco: 29.90,
    categoria: "Açaí",
    imagem: "/placeholder.svg",
    disponivel: true
  },
  {
    id: "20",
    restauranteId: "10",
    nome: "Açaí Fit",
    descricao: "Açaí com banana, granola e sem adição de açúcar.",
    preco: 24.90,
    categoria: "Açaí",
    imagem: "/placeholder.svg",
    disponivel: true
  },
];

export const entregadores = [
  {
    id: "1",
    nome: "João Entregador",
    email: "joao.entregador@email.com",
    telefone: "11999999999",
    veiculo: "Moto",
    placa: "ABC1234",
    disponivel: true
  },
  {
    id: "2",
    nome: "Maria Entregadora",
    email: "maria.entregadora@email.com",
    telefone: "21999999999",
    veiculo: "Bike",
    placa: "N/A",
    disponivel: true
  },
  {
    id: "3",
    nome: "Carlos Entregador",
    email: "carlos.entregador@email.com",
    telefone: "31999999999",
    veiculo: "Carro",
    placa: "DEF5678",
    disponivel: false
  }
];

export const pedidos = [
  {
    id: "1",
    clienteId: "1",
    restauranteId: "1",
    entregadorId: "1",
    itens: [
      { produtoId: "1", nome: "Pizza Margherita", preco: 39.90, quantidade: 1 },
      { produtoId: "2", nome: "Pizza Pepperoni", preco: 44.90, quantidade: 1 }
    ],
    total: 84.80,
    status: "entregue",
    endereco: "Rua dos Bobos, 0",
    formaPagamento: "cartao",
    data: "2024-08-01"
  },
  {
    id: "2",
    clienteId: "2",
    restauranteId: "2",
    entregadorId: "2",
    itens: [
      { produtoId: "3", nome: "Sushi Califórnia", preco: 29.90, quantidade: 2 }
    ],
    total: 59.80,
    status: "entregue",
    endereco: "Avenida Brasil, 123",
    formaPagamento: "pix",
    data: "2024-08-02"
  },
  {
    id: "3",
    clienteId: "1",
    restauranteId: "3",
    itens: [
      { produtoId: "5", nome: "Açaí Completo", preco: 24.90, quantidade: 1 }
    ],
    total: 24.90,
    status: "pendente",
    endereco: "Rua dos Bobos, 0",
    formaPagamento: "cartao",
    data: "2024-08-03"
  }
];

export const mockUsers = [
  {
    id: '1',
    nome: 'Cliente 1',
    email: 'cliente1@example.com',
    senha: 'senha123',
    tipo: 'cliente',
    telefone: '11999999999',
    endereco: 'Rua A, 123'
  },
  {
    id: '2',
    nome: 'Restaurante 1',
    email: 'restaurante1@example.com',
    senha: 'senha456',
    tipo: 'restaurante',
    telefone: '11888888888',
    endereco: 'Rua B, 456'
  },
  {
    id: '3',
    nome: 'Entregador 1',
    email: 'entregador1@example.com',
    senha: 'senha789',
    tipo: 'entregador',
    telefone: '11777777777'
  },
];
