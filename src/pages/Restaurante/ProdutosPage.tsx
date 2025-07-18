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
import { Plus, Edit, Trash2, Package, Settings, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '@/components/common/ImageUpload';

const ProdutosPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAdicionaisDialog, setShowAdicionaisDialog] = useState(false);
  const [produtoAdicionais, setProdutoAdicionais] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se é usuário de teste primeiro
    const testUser = localStorage.getItem('zdelivery_test_user');
    if (testUser) {
      try {
        const { profile } = JSON.parse(testUser);
        if (profile.tipo !== 'restaurante') {
          navigate('/login');
        } else {
          setUser(profile);
          carregarProdutos();
        }
        return;
      } catch (error) {
        console.error('Error loading test user:', error);
        localStorage.removeItem('zdelivery_test_user');
      }
    }

    // Verificar usuário normal
    const userData = localStorage.getItem('zdelivery_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.tipo !== 'restaurante') {
        navigate('/login');
      } else {
        setUser(parsedUser);
        carregarProdutos();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const carregarProdutos = () => {
    // Primeiro tentar carregar do localStorage
    const produtosSalvos = localStorage.getItem('restaurant_products');
    if (produtosSalvos) {
      const produtos = JSON.parse(produtosSalvos);
      setProdutos(produtos);
      // Sincronizar com dados globais
      const produtosGlobais = JSON.parse(localStorage.getItem('zdelivery_produtos_globais') || '{}');
      produtosGlobais[user?.nome || 'Restaurante'] = produtos;
      localStorage.setItem('zdelivery_produtos_globais', JSON.stringify(produtosGlobais));
      return;
    }

    // Produtos mockados com adicionais
    const produtosMockados = [
      {
        id: '1',
        nome: 'Pizza Margherita',
        descricao: 'Molho de tomate, mussarela, manjericão e orégano',
        preco: 35.90,
        categoria: 'Pizzas',
        disponivel: true,
        imagem: '/placeholder.svg',
        adicionais: [
          {
            id: 'borda',
            nome: 'Borda Recheada',
            tipo: 'unico',
            obrigatorio: false,
            opcoes: [
              { id: 'catupiry', nome: 'Catupiry', preco: 8.00 },
              { id: 'cheddar', nome: 'Cheddar', preco: 6.00 }
            ]
          }
        ]
      },
      {
        id: '2',
        nome: 'Pizza Calabresa',
        descricao: 'Molho de tomate, mussarela, calabresa e cebola',
        preco: 38.90,
        categoria: 'Pizzas',
        disponivel: true,
        imagem: '/placeholder.svg',
        adicionais: []
      },
      {
        id: '3',
        nome: 'Coca-Cola 350ml',
        descricao: 'Refrigerante gelado',
        preco: 5.50,
        categoria: 'Bebidas',
        disponivel: false,
        imagem: '/placeholder.svg',
        adicionais: []
      }
    ];
    setProdutos(produtosMockados);
    localStorage.setItem('restaurant_products', JSON.stringify(produtosMockados));
    
    // Também salvar nos dados globais
    const produtosGlobais = JSON.parse(localStorage.getItem('zdelivery_produtos_globais') || '{}');
    produtosGlobais[user?.nome || 'Restaurante'] = produtosMockados;
    localStorage.setItem('zdelivery_produtos_globais', JSON.stringify(produtosGlobais));
  };

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    disponivel: true,
    imagem: ''
  });

  const [novoAdicional, setNovoAdicional] = useState({
    nome: '',
    tipo: 'unico',
    obrigatorio: false,
    opcoes: [{ nome: '', preco: '' }]
  });

  const salvarProdutos = (novosProdutos: any[]) => {
    setProdutos(novosProdutos);
    localStorage.setItem('restaurant_products', JSON.stringify(novosProdutos));
    
    // Também salvar em uma chave global para que o cliente possa acessar
    const produtosGlobais = JSON.parse(localStorage.getItem('zdelivery_produtos_globais') || '{}');
    produtosGlobais[user.nome] = novosProdutos;
    localStorage.setItem('zdelivery_produtos_globais', JSON.stringify(produtosGlobais));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.categoria) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    if (editingProduct) {
      // Editar produto existente
      const produtosAtualizados = produtos.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, preco: parseFloat(formData.preco) }
          : p
      );
      salvarProdutos(produtosAtualizados);
      
      toast({
        title: 'Produto atualizado!',
        description: 'O produto foi atualizado com sucesso.',
      });
    } else {
      // Adicionar novo produto
      const novoProduto = {
        ...formData,
        id: Date.now().toString(),
        preco: parseFloat(formData.preco),
        adicionais: []
      };
      salvarProdutos([...produtos, novoProduto]);
      
      toast({
        title: 'Produto adicionado!',
        description: 'O produto foi adicionado ao cardápio.',
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      disponivel: true,
      imagem: ''
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (produto: any) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      categoria: produto.categoria,
      disponivel: produto.disponivel,
      imagem: produto.imagem
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (produtoId: string) => {
    const produtosAtualizados = produtos.filter(p => p.id !== produtoId);
    salvarProdutos(produtosAtualizados);
    
    toast({
      title: 'Produto removido!',
      description: 'O produto foi removido do cardápio.',
    });
  };

  const toggleDisponibilidade = (produtoId: string) => {
    const produtosAtualizados = produtos.map(p => 
      p.id === produtoId ? { ...p, disponivel: !p.disponivel } : p
    );
    salvarProdutos(produtosAtualizados);
  };

  const handleAdicionais = (produto: any) => {
    setProdutoAdicionais(produto);
    setShowAdicionaisDialog(true);
  };

  const adicionarOpcaoAdicional = () => {
    setNovoAdicional({
      ...novoAdicional,
      opcoes: [...novoAdicional.opcoes, { nome: '', preco: '' }]
    });
  };

  const removerOpcaoAdicional = (index: number) => {
    setNovoAdicional({
      ...novoAdicional,
      opcoes: novoAdicional.opcoes.filter((_, i) => i !== index)
    });
  };

  const salvarAdicional = () => {
    if (!novoAdicional.nome || novoAdicional.opcoes.some(op => !op.nome || !op.preco)) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos do adicional.',
        variant: 'destructive'
      });
      return;
    }

    const adicional = {
      id: Date.now().toString(),
      ...novoAdicional,
      opcoes: novoAdicional.opcoes.map(op => ({
        id: Date.now().toString() + Math.random(),
        nome: op.nome,
        preco: parseFloat(op.preco)
      }))
    };

    const produtosAtualizados = produtos.map(p => 
      p.id === produtoAdicionais.id 
        ? { ...p, adicionais: [...(p.adicionais || []), adicional] }
        : p
    );
    salvarProdutos(produtosAtualizados);

    setNovoAdicional({
      nome: '',
      tipo: 'unico',
      obrigatorio: false,
      opcoes: [{ nome: '', preco: '' }]
    });

    toast({
      title: 'Adicional criado!',
      description: 'Adicional foi adicionado ao produto.',
    });
  };

  const removerAdicional = (produtoId: string, adicionalId: string) => {
    const produtosAtualizados = produtos.map(p => 
      p.id === produtoId 
        ? { ...p, adicionais: p.adicionais?.filter((a: any) => a.id !== adicionalId) }
        : p
    );
    salvarProdutos(produtosAtualizados);
  };

  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));
  const categoriasDisponiveis = [
    'Pizzas', 'Hamburgueres', 'Lanches', 'Bebidas', 'Doces', 'Sobremesas',
    'Pratos Principais', 'Entradas', 'Saladas', 'Massas', 'Grelhados'
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="restaurante" userName={user.nome} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gerenciar Produtos
              </h1>
              <p className="text-gray-600">
                Gerencie o cardápio do seu restaurante
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: Pizza Margherita"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      placeholder="Descreva os ingredientes e características"
                      required
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preco">Preço (R$) *</Label>
                      <Input
                        id="preco"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.preco}
                        onChange={(e) => setFormData({...formData, preco: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoria">Categoria *</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriasDisponiveis.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <ImageUpload
                    label="Imagem do Produto"
                    value={formData.imagem}
                    onChange={(imageUrl) => setFormData({...formData, imagem: imageUrl})}
                    maxSizeMB={3}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="disponivel"
                      checked={formData.disponivel}
                      onCheckedChange={(checked) => setFormData({...formData, disponivel: checked})}
                    />
                    <Label htmlFor="disponivel">Produto disponível</Label>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                      {editingProduct ? 'Atualizar' : 'Adicionar'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lista de Produtos por Categoria */}
        {categorias.length > 0 ? (
          <div className="space-y-8">
            {categorias.map(categoria => (
              <div key={categoria}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{categoria}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produtos
                    .filter(produto => produto.categoria === categoria)
                    .map(produto => (
                      <Card key={produto.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{produto.nome}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{produto.descricao}</p>
                              <p className="font-bold text-green-600 text-xl">
                                R$ {produto.preco.toFixed(2)}
                              </p>
                              {produto.adicionais && produto.adicionais.length > 0 && (
                                <p className="text-xs text-blue-600 mt-1">
                                  ✨ {produto.adicionais.length} adicional(is)
                                </p>
                              )}
                            </div>
                            {produto.imagem && (
                              <img 
                                src={produto.imagem} 
                                alt={produto.nome}
                                className="w-16 h-16 object-cover rounded-lg ml-3 border"
                              />
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={produto.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {produto.disponivel ? 'Disponível' : 'Indisponível'}
                            </Badge>
                            <Switch
                              checked={produto.disponivel}
                              onCheckedChange={() => toggleDisponibilidade(produto.id)}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(produto)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAdicionais(produto)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(produto.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto cadastrado
            </h3>
            <p className="text-gray-500 mb-6">
              Comece adicionando produtos ao seu cardápio
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          </div>
        )}
      </main>

      {/* Dialog de Adicionais */}
      <Dialog open={showAdicionaisDialog} onOpenChange={setShowAdicionaisDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Adicionais - {produtoAdicionais?.nome}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Lista de Adicionais Existentes */}
            {produtoAdicionais?.adicionais && produtoAdicionais.adicionais.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Adicionais Configurados:</h3>
                <div className="space-y-3">
                  {produtoAdicionais.adicionais.map((adicional: any) => (
                    <Card key={adicional.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{adicional.nome}</h4>
                            <p className="text-sm text-gray-600">
                              {adicional.tipo === 'unico' ? 'Escolha única' : 'Múltipla escolha'} 
                              {adicional.obrigatorio && ' • Obrigatório'}
                            </p>
                            <div className="mt-2 space-y-1">
                              {adicional.opcoes?.map((opcao: any) => (
                                <div key={opcao.id} className="text-sm flex justify-between">
                                  <span>{opcao.nome}</span>
                                  <span>+R$ {opcao.preco.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removerAdicional(produtoAdicionais.id, adicional.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Formulário de Novo Adicional */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Novo Adicional:</h3>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Adicional</Label>
                  <Input
                    placeholder="Ex: Borda Recheada, Molhos Extra"
                    value={novoAdicional.nome}
                    onChange={(e) => setNovoAdicional({...novoAdicional, nome: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Seleção</Label>
                    <Select value={novoAdicional.tipo} onValueChange={(value) => setNovoAdicional({...novoAdicional, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unico">Escolha única</SelectItem>
                        <SelectItem value="multiplo">Múltipla escolha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={novoAdicional.obrigatorio}
                      onCheckedChange={(checked) => setNovoAdicional({...novoAdicional, obrigatorio: checked})}
                    />
                    <Label>Obrigatório</Label>
                  </div>
                </div>

                <div>
                  <Label>Opções:</Label>
                  <div className="space-y-2 mt-2">
                    {novoAdicional.opcoes.map((opcao, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Nome da opção"
                          value={opcao.nome}
                          onChange={(e) => {
                            const novasOpcoes = [...novoAdicional.opcoes];
                            novasOpcoes[index].nome = e.target.value;
                            setNovoAdicional({...novoAdicional, opcoes: novasOpcoes});
                          }}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Preço"
                          value={opcao.preco}
                          onChange={(e) => {
                            const novasOpcoes = [...novoAdicional.opcoes];
                            novasOpcoes[index].preco = e.target.value;
                            setNovoAdicional({...novoAdicional, opcoes: novasOpcoes});
                          }}
                          className="w-24"
                        />
                        {novoAdicional.opcoes.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removerOpcaoAdicional(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={adicionarOpcaoAdicional}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Opção
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={salvarAdicional}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Salvar Adicional
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAdicionaisDialog(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProdutosPage;
