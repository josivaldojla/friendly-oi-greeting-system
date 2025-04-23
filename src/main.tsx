
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Garantir que o elemento root existe antes de renderizar
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Elemento root não encontrado no DOM");
}
