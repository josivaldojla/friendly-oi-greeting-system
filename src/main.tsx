
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx: Iniciando aplicação - versão atualizada");

try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    console.log("Main.tsx: Elemento root encontrado, renderizando App");
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("Main.tsx: App renderizado com sucesso");
  } else {
    console.error("Main.tsx: Elemento root não encontrado no DOM");
    // Criar elemento root se não existir
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    const root = createRoot(newRoot);
    root.render(<App />);
    console.log("Main.tsx: Elemento root criado e App renderizado");
  }
} catch (error) {
  console.error("Main.tsx: Erro ao renderizar aplicação:", error);
}
