
-- Inserir usuários de teste diretamente na tabela profiles
-- Nota: Normalmente isso seria feito através do signup, mas para testes rápidos faremos diretamente

-- Inserir profiles de teste (usando UUIDs fixos para facilitar referências)
INSERT INTO public.profiles (id, nome, email, tipo, telefone, endereco) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Cliente Teste', 'cliente@test.com', 'cliente', '(11) 99999-1111', 'Rua do Cliente, 123'),
  ('22222222-2222-2222-2222-222222222222', 'Restaurante Teste', 'restaurante@test.com', 'restaurante', '(11) 99999-2222', 'Rua do Restaurante, 456'),
  ('33333333-3333-3333-3333-333333333333', 'Entregador Teste', 'entregador@test.com', 'entregador', '(11) 99999-3333', 'Rua do Entregador, 789'),
  ('44444444-4444-4444-4444-444444444444', 'Admin Teste', 'admin@test.com', 'admin', '(11) 99999-4444', 'Rua do Admin, 101')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  tipo = EXCLUDED.tipo,
  telefone = EXCLUDED.telefone,
  endereco = EXCLUDED.endereco;

-- Inserir restaurante de teste
INSERT INTO public.restaurantes (id, user_id, nome, categoria, cidade, avaliacao, tempo_entrega, taxa_entrega, descricao, disponivel) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Pizza Deliciosa', 'Pizzaria', 'São Paulo', 4.5, '30-45 min', 5.90, 'As melhores pizzas da cidade!', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  categoria = EXCLUDED.categoria,
  cidade = EXCLUDED.cidade,
  avaliacao = EXCLUDED.avaliacao,
  tempo_entrega = EXCLUDED.tempo_entrega,
  taxa_entrega = EXCLUDED.taxa_entrega,
  descricao = EXCLUDED.descricao,
  disponivel = EXCLUDED.disponivel;

-- Inserir alguns produtos de teste
INSERT INTO public.produtos (id, restaurante_id, nome, descricao, preco, categoria, disponivel) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pizza Margherita', 'Molho de tomate, mussarela e manjericão', 35.90, 'Pizza', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pizza Calabresa', 'Molho de tomate, mussarela e calabresa', 38.90, 'Pizza', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Refrigerante Lata', 'Coca-Cola 350ml', 5.50, 'Bebida', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  preco = EXCLUDED.preco,
  categoria = EXCLUDED.categoria,
  disponivel = EXCLUDED.disponivel;

-- Inserir entregador de teste
INSERT INTO public.entregadores (id, user_id, veiculo, placa, disponivel) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Moto', 'ABC-1234', true)
ON CONFLICT (id) DO UPDATE SET
  veiculo = EXCLUDED.veiculo,
  placa = EXCLUDED.placa,
  disponivel = EXCLUDED.disponivel;

-- Inserir um pedido de teste para demonstração
INSERT INTO public.pedidos (id, cliente_id, restaurante_id, entregador_id, total, status, endereco_entrega, metodo_pagamento, valor_entrega, observacoes) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 47.30, 'em_preparo', 'Rua do Cliente, 123', 'pix', 5.90, 'Entrega rápida, por favor')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  total = EXCLUDED.total,
  endereco_entrega = EXCLUDED.endereco_entrega,
  metodo_pagamento = EXCLUDED.metodo_pagamento,
  valor_entrega = EXCLUDED.valor_entrega,
  observacoes = EXCLUDED.observacoes;

-- Inserir itens do pedido de teste
INSERT INTO public.pedido_itens (id, pedido_id, produto_id, quantidade, preco_unitario) VALUES
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 35.90),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, 5.50)
ON CONFLICT (id) DO UPDATE SET
  quantidade = EXCLUDED.quantidade,
  preco_unitario = EXCLUDED.preco_unitario;

-- Inserir cupom de teste
INSERT INTO public.cupons (id, restaurante_id, codigo, descricao, tipo, percentual, valor_minimo, ativo) VALUES
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DESCONTO10', '10% de desconto em pedidos acima de R$ 30', 'desconto', 10, 30.00, true)
ON CONFLICT (id) DO UPDATE SET
  descricao = EXCLUDED.descricao,
  percentual = EXCLUDED.percentual,
  valor_minimo = EXCLUDED.valor_minimo,
  ativo = EXCLUDED.ativo;
