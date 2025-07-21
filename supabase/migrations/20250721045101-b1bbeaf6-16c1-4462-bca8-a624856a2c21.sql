-- Criar tabela de avaliações
CREATE TABLE public.avaliacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL,
  restaurante_id UUID NOT NULL,
  entregador_id UUID,
  nota_restaurante INTEGER NOT NULL CHECK (nota_restaurante >= 1 AND nota_restaurante <= 5),
  nota_entregador INTEGER CHECK (nota_entregador >= 1 AND nota_entregador <= 5),
  comentario_restaurante TEXT,
  comentario_entregador TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para avaliações
CREATE POLICY "Clientes podem criar avaliações de seus pedidos" 
ON public.avaliacoes 
FOR INSERT 
WITH CHECK (cliente_id = auth.uid());

CREATE POLICY "Clientes podem ver suas avaliações" 
ON public.avaliacoes 
FOR SELECT 
USING (cliente_id = auth.uid());

CREATE POLICY "Restaurantes podem ver avaliações de seus estabelecimentos" 
ON public.avaliacoes 
FOR SELECT 
USING (restaurante_id IN (
  SELECT restaurantes.id 
  FROM restaurantes 
  WHERE restaurantes.user_id = auth.uid()
));

CREATE POLICY "Entregadores podem ver suas avaliações" 
ON public.avaliacoes 
FOR SELECT 
USING (entregador_id IN (
  SELECT entregadores.id 
  FROM entregadores 
  WHERE entregadores.user_id = auth.uid()
));

-- Trigger para updated_at
CREATE TRIGGER update_avaliacoes_updated_at
BEFORE UPDATE ON public.avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Adicionar coluna avaliado à tabela pedidos
ALTER TABLE public.pedidos 
ADD COLUMN avaliado BOOLEAN NOT NULL DEFAULT false;

-- Função para atualizar estatísticas de avaliação do restaurante
CREATE OR REPLACE FUNCTION public.atualizar_avaliacao_restaurante()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurantes 
  SET avaliacao = (
    SELECT COALESCE(AVG(nota_restaurante), 0) 
    FROM avaliacoes 
    WHERE restaurante_id = NEW.restaurante_id
  )
  WHERE id = NEW.restaurante_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar avaliação do restaurante
CREATE TRIGGER trigger_atualizar_avaliacao_restaurante
AFTER INSERT OR UPDATE ON public.avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.atualizar_avaliacao_restaurante();