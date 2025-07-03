
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Package, TrendingUp, Users, Clock, Settings, Upload, Bell, MapPin, Phone, Mail, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DashboardRestaurante: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({
    nome: '',
    categoria: '',
    cidade: '',
    telefone: '',
    email: '',
    endereco: '',
    descricao: '',
    horario_funcionamento: {
      abertura: '08:00',
      fechamento: '22:00'
    },
    taxa_entrega: 5.00,
    tempo_preparo_medio: 30,
    logo: '',
    banner: '',
    aceita_pix: true,
    aceita_cartao: true,
    aceita_dinheiro: true
  });
  
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'restaurante') {
        navigate('/login');
      } else {
        setUser(parsedUser);
        carregarConfiguracoes();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const carregarConfiguracoes = () => {
    // Carregar configurações salvas ou usar dados do usuário
    const configSalvas = localStorage.getItem('restaurant_config');
    if (configSalvas) {
      const config = JSON.parse(configSalvas);
      setConfiguracoes(config);
      setLogoPreview(config.logo || '');
      setBannerPreview(config.banner || '');
    }
  };

  // Dados mockados para estatísticas
  const estatisticas = {
    vendas_hoje: 1247.80,
    pedidos_hoje: 23,
    ticket_medio: 54.25,
    crescimento: 15.2,
    pedidos_pendentes: 5,
    avaliacoes: 4.7,
    tempo_medio_entrega: 28
  };

  const categorias = [
    'Pizzaria', 'Hamburgueria', 'Comida Japonesa', 'Comida Italiana', 
    'Comida Brasileira', 'Lanches', 'Doces & Sobremesas', 'Bebidas',
    'Comida Saudável', 'Comida Mexicana', 'Frutos do Mar', 'Churrascaria'
  ];

  const cidades = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 
    'Brasília', 'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 
    'Manaus', 'Belém', 'Goiânia', 'Campinas', 'São Luis'
  ];

  const handleImageUpload = (type: 'logo' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        
        if (type === 'logo') {
          setLogoPreview(imageUrl);
          setConfiguracoes(prev => ({ ...prev, logo: imageUrl }));
        } else {
          setBannerPreview(imageUrl);
          setConfiguracoes(prev => ({ ...prev, banner: imageUrl }));
        }
        
        toast({
          title: `${type === 'logo' ? 'Logo' : 'Banner'} carregado!`,
          description: 'A imagem foi carregada com sucesso.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const salvarConfiguracoes = () => {
    localStorage.setItem('restaurant_config', JSON.stringify(configuracoes));
    
    // Atualizar dados do usuário
    const updatedUser = { ...user, ...configuracoes };
    setUser(updatedUser);
    localStorage.setItem('zdelivery_user', JSON.stringify(updatedUser));
    
    toast({
      title: 'Configurações salvas!',
      description: 'As configurações do restaurante foram atualizadas.',
    });
    
    setShowConfigDialog(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="restaurante" userName={user.nome} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header do Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard - {user.nome}
              </h1>
              <p className="text-gray-600">
                Gerencie seu restaurante e acompanhe o desempenho
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/pedidos-restaurante')}
              >
                <Bell className="w-4 h-4 mr-2" />
                {estatisticas.pedidos_pendentes} Pedidos Pendentes
              </Button>
              
              <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Configurações Gerais do Restaurante</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Informações Básicas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Informações Básicas</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome do Restaurante</Label>
                          <Input
                            id="nome"
                            value={configuracoes.nome}
                            onChange={(e) => setConfiguracoes(prev => ({...prev, nome: e.target.value}))}
                            placeholder="Nome do seu restaurante"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="categoria">Categoria</Label>
                          <Select value={configuracoes.categoria} onValueChange={(value) => setConfiguracoes(prev => ({...prev, categoria: value}))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categorias.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cidade">Cidade</Label>
                          <Select value={configuracoes.cidade} onValueChange={(value) => setConfiguracoes(prev => ({...prev, cidade: value}))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a cidade" />
                            </SelectTrigger>
                            <SelectContent>
                              {cidades.map(cidade => (
                                <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={configuracoes.telefone}
                            onChange={(e) => setConfiguracoes(prev => ({...prev, telefone: e.target.value}))}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={configuracoes.email}
                          onChange={(e) => setConfiguracoes(prev => ({...prev, email: e.target.value}))}
                          placeholder="contato@restaurante.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="endereco">Endereço Completo</Label>
                        <Input
                          id="endereco"
                          value={configuracoes.endereco}
                          onChange={(e) => setConfiguracoes(prev => ({...prev, endereco: e.target.value}))}
                          placeholder="Rua, número, bairro, CEP"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={configuracoes.descricao}
                          onChange={(e) => setConfiguracoes(prev => ({...prev, descricao: e.target.value}))}
                          placeholder="Descreva seu restaurante..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Imagens */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Imagens do Restaurante</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Logo do Restaurante</Label>
                          <div className="space-y-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload('logo', e)}
                              className="hidden"
                              id="logo-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                              className="w-full"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Carregar Logo
                            </Button>
                            {logoPreview && (
                              <img src={logoPreview} alt="Logo" className="w-20 h-20 object-cover rounded-lg border" />
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Banner/Capa</Label>
                          <div className="space-y-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload('banner', e)}
                              className="hidden"
                              id="banner-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('banner-upload')?.click()}
                              className="w-full"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Carregar Banner
                            </Button>
                            {bannerPreview && (
                              <img src={bannerPreview} alt="Banner" className="w-32 h-20 object-cover rounded-lg border" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Funcionamento */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Funcionamento</h3>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="abertura">Horário de Abertura</Label>
                          <Input
                            id="abertura"
                            type="time"
                            value={configuracoes.horario_funcionamento.abertura}
                            onChange={(e) => setConfiguracoes(prev => ({
                              ...prev, 
                              horario_funcionamento: {
                                ...prev.horario_funcionamento,
                                abertura: e.target.value
                              }
                            }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="fechamento">Horário de Fechamento</Label>
                          <Input
                            id="fechamento"
                            type="time"
                            value={configuracoes.horario_funcionamento.fechamento}
                            onChange={(e) => setConfiguracoes(prev => ({
                              ...prev, 
                              horario_funcionamento: {
                                ...prev.horario_funcionamento,
                                fechamento: e.target.value
                              }
                            }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tempo_preparo">Tempo Médio de Preparo (min)</Label>
                          <Input
                            id="tempo_preparo"
                            type="number"
                            value={configuracoes.tempo_preparo_medio}
                            onChange={(e) => setConfiguracoes(prev => ({...prev, tempo_preparo_medio: parseInt(e.target.value)}))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Entrega e Pagamento */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Entrega e Pagamento</h3>
                      
                      <div>
                        <Label htmlFor="taxa_entrega">Taxa de Entrega (R$)</Label>
                        <Input
                          id="taxa_entrega"
                          type="number"
                          step="0.01"
                          value={configuracoes.taxa_entrega}
                          onChange={(e) => setConfiguracoes(prev => ({...prev, taxa_entrega: parseFloat(e.target.value)}))}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Formas de Pagamento Aceitas</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={configuracoes.aceita_pix}
                              onCheckedChange={(checked) => setConfiguracoes(prev => ({...prev, aceita_pix: checked}))}
                            />
                            <Label>PIX</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={configuracoes.aceita_cartao}
                              onCheckedChange={(checked) => setConfiguracoes(prev => ({...prev, aceita_cartao: checked}))}
                            />
                            <Label>Cartão de Crédito/Débito</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={configuracoes.aceita_dinheiro}
                              onCheckedChange={(checked) => setConfiguracoes(prev => ({...prev, aceita_dinheiro: checked}))}
                            />
                            <Label>Dinheiro</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={salvarConfiguracoes} className="flex-1 bg-red-600 hover:bg-red-700">
                        Salvar Configurações
                      </Button>
                      <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Vendas Hoje
                </CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {estatisticas.vendas_hoje.toFixed(2)}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{estatisticas.crescimento}% vs ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pedidos Hoje
                </CardTitle>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {estatisticas.pedidos_hoje}
              </div>
              <p className="text-xs text-gray-500">
                Ticket médio: R$ {estatisticas.ticket_medio.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avaliação
                </CardTitle>
                <Users className="w-4 h-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {estatisticas.avaliacoes}/5
              </div>
              <p className="text-xs text-gray-500">
                Baseado em 156 avaliações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tempo Médio
                </CardTitle>
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {estatisticas.tempo_medio_entrega}min
              </div>
              <p className="text-xs text-gray-500">
                Preparo + entrega
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/produtos')}
            className="h-16 bg-red-600 hover:bg-red-700"
          >
            <Package className="w-5 h-5 mr-2" />
            Gerenciar Produtos
          </Button>
          
          <Button 
            onClick={() => navigate('/pedidos-restaurante')}
            variant="outline"
            className="h-16"
          >
            <Bell className="w-5 h-5 mr-2" />
            Ver Pedidos ({estatisticas.pedidos_pendentes})
          </Button>
          
          <Button 
            onClick={() => navigate('/relatorios')}
            variant="outline"
            className="h-16"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Relatórios
          </Button>
          
          <Button 
            variant="outline"
            className="h-16"
            onClick={() => setShowConfigDialog(true)}
          >
            <Settings className="w-5 h-5 mr-2" />
            Configurações
          </Button>
        </div>

        {/* Informações do Restaurante */}
        {(configuracoes.nome || configuracoes.categoria || configuracoes.cidade) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informações do Restaurante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {configuracoes.nome && (
                    <div className="flex items-center space-x-2">
                      <strong>Nome:</strong> <span>{configuracoes.nome}</span>
                    </div>
                  )}
                  {configuracoes.categoria && (
                    <div className="flex items-center space-x-2">
                      <strong>Categoria:</strong> <Badge>{configuracoes.categoria}</Badge>
                    </div>
                  )}
                  {configuracoes.cidade && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <strong>Cidade:</strong> <span>{configuracoes.cidade}</span>
                    </div>
                  )}
                  {configuracoes.telefone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <strong>Telefone:</strong> <span>{configuracoes.telefone}</span>
                    </div>
                  )}
                  {configuracoes.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <strong>Email:</strong> <span>{configuracoes.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {configuracoes.horario_funcionamento && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <strong>Funcionamento:</strong> 
                      <span>{configuracoes.horario_funcionamento.abertura} às {configuracoes.horario_funcionamento.fechamento}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <strong>Taxa de Entrega:</strong> <span>R$ {configuracoes.taxa_entrega.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong>Preparo Médio:</strong> <span>{configuracoes.tempo_preparo_medio} minutos</span>
                  </div>
                </div>
              </div>
              
              {configuracoes.descricao && (
                <div className="mt-4 pt-4 border-t">
                  <strong>Descrição:</strong>
                  <p className="mt-2 text-gray-600">{configuracoes.descricao}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resumo Rápido */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span>Faturamento do dia</span>
                <span className="font-bold text-green-600">R$ {estatisticas.vendas_hoje.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span>Pedidos realizados</span>
                <span className="font-bold text-blue-600">{estatisticas.pedidos_hoje}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span>Pedidos pendentes</span>
                <span className="font-bold text-orange-600">{estatisticas.pedidos_pendentes}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardRestaurante;
