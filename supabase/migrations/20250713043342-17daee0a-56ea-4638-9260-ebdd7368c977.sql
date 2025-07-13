
-- Criar enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('cliente', 'restaurante', 'entregador', 'admin');

-- Criar enum para status de pedidos
CREATE TYPE order_status AS ENUM ('pendente', 'confirmado', 'em_preparo', 'pronto', 'saiu_para_entrega', 'entregue', 'cancelado');

-- Criar enum para métodos de pagamento
CREATE TYPE payment_method AS ENUM ('dinheiro', 'cartao', 'pix');

-- Criar enum para status de pagamento
CREATE TYPE payment_status AS ENUM ('pendente', 'pago', 'falhado');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  endereco text,
  tipo user_type NOT NULL DEFAULT 'cliente',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela de restaurantes
CREATE TABLE public.restaurantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome text NOT NULL,
  categoria text NOT NULL,
  cidade text,
  avaliacao decimal DEFAULT 0,
  tempo_entrega text DEFAULT '30-45 min',
  taxa_entrega decimal DEFAULT 0,
  imagem text,
  descricao text,
  disponivel boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id uuid REFERENCES public.restaurantes(id) ON DELETE CASCADE,
  nome text NOT NULL,
  descricao text,
  preco decimal NOT NULL,
  categoria text NOT NULL,
  imagem text,
  disponivel boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela de adicionais dos produtos
CREATE TABLE public.produto_adicionais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid REFERENCES public.produtos(id) ON DELETE CASCADE,
  nome text NOT NULL,
  tipo text NOT NULL DEFAULT 'unico',
  obrigatorio boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela de opções dos adicionais
CREATE TABLE public.adicional_opcoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adicional_id uuid REFERENCES public.produto_adicionais(id) ON DELETE CASCADE,
  nome text NOT NULL,
  preco decimal DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela de entregadores
CREATE TABLE public.entregadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  veiculo text NOT NULL,
  placa text,
  disponivel boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela de pedidos
CREATE TABLE public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurante_id uuid REFERENCES public.restaurantes(id) ON DELETE CASCADE,
  entregador_id uuid REFERENCES public.entregadores(id) ON DELETE SET NULL,
  total decimal NOT NULL,
  status order_status DEFAULT 'pendente',
  endereco_entrega text NOT NULL,
  metodo_pagamento payment_method NOT NULL,
  valor_entrega decimal DEFAULT 0,
  tempo_estimado text DEFAULT '30 min',
  observacoes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela de itens do pedido
CREATE TABLE public.pedido_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
  produto_id uuid REFERENCES public.produtos(id) ON DELETE CASCADE,
  quantidade integer NOT NULL DEFAULT 1,
  preco_unitario decimal NOT NULL,
  observacoes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela de adicionais selecionados nos itens
