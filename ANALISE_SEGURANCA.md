# 🔒 Análise de Segurança - Movie Plots API

## ⚠️ VULNERABILIDADES CRÍTICAS

### 1. **CORS Aberto para Qualquer Origem** 🔴 CRÍTICO
**Localização:** `backend/src/app.ts:19`
```typescript
app.use(cors()); // Permite requisições de QUALQUER origem
```

**Problema:** 
- Permite que qualquer site faça requisições para sua API
- Risco de CSRF (Cross-Site Request Forgery)
- Permite consumo não autorizado da API

**Impacto:** 
- Qualquer site pode consumir sua API
- Possível uso indevido de recursos
- Possível vazamento de dados

**Solução:**
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

---

### 2. **Falta de Rate Limiting** 🔴 CRÍTICO
**Localização:** Todo o backend

**Problema:**
- Sem limite de requisições por IP/usuário
- Vulnerável a ataques DDoS
- Possível abuso da API OMDB (pode resultar em custos)
- Possível sobrecarga do servidor

**Impacto:**
- Servidor pode ser derrubado por requisições excessivas
- Custos elevados com APIs externas
- Experiência ruim para usuários legítimos

**Solução:**
```bash
npm install express-rate-limit
```
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

app.use('/movie', limiter);
```

---

### 3. **Exposição de Informações Sensíveis em Erros** 🟠 ALTO
**Localização:** `backend/src/controllers/MovieController.ts:89`

**Problema:**
```typescript
return res.status(500).json({ message: error.message });
```
- Mensagens de erro expõem detalhes internos
- Pode revelar estrutura do sistema
- Pode expor chaves de API em mensagens de erro

**Impacto:**
- Atacantes podem obter informações sobre a infraestrutura
- Facilita ataques direcionados

**Solução:**
```typescript
// Em produção, não exponha mensagens de erro detalhadas
if (process.env.NODE_ENV === 'production') {
  return res.status(500).json({ 
    message: 'Erro interno do servidor' 
  });
}
return res.status(500).json({ message: error.message });
```

---

### 4. **Falta de Validação e Sanitização de Input** 🟠 ALTO
**Localização:** `backend/src/controllers/MovieController.ts:40`

**Problema:**
```typescript
const movieName = req.query.movie;
// Sem validação ou sanitização
```
- Input do usuário é usado diretamente na URL
- Vulnerável a injection attacks
- Possível SSRF (Server-Side Request Forgery) através do parâmetro

**Impacto:**
- Possível manipulação de requisições externas
- Possível acesso a recursos internos
- Possível bypass de validações

**Solução:**
```typescript
import validator from 'validator';

if (!movieName || typeof movieName !== 'string') {
  return res.status(400).json({ message: "Movie é obrigatório" });
}

// Sanitizar e validar
const sanitizedMovieName = validator.escape(movieName.trim());
if (sanitizedMovieName.length > 100 || sanitizedMovieName.length < 1) {
  return res.status(400).json({ message: "Nome do filme inválido" });
}
```

---

### 5. **URL Hardcoded com HTTP (não HTTPS)** 🟠 ALTO
**Localização:** `backend/src/utils/apiConnect.ts:19, 92`

**Problema:**
```typescript
const URL = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${movieName}&plot=full`;
const URL = `http://localhost:5000/translate`;
```
- HTTP não criptografado (dados podem ser interceptados)
- Chave de API trafega em texto plano
- Serviço de tradução hardcoded para localhost

**Impacto:**
- Chave de API pode ser interceptada
- Dados podem ser modificados em trânsito
- Não funciona em produção (localhost não acessível)

**Solução:**
```typescript
const OMDB_URL = process.env.OMDB_BASE_URL || 'https://www.omdbapi.com';
const TRANSLATION_URL = process.env.TRANSLATION_SERVICE_URL || 'http://localhost:5000';
```

---

### 6. **Falta de Headers de Segurança HTTP** 🟠 ALTO
**Localização:** `backend/src/app.ts`

**Problema:**
- Sem helmet.js para configurar headers de segurança
- Sem proteção contra XSS, clickjacking, etc.

**Impacto:**
- Vulnerável a vários tipos de ataques web
- Não segue boas práticas de segurança

**Solução:**
```bash
npm install helmet
```
```typescript
import helmet from 'helmet';
app.use(helmet());
```

---

### 7. **Logging de Erros Expõe Informações** 🟡 MÉDIO
**Localização:** `backend/src/server.ts:26`

**Problema:**
```typescript
.on('error', console.error) // Loga erros no console
```
- Erros são logados no console sem sanitização
- Em produção, logs podem conter informações sensíveis
- Sem sistema de logging estruturado

**Impacto:**
- Informações sensíveis podem aparecer em logs
- Dificulta auditoria e debugging

**Solução:**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}
```

