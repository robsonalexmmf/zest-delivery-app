-- Inserir usuário admin para teste
-- Primeiro, inserir na tabela auth.users (simulando criação via Supabase Auth)
-- Como não podemos inserir diretamente em auth.users, vamos inserir apenas o perfil
-- O usuário admin deverá ser criado manualmente via Supabase Auth com email: admin@test.com

-- Inserir perfil de admin na tabela profiles
INSERT INTO public.profiles (id, nome, email, tipo, telefone, endereco, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000004'::uuid,
  'Administrador do Sistema',
  'admin@test.com',
  'admin'::user_type,
  '(11) 9999-0000',
  'Sede Administrativa - Centro',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  tipo = EXCLUDED.tipo,
  telefone = EXCLUDED.telefone,
  endereco = EXCLUDED.endereco,
  updated_at = now();