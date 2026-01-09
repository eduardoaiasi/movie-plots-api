/**
 * Ponto de entrada da aplicação React
 * Responsável por renderizar o componente raiz da aplicação no DOM
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Obtém o elemento root do HTML e renderiza a aplicação React
// StrictMode ajuda a identificar problemas potenciais durante o desenvolvimento
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
