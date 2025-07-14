
-- Verificar e inserir novamente os usuários de teste
-- Usando ON CONFLICT para evitar duplicatas

-- Limpar dados de teste existentes se houver problemas
DELETE FROM public.cupons WHERE id = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii';
DELETE FROM public.pedido_itens WHERE pedido_id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
DELETE FROM public.pagamentos WHERE pedido_id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
DELETE FROM public.pedidos WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
DELETE FROM public.produtos WHERE restaurante_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
DELETE FROM public.entregadores WHERE user_id IN ('33333333-3333-3333-3333-333333333333');
DELETE FROM public.restaurantes WHERE user_id = '22222222-2222-2222-2222-222222222222';
DELETE FROM public.profiles WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222', 
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);

-- Inserir profiles de teste com UUIDs fixos
INSERT INTO public.profiles (id, nome, email, tipo, telefone, endereco, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Cliente Teste', 'cliente@test.com', 'cliente', '(11) 99999-1111', 'Rua do Cliente, 123, São Paulo, SP', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Restaurante Teste', 'restaurante@test.com', 'restaurante', '(11) 99999-2222', 'Rua do Restaurante, 456, São Paulo, SP', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Entregador Teste', 'entregador@test.com', 'entregador', '(11) 99999-3333', 'Rua do Entregador, 789, São Paulo, SP', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'Admin Teste', 'admin@test.com', 'admin', '(11) 99999-4444', 'Rua do Admin, 101, São Paulo, SP', now(), now());

-- Inserir restaurante de teste
INSERT INTO public.restaurantes (id, user_id, nome, categoria, cidade, avaliacao, tempo_entrega, taxa_entrega, descricao, disponivel, created_at, updated_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Pizza Deliciosa', 'Pizzaria', 'São Paulo', 4.5, '30-45 min', 5.90, 'As melhores pizzas da cidade com ingredientes frescos!', true, now(), now());

-- Inserir produtos de teste para o restaurante
INSERT INTO public.produtos (id, restaurante_id, nome, descricao, preco, categoria, disponivel, created_at, updated_at) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pizza Margherita', 'Molho de tomate, mussarela de búfala e manjericão fresco', 35.90, 'Pizza', true, now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pizza Calabresa', 'Molho de tomate, mussarela, calabresa artesanal e cebola', 38.90, 'Pizza', true, now(), now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Refrigerante Lata', 'Coca-Cola 350ml gelada', 5.50, 'Bebida', true, now(), now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pizza Portuguesa', 'Molho de tomate, mussarela, presunto, ovos, cebola e azeitona', 42.90, 'Pizza', true, now(), now());

-- Inserir entregador de teste
INSERT INTO public.entregadores (id, user_id, veiculo, placa, disponivel, created_at, updated_at) VALUES
  ('eeeeeeee-1111-2222-3333-444444444444', '33333333-3333-3333-3333-333333333333', 'Moto', 'ABC-1234', true, now(), now());

-- Inserir pedido de teste para demonstração
INSERT INTO public.pedidos (id, cliente_id, restaurante_id, entregador_id, total, status, endereco_entrega, metodo_pagamento, valor_entrega, observacoes, tempo_estimado, created_at, updated_at) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-1111-2222-3333-444444444444', 47.30, 'em_preparo', 'Rua do Cliente, 123, São Paulo, SP', 'pix', 5.90, 'Entrega rápida, por favor. Apartamento 45B', '35 min', now(), now());

-- Inserir itens do pedido de teste
INSERT INTO public.pedido_itens (id, pedido_id, produto_id, quantidade, preco_unitario, observacoes, created_at) VALUES
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 35.90, 'Sem cebola', now()),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, 5.50, 'Bem gelada', now());

-- Inserir cupom de teste
INSERT INTO public.cupons (id, restaurante_id, codigo, descricao, tipo, percentual, valor_minimo, ativo, data_inicio, data_fim, created_at) VALUES
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DESCONTO10', '10% de desconto em pedidos acima de R$ 30', 'desconto', 10, 30.00, true, now(), now() + interval '30 days', now());

-- Inserir pagamento de teste
INSERT INTO public.pagamentos (id, pedido_id, metodo, valor, status, created_at, updated_at) VALUES
  ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'pix', 47.30, 'pendente', now(), now());
