
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Restaurante = Database['public']['Tables']['restaurantes']['Row'];
type RestauranteInsert = Database['public']['Tables']['restaurantes']['Insert'];
type RestauranteUpdate = Database['public']['Tables']['restaurantes']['Update'];

export function useRestaurantes() {
  return useQuery({
    queryKey: ['restaurantes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('disponivel', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useRestaurante(id: string) {
  return useQuery({
    queryKey: ['restaurante', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateRestaurante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurante: RestauranteInsert) => {
      const { data, error } = await supabase
        .from('restaurantes')
        .insert(restaurante)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurantes'] });
    },
  });
}

export function useUpdateRestaurante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: RestauranteUpdate }) => {
      const { data, error } = await supabase
        .from('restaurantes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurantes'] });
      queryClient.invalidateQueries({ queryKey: ['restaurante', data.id] });
    },
  });
}
