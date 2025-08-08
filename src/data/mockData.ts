import pizzaNapolitana from '@/assets/pizza-napolitana.jpg';
import aguaMineral from '@/assets/agua-mineral.jpg';
import bruschettaItaliana from '@/assets/bruschetta-italiana.jpg';
import paoAlhoEspecial from '@/assets/pao-alho-especial.jpg';

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
    avaliacao: 4.8,
    tempoEntrega: "30-45 min",
    taxaEntrega: 5.99,
    imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    descricao: "As melhores pizzas artesanais da cidade com massa fresca e ingredientes selecionados. Tradição familiar há mais de 20 anos."
  },
];

export const produtos = [
  // Pizzas Clássicas
  { 
    id: "1", 
    restauranteId: "1", 
    nome: "Pizza Margherita", 
    descricao: "A clássica pizza italiana com molho de tomate San Marzano, mussarela de búfala, manjericão fresco e azeite extra virgem", 
    preco: 42.90, 
    categoria: "Pizzas Clássicas", 
    imagem: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "2", 
    restauranteId: "1", 
    nome: "Pizza Pepperoni", 
    descricao: "Pizza com generosa cobertura de pepperoni italiano, mussarela derretida e molho de tomate temperado", 
    preco: 46.90, 
    categoria: "Pizzas Clássicas", 
    imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "3", 
    restauranteId: "1", 
    nome: "Pizza Quatro Queijos", 
    descricao: "Combinação perfeita de mussarela, parmesão, gorgonzola e provolone sobre base de molho branco", 
    preco: 48.90, 
    categoria: "Pizzas Clássicas", 
    imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "4", 
    restauranteId: "1", 
    nome: "Pizza Napolitana", 
    descricao: "Molho de tomate, mussarela, fatias de tomate fresco, anchovas, azeitonas pretas e orégano", 
    preco: 44.90, 
    categoria: "Pizzas Clássicas", 
    imagem: pizzaNapolitana, 
    disponivel: true 
  },
  { 
    id: "5", 
    restauranteId: "1", 
    nome: "Pizza Calabresa", 
    descricao: "Fatias de calabresa defumada, cebola caramelizada, mussarela e molho de tomate especial", 
    preco: 45.90, 
    categoria: "Pizzas Clássicas", 
    imagem: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },

  // Pizzas Especiais
  { 
    id: "6", 
    restauranteId: "1", 
    nome: "Pizza Suprema", 
    descricao: "Pizza completa com pepperoni, calabresa, champignon, pimentão, cebola, azeitona e mussarela", 
    preco: 52.90, 
    categoria: "Pizzas Especiais", 
    imagem: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "7", 
    restauranteId: "1", 
    nome: "Pizza Bacon & Champignon", 
    descricao: "Bacon crocante, champignon frescos, cebola roxa, mussarela e molho barbecue artesanal", 
    preco: 49.90, 
    categoria: "Pizzas Especiais", 
    imagem: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "8", 
    restauranteId: "1", 
    nome: "Pizza Frango Catupiry", 
    descricao: "Frango desfiado temperado, catupiry original, milho, azeitona verde e mussarela", 
    preco: 47.90, 
    categoria: "Pizzas Especiais", 
    imagem: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "9", 
    restauranteId: "1", 
    nome: "Pizza Portuguesa", 
    descricao: "Presunto, ovos, cebola, azeitona verde, ervilha, mussarela e molho de tomate", 
    preco: 46.90, 
    categoria: "Pizzas Especiais", 
    imagem: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "10", 
    restauranteId: "1", 
    nome: "Pizza Vegetariana", 
    descricao: "Abobrinha, berinjela, tomate cereja, rúcula, pimentão amarelo e queijo de cabra", 
    preco: 44.90, 
    categoria: "Pizzas Especiais", 
    imagem: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },

  // Pizzas Gourmet
  { 
    id: "11", 
    restauranteId: "1", 
    nome: "Pizza Trufa Negra", 
    descricao: "Molho branco trufado, cogumelos porcini, rúcula, parmesão e lascas de trufa negra", 
    preco: 89.90, 
    categoria: "Pizzas Gourmet", 
    imagem: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "12", 
    restauranteId: "1", 
    nome: "Pizza Salmão Defumado", 
    descricao: "Cream cheese, salmão defumado, alcaparras, cebola roxa e endro fresco", 
    preco: 74.90, 
    categoria: "Pizzas Gourmet", 
    imagem: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "13", 
    restauranteId: "1", 
    nome: "Pizza Prosciutto & Figo", 
    descricao: "Prosciutto di Parma, figos frescos, gorgonzola, rúcula e mel de lavanda", 
    preco: 67.90, 
    categoria: "Pizzas Gourmet", 
    imagem: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "14", 
    restauranteId: "1", 
    nome: "Pizza Burrata & Tomate Confitado", 
    descricao: "Burrata cremosa, tomates confitados, pesto de manjericão e azeite extravirgem", 
    preco: 62.90, 
    categoria: "Pizzas Gourmet", 
    imagem: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "15", 
    restauranteId: "1", 
    nome: "Pizza Camarão Alho & Óleo", 
    descricao: "Camarões grandes refogados no alho e óleo, tomate cereja, rúcula e limão siciliano", 
    preco: 69.90, 
    categoria: "Pizzas Gourmet", 
    imagem: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },

  // Pizzas Doces
  { 
    id: "16", 
    restauranteId: "1", 
    nome: "Pizza Chocolate com Morango", 
    descricao: "Nutella, morangos frescos, chocolate branco derretido e açúcar de confeiteiro", 
    preco: 39.90, 
    categoria: "Pizzas Doces", 
    imagem: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "17", 
    restauranteId: "1", 
    nome: "Pizza Banana & Canela", 
    descricao: "Banana caramelizada, canela em pó, leite condensado e açúcar cristal", 
    preco: 34.90, 
    categoria: "Pizzas Doces", 
    imagem: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "18", 
    restauranteId: "1", 
    nome: "Pizza Romeu & Julieta", 
    descricao: "Queijo minas frescal, goiabada cremosa e pitadas de canela", 
    preco: 36.90, 
    categoria: "Pizzas Doces", 
    imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },

  // Bebidas
  { 
    id: "19", 
    restauranteId: "1", 
    nome: "Refrigerante Lata 350ml", 
    descricao: "Coca-Cola, Guaraná Antarctica, Fanta Laranja ou Sprite bem gelados", 
    preco: 6.50, 
    categoria: "Bebidas", 
    imagem: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "20", 
    restauranteId: "1", 
    nome: "Suco Natural 500ml", 
    descricao: "Laranja, limão, acerola ou maracujá fresquinhos sem conservantes", 
    preco: 9.90, 
    categoria: "Bebidas", 
    imagem: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "21", 
    restauranteId: "1", 
    nome: "Água Mineral 500ml", 
    descricao: "Água mineral natural gelada para acompanhar sua refeição", 
    preco: 4.50, 
    categoria: "Bebidas", 
    imagem: aguaMineral, 
    disponivel: true 
  },
  { 
    id: "22", 
    restauranteId: "1", 
    nome: "Cerveja Long Neck", 
    descricao: "Heineken, Stella Artois ou Budweiser bem geladas (269ml)", 
    preco: 12.90, 
    categoria: "Bebidas", 
    imagem: "https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },

  // Entradas
  { 
    id: "23", 
    restauranteId: "1", 
    nome: "Bruschetta Italiana", 
    descricao: "Pão italiano tostado com tomate, manjericão, alho e azeite extravirgem (4 unidades)", 
    preco: 18.90, 
    categoria: "Entradas", 
    imagem: bruschettaItaliana, 
    disponivel: true 
  },
  { 
    id: "24", 
    restauranteId: "1", 
    nome: "Antipasto da Casa", 
    descricao: "Seleção de frios, queijos, azeitonas, tomate seco e pães artesanais", 
    preco: 32.90, 
    categoria: "Entradas", 
    imagem: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "25", 
    restauranteId: "1", 
    nome: "Bolinho de Queijo (8 unid)", 
    descricao: "Bolinhos dourados e crocantes recheados com queijo derretido", 
    preco: 22.90, 
    categoria: "Entradas", 
    imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "26", 
    restauranteId: "1", 
    nome: "Pão de Alho Especial", 
    descricao: "Pão francês recheado com alho, ervas finas, manteiga e queijo gratinado", 
    preco: 16.90, 
    categoria: "Entradas", 
    imagem: paoAlhoEspecial, 
    disponivel: true 
  },

  // Sobremesas
  { 
    id: "27", 
    restauranteId: "1", 
    nome: "Tiramisù da Casa", 
    descricao: "Clássica sobremesa italiana com biscoito champagne, café, mascarpone e cacau", 
    preco: 24.90, 
    categoria: "Sobremesas", 
    imagem: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "28", 
    restauranteId: "1", 
    nome: "Gelato Artesanal", 
    descricao: "Baunilha, chocolate, morango ou pistache - 3 bolas com calda especial", 
    preco: 19.90, 
    categoria: "Sobremesas", 
    imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "29", 
    restauranteId: "1", 
    nome: "Cannoli Siciliano", 
    descricao: "Massa crocante recheada com ricota doce, gotas de chocolate e pistache (2 unidades)", 
    preco: 18.90, 
    categoria: "Sobremesas", 
    imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  },
  { 
    id: "30", 
    restauranteId: "1", 
    nome: "Petit Gateau", 
    descricao: "Bolinho de chocolate com recheio cremoso, acompanha sorvete de baunilha", 
    preco: 26.90, 
    categoria: "Sobremesas", 
    imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
    disponivel: true 
  }
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
    nome: 'Pizzaria do Mario',
    email: 'restaurante@test.com',
    senha: '123456',
    tipo: 'restaurante',
    telefone: '11888888888',
    endereco: 'Rua da Pizza, 123 - São Paulo, SP'
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
