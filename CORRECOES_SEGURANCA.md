# 🔧 Correções de Segurança - Guia de Implementação

## 📊 STATUS DE IMPLEMENTAÇÃO

**Última atualização:** Verificação do código atual

### ✅ **JÁ IMPLEMENTADO:**
1. ✅ Validação e Sanitização de Input (básica)
2. ✅ Logging Básico (console.log com timestamps)
3. ✅ Timeout em fetchMovie() (10 segundos)
4. ✅ Mensagens de Erro Específicas (401, 404, 429)
5. ✅ Validação de Variáveis de Ambiente (básica)
6. ✅ Health Check Endpoint

### ❌ **AINDA FALTA IMPLEMENTAR:**
1. ❌ CORS Configurado
2. ❌ Rate Limiting
3. ❌ Helmet.js
4. ❌ Ocultar Informações Sensíveis em Erros (produção)
5. ❌ URLs com Variáveis de Ambiente
6. ❌ Timeout em fetchTranslation()
7. ❌ Frontend com Variáveis de Ambiente
8. ❌ Limite de Tamanho de Payload
9. ❌ Logging Estruturado (Winston)
10. ❌ Validação Melhorada de Variáveis de Ambiente

---

## 🚨 Correções Críticas (Implementar Primeiro)

### 1. Configurar CORS Corretamente

**Arquivo:** `backend/src/app.ts`

**Antes:**
```typescript
app.use(cors());
```

**Depois:**
```typescript
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
    
    // Permite requisições sem origin (mobile apps, Postman, etc) apenas em desenvolvimento
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 horas
};

app.use(cors(corsOptions));
```

**Variável de ambiente (.env):**
```env
ALLOWED_ORIGINS=http://localhost:5173,https://seudominio.com
```

---

### 2. Implementar Rate Limiting

**Instalar dependência:**
```bash
cd backend
npm install express-rate-limit
npm install --save-dev @types/express-rate-limit
```

**Arquivo:** `backend/src/app.ts`

**Adicionar:**
```typescript
import rateLimit from 'express-rate-limit';

// Rate limiter geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
  },
  standardHeaders: true, // Retorna rate limit info nos headers
  legacyHeaders: false,
});

// Rate limiter mais restritivo para busca de filmes
const movieSearchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo 10 buscas por minuto
  message: {
    error: 'Muitas buscas. Aguarde 1 minuto antes de tentar novamente.'
  },
  skipSuccessfulRequests: false,
});

app.use(generalLimiter);
```

**Arquivo:** `backend/src/routes/movieRoute.ts`

**Adicionar:**
```typescript
import rateLimit from 'express-rate-limit';

const movieSearchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas buscas. Aguarde 1 minuto.' }
});

router.get("/search", movieSearchLimiter, MovieController.getMoviePlot);
```

---

### 3. Adicionar Helmet.js (Headers de Segurança)

**Instalar:**
```bash
cd backend
npm install helmet
```

**Arquivo:** `backend/src/app.ts`

**Adicionar:**
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Ajustar conforme necessário
}));
```

---

### 4. Validar e Sanitizar Inputs

**Status Atual:**
```typescript
// ✅ JÁ IMPLEMENTADO (básico):
const movieName = req.query.movie?.trim();
if(!movieName || movieName.length < 2) { /* validação */ }
if(movieName.length > 100) { /* validação */ }
const sanitized = movieName.replace(/[<>]/g, '');
```

**O que já está bom:**
- ✅ Validação de comprimento (mínimo 2, máximo 100)
- ✅ Sanitização básica (remove < e >)
- ✅ Input sanitizado é usado no serviço

**Melhoria Recomendada (usar biblioteca validator para produção):**

**Instalar:**
```bash
cd backend
npm install validator
npm install --save-dev @types/validator
```

**Arquivo:** `backend/src/controllers/MovieController.ts`

**Melhorar para:**
```typescript
import validator from 'validator';

