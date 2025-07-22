-- Primeiro, vamos corrigir a estrutura da tabela profiles para não depender de auth.users
-- e depois criar usuários reais via código

-- Remover a foreign key constraint da tabela profiles se existir
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Modificar a estrutura da profiles para ser mais flexível
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Inserir usuários de teste na tabela profiles (sem foreign key para auth.users)
INSERT INTO public.profiles (id, nome, email, tipo, telefone, endereco) VALUES
('00000000-0000-0000-0000-000000000001', 'Cliente Teste', 'cliente@test.com', 'cliente', '11999999999', 'Rua A, 123 - São Paulo, SP'),
('00000000-0000-0000-0000-000000000002', 'Pizzaria do Mario', 'restaurante@test.com', 'restaurante', '11888888888', 'Rua da Pizza, 123 - São Paulo, SP'),
('00000000-0000-0000-0000-000000000003', 'Entregador Teste', 'entregador@test.com', 'entregador', '11777777777', 'Rua B, 456 - São Paulo, SP'),
('00000000-0000-0000-0000-000000000004', 'Admin Sistema', 'admin@test.com', 'cliente', '11666666666', 'Rua Admin, 789 - São Paulo, SP')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  tipo = EXCLUDED.tipo,
  telefone = EXCLUDED.telefone,
  endereco = EXCLUDED.endereco;

-- Inserir restaurante
INSERT INTO public.restaurantes (id, user_id, nome, categoria, cidade, avaliacao, tempo_entrega, taxa_entrega, imagem, descricao, disponivel) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Pizzaria do Mario', 'Pizzaria', 'São Paulo', 4.8, '30-45 min', 5.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 'As melhores pizzas artesanais da cidade com massa fresca e ingredientes selecionados. Tradição familiar há mais de 20 anos.', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  categoria = EXCLUDED.categoria,
  cidade = EXCLUDED.cidade,
  avaliacao = EXCLUDED.avaliacao,
  tempo_entrega = EXCLUDED.tempo_entrega,
  taxa_entrega = EXCLUDED.taxa_entrega,
  imagem = EXCLUDED.imagem,
  descricao = EXCLUDED.descricao,
  disponivel = EXCLUDED.disponivel;

-- Inserir entregador
INSERT INTO public.entregadores (id, user_id, veiculo, placa, disponivel) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Moto', 'ABC1234', true)
ON CONFLICT (id) DO UPDATE SET
  veiculo = EXCLUDED.veiculo,
  placa = EXCLUDED.placa,
  disponivel = EXCLUDED.disponivel;

-- Inserir produtos da Pizzaria do Mario
INSERT INTO public.produtos (id, restaurante_id, nome, descricao, preco, categoria, imagem, disponivel) VALUES
-- Pizzas Clássicas
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Pizza Margherita', 'A clássica pizza italiana com molho de tomate San Marzano, mussarela de búfala, manjericão fresco e azeite extra virgem', 42.90, 'Pizzas Clássicas', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Pizza Pepperoni', 'Pizza com generosa cobertura de pepperoni italiano, mussarela derretida e molho de tomate temperado', 46.90, 'Pizzas Clássicas', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Pizza Quatro Queijos', 'Combinação perfeita de mussarela, parmesão, gorgonzola e provolone sobre base de molho branco', 48.90, 'Pizzas Clássicas', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Pizza Napolitana', 'Molho de tomate, mussarela, fatias de tomate fresco, anchovas, azeitonas pretas e orégano', 44.90, 'Pizzas Clássicas', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Pizza Calabresa', 'Fatias de calabresa defumada, cebola caramelizada, mussarela e molho de tomate especial', 45.90, 'Pizzas Clássicas', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
-- Pizzas Especiais
('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'Pizza Suprema', 'Pizza completa com pepperoni, calabresa, champignon, pimentão, cebola, azeitona e mussarela', 52.90, 'Pizzas Especiais', 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'Pizza Bacon & Champignon', 'Bacon crocante, champignon frescos, cebola roxa, mussarela e molho barbecue artesanal', 49.90, 'Pizzas Especiais', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'Pizza Frango Catupiry', 'Frango desfiado temperado, catupiry original, milho, azeitona verde e mussarela', 47.90, 'Pizzas Especiais', 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', 'Pizza Portuguesa', 'Presunto, ovos, cebola, azeitona verde, ervilha, mussarela e molho de tomate', 46.90, 'Pizzas Especiais', 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 'Pizza Vegetariana', 'Abobrinha, berinjela, tomate cereja, rúcula, pimentão amarelo e queijo de cabra', 44.90, 'Pizzas Especiais', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
-- Bebidas
('30000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000001', 'Água Mineral 500ml', 'Água mineral natural gelada para acompanhar sua refeição', 4.50, 'Bebidas', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
-- Entradas
('30000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000001', 'Bruschetta Italiana', 'Pão italiano tostado com tomate, manjericão, alho e azeite extravirgem (4 unidades)', 18.90, 'Entradas', 'https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true),
('30000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000001', 'Pão de Alho Especial', 'Pão francês recheado com alho, ervas finas, manteiga e queijo gratinado', 16.90, 'Entradas', 'https://images.unsplash.com/photo-1549107434-8c4c50fb2b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  preco = EXCLUDED.preco,
  categoria = EXCLUDED.categoria,
  imagem = EXCLUDED.imagem,
  disponivel = EXCLUDED.disponivel;