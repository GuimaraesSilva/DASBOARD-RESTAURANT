# ENGLISH VERSION
# Restaurant Analytics Dashboard

A complete and professional analytics dashboard for restaurant management, built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. The project offers advanced data visualization, real-time metrics, and a modern, responsive interface.

---

## Key Features

### **Overview Dashboard**
- General business metrics (revenue, orders, average ticket, occupancy rate)
- Top 3 best-selling products
- Top 3 VIP customers
- Payment method distribution
- Monthly profit analysis (Business Overview)
- Sales charts by category
- Review distribution and reservation status

### **Sales**
- Sales KPIs: total revenue, orders, average ticket, items sold
- Daily sales trend (last 7, 30, or 90 days)
- Sales by product category
- Sales heatmap by day of the week
- Sales analysis by hour of the day
- Top 10 best-selling products
- Last 15 orders with details

### **Products**
- Total products and stock value
- Average profit margin
- Low stock alerts
- Complete product table with category filters
- Profit margin analysis by product
- Top selling products with detailed metrics
- Product gallery with images and category navigation

### **Customers**
- Total customers and visits
- Cancellation and no-show rates
- Customer visits chart (top 10)
- Customer segmentation (VIP, New, At Risk, etc.)
- Table with segment filters and search
- Individual customer details in side sheet

### **Reservations**
- Total reservations and occupancy rate
- Reservations analysis by time and day of the week
- Next 5 confirmed reservations
- Cancellation analysis
- Complete reservation table with status

### **Reviews**
- Average rating and total reviews
- Rating distribution (1-5 stars)
- Review trend over time
- Top customers who review most
- Last 5 recent reviews
- Complete review table

---

## Technologies Used

