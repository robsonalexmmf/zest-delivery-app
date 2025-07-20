
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: {
    nome: string;
    telefone?: string;
    endereco?: string;
    tipo?: 'cliente' | 'restaurante' | 'entregador';
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário de teste salvo primeiro
    const savedTestUser = localStorage.getItem('zdelivery_test_user');
    if (savedTestUser) {
      try {
        const { user: mockUser, profile: mockProfile } = JSON.parse(savedTestUser);
        setUser(mockUser);
        setProfile(mockProfile);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error loading test user:', error);
        localStorage.removeItem('zdelivery_test_user');
      }
    }

    // Get initial session para usuários normais
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    nome: string;
    telefone?: string;
    endereco?: string;
    tipo?: 'cliente' | 'restaurante' | 'entregador';
  }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: userData.nome,
          tipo: userData.tipo || 'cliente'
        }
      }
    });

    if (error) throw error;
  };

  // Função especial para login com usuários de teste
  const signInWithTestUser = async (email: string, password: string) => {
    // Dados mockados para usuários de teste
    const testUsers = {
      'cliente@test.com': {
        id: '11111111-1111-1111-1111-111111111111',
        nome: 'Cliente Teste',
        email: 'cliente@test.com',
        tipo: 'cliente' as const,
        telefone: '(11) 99999-1111',
        endereco: 'Rua do Cliente, 123, São Paulo, SP',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      'restaurante@test.com': {
        id: '22222222-2222-2222-2222-222222222222',
        nome: 'Pizza Deliciosa',
        email: 'restaurante@test.com',
        tipo: 'restaurante' as const,
        telefone: '(11) 99999-2222',
        endereco: 'Rua do Restaurante, 456, São Paulo, SP',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      'entregador@test.com': {
        id: '33333333-3333-3333-3333-333333333333',
        nome: 'Entregador Teste',
        email: 'entregador@test.com',
        tipo: 'entregador' as const,
        telefone: '(11) 99999-3333',
        endereco: 'Rua do Entregador, 789, São Paulo, SP',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      'admin@test.com': {
        id: '44444444-4444-4444-4444-444444444444',
        nome: 'Admin Teste',
        email: 'admin@test.com',
        tipo: 'admin' as const,
        telefone: '(11) 99999-4444',
        endereco: 'Rua do Admin, 101, São Paulo, SP',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    const profile = testUsers[email as keyof typeof testUsers];
    
    if (!profile) {
      throw new Error('Usuário não encontrado');
    }

    // Simular autenticação para usuários de teste
    if (password === '123456') {
      // Criar um user object simulado com todas as propriedades necessárias
      const mockUser: User = {
        id: profile.id,
        aud: 'authenticated',
        role: 'authenticated',
        email: profile.email,
        email_confirmed_at: new Date().toISOString(),
        phone: profile.telefone || '',
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          nome: profile.nome,
          tipo: profile.tipo
        },
        identities: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(mockUser);
      setProfile(profile);
      
      // Salvar no localStorage para persistência
      localStorage.setItem('testUser', JSON.stringify(profile));
      localStorage.setItem('zdelivery_test_user', JSON.stringify({
        user: mockUser,
        profile: profile
      }));

      return;
    } else {
      throw new Error('Senha incorreta');
    }
  };

  const signIn = async (email: string, password: string) => {
    // Verificar se é usuário de teste
    const testEmails = ['cliente@test.com', 'restaurante@test.com', 'entregador@test.com', 'admin@test.com'];
    
    if (testEmails.includes(email)) {
      await signInWithTestUser(email, password);
      return;
    }

    // Login normal para outros usuários
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
  };

  const signOut = async () => {
    // Limpar dados de teste se existirem
    localStorage.removeItem('testUser');
    localStorage.removeItem('zdelivery_test_user');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Refresh profile
    await fetchProfile(user.id);
  };


  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
