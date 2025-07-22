import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { restaurantes, produtos } from '@/data/mockData';

export function useSupabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  // Get user data from localStorage instead of useAuth
  const getUserData = () => {
    const testUser = localStorage.getItem('testUser');
    if (testUser) {
      return JSON.parse(testUser);
    }
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const syncRestaurantData = async () => {
    const user = getUserData();
    if (!user || user.tipo !== 'restaurante') return;

    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      // Buscar ou criar restaurante
      const { data: existingRestaurant } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      let restauranteId: string;

      if (!existingRestaurant) {
        // Criar restaurante baseado nos dados mock
        const restaurantData = restaurantes.find(r => r.nome === user.nome) || restaurantes[0];
        
        const { data: newRestaurant, error: restaurantError } = await supabase
          .from('restaurantes')
          .insert({
            user_id: user.id,
            nome: user.nome,
            categoria: restaurantData.categoria,
            cidade: restaurantData.cidade,
            avaliacao: restaurantData.avaliacao,
            tempo_entrega: restaurantData.tempoEntrega,
            taxa_entrega: restaurantData.taxaEntrega,
            imagem: restaurantData.imagem,
            descricao: restaurantData.descricao,
            disponivel: true
          })
          .select('id')
          .single();

        if (restaurantError) throw restaurantError;
        restauranteId = newRestaurant.id;
      } else {
        restauranteId = existingRestaurant.id;
      }

      // Buscar produtos existentes
      const { data: existingProducts } = await supabase
        .from('produtos')
        .select('*')
        .eq('restaurante_id', restauranteId);

      // Sincronizar produtos da Pizzaria do Mario
      if (user.nome === 'Pizzaria do Mario') {
        const produtosPizzaria = produtos.filter(p => p.restauranteId === "1");
        
        for (const produto of produtosPizzaria) {
          const exists = existingProducts?.find(p => p.nome === produto.nome);
          
          if (!exists) {
            await supabase
              .from('produtos')
              .insert({
                restaurante_id: restauranteId,
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco,
                categoria: produto.categoria,
                imagem: produto.imagem,
                disponivel: produto.disponivel
              });
          }
        }
      }

      // Sincronizar produtos do localStorage
      const produtosLocal = localStorage.getItem(`zdelivery_produtos_${user.nome}`) || 
                           localStorage.getItem('zdelivery_produtos_global');
      
      if (produtosLocal) {
        const produtosParsed = JSON.parse(produtosLocal);
        
        for (const produto of produtosParsed) {
          const exists = existingProducts?.find(p => p.nome === produto.nome);
          
          if (!exists) {
            await supabase
              .from('produtos')
              .insert({
                restaurante_id: restauranteId,
                nome: produto.nome,
                descricao: produto.descricao || '',
                preco: produto.preco,
                categoria: produto.categoria,
                imagem: produto.imagem || '',
                disponivel: produto.disponivel ?? true
              });
          }
        }
      }

      setSyncStatus('success');
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncOrdersToSupabase = async () => {
    const user = getUserData();
    if (!user) return;

    try {
      const pedidosLocal = localStorage.getItem('zdelivery_pedidos');
      if (!pedidosLocal) return;

      const pedidos = JSON.parse(pedidosLocal);
      
      for (const pedido of pedidos) {
        // Verificar se o pedido já existe
        const { data: existingOrder } = await supabase
          .from('pedidos')
          .select('id')
          .eq('id', pedido.id)
          .single();

        if (!existingOrder) {
          // Buscar IDs do Supabase
          const { data: restaurant } = await supabase
            .from('restaurantes')
            .select('id')
            .eq('nome', pedido.restaurante.nome)
            .single();

          if (restaurant) {
            await supabase
              .from('pedidos')
              .insert({
                id: pedido.id,
                cliente_id: user.id, // Assumindo que o cliente atual fez o pedido
                restaurante_id: restaurant.id,
                total: pedido.total,
                status: pedido.status,
                metodo_pagamento: pedido.metodoPagamento,
                valor_entrega: pedido.valorEntrega,
                endereco_entrega: pedido.cliente.endereco,
                tempo_estimado: pedido.tempoEstimado,
                observacoes: pedido.observacoes,
                avaliado: pedido.avaliado || false
              });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar pedidos:', error);
    }
  };

  useEffect(() => {
    const user = getUserData();
    if (user && user.tipo === 'restaurante') {
      syncRestaurantData();
    }
  }, []);

  return {
    isSyncing,
    syncStatus,
    syncRestaurantData,
    syncOrdersToSupabase
  };
}