---

### 8. **Falta de Timeout em Requisições de Tradução** 🟡 MÉDIO
**Localização:** `backend/src/utils/apiConnect.ts:87-113`

**Problema:**
- Requisição de tradução não tem timeout configurado
- Pode causar travamento se o serviço estiver lento

**Impacto:**
- Requisições podem ficar pendentes indefinidamente
- Consumo excessivo de recursos

**Solução:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

const res = await fetch(URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... }),
  signal: controller.signal
});
```

---

### 9. **Validação de Variáveis de Ambiente Incompleta** 🟡 MÉDIO
**Localização:** `backend/src/server.ts:11`

**Problema:**
```typescript
const requiredEnvVars = ['API_KEY', 'BASE_URL'];
```
- Valida apenas existência, não formato
- BASE_URL não é usado no código (variável órfã)
- Não valida se valores são válidos

**Solução:**
```typescript
const requiredEnvVars = {
  API_KEY: { required: true, minLength: 10 },
  PORT: { required: false, default: 3000, type: 'number' }
};

// Validar formato e valores
```

---

### 10. **Frontend com URL Hardcoded** 🟡 MÉDIO
**Localização:** `frontend/src/services/api.ts:9`

**Problema:**
```typescript
const BASE_URL = "http://localhost:3000";
```
- URL hardcoded não funciona em produção
- Sem variáveis de ambiente no frontend

**Solução:**
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

### 11. **Falta de Autenticação/Autorização** 🟡 MÉDIO
**Localização:** Todo o backend

**Problema:**
- API completamente pública
- Sem controle de acesso
- Sem autenticação de usuários

**Impacto:**
- Qualquer pessoa pode usar a API
- Sem rastreamento de uso
- Possível abuso

**Solução:**
- Implementar JWT ou API keys
- Adicionar middleware de autenticação

---

### 12. **Falta de Validação de Tamanho de Payload** 🟡 MÉDIO
**Localização:** `backend/src/app.ts:23`

**Problema:**
```typescript
app.use(express.json());
```
- Sem limite de tamanho do body
- Vulnerável a ataques de negação de serviço

**Solução:**
```typescript
app.use(express.json({ limit: '10mb' }));
```

---

### 13. **Dependências Desatualizadas ou Vulneráveis** 🟡 MÉDIO
**Localização:** `backend/package.json`, `frontend/package.json`

**Problema:**
- Não há verificação de vulnerabilidades conhecidas
- Dependências podem ter CVEs

**Solução:**
```bash
npm audit
npm audit fix
# Ou usar dependabot/snyk para monitoramento contínuo
```

---

### 14. **Falta de HTTPS/SSL em Produção** 🔴 CRÍTICO
**Problema:**
- Aplicação não está configurada para HTTPS
- Dados trafegam em texto plano

**Solução:**
- Usar reverse proxy (nginx, traefik)
- Configurar certificados SSL/TLS
- Forçar HTTPS com redirects

---

### 15. **Falta de Monitoramento e Alertas** 🟡 MÉDIO
**Problema:**
- Sem sistema de monitoramento
- Sem alertas para anomalias
- Sem métricas de performance

**Solução:**
- Implementar Prometheus/Grafana
- Configurar alertas para erros
- Monitorar uso de recursos

---

## 📋 RESUMO DE PRIORIDADES

### 🔴 CRÍTICO (Corrigir ANTES de produção):
1. Configurar CORS adequadamente
2. Implementar Rate Limiting
3. Configurar HTTPS/SSL
4. Validar e sanitizar inputs

### 🟠 ALTO (Corrigir o mais rápido possível):
5. Ocultar informações sensíveis em erros
6. Usar HTTPS para APIs externas
7. Adicionar headers de segurança (helmet)
8. Configurar variáveis de ambiente no frontend

### 🟡 MÉDIO (Melhorias importantes):
9. Implementar logging estruturado
10. Adicionar timeouts em todas as requisições
11. Validar variáveis de ambiente
12. Implementar autenticação (se necessário)
13. Limitar tamanho de payloads
14. Auditar dependências regularmente
15. Implementar monitoramento

---

## 🛠️ CHECKLIST PRÉ-PRODUÇÃO

- [ ] CORS configurado para domínios específicos
- [ ] Rate limiting implementado
- [ ] Helmet.js configurado
- [ ] Validação e sanitização de inputs
- [ ] HTTPS configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Logging estruturado implementado
- [ ] Timeouts em todas as requisições externas
- [ ] Headers de segurança configurados
- [ ] Dependências auditadas e atualizadas
- [ ] Monitoramento e alertas configurados
- [ ] Testes de segurança realizados
- [ ] Documentação de segurança atualizada

---

## 📚 RECURSOS ADICIONAIS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

