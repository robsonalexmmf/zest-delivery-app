
# Z Delivery - Sistema de Delivery Completo 🍕🚚

Um sistema completo de delivery estilo iFood desenvolvido com React.js, TypeScript e Tailwind CSS. O sistema possui interfaces separadas para **Clientes**, **Restaurantes** e **Entregadores** com funcionalidades completas de pedidos, gestão e entregas.

## 🚀 Funcionalidades

### 👤 **Para Clientes**
- ✅ Cadastro e login seguro
- 🏪 Navegação por restaurantes com filtros por categoria
- 🍔 Visualização de cardápios com produtos detalhados
- 🛒 Carrinho de compras com controle de quantidade
- 💳 Sistema de pagamento (PIX e Cartão fictício)
- 🎫 Sistema de cupons de desconto
- 📍 Endereço de entrega personalizado
- 📱 Rastreamento de pedidos em tempo real
- ⭐ Sistema de avaliações

### 🏪 **Para Restaurantes**
- 📊 Dashboard completo com estatísticas de vendas
- 📋 Gestão de produtos (cadastrar, editar, deletar)
- 📦 Controle de pedidos recebidos
- 🔄 Atualização de status dos pedidos
- 💰 Relatórios de vendas e desempenho
- ⭐ Visualização de avaliações dos clientes

### 🚚 **Para Entregadores**
- 🎯 Dashboard com entregas disponíveis
- ✅ Sistema de aceite de pedidos
- 🗺️ Visualização de endereços (interface mockada)
- 📱 Controle de status das entregas
- 💵 Acompanhamento de ganhos
- ⏰ Controle de disponibilidade (online/offline)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router DOM
- **Estado**: React Hooks + LocalStorage
- **Ícones**: Lucide React
- **Build**: Vite
- **Componentes**: shadcn/ui (Radix UI)

## 🎯 Como Usar o Sistema

### 1. **Faça Login**
Acesse `/login` e use uma das contas de teste:

- **Cliente**: `cliente@test.com` / `123456`
- **Restaurante**: `restaurante@test.com` / `123456`
- **Entregador**: `entregador@test.com` / `123456`

### 2. **Navegue pelo Sistema**
Cada tipo de usuário será redirecionado para sua interface específica:

- **Clientes** → Lista de restaurantes
- **Restaurantes** → Dashboard administrativo
- **Entregadores** → Dashboard de entregas

### 3. **Teste as Funcionalidades**

#### Como Cliente:
1. Navegue pelos restaurantes
2. Clique em um restaurante para ver o cardápio
3. Adicione produtos ao carrinho
4. Finalize o pedido com endereço e pagamento
5. Acompanhe o status do pedido

#### Como Restaurante:
1. Veja estatísticas no dashboard
2. Gerencie produtos e pedidos
3. Atualize status dos pedidos recebidos

#### Como Entregador:
1. Ative/desative sua disponibilidade
2. Veja entregas disponíveis
3. Aceite entregas e atualize status

## 📱 Dados de Demonstração

O sistema inclui dados mockados completos:

- **10 Restaurantes** com diferentes categorias
- **20+ Produtos** variados com imagens
- **5 Entregadores** cadastrados
- **Pedidos de exemplo** para demonstração
- **Sistema de cupons** funcionais

### 🎫 Cupons de Teste:
- `DESCONTO10` - 10% de desconto
- `PRIMEIRACOMPRA` - 15% de desconto
- `FRETEGRATIS` - 5% de desconto

## 🚀 Como Executar Localmente

```bash
# 1. Clone o repositório
git clone <seu-repositorio>

# 2. Entre no diretório
cd z-delivery

# 3. Instale as dependências
npm install

# 4. Execute o projeto
npm run dev

# 5. Acesse no navegador
http://localhost:8080
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Auth/            # Componentes de autenticação
│   ├── Cliente/         # Componentes específicos do cliente
│   ├── Layout/          # Componentes de layout (Header, etc)
│   └── ui/              # Componentes base do shadcn/ui
├── data/                # Dados mockados
│   └── mockData.ts      # Dados de restaurantes, produtos, etc
├── pages/               # Páginas da aplicação
│   ├── Cliente/         # Páginas do cliente
│   ├── Restaurante/     # Páginas do restaurante
│   ├── Entregador/      # Páginas do entregador
│   └── HomePage.tsx     # Página inicial
├── hooks/               # Hooks customizados
└── lib/                 # Utilitários
```

## 🎨 Design e UX

- **Design Responsivo** - Funciona perfeitamente em desktop e mobile
- **Interface Intuitiva** - Navegação clara e fácil de usar
- **Feedback Visual** - Toasts, loading states e animações suaves
- **Tema Consistente** - Paleta de cores vermelha inspirada no iFood
- **Componentes Modernos** - Usando shadcn/ui para uma aparência profissional

## 🔐 Sistema de Autenticação

- **Login separado** por tipo de usuário
- **Proteção de rotas** baseada no tipo de usuário
- **Persistência de sessão** via localStorage
- **Redirecionamento automático** para área específica

## 📦 Funcionalidades Avançadas

### Sistema de Carrinho
- Adicionar/remover produtos
- Controle de quantidade
- Cálculo automático de totais
- Sistema de cupons
- Múltiplas formas de pagamento

### Rastreamento de Pedidos
- Status em tempo real (mockado)
- Histórico completo de pedidos
- Estimativas de entrega
- Notificações de status

### Dashboard Administrativo
- Estatísticas de vendas
- Gráficos de performance
- Gestão completa de produtos
- Controle de pedidos

## 🌟 Próximos Passos (Roadmap)

Para tornar este sistema ainda mais completo, você pode adicionar:

1. **Backend Real**
   - API REST com Node.js + Express
   - Banco de dados MongoDB
   - Autenticação JWT real
   - WebSocket para tempo real

2. **Funcionalidades Avançadas**
   - Integração com mapas reais
   - Sistema de pagamento real
   - Notificações push
   - Chat entre usuários

3. **Melhorias de UX**
   - Modo escuro
   - PWA (Progressive Web App)
   - Otimizações de performance
   - Testes automatizados

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração. Sinta-se livre para usar, modificar e distribuir.

---

**Z Delivery** - Conectando pessoas, restaurantes and entregadores! 🚀

Desenvolvido com ❤️ usando React.js + TypeScript + Tailwind CSS
