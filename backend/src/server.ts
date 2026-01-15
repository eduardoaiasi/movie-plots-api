/**
 * Arquivo principal do servidor
 * Responsável por inicializar e iniciar o servidor Express na porta configurada
 */

// validação variáveis de ambiente

const requiredEnvVars = ['API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:', missingVars.join(', '));
    console.error('Por favor, configure o arquivo .env');
    process.exit(1);
}

// Carrega as variáveis de ambiente do arquivo .env
import "dotenv/config";
import app from "./app";

// Define a porta do servidor (usa a variável de ambiente PORT ou padrão 3000)
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Inicia o servidor na porta definida
// Configura handlers para eventos de erro e listening
app.listen(PORT)
  .on('error', console.error) // Loga erros no console
  .on('listening', () => {
      console.log(`🚀 Server running on port ${PORT}`);
  });
