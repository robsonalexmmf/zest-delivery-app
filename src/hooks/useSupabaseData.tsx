import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useSupabaseData() {
  const { user, session } = useSupabaseAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [restaurante, setRestaurante] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);

  // Carregar perfil do usuário
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const loadUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  // Carregar dados do restaurante se for usuário restaurante
  useEffect(() => {
    if (!userProfile || userProfile.tipo !== 'restaurante') {
      setRestaurante(null);
      setProdutos([]);
      return;
    }

    const loadRestauranteData = async () => {
      try {
        // Carregar restaurante
        const { data: restauranteData, error: restauranteError } = await supabase
          .from('restaurantes')
          .select('*')
          .eq('user_id', userProfile.id)
          .maybeSingle();

        if (restauranteError) throw restauranteError;
        setRestaurante(restauranteData);

        if (restauranteData) {
          // Carregar produtos do restaurante
          const { data: produtosData, error: produtosError } = await supabase
            .from('produtos')
            .select(`
              *,
              produto_adicionais (
                *,
                adicional_opcoes (*)
              )
            `)
            .eq('restaurante_id', restauranteData.id)
            .order('categoria', { ascending: true })
            .order('nome', { ascending: true });

          if (produtosError) throw produtosError;
          setProdutos(produtosData || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do restaurante:', error);
      }
    };

    loadRestauranteData();
  }, [userProfile]);

  // Carregar pedidos
  useEffect(() => {
    if (!userProfile) {
      setPedidos([]);
      return;
    }

    const loadPedidos = async () => {
      try {
        let query = supabase
          .from('pedidos')
          .select(`
            *,
            profiles!pedidos_cliente_id_fkey (nome, telefone, endereco),
            restaurantes (nome, telefone, endereco),
            entregadores (
              id,
              profiles!entregadores_user_id_fkey (nome, telefone)
            ),
            pedido_itens (
              *,
              produtos (nome, preco),
              item_adicionais (
                *,
                adicional_opcoes (nome, preco)
              )
            )
          `)
          .order('created_at', { ascending: false });

        // Filtrar baseado no tipo de usuário
        if (userProfile.tipo === 'cliente') {
          query = query.eq('cliente_id', userProfile.id);
        } else if (userProfile.tipo === 'restaurante' && restaurante) {
          query = query.eq('restaurante_id', restaurante.id);
        } else if (userProfile.tipo === 'entregador') {
          // Para entregadores, mostrar pedidos disponíveis e seus pedidos
          const { data: entregadorData } = await supabase
            .from('entregadores')
            .select('id')
            .eq('user_id', userProfile.id)
            .maybeSingle();

          if (entregadorData) {
            query = query.or(`entregador_id.eq.${entregadorData.id},status.eq.pronto`);
          }
        }

        const { data, error } = await query;

        if (error) throw error;
        setPedidos(data || []);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    };

    loadPedidos();

    // Subscription para updates em tempo real
    const subscription = supabase
      .channel('pedidos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pedidos'
        },
        () => {
          loadPedidos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userProfile, restaurante]);

  // Funções para criar/atualizar dados
  const createPedido = async (pedidoData: any) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .insert(pedidoData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return { data: null, error };
    }
  };

  const updatePedidoStatus = async (pedidoId: string, status: string, entregadorId?: string, avaliado?: boolean) => {
    try {
      const updateData: any = { status };
      if (entregadorId) {
        updateData.entregador_id = entregadorId;
      }
      if (avaliado !== undefined) {
        updateData.avaliado = avaliado;
      }

      const { data, error } = await supabase
        .from('pedidos')
        .update(updateData)
        .eq('id', pedidoId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return { data: null, error };
    }
  };

  const createAvaliacao = async (avaliacaoData: any) => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .insert(avaliacaoData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      return { data: null, error };
    }
  };

  const createProduto = async (produtoData: any) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert(produtoData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return { data: null, error };
    }
  };

  const updateProduto = async (produtoId: string, produtoData: any) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update(produtoData)
        .eq('id', produtoId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return { data: null, error };
    }
  };

  return {
    userProfile,
    restaurante,
    produtos,
    pedidos,
    createPedido,
    updatePedidoStatus,
    createAvaliacao,
    createProduto,
    updateProduto
  };
}