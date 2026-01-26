/**
 * Configuração de variáveis de ambiente
 * Carrega o arquivo .env usando dotenv antes de qualquer outro módulo
 */
import dotenv from 'dotenv';
import path from 'path';

// Carrega o arquivo .env da pasta raiz do backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