static async getMoviePlot(
    req: Request<{}, {}, {}, MovieQuery>,
    res: Response
) {
    try {
        const movieName = req.query.movie;

        // Validação e sanitização
        if (!movieName || typeof movieName !== 'string') {
            return res.status(400).json({
                message: "Parâmetro 'movie' é obrigatório e deve ser uma string" 
            });
        }

        // Remove espaços e valida comprimento
        const trimmedName = movieName.trim();
        if (trimmedName.length === 0) {
            return res.status(400).json({
                message: "Nome do filme não pode estar vazio"
            });
        }

        if (trimmedName.length > 200) {
            return res.status(400).json({
                message: "Nome do filme muito longo (máximo 200 caracteres)"
            });
        }

        // Sanitiza para prevenir injection
        const sanitizedMovieName = validator.escape(trimmedName);

        // Valida se contém apenas caracteres permitidos
        if (!/^[a-zA-Z0-9\s\-'.,:!?()]+$/.test(trimmedName)) {
            return res.status(400).json({
                message: "Nome do filme contém caracteres inválidos"
            });
        }

        const movieInfo = await MovieService.getMovieInfo(sanitizedMovieName);
        // ... resto do código
```

---

### 5. Ocultar Informações Sensíveis em Erros

**Arquivo:** `backend/src/controllers/MovieController.ts`

**Status Atual:**
```typescript
// ⚠️ AINDA EXPÕE error.message EM PRODUÇÃO:
return res.status(500).json({ message: error.message });
```

**Modificar o tratamento de erros:**
```typescript
catch (error){
    if (error instanceof Error) {
        const isNotFound = (error as any).isNotFound || 
                           error.message.toLowerCase().includes('not found') ||
                           error.message.toLowerCase().includes('não encontrado') ||
                           error.message.toLowerCase().includes('movie not found');
        
        if (isNotFound) {
            return res.status(404).json({ 
                message: "Filme não encontrado. Verifique o nome e tente novamente." 
            });
        }
        
        // Em produção, não exponha detalhes do erro
        const isProduction = process.env.NODE_ENV === 'production';
        
        // Logar erro completo no servidor (não enviar ao cliente)
        console.error('Erro ao processar requisição:', {
            message: error.message,
            stack: isProduction ? undefined : error.stack,
            timestamp: new Date().toISOString()
        });
        
        return res.status(500).json({ 
            message: isProduction 
                ? 'Erro interno do servidor. Tente novamente mais tarde.'
                : error.message // Apenas em desenvolvimento
        });
    }
    
    return res.status(500).json({ 
        message: 'Erro interno do servidor' 
    });
}
```

---

### 6. Corrigir URLs e Usar Variáveis de Ambiente

**Arquivo:** `backend/src/utils/apiConnect.ts`

**Status Atual:**
```typescript
// ❌ URLs AINDA HARDCODED:
const URL = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${movieName}&plot=full`;
const URL = `http://localhost:5000/translate`;
```

**Modificar:**
```typescript
// No início do arquivo
const OMDB_BASE_URL = process.env.OMDB_BASE_URL || 'https://www.omdbapi.com';
const TRANSLATION_SERVICE_URL = process.env.TRANSLATION_SERVICE_URL || 'http://localhost:5000';

export async function fetchMovie(movieName: string): Promise<OmdbMovieResponse> {
    // Usar HTTPS
    const URL = `${OMDB_BASE_URL}/?apikey=${process.env.API_KEY}&t=${encodeURIComponent(movieName)}&plot=full`;
    
    // ... resto do código
}

export async function fetchTranslation(moviePlot: string): Promise<{ translatedText: string }> {
    const URL = `${TRANSLATION_SERVICE_URL}/translate`;
    
    // Adicionar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
        const res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                q: moviePlot,
                source: 'en',
                target: 'pt',
                format: 'text'
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
            throw new Error(`Erro na tradução: ${res.status}`);
        }
        
        return res.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Tempo de espera esgotado na tradução.');
        }
        throw error;
    }
}
```

**Arquivo:** `backend/.env`
```env
OMDB_BASE_URL=https://www.omdbapi.com
TRANSLATION_SERVICE_URL=http://localhost:5000
```

---

### 7. Configurar Frontend com Variáveis de Ambiente

**Arquivo:** `frontend/src/services/api.ts`

**Modificar:**
```typescript
// Usar variável de ambiente do Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchMovie(movieName: string): Promise<MovieResponse> {
    const response = await fetch(
        `${BASE_URL}/movie/search?movie=${encodeURIComponent(movieName)}`
    );
    // ... resto do código
}
```

**Arquivo:** `frontend/.env` (criar se não existir)
```env
VITE_API_URL=http://localhost:3000
```

**Arquivo:** `frontend/.env.production` (criar)
```env
VITE_API_URL=https://api.seudominio.com
```

---

### 8. Limitar Tamanho de Payload

**Arquivo:** `backend/src/app.ts`

**Status Atual:**
```typescript
// ⚠️ SEM LIMITE CONFIGURADO:
app.use(express.json());
```

**Modificar:**
```typescript
app.use(express.json({ 
    limit: '10mb', // Limite máximo do body
    strict: true // Apenas objetos e arrays JSON
}));

