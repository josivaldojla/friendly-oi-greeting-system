
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx: Iniciando aplicação");

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Main.tsx: Elemento root encontrado, renderizando App");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Elemento root não encontrado no DOM");
  // Criar elemento root se não existir
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  createRoot(newRoot).render(<App />);
}
