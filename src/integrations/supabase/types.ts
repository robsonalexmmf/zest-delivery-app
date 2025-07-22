export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adicional_opcoes: {
        Row: {
          adicional_id: string | null
          created_at: string | null
          id: string
          nome: string
          preco: number | null
        }
        Insert: {
          adicional_id?: string | null
          created_at?: string | null
          id?: string
          nome: string
          preco?: number | null
        }
        Update: {
          adicional_id?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          preco?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "adicional_opcoes_adicional_id_fkey"
            columns: ["adicional_id"]
            isOneToOne: false
            referencedRelation: "produto_adicionais"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          cliente_id: string
          comentario_entregador: string | null
          comentario_restaurante: string | null
          created_at: string
          entregador_id: string | null
          id: string
          nota_entregador: number | null
          nota_restaurante: number
          pedido_id: string
          restaurante_id: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          comentario_entregador?: string | null
          comentario_restaurante?: string | null
          created_at?: string
          entregador_id?: string | null
          id?: string
          nota_entregador?: number | null
          nota_restaurante: number
          pedido_id: string
          restaurante_id: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          comentario_entregador?: string | null
          comentario_restaurante?: string | null
          created_at?: string
          entregador_id?: string | null
          id?: string
          nota_entregador?: number | null
          nota_restaurante?: number
          pedido_id?: string
          restaurante_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      cupom_usos: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          cupom_id: string | null
          id: string
          pedido_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          cupom_id?: string | null
          id?: string
          pedido_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          cupom_id?: string | null
          id?: string
          pedido_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cupom_usos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupom_usos_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupom_usos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      cupons: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          id: string
          limite_uso: number | null
          percentual: number | null
          restaurante_id: string | null
          tipo: string
          uso_limitado: boolean | null
          usos_atual: number | null
          valor: number | null
          valor_minimo: number | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          limite_uso?: number | null
          percentual?: number | null
          restaurante_id?: string | null
          tipo?: string
          uso_limitado?: boolean | null
          usos_atual?: number | null
          valor?: number | null
          valor_minimo?: number | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          limite_uso?: number | null
          percentual?: number | null
          restaurante_id?: string | null
          tipo?: string
          uso_limitado?: boolean | null
          usos_atual?: number | null
          valor?: number | null
          valor_minimo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cupons_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
        ]
      }
      entregadores: {
        Row: {
          created_at: string | null
          disponivel: boolean | null
          id: string
          placa: string | null
          updated_at: string | null
          user_id: string | null
          veiculo: string
        }
        Insert: {
          created_at?: string | null
          disponivel?: boolean | null
          id?: string
          placa?: string | null
          updated_at?: string | null
          user_id?: string | null
          veiculo: string
        }
        Update: {
          created_at?: string | null
          disponivel?: boolean | null
          id?: string
          placa?: string | null
          updated_at?: string | null
          user_id?: string | null
          veiculo?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregadores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      item_adicionais: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          opcao_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          opcao_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          opcao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_adicionais_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pedido_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_adicionais_opcao_id_fkey"
            columns: ["opcao_id"]
            isOneToOne: false
            referencedRelation: "adicional_opcoes"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          created_at: string | null
          data_vencimento: string | null
          id: string
          metodo: Database["public"]["Enums"]["payment_method"]
          pedido_id: string | null
          pix_code: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_vencimento?: string | null
          id?: string
          metodo: Database["public"]["Enums"]["payment_method"]
          pedido_id?: string | null
          pix_code?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          valor: number
        }
        Update: {
          created_at?: string | null
          data_vencimento?: string | null
          id?: string
          metodo?: Database["public"]["Enums"]["payment_method"]
          pedido_id?: string | null
          pix_code?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_itens: {
        Row: {
          created_at: string | null
          id: string
          observacoes: string | null
          pedido_id: string | null
          preco_unitario: number
          produto_id: string | null
          quantidade: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          observacoes?: string | null
          pedido_id?: string | null
          preco_unitario: number
          produto_id?: string | null
          quantidade?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          observacoes?: string | null
          pedido_id?: string | null
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          avaliado: boolean
          cliente_id: string | null
          created_at: string | null
          endereco_entrega: string
          entregador_id: string | null
          id: string
          metodo_pagamento: Database["public"]["Enums"]["payment_method"]
          observacoes: string | null
          restaurante_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          tempo_estimado: string | null
          total: number
          updated_at: string | null
          valor_entrega: number | null
        }
        Insert: {
          avaliado?: boolean
          cliente_id?: string | null
          created_at?: string | null
          endereco_entrega: string
          entregador_id?: string | null
          id?: string
          metodo_pagamento: Database["public"]["Enums"]["payment_method"]
          observacoes?: string | null
          restaurante_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tempo_estimado?: string | null
          total: number
          updated_at?: string | null
          valor_entrega?: number | null
        }
        Update: {
          avaliado?: boolean
          cliente_id?: string | null
          created_at?: string | null
          endereco_entrega?: string
          entregador_id?: string | null
          id?: string
          metodo_pagamento?: Database["public"]["Enums"]["payment_method"]
          observacoes?: string | null
          restaurante_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tempo_estimado?: string | null
          total?: number
          updated_at?: string | null
          valor_entrega?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "entregadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_adicionais: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          obrigatorio: boolean | null
          produto_id: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          obrigatorio?: boolean | null
          produto_id?: string | null
          tipo?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          obrigatorio?: boolean | null
          produto_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_adicionais_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria: string
          created_at: string | null
          descricao: string | null
          disponivel: boolean | null
          id: string
          imagem: string | null
          nome: string
          preco: number
          restaurante_id: string | null
          updated_at: string | null
        }
        Insert: {
          categoria: string
          created_at?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          imagem?: string | null
          nome: string
          preco: number
          restaurante_id?: string | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          imagem?: string | null
          nome?: string
          preco?: number
          restaurante_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          tipo: Database["public"]["Enums"]["user_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["user_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["user_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurantes: {
        Row: {
          avaliacao: number | null
          categoria: string
          cidade: string | null
          created_at: string | null
          descricao: string | null
          disponivel: boolean | null
          id: string
          imagem: string | null
          nome: string
          taxa_entrega: number | null
          tempo_entrega: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avaliacao?: number | null
          categoria: string
          cidade?: string | null
          created_at?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          imagem?: string | null
          nome: string
          taxa_entrega?: number | null
          tempo_entrega?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avaliacao?: number | null
          categoria?: string
          cidade?: string | null
          created_at?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          imagem?: string | null
          nome?: string
          taxa_entrega?: number | null
          tempo_entrega?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurantes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "pendente"
        | "confirmado"
        | "em_preparo"
        | "pronto"
        | "saiu_para_entrega"
        | "entregue"
        | "cancelado"
      payment_method: "dinheiro" | "cartao" | "pix"
      payment_status: "pendente" | "pago" | "falhado"
      user_type: "cliente" | "restaurante" | "entregador" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pendente",
        "confirmado",
        "em_preparo",
        "pronto",
        "saiu_para_entrega",
        "entregue",
        "cancelado",
      ],
      payment_method: ["dinheiro", "cartao", "pix"],
      payment_status: ["pendente", "pago", "falhado"],
      user_type: ["cliente", "restaurante", "entregador", "admin"],
    },
  },
} as const