app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}));
```

---

### 9. Melhorar Validação de Variáveis de Ambiente

**Status Atual:**
```typescript
// ✅ JÁ IMPLEMENTADO (básico):
const requiredEnvVars = ['API_KEY', 'BASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) { /* erro */ }
```

**O que já está bom:**
- ✅ Valida existência das variáveis obrigatórias
- ✅ Exibe mensagem de erro clara

**Melhoria Recomendada (validar formato e valores):**

**Arquivo:** `backend/src/config/env.ts`

**Melhorar:**
```typescript
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validação de variáveis de ambiente
const requiredEnvVars = {
    API_KEY: {
        required: true,
        minLength: 10,
        description: 'Chave de API do OMDB'
    }
};

const optionalEnvVars = {
    PORT: {
        default: 3000,
        type: 'number',
        min: 1,
        max: 65535
    },
    OMDB_BASE_URL: {
        default: 'https://www.omdbapi.com',
        type: 'string'
    },
    TRANSLATION_SERVICE_URL: {
        default: 'http://localhost:5000',
        type: 'string'
    },
    NODE_ENV: {
        default: 'development',
        type: 'string',
        allowedValues: ['development', 'production', 'test']
    }
};

// Validar variáveis obrigatórias
for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];
    
    if (!value) {
        throw new Error(`Variável de ambiente obrigatória faltando: ${key} - ${config.description}`);
    }
    
    if (config.minLength && value.length < config.minLength) {
        throw new Error(`Variável ${key} muito curta (mínimo ${config.minLength} caracteres)`);
    }
}

// Validar e definir variáveis opcionais
for (const [key, config] of Object.entries(optionalEnvVars)) {
    const value = process.env[key] || config.default;
    
    if (config.type === 'number') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
            throw new Error(`Variável ${key} deve ser um número`);
        }
        if (config.min && numValue < config.min) {
            throw new Error(`Variável ${key} deve ser no mínimo ${config.min}`);
        }
        if (config.max && numValue > config.max) {
            throw new Error(`Variável ${key} deve ser no máximo ${config.max}`);
        }
        process.env[key] = String(numValue);
    }
    
    if (config.allowedValues && !config.allowedValues.includes(value)) {
        throw new Error(`Variável ${key} deve ser um dos valores: ${config.allowedValues.join(', ')}`);
    }
    
    if (!process.env[key]) {
        process.env[key] = String(config.default);
    }
}
```

---

### 10. Implementar Logging Estruturado

**Status Atual:**
```typescript
// ⚠️ AINDA USA console.log:
console.log(`[${new Date().toISOString()}] Busca de filme: "${sanitized}"`);
console.error(`[${new Date().toISOString()}] Erro ao buscar filme:`, error.message);
```

**Instalar:**
```bash
cd backend
npm install winston
```

**Arquivo:** `backend/src/config/logger.ts` (criar)
```typescript
import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'movie-plots-api' },
    transports: [
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log' 
        })
    ]
});

