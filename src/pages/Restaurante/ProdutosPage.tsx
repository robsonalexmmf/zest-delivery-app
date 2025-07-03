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
import { Plus, Edit, Trash2, Package, Settings, Upload, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProdutosPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAdicionaisDialog, setShowAdicionaisDialog] = useState(false);
  const [produtoAdicionais, setProdutoAdicionais] = useState<any>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simular upload de imagem
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData({ ...formData, imagem: imageUrl });
        setImagemPreview(imageUrl);
        
        toast({
          title: 'Imagem carregada!',
          description: 'A imagem foi carregada com sucesso.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Editar produto existente
      setProdutos(produtos.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, preco: parseFloat(formData.preco) }
          : p
      ));
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
      setProdutos([...produtos, novoProduto]);
      toast({
        title: 'Produto adicionado!',
        description: 'O produto foi adicionado ao cardápio.',
      });
    }

    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      disponivel: true,
      imagem: ''
    });
    setImagemPreview('');
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
    setImagemPreview(produto.imagem);
    setIsDialogOpen(true);
  };

  const handleDelete = (produtoId: string) => {
    setProdutos(produtos.filter(p => p.id !== produtoId));
    toast({
      title: 'Produto removido!',
      description: 'O produto foi removido do cardápio.',
    });
  };

  const toggleDisponibilidade = (produtoId: string) => {
    setProdutos(produtos.map(p => 
      p.id === produtoId ? { ...p, disponivel: !p.disponivel } : p
    ));
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

    setProdutos(produtos.map(p => 
      p.id === produtoAdicionais.id 
        ? { ...p, adicionais: [...(p.adicionais || []), adicional] }
        : p
    ));

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
    setProdutos(produtos.map(p => 
      p.id === produtoId 
        ? { ...p, adicionais: p.adicionais?.filter((a: any) => a.id !== adicionalId) }
        : p
    ));
  };

  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));

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
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preco">Preço</Label>
                      <Input
                        id="preco"
                        type="number"
                        step="0.01"
                        value={formData.preco}
                        onChange={(e) => setFormData({...formData, preco: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Input
                        id="categoria"
                        value={formData.categoria}
                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="imagem">Imagem do Produto</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Input
                          id="imagem"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('imagem')?.click()}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Fazer Upload da Imagem
                        </Button>
                      </div>
                      {imagemPreview && (
                        <div className="flex items-center space-x-3">
                          <img 
                            src={imagemPreview} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-green-600 font-medium">
                              Imagem carregada com sucesso!
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setImagemPreview('');
                                setFormData({...formData, imagem: ''});
                              }}
                              className="mt-1 text-red-600"
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
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
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingProduct(null);
                        setImagemPreview('');
                        setFormData({
                          nome: '', descricao: '', preco: '', categoria: '', disponivel: true, imagem: ''
                        });
                      }}
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
                              <p className="text-gray-600 text-sm mb-2">{produto.descricao}</p>
                              <p className="font-bold text-green-600 text-xl">
                                R$ {produto.preco.toFixed(2)}
                              </p>
                              {produto.adicionais && produto.adicionais.length > 0 && (
                                <p className="text-xs text-blue-600 mt-1">
                                  ✨ {produto.adicionais.length} adicional(is)
                                </p>
                              )}
                            </div>
                            <img 
                              src={produto.imagem} 
                              alt={produto.nome}
                              className="w-16 h-16 object-cover rounded-lg ml-3"
                            />
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