CREATE TABLE public.item_adicionais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES public.pedido_itens(id) ON DELETE CASCADE,
  opcao_id uuid REFERENCES public.adicional_opcoes(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela de pagamentos
CREATE TABLE public.pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
  valor decimal NOT NULL,
  status payment_status DEFAULT 'pendente',
  metodo payment_method NOT NULL,
  pix_code text,
  data_vencimento timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela de cupons
CREATE TABLE public.cupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id uuid REFERENCES public.restaurantes(id) ON DELETE CASCADE,
  codigo text NOT NULL UNIQUE,
  descricao text,
  tipo text NOT NULL DEFAULT 'desconto', -- 'desconto' ou 'frete_gratis'
  valor decimal,
  percentual decimal,
  valor_minimo decimal DEFAULT 0,
  data_inicio timestamp with time zone DEFAULT now(),
  data_fim timestamp with time zone,
  ativo boolean DEFAULT true,
  uso_limitado boolean DEFAULT false,
  limite_uso integer,
  usos_atual integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabela de uso de cupons
CREATE TABLE public.cupom_usos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cupom_id uuid REFERENCES public.cupons(id) ON DELETE CASCADE,
  pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
  cliente_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_adicionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adicional_opcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_adicionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupom_usos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver e editar seu próprio perfil" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Perfis públicos podem ser vistos por todos" ON public.profiles
  FOR SELECT USING (true);

-- Políticas RLS para restaurantes
CREATE POLICY "Restaurantes podem gerenciar seus dados" ON public.restaurantes
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Todos podem ver restaurantes" ON public.restaurantes
  FOR SELECT USING (true);

-- Políticas RLS para produtos
CREATE POLICY "Restaurantes podem gerenciar seus produtos" ON public.produtos
  FOR ALL USING (
    restaurante_id IN (
      SELECT id FROM public.restaurantes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ver produtos" ON public.produtos
  FOR SELECT USING (true);

-- Políticas RLS para adicionais
CREATE POLICY "Restaurantes podem gerenciar adicionais de seus produtos" ON public.produto_adicionais
  FOR ALL USING (
    produto_id IN (
      SELECT p.id FROM public.produtos p
      JOIN public.restaurantes r ON p.restaurante_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ver adicionais" ON public.produto_adicionais
  FOR SELECT USING (true);

-- Políticas RLS para opções de adicionais
CREATE POLICY "Restaurantes podem gerenciar opções de adicionais" ON public.adicional_opcoes
  FOR ALL USING (
    adicional_id IN (
      SELECT pa.id FROM public.produto_adicionais pa
      JOIN public.produtos p ON pa.produto_id = p.id
      JOIN public.restaurantes r ON p.restaurante_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ver opções de adicionais" ON public.adicional_opcoes
  FOR SELECT USING (true);

-- Políticas RLS para entregadores
CREATE POLICY "Entregadores podem ver e editar seus dados" ON public.entregadores
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Todos podem ver entregadores disponíveis" ON public.entregadores
  FOR SELECT USING (disponivel = true);

-- Políticas RLS para pedidos
CREATE POLICY "Clientes podem ver seus pedidos" ON public.pedidos
  FOR SELECT USING (cliente_id = auth.uid());

CREATE POLICY "Restaurantes podem ver pedidos de seus estabelecimentos" ON public.pedidos
  FOR SELECT USING (
    restaurante_id IN (
      SELECT id FROM public.restaurantes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Entregadores podem ver pedidos atribuídos a eles" ON public.pedidos
  FOR SELECT USING (
    entregador_id IN (
      SELECT id FROM public.entregadores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clientes podem criar pedidos" ON public.pedidos
  FOR INSERT WITH CHECK (cliente_id = auth.uid());

CREATE POLICY "Restaurantes e entregadores podem atualizar pedidos" ON public.pedidos
  FOR UPDATE USING (
    restaurante_id IN (
      SELECT id FROM public.restaurantes WHERE user_id = auth.uid()
    ) OR
    entregador_id IN (
      SELECT id FROM public.entregadores WHERE user_id = auth.uid()
    )
  );

-- Políticas RLS para itens do pedido
CREATE POLICY "Acesso aos itens via pedido" ON public.pedido_itens
  FOR ALL USING (
    pedido_id IN (
      SELECT id FROM public.pedidos WHERE
        cliente_id = auth.uid() OR
        restaurante_id IN (SELECT id FROM public.restaurantes WHERE user_id = auth.uid()) OR
        entregador_id IN (SELECT id FROM public.entregadores WHERE user_id = auth.uid())
    )
  );

-- Políticas RLS para adicionais dos itens
CREATE POLICY "Acesso aos adicionais via item" ON public.item_adicionais
  FOR ALL USING (
    item_id IN (
      SELECT pi.id FROM public.pedido_itens pi
      JOIN public.pedidos p ON pi.pedido_id = p.id
      WHERE p.cliente_id = auth.uid() OR
        p.restaurante_id IN (SELECT id FROM public.restaurantes WHERE user_id = auth.uid()) OR
        p.entregador_id IN (SELECT id FROM public.entregadores WHERE user_id = auth.uid())
    )
  );

-- Políticas RLS para pagamentos
CREATE POLICY "Acesso aos pagamentos via pedido" ON public.pagamentos
  FOR ALL USING (
    pedido_id IN (
      SELECT id FROM public.pedidos WHERE
        cliente_id = auth.uid() OR
        restaurante_id IN (SELECT id FROM public.restaurantes WHERE user_id = auth.uid())
    )
  );

-- Políticas RLS para cupons
CREATE POLICY "Restaurantes podem gerenciar seus cupons" ON public.cupons
  FOR ALL USING (
    restaurante_id IN (
      SELECT id FROM public.restaurantes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ver cupons ativos" ON public.cupons
  FOR SELECT USING (ativo = true);

-- Políticas RLS para uso de cupons
CREATE POLICY "Acesso ao uso de cupons via pedido" ON public.cupom_usos
  FOR ALL USING (
    cliente_id = auth.uid() OR
    pedido_id IN (
      SELECT id FROM public.pedidos WHERE
        restaurante_id IN (SELECT id FROM public.restaurantes WHERE user_id = auth.uid())
    )
  );

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, tipo)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome', new.email),
    new.email,
    COALESCE((new.raw_user_meta_data->>'tipo')::user_type, 'cliente'::user_type)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_restaurantes_updated_at
  BEFORE UPDATE ON public.restaurantes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_entregadores_updated_at
  BEFORE UPDATE ON public.entregadores
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_pagamentos_updated_at
  BEFORE UPDATE ON public.pagamentos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
