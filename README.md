# 🎬 Movie Plots - Aplicação Full Stack

Aplicação full stack desenvolvida em TypeScript para buscar informações de filmes e exibir seus títulos e plots traduzidos para português.

## 📋 Descrição

Esta aplicação permite aos usuários buscar informações de filmes através de uma interface web moderna. O sistema busca dados na API OMDB (Open Movie Database), traduz automaticamente o plot do inglês para português usando um serviço de tradução, e exibe tanto o título quanto a sinopse traduzida.

## 🏗️ Arquitetura do Projeto

O projeto está dividido em duas partes principais:

```
movie-plots/
├── backend/          # API REST (Node.js + Express + TypeScript)
└── frontend/         # Interface Web (React + TypeScript + Vite)
```

### 📁 Estrutura Detalhada

#### Backend (`/backend`)

```
backend/
├── src/
│   ├── server.ts              # 🚀 Ponto de entrada - inicia o servidor Express
│   ├── app.ts                 # ⚙️ Configuração do Express (middlewares, CORS)
│   │
│   ├── routes/                # 🛣️ Definição de rotas HTTP
│   │   ├── index.ts           # Configuração central de todas as rotas
│   │   └── movieRoute.ts      # Rotas específicas para operações com filmes
│   │
│   ├── controllers/           # 🎮 Controladores - lidam com requisições HTTP
│   │   └── MovieController.ts # Processa requisições de busca de filmes
│   │
│   ├── services/              # 💼 Camada de lógica de negócio
│   │   └── MovieService.ts    # Orquestra chamadas de API e processa dados
│   │
│   ├── utils/                 # 🔧 Utilitários e funções auxiliares
│   │   ├── apiConnect.ts      # Funções para conectar com APIs externas (OMDB e tradução)
│   │   └── helpers.ts         # Funções auxiliares de formatação
│   │
│   └── types/                 # 📝 Definições de tipos TypeScript
│       ├── MovieInfo.ts       # Interface para informações de filme (título e plot)
│       ├── MovieQuery.ts      # Interface para query string de busca
│       ├── OmdbMovieResponse.ts # Interface para resposta da API OMDB
│       ├── omdbSearchResponse.ts # Interface para resposta de busca OMDB
│       └── translation.ts     # Interface para resultado de tradução
│
├── package.json               # Dependências e scripts do backend
├── tsconfig.json              # Configuração do TypeScript
└── .env                       # Variáveis de ambiente (API_KEY, PORT)
```

#### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── main.tsx               # 🚀 Ponto de entrada - renderiza a aplicação React
│   ├── App.tsx                # 📱 Componente raiz da aplicação
│   ├── index.css              # 🎨 Estilos globais (Tailwind CSS)
│   │
│   ├── components/            # 🧩 Componentes React
│   │   ├── MovieSearch.tsx    # Componente principal de busca e exibição
│   │   └── Spinner.tsx        # Componente de loading (spinner animado)
│   │
│   ├── services/              # 🌐 Serviços de comunicação com API
│   │   └── api.ts             # Função para fazer requisições ao backend
│   │
│   └── types/                 # 📝 Definições de tipos TypeScript
│       └── MovieResponse.ts   # Interface para resposta da API do backend
│
├── index.html                 # HTML base da aplicação
├── package.json               # Dependências e scripts do frontend
├── vite.config.ts             # Configuração do Vite (build tool)
├── tailwind.config.js         # Configuração do Tailwind CSS
└── tsconfig.json              # Configuração do TypeScript
```

## 🔄 Fluxo Completo de Dados

### 1. **Inicialização do Sistema**

```
┌─────────────────┐
│  Usuário abre   │
│  o navegador    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  main.tsx       │ → Renderiza App.tsx
│  (React)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  App.tsx        │ → Renderiza MovieSearch
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MovieSearch    │ → Interface carregada, aguardando input
└─────────────────┘
```

### 2. **Busca de Filme (Fluxo Completo)**

```
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 1: Usuário digita nome do filme e clica em "Buscar"      │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 2: MovieSearch.handleSearch()                            │
│   - Valida se o campo não está vazio                           │
│   - Ativa loading (setLoading(true))                           │
│   - Limpa estados anteriores (error, plot, title)              │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 3: api.ts - fetchMovie(movieName)                       │
│   - Constrói URL: http://localhost:3000/movie/search?movie=... │
│   - Faz requisição GET para o backend                          │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 4: Backend - server.ts                                   │
│   - Servidor Express recebe a requisição                       │
│   - Roteia para app.ts                                          │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 5: app.ts                                                │
│   - Middleware CORS permite requisição do frontend              │
│   - Middleware JSON parseia o corpo (se houver)                 │
│   - Roteia para routes/index.ts                                │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 6: routes/index.ts                                       │
│   - Identifica que a rota é /movie/search                       │
│   - Roteia para routes/movieRoute.ts                           │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 7: routes/movieRoute.ts                                  │
│   - Rota GET /search mapeada para MovieController.getMoviePlot  │
│   - Chama o controller                                          │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 8: MovieController.getMoviePlot()                        │
│   - Extrai req.query.movie (nome do filme)                     │
│   - Valida se o parâmetro foi fornecido                         │
│   - Chama MovieService.getMovieInfo(movieName)                  │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 9: MovieService.getMovieInfo()                           │
│   - Chama apiConnect.fetchMovie(movieName)                      │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 10: apiConnect.fetchMovie()                              │
│   - Constrói URL: http://www.omdbapi.com/?apikey=...&t=...     │
│   - Faz requisição GET para API OMDB                           │
│   - Valida resposta                                             │
│   - Retorna { Title, Plot, Response, Error }                   │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 11: API OMDB (Externa)                                   │
│   - Busca informações do filme no banco de dados                 │
│   - Retorna JSON com dados do filme (título e plot em inglês)  │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 12: MovieService.getMovieInfo() (continuação)          │
│   - Recebe OmdbMovieResponse                                    │
│   - Converte para MovieInfo { title, plot }                    │
│   - Retorna para o controller                                   │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 13: MovieController.getMoviePlot() (continuação)        │
│   - Recebe MovieInfo com título e plot em inglês               │
│   - Chama MovieService.getTranslation(movieInfo)               │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 14: MovieService.getTranslation()                        │
│   - Extrai o plot do movieInfo                                 │
│   - Chama apiConnect.fetchTranslation(movieInfo.plot)           │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 15: apiConnect.fetchTranslation()                       │
│   - Constrói URL: http://localhost:5000/translate              │
│   - Faz requisição POST com:                                   │
│     { q: plot, source: 'en', target: 'pt', format: 'text' }    │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 16: Serviço de Tradução (localhost:5000)                │
│   - Recebe o plot em inglês                                    │
│   - Traduz para português                                      │
│   - Retorna { translatedText: "plot traduzido" }                │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 17: MovieController.getMoviePlot() (finalização)        │
│   - Recebe Translation com texto traduzido                     │
│   - Monta resposta JSON:                                        │
│     { title: movieInfo.title, plot: translatedText }           │
│   - Retorna HTTP 200 com os dados                              │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 18: Frontend - api.ts                                    │
│   - Recebe resposta HTTP 200                                   │
│   - Converte JSON para objeto                                  │
│   - Retorna MovieResponse { title, plot }                      │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 19: MovieSearch.handleSearch() (finalização)             │
│   - Recebe MovieResponse                                       │
│   - Atualiza estados:                                          │
│     setTitle(result.title)                                     │
│     setPlot(result.plot)                                       │
│   - Desativa loading (setLoading(false))                       │
└───────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 20: React Re-render                                      │
│   - Componente MovieSearch re-renderiza                        │
│   - Exibe título e plot traduzido na interface                │
│   - Usuário vê o resultado                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 📄 Descrição Detalhada de Cada Arquivo

