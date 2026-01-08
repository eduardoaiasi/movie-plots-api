# Movie Plots API

API REST desenvolvida em Node.js com TypeScript e Express para buscar informações de filmes e traduzir seus plots para português.

## 📋 Descrição

Esta aplicação permite buscar informações de filmes através da API OMDB (Open Movie Database) e traduzir automaticamente o plot (sinopse) do inglês para português usando um serviço de tradução local.

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/
├── server.ts          # Ponto de entrada - inicializa o servidor
├── app.ts             # Configuração do Express
├── routes/            # Definição das rotas
│   ├── index.ts       # Configuração central de rotas
│   └── movieRoute.ts  # Rotas específicas de filmes
├── controllers/       # Controladores - lidam com requisições HTTP
│   └── MovieController.ts
├── services/          # Lógica de negócio
│   └── MovieService.ts
├── utils/             # Utilitários e funções auxiliares
│   ├── apiConnect.ts  # Conexão com APIs externas
│   └── helpers.ts     # Funções auxiliares
└── types/             # Definições de tipos TypeScript
    ├── MovieInfo.ts
    ├── MovieQuery.ts
    ├── omdbSearchResponse.ts
    └── translation.ts
```

## 🚀 Como usar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Chave de API do OMDB (obtenha em: http://www.omdbapi.com/apikey.aspx)
- Serviço de tradução rodando em `http://localhost:5000/translate`

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
API_KEY=sua_chave_api_omdb_aqui
PORT=3000
```

### Executando o projeto

**Modo de desenvolvimento:**
```bash
npm run dev
```

**Modo de produção:**
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida no `.env`)

## 📡 Endpoints

### GET `/`
Rota inicial da API - retorna uma mensagem de boas-vindas.

**Resposta:**
```json
{
  "message": "Rota inicial"
}
```

### GET `/movie/search?movie=NomeDoFilme`
Busca informações de um filme e retorna o plot traduzido para português.

**Parâmetros:**
- `movie` (query string, obrigatório): Nome do filme a ser buscado

**Exemplo de requisição:**
```
GET http://localhost:3000/movie/search?movie=Inception
```

**Resposta de sucesso (200):**
```json
"Um ladrão especializado em extrair segredos do subconsciente..."
```

**Respostas de erro:**
- `400`: Parâmetro 'movie' não fornecido
- `500`: Erro ao buscar o filme ou traduzir o plot

## 🔄 Fluxo de execução

1. **Requisição HTTP**: Cliente faz uma requisição GET para `/movie/search?movie=NomeDoFilme`

2. **Controller**: `MovieController.getMoviePlot` recebe a requisição, valida o parâmetro e chama o serviço

3. **Service**: `MovieService.getMovieInfo` busca o filme na API OMDB através de `fetchMovie`

4. **API Externa (OMDB)**: Retorna as informações do filme (título e plot em inglês)

5. **Service**: `MovieService.getTranslation` envia o plot para o serviço de tradução através de `fetchTranslation`

6. **Serviço de Tradução**: Traduz o texto do inglês para português

7. **Resposta**: O plot traduzido é retornado ao cliente

## 🛠️ Tecnologias utilizadas

- **Node.js**: Runtime JavaScript
- **TypeScript**: Superset do JavaScript com tipagem estática
- **Express**: Framework web para Node.js
- **dotenv**: Gerenciamento de variáveis de ambiente
- **OMDB API**: API externa para informações de filmes

## 📝 Scripts disponíveis

- `npm run dev`: Executa o projeto em modo de desenvolvimento usando ts-node
- `npm run build`: Compila o TypeScript para JavaScript na pasta `dist/`
- `npm start`: Executa a versão compilada do projeto

## ⚙️ Configuração

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Chave de API do OMDB (obrigatória)
API_KEY=sua_chave_aqui

# Porta do servidor (opcional, padrão: 3000)
PORT=3000
```

### Serviço de tradução

A aplicação espera que um serviço de tradução esteja rodando em `http://localhost:5000/translate`. O serviço deve aceitar requisições POST com o seguinte formato:

```json
{
  "q": "texto a traduzir",
  "source": "en",
  "target": "pt",
  "format": "text"
}
```

E retornar:

```json
{
  "translatedText": "texto traduzido"
}
```

## 📦 Estrutura de tipos

### MovieInfo
```typescript
{
  title: string;  // Título do filme
  plot: string;   // Sinopse do filme
}
```

### Translation
```typescript
{
  translatedText: string;  // Texto traduzido
}
```

## 🐛 Tratamento de erros

A aplicação trata os seguintes casos de erro:

- Filme não encontrado na API OMDB
- Erro na requisição à API OMDB
- Erro no serviço de tradução
- Parâmetros obrigatórios ausentes
- Erros genéricos do servidor

Todos os erros retornam uma resposta JSON com uma mensagem descritiva.

## 📄 Licença

ISC