- **[Next.js 14](https://nextjs.org/)** (App Router)
- **[React 18](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Shadcn/ui](https://ui.shadcn.com/)** - UI Components
- **[Recharts](https://recharts.org/)** - Chart library
- **[Lucide React](https://lucide.dev/)** - Icons
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives

---

## Project Structure

```
src/
├── app/                      # Next.js routes (App Router)
│   ├── customers/           # Customers page
│   ├── overview/            # Main dashboard
│   ├── products/            # Products page
│   ├── reservations/        # Reservations page
│   ├── reviews/             # Reviews page
│   ├── sales/               # Sales page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Main layout
│   └── page.tsx             # Home page
│
├── components/              # React components
│   ├── Customers/          # Customer components
│   ├── Header/             # Header
│   ├── Load/               # Loading provider
│   ├── Navbar/             # Navigation
│   ├── Overview/           # Dashboard components
│   ├── Products/           # Product components
│   ├── Reservations/       # Reservation components
│   ├── Reviews/            # Review components
│   ├── Sales/              # Sales components
│   └── ui/                 # Reusable UI components
│
├── data/                    # Mock data in JSON
│   ├── customers.json
│   ├── expenses.json
│   ├── orders.json
│   ├── products.json
│   ├── reservations.json
│   └── reviews.json
│
├── lib/                     # Utilities and helper functions
│   ├── calculationsOverview.ts  # Dashboard calculations
│   ├── metrics.ts               # Metrics and KPIs
│   ├── segments.ts              # Customer segmentation
│   └── utils.ts                 # Utility functions
│
└── types/                   # TypeScript definitions
    ├── dashboard.ts
    ├── metric.ts
    ├── metrics.ts
    ├── month.ts
    ├── overview.ts
    ├── payment.ts
    └── products.ts
```

---

## Data Structure

The project uses a realistic JSON dataset with:

- **Products** - Menu items (name, category, price, cost, stock)
- **Orders** - Placed orders (date, total, payment method, customer)
- **Order Items** - Items in each order
- **Customers** - Customers (visits, reservations, cancellations, no-shows)
- **Reservations** - Reservations (date, time, guests, status)
- **Reviews** - Reviews (rating, comment, date)
- **Expenses** - Monthly expenses

### Product Categories
- Meat (Carne)
- Beverages (Bebidas)
- Starters (Entradas)
- Desserts (Sobremesas)
- Acompanhamento

### Payment Methods
- MBWay
- Multibanco
- Cash (Numérico)
- Visa
- Mastercard

---

## How to Run

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Enter the directory
cd dasboard-restaurant

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Access [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

---

## Color Palette

The project uses a professional and consistent color palette:

- **Primary**: `#2C3E2D` - Dark green
- **Secondary**: `#536657` - Medium green
- **Accent**: `#BDA69F` - Rosy beige
- **Background**: `#CDDBC8` - Light green
- **Surface**: `#F5F5F5` - Light gray
- **Dark**: `#412A22` - Dark brown

---

## Responsiveness

The dashboard is fully responsive, adapting to:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

---

## Advanced Features

### Customer Segmentation
- **VIP** - More than 10 visits
- **New** - Less than 30 days since last visit
- **At Risk** - 30-90 days without visiting
- **Frequent Canceller** - Cancellation rate > 30%
- **No-show Risk** - No-show rate > 20%
- **Regular** - Normal customers

### Calculated Metrics
- Reservation occupancy rate
- Profit margin per product
- Average ticket
- Revenue per hour/day
- Sales trends
- Cancellation analysis

### Filters and Search
- Filter by product category
- Filter by customer segment
- Search by name, email, phone
- Filter by time period

---

## Project Objective

This project was developed to demonstrate:

**Modern Frontend Expertise**
- Advanced use of Next.js 14 with App Router
- TypeScript for type safety
- Reusable and modular components

**Professional UI/UX**
- Consistent design system
- Accessible components (Radix UI)
- Responsive and modern interface

**Data Management**
- Complex metric calculations
- Data aggregation and transformation
- Effective visualization with charts

**Best Practices**
- Clean and organized code
- Strong typing with TypeScript
- Proper componentization
- Optimized performance

---

## Author

Developed by **Fábio Silva**

---

# PORTUGUESE VERSION

# Restaurant Analytics Dashboard

Um dashboard completo e profissional de analytics para gestão de restaurante, desenvolvido com **Next.js 14**, **TypeScript** e **Tailwind CSS**. O projeto oferece visualização avançada de dados, métricas em tempo real e uma interface moderna e responsiva.

---

## Funcionalidades Principais

### **Overview Dashboard**
- Métricas gerais do negócio (receita, pedidos, ticket médio, taxa de ocupação)
- Top 3 produtos mais vendidos
- Top 3 clientes VIP
- Distribuição de métodos de pagamento
- Análise de lucro mensal (Business Overview)
- Gráficos de vendas por categoria
- Distribuição de avaliações e status de reservas

### **Sales (Vendas)**
- KPIs de vendas: receita total, pedidos, ticket médio, itens vendidos
- Tendência de vendas diárias (últimos 7, 30 ou 90 dias)
- Vendas por categoria de produto
- Heatmap de vendas por dia da semana
- Análise de vendas por hora do dia
- Top 10 produtos mais vendidos
- Últimos 15 pedidos com detalhes

### **Products (Produtos)**
- Total de produtos e valor em stock
- Margem de lucro média
- Alertas de stock baixo
- Tabela completa de produtos com filtros por categoria
- Análise de margem de lucro por produto
- Top produtos mais vendidos com métricas detalhadas
- Galeria de produtos com imagens e navegação por categorias

### **Customers (Clientes)**
- Total de clientes e visitas
- Taxa de cancelamento e no-show
- Gráfico de visitas por cliente (top 10)
- Segmentação de clientes (VIP, Novo, Em risco, etc.)
- Tabela com filtros por segmento e pesquisa
- Detalhes individuais de cada cliente em sheet lateral

### **Reservations (Reservas)**
- Total de reservas e taxa de ocupação
- Análise de reservas por horário e dia da semana
- Próximas 5 reservas confirmadas
- Análise de cancelamentos
- Tabela completa de reservas com status

### **Reviews (Avaliações)**
- Avaliação média e total de reviews
- Distribuição de ratings (1-5 estrelas)
- Tendência de avaliações ao longo do tempo
- Top clientes que mais avaliam
- Últimas 5 avaliações recentes
- Tabela completa de reviews

---

## Tecnologias Utilizadas

- **[Next.js 14](https://nextjs.org/)** (App Router)
- **[React 18](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos acessíveis

---

## Estrutura do Projeto

```
src/
├── app/                      # Rotas do Next.js (App Router)
│   ├── customers/           # Página de clientes
│   ├── overview/            # Dashboard principal
│   ├── products/            # Página de produtos
│   ├── reservations/        # Página de reservas
│   ├── reviews/             # Página de avaliações
│   ├── sales/               # Página de vendas
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
│
├── components/              # Componentes React
│   ├── Customers/          # Componentes de clientes
│   ├── Header/             # Cabeçalho
│   ├── Load/               # Loading provider
│   ├── Navbar/             # Navegação
│   ├── Overview/           # Componentes do dashboard
│   ├── Products/           # Componentes de produtos
│   ├── Reservations/       # Componentes de reservas
│   ├── Reviews/            # Componentes de avaliações
│   ├── Sales/              # Componentes de vendas
│   └── ui/                 # Componentes UI reutilizáveis
│
├── data/                    # Dados mock em JSON
│   ├── customers.json
│   ├── expenses.json
│   ├── orders.json
│   ├── products.json
│   ├── reservations.json
│   └── reviews.json
│
├── lib/                     # Utilitários e funções auxiliares
│   ├── calculationsOverview.ts  # Cálculos do dashboard
│   ├── metrics.ts               # Métricas e KPIs
│   ├── segments.ts              # Segmentação de clientes
│   └── utils.ts                 # Funções utilitárias
│
└── types/                   # Definições TypeScript
    ├── dashboard.ts
    ├── metric.ts
    ├── metrics.ts
    ├── month.ts
    ├── overview.ts
    ├── payment.ts
    └── products.ts
```

---

## Estrutura de Dados

O projeto utiliza um dataset realista em JSON com:

- **Products** - Produtos do menu (nome, categoria, preço, custo, stock)
- **Orders** - Pedidos realizados (data, total, método de pagamento, cliente)
- **Order Items** - Itens de cada pedido
- **Customers** - Clientes (visitas, reservas, cancelamentos, no-shows)
- **Reservations** - Reservas (data, hora, pessoas, status)
- **Reviews** - Avaliações (rating, comentário, data)
- **Expenses** - Despesas mensais

### Categorias de Produtos
- Carne
- Bebidas
- Entradas
- Sobremesas
- Acompanhamento

### Métodos de Pagamento
- MBWay
- Multibanco
- Numérico
- Visa
- Mastercard

---

## Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositório>

# Entre no diretório
cd dasboard-restaurant

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

---

## Paleta de Cores

O projeto utiliza uma paleta de cores profissional e consistente:

- **Primary**: `#2C3E2D` - Verde escuro
- **Secondary**: `#536657` - Verde médio
- **Accent**: `#BDA69F` - Bege rosado
- **Background**: `#CDDBC8` - Verde claro
- **Surface**: `#F5F5F5` - Cinza claro
- **Dark**: `#412A22` - Marrom escuro

---

## Responsividade

O dashboard é totalmente responsivo, adaptando-se a:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

---

## Funcionalidades Avançadas

### Segmentação de Clientes
- **VIP** - Mais de 10 visitas
- **Novo** - Menos de 30 dias desde última visita
- **Em risco** - 30-90 dias sem visitar
- **Cancelador frequente** - Taxa de cancelamento > 30%
- **Risco no-show** - Taxa de no-show > 20%
- **Regular** - Clientes normais

### Métricas Calculadas
- Taxa de ocupação de reservas
- Margem de lucro por produto
- Ticket médio
- Revenue por hora/dia
- Tendências de vendas
- Análise de cancelamentos

### Filtros e Pesquisa
- Filtro por categoria de produtos
- Filtro por segmento de clientes
- Pesquisa por nome, email, telefone
- Filtro por período de tempo

---

## Objetivo do Projeto

Este projeto foi desenvolvido para demonstrar:

**Expertise em Frontend Moderno**
- Uso avançado de Next.js 14 com App Router
- TypeScript para type safety
- Componentes reutilizáveis e modulares

**UI/UX Profissional**
- Design system consistente
- Componentes acessíveis (Radix UI)
- Interface responsiva e moderna

**Gestão de Dados**
- Cálculos complexos de métricas
- Agregação e transformação de dados
- Visualização eficaz com gráficos

**Boas Práticas**
- Código limpo e organizado
- Tipagem forte com TypeScript
- Componentização adequada
- Performance otimizada

---

## Licença

MIT License - Livre para uso e modificação.

---

## Autor

Desenvolvido por **Fábio Silva**

---