### Backend

#### `server.ts`
- **Propósito**: Ponto de entrada do servidor
- **Responsabilidades**:
  - Carrega variáveis de ambiente (.env)
  - Importa a aplicação Express configurada
  - Inicia o servidor HTTP na porta especificada
  - Configura handlers de eventos (erro, listening)

#### `app.ts`
- **Propósito**: Configuração central do Express
- **Responsabilidades**:
  - Cria instância do Express
  - Configura middleware CORS (permite requisições do frontend)
  - Configura middleware JSON (parseia corpo das requisições)
  - Registra todas as rotas através de `routes()`

#### `routes/index.ts`
- **Propósito**: Organizador central de rotas
- **Responsabilidades**:
  - Define rotas globais (ex: rota raiz "/")
  - Registra routers específicos (ex: `/movie` → `movieRoutes`)
  - Configura middlewares globais

#### `routes/movieRoute.ts`
- **Propósito**: Define rotas específicas para operações com filmes
- **Responsabilidades**:
  - Mapeia `GET /search` para `MovieController.getMoviePlot`
  - Organiza rotas relacionadas a filmes em um router separado

#### `controllers/MovieController.ts`
- **Propósito**: Camada de controle HTTP
- **Responsabilidades**:
  - Recebe requisições HTTP
  - Valida parâmetros de entrada (query string)
  - Chama serviços apropriados
  - Formata e retorna respostas HTTP
  - Trata erros e retorna códigos de status apropriados

#### `services/MovieService.ts`
- **Propósito**: Camada de lógica de negócio
- **Responsabilidades**:
  - Orquestra chamadas de API externas
  - Processa e transforma dados
  - Coordena busca de filme e tradução
  - Mantém a lógica de negócio separada do HTTP

#### `utils/apiConnect.ts`
- **Propósito**: Comunicação com APIs externas
- **Funções**:
  - `fetchMovie()`: Busca filme na API OMDB
  - `fetchTranslation()`: Traduz texto usando serviço de tradução
- **Responsabilidades**:
  - Construir URLs de API
  - Fazer requisições HTTP
  - Validar respostas
  - Tratar erros de API

#### `utils/helpers.ts`
- **Propósito**: Funções auxiliares de formatação
- **Funções**:
  - `formatMovieObject()`: Converte dados da API OMDB para formato interno

#### `types/*.ts`
- **Propósito**: Definições de tipos TypeScript
- **Arquivos**:
  - `MovieInfo.ts`: Interface para dados de filme (title, plot)
  - `OmdbMovieResponse.ts`: Interface para resposta da API OMDB
  - `MovieQuery.ts`: Interface para query string
  - `translation.ts`: Interface para resultado de tradução

### Frontend

#### `main.tsx`
- **Propósito**: Ponto de entrada da aplicação React
- **Responsabilidades**:
  - Renderiza o componente raiz no DOM
  - Configura StrictMode para desenvolvimento

#### `App.tsx`
- **Propósito**: Componente raiz da aplicação
- **Responsabilidades**:
  - Renderiza o componente principal (MovieSearch)

#### `components/MovieSearch.tsx`
- **Propósito**: Componente principal da interface
- **Responsabilidades**:
  - Gerencia estado da interface (input, loading, dados, erros)
  - Renderiza formulário de busca
  - Chama API quando usuário busca filme
  - Exibe título e plot traduzido
  - Trata erros e exibe mensagens

#### `components/Spinner.tsx`
- **Propósito**: Componente de loading
- **Responsabilidades**:
  - Renderiza animação de carregamento
  - Usado durante requisições HTTP

#### `services/api.ts`
- **Propósito**: Comunicação com o backend
- **Funções**:
  - `fetchMovie()`: Faz requisição GET para buscar filme
- **Responsabilidades**:
  - Construir URLs de API
  - Fazer requisições HTTP
  - Tratar erros e extrair mensagens
  - Converter respostas JSON

