-- Inserir profiles de teste com UUIDs fixos
INSERT INTO public.profiles (id, nome, email, tipo, telefone, endereco, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Cliente Teste', 'cliente@test.com', 'cliente', '(11) 99999-1111', 'Rua do Cliente, 123, São Paulo, SP', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Restaurante Teste', 'restaurante@test.com', 'restaurante', '(11) 99999-2222', 'Rua do Restaurante, 456, São Paulo, SP', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Entregador Teste', 'entregador@test.com', 'entregador', '(11) 99999-3333', 'Rua do Entregador, 789, São Paulo, SP', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'Admin Teste', 'admin@test.com', 'admin', '(11) 99999-4444', 'Rua do Admin, 101, São Paulo, SP', now(), now())
ON CONFLICT (id) DO NOTHING;