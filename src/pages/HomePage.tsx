import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Store, Users, ShoppingCart, Check } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Z Delivery</h1>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-red-200">
                  Login
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Seu delivery favorito chegou!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conectamos você aos melhores restaurantes da cidade. Peça com facilidade e receba em casa rapidinho!
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Para cada necessidade
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Para Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Descubra os melhores restaurantes, faça pedidos e acompanhe a entrega em tempo real.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Milhares de restaurantes</li>
                  <li>• Rastreamento em tempo real</li>
                  <li>• Avaliações e comentários</li>
                  <li>• Pagamento seguro</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Store className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Para Restaurantes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Gerencie seu cardápio, receba pedidos e aumente suas vendas com nossa plataforma.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Dashboard completo</li>
                  <li>• Gestão de cardápio</li>
                  <li>• Controle de pedidos</li>
                  <li>• Relatórios de vendas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Para Entregadores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Trabalhe quando quiser, aceite entregas próximas e ganhe dinheiro extra.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Flexibilidade total</li>
                  <li>• Entregas próximas</li>
                  <li>• Pagamento semanal</li>
                  <li>• Suporte 24/7</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Planos para Restaurantes
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Escolha o plano ideal para seu restaurante e comece a vender no Z Delivery
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Básico */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">Básico</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  R$ 29
                  <span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
                <p className="text-gray-600">Perfeito para começar</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Até 50 pedidos/mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Cardápio básico</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Suporte por email</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Relatórios básicos</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  Começar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="relative hover:shadow-lg transition-shadow border-2 border-red-500">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-red-500 text-white px-3 py-1">Mais Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">Premium</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  R$ 79
                  <span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
                <p className="text-gray-600">Para restaurantes em crescimento</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Pedidos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Cardápio completo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Relatórios avançados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Promoções e cupons</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Destaque na busca</span>
                  </li>
                </ul>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Assinar Premium
                </Button>
              </CardContent>
            </Card>

            {/* Plano Enterprise */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  R$ 149
                  <span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
                <p className="text-gray-600">Para grandes redes</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Tudo do Premium</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Múltiplas filiais</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Gerente de conta</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Integração personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Suporte 24/7</span>
                  </li>
                </ul>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  Contatar Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de usuários que já usam o Z Delivery
          </p>
          <div className="space-x-4">
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                Fazer Login
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Z Delivery</h3>
          <p className="text-gray-400 mb-4">
            O seu delivery favorito - Conectando pessoas, restaurantes e entregadores
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 Z Delivery. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