// Em desenvolvimento, também logar no console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export default logger;
```

**Arquivo:** `backend/src/server.ts`

**Modificar:**
```typescript
import logger from './config/logger';

app.listen(PORT)
    .on('error', (error) => {
        logger.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    })
    .on('listening', () => {
        logger.info(`🚀 Server running on port ${PORT}`, {
            port: PORT,
            env: process.env.NODE_ENV
        });
    });
```

---

## 📝 Arquivo .env Atualizado para Produção

**Arquivo:** `backend/.env.example`
```env
# Ambiente
NODE_ENV=production

# API OMDB
API_KEY=sua_chave_api_omdb_aqui
OMDB_BASE_URL=https://www.omdbapi.com

# Serviço de Tradução
TRANSLATION_SERVICE_URL=https://seu-servico-traducao.com

# Servidor
PORT=3000

# CORS
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com

# Logging
LOG_LEVEL=info
```

---

## 🚀 Ordem de Implementação Recomendada

### Prioridade 1 (CRÍTICO - Antes de produção):
1. ❌ Configurar CORS
2. ❌ Implementar Rate Limiting
3. ❌ Adicionar Helmet.js
4. ⚠️ Ocultar informações sensíveis em erros (parcial)
5. ❌ Corrigir URLs e variáveis de ambiente

### Prioridade 2 (ALTO - O mais rápido possível):
6. ❌ Configurar frontend com variáveis de ambiente
7. ❌ Limitar tamanho de payload
8. ❌ Adicionar timeout em fetchTranslation()

### Prioridade 3 (MÉDIO - Melhorias):
9. ⚠️ Melhorar validação de variáveis de ambiente (básica OK)
10. ⚠️ Implementar logging estruturado (tem básico, melhorar)
11. ⚠️ Melhorar sanitização de inputs (básica OK, pode usar validator)

---

## 📊 Resumo do Status Atual

### ✅ Implementado (6 itens):
1. ✅ Validação de Input (básica)
2. ✅ Sanitização de Input (básica)
3. ✅ Logging Básico
4. ✅ Timeout em fetchMovie()
5. ✅ Mensagens de Erro Específicas
6. ✅ Validação de Variáveis de Ambiente (básica)
7. ✅ Health Check Endpoint

### ❌ Falta Implementar (9 itens críticos/altos):
1. ❌ CORS Configurado
2. ❌ Rate Limiting
3. ❌ Helmet.js
4. ❌ Ocultar Informações Sensíveis em Erros (produção)
5. ❌ URLs com Variáveis de Ambiente
6. ❌ Timeout em fetchTranslation()
7. ❌ Frontend com Variáveis de Ambiente
8. ❌ Limite de Tamanho de Payload
9. ❌ Logging Estruturado (Winston)

---

## ✅ Testes de Segurança

Após implementar as correções, teste:

1. **CORS:** Tente fazer requisição de origem não permitida
2. **Rate Limiting:** Faça mais de 10 requisições em 1 minuto
3. **Validação:** Tente enviar caracteres especiais no nome do filme
4. **Erros:** Verifique se mensagens de erro não expõem informações sensíveis
5. **Headers:** Use ferramentas como SecurityHeaders.com para verificar headers

---

## 📚 Próximos Passos (Melhorias Futuras)

- Implementar autenticação JWT
- Adicionar monitoramento (Prometheus/Grafana)
- Configurar HTTPS com certificados SSL
- Implementar cache para reduzir chamadas à API
- Adicionar testes de segurança automatizados
- Configurar CI/CD com verificações de segurança