#### `types/MovieResponse.ts`
- **Propósito**: Definição de tipo para resposta da API
- **Estrutura**: `{ title: string, plot: string }`

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Chave de API do OMDB (obtenha em: http://www.omdbapi.com/apikey.aspx)
- Serviço de tradução rodando em `http://localhost:5000/translate`

### Instalação

1. **Clone o repositório ou navegue até a pasta do projeto**

2. **Instale dependências do backend:**
```bash
cd backend
npm install
```

3. **Instale dependências do frontend:**
```bash
cd ../frontend
npm install
```

4. **Configure o backend:**
   - Crie um arquivo `.env` na pasta `backend/`:
   ```env
   API_KEY=sua_chave_api_omdb_aqui
   PORT=3000
   ```

### Executando

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
O servidor estará rodando em `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
A aplicação estará rodando em `http://localhost:5173` (ou porta do Vite)

**Terminal 3 - Serviço de Tradução (se necessário):**
```bash
# Inicie seu serviço de tradução na porta 5000
```

## 📡 Endpoints da API

### GET `/`
Rota inicial - retorna mensagem de boas-vindas.

**Resposta:**
```json
{
  "message": "Rota inicial"
}
```

### GET `/movie/search?movie=NomeDoFilme`
Busca informações de um filme e retorna título e plot traduzido.

**Parâmetros:**
- `movie` (query string, obrigatório): Nome do filme a ser buscado

**Exemplo:**
```
GET http://localhost:3000/movie/search?movie=Inception
```

**Resposta de sucesso (200):**
```json
{
  "title": "Inception",
  "plot": "Um ladrão especializado em extrair segredos do subconsciente..."
}
```

**Respostas de erro:**
- `400`: Parâmetro 'movie' não fornecido
- `500`: Erro ao buscar o filme ou traduzir o plot

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **TypeScript**: Superset do JavaScript com tipagem estática
- **Express**: Framework web para Node.js
- **CORS**: Middleware para permitir requisições cross-origin
- **dotenv**: Gerenciamento de variáveis de ambiente

### Frontend
- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS utilitário

### APIs Externas
- **OMDB API**: API para informações de filmes
- **Serviço de Tradução**: API local para tradução de textos

## 📝 Scripts Disponíveis

### Backend
- `npm run dev`: Executa em modo desenvolvimento (ts-node)
- `npm run build`: Compila TypeScript para JavaScript
- `npm start`: Executa versão compilada

### Frontend
- `npm run dev`: Inicia servidor de desenvolvimento (Vite)
- `npm run build`: Compila para produção
- `npm run preview`: Preview da build de produção

## 🔍 Fluxo de Dados Resumido

```
Usuário → Frontend (React) → Backend (Express) → API OMDB
                                                      ↓
Usuário ← Frontend (React) ← Backend (Express) ← Tradução ← Plot em inglês
```

## 🐛 Tratamento de Erros

A aplicação trata os seguintes casos:

1. **Filme não encontrado**: Retorna erro da API OMDB
2. **Erro na API OMDB**: Erro de rede ou API indisponível
3. **Erro no serviço de tradução**: Serviço não disponível ou erro de tradução
4. **Parâmetros ausentes**: Validação no controller
5. **Erros genéricos**: Tratamento genérico com mensagens apropriadas

Todos os erros retornam JSON com mensagem descritiva e código HTTP apropriado.

## 📦 Estrutura de Dados

### MovieInfo (Backend)
```typescript
{
  title: string;  // Título do filme
  plot: string;   // Sinopse do filme
}
```

### MovieResponse (Frontend)
```typescript
{
  title: string;  // Título do filme
  plot: string;   // Plot traduzido para português
}
```

### OmdbMovieResponse
```typescript
{
  Title: string;              // Título (formato API OMDB)
  Plot: string;               // Sinopse (formato API OMDB)
  Response: "True" | "False"; // Status da resposta
  Error?: string;             // Mensagem de erro, se houver
}
```

## 📄 Licença

ISC
